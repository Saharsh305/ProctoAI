from sqlalchemy.orm import Session

from app.models.exam import Exam
from app.schemas.exam import ExamCreate


def create(db: Session, exam_in: ExamCreate) -> Exam:
    exam = Exam(
        title=exam_in.title,
        duration=exam_in.duration,
        startTime=exam_in.startTime,
        rules=exam_in.rules,
        status=exam_in.status,
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam
