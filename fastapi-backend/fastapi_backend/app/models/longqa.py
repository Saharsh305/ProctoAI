from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class LongQA(Base):
    __tablename__ = "longqa"

    longqa_qid: Mapped[int] = mapped_column(primary_key=True)
    test_id: Mapped[str] = mapped_column(String(100), nullable=False)
    qid: Mapped[str] = mapped_column(String(25), nullable=False)
    q: Mapped[str] = mapped_column(Text, nullable=False)
    marks: Mapped[int | None] = mapped_column(Integer, nullable=True)

    uid: Mapped[int | None] = mapped_column(ForeignKey("users.uid"), nullable=True, index=True)
    user = relationship("User", back_populates="longqas")
