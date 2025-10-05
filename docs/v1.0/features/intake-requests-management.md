# Feature: Intake Requests Management

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-10-05  
**Status:** Draft

---

## 1. Overview / Problem Statement

- Staff, lecturers, and students need a centralized way to submit various types of requests, such as access, role changes, data updates, course assignments, complaints, feedback, leave, or grade reviews.
- Currently, requests are often handled via email or informal channels, which is inefficient and prone to errors or delays.
- The Intake Requests Management feature provides a **centralized system** for submitting, tracking, and processing all requests.
- Requests are **typed and prioritized**: pending requests are highlighted, and approval or rejection flows are streamlined for admins and moderators.

---

## 2. Goals & Non-Goals

### Goals

- Allow users to submit different types of requests, each with **specific required fields** depending on request type.
- Enable admins, moderators, and lecturers to **review, approve, or reject** requests efficiently.
- Provide a **centralized interface** for tracking the status of all requests.
- Support filtering and searching by request type, status, staff ID, student ID, or full name.

### Non-Goals

- The feature does not handle payments, scheduling, or academic content management.
- It does not send notifications automatically (handled by a separate system).
- It does not replace email communications entirely, only centralizes requests.

---

## 3. User Stories

- **As a staff member**, I want to submit access or role change requests with required details, so my request is tracked and approved correctly.
- **As a student**, I want to submit grade review requests with student ID and department info, so my case can be handled efficiently.
- **As an admin or moderator**, I want to review, approve, or reject requests by type and status, so I can manage workflow effectively.
- **As a lecturer**, I want to handle course assignment or leave requests submitted by staff, so approvals are streamlined.

---

## 4. Architecture

- **Frontend**:

  - Displays a form for submitting requests with fields dynamically shown based on request type.
  - Shows request lists with **filters for type and status** and **search by staff_id, student_id, or full_name**.
  - Allows authorized users to update, approve, or reject requests according to their roles.

- **Backend**:

  - Stores requests in the `intake` table with **UUID primary keys**, type, status, timestamps, and dynamic fields (staff_id, student_id, department_id, etc.).
  - Validates required fields based on request type.
  - Implements role-based access control:

    - **POST**: `ALL USERS`
    - **PATCH/PUT**: `ADMIN`, `MODERATOR`, `LECTURER`
    - **DELETE**: `ADMIN`, `MODERATOR`
    - **GET**: `ADMIN`, `MODERATOR`, `LECTURER`

  - Supports **filtering by type and status** and **case-insensitive search** on staff_id, student_id, and full_name.

---

## 5. Testing & Metrics

### Testing

- Unit tests for request creation and validation of type-specific required fields.
- Integration tests for role-based permissions, filtering, and search functionality.
- Edge case tests for bulk requests and missing fields.
- UI tests to confirm correct dynamic form behavior for each request type.

### Metrics / KPIs

- **Submission success rate**: Percentage of valid requests successfully stored.
- **Processing time**: Time between request submission and final approval/rejection.
- **Role compliance**: Requests handled according to role-based permissions.
- **Search and filter efficiency**: Accuracy of results when filtering or searching.

---

## 6. Rollout Plan

- Deploy Intake Requests Management feature for staff and lecturers first.
- Enable students to submit grade review and feedback requests afterward.
- Monitor system performance, submission success, and user adoption.
- Gradually optimize form validation and role-based approval workflows.
- Collect feedback to refine field requirements and request types.

---

## 7. Notes / References

- Related documentation: [Database Schema](../architecture/database-schema.md/#9-intake).
- Centralized request management complements other administrative features, ensuring requests are **tracked, filtered, and resolved efficiently**.
- Filtering by `type` and `status` and searching by `staff_id`, `student_id`, or `full_name` supports efficient workflow management.
