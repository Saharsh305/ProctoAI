from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate


def get_by_id(db: Session, tid: int) -> Teacher | None:
    return db.get(Teacher, tid)


def list_teachers(db: Session, skip: int = 0, limit: int = 100) -> list[Teacher]:
    stmt = select(Teacher).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create(db: Session, teacher_in: TeacherCreate) -> Teacher:
    teacher = Teacher(**teacher_in.model_dump(exclude_none=True))
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher
