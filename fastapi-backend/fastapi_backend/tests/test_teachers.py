from datetime import datetime, timezone

USER_PAYLOAD = {
    "name": "Bob",
    "email": "bob@example.com",
    "user_type": "teacher",
    "user_image": "img.png",
    "user_login": 0,
    "password": "secret",
}


def _teacher_payload(uid: int) -> dict:
    return {
        "email": "bob@example.com",
        "test_id": "TEST001",
        "test_type": "mcq",
        "end": datetime(2030, 1, 1, tzinfo=timezone.utc).isoformat(),
        "duration": 60,
        "show_ans": 1,
        "password": "testpass",
        "subject": "Math",
        "topic": "Algebra",
        "neg_marks": 0,
        "calc": 0,
        "uid": uid,
    }


def test_list_teachers_empty(client):
    response = client.get("/api/v1/teachers/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_teacher(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    payload = _teacher_payload(user["uid"])
    response = client.post("/api/v1/teachers/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["test_id"] == "TEST001"
    assert "tid" in data


def test_get_teacher(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    created = client.post("/api/v1/teachers/", json=_teacher_payload(user["uid"])).json()
    tid = created["tid"]
    response = client.get(f"/api/v1/teachers/{tid}")
    assert response.status_code == 200
    assert response.json()["tid"] == tid


def test_get_teacher_not_found(client):
    response = client.get("/api/v1/teachers/9999")
    assert response.status_code == 404


def test_list_teachers_after_create(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/teachers/", json=_teacher_payload(user["uid"]))
    response = client.get("/api/v1/teachers/")
    assert response.status_code == 200
    assert len(response.json()) == 1
