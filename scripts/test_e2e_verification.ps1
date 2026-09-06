$supabaseUrl = "https://jjcmiubasrvubfrkystv.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY21pdWJhc3J2dWJmcmt5c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTE2MDUsImV4cCI6MjEwNDI2NzYwNX0.-c1fu54MGqlvgSInqdfBDRaYS824SqZ07_oeTPfZooY"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

Write-Host "--- TEST 1: Check Enrollment (Step 1) ---"
$res = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/valid_enrollments?enrollment_no=eq.0101CS261001&select=*" -Headers $headers -Method Get
Write-Host "Found student:" ($res | ConvertTo-Json -Compress)

Write-Host "`n--- TEST 2: Invalid Enrollment ---"
$invalidRes = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/valid_enrollments?enrollment_no=eq.INVALID999&select=*" -Headers $headers -Method Get
Write-Host "Invalid count:" $invalidRes.Count

Write-Host "`n--- TEST 3: Complete Verification RPC (Step 3/4) ---"
$body = @{
    p_enrollment = "0101CS261001"
    p_phone = "+919876543210"
} | ConvertTo-Json

$rpcRes = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/complete_verification" -Headers $headers -Method Post -Body $body
Write-Host "RPC Result:" ($rpcRes | ConvertTo-Json -Compress)

Write-Host "`n--- TEST 4: Query Linked Profile in DB ---"
$prof = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/profiles?enrollment_no=eq.0101CS261001&select=*" -Headers $headers -Method Get
Write-Host "Profile in DB:" ($prof | ConvertTo-Json -Compress)
