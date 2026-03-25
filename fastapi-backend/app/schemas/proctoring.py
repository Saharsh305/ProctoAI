import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProctoringLogBase(BaseModel):
    email: str
    name: str
    test_id: str
    voice_db: int = 0
    img_log: str
    user_movements_updown: int
    user_movements_lr: int
    user_movements_eyes: int
    phone_detection: int
    person_status: int
    uid: uuid.UUID


class ProctoringLogCreate(ProctoringLogBase):
    pass


class ProctoringLogOut(ProctoringLogBase):
    model_config = ConfigDict(from_attributes=True)

    pid: int
    log_time: datetime


# ── Lightweight violation schemas (Sprint 2) ──────────

class ViolationBase(BaseModel):
    email: str
    test_id: str
    violation_type: str          # tab_switch | face_absent | multiple_faces | audio_violation
    message: str
    severity: str = "warning"    # info | warning | critical
    metadata_json: str | None = None
    uid: uuid.UUID


class ViolationCreate(ViolationBase):
    pass


class ViolationOut(ViolationBase):
    model_config = ConfigDict(from_attributes=True)

    vid: int
    created_at: datetime
