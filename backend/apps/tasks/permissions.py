from rest_framework import permissions
from .models import TaskShare


class IsOwnerOrShared(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True

        shared = TaskShare.objects.filter(task=obj, shared_with=request.user).first()
        if not shared:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        return shared.can_edit
