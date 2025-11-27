@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo Rutgers Snipper - Windows Installer
echo ==========================================

:: 1. Check Prerequisites
echo [1/3] Checking Prerequisites...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)
echo - Python found.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo - Node.js found.

:: 2. Backend Setup
echo.
echo [2/3] Setting up Backend (Python)...
cd backend

if not exist .venv (
    echo - Creating virtual environment...
    python -m venv .venv
)

echo - Activating virtual environment...
call .venv\Scripts\activate

echo - Installing Python dependencies...
pip install fastapi uvicorn requests pydantic
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b 1
)

cd ..

:: 3. Frontend Setup
echo.
echo [3/3] Setting up Frontend (Node.js)...
cd frontend

echo - Installing Node modules (this may take a while)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node dependencies.
    pause
    exit /b 1
)

cd ..

echo.
echo ==========================================
echo Installation Complete!
echo ==========================================
echo.
echo You can now start the application by running:
echo run.bat
echo.
pause
