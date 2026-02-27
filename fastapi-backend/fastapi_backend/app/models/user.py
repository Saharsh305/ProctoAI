from __future__ import annotations

from datetime import datetime
from typing import List

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    uid: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    register_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    user_type: Mapped[str] = mapped_column(String(25), nullable=False)
    user_image: Mapped[str] = mapped_column(Text, nullable=False)
    user_login: Mapped[int] = mapped_column(Integer, nullable=False)
    examcredits: Mapped[int] = mapped_column(Integer, server_default="7", nullable=False)

    teachers: Mapped[List["Teacher"]] = relationship(back_populates="user")
    questions: Mapped[List["Question"]] = relationship(back_populates="user")
    students: Mapped[List["Student"]] = relationship(back_populates="user")
    student_test_infos: Mapped[List["StudentTestInfo"]] = relationship(back_populates="user")
    proctoring_logs: Mapped[List["ProctoringLog"]] = relationship(back_populates="user")
    window_logs: Mapped[List["WindowEstimationLog"]] = relationship(back_populates="user")
    longqas: Mapped[List["LongQA"]] = relationship(back_populates="user")
    longtests: Mapped[List["LongTest"]] = relationship(back_populates="user")
    practicalqas: Mapped[List["PracticalQA"]] = relationship(back_populates="user")
    practicaltests: Mapped[List["PracticalTest"]] = relationship(back_populates="user")
