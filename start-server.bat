@echo off
echo =====================================
echo MediCare+ AI Chat Server Launcher
echo =====================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if package.json exists
if not exist package.json (
    echo ❌ package.json not found
    echo Please make sure you're in the correct directory
    pause
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

:: Check if .env file exists
if not exist .env (
    echo ⚠️  No .env file found
    echo Creating .env file from template...
    copy env-template.txt .env >nul
    echo.
    echo ✅ Created .env file
    echo 📝 Please edit .env file and add your DEEPSEEK_API_KEY
    echo.
    echo Press any key to continue with demo mode...
    pause >nul
)

:: Start the server
echo 🚀 Starting MediCare+ AI Chat Server...
echo.
echo Server will be available at:
echo 🌐 Main site: http://localhost:8000
echo 💬 Chat interface: http://localhost:8000/chat
echo 📱 Dashboard: http://localhost:8000/dashboard
echo 💚 Health check: http://localhost:8000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js 