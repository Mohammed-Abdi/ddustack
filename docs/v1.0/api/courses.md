# API: Courses

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-11  
**Status:** Updated

---

## 1. Overview

The Courses API manages all academic courses. It supports CRUD operations for admins and moderators, while students have read-only access.

Use cases include:

- Admins creating, updating, and deleting courses.
- Students browsing, filtering, or searching courses by department, year, or semester.
- Providing course data for personalized feeds and learning paths.

Base URL: `<baseurl>/v1/courses/`

---

## 2. Endpoint Details

| Endpoint         | Method | Auth Required     | Description                                     |
| ---------------- | ------ | ----------------- | ----------------------------------------------- |
| /                | GET    | `yes`             | Fetch list of all courses with optional filters |
| /                | POST   | `yes (admin/mod)` | Create a new course                             |
| /uuid:course_id/ | GET    | `yes`             | Fetch details of a specific course              |
| /uuid:course_id/ | PUT    | `yes (admin/mod)` | Update course info                              |
| /uuid:course_id/ | DELETE | `yes (admin/mod)` | Delete a course                                 |

**Query Parameters for GET /courses/**

| Parameter     | Type   | Description                            | Required |
| ------------- | ------ | -------------------------------------- | -------- |
| department_id | UUID   | Filter courses by department           | `no`     |
| year          | INT    | Filter courses by year of offering     | `no`     |
| semester      | INT    | Filter courses by semester of offering | `no`     |
| search        | STRING | Filter by code, abbreviation, or tags  | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Courses (with optional filters)

**Request**

#### GET `/courses/?department_id=uuid&year=3&semester=1`

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
      "code": "SOEng2022",
      "name": "Data Structures and Algorithms",
      "abbreviation": "DSA",
      "description": "Techniques for organizing and processing data.",
      "status": "COMPULSORY",
      "credit_points": 5,
      "lecture_hours": 2,
      "lab_hours": 2,
      "tutorial_hours": 1,
      "homework_hours": 5,
      "credit_hours": 3,
      "tags": ["data", "trees", "stacks", "algorithms"],
      "created_at": "2025-10-11T09:00:00Z",
      "updated_at": "2025-10-11T09:05:00Z"
    },
    {
      "id": "uuid",
      "code": "SOEng2032",
      "name": "Operating Systems",
      "abbreviation": "OS",
      "description": "Introduction to processes, threads, and scheduling.",
      "status": "COMPULSORY",
      "credit_points": 5,
      "lecture_hours": 2,
      "lab_hours": 3,
      "tutorial_hours": 1,
      "homework_hours": 5,
      "credit_hours": 3,
      "tags": ["os", "threads", "process", "scheduling"],
      "created_at": "2025-10-11T09:10:00Z",
      "updated_at": "2025-10-11T09:15:00Z"
    }
  ]
}
```

---

### 3.2 Create Course

**Request**

#### POST `/courses/`

> Authorization: Bearer <admin_access_token>

```json
{
  "code": "SOEng2042",
  "name": "Fundamentals of Database Systems",
  "abbreviation": "FDB",
  "description": "Introduction to database design, SQL, and data modeling.",
  "status": "COMPULSORY",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 3,
  "tutorial_hours": 0,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": ["database", "SQL", "normalization", "ERD"]
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "code": "SOEng2042",
  "name": "Fundamentals of Database Systems",
  "abbreviation": "FDB",
  "description": "Introduction to database design, SQL, and data modeling.",
  "status": "COMPULSORY",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 3,
  "tutorial_hours": 0,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": ["database", "SQL", "normalization", "ERD"],
  "created_at": "2025-10-11T10:00:00Z",
  "updated_at": "2025-10-11T10:00:00Z"
}
```

---

### 3.3 Get Course by ID

**Request**

#### GET `/courses/uuid:course_id/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "code": "SOEng2022",
  "name": "Data Structures and Algorithms",
  "abbreviation": "DSA",
  "description": "Techniques for organizing and processing data.",
  "status": "COMPULSORY",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 2,
  "tutorial_hours": 1,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": ["data", "trees", "stacks", "algorithms"],
  "created_at": "2025-10-11T09:00:00Z",
  "updated_at": "2025-10-11T09:05:00Z"
}
```

---

### 3.4 Update Course

**Request**

#### PUT `/courses/uuid:course_id/`

> Authorization: Bearer <admin_access_token>

```json
{
  "name": "Digital Logic Design",
  "description": "Covers combinational and sequential logic, circuit design, and digital systems.",
  "tags": ["logic", "digital", "circuits", "design"]
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "code": "ECEG2142",
  "name": "Digital Logic Design",
  "abbreviation": "DLD",
  "description": "Covers combinational and sequential logic, circuit design, and digital systems.",
  "status": "COMPULSORY",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 3,
  "tutorial_hours": 0,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": ["logic", "digital", "circuits", "design"],
  "created_at": "2025-10-11T09:00:00Z",
  "updated_at": "2025-10-11T12:00:00Z"
}
```

---

### 3.5 Delete Course

**Request**

#### DELETE `/courses/uuid:course_id/`

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

- Related database table: [courses](../architecture/database-schema.md/#4-courses)
- Indexes: `code`, `abbreviation`, `tags`
- Courses can be filtered by `department_id`, `year`, or `semester` for academic structuring and personalized recommendations.
