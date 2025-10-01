# API: Contents

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-01  
**Status:** Updated

---

## 1. Overview

The Contents API manages course materials such as LECTUREs, assignments, labs, and tutorials. It allows:

- Students to fetch content for specific courses.
- Admins to create, update, and delete content.
- Filtering content by course to support personalized feeds.

Base URL: `<baseurl>/v1/contents/`

---

## 2. Endpoint Details

| Endpoint      | Method | Auth Required     | Description                             |
| ------------- | ------ | ----------------- | --------------------------------------- |
| /             | GET    | `yes`             | Fetch all contents, optionally filtered |
| /             | POST   | `yes (admin/mod)` | Create new content                      |
| /{content_id} | GET    | `yes`             | Fetch specific content                  |
| /{content_id} | PUT    | `yes (admin/mod)` | Update content                          |
| /{content_id} | DELETE | `yes (admin/mod)` | Delete content                          |

**Query Parameters for GET /contents/**

| Parameter | Type   | Description                             | Required |
| --------- | ------ | --------------------------------------- | -------- |
| courseId  | UUID   | Filter contents by course_id            | `no`     |
| search    | STRING | Filter content by content title or tags | `no`     |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Contents (with optional course filter)

**Request**

#### GET `/contents/?courseId=uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "count": 50,
  "next": "https://<baseurl>/v1/contents/?page=2",
  "previous": "https://<baseurl>/v1/contents/?page=1",
  "results": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "title": "Introduction to Algorithms",
      "type": "LECTURE",
      "path": "https://drive.google.com/uc?export=download&id=<file_id>",
      "chapter": "1",
      "file": { "extension": "PPTX", "size": 123, "unit": "KB" },
      "tags": ["algorithms", "basics"],
      "created_at": "2025-09-27T10:00:00Z",
      "updated_at": "2025-09-27T10:05:00Z"
    },
    {
      "id": "uuid",
      "course_id": "uuid",
      "title": "Data Structures",
      "type": "LECTURE",
      "path": "https://drive.google.com/uc?export=download&id=<file_id>",
      "chapter": "2",
      "file": { "extension": "PDF", "size": 1.2, "unit": "MB" },
      "tags": ["data structures", "arrays", "trees"],
      "created_at": "2025-09-28T09:00:00Z",
      "updated_at": "2025-09-28T09:05:00Z"
    }
  ]
}
```

---

### 3.2 Create Content

**Request**

#### POST `/contents/`

> Authorization: Bearer <admin_access_token>

```json
{
  "course_id": "uuid",
  "title": "Advanced Database Systems",
  "type": "LECTURE",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "1",
  "file": { "extension": "PDF", "size": 1, "unit": "MB" },
  "tags": ["database", "advanced"]
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "course_id": "uuid",
  "title": "Advanced Database Systems",
  "type": "LECTURE",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "1",
  "file": { "extension": "PDF", "size": 1, "unit": "MB" },
  "tags": ["database", "advanced"],
  "created_at": "2025-09-27T12:00:00Z",
  "updated_at": "2025-09-27T12:00:00Z"
}
```

---

### 3.3 Get Content by ID

**Request**

#### GET `/contents/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "course_id": "uuid",
  "title": "Introduction to Algorithms",
  "type": "LECTURE",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "1",
  "file": { "extension": "PDF", "size": 2, "unit": "MB" },
  "tags": ["algorithms", "basics"],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.4 Update Content

**Request**

#### PUT `/contents/uuid`

> Authorization: Bearer <admin_access_token>

```json
{
  "title": "Intro to Algorithms",
  "chapter": "2",
  "tags": ["algorithms", "fundamentals"]
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "course_id": "uuid",
  "title": "Intro to Algorithms",
  "type": "LECTURE",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "2",
  "file": { "extension": "PDF", "size": 2, "unit": "MB" },
  "tags": ["algorithms", "fundamentals"],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.5 Delete Content

**Request**

#### DELETE `/contents/uuid`

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

- Related database table: [contents](../architecture/database-schema.md/#6-contents)
- Indexes: `course_id`, `tags`, `type`
- Filtering by `courseId` supports personalized feeds and content search.
