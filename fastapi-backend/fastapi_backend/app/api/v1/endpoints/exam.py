from typing import Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud
from app.schemas.teacher import TeacherCreate, TeacherOut
from app.core.security import require_admin, require_student, get_current_user

router = APIRouter(prefix="/exam", tags=["exam"])


class ExamCreate(BaseModel):
    test_id: str
    test_type: str
    subject: str
    topic: str
    duration: int


class ExamOut(BaseModel):
    message: str
    test_id: str
    created_by: str


@router.post("/create", response_model=ExamOut, status_code=201)
def create_exam(
    payload: ExamCreate,
    current_user: Dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Create a new exam. Requires admin role."""
    return ExamOut(
        message="Exam created successfully",
        test_id=payload.test_id,
        created_by=current_user.get("email", "unknown"),
    )


@router.get("/list")
def list_exams(
    current_user: Dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all exams. Accessible by authenticated users."""
    return {"message": "Exam list", "user": current_user.get("email")}


@router.get("/student/dashboard")
def student_dashboard(
    current_user: Dict = Depends(require_student),
):
    """Student dashboard. Requires student role."""
    return {"message": "Student dashboard", "user": current_user.get("email")}
