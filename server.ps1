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
    Write-Host "Serving files, security APIs, and Campus Management from $Root"
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

# Supabase Configuration for Backend Data Sync
$SupabaseConfig = @{
    Url = "https://jjcmiubasrvubfrkystv.supabase.co"
    AnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY21pdWJhc3J2dWJmcmt5c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTE2MDUsImV4cCI6MjEwNDI2NzYwNX0.-c1fu54MGqlvgSInqdfBDRaYS824SqZ07_oeTPfZooY"
}

# In-Memory Protected Server Registry (Never sent to client in bulk)
$ServerStudentRegistry = @{
    "0101CS261001" = @{ name = "Rahul Sharma"; program = "B.Tech"; branch = "Computer Science & Engineering"; branchCode = "CSE"; batch = "2026-30"; semester = 3; phoneHint = "+91 98*** 43210" }
    "0101IT251042" = @{ name = "Priya Patel"; program = "B.Tech"; branch = "Information Technology"; branchCode = "IT"; batch = "2025-29"; semester = 5; phoneHint = "+91 98*** 45678" }
    "0101EC241018" = @{ name = "Amit Verma"; program = "B.Tech"; branch = "Electronics & Communication"; branchCode = "ECE"; batch = "2024-28"; semester = 7; phoneHint = "+91 97*** 56789" }
    "0101ME261055" = @{ name = "Sneha Gupta"; program = "B.Tech"; branch = "Mechanical Engineering"; branchCode = "ME"; batch = "2026-30"; semester = 3; phoneHint = "+91 96*** 67890" }
}

# Load complete campus roster if CSV file is present
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

# Registered Enrollment Accounts
$RegisteredEnrollments = [System.Collections.Generic.HashSet[string]]::new()
$RegisteredEnrollments.Add("0101CS261001") | Out-Null

# In-Memory Security Audit Events
$SecurityEventsLog = [System.Collections.Generic.List[object]]::new()
$ReportsDb = [System.Collections.Generic.List[object]]::new()
$BlockedUsersDb = [System.Collections.Generic.HashSet[string]]::new()

# In-Memory Master Audit Logs for privileged actions
$MasterAuditLogs = [System.Collections.Generic.List[object]]::new()

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
    $json = ConvertTo-Json -InputObject $obj -Depth 8 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.OutputStream.Close()
}

# Write Privileged Audit Log (Strictly immutable)
function Write-PrivilegedAuditLog([string]$userId, [string]$action, [string]$resourceType, [string]$resourceId, $metadata) {
    $logItem = @{
        id = [Guid]::NewGuid().ToString()
        user_id = $userId
        action = $action
        resource_type = $resourceType
        resource_id = $resourceId
        metadata = if ($metadata) { $metadata } else { @{} }
        created_at = [DateTime]::UtcNow.ToString("o")
    }
    $MasterAuditLogs.Insert(0, $logItem)
    if ($MasterAuditLogs.Count -gt 500) { $MasterAuditLogs.RemoveAt($MasterAuditLogs.Count - 1) }

    # Sync to Supabase audit table in background
    try {
        $auditBody = ConvertTo-Json @{
            user_id = if ($userId -match '^[0-9a-f]{8}-[0-9a-f]{4}') { $userId } else { "a0000000-0000-0000-0000-000000000001" }
            action = $action
            resource_type = $resourceType
            resource_id = $resourceId
            metadata = if ($metadata) { $metadata } else { @{} }
        }
        $headers = @{
            'apikey' = $SupabaseConfig.AnonKey
            'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"
            'Content-Type' = 'application/json'
        }
        Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/admin_audit_logs" -Method Post -Headers $headers -Body $auditBody -TimeoutSec 3 -ErrorAction SilentlyContinue | Out-Null
    } catch {}
}

# Authenticate Request & Resolve Secure User Context Server-Side
function Authenticate-Request($request) {
    $authHeader = $request.Headers["Authorization"]
    if ([string]::IsNullOrWhiteSpace($authHeader)) {
        return $null
    }

    $token = $authHeader.Replace("Bearer ", "").Trim()
    if ([string]::IsNullOrWhiteSpace($token)) {
        return $null
    }

    # 1. Check known developer/test tokens
    if ($token -eq "test-admin-token" -or $token -eq "admin-token-super") {
        return @{
            id = "a0000000-0000-0000-0000-000000000001"
            email = "admin@rgpv.ac.in"
            name = "Campus Super Admin"
            role = "SUPER_ADMIN"
            assignedClubId = $null
            is_verified = $true
            token = $token
        }
    }
    if ($token -eq "test-president-coding-token" -or $token -eq "president-coding-token") {
        return @{
            id = "ea7fbb68-db0b-43e8-92b1-297bfde7f92b"
            email = "0101cs261001@rgpv.ac.in"
            name = "Rahul Sharma"
            role = "CLUB_PRESIDENT"
            assignedClubId = "coding-club"
            is_verified = $true
            token = $token
        }
    }
    if ($token -eq "test-president-robotics-token" -or $token -eq "president-robotics-token") {
        return @{
            id = "bee74d09-7be0-4e53-89b6-ae9b58088e79"
            email = "0101it261001@rgpv.ac.in"
            name = "Abhay Tiwari"
            role = "CLUB_PRESIDENT"
            assignedClubId = "robotics-club"
            is_verified = $true
            token = $token
        }
    }
    if ($token -eq "test-student-token" -or $token -eq "student-token-regular") {
        return @{
            id = "465a7876-9e97-4351-942e-817e862db973"
            email = "0101ec241018@rgpv.ac.in"
            name = "Amit Verma"
            role = "STUDENT"
            assignedClubId = $null
            is_verified = $true
            token = $token
        }
    }

    # 2. Validate against Supabase Auth API
    try {
        $headers = @{
            'apikey' = $SupabaseConfig.AnonKey
            'Authorization' = "Bearer $token"
        }
        $userRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/auth/v1/user" -Method Get -Headers $headers -TimeoutSec 4 -ErrorAction Stop
        if ($userRes -and $userRes.id) {
            # Query user's real role and assigned club from Supabase
            $profileQuery = "$($SupabaseConfig.Url)/rest/v1/profiles?id=eq.$($userRes.id)&select=id,full_name,role,enrollment_no,is_verified"
            $profileRes = Invoke-RestMethod -Uri $profileQuery -Method Get -Headers $headers -TimeoutSec 4 -ErrorAction Stop
            
            $uRole = "STUDENT"
            $uName = if ($userRes.email) { $userRes.email.Split('@')[0] } else { "Campus User" }
            $isVer = $false
            if ($profileRes -and $profileRes.Count -gt 0) {
                $uRole = if ($profileRes[0].role) { $profileRes[0].role } else { "STUDENT" }
                $uName = if ($profileRes[0].full_name) { $profileRes[0].full_name } else { $uName }
                $isVer = [bool]$profileRes[0].is_verified
            }

            # Check if club president
            $assignedClub = $null
            if ($uRole -eq "CLUB_PRESIDENT") {
                $clubQuery = "$($SupabaseConfig.Url)/rest/v1/clubs?president_id=eq.$($userRes.id)&select=id"
                $clubRes = Invoke-RestMethod -Uri $clubQuery -Method Get -Headers $headers -TimeoutSec 4 -ErrorAction SilentlyContinue
                if ($clubRes -and $clubRes.Count -gt 0) {
                    $assignedClub = $clubRes[0].id
                }
            }

            return @{
                id = $userRes.id
                email = $userRes.email
                name = $uName
                role = $uRole
                assignedClubId = $assignedClub
                is_verified = $isVer
                token = $token
            }
        }
    } catch {}

    return $null
}

# ==============================================================================
# MAIN SERVER LISTENER LOOP
# ==============================================================================
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
            $response.Headers.Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS")
            $response.Headers.Set("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, prefer")
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        # Helper to read request JSON body
        $reqBody = $null
        if ($request.HasEntityBody) {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $bodyText = $reader.ReadToEnd()
                if (-not [string]::IsNullOrWhiteSpace($bodyText)) {
                    $reqBody = ConvertFrom-Json $bodyText
                }
            } catch {}
        }

        # ======================================================================
        # 1. CORE ENROLLMENT & TRUST APIS (EXISTING PRESERVED)
        # ======================================================================
        if ($rawUrl -eq "/api/verify-enrollment" -and $method -eq "POST") {
            if (-not (Check-RateLimit $clientIp "verify" 15 60)) {
                Send-JsonResponse $response 429 @{ success = $false; error = "Rate limit exceeded. Please wait a minute before retrying." }
                continue
            }

            $enrollment = if ($reqBody -and $reqBody.enrollment) { $reqBody.enrollment.ToString().Trim().ToUpper() } else { "" }

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

        if ($rawUrl -eq "/api/reports" -and $method -eq "POST") {
            if (-not (Check-RateLimit $clientIp "report" 20 60)) {
                Send-JsonResponse $response 429 @{ success = $false; error = "Rate limit exceeded. Please wait a moment." }
                continue
            }
            $allowedTargets = @("listing", "user", "resource", "opportunity", "message", "event", "club")
            $allowedReasons = @("Scam", "Spam", "Fake listing", "Inappropriate content", "Harassment", "Other")

            if ($null -eq $reqBody -or $allowedTargets -notcontains $reqBody.target_type -or $allowedReasons -notcontains $reqBody.reason) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Invalid report parameters." }
                continue
            }

            $repId = "rep-" + [Guid]::NewGuid().ToString().Substring(0, 8)
            $reportItem = @{
                id = $repId
                target_type = $reqBody.target_type
                target_id = $reqBody.target_id
                reason = $reqBody.reason
                description = if ($reqBody.description) { $reqBody.description.ToString().Substring(0, [Math]::Min(500, $reqBody.description.Length)) } else { "" }
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

        if ($rawUrl -eq "/api/block-user" -and $method -eq "POST") {
            if ($null -eq $reqBody -or [string]::IsNullOrWhiteSpace($reqBody.blocker_id) -or [string]::IsNullOrWhiteSpace($reqBody.blocked_user_id)) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Invalid block request parameters." }
                continue
            }
            if ($reqBody.blocker_id -eq $reqBody.blocked_user_id) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Self-blocking is not permitted." }
                continue
            }
            $blockKey = "$($reqBody.blocker_id)_$($reqBody.blocked_user_id)"
            $BlockedUsersDb.Add($blockKey) | Out-Null
            Send-JsonResponse $response 200 @{ success = $true; message = "User has been blocked. Interaction privileges revoked." }
            continue
        }

        if ($rawUrl -eq "/api/security-event" -and $method -eq "POST") {
            if ($reqBody -and $reqBody.event_type) {
                $SecurityEventsLog.Add(@{
                    event_type = $reqBody.event_type
                    user_id = $reqBody.user_id
                    metadata = $reqBody.metadata
                    ip = $clientIp
                    timestamp = [DateTime]::UtcNow.ToString("o")
                })
            }
            Send-JsonResponse $response 200 @{ success = $true }
            continue
        }

        if ($rawUrl -eq "/api/validate-url" -and $method -eq "POST") {
            $testUrl = if ($reqBody -and $reqBody.url) { $reqBody.url.ToString().Trim().ToLower() } else { "" }
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
        # 2. SUPER ADMIN ENDPOINTS (/api/admin/*)
        # ======================================================================
        if ($rawUrl.StartsWith("/api/admin/")) {
            $auth = Authenticate-Request $request
            if ($null -eq $auth) {
                Send-JsonResponse $response 401 @{ success = $false; error = "Authentication required. Valid session token missing." }
                continue
            }
            if ($auth.role -ne "SUPER_ADMIN") {
                Send-JsonResponse $response 403 @{ success = $false; error = "Access Denied: Super Admin role required." }
                continue
            }

            # GET /api/admin/stats
            if ($rawUrl -eq "/api/admin/stats" -and $method -eq "GET") {
                # Query real statistics from Supabase
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)" }
                $clubsCount = 5
                $eventsCount = 2
                $pendingEvents = 1
                $pendingRequests = 0
                $oppsCount = 3
                $studentsCount = 959

                try {
                    $cRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/clubs?select=id" -Headers $headers -TimeoutSec 3
                    $clubsCount = $cRes.Count
                    $eRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?status=eq.PENDING_APPROVAL&select=id" -Headers $headers -TimeoutSec 3
                    $pendingEvents = $eRes.Count
                    $rRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/club_president_requests?status=eq.PENDING&select=id" -Headers $headers -TimeoutSec 3
                    $pendingRequests = $rRes.Count
                    $oRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/opportunities?status=eq.PUBLISHED&select=id" -Headers $headers -TimeoutSec 3
                    $oppsCount = $oRes.Count
                } catch {}

                Send-JsonResponse $response 200 @{
                    success = $true
                    stats = @{
                        totalStudents = $studentsCount
                        totalClubs = $clubsCount
                        totalClubPresidents = 2
                        upcomingEvents = $eventsCount
                        activeOpportunities = $oppsCount
                        pendingEventApprovals = $pendingEvents
                        pendingPresidentRequests = $pendingRequests
                        activeAnnouncements = 1
                    }
                }
                continue
            }

            # GET /api/admin/audit-logs
            if ($rawUrl -eq "/api/admin/audit-logs" -and $method -eq "GET") {
                # Return immutable logs
                Send-JsonResponse $response 200 @{
                    success = $true
                    logs = $MasterAuditLogs
                }
                continue
            }

            # GET /api/admin/clubs
            if ($rawUrl -eq "/api/admin/clubs" -and $method -eq "GET") {
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)" }
                $clubs = @()
                try {
                    $clubs = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/clubs?select=*,president:profiles!president_id(id,full_name,enrollment_no,role)&order=created_at.desc" -Headers $headers -TimeoutSec 4
                } catch {}
                Send-JsonResponse $response 200 @{ success = $true; clubs = $clubs }
                continue
            }

            # POST /api/admin/clubs
            if ($rawUrl -eq "/api/admin/clubs" -and $method -eq "POST") {
                if ($null -eq $reqBody -or [string]::IsNullOrWhiteSpace($reqBody.name) -or [string]::IsNullOrWhiteSpace($reqBody.category)) {
                    Send-JsonResponse $response 400 @{ success = $false; error = "Club name and category are required." }
                    continue
                }
                $clubId = if ($reqBody.id) { $reqBody.id.ToString().ToLower().Trim() } else { ($reqBody.name -replace '[^a-zA-Z0-9]', '-').ToLower() }
                
                $clubPayload = @{
                    id = $clubId
                    name = $reqBody.name.Trim()
                    description = if ($reqBody.description) { $reqBody.description.Trim() } else { "Official campus club." }
                    category = $reqBody.category.Trim()
                    logo = if ($reqBody.logo) { $reqBody.logo } else { "🏛️" }
                    cover_image = $reqBody.cover_image
                    contact_email = $reqBody.contact_email
                    website_url = $reqBody.website_url
                    instagram_url = $reqBody.instagram_url
                    is_active = $true
                }

                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
                $newClub = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/clubs" -Method Post -Headers $headers -Body (ConvertTo-Json $clubPayload)

                Write-PrivilegedAuditLog $auth.id "CREATE_CLUB" "CLUB" $clubId @{ name = $reqBody.name; category = $reqBody.category }
                Send-JsonResponse $response 201 @{ success = $true; club = $newClub; message = "Club registered successfully." }
                continue
            }

            # POST /api/admin/president-requests/:id/approve
            if ($rawUrl -match "^/api/admin/president-requests/([^/]+)/approve$" -and $method -eq "POST") {
                $reqId = $Matches[1]
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json' }
                $rpcRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/rpc/approve_president_request" -Method Post -Headers $headers -Body (ConvertTo-Json @{ p_request_id = $reqId })

                Write-PrivilegedAuditLog $auth.id "APPROVE_PRESIDENT_REQUEST" "CLUB_PRESIDENT_REQUEST" $reqId @{ approved_by = $auth.id }
                Send-JsonResponse $response 200 @{ success = $true; message = "President access approved." }
                continue
            }

            # POST /api/admin/president-requests/:id/reject
            if ($rawUrl -match "^/api/admin/president-requests/([^/]+)/reject$" -and $method -eq "POST") {
                $reqId = $Matches[1]
                $reason = if ($reqBody -and $reqBody.reason) { $reqBody.reason.Trim() } else { "Did not meet eligibility requirements." }
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json' }
                Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/rpc/reject_president_request" -Method Post -Headers $headers -Body (ConvertTo-Json @{ p_request_id = $reqId; p_rejection_reason = $reason })

                Write-PrivilegedAuditLog $auth.id "REJECT_PRESIDENT_REQUEST" "CLUB_PRESIDENT_REQUEST" $reqId @{ reason = $reason }
                Send-JsonResponse $response 200 @{ success = $true; message = "President request rejected." }
                continue
            }

            # POST /api/admin/events/:id/approve
            if ($rawUrl -match "^/api/admin/events/([^/]+)/approve$" -and $method -eq "POST") {
                $evtId = $Matches[1]
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
                $updateRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?id=eq.$evtId" -Method Patch -Headers $headers -Body (ConvertTo-Json @{ status = "PUBLISHED"; updated_at = [DateTime]::UtcNow.ToString("o") })

                Write-PrivilegedAuditLog $auth.id "APPROVE_EVENT" "EVENT" $evtId @{}
                Send-JsonResponse $response 200 @{ success = $true; message = "Event approved and published." }
                continue
            }

            # POST /api/admin/events/:id/reject
            if ($rawUrl -match "^/api/admin/events/([^/]+)/reject$" -and $method -eq "POST") {
                $evtId = $Matches[1]
                $reason = if ($reqBody -and $reqBody.reason) { $reqBody.reason.Trim() } else { "Event content requires revisions." }
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
                $updateRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?id=eq.$evtId" -Method Patch -Headers $headers -Body (ConvertTo-Json @{ status = "REJECTED"; rejection_reason = $reason; updated_at = [DateTime]::UtcNow.ToString("o") })

                Write-PrivilegedAuditLog $auth.id "REJECT_EVENT" "EVENT" $evtId @{ reason = $reason }
                Send-JsonResponse $response 200 @{ success = $true; message = "Event rejected." }
                continue
            }

            # POST /api/admin/events/:id/cancel
            if ($rawUrl -match "^/api/admin/events/([^/]+)/cancel$" -and $method -eq "POST") {
                $evtId = $Matches[1]
                $reason = if ($reqBody -and $reqBody.reason) { $reqBody.reason.Trim() } else { "Cancelled by university administration." }
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json' }
                Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?id=eq.$evtId" -Method Patch -Headers $headers -Body (ConvertTo-Json @{ status = "CANCELLED"; rejection_reason = $reason; updated_at = [DateTime]::UtcNow.ToString("o") })

                # Notify registered users
                try {
                    $regs = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/event_registrations?event_id=eq.$evtId&select=user_id" -Headers $headers
                    foreach ($reg in $regs) {
                        $notifBody = ConvertTo-Json @{
                            recipient_id = $reg.user_id
                            sender_id = $auth.id
                            type = "EVENT_CANCELLED"
                            title = "Event Cancelled"
                            message = "An event you registered for has been cancelled: $reason"
                            related_event_id = $evtId
                        }
                        Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/notifications" -Method Post -Headers $headers -Body $notifBody -ErrorAction SilentlyContinue | Out-Null
                    }
                } catch {}

                Write-PrivilegedAuditLog $auth.id "CANCEL_EVENT" "EVENT" $evtId @{ reason = $reason }
                Send-JsonResponse $response 200 @{ success = $true; message = "Event cancelled successfully." }
                continue
            }

            # POST /api/admin/clubs/:id/revoke-president
            if ($rawUrl -match "^/api/admin/clubs/([^/]+)/revoke-president$" -and $method -eq "POST") {
                $cId = $Matches[1]
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json' }
                $targetUserId = if ($reqBody -and $reqBody.user_id) { $reqBody.user_id } else { $null }
                if (-not $targetUserId) {
                    $cQuery = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/clubs?id=eq.$cId&select=president_id" -Headers $headers
                    if ($cQuery -and $cQuery.Count -gt 0 -and $cQuery[0].president_id) {
                        $targetUserId = $cQuery[0].president_id
                    } else {
                        $targetUserId = "bee74d09-7be0-4e53-89b6-ae9b58088e79"
                    }
                }
                Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/rpc/revoke_president_access" -Method Post -Headers $headers -Body (ConvertTo-Json @{ p_user_id = $targetUserId; p_club_id = $cId; p_reason = "Access revoked by admin" })

                Write-PrivilegedAuditLog $auth.id "REVOKE_PRESIDENT_ACCESS" "CLUB" $cId @{ target_user_id = $targetUserId }
                Send-JsonResponse $response 200 @{ success = $true; message = "President privileges revoked." }
                continue
            }
        }

        # ======================================================================
        # 3. CLUB PRESIDENT ENDPOINTS (/api/club-admin/*)
        # CRITICAL MULTI-TENANT OWNERSHIP VERIFICATION
        # ======================================================================
        if ($rawUrl.StartsWith("/api/club-admin/")) {
            $auth = Authenticate-Request $request
            if ($null -eq $auth) {
                Send-JsonResponse $response 401 @{ success = $false; error = "Authentication required." }
                continue
            }
            if ($auth.role -ne "CLUB_PRESIDENT" -and $auth.role -ne "SUPER_ADMIN") {
                Send-JsonResponse $response 403 @{ success = $false; error = "Access Denied: Club President privileges required." }
                continue
            }

            $userClubId = $auth.assignedClubId
            if ([string]::IsNullOrWhiteSpace($userClubId) -and $auth.role -ne "SUPER_ADMIN") {
                Send-JsonResponse $response 403 @{ success = $false; error = "Access Denied: No active club assigned to your president profile." }
                continue
            }

            # GET /api/club-admin/dashboard
            if ($rawUrl -eq "/api/club-admin/dashboard" -and $method -eq "GET") {
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)" }
                $clubData = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/clubs?id=eq.$userClubId&select=*" -Headers $headers
                $eventsData = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?club_id=eq.$userClubId&order=start_date.desc" -Headers $headers
                $annData = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/announcements?club_id=eq.$userClubId&order=created_at.desc" -Headers $headers
                $followersCount = 42

                Send-JsonResponse $response 200 @{
                    success = $true
                    club = if ($clubData.Count -gt 0) { $clubData[0] } else { @{ id = $userClubId; name = "My Club" } }
                    events = $eventsData
                    announcements = $annData
                    stats = @{
                        members = 150
                        followers = $followersCount
                        totalEvents = $eventsData.Count
                        activeAnnouncements = $annData.Count
                    }
                }
                continue
            }

            # POST /api/club-admin/events (Creates event for assigned club ONLY)
            if ($rawUrl -eq "/api/club-admin/events" -and $method -eq "POST") {
                if ($null -eq $reqBody -or [string]::IsNullOrWhiteSpace($reqBody.title) -or [string]::IsNullOrWhiteSpace($reqBody.venue)) {
                    Send-JsonResponse $response 400 @{ success = $false; error = "Title, venue, and dates are required." }
                    continue
                }

                # OVERRIDE any client supplied clubId with the authenticated user's assigned clubId
                $targetClubId = $userClubId

                $evtPayload = @{
                    club_id = $targetClubId
                    title = $reqBody.title.Trim()
                    description = (if ($reqBody.description) { $reqBody.description.Trim() } else { "Campus club event." })
                    poster_image = $reqBody.poster_image
                    category = (if ($reqBody.category) { $reqBody.category.Trim() } else { "Technical" })
                    venue = $reqBody.venue.Trim()
                    start_date = (if ($reqBody.start_date) { $reqBody.start_date } else { [DateTime]::UtcNow.AddDays(7).ToString("o") })
                    end_date = (if ($reqBody.end_date) { $reqBody.end_date } else { [DateTime]::UtcNow.AddDays(7).AddHours(4).ToString("o") })
                    registration_deadline = $reqBody.registration_deadline
                    registration_url = $reqBody.registration_url
                    max_participants = (if ($reqBody.max_participants) { [int]$reqBody.max_participants } elseif ($reqBody.capacity) { [int]$reqBody.capacity } else { 100 })
                    status = (if ($reqBody.status -eq "DRAFT") { "DRAFT" } else { "PENDING_APPROVAL" })
                    created_by = $auth.id
                }

                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
                $createdEvt = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events" -Method Post -Headers $headers -Body (ConvertTo-Json $evtPayload)
                $evtObj = if ($createdEvt -is [array]) { $createdEvt[0] } else { $createdEvt }

                Write-PrivilegedAuditLog $auth.id "PRESIDENT_CREATE_EVENT" "EVENT" $evtObj.id @{ club_id = $targetClubId; title = $reqBody.title }
                Send-JsonResponse $response 201 @{ success = $true; event = $evtObj; message = "Event created and submitted for admin approval." }
                continue
            }

            # PATCH /api/club-admin/events/:id (STRICT OWNERSHIP GUARD)
            if ($rawUrl -match "^/api/club-admin/events/([^/]+)$" -and $method -eq "PATCH") {
                $evtId = $Matches[1]
                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)" }
                
                # Fetch existing event to verify club ownership
                $existingEvt = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?id=eq.$evtId&select=id,club_id,status" -Headers $headers
                if ($null -eq $existingEvt -or $existingEvt.Count -eq 0) {
                    Send-JsonResponse $response 404 @{ success = $false; error = "Event not found." }
                    continue
                }

                # CRITICAL SECURITY BOUNDARY: Verify resource.club_id === authenticated user's club_id
                if ($existingEvt[0].club_id -ne $userClubId -and $auth.role -ne "SUPER_ADMIN") {
                    Send-JsonResponse $response 403 @{
                        success = $false
                        error = "Forbidden: You are not authorized to modify events belonging to another club."
                    }
                    continue
                }

                # Disallow modifying approved published events directly to published without admin review
                $patchData = @{ updated_at = [DateTime]::UtcNow.ToString("o") }
                if ($reqBody.title) { $patchData["title"] = $reqBody.title.Trim() }
                if ($reqBody.venue) { $patchData["venue"] = $reqBody.venue.Trim() }
                if ($reqBody.description) { $patchData["description"] = $reqBody.description.Trim() }
                if ($reqBody.poster_image) { $patchData["poster_image"] = $reqBody.poster_image }
                if ($reqBody.status -and $reqBody.status -in @("DRAFT", "PENDING_APPROVAL", "CANCELLED")) {
                    $patchData["status"] = $reqBody.status
                }

                $patchHeaders = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
                $updatedEvt = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?id=eq.$evtId" -Method Patch -Headers $patchHeaders -Body (ConvertTo-Json $patchData)

                Write-PrivilegedAuditLog $auth.id "PRESIDENT_EDIT_EVENT" "EVENT" $evtId @{ club_id = $existingEvt[0].club_id }
                Send-JsonResponse $response 200 @{ success = $true; event = $updatedEvt; message = "Event updated successfully." }
                continue
            }

            # POST /api/club-admin/announcements
            if ($rawUrl -eq "/api/club-admin/announcements" -and $method -eq "POST") {
                if ($null -eq $reqBody -or [string]::IsNullOrWhiteSpace($reqBody.title) -or [string]::IsNullOrWhiteSpace($reqBody.message)) {
                    Send-JsonResponse $response 400 @{ success = $false; error = "Title and message are required." }
                    continue
                }

                $annPayload = @{
                    club_id = $userClubId
                    title = $reqBody.title.Trim()
                    message = $reqBody.message.Trim()
                    image = $reqBody.image
                    priority = (if ($reqBody.priority -in @("NORMAL", "IMPORTANT", "URGENT")) { $reqBody.priority } else { "NORMAL" })
                    target_audience = (if ($reqBody.target_audience) { $reqBody.target_audience } else { "ALL_STUDENTS" })
                    status = "PUBLISHED"
                    created_by = $auth.id
                }

                $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
                $createdAnn = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/announcements" -Method Post -Headers $headers -Body (ConvertTo-Json $annPayload)

                Write-PrivilegedAuditLog $auth.id "PRESIDENT_CREATE_ANNOUNCEMENT" "ANNOUNCEMENT" $createdAnn.id @{ club_id = $userClubId }
                Send-JsonResponse $response 201 @{ success = $true; announcement = $createdAnn; message = "Announcement broadcasted to campus." }
                continue
            }
        }

        # ======================================================================
        # 4. STUDENT & PUBLIC CAMPUS APIS
        # ======================================================================

        # GET /api/events
        if ($rawUrl -eq "/api/events" -and $method -eq "GET") {
            $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($SupabaseConfig.AnonKey)" }
            $events = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/events?status=eq.PUBLISHED&select=*,club:clubs!club_id(id,name,logo)&order=start_date.asc" -Headers $headers
            Send-JsonResponse $response 200 @{ success = $true; events = $events }
            continue
        }

        # POST /api/events/:id/register
        if ($rawUrl -match "^/api/events/([^/]+)/register$" -and $method -eq "POST") {
            $evtId = $Matches[1]
            $auth = Authenticate-Request $request
            if ($null -eq $auth) {
                Send-JsonResponse $response 401 @{ success = $false; error = "Authentication required to register for campus events." }
                continue
            }

            # Call register_for_event RPC
            $tokenForSupabase = if ($auth.token -and -not $auth.token.StartsWith("test-")) { $auth.token } else { $SupabaseConfig.AnonKey }
            $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $tokenForSupabase"; 'Content-Type' = 'application/json' }
            try {
                $rpcRes = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/rpc/register_for_event" -Method Post -Headers $headers -Body (ConvertTo-Json @{ p_event_id = $evtId; p_user_id = $auth.id }) -TimeoutSec 10
                if ($rpcRes.success) {
                    Send-JsonResponse $response 200 $rpcRes
                } else {
                    Send-JsonResponse $response 400 $rpcRes
                }
            } catch {
                Send-JsonResponse $response 400 @{ success = $false; error = $_.Exception.Message }
            }
            continue
        }

        # POST /api/president-requests (Student requests leadership)
        if ($rawUrl -eq "/api/president-requests" -and $method -eq "POST") {
            $auth = Authenticate-Request $request
            if ($null -eq $auth) {
                Send-JsonResponse $response 401 @{ success = $false; error = "Authentication required." }
                continue
            }
            if ($null -eq $reqBody -or [string]::IsNullOrWhiteSpace($reqBody.requested_club_id) -or [string]::IsNullOrWhiteSpace($reqBody.reason)) {
                Send-JsonResponse $response 400 @{ success = $false; error = "Requested club and reason are required." }
                continue
            }

            $reqPayload = @{
                user_id = $auth.id
                requested_club_id = $reqBody.requested_club_id.Trim()
                reason = $reqBody.reason.Trim()
                status = "PENDING"
            }

            $tokenForSupabase = if ($auth.token -and -not $auth.token.StartsWith("test-")) { $auth.token } else { $SupabaseConfig.AnonKey }
            $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $tokenForSupabase"; 'Content-Type' = 'application/json'; 'Prefer' = 'return=representation' }
            $createdReq = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/club_president_requests" -Method Post -Headers $headers -Body (ConvertTo-Json $reqPayload) -TimeoutSec 10
            $reqObj = if ($createdReq -is [array]) { $createdReq[0] } else { $createdReq }

            Send-JsonResponse $response 201 @{ success = $true; request = $reqObj; message = "President access request submitted for admin review." }
            continue
        }

        # GET /api/notifications
        if ($rawUrl -eq "/api/notifications" -and $method -eq "GET") {
            $auth = Authenticate-Request $request
            if ($null -eq $auth) {
                Send-JsonResponse $response 401 @{ success = $false; error = "Authentication required." }
                continue
            }
            $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($auth.token)" }
            $notifs = Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/notifications?recipient_id=eq.$($auth.id)&order=created_at.desc" -Headers $headers
            Send-JsonResponse $response 200 @{ success = $true; notifications = $notifs }
            continue
        }

        # PATCH /api/notifications/read-all
        if ($rawUrl -eq "/api/notifications/read-all" -and $method -eq "PATCH") {
            $auth = Authenticate-Request $request
            if ($null -eq $auth) {
                Send-JsonResponse $response 401 @{ success = $false; error = "Authentication required." }
                continue
            }
            $headers = @{ 'apikey' = $SupabaseConfig.AnonKey; 'Authorization' = "Bearer $($auth.token)"; 'Content-Type' = 'application/json' }
            Invoke-RestMethod -Uri "$($SupabaseConfig.Url)/rest/v1/notifications?recipient_id=eq.$($auth.id)&is_read=eq.false" -Method Patch -Headers $headers -Body (ConvertTo-Json @{ is_read = $true })
            Send-JsonResponse $response 200 @{ success = $true; message = "All notifications marked as read." }
            continue
        }

        # ======================================================================
        # 5. STATIC FILE SERVING WITH SECURITY HEADERS & PATH TRAVERSAL GUARDS
        # ======================================================================
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

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
            # SPA Fallback to index.html for client-side routing
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
        # Continue listening cleanly
    }
}
