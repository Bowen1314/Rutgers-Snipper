#!/bin/bash

# Kill background processes on exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Start Backend
echo "启动后端 (Starting Backend)..."
cd backend
../.venv/bin/python -m uvicorn main:app --reload --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "启动前端 (Starting Frontend)..."
cd frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

echo "应用已启动！访问 http://localhost:5173"
echo "按 Ctrl+C 停止"

wait
