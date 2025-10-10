# API: Intakes

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-11  
**Status:** Updated

---

## 1. Overview

The Intakes API manages user-submitted requests such as access, role changes, feedback, complaints, leaves, and grade reviews.  
It provides CRUD capabilities based on user roles:

- **Students** can submit intake requests (POST).
- **Admins, Moderators, and Lecturers** can list, view, update, or delete intakes.
- Supports filtering and searching by type, status, and identifiers.

Base URL: `<baseurl>/v1/intakes/`

---

## 2. Endpoint Details

| Endpoint         | Method | Auth Required              | Description                                    |
| ---------------- | ------ | -------------------------- | ---------------------------------------------- |
| /                | GET    | `yes (admin/mod/lecturer)` | List all intakes with optional filters         |
| /                | POST   | `yes`                      | Submit a new intake request                    |
| /uuid:intake_id/ | GET    | `yes (admin/mod/lecturer)` | Retrieve details of a specific intake          |
| /uuid:intake_id/ | PUT    | `yes (admin/mod/lecturer)` | Fully update an intake                         |
| /uuid:intake_id/ | PATCH  | `yes (admin/mod/lecturer)` | Partially update an intake                     |
| /uuid:intake_id/ | DELETE | `yes (admin/mod)`          | Delete an intake                               |
| /check-user/     | POST   | `optional`                 | Check if a user has an existing intake request |

**Query Parameters for GET /intakes/**

| Parameter | Type   | Description                                           | Required |
| --------- | ------ | ----------------------------------------------------- | -------- |
| type      | STRING | Filter by intake type (e.g., ACCESS, LEAVE, FEEDBACK) | `no`     |
| status    | STRING | Filter by intake status (PENDING, APPROVED, REJECTED) | `no`     |
| search    | STRING | Search by `full_name`, `staff_id`, or `student_id`    | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Intakes (with filters)

**Request**

#### GET `/intakes/?type=GRADE_REVIEW&status=PENDING&search=John`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user": "uuid",
      "type": "GRADE_REVIEW",
      "status": "PENDING",
      "created_at": "2025-10-11T10:00:00Z",
      "updated_at": "2025-10-11T10:00:00Z",
      "full_name": "John Doe",
      "phone_number": "09********",
      "staff_id": null,
      "student_id": "DDU*******",
      "department": "uuid",
      "description": "Requesting grade review for CS101"
    }
  ]
}
```

---

### 3.2 Create Intake

**Request**

#### POST `/intakes/`

> Authorization: Bearer <access_token>

```json
{
  "type": "ACCESS",
  "full_name": "Jane Doe",
  "phone_number": "09********",
  "staff_id": "DDU********",
  "description": "Requesting access to admin dashboard"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "user": "uuid",
  "type": "ACCESS",
  "status": "PENDING",
  "created_at": "2025-10-11T12:00:00Z",
  "updated_at": "2025-10-11T12:00:00Z",
  "full_name": "Jane Doe",
  "phone_number": "09********",
  "staff_id": "DDU*******",
  "student_id": null,
  "department": null,
  "description": "Requesting access to admin dashboard"
}
```

---

### 3.3 Retrieve Intake by ID

**Request**

#### GET `/intakes/uuid:intake_id/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user": "uuid",
  "type": "LEAVE",
  "status": "APPROVED",
  "created_at": "2025-10-11T08:00:00Z",
  "updated_at": "2025-10-11T10:00:00Z",
  "full_name": "Alice Smith",
  "phone_number": "09********",
  "staff_id": "DDU********",
  "student_id": null,
  "department": null,
  "description": "Approved leave for personal reasons"
}
```

---

### 3.4 Update Intake

**Request**

#### PUT `/intakes/uuid:intake_id/`

> Authorization: Bearer <access_token>

```json
{
  "status": "REJECTED",
  "description": "Insufficient justification provided"
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user": "uuid",
  "type": "ACCESS",
  "status": "REJECTED",
  "created_at": "2025-10-11T09:00:00Z",
  "updated_at": "2025-10-11T09:30:00Z",
  "full_name": "Jane Doe",
  "phone_number": "09********",
  "staff_id": "DDU*******",
  "student_id": null,
  "department": null,
  "description": "Insufficient justification provided"
}
```

---

### 3.5 Delete Intake

**Request**

#### DELETE `/intakes/uuid:intake_id/`

> Authorization: Bearer <access_token>

**Response** `204 No Content`

---

### 3.6 Check User Intake Existence

**Request**

#### POST `/intakes/check-user/`

```json
{
  "user_id": "uuid"
}
```

**Response** `200 OK`

_(If user has an intake)_

```json
{
  "exist": true,
  "status": "PENDING"
}
```

_(If user has no intake)_

```json
{
  "exist": false,
  "status": null
}
```

---

## 4. Error Codes

| HTTP Code | Error Name            | Description                        |
| --------- | --------------------- | ---------------------------------- |
| 400       | Bad Request           | Missing or invalid parameters      |
| 401       | Unauthorized          | Invalid credentials or missing JWT |
| 403       | Forbidden             | Insufficient permission for action |
| 404       | Not Found             | Intake not found                   |
| 500       | Internal Server Error | Unexpected server error            |
| 503       | Service Unavailable   | Server temporarily unavailable     |

---

## 5. Notes / References

- Related database table: [intake](../architecture/database-schema.md/#9-intake)
- Indexes: `type`, `status`
- Auto-normalizes `full_name` capitalization via `normalize_capitalization()`.
- Ordering prioritizes `PENDING` > `REJECTED` > `APPROVED` (then `created_at`).
