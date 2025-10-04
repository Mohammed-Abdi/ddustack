# type: ignore
import jwt
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import generics, permissions, status
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

OAUTH_PROVIDERS = ("google", "github", "apple")


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access_token": str(refresh.access_token), "refresh_token": str(refresh)}


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        response = Response({"access_token": tokens["access_token"], "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
        return response


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        response = Response({"access_token": tokens["access_token"], "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
        return response


class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

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
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = UserPagination


class OAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider, *args, **kwargs):
        if provider not in OAUTH_PROVIDERS:
            return Response({"detail": "Unsupported provider."}, status=status.HTTP_400_BAD_REQUEST)

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
            print(token_json)
            access_token = token_json.get("access_token")
            if not access_token:
                return Response({"detail": "Failed to fetch GitHub access token"}, status=status.HTTP_400_BAD_REQUEST)
            user_resp = requests.get("https://api.github.com/user", headers={"Authorization": f"token {access_token}"})
            data = user_resp.json()
            email = data.get("email") or data.get("login") + "@github.com"
            provider_id = str(data.get("id"))
            first_name = data.get("name") or "GitHubUser"
            last_name = ""

        elif provider == "apple":
            code = request.data.get("code")
            if not code:
                return Response({"detail": "code is required"}, status=status.HTTP_400_BAD_REQUEST)
            data = {"client_id": settings.APPLE_CLIENT_ID, "client_secret": settings.APPLE_CLIENT_SECRET, "code": code, "grant_type": "authorization_code"}
            token_resp = requests.post("https://appleid.apple.com/auth/token", data=data)
            token_json = token_resp.json()
            print(token_json)
            try:
                id_info = jwt.decode(token_json["id_token"], options={"verify_signature": False})
                email = id_info.get("email")
                provider_id = id_info.get("sub")
                first_name = ""
                last_name = ""
            except Exception:
                return Response({"detail": "Invalid Apple token."}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"first_name": first_name, "last_name": last_name, "provider": provider, "provider_id": provider_id, "is_active": True},
        )
        if not created and (user.provider != provider or user.provider_id != provider_id):
            user.provider = provider
            user.provider_id = provider_id
            user.save(update_fields=["provider", "provider_id"])

        tokens = get_tokens_for_user(user)
        response = Response({"access_token": tokens["access_token"], "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
        return response
