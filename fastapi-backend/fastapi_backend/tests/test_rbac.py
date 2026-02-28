"""Integration tests for RBAC functionality."""
import pytest
from fastapi import status


class TestExamCreateRBAC:
    """Test RBAC for /exam/create endpoint."""

    def test_exam_create_returns_403_for_student_token(self, client, student_headers):
        """Test that /exam/create returns 403 for student token."""
        exam_data = {
            "test_id": "TEST001",
            "test_type": "mcq",
            "subject": "Math",
            "topic": "Algebra",
            "duration": 60
        }
        response = client.post(
            "/api/v1/exam/create",
            json=exam_data,
            headers=student_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Admin access required" in response.json()["detail"]

    def test_exam_create_success_for_admin_token(self, client, admin_headers):
        """Test that /exam/create succeeds for admin token."""
        exam_data = {
            "test_id": "TEST001",
            "test_type": "mcq",
            "subject": "Math",
            "topic": "Algebra",
            "duration": 60
        }
        response = client.post(
            "/api/v1/exam/create",
            json=exam_data,
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["message"] == "Exam created successfully"
        assert data["test_id"] == "TEST001"
        assert data["created_by"] == "admin@example.com"

    def test_exam_create_returns_401_without_token(self, client):
        """Test that /exam/create returns 401 without token."""
        exam_data = {
            "test_id": "TEST001",
            "test_type": "mcq",
            "subject": "Math",
            "topic": "Algebra",
            "duration": 60
        }
        response = client.post("/api/v1/exam/create", json=exam_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestStudentDashboardRBAC:
    """Test RBAC for /exam/student/dashboard endpoint."""

    def test_student_dashboard_success_for_student_token(self, client, student_headers):
        """Test that student dashboard succeeds for student token."""
        response = client.get(
            "/api/v1/exam/student/dashboard",
            headers=student_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Student dashboard"
        assert data["user"] == "student@example.com"

    def test_student_dashboard_returns_403_for_admin_token(self, client, admin_headers):
        """Test that student dashboard returns 403 for admin token."""
        response = client.get(
            "/api/v1/exam/student/dashboard",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Student access required" in response.json()["detail"]


class TestExamListRBAC:
    """Test RBAC for /exam/list endpoint."""

    def test_exam_list_accessible_by_admin(self, client, admin_headers):
        """Test that exam list is accessible by admin."""
        response = client.get("/api/v1/exam/list", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK

    def test_exam_list_accessible_by_student(self, client, student_headers):
        """Test that exam list is accessible by student."""
        response = client.get("/api/v1/exam/list", headers=student_headers)
        assert response.status_code == status.HTTP_200_OK

    def test_exam_list_returns_401_without_token(self, client):
        """Test that exam list returns 401 without token."""
        response = client.get("/api/v1/exam/list")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestGetCurrentUser:
    """Test get_current_user dependency function."""

    def test_invalid_token_returns_401(self, client):
        """Test that invalid token returns 401."""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/v1/exam/list", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Could not validate credentials" in response.json()["detail"]

    def test_expired_token_returns_401(self, client):
        """Test that expired token returns 401."""
        from datetime import datetime, timedelta, timezone
        from jose import jwt
        from app.core.config import settings
        from app.core.security import ALGORITHM

        # Create an expired token
        expire = datetime.now(timezone.utc) - timedelta(minutes=30)
        payload = {
            "sub": "1",
            "role": "admin",
            "email": "test@example.com",
            "exp": expire,
        }
        expired_token = jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)
        headers = {"Authorization": f"Bearer {expired_token}"}

        response = client.get("/api/v1/exam/list", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestRoleEnum:
    """Test Role enum definition."""

    def test_role_enum_values(self):
        """Test that Role enum has expected values."""
        from app.models.role import Role

        assert Role.ROLE_ADMIN.value == "admin"
        assert Role.ROLE_STUDENT.value == "student"

    def test_role_enum_is_string_enum(self):
        """Test that Role enum extends str."""
        from app.models.role import Role

        assert isinstance(Role.ROLE_ADMIN, str)
        assert isinstance(Role.ROLE_STUDENT, str)
