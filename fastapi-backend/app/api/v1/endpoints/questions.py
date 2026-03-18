from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud
from app.schemas.question import QuestionCreate, QuestionOut

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("/", response_model=list[QuestionOut])
def list_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_questions(db, skip=skip, limit=limit)


@router.post("/", response_model=QuestionOut, status_code=201)
def create_question(payload: QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, payload)
