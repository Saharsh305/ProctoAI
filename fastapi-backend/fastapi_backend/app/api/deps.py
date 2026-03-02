from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import SessionLocal
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Validate Bearer JWT and return the corresponding User."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        uid_str: str | None = payload.get("sub")
        if uid_str is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    from app import crud  # local import to avoid circular dependency

    user = crud.get_user_by_id(db, int(uid_str))
    if user is None:
        raise credentials_exception
    return user


def require_role(*roles: str):
    """Dependency factory that restricts access to users with given roles."""

    def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.user_type not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for your role",
            )
        return current_user

    return _check

