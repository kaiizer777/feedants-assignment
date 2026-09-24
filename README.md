# Feedants Technical Assignment — Competition Details

Full-stack implementation of the Feedants **Competition Details** screen, featuring an Expo React Native mobile client, an Express.js + TypeScript REST API, and a concurrency-safe MongoDB data layer.

---

## 1. OVERVIEW

This project is a full-stack implementation of the Feedants **Competition Details** screen, built with React Native (Expo) on the frontend, Node.js + Express + TypeScript on the backend, and MongoDB (via Mongoose) as the persistent datastore. It is developed as a technical assignment submission for the Feedants Full Stack Development Internship to demonstrate production-grade architecture, data modeling, concurrency-safe mutations, and reactive mobile UI state handling, rather than a fully comprehensive multi-screen product.

---

## 2. SETUP INSTRUCTIONS

Follow these steps to run the project from a fresh clone.

### Prerequisites
- **Node.js**: v18.0.0+ or v20.0.0+ recommended
- **npm**: v9.0.0+
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/feedants`) or a free MongoDB Atlas cluster URI
- **Mobile Device or Simulator**: Expo Go app on iOS/Android, an iOS Simulator, an Android Emulator, or a modern web browser (Chrome, Safari, Edge)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/kaiizer777/feedants-assignment.git
cd feedants-assignment
```

---

### Step 2: Backend Setup & Seeding

1. **Navigate to the backend directory and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Open `backend/.env` and verify your MongoDB connection string and port:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/feedants
   NODE_ENV=development
   ```
   *(If using MongoDB Atlas, paste your cluster URI into `MONGODB_URI`)*.

3. **Seed the database:**
   ```bash
   npm run seed
   ```
   The seed script (`src/db/seed.ts`) will:
   - Connect to MongoDB and clean up previous seed records idempotently.
   - Seed the target competition: *"Feedants Classical Dance"* (20 total spots, ₹1,500 prize pool, ₹99 entry fee) with timestamps computed relative to runtime.
   - Seed an initial registration for *"Ananya Sharma"* to establish the baseline of 1 spot taken (19 spots remaining).
   - Seed a demo unregistered user *"Saif (Solo Dev)"* for interactive testing.
   - **Important:** Note the generated competition ID printed in the console output:
     `✅ Seeded competition: "Feedants Classical Dance" (ID: <COMPETITION_ID>)`
     (e.g., `6ab43aaaabd4bffa981a53c9`). You will set this in `frontend/.env`.

4. **Start the backend development server:**
   ```bash
   npm run dev
   ```
   The API server will start on `http://localhost:5000`. You can confirm server and database health in a separate terminal:
   ```bash
   curl http://localhost:5000/api/health
   # Expected response: {"status":"ok","timestamp":"...","database":"connected"}
   ```

---

### Step 3: Frontend Setup & Launch

1. **Open a new terminal window and navigate to the frontend directory:**
   ```bash
   cd feedants-assignment/frontend
   npm install
   ```

2. **Configure frontend environment variables:**
   ```bash
   cp .env.example .env
   ```
   Ensure `frontend/.env` contains the backend API URL and the competition ID from the seed step:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
   EXPO_PUBLIC_DEFAULT_COMPETITION_ID=6ab43aaaabd4bffa981a53c9
   ```
   *(Paste the ID generated during `npm run seed` above if different).*
   > **Note for Physical Device Testing:** If running on a physical phone via Expo Go, replace `localhost` with your computer's local network IP address (e.g., `http://192.168.1.50:5000/api`), ensuring both your computer and phone are connected to the same Wi-Fi network.

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

4. **Open the Application:**
   - **Web Browser (Recommended for instant review):** Press `w` in the Expo terminal or visit `http://localhost:8082`. The web view renders a centered, styled mobile device canvas.
   - **Expo Go (Physical Phone):** Open Expo Go (Android) or the Camera app (iOS) and scan the QR code displayed in the terminal.
   - **iOS Simulator:** Press `i` in the Expo terminal (requires Xcode on macOS).
   - **Android Emulator:** Press `a` in the Expo terminal (requires Android Studio).

---

## 3. ENVIRONMENT VARIABLES

### Backend (`backend/.env`)
| Variable | Required | Description | Default / Source |
|---|---|---|---|
| `PORT` | Yes | HTTP port the Express server listens on | `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string URI | Local: `mongodb://localhost:27017/feedants`<br>Cloud: MongoDB Atlas cluster URI |
| `NODE_ENV` | Yes | Node environment mode (`development` or `production`) | `development` |

### Frontend (`frontend/.env`)
| Variable | Required | Description | Default / Source |
|---|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Yes | Base URL for backend API requests | `http://localhost:5000/api` (use LAN IP for physical device) |
| `EXPO_PUBLIC_DEFAULT_COMPETITION_ID` | Optional | ObjectId of the competition to load on launch | `6ab43aaaabd4bffa981a53c9` |

---

## 4. ASSUMPTIONS

The following assumptions were deliberately made in accordance with the project scope:

1. **Mocked Authentication**:
   - Full authentication (OAuth, JWT tokens, session management) is out of scope. The API identifies the user via an `x-auth-token` HTTP header mapped to `mockAuthToken` on the `User` document.
   - The application provides two seeded mock users: an unregistered user (*"Saif (Solo Dev)"*, token: `mock-user-demo-unregistered-2`) and a registered/submitted user (*"Ananya Sharma"*, token: `mock-user-seed-registered-1`). Users can switch between these personas via the "Profile" tab in the bottom bar to test different states.

2. **Mocked Payment**:
   - The design shows an entry fee of ₹99 and official Razorpay branding. Real payment integration is out of scope.
   - Calling `POST /api/competitions/:id/register` simulates successful payment and sets `paymentStatus: "paid"` immediately.
   - The `Registration` model explicitly stores `paymentStatus` to uphold the design disclaimer: *"Only contributions from paid participants will be considered for judging"*.

3. **Simplified Submission Pipeline**:
   - Production file storage pipelines (AWS S3 presigned URLs, Cloudinary, video transcoding) are out of scope.
   - Submissions accept structured text notes and/or external media URLs (`content`, `mediaUrl`) stored on the `Registration` document, fully exercising validation, time-gated access, and UI state transitions.

4. **Static / Non-Functional UI Elements**:
   - To match the visual design while maintaining strict backend focus, secondary features are rendered with high fidelity but treated as static or stubbed:
     - **Language Toggle (`ENG / हिंदी`)**: Interactive toggle UI present; full translation copy is descoped.
     - **Refer & Earn Section**: Interactive copy link action provided; referral ledger and credit tracking are separate backend features.
     - **"Hear From Our Users" Link**: Informational alert shown; testimonials catalog is out of scope.
     - **"Ad Here" Slot**: Placeholder banner rendered per layout; dynamic ad SDK integration is descoped.

5. **Time-Relative Seed Data**:
   - Instead of hardcoding static dates that match the assignment screenshot literally (which would quickly expire and lock registration), seed dates are computed dynamically relative to runtime (`Date.now() +/- N days`):
     - `submissionStart`: 2 days ago (submission window active)
     - `registerBy`: 5 days from now (registration countdown active)
     - `submissionEnd`: 15 days from now
     - `resultDate`: 18 days from now
   - This guarantees that whenever a reviewer clones and runs the project, the competition is in an active, testable state (`submission_open` with an active registration countdown).

---

## 5. MAJOR TECHNICAL DECISIONS

### 1. Stored Counter (`spotsTaken`) vs. Derived Count for Spots Remaining
- **Decision**: Stored counter (`spotsTaken` integer field on the `Competition` document).
- **Read Performance at Scale**: Consumer competition platforms experience heavy read-to-write traffic (~100:1). Deriving spots dynamically via `Registration.countDocuments({ competitionId, paymentStatus: 'paid' })` requires a secondary collection index scan or B-tree traversal on every GET request. With a stored counter, calculating `spotsRemaining` is an O(1) in-memory computation (`totalSpots - spotsTaken`) returned directly in the initial query.
- **Atomic Concurrency Safety**: A derived count cannot be atomically checked and updated in a single document operation without distributed multi-document ACID transactions. A stored counter enables a single-document atomic update via MongoDB's `findOneAndUpdate`.

### 2. Computed-on-Read Lifecycle State vs. Stored State
- **Decision**: Computed dynamically on-the-fly (`competition.lifecycleState`) rather than stored as a static database column.
- **Single Source of Truth**: Storing states like `"registration_open"`, `"registration_closed"`, or `"submission_closed"` creates a dual source of truth. Since transitions depend strictly on timestamps (`registerBy`, `submissionStart`, `submissionEnd`, `resultDate`), a stored field requires external cron workers to poll and mutate documents. Any scheduler lag or worker downtime causes stale state. Computing lifecycle state at query time guarantees 100% temporal accuracy with zero scheduling lag.

### 3. Atomic Registration Pattern (Zero Overselling Guarantee)
- **Decision**: Single atomic `findOneAndUpdate` with conditional filter:
  ```typescript
  const competition = await Competition.findOneAndUpdate(
    {
      _id: id,
      $expr: { $lt: ["$spotsTaken", "$totalSpots"] },
      registerBy: { $gt: new Date() },
    },
    { $inc: { spotsTaken: 1 } },
    { new: true }
  );
  ```
- **Rationale**: Eliminates Time-Of-Check to Time-Of-Use (TOCTOU) race conditions. The condition check (`$spotsTaken < $totalSpots`) and the increment (`$inc: { spotsTaken: 1 }`) occur as a single atomic operation inside MongoDB's WiredTiger storage engine. If capacity is saturated or the deadline has passed, MongoDB modifies 0 documents and returns `null`, mathematically guaranteeing that the final spot cannot be oversold under concurrent traffic.

### 4. Unique Compound Index & Compensating Rollback
- **Decision**: Compound index `Registration.index({ competitionId: 1, userId: 1 }, { unique: true })` paired with compensating rollback logic.
- **Rationale**: Fast-path application checks (`Registration.findOne`) cannot prevent duplicate registrations under simultaneous requests from multiple tabs or network retry bursts. The database-level unique index ensures that exactly one registration record can exist per user per competition. If a concurrent duplicate bypasses the fast path, `Registration.create` rejects with MongoDB error code `11000`. The catch block executes an atomic compensating decrement:
  ```typescript
  await Competition.updateOne(
    { _id: competition._id },
    { $inc: { spotsTaken: -1 } }
  );
  ```
  This immediately reverts the reserved spot, ensuring zero spot count drift.

### 5. Empirical Concurrency Verification
To verify the implementation against race conditions, an automated stress test was executed (`backend/src/scripts/concurrencyTest.ts` via `npm run test:concurrency`):
- **Setup**: Competition initialized with exactly 1 spot remaining (`spotsTaken: 19/20`).
- **Load**: 15 simultaneous HTTP POST `/api/competitions/:id/register` requests fired in parallel using `Promise.all` across 15 distinct mock user tokens.
- **Empirical Results**:
  - **Total execution time**: 1,001 ms across all 15 requests.
  - **HTTP 201 Created**: Exactly 1 request succeeded (User `1790033014811-0` in 679 ms).
  - **HTTP 409 SPOTS_FULL**: Exactly 14 requests were rejected cleanly.
  - **HTTP 500 / Network Failures**: 0.
  - **Database Verification Post-Contention**: `spotsTaken` was exactly 20/20, `spotsRemaining` was 0, and exactly 1 new registration document was persisted.

---

## 6. TRADE-OFFS CONSIDERED

1. **Stored Counter vs. Reconciliation Discipline**:
   - *Trade-off*: A stored counter provides O(1) reads and lock-free atomic reservations, but introduces potential drift if an unexpected server crash occurs between spot reservation and registration creation. We mitigated this with compensating rollback logic (`$inc: -1` on error). In enterprise production, this trade-off requires a background reconciliation cron to periodically audit `spotsTaken === countDocuments(Registration)`.

2. **MongoDB Atlas Shared-Tier Latency under Concurrent Bursts**:
   - *Trade-off*: Testing against a free-tier MongoDB Atlas M0 cluster introduced round-trip network transit and connection pool contention under 15 simultaneous requests (~679 ms response on winning thread, 1,001 ms total). In production, co-locating backend compute and the database within the same cloud region (VPC peering) and tuning Mongoose connection pool settings (`maxPoolSize: 50+`) would reduce this to sub-50 ms.

3. **Simplified Submission Format**:
   - *Trade-off*: Accepted text notes and external links rather than building a chunked multipart file upload pipeline. This trade-off prioritized backend race-condition safety, edge-case validation, and mobile UI responsiveness within the assignment timeline.

4. **Scope Prioritization (Backend Architecture vs. Decorative Features)**:
   - *Trade-off*: In accordance with the assignment brief, development time was weighted toward atomic database operations, schema indexing, and lifecycle state correctness over building full functional referral systems or multi-language localization.

---

## 7. WHAT I'D IMPROVE FOR PRODUCTION

If preparing this service for high-scale production deployment, the following enhancements would be prioritized:

1. **Production Authentication & Authorization**:
   - Integrate phone number authentication with SMS OTP verification (standard for Indian consumer apps) alongside OAuth 2.0 / Apple Sign-In.
   - Implement short-lived cryptographically signed JWTs (15m expiry) paired with rotating refresh tokens stored in secure device storage (`Expo SecureStore`).
   - Role-Based Access Control (RBAC) separating participants, judges, and administrators.

2. **Full Payment Gateway Integration (Razorpay)**:
   - Two-phase payment commit:
     1. Client initiates checkout: backend creates a Razorpay Order (`POST /api/payments/order`) and returns `order_id`.
     2. Razorpay mobile checkout SDK collects payment.
     3. Backend verifies HMAC-SHA256 signature (`crypto.createHmac('sha256')`) and listens for verified Razorpay webhooks (`payment.captured`) with idempotency keys before finalizing the registration.

3. **Direct-to-Cloud Media Upload Pipeline**:
   - Direct presigned upload URLs (AWS S3 / Cloudinary) with client-side chunking and upload progress bars.
   - Server-side validation of file magic bytes and MIME types.
   - Asynchronous transcoding and malware scanning worker queues (AWS MediaConvert / SQS).

4. **Distributed Caching & Rate Limiting**:
   - Redis caching for `GET /api/competitions/:id` public data, invalidated upon spot reservation or lifecycle transitions.
   - Token bucket rate limiting (`express-rate-limit` + Redis) on registration and submission endpoints to mitigate automated bots.

5. **Automated Reconciliation Cron**:
   - Scheduled background worker (BullMQ / Agenda) executing hourly to verify and reconcile `spotsTaken` on `Competition` against the actual count of paid `Registration` documents.

6. **Comprehensive Internationalization (i18n)**:
   - Full localization engine (`i18next` + `expo-localization`) supporting English and Hindi translations across all copy and formatted currency strings.

7. **Admin Operations Dashboard**:
   - Internal dashboard for contest administrators to create competitions, manage reward ladders, review submissions, and publish verified scores.

---

## 8. DEMO

A video screen recording is included with this submission demonstrating the complete end-to-end user journey:

1. **Viewing Competition as Unregistered User**:
   - Loading the screen as *"Saif (Solo Dev)"*, displaying the live countdown timer, "19 spots left" progress bar, ₹1,500 prize pool, ₹99 entry fee, and the primary action button labeled **"Register Now"**.
2. **Registration & State Transition**:
   - Tapping **"Register Now"** to execute the atomic reservation and mock payment.
   - The UI immediately updates: spots decrease from 19 to 18, and the button transitions smoothly to **"Upload Submission"**.
3. **Duplicate Registration Prevention**:
   - Demonstrating that attempting to register again as the same user returns a handled conflict error.
4. **Submitting an Entry**:
   - Tapping **"Upload Submission"**, opening the submission modal, entering performance notes and a video link, and submitting.
   - The screen reflects the completed submission status.
5. **Persona Switching**:
   - Tapping the "Profile" tab to switch to *"Ananya Sharma"* to demonstrate persistent registered and submitted state.
