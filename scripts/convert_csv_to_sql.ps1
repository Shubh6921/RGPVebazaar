param (
    [string]$CsvPath = "",
    [string]$OutputPath = "supabase/seed_roster.sql"
)

if (-not $CsvPath -or -not (Test-Path $CsvPath)) {
    Write-Host "Please provide the path to the roster CSV file." -ForegroundColor Yellow
    Write-Host "Usage: .\convert_csv_to_sql.ps1 -CsvPath 'path\to\roster.csv'" -ForegroundColor Cyan
    exit 1
}

$rows = Import-Csv -Path $CsvPath
$values = [System.Collections.Generic.List[string]]::new()

foreach ($r in $rows) {
    $e = ($r.enrollment_no -replace "'", "''").Trim().ToUpper()
    $n = ($r.full_name -replace "'", "''").Trim()
    $b = ($r.branch -replace "'", "''").Trim()
    $batch = if ($r.batch) { $r.batch.Trim() } elseif ($r.batch_year) { $r.batch_year.Trim() } else { "2026" }
    $batch = $batch -replace "'", "''"
    
    if ($e -and $n) {
        $values.Add("('$e', '$n', '$b', '$batch')")
    }
}

$joined = [string]::Join(",`n", $values)
$sql = "INSERT INTO public.valid_enrollments (enrollment_no, full_name, branch, batch) VALUES`n" + $joined + "`nON CONFLICT (enrollment_no) DO UPDATE SET full_name = EXCLUDED.full_name, branch = EXCLUDED.branch, batch = EXCLUDED.batch;"

[System.IO.File]::WriteAllText($OutputPath, $sql, [System.Text.Encoding]::UTF8)
Write-Host "Successfully generated $OutputPath with $($values.Count) student records." -ForegroundColor Green
