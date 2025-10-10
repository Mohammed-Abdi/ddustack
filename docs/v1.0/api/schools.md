# API: Schools

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-10  
**Status:** Update

---

## 1. Overview

The Schools API allows management of academic schools (faculties) within the platform. It supports CRUD operations for admins and read-only access for students. Typical use cases include:

- Admins creating, updating, and deleting schools.
- Students fetching a list of available schools.
- Organizing content hierarchically by school.

Base URL: `<baseurl>/v1/schools/`

---

## 2. Endpoint Details

| Endpoint         | Method    | Auth Required | Description                        |
| ---------------- | --------- | ------------- | ---------------------------------- |
| /                | GET       | `yes`         | Fetch list of all schools          |
| /                | POST      | `yes (admin)` | Create a new school                |
| /uuid:school_id/ | GET       | `yes`         | Fetch details of a specific school |
| /uuid:school_id/ | PUT/PATCH | `yes (admin)` | Update school info                 |
| /uuid:school_id/ | DELETE    | `yes (admin)` | Delete a school                    |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get All Schools

**Request**

#### GET `/schools/`

> Authorization: Bearer `<access_token>`

**Response** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "School of Engineering",
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:05:00Z"
  },
  {
    "id": "uuid",
    "name": "School of Law",
    "created_at": "2025-09-27T10:10:00Z",
    "updated_at": "2025-09-27T10:15:00Z"
  }
]
```

---

### 3.2 Create School

**Request**

#### POST `/schools/`

> Authorization: Bearer `<admin_access_token>`

```json
{
  "name": "School of Medicine"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "name": "School of Medicine",
  "created_at": "2025-09-27T12:00:00Z",
  "updated_at": "2025-09-27T12:00:00Z"
}
```

---

### 3.3 Get School by ID

**Request**

#### GET `/schools/uuid:school_id/`

> Authorization: Bearer `<access_token>`

**Response** `200 OK`

```json
{
  "id": "uuid",
  "name": "School of Engineering",
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.4 Update School

**Request**

#### PUT `/schools/uuid:school_id/`

> Authorization: Bearer `<admin_access_token>`

```json
{
  "name": "School of Computing"
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "name": "School of Computing",
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.5 Delete School

**Request**

#### DELETE `/schools/uuid:school_id/`

> Authorization: Bearer `<admin_access_token>`

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

- Related database table: [schools](../architecture/database-schema.md/#2-schools)
- `name` field is unique and indexed for fast lookup.
