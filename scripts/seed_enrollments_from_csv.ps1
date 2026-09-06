param (
    [string]$CsvPath = "scripts/roster.csv",
    [string]$SupabaseUrl = "https://jjcmiubasrvubfrkystv.supabase.co",
    [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " RGPV UNOFFICIAL - CSV Enrollment Roster Ingestion Tool " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

if (-not (Test-Path $CsvPath)) {
    if (Test-Path "roster.csv") { $CsvPath = "roster.csv" }
    elseif (Test-Path "sample_roster.csv") { $CsvPath = "sample_roster.csv" }
    elseif (Test-Path "scripts/sample_roster.csv") { $CsvPath = "scripts/sample_roster.csv" }
    else {
        Write-Error ("CSV file not found at: " + $CsvPath)
        Write-Host "Usage: .\seed_enrollments_from_csv.ps1 -CsvPath 'path\to\your_roster.csv'"
        exit 1
    }
}

$rows = Import-Csv -Path $CsvPath
if ($rows.Count -eq 0) {
    Write-Warning "CSV is empty."
    exit 0
}

Write-Host ("Loaded " + $rows.Count + " student enrollment records from " + $CsvPath) -ForegroundColor Green

# Prepare payload for Supabase REST API
$records = @()
foreach ($row in $rows) {
    $enroll = ($row.enrollment_no -replace '\s+', '').ToUpper()
    $name = $row.full_name.Trim()
    $branch = $row.branch.Trim()
    $batch = if ($row.batch) { $row.batch.Trim() } elseif ($row.batch_year) { $row.batch_year.Trim() } else { "2026" }

    if ($enroll -and $name) {
        $records += @{
            enrollment_no = $enroll
            full_name = $name
            branch = $branch
            batch = $batch
        }
    }
}

# If no ServiceRoleKey provided, prompt or use Anon Key with check
$apiKey = if ($ServiceRoleKey) { $ServiceRoleKey } else { "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY21pdWJhc3J2dWJmcmt5c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTE2MDUsImV4cCI6MjEwNDI2NzYwNX0.-c1fu54MGqlvgSInqdfBDRaYS824SqZ07_oeTPfZooY" }

$headers = @{
    "apikey" = $apiKey
    "Authorization" = ("Bearer " + $apiKey)
    "Content-Type" = "application/json"
    "Prefer" = "resolution=merge-duplicates"
}

# Batch into chunks of 100
$batchSize = 100
$totalBatches = [Math]::Ceiling($records.Count / $batchSize)

for ($i = 0; $i -lt $totalBatches; $i++) {
    $start = $i * $batchSize
    $count = [Math]::Min($batchSize, $records.Count - $start)
    $slice = $records[$start..($start + $count - 1)]

    $json = ConvertTo-Json -InputObject $slice -Depth 4 -Compress
    $url = $SupabaseUrl + "/rest/v1/valid_enrollments"
    $bNum = $i + 1

    try {
        $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $json -UseBasicParsing
        Write-Host (" [OK] Uploaded batch " + $bNum + " of " + $totalBatches + " (" + $count + " records)") -ForegroundColor Green
    } catch {
        Write-Warning ("Batch " + $bNum + " REST notice: " + $_.Exception.Message)
        Write-Host "Tip: Direct SQL seed is also ready in supabase/seed_roster.sql and scripts/convert_csv_to_sql.ps1" -ForegroundColor Yellow
        break
    }
}

Write-Host ""
Write-Host "Roster processing completed." -ForegroundColor Cyan
