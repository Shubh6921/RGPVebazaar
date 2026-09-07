# Comprehensive End-to-End Automated Test Script for Campus Admin and Club President Management System
$baseUrl = "http://localhost:3000"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "   CAMPUS ADMIN AND CLUB PRESIDENT SYSTEM -- E2E TEST SUITE" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$passed = 0
$failed = 0

function Assert-Test {
    param(
        [string]$TestName,
        [bool]$Condition,
        [string]$Details = ""
    )
    if ($Condition) {
        Write-Host "[PASS] $TestName" -ForegroundColor Green
        if ($Details) { Write-Host "       $Details" -ForegroundColor DarkGray }
        $global:passed++
    } else {
        Write-Host "[FAIL] $TestName" -ForegroundColor Red
        if ($Details) { Write-Host "       $Details" -ForegroundColor Yellow }
        $global:failed++
    }
}

# --- TEST 1: Role RBAC Security (Student blocked from Admin APIs) ---
Write-Host "`n--- Test Scenario 1: RBAC Security Boundary ---" -ForegroundColor Magenta
try {
    $unauthRes = Invoke-WebRequest -Uri "$baseUrl/api/admin/stats" -UseBasicParsing -ErrorAction SilentlyContinue
    $unauthCode = $unauthRes.StatusCode
} catch {
    $unauthCode = $_.Exception.Response.StatusCode.value__
}
Assert-Test "1.1: Unauthenticated request to /api/admin/stats returns 401" ($unauthCode -eq 401) "Status: $unauthCode"

try {
    $studentHeaders = @{ Authorization = "Bearer test-student-token" }
    $studentRes = Invoke-WebRequest -Uri "$baseUrl/api/admin/stats" -Headers $studentHeaders -UseBasicParsing -ErrorAction SilentlyContinue
    $studentCode = $studentRes.StatusCode
} catch {
    $studentCode = $_.Exception.Response.StatusCode.value__
}
Assert-Test "1.2: Student role access to /api/admin/stats returns 403 Forbidden" ($studentCode -eq 403) "Status: $studentCode"

try {
    $adminHeaders = @{ Authorization = "Bearer test-admin-token" }
    $adminRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/stats" -Headers $adminHeaders -UseBasicParsing
    $totalClubs = if ($adminRes.stats) { $adminRes.stats.totalClubs } else { $adminRes.data.totalClubs }
    Assert-Test "1.3: Super Admin access to /api/admin/stats returns 200 with metrics" ($adminRes.success -eq $true -and $totalClubs -ge 1) "Total Clubs: $totalClubs"
} catch {
    Assert-Test "1.3: Super Admin access to /api/admin/stats" $false $_.Exception.Message
}

# --- TEST 2: Student Requests Club Leadership ---
Write-Host "`n--- Test Scenario 2: Student Club Leadership Application ---" -ForegroundColor Magenta
$reqPayload = @{
    requested_club_id = "robotics-club"
    reason = "Experienced with ROS2 and autonomous drones. Looking to lead technical workshops."
} | ConvertTo-Json

try {
    $reqRes = Invoke-RestMethod -Uri "$baseUrl/api/president-requests" -Method POST -Headers $studentHeaders -Body $reqPayload -ContentType "application/json" -UseBasicParsing
    $reqData = if ($reqRes.request) { $reqRes.request } else { $reqRes.data }
    $requestId = if ($reqData -is [array]) { $reqData[0].id } else { $reqData.id }
    $reqStatus = if ($reqData -is [array]) { $reqData[0].status } else { $reqData.status }
    Assert-Test "2.1: Student submits leadership application" ($reqRes.success -eq $true -and $reqStatus -eq "PENDING") "Request ID: $requestId, Status: $reqStatus"
} catch {
    Assert-Test "2.1: Student submits leadership application" $false $_.Exception.Message
}

# --- TEST 3: Admin Reviews and Approves President Request ---
Write-Host "`n--- Test Scenario 3: Admin Review and Approval Workflow ---" -ForegroundColor Magenta
try {
    $approveRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/president-requests/$requestId/approve" -Method POST -Headers $adminHeaders -UseBasicParsing
    Assert-Test "3.1: Admin approves leadership application" ($approveRes.success -eq $true) "Message: $($approveRes.message)"
} catch {
    Assert-Test "3.1: Admin approves leadership application" $false $_.Exception.Message
}

# --- TEST 4: President Multi-Tenant Dashboard Isolation ---
Write-Host "`n--- Test Scenario 4: Multi-Tenant Club Isolation ---" -ForegroundColor Magenta
try {
    $codingPresHeaders = @{ Authorization = "Bearer test-president-coding-token" }
    $codingDash = Invoke-RestMethod -Uri "$baseUrl/api/club-admin/dashboard" -Headers $codingPresHeaders -UseBasicParsing
    $codingClub = if ($codingDash.club) { $codingDash.club } else { $codingDash.data.club }
    Assert-Test "4.1: Coding President sees only Coding Club" ($codingDash.success -eq $true -and $codingClub.id -eq "coding-club") "Club: $($codingClub.name)"

    $roboticsPresHeaders = @{ Authorization = "Bearer test-president-robotics-token" }
    $roboticsDash = Invoke-RestMethod -Uri "$baseUrl/api/club-admin/dashboard" -Headers $roboticsPresHeaders -UseBasicParsing
    $roboticsClub = if ($roboticsDash.club) { $roboticsDash.club } else { $roboticsDash.data.club }
    Assert-Test "4.2: Robotics President sees only Robotics Club" ($roboticsDash.success -eq $true -and $roboticsClub.id -eq "robotics-club") "Club: $($roboticsClub.name)"
} catch {
    Assert-Test "4.1 and 4.2: President Dashboard Isolation" $false $_.Exception.Message
}

# --- TEST 5: President Creates Event (Placed in PENDING_APPROVAL) ---
Write-Host "`n--- Test Scenario 5: Event Creation and Approval Pipeline ---" -ForegroundColor Magenta
$eventPayload = @{
    title = "RGPV Cyber Defense CTF 2026"
    category = "Hackathon"
    description = "24-hour campus capture the flag security challenge."
    start_date = (Get-Date).AddDays(10).ToString("o")
    end_date = (Get-Date).AddDays(11).ToString("o")
    registration_deadline = (Get-Date).AddDays(9).ToString("o")
    venue = "CSE Seminar Hall"
    capacity = 150
} | ConvertTo-Json

try {
    $createEvtRes = Invoke-RestMethod -Uri "$baseUrl/api/club-admin/events" -Method POST -Headers $codingPresHeaders -Body $eventPayload -ContentType "application/json" -UseBasicParsing
    $evtData = if ($createEvtRes.event) { $createEvtRes.event } else { $createEvtRes.data }
    $createdEventId = if ($evtData -is [array]) { $evtData[0].id } else { $evtData.id }
    $createdStatus = if ($evtData -is [array]) { $evtData[0].status } else { $evtData.status }
    Assert-Test "5.1: President creates event -> PENDING_APPROVAL status" ($createEvtRes.success -eq $true -and $createdStatus -eq "PENDING_APPROVAL") "Event ID: $createdEventId, Status: $createdStatus"
} catch {
    Assert-Test "5.1: President creates event" $false $_.Exception.Message
}

# --- TEST 6: Super Admin Approves and Publishes Event ---
Write-Host "`n--- Test Scenario 6: Super Admin Event Sanction ---" -ForegroundColor Magenta
try {
    $approveEvtRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/events/$createdEventId/approve" -Method POST -Headers $adminHeaders -UseBasicParsing
    Assert-Test "6.1: Admin approves event -> PUBLISHED" ($approveEvtRes.success -eq $true) "Message: $($approveEvtRes.message)"

    # Verify visible to student in public events feed
    $publicEvents = Invoke-RestMethod -Uri "$baseUrl/api/events" -Headers $studentHeaders -UseBasicParsing
    $evtsList = if ($publicEvents.events) { $publicEvents.events } else { $publicEvents.data }
    $foundInFeed = $evtsList | Where-Object { $_.id -eq $createdEventId }
    Assert-Test "6.2: Approved event visible in student events directory" ($foundInFeed -ne $null) "Title: $($foundInFeed.title)"
} catch {
    Assert-Test "6.1 and 6.2: Admin approves event" $false $_.Exception.Message
}

# --- TEST 7: Cross-Club Modification Boundary (Strict Multi-Tenant Security) ---
Write-Host "`n--- Test Scenario 7: Multi-Tenant Boundary Enforcement ---" -ForegroundColor Magenta
$tamperPayload = @{
    title = "Malicious Modification of Other Club Event"
} | ConvertTo-Json

try {
    # Robotics president attempts to edit Coding club event
    $tamperRes = Invoke-WebRequest -Uri "$baseUrl/api/club-admin/events/$createdEventId" -Method PATCH -Headers $roboticsPresHeaders -Body $tamperPayload -ContentType "application/json" -UseBasicParsing -ErrorAction SilentlyContinue
    $tamperCode = $tamperRes.StatusCode
} catch {
    $tamperCode = $_.Exception.Response.StatusCode.value__
}
Assert-Test "7.1: Cross-Club modification attempt returns 403 Forbidden" ($tamperCode -eq 403) "StatusCode: $tamperCode (Robotics President blocked from Coding Club event)"

# --- TEST 8: Student Event Registration and Constraints ---
Write-Host "`n--- Test Scenario 8: Event Registration and Unique Constraint ---" -ForegroundColor Magenta
try {
    $regRes = Invoke-RestMethod -Uri "$baseUrl/api/events/$createdEventId/register" -Method POST -Headers $studentHeaders -UseBasicParsing
    Assert-Test "8.1: Student registers for event successfully" ($regRes.success -eq $true) "Result: $($regRes.message)"
} catch {
    Assert-Test "8.1: Student registers for event" $false $_.Exception.Message
}

# Duplicate registration check
try {
    $dupRes = Invoke-WebRequest -Uri "$baseUrl/api/events/$createdEventId/register" -Method POST -Headers $studentHeaders -UseBasicParsing -ErrorAction SilentlyContinue
    $dupCode = $dupRes.StatusCode
} catch {
    $dupCode = $_.Exception.Response.StatusCode.value__
}
Assert-Test "8.2: Duplicate registration prevented by unique constraint" ($dupCode -eq 409 -or $dupCode -eq 400) "HTTP Status: $dupCode"

# --- TEST 9: President Broadcasts Announcement ---
Write-Host "`n--- Test Scenario 9: Official Announcements ---" -ForegroundColor Magenta
$annPayload = @{
    title = "Workshop Prerequisites: Docker and Git"
    message = "Please ensure Docker Desktop and Git are pre-installed on your laptops before Saturday sprint."
    priority = "URGENT"
} | ConvertTo-Json

try {
    $annRes = Invoke-RestMethod -Uri "$baseUrl/api/club-admin/announcements" -Method POST -Headers $codingPresHeaders -Body $annPayload -ContentType "application/json" -UseBasicParsing
    $annObj = if ($annRes.announcement) { $annRes.announcement } else { $annRes.data }
    $annTitle = if ($annObj -is [array]) { $annObj[0].title } else { $annObj.title }
    Assert-Test "9.1: President broadcasts announcement" ($annRes.success -eq $true) "Announcement: $annTitle"
} catch {
    Assert-Test "9.1: President broadcasts announcement" $false $_.Exception.Message
}

# --- TEST 10: Admin Cancels Event ---
Write-Host "`n--- Test Scenario 10: Event Cancellation and Notifications ---" -ForegroundColor Magenta
$cancelPayload = @{
    reason = "Auditorium maintenance scheduled by university administration."
} | ConvertTo-Json

try {
    $cancelRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/events/$createdEventId/cancel" -Method POST -Headers $adminHeaders -Body $cancelPayload -ContentType "application/json" -UseBasicParsing
    Assert-Test "10.1: Admin cancels event with reason" ($cancelRes.success -eq $true) "Message: $($cancelRes.message)"
} catch {
    Assert-Test "10.1: Admin cancels event" $false $_.Exception.Message
}

# --- TEST 11: Admin Revokes Club Leadership ---
Write-Host "`n--- Test Scenario 11: Role Revocation and Security Audit ---" -ForegroundColor Magenta
try {
    $revokeBody = @{ user_id = "0101it261001@rgpv.ac.in" } | ConvertTo-Json
    $revokeRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/clubs/robotics-club/revoke-president" -Method POST -Headers $adminHeaders -Body $revokeBody -ContentType "application/json" -UseBasicParsing
    Assert-Test "11.1: Admin revokes president role" ($revokeRes.success -eq $true) "Result: $($revokeRes.message)"
} catch {
    Assert-Test "11.1: Admin revokes president role" $false $_.Exception.Message
}

# --- TEST 12: Audit Log Ledger Integrity ---
Write-Host "`n--- Test Scenario 12: Immutable Audit Log Ledger ---" -ForegroundColor Magenta
try {
    $auditRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/audit-logs" -Headers $adminHeaders -UseBasicParsing
    $logsList = if ($auditRes.logs) { $auditRes.logs } else { $auditRes.data }
    $logsCount = $logsList.Count
    Assert-Test "12.1: Audit log tracks all administrative actions" ($auditRes.success -eq $true -and $logsCount -ge 5) "Total Logged Actions: $logsCount"
} catch {
    Assert-Test "12.1: Audit log ledger" $false $_.Exception.Message
}

# --- SUMMARY REPORT ---
Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "   TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "   TOTAL PASSED: $passed" -ForegroundColor Green
Write-Host "   TOTAL FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==================================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
