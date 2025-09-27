# API: Contents

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview

The Contents API manages course materials such as lectures, assignments, labs, and tutorials. It allows:

- Students to fetch content for specific courses.
- Admins to create, update, and delete content.
- Filtering content by course to support personalized feeds.

Base URL: `<baseurl>/v1/contents/`

---

## 2. Endpoint Details

| Endpoint      | Method | Auth Required | Description                             |
| ------------- | ------ | ------------- | --------------------------------------- |
| /             | GET    | `yes`         | Fetch all contents, optionally filtered |
| /             | POST   | `yes`         | Create new content (Admin)              |
| /{content_id} | GET    | `yes`         | Fetch specific content                  |
| /{content_id} | PUT    | `yes`         | Update content (Admin)                  |
| /{content_id} | DELETE | `yes`         | Delete content (Admin)                  |

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
[
  {
    "id": "uuid",
    "course_id": "uuid",
    "title": "Introduction to Algorithms",
    "type": "lecture",
    "path": "https://drive.google.com/uc?export=download&id=<file_id>",
    "chapter": "1",
    "file": { "extension": "pdf", "size": 12, "unit": "MB" },
    "tags": ["algorithms", "basics"],
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:05:00Z"
  }
]
```

---

### 3.2 Create Content

**Request**

#### POST `/contents/`

> Authorization: Bearer <access_token>

```json
{
  "course_id": "uuid",
  "title": "Advanced Database Systems",
  "type": "lecture",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "1",
  "file": { "extension": "pdf", "size": 15, "unit": "MB" },
  "tags": ["database", "advanced"]
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "course_id": "uuid",
  "title": "Advanced Database Systems",
  "type": "lecture",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "1",
  "file": { "extension": "pdf", "size": 15, "unit": "MB" },
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
  "type": "lecture",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "1",
  "file": { "extension": "pdf", "size": 12, "unit": "MB" },
  "tags": ["algorithms", "basics"],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:05:00Z"
}
```

---

### 3.4 Update Content

**Request**

#### PUT `/contents/uuid`

> Authorization: Bearer <access_token>

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
  "type": "lecture",
  "path": "https://drive.google.com/uc?export=download&id=<file_id>",
  "chapter": "2",
  "file": { "extension": "pdf", "size": 12, "unit": "MB" },
  "tags": ["algorithms", "fundamentals"],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T12:10:00Z"
}
```

---

### 3.5 Delete Content

**Request**

#### DELETE `/contents/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "message": "Content deleted successfully."
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

- Related database table: [contents](../architecture/database-schema.md/#6-contents)
- Indexes: `course_id`, `tags`, `type`
- Filtering by `courseId` supports personalized feeds and content search.
