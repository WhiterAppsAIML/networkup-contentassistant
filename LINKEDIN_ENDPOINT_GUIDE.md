# LinkedIn Publishing: Direct Endpoint Connection Guide

**You just need to call these endpoints with a Bearer JWT token. Your backend person handles everything else.**

---

## 🔐 Authentication

### How to get your JWT token:
1. Get your Firebase ID token from your Firebase SDK: `user.getIdToken()`
2. Call: `POST /auth/verify-token { idToken }`
3. Receive: `accessToken` (valid for 15 minutes)

### How to use it:
Add this header to **every** API call:
```
Authorization: Bearer <your-15min-jwt-token>
```

---

## 📡 Endpoints to Call

### A. Schedule a Post for Later
```
POST /scheduled-posts
Header: Authorization: Bearer <jwt>
Body JSON:
{
  "contentId": "your-content-uuid-here",
  "scheduledFor": "2026-12-01T09:00:00Z"
}
```
- `contentId`: UUID from your content creation pipeline
- `scheduledFor`: When you want it posted (ISO datetime)

---

### B. View Your Scheduled Posts
```
GET /scheduled-posts
Header: Authorization: Bearer <jwt>
```
- Returns all your scheduled posts with pagination

---

### C. Cancel a Scheduled Post
```
DELETE /scheduled-posts/:id
Header: Authorization: Bearer <jwt>
```
- `:id` = the scheduled post ID
- Changes status to `CANCELLED`

---

### D. Force-Publish a Scheduled Post Now
```
POST /linkedin/post/:id
Header: Authorization: Bearer <jwt>
```
- `:id` = the scheduled post ID
- Immediately publishes to LinkedIn (bypasses scheduler)
- Updates status to `POSTED` or `FAILED`

---

### E. Refresh Your JWT Token (when it expires ~15 min)
```
POST /auth/verify-token
Body JSON: { "idToken": "<your-firebase-id-token>" }
```
- Receive new `accessToken`
- Keep using same workflow

---

## ⚠️ Error Codes to Expect

| Status | Meaning | Action |
|--------|---------|--------|
| `200/201` | Success | Operation done |
| `401` | Token expired/invalid | Call `/auth/verify-token` again |
| `403` | Tier permission denied | Your plan (STARTER/GROWTH/ENTERPRISE) doesn't allow this |
| `404` | Content/post not found | Check IDs |
| `429` | Rate limited | Wait & retry |
| `500` | Backend error | Try again later |

---

## 📋 Your Setup Checklist

| What you need | Provide to your backend team |
|--------------|---------------------------|
| Firebase project with Auth | ✅ Already done |
| Your frontend domain | For CORS whitelisting |
| Content UUIDs | From your content creation flow |
| This guide | Share with anyone integrating |

---

## 🎯 Quick Start Code (JavaScript/TypeScript)

// 1. Get Firebase token
const firebaseToken = await firebaseAuth.currentUser.getIdToken();

// 2. Exchange for backend JWT
const resp = await fetch('https://your-api.com/auth/verify-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken: firebaseToken })
});
const { accessToken } = await resp.json();

// 3. Schedule a post
await fetch('https://your-api.com/scheduled-posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    contentId: "uuid-from-your-content",
    scheduledFor: "2026-12-01T09:00:00Z"
  })
});

---

**That's all you need.** Your backend person sets up LinkedIn OAuth, token encryption, and the actual LinkedIn API calls. You just make these endpoint calls with the JWT header.