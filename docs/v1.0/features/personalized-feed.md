# Feature: Personalized Feed

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview / Problem Statement

- Students often struggle to find relevant courses for their specific year, semester, and department.
- The current system requires manual browsing, which is time-consuming and may lead to missed resources.
- This feature provides a curated feed of courses and content tailored to each student's academic profile, eliminating the need for manual searching.

---

## 2. Goals & Non-Goals

### Goals

- Deliver a list of relevant courses based on the student's department, year, and semester.
- Automatically update the feed when new courses are offered.
- Ensure the feed is relevant and up-to-date without manual intervention.

### Non-Goals

- The feed will not include content from outside the academic scope.
- It will not allow students to customize the feed beyond their basic academic information (department, year, and semester).

---

## 3. User Stories

- **As a student**, I want my relevant courses and content to be automatically curated and displayed on my feed as soon as I log in, so that I can immediately access what I need without manually searching.

- **As an admin**, I want all users to have access to a personalized feed of relevant courses automatically, so that they don't have to browse or search for their materials, ensuring a seamless and efficient experience.

---

## 4. Architecture

- **Frontend**: The frontend requests the personalized feed using the student's academic details (department, year, semester).

- **Backend**: The backend has an endpoint that queries the database for relevant courses and content based on the student's profile.

- **Database**: The database stores academic data and is indexed for quick retrieval of relevant content.

- **Data Flow**: When a student logs in, the frontend sends their academic details to the backend, which returns a list of relevant courses and content.

---

## 5. Testing & Metrics

### Testing

- Unit tests to validate the feed query logic.
- Integration tests to ensure the API returns the correct personalized courses.
- UI tests to confirm the feed displays correctly.

### Metrics / KPIs

- **Engagement**: Number of courses accessed per student.
- **API performance**: Average response time <200ms.
- **Relevance**: Percentage of courses accessed versus total courses in the feed.

---

## 6. Rollout Plan

- Deploy the feature behind a feature flag for a subset of students.
- Monitor performance and engagement metrics.
- Gradually enable the feature for all students once metrics meet expectations.
- Rollback if any issues arise.

---

## 7. Notes / References

- Related documentation: [Database Schema](../architecture/database-schema.md).
- Contents of each course are fetched separately via `/v1/contents` with the `course_id` parameter.
