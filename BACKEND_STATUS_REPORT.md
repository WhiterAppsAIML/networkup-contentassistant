# NetworkUp Content Assistant — Backend Status Report

> **For: New Developer Onboarding**  
> **Date:** August 2026  
> **Stack:** NestJS + MySQL (Prisma) + Qdrant (Vector DB) + Gemini AI

---

## 📍 Where We Are

The backend has been **fully migrated** from Express + MongoDB to **NestJS + MySQL + Qdrant**. All core content-pipeline modules (Phases 1–2) and RAG (Phase 3 Module 10) are built, tested, and compiling.

> **What "done" means:** Code compiles, types are correct, endpoints exist, and the database schema matches. You can run it locally with `docker-compose up -d && npm run start:dev` after filling in `.env`.

---

## ✅ What's Working (The "Green" List)

| Area | Module | What It Does |
|------|--------|--------------|
| **Auth** | JWT Register/Login/Me/Refresh | Secure auth with tier-based rate limiting (FREE/PRO/ENTERPRISE) |
| **Content Pipeline** | Module 1: Create Draft | Save topic, audience, experience notes, tone, CTA |
| | Module 2: Angles | Generate 5 distinct angles (mistake, surprise, framework, contrarian, lessons) |
| | Module 3: Hooks | Generate 4 hooks (curiosity, contrarian, story, question) |
| | Module 4: Generate | Write full post (hook → problem → experience → insight → takeaway → CTA) |
| | **Module 5: Quality Check** | **NEW** — Score 7 dimensions (0–10), flag weak areas, return overall score |
| | Module 6: Improve | Apply edits (shorten, expand, change tone, add story, etc.) |
| | Module 7: Save/Archive | Draft persistence, library listing, status filtering |
| **Lead Magnets** | Module 8 | One-shot generation: title, outline, landing page, emails, promo post, CTA |
| **Library** | Module 7b | List content + hooks with pagination, filters, archive/delete |
| **Scheduling** | — | Record intent to publish (date-range filter), cancel — **no actual publishing** |
| **Templates** | Frameworks CRUD | Create/list/update/delete reusable post structures |
| **CTAs** | CTA Library CRUD | Save reusable call-to-action lines |
| **RAG** | Module 10 | Ingest docs (PDF/txt/URL), chunk, embed (Gemini), vector search (Qdrant) |
| **Infra** | — | Docker Compose (MySQL, Qdrant, Redis), Prisma migrations, Swagger-ready |

---

## ❌ What's NOT Done (The "Red" List)

### 1. **LinkedIn Publishing (The Big Missing Piece)**
**What it is:** Actually posting to LinkedIn on the user's behalf.  
**Why it's missing:** Requires OAuth 2.0 flow, LinkedIn API approval, token refresh, retry logic, media upload, and failure handling. It's a **separate mini-project**, not a quick add-on.  
**Current state:** Scheduling only *records intent* (`status: SCHEDULED`). Nothing hits LinkedIn.

> **If you need this next:** Start with LinkedIn Developer App → OAuth scope `w_member_social` → build a worker that polls `ScheduledPost` → call LinkedIn's `/posts` API → handle 429/5xx retries → update status to `POSTED`/`FAILED`.

---

### 2. **Module 9 — Personal Memory**
**What it is:** Learn each user's writing style (preferred hooks, tone, topics) from their *actual published posts*.  
**Why it's blocked:** Needs **real published posts with engagement data** to train on. Zero history = zero learning.  
**Prerequisite:** LinkedIn Publishing + Analytics (Module 11) must be live for weeks/months first.

---

### 3. **Module 11 — Analytics Engine**
**What it is:** Track impressions, likes, comments, shares, CTR per post; show trends; feed data back to Personal Memory.  
**Why it's blocked:** Needs **real LinkedIn engagement data** via LinkedIn's Analytics API. Can't exist until Publishing works.

---

### 4. **Frontend / Dashboard**
**What it is:** React/Vue/Next.js app for users to actually *use* the API.  
**Status:** Explicitly **out of scope** for this backend build.  
**Current test:** Swagger UI at `/api` (when running) or curl/Postman.

---

### 5. **Real Auth Polish**
**What's there:** JWT register/login, tier guards, rate limiting.  
**What's missing:** Email verification, password reset, social login (Google/GitHub), session revocation, audit logs.  
**Effort:** ~1 week to harden.

---

### 6. **Production Hardening**
| Item | Status | Notes |
|------|--------|-------|
| Redis-backed rate limiting | ❌ | In-memory only (resets on restart) |
| Structured logging (JSON) | ❌ | Console only |
| Health checks / readiness | ❌ | Basic `/api/health` exists |
| CI/CD pipeline | ❌ | GitHub Actions not configured |
| Secrets management | ❌ | `.env` only (no Vault/SealedSecrets) |
| Load testing | ❌ | No k6/Artillery scripts |
| DB backup/restore | ❌ | Manual only |

---

### 7. **Module 5 Integration Polish**
**What's done:** Quality Check runs, stores scores, returns results.  
**What's missing:**
- Auto-trigger Quality Check after `generateContent` (optional, config-driven)
- "Fix weak dimensions" button that calls Improve with targeted actions
- Quality history / trend per user
- Threshold configuration per tier (FREE: 6, PRO: 7, ENTERPRISE: 8)

---

## 🧭 Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                     NestJS App (Port 4000)                   │
├─────────────────────────────────────────────────────────────┤
│  AuthModule  │  ContentModule  │  LeadMagnetModule  │ ...   │
│  (JWT)       │  (Pipeline 1-7) │  (Module 8)        │       │
├─────────────────────────────────────────────────────────────┤
│  Prisma (MySQL)          │  Qdrant (Vectors)  │  Gemini AI  │
│  - Users, Content,       │  - RAG chunks      │  - Generate │
│    Hooks, Schedules,     │  - 768-dim, cosine │  - Embed    │
│    Frameworks, CTAs,     │  - Filter by user  │  - JSON out │
│    LeadMagnets, RagDoc   │                    │             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (MySQL via Prisma)

Key models you'll touch:
- **User** — email, passwordHash, tier (FREE/PRO/ENTERPRISE)
- **Content** — the pipeline state machine (draft → angles → hooks → generated → improved → published)
- **ContentAngle** — 5 angles per content
- **Hook** — 4 hooks per angle, reusable in library
- **ContentGenerated** — the 7 post sections (hook, problem, experience, insight, takeaway, cta, fullText)
- **ContentImprovement** — audit trail of every improve action
- **LeadMagnet** — full asset pack (outline, emails, landing page, promo)
- **Framework** — user-defined templates (name, structure[], description)
- **CTA** — reusable call-to-action lines
- **ScheduledPost** — intent to publish (contentId, scheduledFor, status)
- **RagDocument** — metadata for vector chunks (actual vectors live in Qdrant)

> **Run `npx prisma studio`** to explore visually.

---

## 🔑 Environment Variables (`.env`)

```bash
# Database (MySQL)
DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=5"

# JWT
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN="7d"

# Gemini AI
GEMINI_API_KEY="your-gemini-key"
GEMINI_MODEL="gemini-3.7-flash"

# Qdrant Vector DB
QDRANT_URL="http://localhost:6333"
QDRANT_API_KEY=""  # optional for local

# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN="*"
```

---

## 🚀 Quick Start (Local Dev)

```bash
# 1. Clone & enter
cd nestjs-api

# 2. Install deps
npm install

# 3. Start infra (MySQL, Qdrant, Redis)
docker-compose up -d

# 4. Run migrations (creates tables)
npx prisma migrate dev

# 5. Start dev server (hot reload)
npm run start:dev

# 6. Open Swagger UI
# http://localhost:4000/api
```

---

## 📂 Folder Structure (What You'll Edit)

```
nestjs-api/
├── prisma/
│   └── schema.prisma          # ← DB schema (run migrate after changes)
├── src/
│   ├── main.ts                # Bootstrap, global pipes/filters
│   ├── app.module.ts          # Root module (register all modules here)
│   ├── auth/                  # JWT, guards, strategies
│   ├── user/                  # Profile, usage stats, tier upgrade
│   ├── content/               # Pipeline Modules 1-4, 6, 7
│   ├── quality-check/         # Module 5 (NEW)
│   ├── lead-magnet/           # Module 8
│   ├── library/               # Content + Hooks listing
│   ├── schedule/              # Scheduling + date-range
│   ├── framework/             # Template CRUD
│   ├── cta/                   # CTA library
│   ├── rag/                   # Module 10 (ingest + search)
│   ├── ai/                    # GeminiService, EmbeddingService, Prompts
│   ├── vector/                # QdrantClient wrapper
│   ├── prisma/                # PrismaService (DI singleton)
│   └── common/                # Guards, decorators, filters, interceptors
├── docker-compose.yml         # Local infra
├── .env.example               # Template
└── package.json               # Scripts: build, start, prisma, docker
```

---

## 🛠️ Common Tasks You'll Do

| Task | Command / File |
|------|----------------|
| Add a DB field | Edit `prisma/schema.prisma` → `npx prisma migrate dev` |
| Add an endpoint | Create `controller.ts` + `service.ts` + `dto.ts` in module folder |
| Change AI prompt | Edit `src/ai/quality-check-prompt.service.ts` (or other prompt services) |
| Add a guard | `src/common/guards/` → register in `app.module.ts` providers |
| Test API | Swagger at `/api` or `npm run test` |
| Debug DB | `npx prisma studio` |

---

## 🎯 Suggested Next Steps (Priority Order)

1. **LinkedIn Publishing** — If product needs "post for me" (2–3 weeks)
2. **Redis rate limiting + structured logging** — Production readiness (3–5 days)
3. **CI/CD + secrets** — Deploy automation (2–3 days)
4. **Module 5 polish** — Auto-trigger, targeted improve, history (1 week)
5. **Frontend** — Separate repo, consume this API (ongoing)

---

## 💬 TL;DR for Your First Week

1. **Run it locally** — `docker-compose up -d && npx prisma migrate dev && npm run start:dev`
2. **Hit `/api`** — Explore Swagger, try `POST /api/auth/register` → `POST /api/content` → `POST /api/content/:id/angles` → ... → `POST /api/content/:id/quality-check`
3. **Read `src/content/content.service.ts`** — It's the pipeline orchestrator; understand the status flow
4. **Check `src/ai/quality-check-prompt.service.ts`** — See how the 7 dimensions are scored
5. **Ask questions** — The code is typed; let TypeScript guide you

---

**Welcome to the team!** 🎉  
The hard migration work is done. Now we build features on a solid foundation.