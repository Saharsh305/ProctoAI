USER_PAYLOAD = {
    "name": "Carol",
    "email": "carol@example.com",
    "user_type": "teacher",
    "user_image": "img.png",
    "user_login": 0,
    "password": "secret",
}


def _question_payload(uid: int) -> dict:
    return {
        "test_id": "TEST001",
        "qid": "Q1",
        "q": "What is 2+2?",
        "a": "3",
        "b": "4",
        "c": "5",
        "d": "6",
        "ans": "b",
        "marks": 1,
        "uid": uid,
    }


def test_list_questions_empty(client):
    response = client.get("/api/v1/questions/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_question(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    payload = _question_payload(user["uid"])
    response = client.post("/api/v1/questions/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["qid"] == "Q1"
    assert "questions_uid" in data


def test_list_questions_after_create(client):
    user = client.post("/api/v1/users/", json=USER_PAYLOAD).json()
    client.post("/api/v1/questions/", json=_question_payload(user["uid"]))
    response = client.get("/api/v1/questions/")
    assert response.status_code == 200
    assert len(response.json()) == 1
