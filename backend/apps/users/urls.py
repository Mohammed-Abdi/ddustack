from django.urls import URLPattern, path

from .views import (
    AdminUserDetailView,
    GoogleAuthView,
    LoginView,
    MeView,
    RefreshTokenView,
    RegisterView,
    UserListView,
)

urlpatterns: list[URLPattern] = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/google/", GoogleAuthView.as_view(), name="google-auth"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("users/me/", MeView.as_view(), name="me"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<uuid:user_id>/", AdminUserDetailView.as_view(), name="user-detail"),
]
