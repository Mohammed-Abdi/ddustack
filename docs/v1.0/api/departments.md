# API: Departments

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-01  
**Status:** Update

---

## 1. Overview

The Departments API manages academic departments within schools. It supports CRUD operations for admins and read-only access for students. Typical use cases include:

- Admins creating, updating, and deleting departments.
- Students fetching departments by school for content navigation.
- Organizing courses and contents by department.

Base URL: `<baseurl>/v1/departments/`

---

## 2. Endpoint Details

| Endpoint         | Method | Auth Required     | Description                            |
| ---------------- | ------ | ----------------- | -------------------------------------- |
| /                | GET    | `yes`             | Fetch list of all departments          |
| /                | POST   | `yes (admin/mod)` | Create a new department                |
| /{department_id} | GET    | `yes`             | Fetch details of a specific department |
| /{department_id} | PUT    | `yes (admin/mod)` | Update department info                 |
| /{department_id} | DELETE | `yes (admin/mod)` | Delete a department                    |

**Query Parameters for GET /contents/**

| Parameter | Type   | Description                  | Required |
| --------- | ------ | ---------------------------- | -------- |
| schoolId  | UUID   | Filter departments by school | `no`     |
| search    | STRING | Search departments by name   | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get All Departments

**Request**

#### GET `/departments/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Software Engineering",
    "school_id": "uuid",
    "year": 4,
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:05:00Z"
  },
  {
    "id": "uuid",
    "name": "Computer Science",
    "school_id": "uuid",
    "year": 4,
    "created_at": "2025-09-27T10:10:00Z",
    "updated_at": "2025-09-27T10:15:00Z"
  }
]
```

---

### 3.2 Get Departments by School

**Request**

#### GET `/departments/?school_id=uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Software Engineering",
    "school_id": "uuid",
    "year": 4,
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:05:00Z"
  }
]
```

---

### 3.3 Create Department

**Request**

#### POST `/departments/`

> Authorization: Bearer <admin_access_token>

```json
{
  "name": "Electrical Engineering",
  "school_id": "uuid",
  "year": 4
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "name": "Electrical Engineering",
  "school_id": "uuid",
  "year": 4,
  "created_at": "2025-09-27T12:00:00Z",
  "updated_at": "2025-09-27T12:00:00Z"
}
```

---

### 3.4 Get Department by ID

**Request**

#### GET `/departments/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "name": "Software Engineering",
  "school_id": "uuid",
  "year": 4,
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.5 Update Department

**Request**

#### PUT `/departments/uuid`

> Authorization: Bearer <admin_access_token>

```json
{
  "name": "Advanced Software Engineering",
  "year": 4
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "name": "Advanced Software Engineering",
  "school_id": "uuid",
  "year": 4,
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.6 Delete Department

**Request**

#### DELETE `/departments/uuid`

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

- Related database table: [departments](../architecture/database-schema.md/#3-departments)
- Indexes: `school_id`, `name`
- Departments are often filtered by `school_id` to support hierarchical navigation.
