Here is the revised **Implementation To-Do List (TDL)** for **Maneho.ai**.

I have restructured the Agile phases to match your requested 3-step logical flow ("Hosting -> Chatbot -> Vector Search") while inserting the **Google Cloud IAM "Startup" Checklist** into Phase 0 to prevent permission errors.

---

### **Phase 0: Google Cloud Infrastructure & IAM "Scaffolding"**

_Goal: Set permissions correctly at the start so `firebase deploy` doesn't fail later._

- [ ] **1. CLI Authentication**
- Run `firebase login` (or `firebase login --reauth` if you have old tokens).
- Ensure you are logged into the correct Google account associated with the GCP project.

- [ ] **2. Google Cloud Project Init**
- Create a new project in Firebase Console (e.g., `maneho-core`).
- This automatically creates a Google Cloud Project. Note the `Project ID`.

- [ ] **3. 🛡️ IAM Permissions Checklist (The "Fix-It-First" Step)**
- _Note: Since we are building a Client-Side app (no Cloud Functions yet), we specifically need to prevent logging errors during build/deploy._
- Go to **Google Cloud Console > IAM & Admin > IAM**.
- **Locate:** `[PROJECT_NUMBER]-compute@developer.gserviceaccount.com` (Compute Engine Default Service Account).
- **Action:** Click "Edit Principal" (Pencil Icon).
- **Grant Role:** `Logs Writer` (`roles/logging.logWriter`).
- _Why:_ As per your reference, this ensures detailed logs from build steps are visible and prevents common permission warnings even if we aren't using heavy compute.

- [ ] **4. Enable APIs**
- In Google Cloud Console, enable:
- **Vertex AI API**
- **Generative AI API** (for Gemini)
- **Firebase Hosting API**

- [ ] **5. Environment Variables**
- Create `apps/web/.env.local` (Gitignored):

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_GOOGLE_AI_KEY=...       # From AI Studio
VITE_PINECONE_API_KEY=...    # From Pinecone
VITE_PINECONE_INDEX=maneho-index

```

---

### **Phase 1: Foundation (Hosting & Authentication)**

_Goal: Get the "Skeleton" live on the web._

- [ ] **1. Firebase Init**
- Inside the repo root, run `firebase init`.
- Select **Hosting** and **Emulators** (optional).
- Point hosting to `apps/web/dist`.
- Select "Yes" for "Configure as a single-page app".

- [ ] **2. React App Base**
- Clean up the Hytel boilerplate.
- Install Firebase SDK: `pnpm add firebase`.
- Initialize Firebase in `apps/web/src/lib/firebase.ts`.

- [ ] **3. Authentication (Auth)**
- Enable **Google Auth** in Firebase Console.
- Create `AuthProvider.tsx` to handle login state.
- **Milestone:** You can run `pnpm dev`, log in with Google, and see your User ID in the console.

- [ ] **4. 🛡️ LOOPHOLE FIX: Disclaimer Modal**
- Create `components/modals/DisclaimerModal.tsx`.
- Force user to click "I Agree" (Save state to Firestore: `users/{uid}/agreed_to_terms`).

---

### **Phase 2: The "Brain" (Gemini Chatbot)**

_Goal: Spin up a Gemini Chatbot in the application (Basic Mode)._

- [ ] **1. Install AI SDKs**
- `cd apps/web`
- `pnpm add @google/generative-ai`.

- [ ] **2. Basic Chat Service**
- Create `lib/ai/gemini.ts`.
- Initialize model: `gemini-1.5-flash`.
- Create a function `generateSimpleResponse(prompt)` that calls the API and returns text.

- [ ] **3. Chat UI**
- Create `ChatInterface.tsx`.
- Add a simple Input box and Message list.
- **Milestone:** You can type "Hello" and Gemini replies "Hello! How can I help you?" (No LTO knowledge yet).

---

### **Phase 3: The "Memory" (Vector Search & Ingestion)**

_Goal: Ingest data and make it available to the Chatbot (RAG)._

- [ ] **1. Pinecone Setup**
- Create Index `maneho-index` (Dimension: **768**).

- [ ] **2. Data Ingestion (Node.js Script)**
- Create `scripts/ingest`.
- Install: `npm install typescript tsx dotenv @google/generative-ai @pinecone-database/pinecone pdf-parse`.
- **Script Logic (`ingest.ts`):**
- Load LTO PDFs.
- Chunk text (800 chars).
- Embed using `text-embedding-004`.
- Upsert to Pinecone.

- **Action:** Run `npx tsx scripts/ingest/ingest.ts`.

- [ ] **3. Connect Chatbot to Memory**
- Update `lib/ai/gemini.ts`.
- Add function `queryManeho(userQuery)`:
- Step A: Embed `userQuery`.
- Step B: Query Pinecone for Context.
- Step C: Send Prompt + Context to Gemini.

- **Milestone:** Ask "What is the fine for swerving?" and get a specific answer cited from your PDFs.

---

### **Phase 4: Security & Guardrails (The Loophole Fixes)**

_Goal: Apply the fixes for "Abuse," "Hallucinations," and "Fixers."_

- [ ] **1. 🛡️ IAM & API Security**
- Go to Google Cloud Console > Credentials.
- Restrict the API Key to HTTP Referrers: `localhost:5173` and `your-firebase-app.web.app`.

- [ ] **2. 🛡️ Firestore Abuse Rules**
- Apply the `daily_queries < 20` rule in Firestore Console (from TDD).

- [ ] **3. 🛡️ System Prompt Hardening**
- Update `lib/ai/gemini.ts` to include the **System Prompt**:
  > "Current Date: [Insert Date]. Refuse to answer questions about 'fixers' or 'bribing'. Start legal advice with 'Note: This is not legal counsel.'"

---

### **Phase 5: Deployment**

_Goal: Go Live._

- [ ] **1. Build**
- Run `pnpm build` in the root.

- [ ] **2. Deploy**
- Run `firebase deploy`.
- **Verify:** Check the URL. Test the Login. Test the Chat.

- [ ] **3. Final IAM Check**
- If deployment fails (e.g., "Permission denied"), refer back to **Phase 0 Step 3** and check if the Service Account has `Logs Writer` or `Artifact Registry` permissions (if you used experimental web frameworks features).
