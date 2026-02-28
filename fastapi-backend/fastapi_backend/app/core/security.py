from typing import Dict, List

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.models.role import Role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

ALGORITHM = "HS256"


def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    """Decode JWT and return user dict.
    
    Raises HTTPException 401 if token is invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user = {
            "user_id": user_id,
            "role": payload.get("role"),
            "email": payload.get("email"),
        }
        return user
    except JWTError:
        raise credentials_exception


def require_role(allowed_roles: List[Role]):
    """Create a dependency that requires one of the specified roles.
    
    Raises HTTPException 403 if user role is not in allowed_roles.
    """
    def role_checker(current_user: Dict = Depends(get_current_user)) -> Dict:
        user_role = current_user.get("role")
        allowed_role_values = [role.value for role in allowed_roles]
        if user_role not in allowed_role_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user
    return role_checker


def require_admin(current_user: Dict = Depends(get_current_user)) -> Dict:
    """Dependency that requires admin role.
    
    Raises HTTPException 403 if user is not an admin.
    """
    user_role = current_user.get("role")
    if user_role != Role.ROLE_ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


def require_student(current_user: Dict = Depends(get_current_user)) -> Dict:
    """Dependency that requires student role.
    
    Raises HTTPException 403 if user is not a student.
    """
    user_role = current_user.get("role")
    if user_role != Role.ROLE_STUDENT.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required",
        )
    return current_user
