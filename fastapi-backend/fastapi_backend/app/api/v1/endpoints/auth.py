from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_role
from app import crud
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=201)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user. Returns the created user object."""
    if crud.get_user_by_email(db, str(payload.email)):
        raise HTTPException(status_code=409, detail="Email already registered")
    return crud.create_user(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return a JWT access token."""
    user = crud.authenticate_user(db, str(payload.email), payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": str(user.userId), "role": user.role.value})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user


@router.get("/admin-only", response_model=UserOut)
def admin_only(current_user: User = Depends(require_role("admin"))):
    """Example endpoint restricted to users with the 'admin' role."""
    return current_user


@router.get("/student-only", response_model=UserOut)
def student_only(current_user: User = Depends(require_role("student"))):
    """Example endpoint restricted to users with the 'student' role."""
    return current_user

