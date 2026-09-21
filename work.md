# Feedants Technical Assignment — Work Plan

Reference: see `scope.md` for full project scope, assumptions, and what's being evaluated.
Project init (monorepo, Expo boot, Express boot, health check, Mongo connection) is done.
Work through the remaining phases in order — don't jump to Phase 3 (React Native UI) before
Phase 1 (schema) and Phase 2 (API) are solid. The evaluation weighs backend architecture and
data handling more heavily than UI polish, so front-load your effort accordingly.

---

## Phase 1 — Data Modeling & Schema Design
*Goal: MongoDB schema fully designed and justified on paper before writing feature code.
This is one of the most heavily evaluated parts — don't rush it.*

- [x] Define `Competition` schema (Mongoose model) — fields for: title, category/tags, prize pool, entry fee, total spots, spots taken (or derive from registrations — decide and document which), important dates (registerBy, submissionStart, submissionEnd, resultDate), rewards breakdown (array of {rank, amount}), judge info (name, title, bio, intro video ref), rules/eligibility content, about-competition content, previous winners (array)
- [x] Define `Registration` schema — fields for: competitionId (ref), userId (ref), registeredAt, paymentStatus (mocked — see scope.md), submission reference (nullable until submitted)
- [x] Define `User` schema — minimal fields sufficient to demonstrate per-user state (name, mock auth identifier)
- [x] Decide: is "spots remaining" a stored counter on `Competition`, or derived by counting `Registration` documents at query time? Document the trade-off (stored counter = faster reads but needs atomic updates and can drift; derived count = always accurate but slower at scale). **This decision directly affects your concurrency-safety approach in Phase 2 — make it deliberately.**
- [x] Add indexes: unique compound index on `(competitionId, userId)` in `Registration` to prevent duplicate registrations at the DB level, not just in application code
- [x] Write out (in README draft or comments) the lifecycle states a competition can be in — e.g. `upcoming`, `registration_open`, `registration_closed`, `submission_open`, `submission_closed`, `results_declared` — and whether this is a stored field or computed from dates. Document your choice.
- [x] Seed script: create a `seed.ts`/`seed.js` script that inserts one realistic competition (matching the design's data — Feedants Classical Dance, ₹1,500 prize pool, etc.) so the frontend has real data to render against from day one
  - [x] Make the seed script idempotent (clear existing seed data or upsert by a known slug/id first) so re-running it during development doesn't create duplicate competitions

---

## Phase 2 — Backend API & Business Logic
*Goal: every endpoint works correctly, validates properly, and is safe under concurrent load.*

- [x] `GET /api/competitions/:id` — returns full competition details
  - [x] Merges in the requesting (mock) user's registration status (registered / not / submitted)
  - [x] Computes and returns current lifecycle state (based on current date vs. stored dates)
  - [x] Computes and returns spots-remaining value
  - [x] Returns proper 404 if competition doesn't exist
- [x] `POST /api/competitions/:id/register`
  - [x] Validates: registration deadline has not passed
  - [x] Validates: spots are available
  - [x] Validates: user is not already registered (duplicate prevention)
  - [x] **Concurrency-safe implementation** — use an atomic MongoDB operation (e.g. `findOneAndUpdate` with a filter condition like `spotsTaken: { $lt: totalSpots }` combined with `$inc`, inside the same atomic call) rather than "read count → check in application code → write count." This is the single most important correctness requirement in the whole assignment.
  - [x] Returns appropriate error responses for each failure case (410/409/400 as appropriate, not just generic 500s)
  - [x] Mock payment step included (see scope.md assumption) before registration is finalized
- [x] `POST /api/competitions/:id/submission`
  - [x] Validates: user is registered for this competition
  - [x] Validates: current time is within the submission window
  - [x] Rejects if submission window hasn't started yet or has already closed
  - [x] Stores a submission reference on the `Registration` document
- [x] Centralized error-handling middleware (consistent error response shape across all endpoints)
- [x] Input validation middleware/layer (e.g. checking `:id` is a valid ObjectId before hitting the DB)
- [x] **Concurrency test**: write a small script (or use a tool like `autocannon`/simple Promise.all loop) that fires many simultaneous registration requests at the "last spot" scenario, and confirm only one succeeds. This is worth doing even informally — it's direct proof for your README that you actually solved the race condition rather than just writing code that looks correct.

---

## Phase 3 — API Verification (before touching the frontend)
*Goal: prove the backend is fully correct in isolation, so frontend bugs don't get confused with backend bugs.*

- [x] Manually test all endpoints via Postman/Thunder Client/curl:
  - [x] Fetch competition details — correct shape, correct computed fields
  - [x] Register successfully
  - [x] Register again as same user — should fail with clear error
  - [x] Register after deadline (temporarily adjust seed data dates to test) — should fail
  - [x] Register when spots = 0 — should fail
  - [x] Submit without being registered — should fail
  - [x] Submit outside submission window — should fail
  - [x] Submit successfully within window
- [x] Run the concurrency test from Phase 2 and confirm correct behavior — record the result (even a terminal screenshot) for your own reference when writing the README

---

## Phase 4 — React Native Frontend
*Goal: screen matches the design closely and is fully wired to live backend data — no hardcoded values.*

- [ ] Build static layout first using placeholder/mock data matching the design's visual structure (fast iteration on layout without waiting on API wiring)
- [ ] Header: back button, title, ENG/हिंदी toggle (static, per scope.md)
- [ ] Info card: title, tags, prize pool, entry fee, spots-left progress bar, registered badge (conditional)
- [ ] Judge card with intro video button (video playback can be a stub/placeholder link)
- [ ] Countdown timer component — live-updating countdown to registration deadline, computed client-side from the deadline timestamp returned by the API (not hardcoded)
- [ ] Important Dates grid (4 dates)
- [ ] Previous Winners horizontal scroll list
- [ ] Tabbed section: About / Judging Parameters / Rules & Eligibility (tab switching, content per tab)
- [ ] Rewards list by rank
- [ ] Disclaimer, refund policy, Razorpay badge (static)
- [ ] Refer & Earn section (static, per scope.md)
- [ ] Bottom action bar — button label and enabled/disabled state driven by computed competition + registration state:
  - [ ] Not registered + spots available + registration open → "Register Now" (tappable, calls register API)
  - [ ] Registered + submission window open → "Upload Submission"
  - [ ] Registered + submission window not yet open → disabled state with appropriate label
  - [ ] Registered + submission window closed → disabled state with appropriate label
  - [ ] Spots full → "Registration Full" (disabled)
  - [ ] Registration deadline passed → disabled state with appropriate label
- [ ] Replace all placeholder data with real API calls (`GET /api/competitions/:id` on screen load)
- [ ] Wire "Register Now" button to `POST /register`, handle loading/success/error states (including the "someone just took the last spot" race-condition error — show a real error message, don't crash)
- [ ] Wire "Upload Submission" button to `POST /submission` (can be a simplified upload — e.g. text/link input rather than real file upload, document this as an assumption if simplified)
- [ ] Loading states (skeleton or spinner) while data is fetching
- [ ] Error states (competition not found, network error) handled gracefully, not a blank/crashed screen
- [ ] Bottom tab bar (Home / Explore / + / Competitions / Profile) — static, matches design, non-functional beyond this screen is acceptable

---

## Phase 5 — Polish & Edge Case Hardening
*Goal: catch the gaps a first pass usually misses.*

- [ ] Re-test every business-logic edge case from Phase 3, now through the actual UI (not just API tools) — confirm the UI reflects each state correctly
- [ ] Test on both a fresh "never registered" user and an "already registered" user (may need to fake/switch the mock user for testing, since auth is mocked)
- [ ] Confirm countdown timer doesn't break/go negative once the deadline passes — should transition the UI state instead
- [ ] Confirm the app doesn't crash on network failure or slow responses
- [ ] Basic loading/error UI consistency pass — no jarring layout shifts
- [ ] Code cleanup: remove console.logs, dead code, unused imports
- [ ] Consistent naming and folder structure review across both frontend and backend

---

## Phase 6 — README & Submission
*Goal: the README is not an afterthought — it's explicitly evaluated.*

- [ ] Write **Overview** — what this is, one paragraph
- [ ] Write **Setup Instructions** — exact steps to run backend (`npm install`, `.env` setup, `npm run dev`) and frontend (`npm install`, `npx expo start`), assuming a reviewer has never seen the project
- [ ] Write **Environment Variables** section — list every required variable and what it's for
- [ ] Write **Assumptions** section — explicitly cover: mocked auth, mocked payment, static/omitted UI elements (referral, language toggle, testimonials, ad slot), simplified submission upload if applicable — pull directly from `scope.md`'s assumption sections so this is consistent, not invented on the spot
- [ ] Write **Major Technical Decisions** section — cover: stored vs. derived spot count and why, atomic update strategy for concurrency safety, lifecycle-state modeling (stored vs. computed), schema design rationale
- [ ] Write **Trade-offs Considered** section — be honest about what you optimized for vs. what you'd do differently with more time (e.g. "chose stored counter for read performance at scale, accepting the complexity of atomic updates over a simpler but slower derived-count approach")
- [ ] Write **What I'd Improve for Production** section — real auth, real payment integration (Razorpay order + webhook confirmation flow), real file upload for submissions, rate limiting, caching layer for high-read competition data, proper i18n for the language toggle, admin panel for managing competitions
- [ ] Record a short screen recording demonstrating: viewing the competition, registering, seeing spots decrease, seeing the button state change, attempting a duplicate registration (showing the error), submitting an entry
- [ ] Final check: confirm a fresh clone of the repo + following your own README setup steps actually works end-to-end (catches "works on my machine" gaps)
- [ ] Push final commit, confirm repo is accessible to reviewers (public or shared correctly)
- [ ] Submit via whatever channel Feedants specified (email/form link)

---

## Notes While Working
- If you get stuck deciding something the assignment doesn't specify (exact validation rules, exact lifecycle states, etc.) — make a reasonable choice, document it as an assumption, and move on. The assignment explicitly rewards documented decision-making over guessing what they "wanted."
- Don't let Phase 4 (UI) bleed into more time than Phases 1–2 (schema/API). If you're short on time near the deadline, a slightly-off UI with rock-solid backend logic will score better than a pixel-perfect UI with hardcoded data — the brief says this directly.