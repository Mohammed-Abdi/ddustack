# API: Courses

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-01  
**Status:** Update

---

## 1. Overview

The Courses API manages all academic courses. It supports CRUD operations for admins and read-only access for students. Typical use cases include:

- Admins creating, updating, and deleting courses.
- Students fetching courses for browsing or personalized feed.
- Filtering courses by department, year, or semester.

Base URL: `<baseurl>/v1/courses/`

---

## 2. Endpoint Details

| Endpoint     | Method | Auth Required     | Description                                     |
| ------------ | ------ | ----------------- | ----------------------------------------------- |
| /            | GET    | `yes`             | Fetch list of all courses with optional filters |
| /            | POST   | `yes (admin/mod)` | Create a new course                             |
| /{course_id} | GET    | `yes`             | Fetch details of a specific course              |
| /{course_id} | PUT    | `yes (admin/mod)` | Update course info                              |
| /{course_id} | DELETE | `yes (admin/mod)` | Delete a course                                 |

**Query Parameters for GET /courses/**

| Parameter    | Type   | Description                            | Required |
| ------------ | ------ | -------------------------------------- | -------- |
| departmentId | UUID   | Filter courses by department           | `no`     |
| year         | INT    | Filter courses by year of offering     | `no`     |
| semester     | INT    | Filter courses by semester of offering | `no`     |
| search       | STRING | Filter courses by course code or tags  | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Courses (with optional filters)

**Request**

#### GET `/courses/?departmentId=uuid&year=3&semester=1`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "count": 50,
  "next": "https://<baseurl>/v1/departments/?page=3",
  "previous": "https://<baseurl>/v1/departments/?page=1",
  "results": [
    {
      "id": "uuid",
      "code": "SOEng2022",
      "name": "Data Structure and Algorithms",
      "description": "Techniques for organizing and processing data",
      "status": "compulsory",
      "credit_points": 5,
      "lecture_hours": 2,
      "lab_hours": 4,
      "tutorial_hours": 1,
      "homework_hours": 5,
      "credit_hours": 3,
      "tags": [
        "data structures",
        "arrays",
        "trees",
        "stack",
        "linked list",
        "queue"
      ],
      "created_at": "2025-09-27T10:00:00Z",
      "updated_at": "2025-09-27T12:10:00Z"
    },
    {
      "id": "uuid",
      "code": "CS2025",
      "name": "Operating Systems",
      "description": "Introduction to operating systems concepts",
      "status": "compulsory",
      "credit_points": 4,
      "lecture_hours": 3,
      "lab_hours": 2,
      "tutorial_hours": 1,
      "homework_hours": 3,
      "credit_hours": 3,
      "tags": ["os", "process", "threads", "scheduling"],
      "created_at": "2025-09-28T08:00:00Z",
      "updated_at": "2025-09-28T09:00:00Z"
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
  "code": "SOEng2022",
  "name": "Data Structure and Algorithms",
  "description": "Techniques for organizing and processing data",
  "status": "compulsory",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 4,
  "tutorial_hours": 1,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": [
    "data structures",
    "arrays",
    "trees",
    "stack",
    "linked list",
    "queue"
  ]
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "code": "SOEng2022",
  "name": "Data Structure and Algorithms",
  "description": "Techniques for organizing and processing data",
  "status": "compulsory",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 4,
  "tutorial_hours": 1,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": [
    "data structures",
    "arrays",
    "trees",
    "stack",
    "linked list",
    "queue"
  ],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.3 Get Course by ID

**Request**

#### GET `/courses/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "code": "SOEng2022",
  "name": "Data Structure and Algorithms",
  "description": "Techniques for organizing and processing data",
  "status": "compulsory",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 4,
  "tutorial_hours": 1,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": [
    "data structures",
    "arrays",
    "trees",
    "stack",
    "linked list",
    "queue"
  ],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.4 Update Course

**Request**

#### PUT `/courses/uuid`

> Authorization: Bearer <admin_access_token>

```json
{
  "name": "Data Structure and Algorithms",
  "description": "Techniques for organizing and processing data"
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "code": "SOEng2022",
  "name": "Data Structure and Algorithms",
  "description": "Techniques for organizing and processing data",
  "status": "compulsory",
  "credit_points": 5,
  "lecture_hours": 2,
  "lab_hours": 4,
  "tutorial_hours": 1,
  "homework_hours": 5,
  "credit_hours": 3,
  "tags": [
    "data structures",
    "arrays",
    "trees",
    "stack",
    "linked list",
    "queue"
  ],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.5 Delete Course

**Request**

#### DELETE `/courses/uuid`

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
- Indexes: `code`, `tags`
- Filtering courses by `departmentId`, `year`, or `semester` supports the personalized feed and search functionalities.
