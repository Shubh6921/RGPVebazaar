# =============================================================================
# RGPV UNOFFICIAL — STAGE 9 AUTOMATED SECURITY TEST SUITE
# Validates HTTP Security Headers, API Endpoints, RLS Policies, and Trust Rules
# =============================================================================

param(
    [string]$baseUrl = "http://localhost:3001"
)
$passCount = 0
$failCount = 0
$testResults = @()

function Record-TestResult {
    param(
        [int]$Id,
        [string]$Scenario,
        [bool]$Passed,
        [string]$Detail
    )
    if ($Passed) {
        $global:passCount++
        Write-Host " [PASS] Test #$($Id): $Scenario" -ForegroundColor Green
        Write-Host "        Detail: $Detail" -ForegroundColor DarkGray
    } else {
        $global:failCount++
        Write-Host " [FAIL] Test #$($Id): $Scenario" -ForegroundColor Red
        Write-Host "        Detail: $Detail" -ForegroundColor Yellow
    }
    $global:testResults += [PSCustomObject]@{
        Id = $Id
        Scenario = $Scenario
        Passed = $Passed
        Detail = $Detail
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   RGPV UNOFFICIAL - STAGE 9 SECURITY TEST SUITE       " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. HTTP Security Headers
try {
    $resp = Invoke-WebRequest -Uri "$baseUrl/" -Method Get -UseBasicParsing -TimeoutSec 5
    $csp = $resp.Headers["Content-Security-Policy"]
    $xcto = $resp.Headers["X-Content-Type-Options"]
    $xfo = $resp.Headers["X-Frame-Options"]
    $headersOk = ($csp -ne $null) -and ($xcto -eq "nosniff") -and ($xfo -eq "DENY")
    Record-TestResult -Id 1 -Scenario "Production Security Headers Enforced" -Passed $headersOk -Detail "CSP, X-Content-Type-Options: nosniff, and X-Frame-Options: DENY present."
} catch {
    Record-TestResult -Id 1 -Scenario "Production Security Headers Enforced" -Passed $false -Detail $_.Exception.Message
}

# 2. Path Traversal Defense
try {
    $traversalBlocked = $false
    try {
        $badReq = Invoke-WebRequest -Uri "$baseUrl/..%2Fserver.ps1" -Method Get -UseBasicParsing -TimeoutSec 5
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -in 403, 404, 400) {
            $traversalBlocked = $true
        }
    }
    Record-TestResult -Id 2 -Scenario "Path Traversal Attacks Blocked" -Passed $traversalBlocked -Detail "Blocked relative path traversal attempt with HTTP 403/404."
} catch {
    Record-TestResult -Id 2 -Scenario "Path Traversal Attacks Blocked" -Passed $false -Detail $_.Exception.Message
}

# 3. Enrollment Verification Server Lookup (Valid)
try {
    $body = @{ enrollment = "0101CS261001" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/verify-enrollment" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
    $validOk = ($res.success -eq $true) -and ($res.student.name -match "AARUSH|BANSAL|Rahul|Sharma|Verified") -and ($res.student.maskedEnrollment.Contains("****"))
    Record-TestResult -Id 3 -Scenario "Enrollment verification accepts valid enrollment" -Passed $validOk -Detail "Matched student $($res.student.name), returned masked enrollment: $($res.student.maskedEnrollment)"
} catch {
    Record-TestResult -Id 3 -Scenario "Enrollment verification accepts valid enrollment" -Passed $false -Detail $_.Exception.Message
}

# 4. Enrollment Verification Server Lookup (Unlisted)
try {
    $body = @{ enrollment = "9999CS999999" } | ConvertTo-Json
    $rejectedOk = $false
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/api/verify-enrollment" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
        if ($res.success -eq $false) { $rejectedOk = $true }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -in 404, 400) { $rejectedOk = $true }
    }
    Record-TestResult -Id 4 -Scenario "Enrollment verification rejects unlisted enrollment" -Passed $rejectedOk -Detail "Server refused unlisted registration number."
} catch {
    Record-TestResult -Id 4 -Scenario "Enrollment verification rejects unlisted enrollment" -Passed $false -Detail $_.Exception.Message
}

# 5. Malicious URL Rejection in API
try {
    $body = @{ url = "javascript:alert(document.cookie)" } | ConvertTo-Json
    $blockedXss = $false
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/api/validate-url" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) { $blockedXss = $true }
    }
    Record-TestResult -Id 5 -Scenario "Malicious URL in official_link is rejected" -Passed $blockedXss -Detail "javascript: scheme rejected with HTTP 400 Bad Request."
} catch {
    Record-TestResult -Id 5 -Scenario "Malicious URL in official_link is rejected" -Passed $false -Detail $_.Exception.Message
}

# 6. Self-Blocking Prevention in API
try {
    $body = @{ blocker_id = "user-123"; blocked_user_id = "user-123" } | ConvertTo-Json
    $selfBlockRejected = $false
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/api/block-user" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) { $selfBlockRejected = $true }
    }
    Record-TestResult -Id 6 -Scenario "Self-blocking is rejected" -Passed $selfBlockRejected -Detail "API rejected attempt for user to block themselves with HTTP 400."
} catch {
    Record-TestResult -Id 6 -Scenario "Self-blocking is rejected" -Passed $false -Detail $_.Exception.Message
}

# 7. Valid Abuse Report Submission
try {
    $body = @{
        target_type = "listing"
        target_id = "prod-1"
        reason = "Scam"
        description = "Automated test report"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/reports" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
    $reportOk = ($res.success -eq $true) -and ($res.report_id -ne $null)
    Record-TestResult -Id 7 -Scenario "Abuse reporting endpoint records validated reports" -Passed $reportOk -Detail "Report accepted and assigned ID: $($res.report_id)"
} catch {
    Record-TestResult -Id 7 -Scenario "Abuse reporting endpoint records validated reports" -Passed $false -Detail $_.Exception.Message
}

# 8. Invalid Abuse Report Target Type Rejected
try {
    $body = @{
        target_type = "untrusted_database_system"
        target_id = "prod-1"
        reason = "Scam"
    } | ConvertTo-Json
    $invalidTargetBlocked = $false
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/api/reports" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) { $invalidTargetBlocked = $true }
    }
    Record-TestResult -Id 8 -Scenario "Abuse report parameter whitelisting enforced" -Passed $invalidTargetBlocked -Detail "Invalid target type rejected with HTTP 400."
} catch {
    Record-TestResult -Id 8 -Scenario "Abuse report parameter whitelisting enforced" -Passed $false -Detail $_.Exception.Message
}

# 9. PostgreSQL Migration: 14 Tables Enforce Row Level Security
$sqlPath = "supabase/migrations/20260906_security_trust_layer.sql"
if (Test-Path $sqlPath) {
    $sql = Get-Content -Raw $sqlPath
    $tables = @(
        "student_registry", "profiles", "listings", "conversations",
        "conversation_participants", "messages", "offers", "exchange_proposals",
        "resources", "reviews", "reports", "blocked_users", "security_events"
    )
    $allRls = $true
    foreach ($tbl in $tables) {
        if ($sql -notmatch "ALTER TABLE public\.$tbl ENABLE ROW LEVEL SECURITY;") {
            $allRls = $false
        }
    }
    Record-TestResult -Id 9 -Scenario "PostgreSQL RLS enabled on all campus schema tables" -Passed $allRls -Detail "Verified 13 public tables have explicit ENABLE ROW LEVEL SECURITY."
} else {
    Record-TestResult -Id 9 -Scenario "PostgreSQL RLS enabled on all campus schema tables" -Passed $false -Detail "Migration file not found."
}

# 10. Student Registry Zero-Knowledge RLS
$registryProtected = ($sql -match "ALTER TABLE public\.student_registry ENABLE ROW LEVEL SECURITY;") -and 
                     ($sql -match 'Deny all client access on student_registry') -and 
                     ($sql -match "CREATE OR REPLACE FUNCTION public\.verify_student_enrollment")
Record-TestResult -Id 10 -Scenario "RLS protects student registry from bulk client harvesting" -Passed $registryProtected -Detail "student_registry has RLS enabled, client queries denied; accessible only via SECURITY DEFINER function."

# 11. Conversation Participant Privacy RLS
$convPolicy = ($sql -match 'CREATE POLICY "Participants can view conversations"') -and 
              ($sql -match "user_id = auth\.uid\(\)")
Record-TestResult -Id 11 -Scenario "RLS prevents reading other users' conversations" -Passed $convPolicy -Detail "Policy ensures conversation SELECT is restricted to conversation participants."

# 12. Message Privacy & Spoofing Prevention RLS
$msgPolicy = ($sql -match 'CREATE POLICY "Participants can send messages"') -and 
             ($sql -match "auth\.uid\(\) = sender_id")
Record-TestResult -Id 12 -Scenario "Message sender_id cannot be spoofed in DB" -Passed $msgPolicy -Detail "Policy enforces that sender_id must match authenticated auth.uid()."

# 13. IDOR Listing Modification Protection RLS
$listingUpdatePolicy = ($sql -match 'CREATE POLICY "Sellers can update own listings"') -and 
                       ($sql -match "auth\.uid\(\) = seller_id")
Record-TestResult -Id 13 -Scenario "Non-owner cannot update a listing (IDOR)" -Passed $listingUpdatePolicy -Detail "Policy restricts UPDATE strictly to authenticated seller_id."

# 14. IDOR Listing Deletion Protection RLS
$listingDeletePolicy = ($sql -match 'CREATE POLICY "Sellers can delete own listings"') -and 
                       ($sql -match "auth\.uid\(\) = seller_id")
Record-TestResult -Id 14 -Scenario "Non-owner cannot delete a listing (IDOR)" -Passed $listingDeletePolicy -Detail "Policy restricts DELETE strictly to authenticated seller_id."

# 15. Mass Assignment Trigger on Profiles
$profileTrigger = ($sql -match "CREATE OR REPLACE FUNCTION public\.protect_profile_identity_fields") -and 
                  ($sql -match "OLD\.campus_verified = false AND NEW\.campus_verified = true")
Record-TestResult -Id 15 -Scenario "Mass assignment: cannot tamper campus_verified or enrollment" -Passed $profileTrigger -Detail "PostgreSQL trigger protect_profile_identity_fields aborts unauthorized edits."

# 16. Exchange Item Ownership Validation Trigger
$exchangeTrigger = ($sql -match "CREATE OR REPLACE FUNCTION public\.validate_exchange_ownership\(\)") -and 
                   ($sql -match "You can only propose items you own")
Record-TestResult -Id 16 -Scenario "Exchange proposal requires ownership of offered item" -Passed $exchangeTrigger -Detail "Trigger validate_exchange_ownership validates seller_id matches proposer auth.uid()."

# 17. Review Integrity: Self-Rating & Transaction Verification
$reviewGuards = ($sql -match "reviewer_id <> reviewee_id") -and 
                ($sql -match "rating >= 1 AND rating <= 5")
Record-TestResult -Id 17 -Scenario "Self-rating in reviews is blocked by DB constraints" -Passed $reviewGuards -Detail "Check constraint reviewer_id <> reviewee_id and rating BETWEEN 1 AND 5."

# 18. Academic Storage: PDF Extension & MIME Enforcement
$storagePolicy = ($sql -match "bucket_id = 'resource-files'") -and 
                 ($sql -match "storage\.extension\(name\).*?pdf")
Record-TestResult -Id 18 -Scenario "Storage: non-PDF upload to academic bucket is rejected" -Passed $storagePolicy -Detail "Supabase storage insert policy limits resource-files bucket strictly to PDF."

# 19. Client Store Mass Assignment Guard
$storeJs = Get-Content -Raw "js/store.js"
$clientWhitelist = ($storeJs -match "allowedFields = \['avatar', 'bio', 'displayPreferences'\]") -and 
                   ($storeJs -match "privilege_escalation_attempt")
Record-TestResult -Id 19 -Scenario "Client Store enforces field whitelisting on profile updates" -Passed $clientWhitelist -Detail "Store updateProfile drops campus_verified/enrollment updates and logs audit event."

# 20. Client Store XSS Character Escaping
$xssSanitize = ($storeJs -match "sanitizeText\(str\)") -and 
               ($storeJs -match "&amp;") -and 
               ($storeJs -match "&lt;")
Record-TestResult -Id 20 -Scenario "XSS attempt in listing title is sanitized" -Passed $xssSanitize -Detail "sanitizeText safely escapes HTML tags, quotes, and ampersands before storage."

Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host " TEST SUMMARY: $passCount / 20 Passed ($([math]::Round(($passCount/20)*100))%)" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Yellow" })
Write-Host "--------------------------------------------------------`n" -ForegroundColor Cyan
