# API: Users

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-30  
**Status:** Updated

---

## 1. Overview

The Users API handles user authentication, registration, Google OAuth login, profile management, and administrative user operations.  
It supports **JWT authentication** with **refresh tokens stored as HttpOnly cookies** for secure access.

Typical use cases include:

- STUDENT registration and login (email/password or Google).
- Fetching and updating user profile information.
- Admin management of users (CRUD operations).

Base URL: `<baseurl>/v1/`

---

## 2. Endpoint Details

| Endpoint         | Method | Auth Required  | Description                           |
| ---------------- | ------ | -------------- | ------------------------------------- |
| /auth/register   | POST   | `no`           | Register a new user                   |
| /auth/login      | POST   | `no`           | Authenticate user with email/password |
| /auth/google     | POST   | `no`           | Authenticate user with Google OAuth   |
| /auth/refresh    | POST   | `yes (cookie)` | Refresh JWT access token using cookie |
| /users/me        | GET    | `yes`          | Fetch current user profile            |
| /users/me        | PUT    | `yes`          | Update current user profile           |
| /users/          | GET    | `yes (admin)`  | List all users                        |
| /users/{user_id} | GET    | `yes (admin)`  | Fetch details of a specific user      |
| /users/{user_id} | PATCH  | `yes (admin)`  | Update user info                      |
| /users/{user_id} | DELETE | `yes (admin)`  | Delete a user                         |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Register

**Request**

#### POST `/auth/register`

```json
{
  "first_name": "Mohammed",
  "last_name": "Abdi",
  "email": "mohammed@example.com",
  "password": "securePass123"
}
```

**Response** `201 Created`

```json
{
  "access": "jwt_access_token",
  "user": {
    "id": "uuid",
    "first_name": "Mohammed",
    "last_name": "Abdi",
    "email": "mohammed@example.com",
    "role": "STUDENT",
    "is_active": true,
    "department_id": null,
    "year": null,
    "semester": null
  }
}
```

---

### 3.2 Login

**Request**

#### POST `/auth/login`

```json
{
  "email": "mohammed@example.com",
  "password": "securePass123"
}
```

**Response** `200 OK`

```json
{
  "access": "jwt_access_token",
  "user": {
    "id": "uuid",
    "first_name": "Mohammed",
    "last_name": "Abdi",
    "email": "mohammed@example.com",
    "role": "STUDENT",
    "is_active": true,
    "department_id": null,
    "year": null,
    "semester": null
  }
}
```

---

### 3.3 Google Auth

**Request**

#### POST `/auth/google`

```json
{
  "token": "google_id_token"
}
```

**Response** `200 OK`

```json
{
  "access": "jwt_access_token",
  "user": {
    "id": "uuid",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "role": "STUDENT",
    "is_active": true,
    "department_id": "uuid",
    "year": 2,
    "semester": 2
  }
}
```

---

### 3.4 Refresh Token

**Request**

#### POST `/auth/refresh`

> Refresh token must be stored in HttpOnly cookie.

**Response** `200 OK`

```json
{
  "access": "new_jwt_access_token"
}
```

---

### 3.5 Get Current User Profile

**Request**

#### GET `/users/me`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Mohammed",
  "last_name": "Abdi",
  "email": "mohammed@example.com",
  "role": "STUDENT",
  "is_active": true,
  "department_id": "uuid",
  "year": 3,
  "semester": 1
}
```

---

### 3.6 Update Current User Profile

**Request**

#### PUT `/users/me`

> Authorization: Bearer <access_token>

```json
{
  "department_id": "uuid",
  "year": 3,
  "semester": 2
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Mohammed",
  "last_name": "Abdi",
  "email": "mohammed@example.com",
  "role": "STUDENT",
  "is_active": true,
  "department_id": "uuid",
  "year": 3,
  "semester": 2
}
```

---

### 3.7 Admin: List Users

**Request**

#### GET `/users/`

> Authorization: Bearer <admin_access_token>

**Response** `200 OK`

```json
{
  "count": 50,
  "next": "https://<baseurl>/v1/users/?page=3",
  "previous": "https://<baseurl>/v1/users/?page=1",
  "results": [
    {
      "id": "20868736-c83a-4f97-90d3-9eebd03852b0",
      "first_name": "Emily",
      "last_name": "Johnson",
      "email": "emily.johnson@example.com",
      "provider": "google",
      "provider_id": "117785436858300136844",
      "role": "STUDENT",
      "is_active": true,
      "department_id": "uuid",
      "year": 3,
      "semester": 1,
      "date_joined": "2025-09-29T14:31:11.296366Z",
      "updated_at": "2025-09-29T14:31:11.296393Z"
    },
    {
      "id": "aa601770-e5ae-4dfb-81f0-41cd2e55c6a7",
      "first_name": "Michael",
      "last_name": "Smith",
      "email": "michael.smith@example.com",
      "provider": "email",
      "provider_id": null,
      "role": "STUDENT",
      "is_active": true,
      "department_id": null,
      "year": null,
      "semester": null,
      "date_joined": "2025-09-29T12:01:57.613766Z",
      "updated_at": "2025-09-29T12:01:57.613787Z"
    },
    {
      "id": "6b4acf9b-c4e2-4bba-935c-32240012a2b8",
      "first_name": "Sophia",
      "last_name": "Williams",
      "email": "sophia.williams@example.com",
      "provider": "google",
      "provider_id": "117603110570559130224",
      "role": "ADMIN",
      "is_active": true,
      "department_id": "uuid",
      "year": 3,
      "semester": 2,
      "date_joined": "2025-09-29T11:56:55.029458Z",
      "updated_at": "2025-09-29T11:56:55.029475Z"
    }
  ]
}
```

---

### 3.8 Admin: Get User by ID

**Request**

#### GET `/users/uuid`

> Authorization: Bearer <admin_access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "provider": "google",
  "provider_id": "117603110570559130224",
  "role": "STUDENT",
  "is_active": true,
  "department_id": "uuid",
  "year": 4,
  "semester": 1,
  "date_joined": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.9 Admin: Update User

**Request**

#### PATCH `/users/uuid`

> Authorization: Bearer <admin_access_token>

```json
{
  "role": "MODERATOR",
  "semester": 2
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "provider": "google",
  "provider_id": "117603110570559130224",
  "role": "MODERATOR",
  "is_active": true,
  "department_id": "uuid",
  "year": 4,
  "semester": 2,
  "date_joined": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.10 Admin: Delete User

**Request**

#### DELETE `/users/uuid`

> Authorization: Bearer <admin_access_token>

**Response** `200 OK`

```json
{
  "message": "User deleted successfully."
}
```

---

## 4. Error Codes

| HTTP Code | Error Name            | Description                                      |
| --------- | --------------------- | ------------------------------------------------ |
| 400       | Bad Request           | Missing or invalid parameters                    |
| 401       | Unauthorized          | Invalid credentials or missing JWT               |
| 403       | Forbidden             | User does not have permission to access resource |
| 404       | Not Found             | Resource not found                               |
| 500       | Internal Server Error | Unexpected server error                          |
| 503       | Service Unavailable   | Server temporarily unavailable                   |

Example:
`400 Bad Request`

```json
{
  "email": ["user with this email already exists."]
}
```

---

## 5. Notes / References

- Refresh token is stored in HttpOnly cookie for security.
- JWT access tokens expire according to system configuration.
- Related database tables: [users](../architecture/database-schema.md/#1-users)
