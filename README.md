# NetworkUp Content Assistant — Backend

Backend + response handler for the Content Creation → Angle Generation → Hook
Generation → Content Generation pipeline. API only, no frontend.

## Setup
```bash
npm install
cp .env.example .env   # fill in MONGO_URI and GEMINI_API_KEY
npm run dev            # or: npm start
npm test                # runs tests/smoke.js (no DB/API key required)
```
The server boots on `PORT` (default 4000) even without Mongo/Gemini
configured — DB- and AI-dependent routes will return a clear error until
those are set, instead of hanging or crashing the process.

**AI provider:** Google Gemini, via `@google/genai`'s Interactions API
(`ai.interactions.create`). Angles, hooks, and post content are all
generated with a JSON schema passed through `response_format`, so Gemini
returns schema-conformant JSON directly rather than relying on prompt
instructions alone.

## Auth (placeholder)
No real auth yet. Every request needs an `x-user-id` header. Swap
`src/middleware/auth.middleware.js` for real JWT/session auth later —
every service already scopes by `userId`, so nothing downstream changes.

## Endpoints built

| Method | Path | Module | Does |
|---|---|---|---|
| GET | `/api/v1/health` | — | Liveness check (no auth) |
| GET | `/api/v1/content` | 7. Content Library | List drafts, paginated, optional `?status=` filter |
| POST | `/api/v1/content/draft` | 1. Content Creation | Validates form inputs, creates a draft |
| GET | `/api/v1/content/:id` | — | Fetch a draft |
| POST | `/api/v1/content/:id/angles` | 2. Angle Generation | AI generates 5 angles — does not write the post |
| PATCH | `/api/v1/content/:id/angles/select` | 2. Angle Generation | Lock in one angle |
| POST | `/api/v1/content/:id/hooks` | 3. Hook Generation | AI generates 4 hooks (curiosity/contrarian/story/question) |
| PATCH | `/api/v1/content/:id/hooks/select` | 3. Hook Generation | Lock in one hook |
| POST | `/api/v1/content/:id/generate` | 4. Content Generation | AI writes the structured post (Hook→Problem→Experience→Insight→Takeaway→CTA) |
| POST | `/api/v1/content/:id/improve` | 6. Improve Content | Targeted edit — one of 12 actions (shorten, improve hook, turn into story, etc.), never a full regenerate |
| PATCH | `/api/v1/content/:id/archive` | 7. Content Library | Archive a draft |
| DELETE | `/api/v1/content/:id` | 7. Content Library | Delete a draft (and its hooks) |
| GET | `/api/v1/hooks` | 7. Content Library | List hooks across all your content, paginated |
| GET | `/api/v1/lead-magnets` | 8. Lead Magnet | List generated lead magnets, paginated |
| POST | `/api/v1/lead-magnets` | 8. Lead Magnet | Single-shot: form in, full package out (title/outline/landing copy/3-email sequence/promo post/CTA) |
| GET | `/api/v1/lead-magnets/:id` | 8. Lead Magnet | Fetch one |
| GET | `/api/v1/schedule` | Schedule | List scheduled posts |
| POST | `/api/v1/schedule` | Schedule | Schedule a generated post (record-keeping only — see note below) |
| DELETE | `/api/v1/schedule/:id` | Schedule | Cancel a scheduled post |

Pipeline is gated end to end: hooks can't be generated without a selected
angle, content can't be generated without a selected angle *and* hook, and
Improve actions require content to already be generated.

**Scheduling note:** this only records *when* a post is meant to go out — no
worker actually publishes to LinkedIn. Real publishing needs LinkedIn OAuth
+ API integration, which is a separate, unscoped piece of work.

## Response shape
Every response — success or error — comes back through
`src/utils/responseHandler.js`:
```json
{
  "success": true,
  "data": { "...": "..." },
  "meta": { "requestId": "...", "timestamp": "...", "durationMs": 812 },
  "error": null
}
```

## Example flow
```bash
# 1. Create a draft
curl -X POST localhost:4000/api/v1/content/draft \
  -H "x-user-id: u1" -H "Content-Type: application/json" \
  -d '{"contentGoal":"Educate","postType":"Case Study","topic":"AI Prospecting","audience":"Founders","experienceNotes":"We tested AI Prospecting across 1000 leads. Personalized messaging generated 2.3x more replies.","tone":"Founder Style","cta":"Ask Question"}'
# → returns { data: { _id: "..." } }

# 2. Generate angles for that draft
curl -X POST localhost:4000/api/v1/content/<id>/angles -H "x-user-id: u1"

# 3. Select one
curl -X PATCH localhost:4000/api/v1/content/<id>/angles/select \
  -H "x-user-id: u1" -H "Content-Type: application/json" -d '{"angleId":"<angleId>"}'

# 4. Generate hooks, then select one (same pattern as angles)
# 5. Generate the post
curl -X POST localhost:4000/api/v1/content/<id>/generate -H "x-user-id: u1"
```

## Not built yet
Module 5 (AI Quality Check) is scoped out separately — see
`module-5-handoff.md`. Modules 9-11 (Personal Memory, RAG, Analytics) and
Templates/Content Calendar are Phase 3/4 — not started. Folders are
scaffolded under `src/modules/` so they slot in without restructuring.
