# API: Course Assignments

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-11  
**Status:** Updated

---

## 1. Overview

The Course Assignments API manages the mapping between users and courses. It enables:

- Admins or moderators to assign courses to users and manage assignments.
- Students or staff to view their assigned courses.
- Filtering and searching for assignments by user or course.

Base URL: `<baseurl>/v1/course-assignments/`

---

## 2. Endpoint Details

| Endpoint             | Method | Auth Required     | Description                               |
| -------------------- | ------ | ----------------- | ----------------------------------------- |
| /                    | GET    | `yes`             | List all course assignments (paginated)   |
| /                    | POST   | `yes (admin/mod)` | Create a new course assignment            |
| /uuid:assignment_id/ | GET    | `yes`             | Retrieve details of a specific assignment |
| /uuid:assignment_id/ | PUT    | `yes (admin/mod)` | Update a course assignment                |
| /uuid:assignment_id/ | DELETE | `yes (admin/mod)` | Delete a course assignment                |

**Query Parameters for GET /course-assignments/**

| Parameter | Type | Description                   | Required |
| --------- | ---- | ----------------------------- | -------- |
| user_id   | UUID | Filter assignments by user    | `no`     |
| course_id | UUID | Filter assignments by course  | `no`     |
| search    | STR  | Search by user name or course | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 List Course Assignments

**Request**

#### GET `/course-assignments/?user_id=uuid&course_id=uuid&search=math`

> Authorization: Bearer <access_token>

**Response** `200 OK` (Paginated)

```json
{
  "count": 12,
  "next": "https://<baseurl>/v1/course-assignments/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user": "uuid",
      "course": "uuid",
      "created_at": "2025-10-01T10:00:00Z",
      "updated_at": "2025-10-01T10:05:00Z"
    }
  ]
}
```

---

### 3.2 Create Course Assignment

**Request**

#### POST `/course-assignments/`

> Authorization: Bearer <admin_access_token>

```json
{
  "user": "uuid",
  "course": "uuid"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "user": "uuid",
  "course": "uuid",
  "created_at": "2025-10-11T10:00:00Z",
  "updated_at": "2025-10-11T10:05:00Z"
}
```

---

### 3.3 Get Course Assignment by ID

**Request**

#### GET `/course-assignments/uuid:assignment_id/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user": "uuid",
  "course": "uuid",
  "created_at": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-01T10:05:00Z"
}
```

---

### 3.4 Update Course Assignment

**Request**

#### PUT `/course-assignments/uuid:assignment_id/`

> Authorization: Bearer <admin_access_token>

```json
{
  "user": "uuid",
  "course": "uuid"
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user": "uuid",
  "course": "uuid",
  "created_at": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-11T12:00:00Z"
}
```

---

### 3.5 Delete Course Assignment

**Request**

#### DELETE `/course-assignments/uuid:assignment_id/`

> Authorization: Bearer <admin_access_token>

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

- Related database table: [course_assignments](../architecture/database-schema.md/#10-course-assignments)
- Indexes: `user`, `course`
- Filtering by `user_id` or `course_id` supports personalized dashboards and admin assignment management.
