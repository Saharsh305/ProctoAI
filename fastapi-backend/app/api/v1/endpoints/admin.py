import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin
from app.models.user import User
from app.crud.admin import (
    create_action,
    list_actions,
    list_violations_with_actions,
    count_violations,
)
from app.schemas.admin import AdminActionCreate, AdminActionOut, AdminViolationOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/violations", response_model=list[AdminViolationOut])
def admin_list_violations(
    email: str | None = None,
    test_id: str | None = None,
    violation_type: str | None = None,
    severity: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """List all violations with their admin action history.
    Supports filters by email, test_id, violation_type, severity.
    Restricted to admin role.
    """
    return list_violations_with_actions(
        db,
        email=email,
        test_id=test_id,
        violation_type=violation_type,
        severity=severity,
        skip=skip,
        limit=limit,
    )


@router.get("/violations/count")
def admin_count_violations(
    email: str | None = None,
    test_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Return total violation count for dashboard stats."""
    total = count_violations(db, email=email, test_id=test_id)
    return {"count": total}


@router.post("/actions", response_model=AdminActionOut, status_code=201)
def admin_perform_action(
    payload: AdminActionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Perform an admin action (warn / invalidate / ban) on a violation.
    Records an immutable audit-log entry.
    """
    # Validate action_type
    allowed = {"warn", "invalidate", "ban"}
    if payload.action_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"action_type must be one of: {', '.join(sorted(allowed))}",
        )

    # Verify violation exists
    from app.models.violation import Violation
    violation = db.get(Violation, payload.violation_id)
    if not violation:
        raise HTTPException(status_code=404, detail="Violation not found")

    return create_action(db, payload, performed_by=current_user.user_id)


@router.get("/actions", response_model=list[AdminActionOut])
def admin_list_actions(
    violation_id: int | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """List admin action audit log. Optionally filter by violation_id."""
    return list_actions(db, violation_id=violation_id, skip=skip, limit=limit)
