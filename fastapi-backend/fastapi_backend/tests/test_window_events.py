USER_PAYLOAD = {
    "name": "Eve",
    "email": "eve@example.com",
    "user_type": "student",
    "user_image": "img.png",
    "user_login": 0,
    "password": "secret",
}


def _event_payload(uid: int) -> dict:
    return {
        "email": "eve@example.com",
        "test_id": "TEST001",
        "name": "Eve",
        "window_event": 1,
        "uid": uid,
    }


def test_list_events_empty(client):
    response = client.get("/api/v1/window-events/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_event(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    payload = _event_payload(user["uid"])
    response = client.post("/api/v1/window-events/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "eve@example.com"
    assert "wid" in data


def test_list_events_filter_by_email(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/window-events/", json=_event_payload(user["uid"]))
    response = client.get("/api/v1/window-events/", params={"email": "eve@example.com"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_events_filter_by_test_id(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/window-events/", json=_event_payload(user["uid"]))
    response = client.get("/api/v1/window-events/", params={"test_id": "TEST001"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_events_filter_no_match(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/window-events/", json=_event_payload(user["uid"]))
    response = client.get("/api/v1/window-events/", params={"email": "nobody@example.com"})
    assert response.status_code == 200
    assert response.json() == []
