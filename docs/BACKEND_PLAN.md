# SkillSwap — Backend Feature Plan

This document is the source of truth for backend implementation. It is built 
in phases. Each phase has a clear goal, exact scope, and acceptance criteria 
that must all pass before moving to the next phase. Do not start a phase 
until the previous one is confirmed working.

Frontend is already built (Next.js App Router, TypeScript, Tailwind, 
component library, all pages from the Stitch conversion, accessibility-fixed). 
This plan wires real functionality behind it.

---

## Phase 1 — Database & Infrastructure Foundation
**Status: in progress / already started**

**Goal:** A running Postgres (with pgvector) + Redis + Prisma setup, with the 
full schema migrated.

**Scope:**
- Docker Compose: postgres (pgvector/pgvector:pg16), redis, app
- `.env.local` with DATABASE_URL, REDIS_URL (confirmed gitignored)
- Full Prisma schema migrated: User, TeachSkill, LearnGoal, AvailabilitySlot, 
  Booking, CreditLedgerEntry, Message, Review — including vector columns
- pgvector extension enabled in Postgres

**Acceptance criteria (must all pass before Phase 2):**
- [ ] `docker compose up` starts all 3 services with no errors
- [ ] `npx prisma studio` opens and shows all models with correct columns
- [ ] `npx prisma migrate status` shows no pending migrations
- [ ] Can manually insert a test row into `User` via Prisma Studio
- [ ] `.env*` confirmed in `.gitignore` (visually check the file, don't just trust it)

---

## Phase 2 — Authentication
**Status: in progress / already started**

**Goal:** Real login/signup, protected routes, session available server-side.

**Scope:**
- NextAuth (Auth.js): Credentials provider (bcrypt) + Google OAuth
- JWT session strategy
- Middleware protecting authenticated routes
- Existing `/login` and `/signup` pages wired to real auth calls (not static UI anymore)

**Acceptance criteria:**
- [ ] Can sign up with email/password, row appears in `User` table with hashed password (never plaintext)
- [ ] Can log in with Google OAuth, `User` row created/matched correctly
- [ ] Visiting `/dashboard` while logged out redirects to `/login`
- [ ] Session (`user.id`, `user.email`, `user.name`) accessible in a server component and in an API route — verify with a quick test log
- [ ] Logging out actually clears the session (test by revisiting a protected route after logout)

---

## Phase 3 — Profile & Skills (Teach/Learn)
**Goal:** Users can manage their real profile and skill data; onboarding and settings pages become functional.

**Scope:**
- `profile.update` (bio, timezone, avatar)
- `profile.addTeachSkill` / `edit` / `delete` (skill name, proficiency, description)
- `profile.addLearnGoal` / `edit` / `delete` (skill name, goal text)
- Onboarding flow (already built in frontend) writes real data instead of local state
- Settings page skill management (already built in frontend) becomes functional
- Teacher profile page reads real data for a given user id

**Note:** embedding generation for TeachSkill/Review is NOT part of this 
phase — that happens in Phase 8 (RAG). For now, just persist the data; the 
`embedding` column stays null until Phase 8.

**Acceptance criteria:**
- [ ] Completing onboarding creates real TeachSkill/LearnGoal rows tied to the logged-in user
- [ ] Editing/deleting a skill in Settings updates the database correctly
- [ ] Visiting a teacher's public profile page shows their real teach-skills, not mock data
- [ ] Cannot edit another user's skills (basic ownership check on every mutation)

---

## Phase 4 — Availability & Booking (state machine)
**Goal:** Real booking flow, with the state machine enforced server-side, not just visually.

**Scope:**
- `availability.setSlots` / `getForTeacher` — teacher defines weekly recurring availability + can block specific dates
- `booking.create` — learner books an open slot
  - Must check slot isn't already booked (race-condition safe — use a DB 
    transaction + unique constraint, not just an app-level check)
  - Sets initial status to `REQUESTED`
- `booking.accept` / `booking.decline` — teacher-only actions
- `booking.cancel` — either party, only allowed before session start time
- `booking.complete` — marks session done (can be manual "mark complete" 
  button for now, or auto-complete after end time passes — your call, but 
  document the decision)
- Enforce the state machine transitions exactly as specified:
  `REQUESTED → CONFIRMED → COMPLETED`
  `REQUESTED → DECLINED`
  `CONFIRMED → CANCELLED`
  No other transitions allowed — reject invalid transitions with a clear error.

**Note:** credit ledger writes are NOT part of this phase — booking status 
changes happen here, ledger entries happen in Phase 5. Keep these separate 
so each phase is independently testable.

**Acceptance criteria:**
- [ ] Teacher can set weekly availability, reflected correctly in their public profile calendar
- [ ] Learner can book an open slot; slot becomes unavailable to others immediately
- [ ] Two simultaneous booking attempts on the same slot — only one succeeds, the other gets a clear "slot no longer available" error (test this deliberately, e.g. two browser tabs or a small script firing both at once)
- [ ] Teacher can accept/decline a REQUESTED booking
- [ ] Cannot cancel a booking after its session start time has passed
- [ ] Attempting an invalid state transition (e.g. completing a DECLINED booking) is rejected with a clear error, not a silent failure

---

## Phase 5 — Credit Ledger
**Goal:** The append-only ledger, wired into the booking lifecycle, fully transactional.

**Scope:**
- `SIGNUP_BONUS` entry created on user registration (e.g. +2 credits)
- `booking.create` → also writes a `HOLD` entry (negative, learner) in the 
  same DB transaction as the booking creation
- `booking.cancel` / `booking.decline` → also writes a `RELEASE` entry 
  (positive, learner) reversing the hold, same transaction as the status update
- `booking.complete` → also writes `SETTLE_DEBIT` (learner, finalizes the 
  spend) and `SETTLE_CREDIT` (teacher, adds the earned credit), same 
  transaction as the status update
- `ledger.getBalance` — computed as `SUM(amount)` for a user, never read 
  from a stored/cached balance field
- `ledger.getHistory` — full transaction list for the dashboard

**This is the most important phase to get right — take your time here.**

**Acceptance criteria:**
- [ ] New user signup results in exactly one `SIGNUP_BONUS` ledger entry
- [ ] Booking a session immediately reduces the learner's computed balance by the hold amount
- [ ] Cancelling a CONFIRMED booking restores the learner's balance exactly (hold + release nets to zero)
- [ ] Completing a booking results in the learner's balance being permanently reduced and the teacher's balance permanently increased by the same amount
- [ ] Attempting to book a session when balance is insufficient is rejected before any DB write happens
- [ ] Manually inspect the ledger table after several test bookings — every entry should tell a clear, auditable story of what happened and why (this is your interview demo moment — be able to point at rows and narrate them)
- [ ] Deliberately test a failure mid-transaction (e.g., kill the app process during a booking.complete call if possible, or just reason through the code) and confirm partial writes can't happen — either the whole transaction commits or none of it does

---

## Phase 6 — Real-time Chat
**Goal:** Working chat scoped to a booking, real-time delivery.

**Scope:**
- WebSocket server (Socket.io) for chat, separate from the Next.js request/response cycle
- `chat.sendMessage` / `chat.getHistory`, scoped to a `bookingId`
- Redis pub/sub used for message delivery (even at single-instance scale, 
  build it this way — see the honest note in the blueprint about why)
- Only the two participants of a booking can access its chat thread — enforce server-side, not just hidden in the UI
- Existing session detail page's chat panel wired to real messages

**Acceptance criteria:**
- [ ] Two logged-in users (test in two browser windows/incognito) can exchange messages in real time without refreshing
- [ ] A third user (not part of the booking) cannot access the chat thread via direct API/URL manipulation — test this deliberately
- [ ] Message history persists and loads correctly on page refresh
- [ ] Chat is scoped correctly — messages from Booking A don't leak into Booking B's thread

---

## Phase 7 — Reviews
**Goal:** Real review submission and display, tied to completed bookings.

**Scope:**
- `review.create` — only allowed once per booking, only after status is COMPLETED, only by the learner (or both parties — decide and document)
- Aggregate rating calculation for a teacher's profile (average of all their received reviews)
- Existing ReviewModal and /dashboard/reviews page wired to real data

**Acceptance criteria:**
- [ ] Can only review a session after it's marked COMPLETED
- [ ] Cannot submit a second review for the same booking
- [ ] Teacher's profile page shows correct aggregate rating and real review list
- [ ] `/dashboard/reviews` correctly lists only completed-but-unreviewed sessions

---

## Phase 8 — Semantic Search (RAG)
**Goal:** The actual RAG feature — semantic teacher matching from free-text learner goals.

**Scope:**
- Embedding generation job (BullMQ worker, triggered on TeachSkill create/edit and on Review create) — embeds `TeachSkill.description` and `Review.comment` using an embeddings API
- `search.semantic` endpoint: embeds the learner's free-text query, runs pgvector cosine similarity search against both TeachSkill and Review embeddings, combines/re-ranks (per the weighting approach in the blueprint), returns ranked teachers
- Each result includes a short generated "why this match" reason (this feeds the MatchConfidence component already built in the frontend — wire the real score into it)
- Redis cache for repeated identical queries
- Existing Discover page's semantic search bar wired to this real endpoint

**Acceptance criteria:**
- [ ] Editing a TeachSkill triggers an embedding job (check Redis queue / job logs), and the embedding column populates shortly after
- [ ] A semantic query with no exact keyword overlap (e.g. "explain DSA clearly in interviews") returns a relevant teacher whose description doesn't contain those exact words — this is the core proof the feature works
- [ ] MatchConfidence indicator on Discover cards shows a real score, not a placeholder
- [ ] Identical repeated queries hit the Redis cache (verify via logs/timing — second call should be noticeably faster)
- [ ] Search still works reasonably (e.g. degrades to keyword/tag search or a clear empty state) if there are very few teachers in the database — don't let it silently fail on sparse data

---

## Phase 9 — Notifications & Dashboard Integration
**Goal:** Tie everything together — SSE-based real-time status notifications, and the dashboard reflects fully real data end-to-end.

**Scope:**
- SSE endpoint pushing booking status change notifications (request received, accepted, declined, cancelled)
- Toast system (already built in frontend) fires on these real events, not just manual test triggers
- Dashboard's upcoming sessions, credit balance/history, and reviews sections all reading fully real data
- Empty states (already built) verified against real "zero data" scenarios, not just mock empty states

**Acceptance criteria:**
- [ ] Accepting a booking as a teacher triggers a real-time toast/notification for the learner without them refreshing
- [ ] Dashboard accurately reflects the database at all times — deliberately create/cancel/complete a few bookings and confirm every number on the dashboard matches what's actually in the DB
- [ ] Brand-new test user with zero activity sees correct empty states everywhere, not broken/crashing pages

---

## Phase 10 — Seed Data, Testing & Deploy
**Goal:** A demoable, deployed app with realistic data.

**Scope:**
- Seed script: ~15-20 realistic fake users, varied skills/goals, some completed booking histories with reviews (so the app doesn't look empty during a demo)
- Basic smoke test pass through every phase's acceptance criteria, end-to-end, as one real user story (sign up → onboard → search → book → chat → complete → review)
- Deploy: Vercel (app) + a hosted Postgres/Redis provider (Railway/Render/Neon), or fully Dockerized on a small VM if you prefer that story for interviews
- README with architecture overview, setup instructions, and a link to the live demo

**Acceptance criteria:**
- [ ] Seed script runs cleanly on a fresh database
- [ ] Full user story (listed above) works end-to-end without errors on the deployed version, not just localhost
- [ ] README is something you'd be comfortable linking directly in a resume

---

## How We'll Work Through This
For each phase: I'll give you a focused prompt scoped to exactly that phase 
(referencing this doc so you don't need it re-explained). You implement, 
report back what you did against that phase's acceptance criteria, and we 
verify together before moving on. If something breaks, we fix it within the 
same phase before advancing — we do not move to the next phase with known 
failures carried over.