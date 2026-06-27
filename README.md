# WanderLust - MERN

A full MERN-stack rebuild of the original Express + EJS WanderLust app. The backend is now a
JSON REST API and the frontend is a React (Vite) single-page app. They share the same MongoDB
data concepts and communicate over cookie-based sessions.

```
wanderlust-mern/
  backend/    Express + Mongoose JSON API (session auth via Passport)
  frontend/   React + Vite SPA (React Router, Axios, Context API)
```

## Prerequisites
- Node.js 18+
- A MongoDB database (local or Atlas)
- Cloudinary account (image uploads)
- OpenAI API key (chat assistant)

## 1. Backend

```bash
cd backend
cp .env.example .env      # fill in real values
npm install
npm run seed              # optional: seed sample listings (creates a seed-owner user)
npm run dev               # starts on http://localhost:8080
```

The server validates every required env var at boot and refuses to start if any is missing
(`SECRET`, `ATLASDB_URL`, `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`, `OPENAI_API_KEY`).

### API overview
All routes return JSON and are prefixed with `/api`.

| Group | Route |
|---|---|
| Auth | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Listings | `GET /api/listings` (`?category=`, `?query=`), `GET /api/listings/:id`, `POST /api/listings`, `PUT /api/listings/:id`, `DELETE /api/listings/:id` |
| Reviews | `POST /api/listings/:listingId/reviews`, `DELETE /api/listings/:listingId/reviews/:reviewId` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/:id`, `PATCH /api/bookings/:id/confirm`, `DELETE /api/bookings/:id` |
| Chat | `GET /api/chat/history`, `POST /api/chat`, `POST /api/chat/clear` |

## 2. Frontend

```bash
cd frontend
cp .env.example .env      # set VITE_API_BASE_URL=http://localhost:8080/api
npm install
npm run dev               # starts on http://localhost:5173
```

Make sure the backend `CLIENT_URL` matches the frontend origin (`http://localhost:5173`) so
CORS + session cookies work.

## Auth model
Cookie-based sessions (Passport local strategy + connect-mongo), **not** JWT. The frontend sends
`withCredentials: true` on every request and calls `GET /api/auth/me` on load to restore state.
No tokens are ever stored in `localStorage`.

## Bugs fixed during migration
1. Image-upload crash - validates `req.file` before use, returns 400.
2. Review-on-deleted-listing crash - 404 if listing missing.
3. Unsafe nested access in auth middleware - `owner`/`author` now `required`, middleware is
   defensive and wrapped in `catchAsync`.
4. Insecure session-secret fallback - boot fails loud if any required env var is missing.
5. No rate limiting - `express-rate-limit` on login, signup, and chat.
6. `GET /logout` anti-pattern - logout is `POST` only.
7. Price/undefined crash - `price` is `required`; frontend renders "Price unavailable" defensively.
8. No ObjectId validation - `validateObjectId` middleware on every `:id` route.
9. Flash messages as raw arrays - API returns singular `{ message }` strings; React renders toasts.
10. No password rules - Joi enforces 8-char minimum, surfaced in the signup form.
11. Unused deps - `cors` now actually configured (`credentials: true` + origin allowlist);
    `cookie-parser`/`body-parser` dropped.
12. Dead MapTiler script - not carried over.
13. No `.env` documentation - `.env.example` in both `backend/` and `frontend/`.

## New in this version
- `Booking` model + full booking REST API.
- Multi-step React booking flow (Dates -> Review -> Confirm) with a progress bar.
- "My bookings" page with status badges and cancel.
