# API: Users

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-10  
**Status:** Updated

---

## 1. Overview

The Users API handles:

- User registration and login (email/password)
- Google and GitHub OAuth login
- JWT authentication with refresh tokens in HttpOnly cookies
- Profile management (including avatar upload)
- Admin management of users (CRUD)
- Email availability check

Base URL: `<baseurl>/v1/`

---

## 2. Endpoint Details

| Endpoint                | Method | Auth Required  | Description                                |
| ----------------------- | ------ | -------------- | ------------------------------------------ |
| /auth/register/         | POST   | `no`           | Register a new user                        |
| /auth/check-email/      | POST   | `no`           | Check if email already exists              |
| /auth/login/            | POST   | `no`           | Authenticate user with email/password      |
| /auth/oauth/<provider>/ | POST   | `no`           | Authenticate user with Google or GitHub    |
| /auth/refresh/          | POST   | `yes (cookie)` | Refresh JWT access token using cookie      |
| /auth/logout/           | POST   | `no`           | Logout user and clear refresh token cookie |
| /users/me/              | GET    | `yes`          | Fetch current user profile                 |
| /users/me/              | PUT    | `yes`          | Update current user profile                |
| /users/me/avatar/       | POST   | `yes`          | Upload or update user avatar               |
| /users/                 | GET    | `yes (admin)`  | List all users with pagination             |
| /users/<uuid:user_id>/  | GET    | `yes (admin)`  | Fetch details of a specific user           |
| /users/<uuid:user_id>/  | PUT    | `yes (admin)`  | Update user info                           |
| /users/<uuid:user_id>/  | DELETE | `yes (admin)`  | Delete a user                              |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Register

**Request**

#### POST `/auth/register/`

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
  "access_token": "jwt_access_token"
}
```

> Refresh token is set in HttpOnly cookie.

---

### 3.2 Check Email

**Request**

#### POST `/auth/check-email/`

```json
{
  "email": "mohammed@example.com"
}
```

**Response** `200 OK`

```json
{
  "exists": true
}
```

---

### 3.3 Login

**Request**

#### POST `/auth/login/`

```json
{
  "email": "mohammed@example.com",
  "password": "securePass123"
}
```

**Response** `200 OK`

```json
{
  "access_token": "jwt_access_token"
}
```

> Refresh token is set in HttpOnly cookie.

---

### 3.4 OAuth Login (Google / GitHub)

**Request**

#### POST `/auth/oauth/google/`

or `/auth/oauth/github/`

```json
{
  "code": "authorization_code_from_frontend"
}
```

**Response** `200 OK`

```json
{
  "access_token": "jwt_access_token"
}
```

> Refresh token is set in HttpOnly cookie. Supported providers: `google`, `github`.

---

### 3.5 Refresh Token

**Request**

#### POST `/auth/refresh/`

> Refresh token must be stored in HttpOnly cookie.

**Response** `200 OK`

```json
{
  "access_token": "new_jwt_access_token"
}
```

---

### 3.6 Logout

**Request**

#### POST `/auth/logout/`

**Response** `200 OK`

```json
{
  "detail": "Logged out successfully."
}
```

---

### 3.7 Get Current User Profile

**Request**

#### GET `/users/me/`

Authorization: Bearer `<access_token>`

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Mohammed",
  "last_name": "Abdi",
  "email": "mohammed@example.com",
  "role": "STUDENT",
  "is_active": true,
  "department": "uuid",
  "year": 3,
  "semester": 1,
  "user_id": "DDU*******",
  "is_verified": true,
  "date_joined": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-01T10:05:00Z"
}
```

---

### 3.8 Update Current User Profile

**Request**

#### PUT `/users/me/`

Authorization: Bearer `<access_token>`

```json
{
  "department": "uuid",
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
  "department": "uuid",
  "year": 3,
  "semester": 2,
  "user_id": "DDU*******",
  "is_verified": false,
  "date_joined": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-10T15:00:00Z"
}
```

---

### 3.9 Upload Avatar

**Request**

#### POST `/users/me/avatar/`

Authorization: Bearer `<access_token>`  
Form-data: `avatar` file

**Response** `200 OK`

```json
{
  "avatar": "https://res.cloudinary.com/.../avatar.jpg"
}
```

---

### 3.10 Admin: List Users

**Request**

#### GET `/users/`

Authorization: Bearer `<admin_access_token>`

**Response** `200 OK` (Paginated)

```json
{
  "count": 50,
  "next": "https://<baseurl>/v1/users/?page=3",
  "previous": "https://<baseurl>/v1/users/?page=1",
  "results": [
    {
      "id": "uuid",
      "first_name": "Emily",
      "last_name": "Johnson",
      "email": "emily@example.com",
      "provider": "google",
      "provider_id": "117785436858300136844",
      "role": "STUDENT",
      "is_active": true,
      "department": "uuid",
      "year": 3,
      "semester": 1,
      "user_id": "DDU*******",
      "is_verified": true,
      "date_joined": "2025-09-29T14:31:11.296366Z",
      "updated_at": "2025-09-29T14:31:11.296393Z"
    }
  ]
}
```

---

### 3.11 Admin: Get / Update / Delete User

**Request**

#### GET `/users/<uuid:user_id>/`

#### PUT `/users/<uuid:user_id>/`

#### DELETE `/users/<uuid:user_id>/`

Authorization: Bearer `<admin_access_token>`

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
  "department": "uuid",
  "year": 4,
  "semester": 2,
  "user_id": "DDU*******",
  "is_verified": true,
  "date_joined": "2025-09-27T10:00:00Z",
  "updated_at": "2025-10-10T12:00:00Z"
}
```

> DELETE returns:

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

---

## 5. Notes / References

- OAuth providers supported: Google, GitHub.
- Refresh token is stored in HttpOnly cookie for security.
- JWT access tokens expire according to system configuration.
- User `user_id` field maps to `student_id` or `staff_id` based on role.
- Related database tables: [users](../architecture/database-schema.md/#1-users)
