# type: ignore
import cloudinary.uploader
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .pagination import UserPagination
from .serializers import (
    AdminUserSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

OAUTH_PROVIDERS = ("google", "github")


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access_token": str(refresh.access_token), "refresh_token": str(refresh)}


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        response = Response({"access_token": tokens["access_token"]}, status=status.HTTP_201_CREATED)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
        return response


class CheckEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        exists = User.objects.filter(email=email).exists()
        return Response({"exists": exists}, status=status.HTTP_200_OK)


class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        response = Response({"access_token": tokens["access_token"]}, status=status.HTTP_200_OK)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
        return response


class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            return Response({"access_token": str(refresh.access_token)}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("avatar")
        if not file:
            return Response({"detail": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        result = cloudinary.uploader.upload(file)
        request.user.avatar = result["secure_url"]
        request.user.save(update_fields=["avatar"])
        return Response({"avatar": request.user.avatar}, status=status.HTTP_200_OK)


class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, user_id):
        return get_object_or_404(User, id=user_id)

    def get(self, request, user_id):
        return Response(AdminUserSerializer(self.get_object(user_id)).data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        serializer = AdminUserSerializer(self.get_object(user_id), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        self.get_object(user_id).delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("first_name", "last_name")
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = UserPagination


class OAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, provider, *args, **kwargs):
        if provider not in OAUTH_PROVIDERS:
            return Response({"detail": "Unsupported provider."}, status=status.HTTP_400_BAD_REQUEST)
        email = first_name = last_name = avatar_url = provider_id = None
        if provider == "google":
            code = request.data.get("code")
            if not code:
                return Response({"detail": "code is required"}, status=status.HTTP_400_BAD_REQUEST)
            data = {
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            }
            token_resp = requests.post("https://oauth2.googleapis.com/token", data=data)
            token_json = token_resp.json()
            try:
                id_info = google_id_token.verify_oauth2_token(token_json["id_token"], google_requests.Request(), settings.GOOGLE_CLIENT_ID)
                email = id_info.get("email")
                provider_id = id_info.get("sub")
                first_name = id_info.get("given_name", "")
                last_name = id_info.get("family_name", "")
                avatar_url = id_info.get("picture")
            except Exception:
                return Response({"detail": "Invalid Google token."}, status=status.HTTP_400_BAD_REQUEST)
        elif provider == "github":
            code = request.data.get("code")
            if not code:
                return Response({"detail": "code is required"}, status=status.HTTP_400_BAD_REQUEST)
            token_resp = requests.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                },
            )
            token_json = token_resp.json()
            access_token = token_json.get("access_token")
            if not access_token:
                return Response({"detail": "Failed to fetch GitHub access token"}, status=status.HTTP_400_BAD_REQUEST)
            user_resp = requests.get("https://api.github.com/user", headers={"Authorization": f"token {access_token}"})
            data = user_resp.json()
            email = data.get("email") or f'{data.get("login")}@github.com'
            provider_id = str(data.get("id"))
            full_name = data.get("name") or "GitHubUser"
            name_parts = full_name.split(" ")
            first_name = name_parts[0]
            last_name = name_parts[-1] if len(name_parts) > 1 else ""
            avatar_url = data.get("avatar_url")
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "provider": provider,
                "provider_id": provider_id,
                "is_active": True,
                "avatar": avatar_url,
            },
        )
        if avatar_url and not user.avatar:
            user.avatar = avatar_url
            user.save(update_fields=["avatar"])
        tokens = get_tokens_for_user(user)
        response = Response({"access_token": tokens["access_token"]}, status=status.HTTP_200_OK)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        return response
