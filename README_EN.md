# Rutgers Snipper Deployment Guide | [中文文档](README.md) 


This is a Web application for monitoring Rutgers course status, consisting of a Python (FastAPI) backend and a React (Vite) frontend. When a monitored course section opens, the system will play a sound notification.

## 📋 Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: Usually installed with Node.js
- **OS**: macOS (Recommended, supports `afplay`), Linux, Windows

## 🚀 Quick Start

### 1. Initialize Environment

Run the following commands in the project root to install all dependencies:

```bash
# 1. Setup backend virtual environment and install dependencies
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn requests pydantic

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Return to root directory
cd ..
```

### 2. Prepare Audio File

Ensure there is a file named `music.mp3` in the project root directory. This file will be played when a course opens.

### 3. Start Application

#### macOS / Linux
Run the startup script in the project root:
```bash
chmod +x run.sh  # Grant execution permission if running for the first time
./run.sh
```

#### Windows
1. Double-click `install.bat` to install dependencies (first time only).
2. Double-click `run.bat` to start the application.

This script will launch:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173 (will open automatically or display link in terminal)

## 🛠️ Features

1. **Add Course**: 
   - Enter Course Code (e.g., `11:375:101` or `375:101`)
   - Or enter Index (e.g., `10193`)
   - Click "Add"

2. **Start Monitoring**:
   - After adding courses, click the "Start Monitoring" button.
   - The system will scan every 30 seconds (default).

3. **Sound Notification**:
   - When any monitored Section changes from **Closed** to **Open**, the system will automatically play `music.mp3`.

4. **View Details**:
   - Course cards display all Sections for that course along with their status (Open/Closed) and instructor information.

5. **Language Switching**:
   - Click the "CN/EN" button in the top navigation bar to switch between Chinese and English interfaces.

## ⚠️ Common Issues

- **Port Occupied**: If startup fails due to port occupation, try closing the process using the port or restart your computer.
- **No Sound**: 
  - Confirm `music.mp3` exists.
  - Confirm terminal has permission to play audio.
  - Audio playback is currently optimized for macOS (`afplay`).

## 📂 Directory Structure

```
Rutgers Snipper/
├── backend/            # Python FastAPI Backend
│   ├── main.py        # API Entry
│   ├── sniper.py      # Core Monitoring Logic
│   └── models.py      # Data Models
├── frontend/           # React Frontend
│   ├── src/           # Source Code
│   └── package.json   # Frontend Dependencies
├── run.sh             # One-click Startup Script
├── music.mp3          # Notification Sound
└── README.md          # Documentation
```
