from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.question import Question
from app.schemas.question import QuestionCreate


def get_by_id(db: Session, questions_uid: int) -> Question | None:
    return db.get(Question, questions_uid)


def list_questions(db: Session, skip: int = 0, limit: int = 100) -> list[Question]:
    stmt = select(Question).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create(db: Session, q_in: QuestionCreate) -> Question:
    question = Question(**q_in.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question
