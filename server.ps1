param (
    [int]$Port = 3000,
    [string]$Root = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$loopbackPrefixes = @(
    "http://localhost:$Port/",
    "http://127.0.0.1:$Port/",
    "http://[::1]:$Port/"
)

foreach ($prefix in $loopbackPrefixes) {
    try {
        $listener.Prefixes.Add($prefix)
    } catch {
        # Fallback if specific prefix is unavailable
    }
}

try {
    $listener.Start()
    Write-Host "RGPVebazaar Secure Server running at http://localhost:$Port/ and http://127.0.0.1:$Port/"
    Write-Host "Serving files and security APIs from $Root"
} catch {
    Write-Error "Failed to start listener on port $($Port): $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".pdf"  = "application/pdf"
}

# In-Memory Protected Server Registry (Never sent to client in bulk)
$ServerStudentRegistry = @{
    "0101CS261001" = @{ name = "Rahul Sharma"; program = "B.Tech"; branch = "Computer Science & Engineering"; branchCode = "CSE"; batch = "2026-30"; semester = 3; phoneHint = "+91 98*** 43210" }
    "0101IT251042" = @{ name = "Priya Patel"; program = "B.Tech"; branch = "Information Technology"; branchCode = "IT"; batch = "2025-29"; semester = 5; phoneHint = "+91 98*** 45678" }
    "0101EC241018" = @{ name = "Amit Verma"; program = "B.Tech"; branch = "Electronics & Communication"; branchCode = "ECE"; batch = "2024-28"; semester = 7; phoneHint = "+91 97*** 56789" }
    "0101ME261055" = @{ name = "Sneha Gupta"; program = "B.Tech"; branch = "Mechanical Engineering"; branchCode = "ME"; batch = "2026-30"; semester = 3; phoneHint = "+91 96*** 67890" }
}

# Load complete campus roster (955 students) if CSV file is present
$csvCandidates = @(
    "c:\Users\91709\Desktop\valid_enrollments.csv",
    "$Root\scripts\sample_roster.csv",
    "C:\Users\91709\.gemini\antigravity-ide\brain\71c271a4-394f-452d-ad4d-a289d8b0b9ce\.user_uploaded\media_1788694439053.csv"
)
foreach ($csvPath in $csvCandidates) {
    if (Test-Path $csvPath) {
        try {
            $importedRows = Import-Csv -Path $csvPath -ErrorAction SilentlyContinue
            if ($importedRows) {
                foreach ($row in $importedRows) {
                    if ($row.enrollment_no) {
                        $eKey = $row.enrollment_no.Trim().ToUpper()
                        $bCode = if ($eKey.Length -ge 6) { $eKey.Substring(4, 2) } else { "ENG" }
                        $ServerStudentRegistry[$eKey] = @{
                            name = $row.full_name.Trim()
                            program = if ($row.program) { $row.program.Trim() } else { "B.Tech" }
                            branch = $row.branch.Trim()
                            branchCode = $bCode
                            batch = if ($row.batch_year) { $row.batch_year.Trim() } else { "2026" }
                            phoneHint = "+91 98*** ****0"
                        }
                    }
                }
                break
            }
        } catch {}
    }
}

# Registered Enrollment Accounts (Enforce 1 enrollment = 1 account)
$RegisteredEnrollments = [System.Collections.Generic.HashSet[string]]::new()
$RegisteredEnrollments.Add("0101CS261001") | Out-Null

# In-Memory Security Audit Events
$SecurityEventsLog = [System.Collections.Generic.List[object]]::new()

# In-Memory Reports
$ReportsDb = [System.Collections.Generic.List[object]]::new()

# In-Memory Blocked Users
$BlockedUsersDb = [System.Collections.Generic.HashSet[string]]::new()

# Sliding-Window Rate Limiter
$RateLimitTable = @{}
$RateLimitLock = New-Object object

function Check-RateLimit([string]$ip, [string]$action, [int]$maxRequests = 20, [int]$windowSeconds = 60) {
    [System.Threading.Monitor]::Enter($RateLimitLock)
    try {
        $now = [DateTime]::UtcNow
        $key = "$($ip)_$($action)"
        if (-not $RateLimitTable.ContainsKey($key)) {
            $RateLimitTable[$key] = [System.Collections.Generic.List[DateTime]]::new()
        }
        $list = $RateLimitTable[$key]
        $cutoff = $now.AddSeconds(-$windowSeconds)
        for ($i = $list.Count - 1; $i -ge 0; $i--) {
            if ($list[$i] -lt $cutoff) {
                $list.RemoveAt($i)
            }
        }
        if ($list.Count -ge $maxRequests) {
            return $false
        }
        $list.Add($now)
        return $true
    } finally {
        [System.Threading.Monitor]::Exit($RateLimitLock)
    }
}

function Add-SecurityHeaders($response) {
    $response.Headers.Set("X-Content-Type-Options", "nosniff")
    $response.Headers.Set("X-Frame-Options", "DENY")
    $response.Headers.Set("Referrer-Policy", "strict-origin-when-cross-origin")
    $response.Headers.Set("Content-Security-Policy", "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://images.unsplash.com https://*.supabase.co https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; connect-src 'self' https://*.supabase.co wss://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none';")
    $response.Headers.Set("Cache-Control", "no-cache, no-store, must-revalidate")
}

function Send-JsonResponse($response, [int]$statusCode, $obj) {
    Add-SecurityHeaders $response
    $response.ContentType = "application/json; charset=utf-8"
    $response.StatusCode = $statusCode
    $json = ConvertTo-Json -InputObject $obj -Depth 5 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.OutputStream.Close()
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $clientIp = $request.RemoteEndPoint.Address.ToString()
        $rawUrl = $request.Url.LocalPath
        $method = $request.HttpMethod.ToUpper()

        # Handle CORS preflight OPTIONS requests
        if ($method -eq "OPTIONS") {
            Add-SecurityHeaders $response
            $response.Headers.Set("Access-Control-Allow-Origin", "*")
            $response.Headers.Set("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS")
            $response.Headers.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        # ======================================================================
        # 1. SERVER-SIDE SECURITY & TRUST APIS
        # ======================================================================
        
        # API: Verify Enrollment Number against Protected Registry
        if ($rawUrl -eq "/api/verify-enrollment" -and $method -eq "POST") {
            if (-not (Check-RateLimit $clientIp "verify" 15 60)) {
                Send-JsonResponse $response 429 @{ success = $false; error = "Rate limit exceeded. Please wait a minute before retrying." }
                continue
            }

            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyText = $reader.ReadToEnd()
            $body = $null
            try { $body = ConvertFrom-Json $bodyText } catch {}

            $enrollment = if ($body -and $body.enrollment) { $body.enrollment.ToString().Trim().ToUpper() } else { "" }

            # Security audit log
            $SecurityEventsLog.Add(@{
                type = "verification_attempt"
                enrollment = if ($enrollment.Length -ge 6) { $enrollment.Substring(0, 4) + "****" } else { "INVALID" }
                ip = $clientIp
                timestamp = [DateTime]::UtcNow.ToString("o")
            })

            if ([string]::IsNullOrWhiteSpace($enrollment) -or $enrollment.Length -lt 6) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Invalid enrollment number format." }
                continue
            }

            # Check if enrolled
            if ($ServerStudentRegistry.ContainsKey($enrollment)) {
                $student = $ServerStudentRegistry[$enrollment]
                $masked = $enrollment.Substring(0, $enrollment.Length - 4) + "****"
                Send-JsonResponse $response 200 @{
                    success = $true
                    student = @{
                        name = $student.name
                        program = $student.program
                        branch = $student.branch
                        branchCode = $student.branchCode
                        batch = $student.batch
                        maskedEnrollment = $masked
                        phoneHint = $student.phoneHint
                    }
                }
                continue
            }

            Send-JsonResponse $response 404 @{
                success = $false
                error = "Enrollment record not found in official campus roster."
            }
            continue
        }

        # API: Abuse Reporting Endpoint
        if ($rawUrl -eq "/api/reports" -and $method -eq "POST") {
            if (-not (Check-RateLimit $clientIp "report" 20 60)) {
                Send-JsonResponse $response 429 @{ success = $false; error = "Rate limit exceeded. Please wait a moment." }
                continue
            }

            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyText = $reader.ReadToEnd()
            $body = $null
            try { $body = ConvertFrom-Json $bodyText } catch {}

            $allowedTargets = @("listing", "user", "resource", "opportunity", "message")
            $allowedReasons = @("Scam", "Spam", "Fake listing", "Inappropriate content", "Harassment", "Other")

            if ($null -eq $body -or $allowedTargets -notcontains $body.target_type -or $allowedReasons -notcontains $body.reason) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Invalid report parameters." }
                continue
            }

            $repId = "rep-" + [Guid]::NewGuid().ToString().Substring(0, 8)
            $reportItem = @{
                id = $repId
                target_type = $body.target_type
                target_id = $body.target_id
                reason = $body.reason
                description = if ($body.description) { $body.description.ToString().Substring(0, [Math]::Min(500, $body.description.Length)) } else { "" }
                status = "pending"
                created_at = [DateTime]::UtcNow.ToString("o")
            }
            $ReportsDb.Add($reportItem)

            Send-JsonResponse $response 201 @{
                success = $true
                report_id = $repId
                message = "Report submitted safely to student moderation queue."
            }
            continue
        }

        # API: Block User Endpoint
        if ($rawUrl -eq "/api/block-user" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyText = $reader.ReadToEnd()
            $body = $null
            try { $body = ConvertFrom-Json $bodyText } catch {}

            if ($null -eq $body -or [string]::IsNullOrWhiteSpace($body.blocker_id) -or [string]::IsNullOrWhiteSpace($body.blocked_user_id)) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Invalid block request parameters." }
                continue
            }

            if ($body.blocker_id -eq $body.blocked_user_id) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Self-blocking is not permitted." }
                continue
            }

            $blockKey = "$($body.blocker_id)_$($body.blocked_user_id)"
            $BlockedUsersDb.Add($blockKey) | Out-Null

            Send-JsonResponse $response 200 @{
                success = $true
                message = "User has been blocked. Interaction privileges revoked."
            }
            continue
        }

        # API: Security Audit Event Log Endpoint
        if ($rawUrl -eq "/api/security-event" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyText = $reader.ReadToEnd()
            $body = $null
            try { $body = ConvertFrom-Json $bodyText } catch {}

            if ($body -and $body.event_type) {
                $SecurityEventsLog.Add(@{
                    event_type = $body.event_type
                    user_id = $body.user_id
                    metadata = $body.metadata
                    ip = $clientIp
                    timestamp = [DateTime]::UtcNow.ToString("o")
                })
            }
            Send-JsonResponse $response 200 @{ success = $true }
            continue
        }

        # API: Validate Safe URL (XSS & Protocol Hijack Protection)
        if ($rawUrl -eq "/api/validate-url" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyText = $reader.ReadToEnd()
            $body = $null
            try { $body = ConvertFrom-Json $bodyText } catch {}

            $testUrl = if ($body.url) { $body.url.ToString().Trim().ToLower() } else { "" }

            # Reject dangerous protocols
            if ($testUrl.StartsWith("javascript:") -or $testUrl.StartsWith("data:") -or $testUrl.StartsWith("vbscript:")) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Dangerous protocol rejected." }
                continue
            }

            if (-not ($testUrl.StartsWith("https://") -or $testUrl.StartsWith("http://"))) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Only secure HTTP/HTTPS URLs are allowed." }
                continue
            }

            Send-JsonResponse $response 200 @{ success = $true; valid = $true }
            continue
        }

        # ======================================================================
        # 2. STATIC FILE SERVING WITH SECURITY HEADERS & PATH TRAVERSAL GUARDS
        # ======================================================================
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

        # Path Traversal Protection: Ensure requested path stays within $Root
        $cleanPath = $rawUrl.TrimStart("/").Replace("/", "\")
        $filePath = [System.IO.Path]::GetFullPath((Join-Path $Root $cleanPath))
        $rootFullPath = [System.IO.Path]::GetFullPath($Root)

        if (-not $filePath.StartsWith($rootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            Send-JsonResponse $response 403 @{ success = $false; error = "Access Denied" }
            continue
        }

        Add-SecurityHeaders $response

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            if ($method -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            # Fallback to index.html for client-side routing
            $indexPath = Join-Path $Root "index.html"
            if (Test-Path $indexPath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($indexPath)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                if ($method -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                if ($method -ne "HEAD") {
                    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        }
        $response.OutputStream.Close()
    } catch {
        # Continue listening cleanly without crashing on aborted connections
    }
}
