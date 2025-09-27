# Feature: Text Summarizer

**App Version:** v1.0  
**Author:** Mohammed Abdi  
**Date:** 2025-09-27  
**Status:** Draft

---

## 1. Overview / Problem Statement

- Students often face long lecture notes or course materials that are time-consuming to read.
- Manually summarizing text can be inefficient and may miss key points.
- The Text Summarizer uses OpenAI LLM with a carefully crafted lecture summary prompt to generate concise, accurate, and context-aware summaries from lecture texts or uploaded course materials, improving study efficiency and saving time.

---

## 2. Goals & Non-Goals

### Goals

- Enable students to input or upload lecture texts for summarization.
- Generate high-quality, concise summaries using OpenAI LLM with an optimized prompt.
- Provide a clean, user-friendly interface for reading and copying summaries.
- Ensure fast processing with near real-time results.

### Non-Goals

- Does not store uploaded lecture materials or generated summaries permanently.
- Does not provide translations or content beyond the submitted text.
- Does not automatically summarize entire courses without user input.

---

## 3. User Stories

- **As a student**, I want to summarize long lecture texts into concise points using AI with a structured prompt, so I can review key concepts quickly.
- **As a student**, I want to upload documents for summarization, so I can save time while studying.
- **As an admin**, I want the summarizer to perform reliably and generate accurate summaries using a custom prompt, ensuring students can depend on it.

---

## 4. Architecture

- **Frontend**:

  - Allows students to input text or upload documents.
  - Displays summarized content in a clear, readable format.
  - Provides options to copy or download the summary.

- **Backend**:

  - Accepts text or document content.
  - Sends content to OpenAI LLM API using the **custom Lecture Summary Prompt**.
  - Returns summarized text to the frontend.

- **Database**:

  - No permanent storage of user text or summaries; all processing is transient.

- **Data Flow**:
  1. Student inputs text or uploads a document.
  2. Frontend sends content to backend summarizer API.
  3. Backend calls OpenAI LLM with the **Lecture Summary Prompt** to generate a summary.
  4. Backend returns summarized text.
  5. Frontend displays summary to the student.

---

## 5. Testing & Metrics

### Testing

- Unit tests for summarization request handling and response formatting.
- Integration tests for frontend input, backend API, and OpenAI API interaction with custom prompts.
- UI tests for summary display, copying, and downloading functionality.
- Edge case tests for extremely long texts, empty inputs, or unsupported formats.

### Metrics / KPIs

- **Accuracy**: Summaries retain essential information.
- **Summary quality**: Evaluated using user feedback and comparison against manual summaries.
- **Response time**: Average summarization <2 seconds for standard-length lecture texts.
- **Usage**: Number of texts/documents summarized per student.

---

## 6. Rollout Plan

- Launch beta version with OpenAI LLM-powered text input summarization using the **Lecture Summary Prompt**.
- Collect feedback on summary quality, speed, and UI experience.
- Refine prompt wording or parameters based on usage feedback.
- Deploy to all students once performance and reliability targets are met.

---

## 7. Notes / References

- Related documentation: [Database Schema](../architecture/database-schema.md).
- All summarization is processed on the backend; no user text is permanently stored.

- **Lecture Summary Prompt:**

```text
You are an expert educator and summarizer. Read the following lecture text carefully. Provide a clear, concise summary that captures:

1. Main topics and subtopics
2. Key points, concepts, and definitions
3. Any examples or important data mentioned
4. Actionable insights or takeaways (if applicable)

Instructions:

- Format the summary in organized bullet points or numbered lists.
- Keep it accurate, coherent, and self-contained, without adding unrelated information.
- Optional: specify style or length, e.g., “Use simple language suitable for beginners” or “Keep the summary under 200 words.”

Lecture text:
[Insert your lecture text here]
```
