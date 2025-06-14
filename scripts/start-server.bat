@echo off
echo.
echo ===============================================
echo   MediCare+ Dashboard Development Server
echo ===============================================
echo.
echo Starting Node.js development server...
echo.
echo Dashboard will be available at:
echo   - User Dashboard: http://localhost:8000/html/user-dashboard-modern.html
echo   - Test Page: http://localhost:8000/html/dashboard-test.html
echo   - Status Check: http://localhost:8000/test-dashboard.html
echo   - Home Page: http://localhost:8000/html/index.html
echo   - Working Dashboard: http://localhost:8000/working-dashboard.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the Node.js HTTP server
node server.js

pause 