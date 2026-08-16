import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_register_user():
    client = APIClient()
    response = client.post("/api/auth/register/", {
        "username": "testuser",
        "email": "test@example.com",
        "password": "strongpassword",
    }, format="json")

    assert response.status_code == 201
    assert User.objects.filter(username="testuser").exists()


@pytest.mark.django_db
def test_me_returns_authenticated_user():
    user = User.objects.create_user(username="meuser", email="me@example.com", password="pass")
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get("/api/auth/me/")

    assert response.status_code == 200
    assert response.data["username"] == "meuser"
    assert response.data["email"] == "me@example.com"
    assert "password" not in response.data


@pytest.mark.django_db
def test_me_requires_authentication():
    client = APIClient()
    response = client.get("/api/auth/me/")
    assert response.status_code == 401
