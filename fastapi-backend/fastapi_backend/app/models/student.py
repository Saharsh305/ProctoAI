from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Student(Base):
    __tablename__ = "students"

    sid: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    test_id: Mapped[str] = mapped_column(String(100), nullable=False)
    qid: Mapped[str | None] = mapped_column(String(25), nullable=True)
    ans: Mapped[str | None] = mapped_column(Text, nullable=True)

    uid: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("users.userId"), nullable=False, index=True)
    user = relationship("User", back_populates="students")
