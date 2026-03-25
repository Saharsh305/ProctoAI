"""CRUD operations for ExamReport (Sprint 4)."""
from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.exam_report import ExamReport


def create(db: Session, **kwargs) -> ExamReport:
    """Insert a new exam report row."""
    report = ExamReport(**kwargs)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_by_id(db: Session, report_id: int) -> ExamReport | None:
    return db.get(ExamReport, report_id)


def get_by_exam_and_email(
    db: Session, test_id: str, email: str
) -> ExamReport | None:
    """Return the latest report for a student on a specific exam."""
    stmt = (
        select(ExamReport)
        .where(ExamReport.test_id == test_id, ExamReport.email == email)
        .order_by(ExamReport.generated_at.desc())
        .limit(1)
    )
    return db.execute(stmt).scalar_one_or_none()


def list_reports(
    db: Session,
    test_id: str | None = None,
    email: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[ExamReport]:
    stmt = select(ExamReport)
    if test_id:
        stmt = stmt.where(ExamReport.test_id == test_id)
    if email:
        stmt = stmt.where(ExamReport.email == email)
    stmt = stmt.order_by(ExamReport.generated_at.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def update_pdf_path(db: Session, report_id: int, pdf_path: str) -> ExamReport | None:
    report = db.get(ExamReport, report_id)
    if report:
        report.pdf_path = pdf_path
        db.commit()
        db.refresh(report)
    return report
