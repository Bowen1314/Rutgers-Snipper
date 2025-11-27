import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
import sniper

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")


app = FastAPI(title="Rutgers Sniper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status", response_model=models.StatusResponse)
def get_status():
    return sniper.get_status()

@app.post("/add")
def add_target(req: models.AddRequest):
    logger.info(f"Received add request: {req.target}")
    sniper.add_target(req.target)
    return {"message": f"已添加 {req.target}"}

@app.post("/remove")
def remove_target(req: models.RemoveRequest):
    sniper.remove_target(req.target)
    return {"message": f"已移除 {req.target}"}

@app.post("/start")
def start_monitoring():
    sniper.start_monitoring()
    return {"message": "监控已启动"}

@app.post("/stop")
def stop_monitoring():
    sniper.stop_monitoring()
    return {"message": "监控已停止"}

@app.post("/settings")
def update_settings(req: models.SettingsRequest):
    sniper.update_settings(req.interval)
    return {"message": f"扫描间隔已更新为 {req.interval} 秒"}
