import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_role
from app import crud
from app.models.user import User
from app.schemas.exam import ExamCreate, ExamUpdate, ExamOut
from app.schemas.question import QuestionCreate, QuestionUpdate, QuestionOut
from app.schemas.exam_submission import ExamSubmission, ExamSubmissionResponse

router = APIRouter(prefix="/exam", tags=["exam"])


@router.post("/create", response_model=ExamOut, status_code=201)
def create_exam(
    payload: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Create a new exam. Restricted to admin role only."""
    return crud.create_exam(db, payload, creator_id=current_user.userId)


@router.get("/list", response_model=list[ExamOut])
def list_exams(
    skip: int = 0,
    limit: int = 100,
    my_exams: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all exams. Accessible to both admin and student.
    Use my_exams=true to filter exams created by current user (admin only)."""
    created_by = None
    if my_exams and current_user.role == "admin":
        created_by = current_user.userId
    return crud.list_exams(db, skip=skip, limit=limit, created_by=created_by)


@router.get("/{exam_id}", response_model=ExamOut)
def get_exam(
    exam_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single exam by ID. Accessible to both admin and student."""
    exam = crud.get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


@router.get("/{exam_id}/questions", response_model=list[QuestionOut])
def list_exam_questions(
    exam_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all questions for a specific exam. Accessible to both admin and student."""
    # Verify exam exists
    exam = crud.get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return crud.list_questions_by_exam(db, exam_id, skip=skip, limit=limit)


@router.post("/{exam_id}/questions", response_model=QuestionOut, status_code=201)
def add_question_to_exam(
    exam_id: uuid.UUID,
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Add a question to an exam. Restricted to admin role only."""
    # Verify exam exists
    exam = crud.get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Ensure the question is associated with this exam
    payload.examId = exam_id
    return crud.create_question(db, payload)


@router.post("/{exam_id}/submit", response_model=ExamSubmissionResponse)
def submit_exam(
    exam_id: uuid.UUID,
    payload: ExamSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    """Submit exam answers. Restricted to student role only."""
    # Verify exam exists
    exam = crud.get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Verify exam IDs match
    if payload.examId != exam_id:
        raise HTTPException(status_code=400, detail="Exam ID mismatch")

    # Save each answer
    submitted_count = 0
    for answer in payload.answers:
        crud.create_answer(
            db=db,
            uid=current_user.user_id,
            exam_id=exam_id,
            test_id=str(exam_id),  # Using exam_id as test_id for consistency
            qid=answer.qid,
            answer=answer.answer,
            email=current_user.email
        )
        submitted_count += 1

    return ExamSubmissionResponse(
        message="Exam submitted successfully",
        submitted_count=submitted_count
    )


@router.put("/{exam_id}", response_model=ExamOut)
def update_exam(
    exam_id: uuid.UUID,
    payload: ExamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Update an exam. Restricted to admin role only."""
    exam = crud.update_exam(db, exam_id, payload)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


@router.delete("/{exam_id}", status_code=204)
def delete_exam(
    exam_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Delete an exam. Restricted to admin role only."""
    success = crud.delete_exam(db, exam_id)
    if not success:
        raise HTTPException(status_code=404, detail="Exam not found")
    return None


@router.put("/{exam_id}/questions/{question_id}", response_model=QuestionOut)
def update_question(
    exam_id: uuid.UUID,
    question_id: int,
    payload: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Update a question in an exam. Restricted to admin role only."""
    # Verify exam exists
    exam = crud.get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Update the question
    question = crud.update_question(db, question_id, payload)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Verify the question belongs to this exam
    if question.examId != exam_id:
        raise HTTPException(status_code=400, detail="Question does not belong to this exam")

    return question


@router.delete("/{exam_id}/questions/{question_id}", status_code=204)
def delete_question(
    exam_id: uuid.UUID,
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Delete a question from an exam. Restricted to admin role only."""
    # Verify exam exists
    exam = crud.get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Verify question exists and belongs to this exam
    question = crud.get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    if question.examId != exam_id:
        raise HTTPException(status_code=400, detail="Question does not belong to this exam")

    # Delete the question
    success = crud.delete_question(db, question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")

    return None
