from django.urls import URLPattern, path

from .views import (
    AdminUserDetailView,
    LoginView,
    MeView,
    RefreshTokenView,
    RegisterView,
    UserListView,
)

urlpatterns: list[URLPattern] = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("list/", UserListView.as_view(), name="user-list"),
    path("<uuid:user_id>/", AdminUserDetailView.as_view(), name="user-detail"),
]
