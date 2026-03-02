from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.window_estimation_log import WindowEstimationLog
from app.schemas.window_events import WindowEventCreate


def create(db: Session, ev_in: WindowEventCreate) -> WindowEstimationLog:
    ev = WindowEstimationLog(**ev_in.model_dump())
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


def list_events(db: Session, email: str | None = None, test_id: str | None = None, skip: int = 0, limit: int = 100) -> list[WindowEstimationLog]:
    stmt = select(WindowEstimationLog)
    if email:
        stmt = stmt.where(WindowEstimationLog.email == email)
    if test_id:
        stmt = stmt.where(WindowEstimationLog.test_id == test_id)
    stmt = stmt.order_by(WindowEstimationLog.transaction_log.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())
