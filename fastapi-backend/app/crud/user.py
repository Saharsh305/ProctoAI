import uuid

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.get(User, user_id)


def get_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return db.execute(stmt).scalars().first()


def list_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    stmt = select(User).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create(db: Session, user_in: UserCreate) -> User:
    user = User(
        name=user_in.name,
        email=str(user_in.email),
        password_hash=hash_password(user_in.password),
        role=user_in.role,
        user_image=user_in.user_image,
        user_login=user_in.user_login,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate(db: Session, email: str, password: str) -> User | None:
    """Return the user if credentials are valid, else None."""
    user = get_by_email(db, email)
    if user is None or not verify_password(password, user.password_hash):
        return None
    return user


def update(db: Session, user: User, user_in: UserUpdate) -> User:
    data = user_in.model_dump(exclude_unset=True)
    if "password" in data:
        data["password_hash"] = hash_password(data.pop("password"))
    for k, v in data.items():
        setattr(user, k, v)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

