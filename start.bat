@echo off
title Portfolio Application Startup

echo 🚀 Starting Portfolio Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 🔍 Checking dependencies...

REM Start Backend Server
echo 🖥️  Starting Backend Server...
cd backend

if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    call npm install
)

echo 🔌 Starting backend on port 5000...
start "Backend Server" cmd /k "npm start"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start Frontend Server
echo 🎨 Starting Frontend Server...
cd ..\client

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

echo 🌐 Starting frontend on port 3000...
start "Frontend Server" cmd /k "npm start"

echo ✅ Application started successfully!
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000  
echo 🔗 Admin Panel: http://localhost:3000/admin
echo.
echo Press any key to exit...
pause >nul
