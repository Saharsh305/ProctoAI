import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.admin_action import AdminAction
from app.models.violation import Violation
from app.schemas.admin import AdminActionCreate


# ── Admin Action CRUD ────────────────────────────────

def create_action(
    db: Session,
    payload: AdminActionCreate,
    performed_by: uuid.UUID,
) -> AdminAction:
    """Record an admin action (warn / invalidate / ban) against a violation."""
    action = AdminAction(
        violation_id=payload.violation_id,
        action_type=payload.action_type,
        reason=payload.reason,
        performed_by=performed_by,
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action


def list_actions(
    db: Session,
    violation_id: int | None = None,
    performed_by: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[AdminAction]:
    """List admin actions with optional filters."""
    stmt = select(AdminAction)
    if violation_id is not None:
        stmt = stmt.where(AdminAction.violation_id == violation_id)
    if performed_by is not None:
        stmt = stmt.where(AdminAction.performed_by == performed_by)
    stmt = stmt.order_by(AdminAction.performed_at.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def list_violations_with_actions(
    db: Session,
    email: str | None = None,
    test_id: str | None = None,
    violation_type: str | None = None,
    severity: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Violation]:
    """List violations with eagerly loaded admin_actions for the admin dashboard."""
    stmt = select(Violation).options(joinedload(Violation.admin_actions))
    if email:
        stmt = stmt.where(Violation.email == email)
    if test_id:
        stmt = stmt.where(Violation.test_id == test_id)
    if violation_type:
        stmt = stmt.where(Violation.violation_type == violation_type)
    if severity:
        stmt = stmt.where(Violation.severity == severity)
    stmt = stmt.order_by(Violation.created_at.desc()).offset(skip).limit(limit)
    # unique() required when using joinedload with collections
    return list(db.execute(stmt).unique().scalars().all())


def count_violations(
    db: Session,
    email: str | None = None,
    test_id: str | None = None,
) -> int:
    """Return total violation count (for dashboard stats)."""
    from sqlalchemy import func
    stmt = select(func.count(Violation.vid))
    if email:
        stmt = stmt.where(Violation.email == email)
    if test_id:
        stmt = stmt.where(Violation.test_id == test_id)
    return db.execute(stmt).scalar_one()
