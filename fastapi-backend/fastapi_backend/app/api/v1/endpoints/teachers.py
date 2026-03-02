from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud
from app.schemas.teacher import TeacherCreate, TeacherOut

router = APIRouter(prefix="/teachers", tags=["teachers"])


@router.get("/", response_model=list[TeacherOut])
def list_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_teachers(db, skip=skip, limit=limit)


@router.get("/{tid}", response_model=TeacherOut)
def get_teacher(tid: int, db: Session = Depends(get_db)):
    teacher = crud.get_teacher_by_id(db, tid)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher/test not found")
    return teacher


@router.post("/", response_model=TeacherOut, status_code=201)
def create_teacher(payload: TeacherCreate, db: Session = Depends(get_db)):
    return crud.create_teacher(db, payload)
