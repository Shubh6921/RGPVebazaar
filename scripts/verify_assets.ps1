$urls = @(
    'http://localhost:3001/',
    'http://localhost:3001/styles/main.css',
    'http://localhost:3001/js/three-scene.js',
    'http://localhost:3001/js/cursor.js',
    'http://localhost:3001/js/search-palette.js',
    'http://localhost:3001/js/store.js',
    'http://localhost:3001/js/app.js'
)

foreach ($u in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $u -Method Get -UseBasicParsing -TimeoutSec 5
        Write-Host " [SUCCESS] $($r.StatusCode) OK - $u" -ForegroundColor Green
    } catch {
        Write-Host " [FAIL] $u - $($_.Exception.Message)" -ForegroundColor Red
    }
}
