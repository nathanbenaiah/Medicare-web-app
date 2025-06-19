@echo off
echo 🚀 Starting MediCare+ with fixed configuration...
echo.

REM Kill any existing node processes
taskkill /F /FI "WINDOWTITLE eq Administrator:  MediCare" 2>nul
taskkill /F /FI "IMAGENAME eq node.exe" 2>nul

REM Wait for processes to terminate
timeout /t 2 /nobreak >nul

REM Set environment variables directly
set DEEPSEEK_API_KEY=sk-b8184eae23dc4da58b48abf95892d4c0
set DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
set DEEPSEEK_MODEL=deepseek-chat
set AI_TEMPERATURE=0.3
set AI_MAX_TOKENS=4000
set AI_TIMEOUT=30000
set NODE_ENV=development
set PORT=8000

echo ✅ Environment variables set
echo 🔑 API Key: %DEEPSEEK_API_KEY:~0,20%...
echo.

echo 📦 Starting server...
node server.js

pause 