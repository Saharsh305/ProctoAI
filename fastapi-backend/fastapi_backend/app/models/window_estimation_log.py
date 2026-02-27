from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, SmallInteger, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class WindowEstimationLog(Base):
    __tablename__ = "window_estimation_log"

    wid: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    test_id: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    window_event: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    transaction_log: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    uid: Mapped[int] = mapped_column(ForeignKey("users.uid"), nullable=False, index=True)
    user = relationship("User", back_populates="window_logs")
