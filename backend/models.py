from pydantic import BaseModel
from typing import List, Optional

class Section(BaseModel):
    index: str
    status: str
    instructors: Optional[str] = None

class Course(BaseModel):
    code: str
    title: Optional[str] = None
    status: str
    instructors: Optional[str] = None
    index: Optional[str] = None
    sections: Optional[List[Section]] = []

class AddRequest(BaseModel):
    target: str  # Can be index or course code

class RemoveRequest(BaseModel):
    target: str

class StatusResponse(BaseModel):
    indices: List[Course]
    courses: List[Course]
    monitoring: bool
    last_scan_time: Optional[str] = None
    scan_interval: int = 30

class SettingsRequest(BaseModel):
    interval: int
