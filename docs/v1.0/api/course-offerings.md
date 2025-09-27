# API: Course Offerings

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview

The Course Offerings API manages the mapping of courses to departments, academic years, and semesters. It allows:

- Students to fetch courses offered for their department, year, and semester.
- Admins to create, update, and delete course offerings.
- Filtering of courses to support personalized feeds.

Base URL: `<baseurl>/v1/course-offerings/`

---

## 2. Endpoint Details

| Endpoint       | Method | Auth Required | Description                                     |
| -------------- | ------ | ------------- | ----------------------------------------------- |
| /              | GET    | `yes`         | Fetch all course offerings, optionally filtered |
| /              | POST   | `yes`         | Create a new course offering (Admin)            |
| /{offering_id} | GET    | `yes`         | Fetch a specific course offering                |
| /{offering_id} | PUT    | `yes`         | Update a course offering (Admin)                |
| /{offering_id} | DELETE | `yes`         | Delete a course offering (Admin)                |

**Query Parameters for GET /course-offerings/**

| Parameter    | Type | Description                       | Required |
| ------------ | ---- | --------------------------------- | -------- |
| departmentId | UUID | Filter offerings by department    | `no`     |
| year         | INT  | Filter offerings by academic year | `no`     |
| semester     | INT  | Filter offerings by semester      | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Course Offerings (with optional filters)

**Request**

#### GET `/course-offerings/?departmentId=uuid&year=3&semester=1`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
[
  {
    "id": "uuid",
    "course_id": "uuid",
    "department_id": "uuid",
    "year": 3,
    "semester": 1,
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:05:00Z"
  }
]
```

---

### 3.2 Create Course Offering

**Request**

#### POST `/course-offerings/`

> Authorization: Bearer <access_token>

```json
{
  "course_id": "uuid",
  "department_id": "uuid",
  "year": 3,
  "semester": 1
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "course_id": "uuid",
  "department_id": "uuid",
  "year": 3,
  "semester": 1,
  "created_at": "2025-09-27T12:00:00Z",
  "updated_at": "2025-09-27T12:00:00Z"
}
```

---

### 3.3 Get Course Offering by ID

**Request**

#### GET `/course-offerings/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "course_id": "uuid",
  "department_id": "uuid",
  "year": 3,
  "semester": 1,
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.4 Update Course Offering

**Request**

#### PUT `/course-offerings/uuid`

> Authorization: Bearer <access_token>

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
  "course_id": "uuid",
  "department_id": "uuid",
  "year": 4,
  "semester": 2,
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.5 Delete Course Offering

**Request**

#### DELETE `/course-offerings/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "message": "Course offering deleted successfully."
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

- Related database table: [course_offerings](../architecture/database-schema.md/#5-course-offerings)
- Indexes: `course_id`, `department_id`, `(year, semester)`
- Filtering by `departmentId`, `year`, or `semester` supports the personalized feed and search functionalities.
