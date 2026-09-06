$anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY21pdWJhc3J2dWJmcmt5c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTE2MDUsImV4cCI6MjEwNDI2NzYwNX0.-c1fu54MGqlvgSInqdfBDRaYS824SqZ07_oeTPfZooY"
$headers = @{
    "apikey" = $anon
    "Authorization" = "Bearer " + $anon
    "Content-Type" = "application/json"
}

# Test 1: Check real enrolled student (Aarush Bansal)
$body1 = '{"p_enrollment":"0101CS261001"}'
$res1 = Invoke-RestMethod -Uri "https://jjcmiubasrvubfrkystv.supabase.co/rest/v1/rpc/check_enrollment" -Method Post -Headers $headers -Body $body1
Write-Host "Test 1 - Valid Enrollment (0101CS261001):" -ForegroundColor Cyan
Write-Host ($res1 | ConvertTo-Json -Depth 4)

# Test 2: Check invalid enrollment
$body2 = '{"p_enrollment":"0101FAKE9999"}'
$res2 = Invoke-RestMethod -Uri "https://jjcmiubasrvubfrkystv.supabase.co/rest/v1/rpc/check_enrollment" -Method Post -Headers $headers -Body $body2
Write-Host "`nTest 2 - Invalid Enrollment (0101FAKE9999):" -ForegroundColor Cyan
Write-Host ($res2 | ConvertTo-Json -Depth 4)

# Test 3: Check another real student from another branch (e.g., Automobile Engg: Abhilash Patel)
$body3 = '{"p_enrollment":"0101AU261001"}'
$res3 = Invoke-RestMethod -Uri "https://jjcmiubasrvubfrkystv.supabase.co/rest/v1/rpc/check_enrollment" -Method Post -Headers $headers -Body $body3
Write-Host "`nTest 3 - Valid Enrollment (0101AU261001):" -ForegroundColor Cyan
Write-Host ($res3 | ConvertTo-Json -Depth 4)
