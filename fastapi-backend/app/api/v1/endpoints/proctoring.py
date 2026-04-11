from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud
from app.schemas.proctoring import (
    ProctoringLogCreate,
    ProctoringLogOut,
    ViolationCreate,
    ViolationOut,
    ViolationBatchCreate,
    ViolationBatchResponse,
    EvidenceUploadRequest,
    EvidenceUploadResponse,
)
from app.services.violation_logger import violation_buffer, classify_violation
from app.core.storage import build_object_key, generate_presigned_put_url, get_public_object_url

router = APIRouter(prefix="/proctoring", tags=["proctoring"])


# ── Proctoring logs (original) ─────────────────────────

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


# ── Single violation (immediate write — Sprint 2) ─────

@router.post("/log_violation", response_model=ViolationOut, status_code=201)
def log_violation(payload: ViolationCreate, db: Session = Depends(get_db)):
    """Immediate single-violation write for low-frequency events."""
    return crud.create_violation(db, payload)


# ── Batch violations (async buffered — Sprint 3) ──────

@router.post("/log_violations_batch", response_model=ViolationBatchResponse, status_code=202)
def log_violations_batch(payload: ViolationBatchCreate):
    """
    Accept a batch of violations into the async write buffer.
    The buffer flushes to PostgreSQL every 2 seconds with 3× retry.
    Returns 202 Accepted immediately (< 500 ms target).
    """
    for item in payload.violations:
        violation_buffer.enqueue(item.model_dump())
    return ViolationBatchResponse(
        accepted=len(payload.violations),
        buffered=True,
        message=f"{len(payload.violations)} violation(s) accepted into write buffer",
    )


# ── Flush buffer (force write pending violations to DB) ──

@router.post("/flush", status_code=200)
async def flush_violation_buffer():
    """Force-flush all pending violations from the async buffer to the DB.
    Called before report generation to ensure all violations are persisted."""
    count = await violation_buffer._flush()
    return {"flushed": count, "message": f"{count} violation(s) flushed to database"}


# ── Violation listing ──────────────────────────────────

@router.get("/violations", response_model=list[ViolationOut])
def list_violations(
    email: str | None = None,
    test_id: str | None = None,
    violation_type: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.list_violations(
        db, email=email, test_id=test_id,
        violation_type=violation_type, skip=skip, limit=limit,
    )


# ── Evidence upload presigned URL (Sprint 3) ──────────

@router.post("/evidence/upload-url", response_model=EvidenceUploadResponse)
def get_evidence_upload_url(payload: EvidenceUploadRequest):
    """
    Generate a presigned PUT URL so the browser can upload a screenshot
    directly to MinIO (bypasses server bandwidth).
    """
    try:
        object_key = build_object_key(
            test_id=payload.test_id,
            email=payload.email,
            violation_type=payload.violation_type,
            timestamp_ms=payload.timestamp_ms,
        )
        upload_url = generate_presigned_put_url(object_key)
        object_url = get_public_object_url(object_key)
        return EvidenceUploadResponse(
            upload_url=upload_url,
            object_key=object_key,
            object_url=object_url,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate upload URL: {exc}")
