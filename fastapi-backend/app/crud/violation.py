from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.violation import Violation
from app.schemas.proctoring import ViolationCreate


def create(db: Session, payload: ViolationCreate) -> Violation:
    violation = Violation(**payload.model_dump())
    db.add(violation)
    db.commit()
    db.refresh(violation)
    return violation


def list_violations(
    db: Session,
    email: str | None = None,
    test_id: str | None = None,
    violation_type: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Violation]:
    stmt = select(Violation)
    if email:
        stmt = stmt.where(Violation.email == email)
    if test_id:
        stmt = stmt.where(Violation.test_id == test_id)
    if violation_type:
        stmt = stmt.where(Violation.violation_type == violation_type)
    stmt = stmt.order_by(Violation.created_at.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())
