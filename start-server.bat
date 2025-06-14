@echo off
echo.
echo ===============================================
echo    🏥 Starting MediCare+ Server...
echo ===============================================
echo.

cd /d "%~dp0"
node scripts/server.js %1

pause 