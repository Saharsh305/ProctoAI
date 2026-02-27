from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class LongTest(Base):
    __tablename__ = "longtest"

    longtest_qid: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    test_id: Mapped[str] = mapped_column(String(100), nullable=False)
    qid: Mapped[int] = mapped_column(Integer, nullable=False)
    ans: Mapped[str] = mapped_column(Text, nullable=False)
    marks: Mapped[int] = mapped_column(Integer, nullable=False)

    uid: Mapped[int] = mapped_column(ForeignKey("users.uid"), nullable=False, index=True)
    user = relationship("User", back_populates="longtests")
