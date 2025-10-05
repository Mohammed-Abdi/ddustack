# type: ignore
from apps.users.models import User
from rest_framework.permissions import BasePermission


class IntakePermission(BasePermission):
    def has_permission(self, request, view):
        user_role = getattr(request.user, "role", None)

        if request.method == "POST":
            return True

        if request.method in ["PATCH", "PUT"]:
            return user_role in [User.Role.ADMIN, User.Role.MODERATOR, User.Role.LECTURER]

        if request.method == "DELETE":
            return user_role in [User.Role.ADMIN, User.Role.MODERATOR]

        if request.method == "GET":
            return user_role in [User.Role.ADMIN, User.Role.MODERATOR, User.Role.LECTURER]

        return False
