"""
Report API endpoints (Sprint 4 – REQ-11, REQ-12).

Provides:
  GET  /reports/trust-score          – compute trust score without persisting
  POST /reports/generate             – generate full report (trust + PDF)
  GET  /reports/                     – list reports
  GET  /reports/{report_id}          – get single report
  GET  /reports/{report_id}/pdf      – download PDF
"""

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud
from app.schemas.report import (
    TrustScoreRequest,
    TrustScoreResponse,
    ExamReportCreate,
    ExamReportOut,
    ExamReportSummary,
)
from app.services.trust_score import calculate_trust_score
from app.services.report_generator import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])


# ── Trust Score (standalone, no persistence) ──────────

@router.post("/trust-score", response_model=TrustScoreResponse)
def compute_trust_score(
    payload: TrustScoreRequest,
    db: Session = Depends(get_db),
):
    """Compute and return the trust score without generating a full report."""
    result = calculate_trust_score(db, payload.test_id, payload.email)
    return TrustScoreResponse(**result)


# ── Generate Report (trust + PDF) ─────────────────────

@router.post("/generate", response_model=ExamReportOut, status_code=201)
def generate_exam_report(
    payload: ExamReportCreate,
    db: Session = Depends(get_db),
):
    """
    Generate a full proctoring report:
    1. Calculate trust score from violations
    2. Build summary text
    3. Persist ExamReport row
    4. Render PDF via ReportLab
    Target: < 2 s.
    """
    # Optionally look up exam title
    exam = crud.get_exam_by_id(db, payload.test_id)
    exam_title = exam.title if exam else ""

    report = generate_report(
        db,
        test_id=payload.test_id,
        email=payload.email,
        uid=str(payload.uid),
        exam_title=exam_title,
    )
    return report


# ── List Reports ──────────────────────────────────────

@router.get("/", response_model=list[ExamReportSummary])
def list_reports(
    test_id: str | None = None,
    email: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.list_reports(db, test_id=test_id, email=email, skip=skip, limit=limit)


# ── Get Single Report ─────────────────────────────────

@router.get("/{report_id}", response_model=ExamReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = crud.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


# ── Download PDF ──────────────────────────────────────

@router.get("/{report_id}/pdf")
def download_report_pdf(report_id: int, db: Session = Depends(get_db)):
    """Stream the generated PDF file for download."""
    report = crud.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report.pdf_path:
        raise HTTPException(status_code=404, detail="PDF not generated yet")

    pdf_path = Path(report.pdf_path)
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="PDF file not found on disk")

    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=pdf_path.name,
    )
