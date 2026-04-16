@echo off
REM Bill Payment API Testing - Setup Script
REM This script will clean and install all dependencies

echo.
echo ====================================
echo Bill Payment API - Setup Script
echo ====================================
echo.

echo Step 1: Removing old folders...
rmdir /s /q node_modules 2>nul
rmdir /s /q dist 2>nul
rmdir /s /q coverage 2>nul
rmdir /s /q reports 2>nul
echo [OK] Folders removed

echo.
echo Step 2: Installing dependencies...
echo This may take 3-5 minutes...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm install failed!
    echo Please make sure Node.js is installed
    pause
    exit /b 1
)

echo.
echo Step 3: Installing Playwright browsers...
call npx playwright install

echo.
echo ====================================
echo [SUCCESS] Setup complete!
echo ====================================
echo.
echo Next steps:
echo   1. Edit .env with your configuration
echo   2. Run: npm test
echo.
pause
