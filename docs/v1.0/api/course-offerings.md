# API: Course Offerings

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-11  
**Status:** Updated

---

## 1. Overview

The Course Offerings API manages the mapping between courses, departments, academic years, and semesters. It enables:

- Students to view available courses per department, year, and semester.
- Admins or moderators to create, update, and delete course offerings.
- Filtering to support personalized course discovery.

Base URL: `<baseurl>/v1/course-offerings/`

---

## 2. Endpoint Details

| Endpoint           | Method | Auth Required     | Description                                     |
| ------------------ | ------ | ----------------- | ----------------------------------------------- |
| /                  | GET    | `yes`             | List all course offerings with optional filters |
| /                  | POST   | `yes (admin/mod)` | Create a new course offering                    |
| /uuid:offering_id/ | GET    | `yes`             | Retrieve details of a specific offering         |
| /uuid:offering_id/ | PUT    | `yes (admin/mod)` | Update a course offering                        |
| /uuid:offering_id/ | DELETE | `yes (admin/mod)` | Delete a course offering                        |

**Query Parameters for GET /course-offerings/**

| Parameter     | Type | Description             | Required |
| ------------- | ---- | ----------------------- | -------- |
| department_id | UUID | Filter by department    | `no`     |
| year          | INT  | Filter by academic year | `no`     |
| semester      | INT  | Filter by semester      | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Course Offerings (with optional filters)

**Request**

#### GET `/course-offerings/?department_id=uuid&year=3&semester=1`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
[
  {
    "id": "uuid",
    "course": "uuid",
    "department": "uuid",
    "year": 3,
    "semester": 1,
    "created_at": "2025-10-11T10:00:00Z",
    "updated_at": "2025-10-11T10:05:00Z"
  }
]
```

---

### 3.2 Create Course Offering

**Request**

#### POST `/course-offerings/`

> Authorization: Bearer <admin_access_token>

```json
{
  "course": "uuid",
  "department": "uuid",
  "year": 3,
  "semester": 1
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "course": "uuid",
  "department": "uuid",
  "year": 3,
  "semester": 1,
  "created_at": "2025-10-11T12:00:00Z",
  "updated_at": "2025-10-11T12:00:00Z"
}
```

---

### 3.3 Get Course Offering by ID

**Request**

#### GET `/course-offerings/uuid:offering_id/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "course": "uuid",
  "department": "uuid",
  "year": 3,
  "semester": 1,
  "created_at": "2025-10-11T10:00:00Z",
  "updated_at": "2025-10-11T10:05:00Z"
}
```

---

### 3.4 Update Course Offering

**Request**

#### PUT `/course-offerings/uuid:offering_id/`

> Authorization: Bearer <admin_access_token>

```json
{
  "year": 4,
  "semester": 2
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "course": "uuid",
  "department": "uuid",
  "year": 4,
  "semester": 2,
  "created_at": "2025-10-11T10:00:00Z",
  "updated_at": "2025-10-11T12:10:00Z"
}
```

---

### 3.5 Delete Course Offering

**Request**

#### DELETE `/course-offerings/uuid:offering_id/`

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

- Related database table: [course_offerings](../architecture/database-schema.md/#5-course-offerings)
- Indexes: `course`, `department`, `(year, semester)`
- Filtering by `department_id`, `year`, or `semester` supports personalized feeds and academic search features.
