from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TaskShareViewSet

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
router.register("task-shares", TaskShareViewSet, basename="taskshare")

urlpatterns = [
    path("", include(router.urls)),
]
