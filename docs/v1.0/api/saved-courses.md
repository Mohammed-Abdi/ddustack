# API: Saved Courses

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview

The Saved Courses API allows students to bookmark courses for quick access. Users can:

- Save a course.
- Remove a saved course.
- List all their saved courses.

Base URL: `<baseurl>/v1/saved-courses/`

---

## 2. Endpoint Details

| Endpoint | Method | Auth Required | Description                     |
| -------- | ------ | ------------- | ------------------------------- |
| /        | GET    | `yes`         | List all saved courses for user |
| /        | POST   | `yes`         | Save a course                   |
| /{id}    | DELETE | `yes`         | Remove a saved course           |

---

## 3. Endpoints with Request & Response Examples

### 3.1 List Saved Courses

**Request**

#### GET `/saved-courses/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
[
  {
    "id": "uuid",
    "course_id": "uuid",
    "saved_at": "2025-09-27T12:00:00Z"
  }
]
```

---

### 3.2 Save a Course

**Request**

#### POST `/saved-courses/`

> Authorization: Bearer <access_token>

```json
{
  "course_id": "uuid"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "course_id": "uuid",
  "saved_at": "2025-09-27T12:15:00Z"
}
```

---

### 3.3 Remove a Saved Course

**Request**

#### DELETE `/saved-courses/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "message": "Saved course removed successfully."
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

- Prevents duplicate saves using the unique `(user_id, course_id)` constraint.
- Related database table: [saved_courses](../architecture/database-schema.md/#8-saved-courses)
