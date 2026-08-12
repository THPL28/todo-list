from django.db import models
from django.contrib.auth import get_user_model
from apps.categories.models import Category

User = get_user_model()


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class TaskShare(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="shares")
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shared_tasks")
    can_edit = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("task", "shared_with")

    def __str__(self):
        permission = "edit" if self.can_edit else "read"
        return f"{self.task} -> {self.shared_with} ({permission})"
