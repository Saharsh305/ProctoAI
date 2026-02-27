from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    questions_uid: Mapped[int] = mapped_column(primary_key=True)
    test_id: Mapped[str] = mapped_column(String(100), nullable=False)
    qid: Mapped[str] = mapped_column(String(25), nullable=False)
    q: Mapped[str] = mapped_column(Text, nullable=False)
    a: Mapped[str] = mapped_column(String(100), nullable=False)
    b: Mapped[str] = mapped_column(String(100), nullable=False)
    c: Mapped[str] = mapped_column(String(100), nullable=False)
    d: Mapped[str] = mapped_column(String(100), nullable=False)
    ans: Mapped[str] = mapped_column(String(10), nullable=False)
    marks: Mapped[int] = mapped_column(Integer, nullable=False)

    uid: Mapped[int] = mapped_column(ForeignKey("users.uid"), nullable=False, index=True)
    user = relationship("User", back_populates="questions")
