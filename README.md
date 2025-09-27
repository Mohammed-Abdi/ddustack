<p align="center">
  <br><br>
  <img src="./docs/assets/logo.svg" alt="DDU Stack Logo" width="400"/>
</p>

<p align="center">
  Empowering Students with Personalized Academic Tools
</p>

<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Mohammed-Abdi/ddustack/releases/tag/v1.0">
    <img src="https://img.shields.io/badge/release-v1.0-blue" alt="Latest Release">
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Mohammed-Abdi/ddustack/stargazers">
    <img src="https://img.shields.io/github/stars/Mohammed-Abdi/ddustack" alt="Stars">
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Mohammed-Abdi/ddustack/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Mohammed-Abdi/ddustack" alt="Contributors">
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Mohammed-Abdi/ddustack/issues">
    <img src="https://img.shields.io/github/issues/Mohammed-Abdi/ddustack" alt="Issues">
  </a>
</p>

---

## Overview

**DDUSTACK** is a modern academic utility platform for university students. It simplifies the academic journey by providing:

- **Personalized feeds** with relevant courses and content.
- **Search and categorization** to discover academic materials efficiently.
- **GPA calculation** without storing sensitive data.
- **Text summarization** for fast study reviews.
- **Saved courses** for quick access.
- **Real-time notifications** for updates and announcements.

---

## Core Features

1. **Personalized Feed:** Curates courses and content based on department, year, and semester.
2. **Search Functionality:** Keyword search using course code and tags, with optional filtering by department.
3. **Categorization:** Browse content via School → Department → Year → Semester hierarchy.
4. **GPA Calculator:** Instant GPA computation with real-time grade evaluation.
5. **Text Summarizer:** AI-generated lecture summaries using OpenAI LLM.
6. **Saved Courses:** Save and revisit important courses across devices.
7. **Notifications:** Push notifications targeted by department, year, semester, or global updates.

---

## Architecture

- **Frontend:** React + TypeScript with Vite.
- **Backend:** Django REST Framework with JWT authentication.
- **Database:** PostgreSQL with optimized indexing for courses, contents, and user profiles.
- **Communication:** RESTful APIs connecting frontend and backend.
- **AI Integration:** OpenAI LLM for lecture summarization.

---

## Tech Stack

| Layer           | Technology                                                                          |
| --------------- | ----------------------------------------------------------------------------------- |
| Frontend        | React, TypeScript, Tailwind CSS, Redux Toolkit + RTK Query, React Router, Shadcn UI |
| Backend         | Django, Django REST Framework (DRF), Simple JWT                                     |
| Database        | PostgreSQL                                                                          |
| Search          | PostgreSQL Full-Text Search / Django Filters                                        |
| AI Integration  | OpenAI LLM for text summarization                                                   |
| Testing         | Django’s built-in TestCase, Jest (frontend), Postman (API)                          |
| Version Control | Git & GitHub                                                                        |
| Deployment      | Docker                                                                              |

---

## Installation

#### Clone Repository

```bash
git clone https://github.com/Mohammed-Abdi/DDUSTACK.git
cd DDUSTACK
```

#### Setup Guides

- [Backend setup ↗](./backend/README.md)
- [Frontend setup ↗](./frontend/README.md)

---

### Documentation

All project documentation and API references are located in the `docs` folder:

- [Project Overview ↗](./docs/README.md)
- [Database Schema ↗](./docs/v1.0/architecture/database-schema.md)
- [Feature Documentation ↗](./docs/v1.0/features/)
- [API Documentation ↗](./docs/v1.0/api/)
- [Changelog ↗](./docs/CHANGELOG.md)

---

### Usage

1. Launch the backend server following the [backend setup](./backend/README.md).
2. Launch the frontend server following the [frontend setup](./frontend/README.md).
3. Log in as a student or admin.
4. Access all features: personalized feed, search, categorization, GPA calculator, text summarizer, saved courses, and notifications.

---

### Contribution

Contributions are welcome! Please refer to [CONTRIBUTING ↗](./CONTRIBUTING.md) for guidelines.

---

### License

This project is licensed under the MIT License. See [LICENSE ↗](./LICENSE) for details.

### Contact

For questions, feedback, or issues:

Email: [ddustack@gmail.com](mailto:ddustack@gmail.com)

GitHub Issues: https://github.com/Mohammed-Abdi/ddustack/issues
