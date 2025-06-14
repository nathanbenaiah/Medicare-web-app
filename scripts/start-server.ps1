Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   MediCare+ Dashboard Development Server" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Node.js development server..." -ForegroundColor Green
Write-Host ""

Write-Host "Dashboard will be available at:" -ForegroundColor White
Write-Host "  - User Dashboard: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000/html/user-dashboard-modern.html" -ForegroundColor Blue
Write-Host "  - Test Page: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000/html/dashboard-test.html" -ForegroundColor Blue
Write-Host "  - Home Page: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000/html/index.html" -ForegroundColor Blue
Write-Host ""

Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    # Start the Node.js HTTP server
    node server.js
} catch {
    Write-Host "Error: Node.js not found or HTTP server failed to start" -ForegroundColor Red
    Write-Host "Please ensure Node.js is installed and available in your PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Try running this command directly:" -ForegroundColor White
    Write-Host "node server.js" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
Read-Host 