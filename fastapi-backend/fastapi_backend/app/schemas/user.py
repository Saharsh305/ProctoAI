from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr
    user_type: str
    user_image: str
    user_login: int


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    password: str | None = None
    user_type: str | None = None
    user_image: str | None = None
    user_login: int | None = None
    examcredits: int | None = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    uid: int
    register_time: datetime
    examcredits: int
