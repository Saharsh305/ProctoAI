USER_PAYLOAD = {
    "name": "Dave",
    "email": "dave@example.com",
    "user_type": "student",
    "user_image": "img.png",
    "user_login": 0,
    "password": "secret",
}


def _log_payload(uid: int) -> dict:
    return {
        "email": "dave@example.com",
        "name": "Dave",
        "test_id": "TEST001",
        "voice_db": 0,
        "img_log": "base64imgdata",
        "user_movements_updown": 0,
        "user_movements_lr": 0,
        "user_movements_eyes": 0,
        "phone_detection": 0,
        "person_status": 1,
        "uid": uid,
    }


def test_list_logs_empty(client):
    response = client.get("/api/v1/proctoring/logs")
    assert response.status_code == 200
    assert response.json() == []


def test_create_log(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    payload = _log_payload(user["uid"])
    response = client.post("/api/v1/proctoring/logs", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "dave@example.com"
    assert "pid" in data


def test_list_logs_filter_by_email(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/proctoring/logs", json=_log_payload(user["uid"]))
    response = client.get("/api/v1/proctoring/logs", params={"email": "dave@example.com"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_logs_filter_by_test_id(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/proctoring/logs", json=_log_payload(user["uid"]))
    response = client.get("/api/v1/proctoring/logs", params={"test_id": "TEST001"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_logs_filter_no_match(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/proctoring/logs", json=_log_payload(user["uid"]))
    response = client.get("/api/v1/proctoring/logs", params={"email": "nobody@example.com"})
    assert response.status_code == 200
    assert response.json() == []
