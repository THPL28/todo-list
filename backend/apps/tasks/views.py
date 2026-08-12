from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Task, TaskShare
from .serializers import TaskSerializer, TaskShareSerializer
from .permissions import IsOwnerOrShared
from .filters import TaskFilter
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrShared]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ["title", "description"]
    ordering_fields = ["due_date", "created_at", "updated_at"]

    def get_queryset(self):
        return Task.objects.filter(Q(owner=self.request.user) | Q(shares__shared_with=self.request.user)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskShareViewSet(viewsets.ModelViewSet):
    serializer_class = TaskShareSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskShare.objects.filter(task__owner=self.request.user)

    def perform_create(self, serializer):
        share = serializer.save()
        NotificationService.create_and_send(
            recipient=share.shared_with,
            event_type=Notification.EVENT_TASK_SHARED,
            payload={
                "task_id": share.task.id,
                "task_title": share.task.title,
                "shared_by": self.request.user.username,
                "can_edit": share.can_edit,
            },
        )
