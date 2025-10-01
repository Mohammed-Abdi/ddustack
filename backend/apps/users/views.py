# type: ignore
from django.conf import settings
from django.shortcuts import get_object_or_404
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
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


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    }


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
            access_token = str(refresh.access_token)
            return Response({"access_token": access_token}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        user = self.get_object(user_id)
        serializer = AdminUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        user = self.get_object(user_id)
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        user = self.get_object(user_id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = UserPagination


class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get("id_token")
        if not token:
            return Response({"detail": "id_token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            id_info = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)

            email = id_info.get("email")
            provider_id = id_info.get("sub")
            first_name = id_info.get("given_name", "")
            last_name = id_info.get("family_name", "")

            if not email or not provider_id:
                return Response({"detail": "Invalid Google token."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(email=email)
                if user.provider != "google" or user.provider_id != provider_id:
                    user.provider = "google"
                    user.provider_id = provider_id
                    user.save(update_fields=["provider", "provider_id"])
            except User.DoesNotExist:
                user = User.objects.create(email=email, first_name=first_name, last_name=last_name, provider="google", provider_id=provider_id, is_active=True)

            tokens = get_tokens_for_user(user)

            response = Response({"access_token": tokens["access_token"], "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
            response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=not settings.DEBUG, samesite="Lax", max_age=30 * 24 * 60 * 60)
            return response

        except ValueError:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
