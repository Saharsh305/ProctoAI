from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud
from app.schemas.proctoring import ProctoringLogCreate, ProctoringLogOut

router = APIRouter(prefix="/proctoring", tags=["proctoring"])


@router.get("/logs", response_model=list[ProctoringLogOut])
def list_logs(
    email: str | None = None,
    test_id: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.list_logs(db, email=email, test_id=test_id, skip=skip, limit=limit)


@router.post("/logs", response_model=ProctoringLogOut, status_code=201)
def create_log(payload: ProctoringLogCreate, db: Session = Depends(get_db)):
    return crud.create_proctoring_log(db, payload)
