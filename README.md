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

## Endpoints built (Days 1–3)

| Method | Path | Module | Does |
|---|---|---|---|
| GET | `/api/v1/health` | — | Liveness check (no auth) |
| POST | `/api/v1/content/draft` | 1. Content Creation | Validates form inputs, creates a draft |
| GET | `/api/v1/content/:id` | — | Fetch a draft |
| POST | `/api/v1/content/:id/angles` | 2. Angle Generation | AI generates 5 angles — does not write the post |
| PATCH | `/api/v1/content/:id/angles/select` | 2. Angle Generation | Lock in one angle |
| POST | `/api/v1/content/:id/hooks` | 3. Hook Generation | AI generates 4 hooks (curiosity/contrarian/story/question) |
| PATCH | `/api/v1/content/:id/hooks/select` | 3. Hook Generation | Lock in one hook |
| POST | `/api/v1/content/:id/generate` | 4. Content Generation | AI writes the structured post (Hook→Problem→Experience→Insight→Takeaway→CTA) |

Pipeline is gated end to end: hooks can't be generated without a selected
angle, and content can't be generated without a selected angle *and* hook.

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

## Not built yet (by design)
Modules 5–11 (Quality Check, Improve, Content Library, Lead Magnet,
Personal Memory, RAG, Analytics) and Schedule. Folders are scaffolded
under `src/modules/` so they slot in without restructuring — see the
vision doc's phase roadmap for build order.
"# networkup-contentassistant" 
