@echo off
echo =====================================
echo MediCare+ Chat System Test Script
echo =====================================
echo.

:: Check if .env exists
if not exist .env (
    echo 📄 Creating .env file from template...
    copy env-template.txt .env >nul
    echo ✅ .env file created
    echo.
    echo ⚠️  Please edit .env and add your DEEPSEEK_API_KEY for full functionality
    echo ℹ️  For now, testing with placeholder key...
    echo.
)

:: Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

echo 🚀 Starting MediCare+ Chat Server for testing...
echo.

:: Start server in background
start /B node server.js

:: Wait for server to start
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak >nul

:: Test if server is running
echo 🔍 Testing server endpoints...
echo.

:: Test health endpoint
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8000/api/health' -TimeoutSec 5; Write-Host '✅ Health Check:' $response.status; } catch { Write-Host '❌ Health Check: Failed'; }"

:: Test chat endpoint
powershell -Command "try { $body = @{message='Hello'} | ConvertTo-Json; $response = Invoke-RestMethod -Uri 'http://localhost:8000/api/test-chat' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 5; Write-Host '✅ Chat Test:' $response.success; } catch { Write-Host '❌ Chat Test: Failed'; }"

echo.
echo 🌐 Server URLs:
echo   • Main Site: http://localhost:8000
echo   • Dashboard: http://localhost:8000/dashboard  
echo   • AI Chat: http://localhost:8000/chat
echo   • Health Check: http://localhost:8000/api/health
echo.
echo 📝 Testing Instructions:
echo   1. Open browser to http://localhost:8000
echo   2. Navigate to Dashboard to see chat widget
echo   3. Click "AI Chat" in navigation for standalone chat
echo   4. Test chat functionality with sample questions
echo.
echo 🛑 Press Ctrl+C to stop the server when testing is complete
echo.

:: Keep script open
pause 