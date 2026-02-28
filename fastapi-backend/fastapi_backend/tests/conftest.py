from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from jose import jwt

from app.main import app
from app.core.config import settings
from app.core.security import ALGORITHM
from app.models.role import Role


@pytest.fixture
def client():
    """Provide a test client for the FastAPI app."""
    return TestClient(app)


def create_test_token(user_id: str, role: str, email: str = "test@example.com") -> str:
    """Create a JWT token for testing purposes."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload = {
        "sub": user_id,
        "role": role,
        "email": email,
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


@pytest.fixture
def admin_token():
    """Create an admin JWT token."""
    return create_test_token(
        user_id="1",
        role=Role.ROLE_ADMIN.value,
        email="admin@example.com"
    )


@pytest.fixture
def student_token():
    """Create a student JWT token."""
    return create_test_token(
        user_id="2",
        role=Role.ROLE_STUDENT.value,
        email="student@example.com"
    )


@pytest.fixture
def admin_headers(admin_token):
    """Return auth headers for admin user."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def student_headers(student_token):
    """Return auth headers for student user."""
    return {"Authorization": f"Bearer {student_token}"}
