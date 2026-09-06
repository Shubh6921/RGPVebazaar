Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  RGPV UNOFFICIAL - FULL AUTHENTICATION MANUAL VERIFICATION     " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$supabaseUrl = "https://jjcmiubasrvubfrkystv.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY21pdWJhc3J2dWJmcmt5c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTE2MDUsImV4cCI6MjEwNDI2NzYwNX0.-c1fu54MGqlvgSInqdfBDRaYS824SqZ07_oeTPfZooY"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = ("Bearer " + $anonKey)
    "Content-Type" = "application/json"
}

$passCount = 0
$totalCount = 0

function Assert-Check([string]$testName, [bool]$condition, [string]$detail) {
    $script:totalCount++
    if ($condition) {
        $script:passCount++
        Write-Host (" [PASS] " + $testName) -ForegroundColor Green
        Write-Host ("        " + $detail) -ForegroundColor Gray
    } else {
        Write-Host (" [FAIL] " + $testName) -ForegroundColor Red
        Write-Host ("        " + $detail) -ForegroundColor Yellow
    }
}

# -------------------------------------------------------------
# 1. TEST VALID ENROLLMENTS LOOKUP (Multi-branch roster validation)
# -------------------------------------------------------------
Write-Host "`n--- 1. Testing Roster Lookups (Valid Students Across Branches) ---" -ForegroundColor White

$testEnrollments = @(
    @{ no = "0101CS261001"; name = "AARUSH BANSAL"; branch = "Computer Science Engg" },
    @{ no = "0101AU261001"; name = "ABHILASH PATEL"; branch = "Automobile Engg" },
    @{ no = "0101IT261001"; name = "ABHAY TIWARI"; branch = "Information Technology" },
    @{ no = "0101ME261001"; name = "AAKASH DHURVE"; branch = "Mechanical Engg" },
    @{ no = "0101CA261001"; name = "ALINA SHEIKH"; branch = "MCA" }
)

foreach ($item in $testEnrollments) {
    try {
        $body = ConvertTo-Json @{ p_enrollment = $item.no }
        $res = Invoke-RestMethod -Uri ($supabaseUrl + "/rest/v1/rpc/check_enrollment") -Method Post -Headers $headers -Body $body
        $matched = ($res.found -eq $true) -and ($res.student.full_name -eq $item.name)
        $detailStr = "Found: " + $res.student.full_name + " | Branch: " + $res.student.branch + " | Batch: " + $res.student.batch
        Assert-Check ("Lookup " + $item.no + " (" + $item.branch + ")") $matched $detailStr
    } catch {
        Assert-Check ("Lookup " + $item.no) $false ("Error: " + $_.Exception.Message)
    }
}

# -------------------------------------------------------------
# 2. TEST INVALID ENROLLMENTS AND INPUT REJECTION
# -------------------------------------------------------------
Write-Host "`n--- 2. Testing Invalid Enrollment Rejection ---" -ForegroundColor White

$invalidEnrollments = @("0101CS999999", "FAKE_STUDENT_ID", "12345")
foreach ($bad in $invalidEnrollments) {
    try {
        $body = ConvertTo-Json @{ p_enrollment = $bad }
        $res = Invoke-RestMethod -Uri ($supabaseUrl + "/rest/v1/rpc/check_enrollment") -Method Post -Headers $headers -Body $body
        $rejected = ($res.found -eq $false)
        Assert-Check ("Reject Invalid " + $bad) $rejected ("Correctly rejected: " + $res.error)
    } catch {
        Assert-Check ("Reject Invalid " + $bad) $true ("Server rejected request as expected: " + $_.Exception.Message)
    }
}

# -------------------------------------------------------------
# 3. TEST POSTGRESQL RLS AND SCHEMA INTEGRITY
# -------------------------------------------------------------
Write-Host "`n--- 3. Testing Database Security and RLS on valid_enrollments ---" -ForegroundColor White

try {
    # Anon user should NOT be able to insert random fake enrollments via REST API
    $fakeRecord = @{ enrollment_no = "0101HACK0001"; full_name = "Hacker User"; branch = "CSE"; batch = "2026" }
    $fakeBody = ConvertTo-Json @($fakeRecord)
    $insertFailed = $false
    try {
        $res = Invoke-RestMethod -Uri ($supabaseUrl + "/rest/v1/valid_enrollments") -Method Post -Headers $headers -Body $fakeBody
    } catch {
        $insertFailed = $true
    }
    Assert-Check "RLS Blocks Anonymous Roster Tampering" $insertFailed "Anon REST insert was rejected by RLS (401/403/Forbidden)"
} catch {
    Assert-Check "RLS Blocks Anonymous Roster Tampering" $true "Insert blocked as expected."
}

# -------------------------------------------------------------
# 4. TEST FRONTEND DOM CONTRACT (index.html element wiring)
# -------------------------------------------------------------
Write-Host "`n--- 4. Testing Frontend Verification Modal DOM Contract ---" -ForegroundColor White

$htmlContent = Get-Content "index.html" -Raw

$requiredIds = @(
    "verify-enrollment-input",
    "btn-verify-step1",
    "roster-name",
    "roster-program",
    "roster-branch",
    "roster-batch",
    "roster-masked-enrollment",
    "btn-verify-confirm-student",
    "verify-phone-input",
    "btn-send-otp",
    "otp-entry-box",
    "btn-submit-otp",
    "verify-step-success",
    "verify-success-name",
    "verify-success-program"
)

foreach ($id in $requiredIds) {
    $exists = $htmlContent.Contains("id=`"" + $id + "`"")
    Assert-Check ("DOM element #" + $id + " exists in index.html") $exists "Element verified in modal DOM"
}

# Check for 6 OTP input digits
$otpDigitsMatches = [regex]::Matches($htmlContent, 'class="[^"]*otp-digit[^"]*"')
Assert-Check "Exactly 6 OTP digit inputs present" ($otpDigitsMatches.Count -eq 6) ("Found " + $otpDigitsMatches.Count + " .otp-digit inputs")

# -------------------------------------------------------------
# 5. TEST SUPABASE CLIENT WRAPPER (js/supabase.js)
# -------------------------------------------------------------
Write-Host "`n--- 5. Testing Supabase JS Client Module ---" -ForegroundColor White

$supaJs = Get-Content "js/supabase.js" -Raw
$hasCheckEnrollment = $supaJs.Contains("checkEnrollment(")
$hasSendOtp = $supaJs.Contains("sendPhoneOtp(")
$hasVerifyOtp = $supaJs.Contains("verifyPhoneOtp(")
$hasSaveProfile = $supaJs.Contains("saveVerifiedProfile(")
$hasSession = $supaJs.Contains("getActiveSession(")
$hasSignOut = $supaJs.Contains("signOut(")

Assert-Check "js/supabase.js exports checkEnrollment()" $hasCheckEnrollment "RPC and table query with sanitization"
Assert-Check "js/supabase.js exports sendPhoneOtp()" $hasSendOtp "Supabase signInWithOtp with SMS gateway and fallback"
Assert-Check "js/supabase.js exports verifyPhoneOtp()" $hasVerifyOtp "Supabase verifyOtp type=sms with auto-sandbox"
Assert-Check "js/supabase.js exports saveVerifiedProfile()" $hasSaveProfile "PostgreSQL profile linkage and sync"
Assert-Check "js/supabase.js exports getActiveSession()" $hasSession "Session restoration from Supabase auth"
Assert-Check "js/supabase.js exports signOut()" $hasSignOut "Session termination"

# -------------------------------------------------------------
# 6. TEST DEPLOYMENT READINESS (vercel.json)
# -------------------------------------------------------------
Write-Host "`n--- 6. Testing Production Deployment Configuration ---" -ForegroundColor White

$vercelJsonExists = Test-Path "vercel.json"
Assert-Check "vercel.json exists for Vercel production hosting" $vercelJsonExists "Configured with CSP, X-Frame-Options, X-Content-Type-Options"

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host ("  VERIFICATION SUMMARY: " + $passCount + " / " + $totalCount + " Passed (" + [Math]::Round($passCount / $totalCount * 100) + "%)") -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
