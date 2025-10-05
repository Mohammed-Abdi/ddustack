# API: Intakes

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-05  
**Status:** Update

---

## 1. Overview

The Intakes API manages all user-submitted requests for access, role changes, feedback, complaints, leaves, or grade reviews. It supports CRUD operations for admins, moderators, and lecturers, while users can submit new requests. Typical use cases include:

- Users submitting requests (POST) for access, role changes, feedback, complaints, leaves, or grade reviews.
- Admins, Moderators, and Lecturers managing and reviewing intake requests.
- Filtering requests by type or status.
- Searching requests by `full_name`, `staff_id`, or `student_id`.

Base URL: `<baseurl>/v1/intakes/`

---

## 2. Endpoint Details

| Endpoint     | Method | Auth Required              | Description                                     |
| ------------ | ------ | -------------------------- | ----------------------------------------------- |
| /            | GET    | `yes (admin/mod/lecturer)` | Fetch list of all intakes with optional filters |
| /            | POST   | `yes`                      | Submit a new intake request                     |
| /{intake_id} | GET    | `yes (admin/mod/lecturer)` | Fetch details of a specific intake request      |
| /{intake_id} | PUT    | `yes (admin/mod/lecturer)` | Update an intake request                        |
| /{intake_id} | PATCH  | `yes (admin/mod/lecturer)` | Partially update an intake request              |
| /{intake_id} | DELETE | `yes (admin/mod)`          | Delete an intake request                        |

**Query Parameters for GET /intakes/**

| Parameter | Type   | Description                                                | Required |
| --------- | ------ | ---------------------------------------------------------- | -------- |
| type      | STRING | Filter intakes by request type (ACCESS, LEAVE...)          | `no`     |
| status    | STRING | Filter intakes by status (PENDING, APPROVED, REJECTED)     | `no`     |
| search    | STRING | Filter intakes by `full_name`, `staff_id`, or `student_id` | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Intakes (with optional filters)

**Request**

#### GET `/intakes/?type=GRADE_REVIEW&status=PENDING&search=John`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "GRADE_REVIEW",
      "status": "PENDING",
      "full_name": "John Doe",
      "phone_number": "0912345678",
      "staff_id": null,
      "student_id": "S12345",
      "department_id": "D001",
      "description": "Requesting grade review for CS101",
      "created_at": "2025-10-04T10:00:00Z",
      "updated_at": "2025-10-04T10:00:00Z"
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
  "phone_number": "0912345678",
  "staff_id": "STF12345",
  "description": "Requesting access to admin platform"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "ACCESS",
  "status": "PENDING",
  "full_name": "Jane Doe",
  "phone_number": "0912345678",
  "staff_id": "STF12345",
  "student_id": null,
  "department_id": null,
  "description": "Requesting access to admin platform",
  "created_at": "2025-10-05T08:00:00Z",
  "updated_at": "2025-10-05T08:00:00Z"
}
```

---

### 3.3 Get Intake by ID

**Request**

#### GET `/intakes/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "LEAVE",
  "status": "APPROVED",
  "full_name": "Alice Smith",
  "phone_number": "0912345678",
  "staff_id": "STF56789",
  "student_id": null,
  "department_id": null,
  "description": "Requesting leave for personal reasons",
  "created_at": "2025-10-01T09:00:00Z",
  "updated_at": "2025-10-02T11:00:00Z"
}
```

---

### 3.4 Update Intake

**Request**

#### PUT `/intakes/uuid`

> Authorization: Bearer <access_token>

```json
{
  "status": "REJECTED",
  "description": "Insufficient details provided"
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "ACCESS",
  "status": "REJECTED",
  "full_name": "Jane Doe",
  "phone_number": "0912345678",
  "staff_id": "STF12345",
  "student_id": null,
  "department_id": null,
  "description": "Insufficient details provided",
  "created_at": "2025-10-05T08:00:00Z",
  "updated_at": "2025-10-05T10:00:00Z"
}
```

---

### 3.5 Delete Intake

**Request**

#### DELETE `/intakes/uuid`

> Authorization: Bearer <access_token>

**Response** `204 No Content`

---

## 4. Error Codes

| HTTP Code | Error Name            | Description                                      |
| --------- | --------------------- | ------------------------------------------------ |
| 400       | Bad Request           | Missing or invalid parameters                    |
| 401       | Unauthorized          | Invalid credentials or missing JWT               |
| 403       | Forbidden             | User does not have permission to access resource |
| 404       | Not Found             | Intake request not found                         |
| 500       | Internal Server Error | Unexpected server error                          |
| 503       | Service Unavailable   | Server temporarily unavailable                   |

---

## 5. Notes / References

- Related database table: [intake](../architecture/database-schema.md/#9-intake)
- Indexes: `type`, `status`
- Filtering and search support helps admins, moderators, and lecturers quickly locate requests based on type, status, or user identifiers.
