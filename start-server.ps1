Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   🏥 Starting MediCare+ Server..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start the server
if ($args.Count -gt 0) {
    node scripts/server.js $args[0]
} else {
    node scripts/server.js
}

# Keep window open
Read-Host "Press Enter to exit" 