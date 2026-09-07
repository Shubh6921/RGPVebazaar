# End-to-End Multi-User Marketplace Integration Test
$ErrorActionPreference = 'Stop'

$supabaseUrl = 'https://jjcmiubasrvubfrkystv.supabase.co'
$anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY21pdWJhc3J2dWJmcmt5c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTE2MDUsImV4cCI6MjEwNDI2NzYwNX0.-c1fu54MGqlvgSInqdfBDRaYS824SqZ07_oeTPfZooY'
$amp = [char]38

function Auth-User($email, $password) {
    $authBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    $authHeaders = @{
        'apikey' = $anonKey
        'Content-Type' = 'application/json'
    }

    $loginUrl = $supabaseUrl + '/auth/v1/token?grant_type=password'
    $res = Invoke-RestMethod -Uri $loginUrl -Headers $authHeaders -Method Post -Body $authBody
    return @{
        Token = $res.access_token
        UserId = $res.user.id
        Email = $res.user.email
    }
}

Write-Host '========================================================' -ForegroundColor Cyan
Write-Host '      REAL MARKETPLACE MULTI-USER BACKEND TEST          ' -ForegroundColor Cyan
Write-Host '========================================================' -ForegroundColor Cyan

# --- STEP 1: AUTH STUDENT A ---
Write-Host "`n[STEP 1] Authenticating Student A (0101CS261001 / Aarush)..." -ForegroundColor Yellow
$userA = Auth-User '0101cs261001@rgpv.ac.in' 'RgpvVerified2026!'
Write-Host ('[PASS] Student A authenticated! UID: ' + $userA.UserId) -ForegroundColor Green

$headersA = @{
    'apikey' = $anonKey
    'Authorization' = ('Bearer ' + $userA.Token)
    'Content-Type' = 'application/json'
    'Prefer' = 'return=representation'
}

# --- STEP 2: STORAGE UPLOAD ---
Write-Host "`n[STEP 2] Uploading listing image to Supabase Storage bucket listing-images..." -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$storagePath = $userA.UserId + '/test_calc_' + $timestamp + '.jpg'
$uploadUri = $supabaseUrl + '/storage/v1/object/listing-images/' + $storagePath

# Minimal 1x1 JPEG byte sequence
$dummyJpeg = [byte[]]@(0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xBF, 0x00, 0xFF, 0xD9)

$storageHeaders = @{
    'apikey' = $anonKey
    'Authorization' = ('Bearer ' + $userA.Token)
    'Content-Type' = 'image/jpeg'
}

$uploadRes = Invoke-RestMethod -Uri $uploadUri -Headers $storageHeaders -Method Post -Body $dummyJpeg
$publicImageUrl = $supabaseUrl + '/storage/v1/object/public/listing-images/' + $storagePath
Write-Host '[PASS] Image uploaded successfully to Storage!' -ForegroundColor Green
Write-Host ('  Public URL: ' + $publicImageUrl) -ForegroundColor Gray

# --- STEP 3: CREATE LISTING ---
Write-Host "`n[STEP 3] Student A creating listing in public.listings..." -ForegroundColor Yellow
$listingPayload = @{
    title = 'Casio fx-991EX Scientific Calculator'
    description = 'Genuine Casio Classwiz in flawless working condition. Essential for engineering mathematics and exams.'
    price = 750
    category = 'Electronics'
    condition = 'Like New'
    listing_type = 'sell'
    location = 'Central Library'
    images = @($publicImageUrl)
} | ConvertTo-Json

$createUri = $supabaseUrl + '/rest/v1/listings'
$createdListing = Invoke-RestMethod -Uri $createUri -Headers $headersA -Method Post -Body $listingPayload
$listingId = $createdListing[0].id
Write-Host '[PASS] Listing created successfully in Supabase!' -ForegroundColor Green
Write-Host ('  ID: ' + $listingId + ' | Title: ' + $createdListing[0].title + ' | Price: Rs. ' + $createdListing[0].price) -ForegroundColor Gray
Write-Host ('  Seller ID (server-derived): ' + $createdListing[0].seller_id) -ForegroundColor Gray

# --- STEP 4: AUTH STUDENT B ---
Write-Host "`n[STEP 4] Authenticating Student B (0101IT261001 / Abhay)..." -ForegroundColor Yellow
$userB = Auth-User '0101it261001@rgpv.ac.in' 'RgpvVerified2026!'
Write-Host ('[PASS] Student B authenticated! UID: ' + $userB.UserId) -ForegroundColor Green

$headersB = @{
    'apikey' = $anonKey
    'Authorization' = ('Bearer ' + $userB.Token)
    'Content-Type' = 'application/json'
    'Prefer' = 'return=representation'
}

# --- STEP 5: STUDENT B DISCOVERS LISTING ---
Write-Host "`n[STEP 5] Student B browsing active marketplace feed..." -ForegroundColor Yellow
$selectQuery = 'id,title,price,category,condition,listing_type,location,status,images,seller:profiles!seller_id(id,enrollment_no,full_name,branch,is_verified)'
$queryUri = $supabaseUrl + '/rest/v1/listings?select=' + [System.Uri]::EscapeDataString($selectQuery) + $amp + 'status=eq.active' + $amp + 'id=eq.' + $listingId
$feedB = Invoke-RestMethod -Uri $queryUri -Headers $headersB -Method Get

if ($feedB.Count -eq 0) {
    throw 'TEST FAILED: Student B cannot see Student A active listing!'
}
$found = $feedB[0]
Write-Host '[PASS] Multi-User Discovery Confirmed! Student B sees listing:' -ForegroundColor Green
Write-Host ('  Title: ' + $found.title) -ForegroundColor White
Write-Host ('  Price: Rs. ' + $found.price) -ForegroundColor White
Write-Host ('  Seller Name: ' + $found.seller.full_name) -ForegroundColor White
Write-Host ('  Seller Branch: ' + $found.seller.branch) -ForegroundColor White
Write-Host ('  Seller Verified: ' + $found.seller.is_verified) -ForegroundColor White
Write-Host ('  Image URL: ' + $found.images[0]) -ForegroundColor White

# --- STEP 6: STUDENT A UPDATES PRICE ---
Write-Host "`n[STEP 6] Student A updates listing price (Rs. 750 -> Rs. 650)..." -ForegroundColor Yellow
$updatePayload = @{
    price = 650
} | ConvertTo-Json
$patchUri = $supabaseUrl + '/rest/v1/listings?id=eq.' + $listingId
$updateRes = Invoke-RestMethod -Uri $patchUri -Headers $headersA -Method Patch -Body $updatePayload
Write-Host ('[PASS] Price updated by Student A to Rs. ' + $updateRes[0].price) -ForegroundColor Green

# --- STEP 7: STUDENT B SEES UPDATED PRICE ---
Write-Host "`n[STEP 7] Student B re-checks the item price..." -ForegroundColor Yellow
$priceCheckUri = $supabaseUrl + '/rest/v1/listings?id=eq.' + $listingId + $amp + 'select=id,price'
$feedUpdated = Invoke-RestMethod -Uri $priceCheckUri -Headers $headersB -Method Get
if ($feedUpdated[0].price -ne 650) {
    throw ('TEST FAILED: Price update did not propagate! Expected 650, got ' + $feedUpdated[0].price)
}
Write-Host ('[PASS] Confirmed: Student B sees new price Rs. ' + $feedUpdated[0].price) -ForegroundColor Green

# --- STEP 8: NEGATIVE TEST (IDOR ATTACK) ---
Write-Host "`n[STEP 8] Negative Security Test: Student B attempts unauthorized edit of Student A listing..." -ForegroundColor Yellow
$idorPayload = @{ price = 10 } | ConvertTo-Json
$idorRes = Invoke-RestMethod -Uri $patchUri -Headers $headersB -Method Patch -Body $idorPayload
if ($idorRes.Count -ne 0) {
    throw 'SECURITY ALERT: IDOR test failed! Student B was able to modify Student A listing!'
}
Write-Host '[PASS] RLS IDOR Blocked: Student B update returned 0 rows modified (as expected under RLS).' -ForegroundColor Green

# --- STEP 9: STUDENT A MARKS AS SOLD ---
Write-Host "`n[STEP 9] Student A marks listing as sold..." -ForegroundColor Yellow
$soldPayload = @{
    status = 'sold'
} | ConvertTo-Json
$soldRes = Invoke-RestMethod -Uri $patchUri -Headers $headersA -Method Patch -Body $soldPayload
Write-Host ('[PASS] Status updated to ' + $soldRes[0].status) -ForegroundColor Green

# --- STEP 10: STUDENT B MARKETPLACE FEED EXCLUSION ---
Write-Host "`n[STEP 10] Student B queries active marketplace feed..." -ForegroundColor Yellow
$feedAfterSoldUri = $supabaseUrl + '/rest/v1/listings?status=eq.active' + $amp + 'id=eq.' + $listingId
$feedAfterSold = Invoke-RestMethod -Uri $feedAfterSoldUri -Headers $headersB -Method Get
if ($feedAfterSold.Count -ne 0) {
    throw 'TEST FAILED: Sold item still visible in active marketplace feed for Student B!'
}
Write-Host '[PASS] Confirmed: Sold listing successfully removed from active discovery feed for other students.' -ForegroundColor Green

# --- STEP 11: STUDENT A MY LISTINGS ---
Write-Host "`n[STEP 11] Student A views My Listings..." -ForegroundColor Yellow
$myListingsUri = $supabaseUrl + '/rest/v1/listings?seller_id=eq.' + $userA.UserId + $amp + 'id=eq.' + $listingId
$myListingsA = Invoke-RestMethod -Uri $myListingsUri -Headers $headersA -Method Get
$statusA = $myListingsA[0].status
if ($myListingsA.Count -eq 0 -or $statusA -ne 'sold') {
    throw 'TEST FAILED: Sold listing should remain in Student A own profile listings!'
}
Write-Host ('[PASS] Confirmed: Item remains in Student A profile with status ' + $statusA) -ForegroundColor Green

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host '     ALL 11 BACKEND INTEGRATION TESTS PASSED!           ' -ForegroundColor Green
Write-Host '========================================================' -ForegroundColor Cyan
