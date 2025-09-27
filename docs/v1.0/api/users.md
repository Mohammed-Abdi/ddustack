# API: Users

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview

The Users API handles user authentication, registration, profile management, and administrative user operations. It supports JWT authentication for secure access. Typical use cases include:

- Student registration and login.
- Fetching and updating user profile information.
- Admin management of users (CRUD operations).

Base URL: `<baseurl>/v1/users/`

---

## 2. Endpoint Details

| Endpoint   | Method | Auth Required | Description                              |
| ---------- | ------ | ------------- | ---------------------------------------- |
| /register  | POST   | `no`          | Register a new user                      |
| /login     | POST   | `no`          | Authenticate user and return JWT         |
| /me        | GET    | `yes`         | Fetch current user profile               |
| /me        | PUT    | `yes`         | Update current user profile              |
| /{user_id} | GET    | `yes`         | Fetch details of a specific user (Admin) |
| /{user_id} | PUT    | `yes`         | Update user info (Admin)                 |
| /{user_id} | DELETE | `yes`         | Delete a user (Admin)                    |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Register

**Request**

#### POST `/users/register`

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
  "access_token": "jwt_access_token",
  "user": {
    "id": "uuid",
    "first_name": "Mohammed",
    "last_name": "Abdi",
    "email": "mohammed@example.com",
    "role": "student",
    "is_active": true,
    "department_id": "uuid",
    "year": 3,
    "semester": 1
  }
}
```

---

### 3.2 Login

**Request**

#### POST `/users/login`

```json
{
  "email": "mohammed@example.com",
  "password": "securePass123"
}
```

**Response** `200 OK`

```json
{
  "access_token": "jwt_access_token",
  "user": {
    "id": "uuid",
    "first_name": "Mohammed",
    "last_name": "Abdi",
    "email": "mohammed@example.com",
    "role": "student",
    "is_active": true,
    "department_id": "uuid",
    "year": 3,
    "semester": 1
  }
}
```

---

### 3.3 Get Current User Profile

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
  "role": "student",
  "is_active": true,
  "department_id": "uuid",
  "year": 3,
  "semester": 1
}
```

---

### 3.4 Update Current User Profile

**Request**

#### PUT `/users/me`

> Authorization: Bearer <access_token>

```json
{
  "first_name": "Mohammed",
  "last_name": "Abdi",
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
  "role": "student",
  "is_active": true,
  "department_id": "uuid",
  "year": 3,
  "semester": 2
}
```

---

### 3.5 Admin: Get User by ID

**Request**

#### GET `/users/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "provider": null,
  "provider_id": null,
  "role": "admin",
  "is_active": true,
  "department_id": null,
  "year": null,
  "semester": null,
  "date_joined": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.6 Admin: Update User

**Request**

#### PUT `/users/uuid`

> Authorization: Bearer <access_token>

```json
{
  "first_name": "Jane",
  "last_name": "Abdi",
  "role": "moderator"
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Abdi",
  "email": "jane@example.com",
  "provider": null,
  "provider_id": null,
  "role": "moderator",
  "is_active": true,
  "department_id": null,
  "year": null,
  "semester": null,
  "date_joined": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.7 Admin: Delete User

**Request**

#### DELETE `/users/uuid`

> Authorization: Bearer <access_token>

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

- Related features: Personalized Feed, Saved Courses.
- JWT tokens expire according to system configuration.
- Related database tables: [users](../architecture/database-schema.md/#1-users)
