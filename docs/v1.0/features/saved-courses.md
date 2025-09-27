# Feature: Saved Courses

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview / Problem Statement

- While the Personalized Feed, Search, and Categorization features help students discover and access content, students may want a quick way to save and revisit specific courses they consider important.
- Without a saved list, students have to repeatedly search or navigate through categories, which is inefficient.
- The Saved Courses feature provides a **personalized list of saved courses**, allowing students to quickly return to courses they frequently need without additional searching.

---

## 2. Goals & Non-Goals

### Goals

- Allow students to **save courses** for quick access.
- Provide a dedicated **Saved Courses section** in the UI.
- Ensure saved courses are **persistent across devices** by storing them in the backend.
- Allow students to **remove courses** at any time.
- **Prevent duplicate saves** so the same course cannot be saved multiple times by the same student.

### Non-Goals

- Does not provide automatic course suggestions (covered by Personalized Feed).
- Does not replace Search, Categorization, or Feed.
- Does not store saved course content offline.

---

## 3. User Stories

- **As a student**, I want to save specific courses so that I can quickly access them later without searching again.
- **As a student**, I want my saved courses to be synced across devices so I can access them whether I log in on mobile or desktop.
- **As an admin**, I want students to have a convenient way to revisit frequently accessed courses, improving usability and engagement.

---

## 4. Architecture

- **Frontend**:

  - Provides a **Save button** for each course.
  - Displays a **Saved Courses section** listing all saved courses.
  - Provides a **Remove button** to delete saved courses.

- **Backend**:
  - Stores the relationship between users and saved courses.
  - Ensures saved courses are retrievable and synced across sessions/devices.
  - **Prevents duplicate saves** when the same course is saved again by the same student.

---

## 5. Testing & Metrics

### Testing

- Unit tests for saving and removing courses.
- Integration tests to confirm saved courses persist across devices.
- UI tests to ensure intuitive Save and Remove interactions.
- Edge case testing (e.g., saving the same course twice to confirm duplicate prevention).

### Metrics / KPIs

- **Usage**: Number of students saving courses.
- **Engagement**: Average number of saved courses per student.
- **Retention**: Frequency of return visits via saved courses.

---

## 6. Rollout Plan

- Release the feature to a pilot group of students.
- Collect feedback on usability and placement of the Save and Remove buttons.
- Monitor usage and engagement to assess value.
- Roll out to all users once the feature is stable and useful.

---

## 7. Notes / References

- Related documentation: [Database Schema](../architecture/database-schema.md).
- Saved Courses complements Personalized Feed, Search, and Categorization by giving students **direct control over courses they want quick access to**.
- **Duplicate prevention** ensures the same course cannot appear multiple times in a student's saved list.
