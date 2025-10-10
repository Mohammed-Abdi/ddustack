from django.urls import path

from .views import (
    AdminUserDetailView,
    CheckEmailView,
    LoginView,
    LogoutView,
    MeView,
    OAuthLoginView,
    RefreshTokenView,
    RegisterView,
    UploadAvatarView,
    UserListView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/check-email/", CheckEmailView.as_view(), name="check-email"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/oauth/<str:provider>/", OAuthLoginView.as_view(), name="oauth-login"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("users/me/", MeView.as_view(), name="me"),
    path("users/me/avatar/", UploadAvatarView.as_view(), name="upload-avatar"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<uuid:user_id>/", AdminUserDetailView.as_view(), name="user-detail"),
]
