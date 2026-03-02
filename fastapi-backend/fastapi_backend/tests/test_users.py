USER_PAYLOAD = {
    "name": "Alice",
    "email": "alice@example.com",
    "user_type": "student",
    "user_image": "img.png",
    "user_login": 0,
    "password": "secret",
}


def test_list_users_empty(client):
    response = client.get("/api/v1/users/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_user(client):
    response = client.post("/api/v1/users/", json=USER_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == USER_PAYLOAD["email"]
    assert data["name"] == USER_PAYLOAD["name"]
    assert "uid" in data


def test_create_user_duplicate_email(client):
    client.post("/api/v1/users/", json=USER_PAYLOAD)
    response = client.post("/api/v1/users/", json=USER_PAYLOAD)
    assert response.status_code == 409


def test_get_user(client):
    created = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    uid = created["uid"]
    response = client.get(f"/api/v1/users/{uid}")
    assert response.status_code == 200
    assert response.json()["uid"] == uid


def test_get_user_not_found(client):
    response = client.get("/api/v1/users/9999")
    assert response.status_code == 404


def test_update_user(client):
    created = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    uid = created["uid"]
    response = client.patch(f"/api/v1/users/{uid}", json={"name": "Alice Updated"})
    assert response.status_code == 200
    assert response.json()["name"] == "Alice Updated"


def test_update_user_not_found(client):
    response = client.patch("/api/v1/users/9999", json={"name": "Ghost"})
    assert response.status_code == 404


def test_list_users_after_create(client):
    client.post("/api/v1/users/", json=USER_PAYLOAD)
    response = client.get("/api/v1/users/")
    assert response.status_code == 200
    assert len(response.json()) == 1
