from django.urls import path

from .views import (
    AdminUserDetailView,
    LoginView,
    MeView,
    OAuthLoginView,
    RefreshTokenView,
    RegisterView,
    UserListView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/oauth/<str:provider>/", OAuthLoginView.as_view(), name="oauth-login"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("users/me/", MeView.as_view(), name="me"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<uuid:user_id>/", AdminUserDetailView.as_view(), name="user-detail"),
]
