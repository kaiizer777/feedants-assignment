# Feedants Technical Assignment — Scope

## What This Project Is

A take-home technical assignment for a **Full Stack Development Internship** at Feedants.
The task: build **one screen** — the "Competition Details" page — as a fully functional,
production-style full-stack feature, not a static UI clone.

Feedants (inferred from context) is a competitions/contest platform. Users browse contests
(e.g. dance, art, writing), pay an entry fee to register, submit an entry within a submission
window, and get judged for prize money.

This assignment is scoped to the **details page of a single competition** — the screen a user
sees after tapping into one specific contest.

---

## Required Stack

| Layer     | Technology                  |
|-----------|------------------------------|
| Frontend  | React Native (via Expo)      |
| Backend   | Node.js + Express.js         |
| Database  | MongoDB (via Mongoose)       |
| Language  | TypeScript (frontend + backend) |

---

## What We're Building

### 1. Frontend — Competition Details Screen (React Native)
A single screen matching the provided design, rendering **live data from the backend**:

- Competition title, category tags, prize pool, entry fee
- Spots remaining (e.g. "19 spots left", "1 / 20 booked") — live count, not hardcoded
- User's own registration state (Registered / Not Registered / Full / Closed)
- Countdown timer to registration deadline
- Important dates: register-by, submission start, submission end, result date
- Judge info + intro video reference
- Previous winners list
- Tabbed info section: About / Judging Parameters / Rules & Eligibility
- Rewards breakdown by rank
- Primary action button whose label/behavior changes based on current state:
  - Not registered + spots available → "Register Now"
  - Registered + submission window open → "Upload Submission"
  - Registered + submission window closed → disabled/appropriate state
  - Competition full → "Registration Full" (disabled)
  - Registration closed (deadline passed) → appropriate disabled state

### 2. Backend — Express API
RESTful API serving all data needed by the screen, plus the actions a user can take. At minimum:

- `GET /api/competitions/:id` — full competition details, merged with the requesting user's
  registration status
- `POST /api/competitions/:id/register` — register the current user for a competition
  - Must validate: spots available, registration deadline not passed, user not already registered
  - Must be **safe under concurrent requests** (no overselling the last spot)
- `POST /api/competitions/:id/submission` — submit an entry (only valid if registered and within
  the submission window)
- `GET /api/health` — basic health check

### 3. Database — MongoDB Schema Design
Schema design is ours to define (not provided). Expected collections, roughly:

- **Competitions** — title, category, prize pool, entry fee, total spots, spots taken,
  important dates (register-by, submission start/end, result date), rewards breakdown,
  judge info, rules/eligibility content, status/lifecycle field
- **Registrations** — links a user to a competition, timestamp, payment/entry status,
  submission reference (once submitted)
- **Users** — minimal user model sufficient to demonstrate "who is registered / who owns
  a submission"

### Auth Assumption (explicit decision, not a gap)
Full authentication is not the focus of this assignment. Assumption: use a simplified/mocked
auth layer — e.g. a hardcoded test user, or a minimal JWT/user-id-in-header scheme — just enough
to demonstrate per-user registration state and submission ownership. This should be stated
plainly in the README as an assumption, not left ambiguous.

### Payment Assumption (explicit decision, not a gap)
The design shows a ₹99 entry fee and "Secure payments powered by Razorpay." Real payment
integration is out of scope for this assignment. Assumption: registration will simulate/mock
the payment step (e.g. a `paymentStatus` field set to "paid" on registration, or a fake payment
confirmation step) rather than integrating a real payment gateway. This should be stated
explicitly in the README as a deliberate scope decision, along with a note on how it would be
implemented for real (Razorpay order creation, webhook-confirmed payment before registration
is finalized, etc.).

The design's disclaimer — "Only contributions from paid participants will be considered for
judging" — implies a `paymentStatus` (or equivalent) field on the Registration model that gates
judging eligibility, separate from the registration itself.

Key modeling concerns to solve deliberately:
- Atomic, race-condition-safe spot decrementing (e.g. `findOneAndUpdate` with a conditional
  filter, not "read count → check → write count")
- Deriving computed states (e.g. "is registration closed") from dates/rules rather than storing
  redundant flags that can drift out of sync

### 4. Business Logic / Edge Cases to Handle
- Competition full (spots = 0) — reject new registrations
- Registration deadline passed — reject new registrations even if spots remain
- User already registered — prevent duplicate registration
- Submission attempted outside the submission window — reject
- Two users racing for the last spot simultaneously — only one should succeed
- Competition not found / invalid ID — proper error handling

### 5. Deliverables
- GitHub repository with complete source (frontend + backend)
- Setup instructions for running both the Expo app and the Express backend
- Environment variable requirements (`.env.example`)
- A short screen recording demonstrating the feature actually working end-to-end
- **README** including:
  - Assumptions made
  - Major technical decisions
  - Trade-offs considered
  - What would be improved/changed for a real production version

---

## Design Elements Present but Deliberately Out of Scope
These appear in the provided design but are treated as static/decorative or explicitly
descoped, rather than silently omitted. Worth a one-line mention in the README so it reads
as a decision, not an oversight:

- **Language toggle (ENG / हिंदी)** — rendered statically (UI present, no real i18n behind it)
- **Refer & Earn section** — rendered statically or omitted; real referral tracking
  (unique codes, credit-per-signup logic) is a separate feature, not part of this screen's
  core lifecycle
- **"Hear From Our Users" testimonials link** — static/non-functional, or omitted
- **"Ad Here" placeholder** — omitted (placeholder ad slot, not a real feature)

## What's Explicitly NOT the Focus

- Pixel-perfect UI polish (design accuracy matters, but it's evaluated alongside — not above —
  backend architecture and data handling)
- Building the rest of the app (other screens, full auth system, payments, admin panel) — this
  is intentionally scoped to one screen and its supporting backend

## What's Being Evaluated Most Heavily
Per the assignment brief, weighted toward:
- Backend architecture, API design, and MongoDB data modeling
- Correctness of business logic and edge case handling
- Handling of concurrent user actions and data consistency
- Scalability / production-readiness of technical decisions
- Code quality and clarity of reasoning (via the README)

React Native implementation quality matters, but the brief is explicit that a
UI-only, hardcoded submission will not be considered complete.