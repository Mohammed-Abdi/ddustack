# Contributing to DDUSTACK

Thank you for your interest in contributing to **DDUSTACK**! We welcome contributions that improve the platform, fix bugs, or enhance documentation. This guide outlines the standard workflow, coding conventions, and best practices.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Reporting Issues](#reporting-issues)
3. [Feature Requests](#feature-requests)
4. [Branching & Workflow](#branching--workflow)
5. [Pull Request Guidelines](#pull-request-guidelines)
6. [Commit Message Standards](#commit-message-standards)
7. [Code Style](#code-style)
8. [Testing](#testing)
9. [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. **Fork the repository** and clone it locally:

   ```bash
   git clone https://github.com/Mohammed-Abdi/ddustack.git
   cd ddustack
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Implement your changes** following the guidelines below.
4. **Run tests** and ensure all checks pass.
5. **Push your branch** and open a Pull Request (PR)

## Reporting Issues

- Use the **Issues** tab for reporting bugs, errors, or unexpected behavior.
- Provide clear and concise information, including:

  - Steps to reproduce the issue
  - Expected vs. actual behavior
  - Environment details (OS, browser, backend version)
  - Screenshots, logs, or error messages if applicable

- Label your issue appropriately (e.g., `bug`, `question`) to help maintainers triage.

---

## Feature Requests

- Open a new issue labeled `enhancement`.
- Include the following:

  - Problem statement or user pain point
  - Proposed solution or new feature description
  - Example scenarios or workflows demonstrating the feature

- Keep the request focused and specific; broad requests may be discussed before implementation.

---

## Branching & Workflow

We follow a **GitHub Flow** approach:

- **Main branch**: Production-ready, stable code
- **Feature branches**: Named `feature/<feature-name>` for new features
- **Hotfix branches**: Named `hotfix/<issue>` for urgent fixes
- **Release branches**: For staging or pre-release testing

- **Merging**: Pull requests must be reviewed and approved before merging. Squash commits when merging to maintain a clean history.

---

## Pull Request Guidelines

- Reference the related issue in your PR description.
- Include:

  - Summary of changes
  - Screenshots or gifs for UI changes
  - Setup instructions or migrations if required

- Keep one logical change per PR. Avoid combining unrelated updates.
- Ensure all tests pass and code passes linting checks.

---

## Commit Message Standards

We follow **Conventional Commits**:

```text
<type>(<scope>): <short summary>

- Optional detailed description
- Explain reasoning, UX impact, or performance improvements

```

**Common types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Formatting, whitespace, or style fixes
- `refactor`: Code refactoring without adding features or fixing bugs
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks or build updates

---

## Code Style

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Django + Django REST Framework

**Guidelines:**

- 2-space indentation
- Single quotes for strings
- Descriptive variable and function names
- Modular, maintainable, and readable code
- Comment complex logic where necessary
- Follow DRY (Don't Repeat Yourself) and KISS (Keep It Simple) principles

---

## Testing

- Write unit tests for all new functionality.
- Integration tests for API, database, and frontend interactions.
- UI and functional tests for frontend components.
- Edge case testing and regression coverage are expected.

- Run tests before submitting a PR:

  ```bash
  # Backend tests
  python manage.py test

  # Frontend tests
  npm run test
  ```

## Code of Conduct

All contributors must adhere to the [Code of Conduct](./CODE_OF_CONDUCT.md).  
We aim to maintain a welcoming, inclusive, and respectful community for all participants.  
Harassment, discrimination, or abusive behavior will not be tolerated.

---

## Thank You!

By contributing to **DDUSTACK**, you help improve the platform for students worldwide.  
Your contributions, whether in code, documentation, testing, or feedback, are valued and appreciated.
