Here is the revised **Technical Design Document (TDD)** for **Maneho.ai**, updated to fully remove Python (FastAPI), utilize **Node.js** for all scripting, and integrate **Google Vertex AI** via the latest SDKs.

---

# Technical Design Document: Maneho.ai

**Version:** 2.0
**Status:** Approved
**Date:** February 18, 2026
**Tech Stack:** Hytel Monorepo (Node.js/React/Firebase/Vertex AI)

---

## 1. Executive Summary

**Maneho.ai** is a free, public utility web application designed to assist Filipino motorists with LTO processes, traffic laws, and driver education.

**Key Technical Decisions:**

- **Architecture:** Client-Heavy Single Page Application (SPA).
- **Frontend:** React, TypeScript, Tailwind, Shadcn UI (via Hytel Boilerplate).
- **Backend:** Serverless (Firebase Auth + Firestore). _No custom backend server (FastAPI removed)._
- **Data Pipeline:** **Node.js/TypeScript scripts** for PDF ingestion (Python removed).
- **AI Engine:** **Google Vertex AI** (Gemini 1.5 Flash) via the Google GenAI SDK.
- **Vector Search:** **Pinecone** (Serverless).

---

## 2. System Architecture

The system utilizes the **Hytel Monorepo** structure. All "backend" logic for data ingestion is handled by local Node.js scripts, while the app logic lives in the React client.

### High-Level Diagram

### Monorepo Usage

- **`apps/web`**: The core React application.
- **`packages/ui`**: Shared UI components.
- **`scripts/ingest`**: **Node.js** scripts for parsing PDFs and populating Pinecone (replaces Python scripts).
- **`apps/functions`**: _Deprecated/Unused_ in favor of client-side logic + Firestore Rules.

---

## 3. Data Architecture (Firestore)

We utilize **Cloud Firestore** (NoSQL).

### 3.1 Collections & Schema

#### **`users` Collection**

Stores user profiles and quota tracking.

- **Doc ID:** `uid` (from Firebase Auth)
- **Fields:**
- `email` (string)
- `displayName` (string)
- `daily_queries` (number) - _Critical for abuse prevention_
- `last_query_date` (timestamp)
- `agreed_to_terms` (boolean)
- `licenseType` (string: 'student' | 'non-prof' | 'prof')
- `gamification` (map): `{ xp: number, streak: number }`

#### **`users/{userId}/exam_attempts` Subcollection**

Stores mock exam history.

- **Doc ID:** `auto-generated`
- **Fields:**
- `score` (number)
- `timestamp` (timestamp)
- `mistakes` (array of question IDs)

### 3.2 Security Rules (firestore.rules)

**CRITICAL:** Logic previously in Python backend is now enforced here.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Abuse Prevention: Rate Limiting
    function isWithinLimit() {
      let userDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      // Allow if date changed OR count < 20
      return userDoc.data.last_query_date != request.time.date() || userDoc.data.daily_queries < 20;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Only allow logging chat history if within limit
    match /users/{userId}/chat_logs/{logId} {
      allow create: if request.auth.uid == userId && isWithinLimit();
    }
  }
}

```

---

## 4. AI & RAG Strategy (Vertex AI Integration)

We will use the **official Google Generative AI SDK** for Node.js/Web.

### 4.1 The AI Stack

- **SDK:** `@google/generative-ai` (Latest version: `^0.1.0` or higher).
- **Model:** `gemini-1.5-flash` (Optimized for speed/cost).
- **Embeddings:** `text-embedding-004`.
- **Vector DB:** **Pinecone** (Serverless).

### 4.2 Integration Steps

#### **Installation**

```bash
tool_code
```
