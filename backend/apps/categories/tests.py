import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_category_crud():
    user = User.objects.create_user(username="catuser", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    create_response = client.post("/api/categories/", {"name": "Work"}, format="json")
    assert create_response.status_code == 201
    assert create_response.data["name"] == "Work"

    category_id = create_response.data["id"]
    list_response = client.get("/api/categories/")
    assert list_response.status_code == 200
    assert list_response.data["results"][0]["name"] == "Work"

    update_response = client.patch(f"/api/categories/{category_id}/", {"name": "Office"}, format="json")
    assert update_response.status_code == 200
    assert update_response.data["name"] == "Office"

    delete_response = client.delete(f"/api/categories/{category_id}/")
    assert delete_response.status_code == 204
