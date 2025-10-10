# API: Saved Courses

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-10  
**Status:** Updated

---

## 1. Overview

The Saved Courses API allows students to bookmark courses for quick access. Users can:

- Save a course.
- Remove a saved course.
- List all their saved courses.

Base URL: `<baseurl>/v1/saved-courses/`

---

## 2. Endpoint Details

| Endpoint  | Method | Auth Required | Description                                       |
| --------- | ------ | ------------- | ------------------------------------------------- |
| /         | GET    | `yes`         | List all saved courses for the authenticated user |
| /         | POST   | `yes`         | Save a course                                     |
| /uuid:id/ | DELETE | `yes`         | Remove a saved course                             |

---

## 3. Endpoints with Request & Response Examples

### 3.1 List Saved Courses

**Request**

#### GET `/saved-courses/`

> Authorization: Bearer `<access_token>`

**Response** `200 OK`

```json
{
  "count": 42,
  "next": "https://<baseurl>/v1/saved-courses/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user": "uuid",
      "course": "uuid",
      "saved_at": "2025-10-10T12:00:00Z"
    },
    {
      "id": "uuid",
      "user": "uuid",
      "course": "uuid",
      "saved_at": "2025-10-10T12:05:00Z"
    }
  ]
}
```

---

### 3.2 Save a Course

**Request**

#### POST `/saved-courses/`

> Authorization: Bearer `<access_token>`

```json
{
  "course": "uuid"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "user": "uuid",
  "course": "uuid",
  "saved_at": "2025-10-10T12:15:00Z"
}
```

---

### 3.3 Remove a Saved Course

**Request**

#### DELETE `/saved-courses/uuid:id/`

> Authorization: Bearer `<access_token>`

**Response** `204 No Content`

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

- Prevents duplicate saves using the unique `(user, course)` constraint.
- Related database table: [saved_courses](../architecture/database-schema.md/#8-saved-courses)
- Pagination is applied by default, 10 items per page, max 50 per page.
