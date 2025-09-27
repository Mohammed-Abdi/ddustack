# Database Schema

This document describes the database schema for DduStack, including tables, columns, data types, relationships, recommended indexes, and required status.

---

## 1. Users

**Table Name:** `users`

| Field         | Type         | Description                                     | Required |
| ------------- | ------------ | ----------------------------------------------- | -------- |
| id            | UUID         | Primary key                                     | `yes`    |
| first_name    | VARCHAR(255) | User's first name                               | `yes`    |
| last_name     | VARCHAR(255) | User's last name                                | `yes`    |
| email         | VARCHAR(255) | User's email, unique                            | `yes`    |
| provider      | VARCHAR(255) | Authentication provider                         | `no`     |
| provider_id   | VARCHAR(255) | Provider-specific user ID for Google/other auth | `no`     |
| role          | ENUM         | `student`, `moderator`, `admin`                 | `yes`    |
| is_active     | BOOLEAN      | Whether the user account is active              | `yes`    |
| department_id | UUID         | References `departments.id`, can be null        | `no`     |
| year          | INTEGER      | Academic year                                   | `no`     |
| semester      | INTEGER      | Academic semester                               | `no`     |
| date_joined   | TIMESTAMP    | User creation date                              | `yes`    |
| updated_at    | TIMESTAMP    | Last update timestamp                           | `yes`    |

**Indexes:**

- `email` (unique)
- `department_id`
- `role`

---

## 2. Schools

**Table Name:** `schools`

| Field      | Type         | Description         | Required |
| ---------- | ------------ | ------------------- | -------- |
| id         | UUID         | Primary key         | `yes`    |
| name       | VARCHAR(255) | School name, unique | `yes`    |
| created_at | TIMESTAMP    | Creation time       | `yes`    |
| updated_at | TIMESTAMP    | Last update         | `yes`    |

**Indexes:**

- `name` (unique)

---

## 3. Departments

**Table Name:** `departments`

| Field      | Type         | Description                   | Required |
| ---------- | ------------ | ----------------------------- | -------- |
| id         | UUID         | Primary key                   | `yes`    |
| name       | VARCHAR(255) | Department name               | `yes`    |
| school_id  | UUID         | References `schools.id`       | `yes`    |
| year       | INTEGER      | Number of years in department | `no`     |
| created_at | TIMESTAMP    | Creation time                 | `yes`    |
| updated_at | TIMESTAMP    | Last update                   | `yes`    |

**Indexes:**

- `school_id`
- `name`

---

## 4. Courses

**Table Name:** `courses`

| Field          | Type         | Description                                      | Required |
| -------------- | ------------ | ------------------------------------------------ | -------- |
| id             | UUID         | Primary key                                      | `yes`    |
| code           | VARCHAR(10)  | Course code, unique                              | `yes`    |
| name           | VARCHAR(255) | Course name                                      | `yes`    |
| description    | TEXT         | Course description                               | `no`     |
| status         | ENUM         | `compulsory`, `supportive`, `common`, `elective` | `yes`    |
| credit_points  | INTEGER      | Credit points                                    | `no`     |
| lecture_hours  | INTEGER      | Number of lecture hours                          | `no`     |
| lab_hours      | INTEGER      | Number of lab hours                              | `no`     |
| tutorial_hours | INTEGER      | Number of tutorial hours                         | `no`     |
| homework_hours | INTEGER      | Number of homework hours                         | `no`     |
| credit_hours   | INTEGER      | Total credit hours                               | `no`     |
| tags           | TEXT[]       | Indexed tags for search/filter                   | `no`     |
| created_at     | TIMESTAMP    | Creation time                                    | `yes`    |
| updated_at     | TIMESTAMP    | Last update                                      | `yes`    |

**Indexes:**

- `code` (unique)
- `department_id`
- `tags`

---

## 5. Course Offerings

**Table Name:** `course_offerings`

| Field         | Type      | Description                 | Required |
| ------------- | --------- | --------------------------- | -------- |
| id            | UUID      | Primary key                 | `yes`    |
| course_id     | UUID      | References `courses.id`     | `yes`    |
| department_id | UUID      | References `departments.id` | `yes`    |
| year          | INTEGER   | Academic year               | `yes`    |
| semester      | INTEGER   | Semester (1, 2, etc.)       | `yes`    |
| created_at    | TIMESTAMP | Creation time               | `yes`    |
| updated_at    | TIMESTAMP | Last update                 | `yes`    |

**Indexes:**

- `course_id`
- `department_id`
- `(year, semester)`

---

## 6. Contents

**Table Name:** `contents`

| Field      | Type         | Description                                                 | Required |
| ---------- | ------------ | ----------------------------------------------------------- | -------- |
| id         | UUID         | Primary key                                                 | `yes`    |
| course_id  | UUID         | References `courses.id`                                     | `yes`    |
| title      | VARCHAR(255) | Content title                                               | `yes`    |
| type       | ENUM         | `lecture`, `assignment`, `lab`, `tutorial`                  | `yes`    |
| path       | VARCHAR(255) | File path/location                                          | `yes`    |
| chapter    | VARCHAR(255) | Chapter name                                                | `no`     |
| file       | JSONB        | Contains `{ "extension": "pdf", "size": 10, "unit": "MB" }` | `yes`    |
| tags       | TEXT[]       | Tags for filtering/search                                   | `no`     |
| created_at | TIMESTAMP    | Creation time                                               | `yes`    |
| updated_at | TIMESTAMP    | Last update                                                 | `yes`    |

**Indexes:**

- `course_id`
- `tags`
- `type`

---

## 7. Notifications

**Table Name:** `notifications`

| Field      | Type         | Description                                | Required |
| ---------- | ------------ | ------------------------------------------ | -------- |
| id         | UUID         | Primary key                                | `yes`    |
| user_id    | UUID         | References `users.id`                      | `yes`    |
| title      | VARCHAR(255) | Notification title                         | `yes`    |
| message    | TEXT         | Notification content                       | `yes`    |
| type       | ENUM         | `info`, `alert`, `reminder`                | `yes`    |
| is_read    | BOOLEAN      | Whether the user has read the notification | `yes`    |
| created_at | TIMESTAMP    | Creation time                              | `yes`    |
| updated_at | TIMESTAMP    | Last update                                | `yes`    |

**Indexes:**

- `user_id`
- `is_read`
- `type`

---

## 8. Saved Courses

**Table Name:** `saved_courses`

| Field     | Type      | Description                    | Required |
| --------- | --------- | ------------------------------ | -------- |
| id        | UUID      | Primary key                    | `yes`    |
| user_id   | UUID      | References `users.id`          | `yes`    |
| course_id | UUID      | References `courses.id`        | `yes`    |
| saved_at  | TIMESTAMP | When the user saved the course | `yes`    |

**Indexes:**

- `user_id`
- `course_id`
- `(user_id, course_id)` (unique to prevent duplicate saves)

---

## 9. Relationships

- `departments.school_id` → `schools.id`
- `courses.department_id` → `departments.id`
- `course_offerings.course_id` → `courses.id`
- `course_offerings.department_id` → `departments.id`
- `contents.course_id` → `courses.id`
- `users.department_id` → `departments.id`
- `notifications.user_id` → `users.id`
- `saved_courses.user_id` → `users.id`
- `saved_courses.course_id` → `courses.id`

---

## 10. Notes

- All primary keys are **UUIDs** for scalability.
- Foreign keys enforce data integrity between tables.
- Indexed columns like `tags`, `code`, and `(user_id, course_id)` improve search and filtering performance.
- Optional fields are nullable to support flexibility in course metadata.
- Notifications track user events and actions.
- Saved courses allow users to bookmark courses for quick access.
