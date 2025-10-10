# Database Schema

This document describes the database schema for DduStack, fully aligned with Django models.

---

# Table of Contents

1. [Users](#1-users)
2. [Schools](#2-schools)
3. [Departments](#3-departments)
4. [Courses](#4-courses)
5. [Course Offerings](#5-course-offerings)
6. [Contents](#6-contents)
7. [Notifications](#7-notifications)
8. [Saved Courses](#8-saved-courses)
9. [Intake](#9-intake)
10. [Course Assignments](#10-course-assignments)
11. [Relationships](#11-relationships)
12. [Notes](#12-notes)

---

## 1. Users

**Table Name:** `users`

| Field         | Type         | Description                                 | Required |
| ------------- | ------------ | ------------------------------------------- | -------- |
| id            | UUID         | Primary key                                 | yes      |
| username      | VARCHAR(150) | Optional username, unique                   | no       |
| first_name    | VARCHAR(255) | User's first name                           | yes      |
| last_name     | VARCHAR(255) | User's last name                            | yes      |
| email         | VARCHAR(255) | User's email, unique                        | yes      |
| avatar        | URL          | Optional avatar URL                         | no       |
| metadata      | JSONB        | Optional user metadata                      | no       |
| provider      | VARCHAR(255) | OAuth provider name                         | no       |
| provider_id   | VARCHAR(255) | OAuth provider user ID                      | no       |
| role          | ENUM         | `STUDENT`, `LECTURER`, `MODERATOR`, `ADMIN` | yes      |
| is_active     | BOOLEAN      | Account active status                       | yes      |
| is_staff      | BOOLEAN      | Staff privileges                            | yes      |
| is_verified   | BOOLEAN      | Email/account verified                      | yes      |
| department_id | UUID         | References `departments.id`                 | no       |
| year          | INTEGER      | Academic year                               | no       |
| semester      | INTEGER      | Academic semester                           | no       |
| student_id    | VARCHAR(30)  | Optional student ID                         | no       |
| staff_id      | VARCHAR(30)  | Optional staff ID                           | no       |
| date_joined   | TIMESTAMP    | User creation date                          | yes      |
| updated_at    | TIMESTAMP    | Last update timestamp                       | yes      |

**Indexes:**

- `email` (unique)
- `username` (unique)
- `student_id`
- `staff_id`
- `role`
- `department_id`

---

## 2. Schools

**Table Name:** `schools`

| Field      | Type         | Description         | Required |
| ---------- | ------------ | ------------------- | -------- |
| id         | UUID         | Primary key         | yes      |
| name       | VARCHAR(255) | School name, unique | yes      |
| created_at | TIMESTAMP    | Creation time       | yes      |
| updated_at | TIMESTAMP    | Last update         | yes      |

**Indexes:**

- `name` (unique)

---

## 3. Departments

**Table Name:** `departments`

| Field      | Type         | Description             | Required |
| ---------- | ------------ | ----------------------- | -------- |
| id         | UUID         | Primary key             | yes      |
| name       | VARCHAR(255) | Department name         | yes      |
| code       | VARCHAR(10)  | Department code         | yes      |
| school_id  | UUID         | References `schools.id` | yes      |
| year       | INTEGER      | Number of years         | no       |
| created_at | TIMESTAMP    | Creation time           | yes      |
| updated_at | TIMESTAMP    | Last update             | yes      |

**Indexes:**

- `school_id`
- `name`

---

## 4. Courses

**Table Name:** `courses`

| Field          | Type         | Description                                      | Required |
| -------------- | ------------ | ------------------------------------------------ | -------- |
| id             | UUID         | Primary key                                      | yes      |
| code           | VARCHAR(10)  | Course code, unique                              | yes      |
| name           | VARCHAR(255) | Course name                                      | yes      |
| abbreviation   | VARCHAR(5)   | Course abbreviation                              | yes      |
| description    | TEXT         | Course description                               | no       |
| status         | ENUM         | `COMPULSORY`, `SUPPORTIVE`, `COMMON`, `ELECTIVE` | yes      |
| credit_points  | INTEGER      | Credit points                                    | no       |
| lecture_hours  | INTEGER      | Lecture hours                                    | no       |
| lab_hours      | INTEGER      | Lab hours                                        | no       |
| tutorial_hours | INTEGER      | Tutorial hours                                   | no       |
| homework_hours | INTEGER      | Homework hours                                   | no       |
| credit_hours   | INTEGER      | Total credit hours                               | no       |
| tags           | JSONB        | List of tags                                     | no       |
| created_at     | TIMESTAMP    | Creation time                                    | yes      |
| updated_at     | TIMESTAMP    | Last update                                      | yes      |

**Indexes:**

- `code` (unique)
- `abbreviation`
- `tags` (GIN index)

---

## 5. Course Offerings

**Table Name:** `course_offerings`

| Field         | Type      | Description                 | Required |
| ------------- | --------- | --------------------------- | -------- |
| id            | UUID      | Primary key                 | yes      |
| course_id     | UUID      | References `courses.id`     | yes      |
| department_id | UUID      | References `departments.id` | yes      |
| year          | INTEGER   | Academic year               | yes      |
| semester      | INTEGER   | Academic semester           | yes      |
| created_at    | TIMESTAMP | Creation time               | yes      |
| updated_at    | TIMESTAMP | Last update                 | yes      |

**Indexes:**

- `course_id`
- `department_id`
- `(year, semester)`

---

## 6. Contents

**Table Name:** `contents`

| Field      | Type         | Description                                | Required |
| ---------- | ------------ | ------------------------------------------ | -------- |
| id         | UUID         | Primary key                                | yes      |
| course_id  | UUID         | References `courses.id`                    | yes      |
| title      | VARCHAR(255) | Content title                              | yes      |
| type       | ENUM         | `LECTURE`, `ASSIGNMENT`, `LAB`, `TUTORIAL` | yes      |
| path       | VARCHAR(255) | File path/location                         | yes      |
| chapter    | VARCHAR(255) | Chapter name                               | no       |
| file       | JSONB        | File metadata                              | yes      |
| tags       | JSONB        | List of tags                               | no       |
| created_at | TIMESTAMP    | Creation time                              | yes      |
| updated_at | TIMESTAMP    | Last update                                | yes      |

**Indexes:**

- `course_id`
- `type`
- `tags`

---

## 7. Notifications

**Table Name:** `notifications`

| Field      | Type         | Description                            | Required |
| ---------- | ------------ | -------------------------------------- | -------- |
| id         | UUID         | Primary key                            | yes      |
| user_id    | UUID         | References `users.id`                  | yes      |
| title      | VARCHAR(255) | Notification title                     | yes      |
| message    | TEXT         | Notification content                   | yes      |
| type       | ENUM         | `INFO`, `ALERT`, `REMINDER`            | yes      |
| is_read    | BOOLEAN      | Whether user has read the notification | yes      |
| created_at | TIMESTAMP    | Creation time                          | yes      |
| updated_at | TIMESTAMP    | Last update                            | yes      |

**Indexes:**

- `user_id`
- `is_read`
- `type`

---

## 8. Saved Courses

**Table Name:** `saved_courses`

| Field     | Type      | Description                    | Required |
| --------- | --------- | ------------------------------ | -------- |
| id        | UUID      | Primary key                    | yes      |
| user_id   | UUID      | References `users.id`          | yes      |
| course_id | UUID      | References `courses.id`        | yes      |
| saved_at  | TIMESTAMP | When the user saved the course | yes      |

**Indexes:**

- `user_id`
- `course_id`
- `(user_id, course_id)` (unique)

---

## 9. Intake

**Table Name:** `intake`

| Field         | Type         | Description                                                                                                           | Required |
| ------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- | -------- |
| id            | UUID         | Primary key                                                                                                           | yes      |
| user_id       | UUID         | References `users.id`                                                                                                 | yes      |
| type          | ENUM         | `ACCESS`, `ROLE_CHANGE`, `DATA_UPDATE`, `COURSE_ASSIGNMENT`, `COMPLAIN`, `FEEDBACK`, `LEAVE`, `GRADE_REVIEW`, `OTHER` | yes      |
| status        | ENUM         | `PENDING`, `REJECTED`, `APPROVED`                                                                                     | yes      |
| full_name     | VARCHAR(150) | Full name                                                                                                             | no       |
| phone_number  | VARCHAR(20)  | Phone number                                                                                                          | no       |
| staff_id      | VARCHAR(50)  | Staff ID                                                                                                              | no       |
| student_id    | VARCHAR(50)  | Student ID                                                                                                            | no       |
| department_id | UUID         | References `departments.id`                                                                                           | no       |
| description   | TEXT         | Additional notes                                                                                                      | no       |
| created_at    | TIMESTAMP    | Creation time                                                                                                         | yes      |
| updated_at    | TIMESTAMP    | Last update                                                                                                           | yes      |

**Indexes:**

- `type`
- `status`

---

## 10. Course Assignments

**Table Name:** `course_assignments`

| Field      | Type      | Description             | Required |
| ---------- | --------- | ----------------------- | -------- |
| id         | UUID      | Primary key             | yes      |
| user_id    | UUID      | References `users.id`   | yes      |
| course_id  | UUID      | References `courses.id` | yes      |
| created_at | TIMESTAMP | Creation time           | yes      |
| updated_at | TIMESTAMP | Last update             | yes      |

**Indexes:**

- `user_id`
- `course_id`

---

## 11. Relationships

- `users.department_id` → `departments.id`
- `departments.school_id` → `schools.id`
- `courses.department_id` → `departments.id`
- `course_offerings.course_id` → `courses.id`
- `course_offerings.department_id` → `departments.id`
- `contents.course_id` → `courses.id`
- `notifications.user_id` → `users.id`
- `saved_courses.user_id` → `users.id`
- `saved_courses.course_id` → `courses.id`
- `intake.user_id` → `users.id`
- `course_assignments.user_id` → `users.id`
- `course_assignments.course_id` → `courses.id`

---

## 12. Notes

- All primary keys are **UUIDs**.
- Foreign keys enforce data integrity.
- Indexed columns improve search/filter performance.
- Optional fields are nullable for flexibility.
- `tags` fields use GIN index for JSONB search.
- `saved_courses` enforces uniqueness per `(user_id, course_id)`.
- `intake` prioritizes PENDING → REJECTED → APPROVED ordering.
