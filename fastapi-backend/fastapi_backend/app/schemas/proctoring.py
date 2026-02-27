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
    uid: int


class ProctoringLogCreate(ProctoringLogBase):
    pass


class ProctoringLogOut(ProctoringLogBase):
    model_config = ConfigDict(from_attributes=True)

    pid: int
    log_time: datetime
