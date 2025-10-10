# API: Notifications

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-11  
**Status:** Updated

---

## 1. Overview

The Notifications API allows the system to send and manage user notifications both **in-app** and via **browser push**. Notifications can be:

- **Targeted:** Sent to users in a specific course offering (based on department, year, and semester).
- **Global:** Sent to all active users for app-wide updates.

Common use cases:

- Notify students about new uploaded content or announcements.
- Send reminders for assignments, labs, or lectures.
- Broadcast maintenance or feature updates.

Base URL: `<baseurl>/v1/notifications/`

---

## 2. Endpoint Details

| Endpoint               | Method | Auth Required | Description                             |
| ---------------------- | ------ | ------------- | --------------------------------------- |
| /                      | GET    | `yes`         | List notifications for the current user |
| /                      | POST   | `yes (admin)` | Create and send a notification          |
| /uuid:notification_id/ | GET    | `yes`         | Fetch a specific notification by ID     |
| /uuid:notification_id/ | PUT    | `yes`         | Mark a notification as read             |
| /uuid:notification_id/ | DELETE | `yes (admin)` | Delete a notification                   |

---

## 3. Endpoints with Request & Response Examples

### 3.1 List Notifications

**Request**

#### GET `/notifications/`

> Authorization: Bearer `<access_token>`

**Response** `200 OK`

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user": "uuid",
      "title": "New Lecture Available",
      "message": "Lecture 2 has been uploaded for SOEng2051.",
      "type": "INFO",
      "is_read": false,
      "created_at": "2025-10-11T12:00:00Z",
      "updated_at": "2025-10-11T12:00:00Z"
    },
    {
      "id": "uuid",
      "user": "uuid",
      "title": "Assignment Reminder",
      "message": "Assignment 1 is due tomorrow.",
      "type": "REMINDER",
      "is_read": true,
      "created_at": "2025-10-11T12:05:00Z",
      "updated_at": "2025-10-11T12:15:00Z"
    }
  ]
}
```

---

### 3.2 Send Notification

**Request**

#### POST `/notifications/`

> Authorization: Bearer `<access_token>`

```json
{
  "title": "New Lecture Available",
  "message": "Lecture 2 has been uploaded for SE301.",
  "type": "INFO",
  "all_users": false,
  "user": ["uuid1", "uuid2"]
}
```

**Behavior:**

- If `all_users` = `true`, the notification is sent to **all active users**.
- If `all_users` = `false` and `course_id` is provided, recipients are determined by:
  - The course’s offerings (`course_offerings`)
  - Users’ `department`, `year`, and `semester`
- If neither is provided, only users in the `user` list receive it.

**Response** `201 Created`

```json
{
  "message": "Notification sent to 25 users."
}
```

---

### 3.3 Get Notification by ID

**Request**

#### GET `/notifications/uuid:notification_id/`

> Authorization: Bearer `<access_token>`

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user": "uuid",
  "title": "New Lecture Available",
  "message": "Lecture 2 has been uploaded for SE301.",
  "type": "INFO",
  "is_read": false,
  "created_at": "2025-10-11T12:00:00Z",
  "updated_at": "2025-10-11T12:00:00Z"
}
```

---

### 3.4 Mark Notification as Read

**Request**

#### PUT `/notifications/uuid:notification_id/`

> Authorization: Bearer `<access_token>`

```json
{
  "is_read": true
}
```

**Response** `200 OK`

```json
{
  "id": "uuid",
  "user": "uuid",
  "title": "New Lecture Available",
  "message": "Lecture 2 has been uploaded for SE301.",
  "type": "INFO",
  "is_read": true,
  "created_at": "2025-10-11T12:00:00Z",
  "updated_at": "2025-10-11T12:30:00Z"
}
```

---

### 3.5 Delete Notification

**Request**

#### DELETE `/notifications/uuid:notification_id/`

> Authorization: Bearer `<access_token>`

**Response** `204 No Content`

---

## 4. Error Codes

| HTTP Code | Error Name            | Description                                     |
| --------- | --------------------- | ----------------------------------------------- |
| 400       | Bad Request           | Missing or invalid parameters                   |
| 401       | Unauthorized          | Invalid credentials or missing JWT              |
| 403       | Forbidden             | User does not have permission to perform action |
| 404       | Not Found             | Notification not found                          |
| 500       | Internal Server Error | Unexpected server error                         |
| 503       | Service Unavailable   | Server temporarily unavailable                  |

---

## 5. Notes / References

- Notifications are sent **in bulk** when `all_users` or multiple user IDs are provided.
- Users can only view notifications addressed to them.
- Admins can create, update, and delete notifications.
- Pagination defaults to **10 notifications per page**, with a max of **50**.
- Related database table: [notifications](../architecture/database-schema.md/#7-notifications)
