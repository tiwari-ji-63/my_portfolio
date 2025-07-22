@echo off
echo Starting Portfolio Backend Server...
cd /d "d:\Pending Project\Portfolio\backend"
echo Current directory: %CD%
echo.
echo Checking if server.js exists...
if exist server.js (
    echo ✅ server.js found
    echo Starting server...
    node server.js
) else (
    echo ❌ server.js not found in current directory
    dir
)
pause
