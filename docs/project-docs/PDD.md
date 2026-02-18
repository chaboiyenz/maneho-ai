Here is the revised **Product Design Document (PDD)** for **Maneho.ai**.

I have stripped out all "Freemium/SaaS" elements. The product is now defined as a **Free Public Utility** focused on civic education and driver assistance. The "Monetization" section has been replaced with **"Sustainability & Abuse Prevention"** to reflect the need to manage API costs while keeping the app free.

---

# Product Design Document (PDD): Maneho.ai

**Version:** 3.0
**Status:** Approved
**Model:** Free Public Utility (Civic Tech)
**Tech Stack:** Hytel Monorepo (React/Node.js/Firebase)

---

## 1. Application Overview

**Maneho.ai** is a free, AI-powered companion for Filipino motorists. It simplifies the complex rules of the Land Transportation Office (LTO), traffic laws, and insurance policies into bite-sized, actionable advice.

- **Core Value:** Eliminates the need to read confusing PDFs, rely on "hearsay" from social media, or hire illegal fixers to understand LTO processes.
- **Target Audience:** Student drivers, license renewers, PUV drivers, and private car owners in the Philippines.
- **Mission:** To create a more educated, law-abiding driving community by making legal information accessible to everyone for free.

---

## 2. Sustainability & Abuse Prevention

_Replacing "Monetization," this section defines how the app remains viable without charging users._

Since the app relies on paid API services (Google Gemini & Pinecone), we implement strict **Quota Management** instead of a paywall.

- **Daily Query Limit:** Each logged-in user is limited to **20 AI interactions per day**. This is sufficient for resolving a specific issue (e.g., a ticket or an exam review) without allowing bots to drain the developer's budget.
- **Exam Mode:** Taking the "Mock Exam" (multiple choice) is **unlimited** (client-side JSON). However, clicking "Explain with AI" consumes 1 credit from the daily quota.
- **Abuse Protocol:** Users attempting to bypass limits or inject malicious prompts (e.g., asking for illegal fixer contacts) will be flagged or banned via Firestore Security Rules.

---

## 3. Epics & User Stories

We will break this down into **5 Major Epics** for the Agile development cycle.

### **Epic A: The "License Getter" Wizard (Acquisition & Renewal)**

_Focus: Guiding the user from walking in to getting the card._

- **Story A1:** As a **Student Applicant**, I want to generate a personalized checklist of requirements for a Student Permit, so that I don't waste time going to the LTO lacking documents.
- **Story A2:** As a **User**, I want to ask about the difference between "Non-Professional" and "Professional" restrictions in Taglish, so I can apply for the right one based on my livelihood.
- **Story A3:** As a **Renewing Driver**, I want to check if I am eligible for the **10-Year Validity** license based on my violation history, so I can prepare the correct medical requirements.
- **Story A4:** As a **Foreigner/Balikbayan**, I want to know if I can use my foreign license in the Philippines, so that I can drive legally upon arrival.

### **Epic B: The "Lawyer" (Traffic Laws & Violations)**

_Focus: The Core RAG Engine ingestion of RA 4136, JAO 2014-01, and local ordinances._

- **Story B1 (RAG):** As a **Driver**, I want to type in a violation (e.g., "Swerving" or "Reckless Driving"), so that I can verify if it is a legitimate violation and exactly how much the fine is.
- **Story B2:** As a **Driver**, I want to know the specific fines for **NCAP (No Contact Apprehension)** versus physical apprehension, so that I know where and how to pay.
- **Story B3:** As a **Motorcycle Rider**, I want to know the specific laws on "Top Boxes," "Auxiliary Lights," and "Slippers," so that I don't get wrongly apprehended at checkpoints.
- **Story B4:** As a **User**, I want the AI to cite the **specific Source (e.g., RA 4136 Sec 35)**, so I can show the law to an enforcer if necessary.

### **Epic C: The "Exam Reviewer" (Education)**

_Focus: Helping users pass the Theoretical Driving Course (TDC) and Comprehensive Driver’s Education (CDE)._

- **Story C1:** As a **Student**, I want to take unlimited practice quizzes generated from the official LTO questionnaire.
- **Story C2:** As a **User**, I want to click an **"Explain Answer"** button when I get a question wrong, so the AI can explain the logic behind the rule (Consumes 1 Credit).
- **Story C3:** As a **Reviewer**, I want to filter questions by category (e.g., "Road Signs" vs. "Right of Way"), so I can focus on my weak points.

### **Epic D: The "Crisis Manager" (Accidents & Insurance)**

_Focus: Emergency workflows and insurance logic._

- **Story D1:** As a **Driver involved in a crash**, I want a step-by-step "Post-Accident Checklist," so that I don't miss legal steps (e.g., taking photos before moving the car).
- **Story D2 (RAG):** As a **Car Owner**, I want to upload/paste my Insurance Policy text, so the AI can tell me if "Acts of Nature" (Flooding) are covered.
- **Story D3:** As a **User**, I want to understand the "Last Clear Chance" doctrine in simple terms, so I understand who is likely at fault in a collision.

### **Epic E: Admin & Knowledge Management**

_Focus: The backend RAG operations and data freshness._

- **Story E1:** As an **Admin**, I want to run a Node.js script to ingest new PDF Memorandums, so that the vector database is always current.
- **Story E2:** As an **Admin**, I want to "tag" documents by date, so the AI prioritizes 2026 rules over 2018 rules.

---

## 4. Killer Features (The "Viral" Utilities)

These features demonstrate the power of RAG and Vision AI.

### **1. The "Ticket Decoder" (Vision + RAG)**

- **The Problem:** Tickets (TOP - Temporary Operator's Permit) are handwritten, messy, and confusing.
- **The Feature:** The user snaps a photo of the ticket. The AI OCRs the violation code (e.g., "Sec 35").
- **The Output:** The app retrieves the law from the Vector DB and displays: _"You were charged with Overspeeding. The fine is P3,000. You must settle this at the LTO branch within 15 days."_

### **2. The "Argument Script" Generator**

- **The Problem:** Enforcers sometimes invent violations (e.g., "Driving with slippers" for 4-wheelers—which is _not_ a violation, only for motorcycles).
- **The Feature:** The user types: _"Enforcer says I can't drive my Sedan in slippers."_
- **The Output:** The app generates a polite but firm script: _"Sir, according to Administrative Order AHS-2008-015, the prohibition on wearing slippers only applies to motorcycles. Here is the text of the law."_

### **3. The "Registration Cost Estimator"**

- **The Problem:** "How much cash should I bring to the LTO?"
- **The Feature:** A hybrid RAG + Calculator.
- **Input:** "Toyota Vios, 2018 model, Late registration by 6 months."
- **Output:** "Basic Renewal: P1,600 + Penalty (50% of MVUC): P800 + Emission Test: P450 + TPL Insurance: P650. **Total Estimated: P3,500.** Bring P4k to be safe."

---

## 5. Revised Tech Stack (Node.js/React)

This aligns with the Technical Design Document (TDD).

- **Frontend:** React (Vite) + Tailwind CSS + Shadcn UI (Mobile First).
- **Backend:** Firebase (Auth + Firestore). _No custom backend server._
- **Orchestration:** LangChain.js (Client-Side).
- **Vector Database:** Pinecone (Serverless).
- **AI Models:**
- **Text:** Gemini 1.5 Flash (via Google Vertex AI).
- **Embeddings:** `text-embedding-004`.

- **Data Pipeline:** Node.js Scripts (TypeScript) for PDF ingestion.

---

## 6. Success Metrics (KPIs)

1. **Community Trust:** < 1% user reports of "Incorrect Information" (Hallucinations).
2. **Engagement:** Average user completes 3 mock exams before their actual LTO test.
3. **Stability:** 100% of users attempting to abuse the system (over 20 queries) are successfully rate-limited by Firestore Rules.
