from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app import crud
from app.models.user import User
from app.schemas.exam import ExamCreate, ExamOut

router = APIRouter(prefix="/exam", tags=["exam"])


@router.post("/create", response_model=ExamOut, status_code=201)
def create_exam(
    payload: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Create a new exam. Restricted to admin role only."""
    return crud.create_exam(db, payload)
