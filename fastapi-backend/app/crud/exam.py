import uuid
from sqlalchemy.orm import Session

from app.models.exam import Exam
from app.schemas.exam import ExamCreate, ExamUpdate


def create(db: Session, exam_in: ExamCreate, creator_id: uuid.UUID) -> Exam:
    exam = Exam(
        title=exam_in.title,
        duration=exam_in.duration,
        startTime=exam_in.startTime,
        rules=exam_in.rules,
        status=exam_in.status,
        createdBy=creator_id,
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam


def list_exams(db: Session, skip: int = 0, limit: int = 100, created_by: uuid.UUID | None = None) -> list[Exam]:
    """List all exams with pagination. Optionally filter by creator."""
    query = db.query(Exam)
    if created_by:
        query = query.filter(Exam.createdBy == created_by)
    return query.offset(skip).limit(limit).all()


def get_by_id(db: Session, exam_id: uuid.UUID) -> Exam | None:
    """Get a single exam by its ID."""
    return db.query(Exam).filter(Exam.examId == exam_id).first()


def update(db: Session, exam_id: uuid.UUID, exam_in: ExamUpdate) -> Exam | None:
    """Update an exam by its ID."""
    exam = get_by_id(db, exam_id)
    if not exam:
        return None

    update_data = exam_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exam, field, value)

    db.commit()
    db.refresh(exam)
    return exam


def delete(db: Session, exam_id: uuid.UUID) -> bool:
    """Delete an exam by its ID."""
    exam = get_by_id(db, exam_id)
    if not exam:
        return False

    db.delete(exam)
    db.commit()
    return True
