from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.proctoring_log import ProctoringLog
from app.schemas.proctoring import ProctoringLogCreate


def create(db: Session, log_in: ProctoringLogCreate) -> ProctoringLog:
    log = ProctoringLog(**log_in.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def list_logs(db: Session, email: str | None = None, test_id: str | None = None, skip: int = 0, limit: int = 100) -> list[ProctoringLog]:
    stmt = select(ProctoringLog)
    if email:
        stmt = stmt.where(ProctoringLog.email == email)
    if test_id:
        stmt = stmt.where(ProctoringLog.test_id == test_id)
    stmt = stmt.order_by(ProctoringLog.log_time.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())
