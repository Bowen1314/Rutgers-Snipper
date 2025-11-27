import requests
import time
import threading
import logging
import datetime
from typing import List, Dict, Set, Optional

# Configuration
API_YEAR = 2026
API_TERM = 1
CAMPUS = "NB"
SLEEP_SEC = 30

# Global State
course_codes: Set[str] = set()
index_codes: Set[str] = set()
monitoring: bool = False
cached_data: List[Dict] = []
index_status: Dict[str, bool] = {}
last_scan_time: Optional[str] = None
lock = threading.Lock()

logger = logging.getLogger("sniper")

def load_all_courses():
    url = "https://classes.rutgers.edu/soc/api/courses.json"
    params = {"year": API_YEAR, "term": API_TERM, "campus": CAMPUS}
    try:
        r = requests.get(url, params=params, timeout=20)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        logger.error(f"加载课程失败: {e}")
        return []

def find_index_in_data(target_index, data):
    for course in data:
        for section in course.get("sections", []):
            if section.get("index") == target_index:
                return {
                    "index": target_index,
                    "title": course.get("title"),
                    "code": course.get("courseString"),
                    "status": section.get("openStatus", False),
                    "instructors": ", ".join([i.get("name", "") for i in section.get("instructors", [])]) or "待定",
                    "subject": course.get("subject"),
                    "courseNumber": course.get("courseNumber")
                }
    return None

import subprocess

# ... (imports)

import platform
import os

def play_alert():
    try:
        system_name = platform.system()
        mp3_path = os.path.abspath("music.mp3")
        
        if system_name == "Darwin":  # macOS
            subprocess.Popen(["afplay", mp3_path])
        elif system_name == "Windows":
            # Use PowerShell to play audio without external dependencies
            cmd = f'powershell -c (New-Object Media.SoundPlayer "{mp3_path}").PlaySync()'
            subprocess.Popen(cmd, shell=True)
        else:
            logger.warning(f"暂不支持在此系统 ({system_name}) 播放音频")
            
        logger.info("播放提示音")
    except Exception as e:
        logger.error(f"播放提示音失败: {e}")

def monitor_loop():
    global cached_data, monitoring, last_scan_time, SLEEP_SEC
    while True:
        if not monitoring:
            time.sleep(1)
            continue

        logger.info("正在扫描...")
        new_data = load_all_courses()
        if new_data:
            with lock:
                cached_data = new_data
                last_scan_time = datetime.datetime.now().strftime("%H:%M:%S")
                
                # Collect all indices to check (from direct indices AND monitored courses)
                indices_to_check = set(index_codes)
                
                # Add indices from monitored courses
                for code in course_codes:
                    # Match logic (same as in get_status)
                    found_course = None
                    try:
                        parts = code.split(":")
                        if len(parts) >= 2:
                            subject, course_num = parts[-2:]
                            for course in cached_data:
                                api_subject = str(course.get("subject", ""))
                                api_course_num = str(course.get("courseNumber", ""))
                                if api_subject == subject and api_course_num == course_num:
                                    found_course = course
                                    break
                    except Exception:
                        pass
                    
                    if not found_course:
                        found_course = next((c for c in cached_data if c.get("courseString") == code), None)
                    if not found_course:
                        found_course = next((c for c in cached_data if code in c.get("courseString", "")), None)
                        
                    if found_course:
                        for section in found_course.get("sections", []):
                            indices_to_check.add(section.get("index"))

                # Check status for all collected indices
                should_alert = False
                for idx in indices_to_check:
                    result = find_index_in_data(idx, cached_data)
                    if result:
                        now = result["status"]
                        prev = index_status.get(idx)
                        
                        # Alert if status changed from False (Closed) to True (Open)
                        if prev is False and now:
                            logger.info(f"开启: {result['code']} Index {idx}")
                            should_alert = True
                        
                        index_status[idx] = now
                
                if should_alert:
                    play_alert()
        
        time.sleep(SLEEP_SEC)

# Start background thread
t = threading.Thread(target=monitor_loop, daemon=True)
t.start()

def start_monitoring():
    global monitoring
    with lock:
        if not index_codes and not course_codes:
            logger.warning("监控列表为空，无法启动")
            return False
        monitoring = True
        logger.info("监控已启动")
        return True

def stop_monitoring():
    global monitoring
    monitoring = False
    logger.info("监控已停止")

def trigger_scan():
    """Trigger a single scan in background if not already monitoring"""
    def scan_task():
        global cached_data, last_scan_time
        logger.info("触发一次性扫描...")
        new_data = load_all_courses()
        if new_data:
            with lock:
                cached_data = new_data
                last_scan_time = datetime.datetime.now().strftime("%H:%M:%S")
                logger.info("一次性扫描完成")

    if not monitoring:
        threading.Thread(target=scan_task, daemon=True).start()

def add_target(target: str):
    with lock:
        if target.isdigit():
            index_codes.add(target)
            logger.info(f"添加监控 Index: {target}")
        else:
            # Basic validation/normalization
            target = target.strip()
            course_codes.add(target)
            logger.info(f"添加监控课程: {target}")
    
    # Trigger a scan to populate data immediately if cache is empty
    if not cached_data:
        trigger_scan()

def remove_target(target: str):
    global monitoring
    with lock:
        if target in index_codes:
            index_codes.remove(target)
            index_status.pop(target, None)
            logger.info(f"移除监控 Index: {target}")
        elif target in course_codes:
            course_codes.remove(target)
            logger.info(f"移除监控课程: {target}")
        
        if not index_codes and not course_codes and monitoring:
            monitoring = False
            logger.info("监控列表为空，自动停止监控")

def update_settings(interval: int):
    global SLEEP_SEC
    with lock:
        SLEEP_SEC = max(1, interval) # Minimum 1 second
        logger.info(f"扫描间隔已更新为 {SLEEP_SEC} 秒")

def get_status():
    with lock:
        # Build current status report
        indices_list = []
        for idx in index_codes:
            res = find_index_in_data(idx, cached_data)
            if res:
                indices_list.append({
                    "code": res["code"],
                    "title": res["title"],
                    "status": "开启" if res["status"] else "关闭",
                    "instructors": res["instructors"],
                    "index": idx
                })
            else:
                indices_list.append({
                    "code": "未知",
                    "title": "加载中...",
                    "status": "未知",
                    "index": idx
                })
        
        courses_list = []
        for code in course_codes:
            found_course = None
            
            # Logic from user script: split by : and take last two parts
            try:
                parts = code.split(":")
                if len(parts) >= 2:
                    subject, course_num = parts[-2:]
                    # Find in cached_data
                    for course in cached_data:
                        # API might return int or string, ensure comparison is robust
                        api_subject = str(course.get("subject", ""))
                        api_course_num = str(course.get("courseNumber", ""))
                        
                        if api_subject == subject and api_course_num == course_num:
                            found_course = course
                            break
            except Exception as e:
                logger.error(f"Error matching course {code}: {e}")

            # Fallback to exact/fuzzy string match if parsing failed or not found
            if not found_course:
                found_course = next((c for c in cached_data if c.get("courseString") == code), None)
            if not found_course:
                found_course = next((c for c in cached_data if code in c.get("courseString", "")), None)

            if found_course:
                raw_sections = found_course.get("sections", [])
                logger.info(f"Found course {found_course.get('courseString')}")
                logger.info(f"Sections type: {type(raw_sections)}")
                logger.info(f"Sections count: {len(raw_sections)}")
                if raw_sections:
                    logger.info(f"First section sample: {raw_sections[0]}")
                
                sections = []
                for section in raw_sections:
                    sections.append({
                        "index": section.get("index"),
                        "status": "开启" if section.get("openStatus") else "关闭",
                        "instructors": ", ".join([i.get("name", "") for i in section.get("instructors", [])]) or "待定"
                    })
                
                courses_list.append({
                    "code": found_course.get("courseString"),
                    "title": found_course.get("title"),
                    "status": "监控中",
                    "sections": sections
                })
            else:
                logger.warning(f"Course {code} not found in cache (size: {len(cached_data)})")
                courses_list.append({
                    "code": code,
                    "title": "加载中..." if not cached_data else "未找到课程",
                    "status": "未知",
                    "sections": []
                })

        return {
            "indices": indices_list,
            "courses": courses_list,
            "monitoring": monitoring,
            "last_scan_time": last_scan_time,
            "scan_interval": SLEEP_SEC
        }
