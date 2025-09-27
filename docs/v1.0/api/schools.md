# API: Schools

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview

The Schools API allows management of academic schools (faculties) within the platform. It supports CRUD operations for admins and read-only access for students. Typical use cases include:

- Admins creating, updating, and deleting schools.
- Students fetching a list of available schools.
- Organizing content hierarchically by school.

Base URL: `<baseurl>/v1/schools/`

---

## 2. Endpoint Details

| Endpoint     | Method | Auth Required | Description                        |
| ------------ | ------ | ------------- | ---------------------------------- |
| /            | GET    | `yes`         | Fetch list of all schools          |
| /            | POST   | `yes`         | Create a new school (Admin)        |
| /{school_id} | GET    | `yes`         | Fetch details of a specific school |
| /{school_id} | PUT    | `yes`         | Update school info (Admin)         |
| /{school_id} | DELETE | `yes`         | Delete a school (Admin)            |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get All Schools

**Request**

#### GET `/schools/`

> Authorization: Bearer <access_token>

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

> Authorization: Bearer <access_token>

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

#### GET `/schools/uuid`

> Authorization: Bearer <access_token>

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

#### PUT `/schools/uuid`

> Authorization: Bearer <access_token>

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

#### DELETE `/schools/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "message": "School deleted successfully."
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

- Related database table: [schools](../architecture/database-schema.md/#2-schools)
- `name` field is unique and indexed for fast lookup.
