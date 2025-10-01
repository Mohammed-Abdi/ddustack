# type: ignore
from apps.users.models import User
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrModeratorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in [User.Role.ADMIN, User.Role.MODERATOR]
