# Feature: GPA Calculator

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview / Problem Statement

- Students often struggle to calculate their GPA manually by collecting marks out of 100% and factoring in each course’s credit points.
- Manual calculation is time-consuming, error-prone, and inefficient.
- The GPA Calculator provides a modern, intuitive interface where students can search for courses, select them, input their marks, and instantly see their GPA.
- Credit points are automatically fetched from the backend, eliminating manual data entry and ensuring accurate calculations.

---

## 2. Goals & Non-Goals

### Goals

- Allow students to search for and select multiple courses for GPA calculation.
- Provide input fields for each selected course to enter marks from 100%.
- Automatically fetch credit points from the backend.
- Perform real-time GPA calculation entirely on the frontend.
- Offer real-time grade evaluation (e.g., 90–100 → A+, 85–89 → A) while entering marks.
- Deliver a clean, user-friendly interface for efficient calculation.

### Non-Goals

- Does not store grades or GPA in the database.
- Does not fetch grades from external systems.
- Does not generate historical GPA reports.

---

## 3. User Stories

- **As a student**, I want to search for my courses, select them, enter my marks, and calculate GPA instantly, so I can track my academic performance efficiently.
- **As a student**, I want real-time grade evaluation while entering marks, so I can immediately see the corresponding letter grade.
- **As an admin**, I want the GPA Calculator to be reliable and accurate, ensuring students can depend on it without support.

---

## 4. Architecture

- **Frontend**:

  - Provides a search interface to find and select courses.
  - Displays selected courses with input fields for marks.
  - Shows credit points automatically fetched from the backend.
  - Performs real-time GPA calculation and grade evaluation as marks are entered.
  - Presents results in a clean, responsive UI.

- **Backend**:

  - Exposes course details including credit points.
  - Does not perform any GPA calculations.

- **Database**:

  - Courses table stores credit points.
  - No student grades or GPA data is stored.

- **Data Flow**:
  1. Student searches and selects courses.
  2. Frontend fetches credit points for selected courses from backend.
  3. Student enters marks (0–100%) for each course.
  4. Frontend calculates GPA and shows real-time grade evaluation.
  5. Final GPA is displayed instantly.

---

## 5. Testing & Metrics

### Testing

- Unit tests for GPA calculation and grade evaluation logic.
- Integration tests for frontend course selection, data fetching, and GPA computation.
- UI tests for responsiveness and real-time feedback while entering marks.
- Edge case tests (e.g., invalid marks, zero credit courses, empty selections).

### Metrics / KPIs

- **Accuracy**: Matches manual calculation.
- **Response time**: Real-time evaluation <50ms per input.
- **Adoption**: Number of students using the GPA Calculator.
- **Engagement**: Average number of courses selected per calculation.

---

## 6. Rollout Plan

- Launch beta version with core course search and calculation features.
- Collect student feedback on usability and real-time grade evaluation.
- Refine UI/UX and deploy to all students once the experience is polished.

---

## 7. Notes / References

- Related documentation: [Database Schema](../architecture/database-schema.md).
- Privacy-first design ensures no sensitive student data is stored.
