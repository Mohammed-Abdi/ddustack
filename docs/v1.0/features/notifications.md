# Feature: Notifications

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview / Problem Statement

- Students may miss important updates about courses, new content uploads, or academic announcements if notifications are not centralized.
- Currently, students need to manually check courses or announcements, which is inefficient and can lead to missed deadlines or materials.
- The Notifications feature provides **real-time alerts** both **in-app** and as **browser push notifications**, ensuring students are notified even when they are not actively browsing the platform.
- Notifications are **targeted**: when new courses or content are added, only students enrolled in the relevant course (identified via department, year, and semester) receive the notification, preventing spam to unrelated users.

---

## 2. Goals & Non-Goals

### Goals

- Notify students about new content added to their courses **only if they are enrolled in the relevant course offering**.
- Alert students about system announcements, deadlines, or academic updates.
- Provide a centralized notifications interface in the frontend.
- Support **real-time updates via WebSocket** or **browser push notifications**.
- Allow students to mark notifications as read or unread.

### Non-Goals

- Notifications do not include personalized recommendations outside academic relevance.
- Does not replace email or official university communications.
- Does not store historical notifications beyond a retention period (e.g., 90 days).
- Does not send unnecessary notifications to users unrelated to a course or content.

---

## 3. User Stories

- **As a student**, I want to receive notifications in the browser when new content is added to my courses, so I don’t miss important materials.
- **As a student**, I want to view all recent notifications in a centralized interface, so I can quickly check updates without browsing each course.
- **As an admin**, I want to ensure notifications are **targeted** only to relevant students for new courses or content, so users are not spammed with unnecessary notifications.

---

## 4. Architecture

- **Frontend**:

  - Displays a notifications panel or dropdown with unread and read notifications.
  - Supports browser push notifications via service workers for real-time alerts.
  - Updates notifications in-app via WebSocket or polling.
  - Allows marking notifications as read/unread.

- **Backend**:
  - Determines which students are relevant for a notification based on **course offering (department + year + semester)**.
  - Generates and pushes notifications to targeted users via WebSocket and browser push.
  - Ensures delivery reliability and proper handling of read/unread status.

---

## 5. Testing & Metrics

### Testing

- Unit tests for notification creation, fetching, and read/unread toggling.
- Integration tests for **real-time WebSocket updates**, **browser push notifications**, and **targeted delivery based on course offerings**.
- UI tests to confirm correct display and user interaction with notifications.
- Edge case tests for bulk notifications and empty notification lists.

### Metrics / KPIs

- **Delivery success rate**: Percentage of notifications delivered to targeted students.
- **Engagement**: Click-through rate or interaction with notifications.
- **Latency**: Time from notification creation to student view.
- **Relevance**: Percentage of notifications delivered to students who are actually enrolled in the relevant course.

---

## 6. Rollout Plan

- Launch notifications with in-app and browser push for a beta group of students.
- Prompt students to enable browser notifications for a smooth experience.
- Monitor delivery reliability, engagement, relevance, and latency metrics.
- Gradually enable notifications for all students and system-wide announcements.
- Collect feedback to refine notification targeting, types, and push settings.

---

## 7. Notes / References

- Related documentation: [Database Schema](../architecture/database-schema.md).
- Notifications complement the Personalized Feed by actively alerting students to new content, in-app and via browser push, **targeted to relevant users only**.
