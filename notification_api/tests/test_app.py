from app import create_app


def test_health_check():
    client = create_app().test_client()

    response = client.get("/health/")

    assert response.status_code == 200
    assert response.json == {"status": "ok"}


def test_receive_notification():
    client = create_app().test_client()

    response = client.post(
        "/notifications/",
        json={
            "recipient_id": 42,
            "event_type": "task_shared",
            "payload": {"task_id": 7},
        },
    )

    assert response.status_code == 202
    assert response.json["status"] == "accepted"
    assert response.json["event_type"] == "task_shared"
    assert response.json["received_at"]


def test_receive_notification_rejects_invalid_payload():
    client = create_app().test_client()

    response = client.post("/notifications/", json={"event_type": "task_shared"})

    assert response.status_code == 400
