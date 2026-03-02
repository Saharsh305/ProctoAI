import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import RoleEnum


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: RoleEnum
    user_image: str
    user_login: int


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    password: str | None = None
    role: RoleEnum | None = None
    user_image: str | None = None
    user_login: int | None = None
    examcredits: int | None = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    created_at: datetime
    examcredits: int
