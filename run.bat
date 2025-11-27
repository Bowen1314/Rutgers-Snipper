@echo off
echo ==========================================
echo Starting Rutgers Snipper...
echo ==========================================

:: Start Backend in a new window
echo Starting Backend Server...
start "Rutgers Snipper Backend" cmd /k "cd backend && .venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"

:: Start Frontend in a new window
echo Starting Frontend...
start "Rutgers Snipper Frontend" cmd /k "cd frontend && npm run dev -- --host"

echo.
echo Application is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Please wait a moment for the servers to initialize.
echo You can close the popup windows to stop the servers.
echo.
pause
