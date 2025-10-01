# API: Notifications

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-01  
**Status:** Updated

---

## 1. Overview

The Notifications API allows the system to send updates to users in-app and via browser push. Notifications can be:

- **Targeted:** Sent to users relevant to a specific course offering based on their department, year, and semester.
- **Global:** Sent to all users for app updates, maintenance, or announcements.

Typical use cases include:

- Notify students about new content uploads.
- Send reminders or alerts for assignments, labs, or lectures.
- Broadcast system-wide updates or announcements.

Base URL: `<baseurl>/v1/notifications/`

---

## 2. Endpoint Details

| Endpoint | Method | Auth Required | Description                         |
| -------- | ------ | ------------- | ----------------------------------- |
| /        | GET    | `yes`         | List notifications for current user |
| /        | POST   | `yes (admin)` | Send a notification                 |
| /{id}    | GET    | `yes`         | Fetch a specific notification       |
| /{id}    | PUT    | `yes`         | Mark notification as read           |
| /{id}    | DELETE | `yes (admin)` | Delete a notification               |

---

## 3. Endpoints with Request & Response Examples

### 3.1 Get Notifications

**Request**

#### GET `/notifications/`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "count": 42,
  "next": "https://<baseurl>/v1/notifications/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "title": "New Lecture Available",
      "message": "Lecture 2 has been uploaded for SE301.",
      "type": "INFO",
      "is_read": false,
      "created_at": "2025-09-27T12:00:00Z",
      "updated_at": "2025-09-27T12:00:00Z"
    },
    {
      "id": "uuid",
      "title": "Assignment Due Reminder",
      "message": "Assignment 1 deadline is tomorrow for SE301.",
      "type": "REMINDER",
      "is_read": false,
      "created_at": "2025-09-27T12:05:00Z",
      "updated_at": "2025-09-27T12:05:00Z"
    }
  ]
}
```

---

### 3.2 Send Notification (Admin)

**Request**

#### POST `/notifications/`

> Authorization: Bearer <access_token>

```json
{
  "course_id": "uuid",
  "title": "New Lecture Available",
  "message": "Lecture 2 has been uploaded for SE301.",
  "type": "INFO",
  "all_users": false
}
```

**Behavior:**

- If `all_users` is `true`, the notification is sent to **all active users** regardless of course or department.
- If `all_users` is `false` (or omitted) and `course_id` is provided:
  - The API determines the users who should receive this notification based on:
    - The course’s offerings (`course_offerings`)
    - Users’ `department`, `year`, and `semester` from their profile
  - Notification is pushed **in-app and via browser** only to relevant users.
- Notifications are stored in the `notifications` table for tracking read-status.

**Response** `201 Created`

```json
{
  "message": "Notification sent to 25 users.",
  "notification_id": "uuid"
}
```

---

### 3.3 Get Notification by ID

**Request**

#### GET `/notifications/uuid`

> Authorization: Bearer <access_token>

**Response** `200 OK`

```json
{
  "id": "uuid",
  "title": "New Lecture Available",
  "message": "Lecture 2 has been uploaded for SE301.",
  "type": "INFO",
  "is_read": false,
  "created_at": "2025-09-27T12:00:00Z",
  "updated_at": "2025-09-27T12:00:00Z"
}
```

---

### 3.4 Mark Notification as Read

**Request**

#### PUT `/notifications/uuid`

> Authorization: Bearer <access_token>

```json
{
  "is_read": true
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "title": "New Lecture Available",
  "message": "Lecture 2 has been uploaded for SE301.",
  "type": "INFO",
  "is_read": true,
  "created_at": "2025-09-27T12:00:00Z",
  "updated_at": "2025-09-27T12:30:00Z"
}
```

---

### 3.5 Delete Notification (Admin)

**Request**

#### DELETE `/notifications/uuid`

> Authorization: Bearer <access_token>

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

- Notifications are delivered **in-app** and optionally via **browser push**.
- Targeted notifications respect user’s department, year, and semester.
- Global notifications can be sent using `all_users: true`.
- Related database table: [notifications](../architecture/database-schema.md/#7-notifications)
