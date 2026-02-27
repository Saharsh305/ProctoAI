import uuid

def test_signup_success(client):
    email = f"user_{uuid.uuid4()}@example.com"

    response = client.post(
        "/auth/signup",
        json={
            "name": "Test User",
            "email": email,
            "password": "password123",
            "user_type": "student",
        },
    )

    assert response.status_code == 200


def test_signup_duplicate_email(client):
    client.post(
        "/auth/signup",
        json={
            "name": "User One",
            "email": "dup@example.com",
            "password": "password123",
            "user_type": "student",
        },
    )

    response = client.post(
        "/auth/signup",
        json={
            "name": "User Two",
            "email": "dup@example.com",
            "password": "password123",
            "user_type": "student",
        },
    )

    assert response.status_code == 400


def test_login_success(client):
    client.post(
        "/auth/signup",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "password123",
            "user_type": "student",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post(
        "/auth/signup",
        json={
            "name": "Wrong Pass",
            "email": "wrong@example.com",
            "password": "correctpass",
            "user_type": "student",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpass",
        },
    )

    assert response.status_code == 401


def test_protected_route(client):
    client.post(
        "/auth/signup",
        json={
            "name": "Protected User",
            "email": "protected@example.com",
            "password": "password123",
            "user_type": "student",
        },
    )

    login = client.post(
        "/auth/login",
        json={
            "email": "protected@example.com",
            "password": "password123",
        },
    )

    token = login.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200