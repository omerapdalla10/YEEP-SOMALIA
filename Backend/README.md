# YEEP Somalia API

REST API for the YEEP Somalia website — **Express + MongoDB (Mongoose) + TypeScript**.

YEEP Somalia (Youth Engagement and Empowerment Programme) is a youth-led NGO in
Mogadishu advancing Youth, Peace and Security (YPS), youth leadership, civic
engagement, and community resilience across Somalia.

## Requirements

- Node.js 20+
- MongoDB — either Docker (`docker compose up -d` starts one on `:27017`) or a
  connection string in `.env` (MongoDB Atlas works)

## Setup

```bash
cd Backend
npm install
cp .env.example .env      # then edit values
docker compose up -d      # start MongoDB (skip if you use Atlas)
npm run seed              # site content + 1 admin account (only if DB is empty)
npm run dev               # http://localhost:5000
```

## Scripts

| Command           | Description                              |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start with hot reload (`tsx watch`)      |
| `npm run build`   | Compile TypeScript to `dist/`            |
| `npm start`       | Run the compiled server                  |
| `npm run seed`    | Seed site content + 1 admin — **skips if any users exist** |
| `npm run seed -- --force` | Wipe **all** collections and reseed (destructive) |
| `npm run typecheck` | Type-check without emitting             |

## Auth

JWT bearer tokens. `POST /api/auth/register` and `/api/auth/login` return `{ user, token }`.
Send the token as `Authorization: Bearer <token>` on protected routes.

### Google sign-in (OAuth redirect flow)

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) create
   an **OAuth 2.0 Client ID** (type *Web application*).
   - Authorised redirect URI: `http://localhost:5000/api/auth/google/callback`
     (must match `GOOGLE_CALLBACK_URL`).
2. Put the credentials in `.env`:

   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   OAUTH_SUCCESS_REDIRECT=http://localhost:5173/auth/callback
   ```

   Google sign-in stays disabled (the endpoint returns *"not configured"*) until
   both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

Flow: `GET /api/auth/google` sets a signed, httpOnly `state` cookie and redirects to
Google → Google redirects to `GET /api/auth/google/callback` → the API verifies
`state`, exchanges the code, finds-or-creates the user (linking an existing account
that shares the email), signs a JWT, and redirects the browser to
`OAUTH_SUCCESS_REDIRECT#token=<jwt>`. On any failure it redirects to
`<CLIENT_URL>/login?error=<message>`.

New Google accounts are created with `authProvider: "google"` and no password, and
default to the `volunteer` role.

### Roles (`src/config/roles.ts`)

Three ranked roles — `volunteer` < `staff` < `admin`. A higher rank inherits every
lower-rank permission (`authorize('staff')` also lets an `admin` through).

| Role        | Can do | Cannot |
| ----------- | ------ | ------ |
| `volunteer` | Own profile + applications, read public content. Default for sign-ups. | Any management |
| `staff`     | Full CRUD on programs, projects, events, news, gallery, team, milestones, testimonials, partners; review volunteer applications; contact inbox; newsletter list; admin dashboard. | User accounts, system settings |
| `admin`     | Everything, including create / edit / delete user accounts and change roles. | — |

Guards: `requireStaff` (staff + admin), `requireAdmin` (admin only). Public sign-up
(`/auth/register`) always creates a `volunteer`; only an admin creates other accounts
via `POST /api/users`. The seeder creates **one** account — `admin@yeep.org.so` /
`Admin@12345` (from `SEED_ADMIN_*` in `.env`). Every other user is a real sign-up;
create staff/volunteers from the admin dashboard.

## Endpoints

Base path: `/api`

| Method | Path | Access |
| ------ | ---- | ------ |
| GET | `/health` | public |
| POST | `/auth/register` · `/auth/login` | public |
| GET | `/auth/google` · `/auth/google/callback` | public (OAuth redirect) |
| GET/PATCH | `/auth/me` | auth |
| POST | `/auth/change-password` | auth |

`PATCH /auth/me` accepts `name`, `phone`, and `avatar` (an image URL or an inline
`data:image/...` URL — the frontend resizes uploads to a 256px JPEG before sending).
| GET | `/stats` | public |
| GET | `/programs` · `/projects` · `/events` · `/news` · `/gallery` | public |
| GET | `/team` · `/milestones` · `/testimonials` · `/partners` · `/volunteer-roles` | public |
| GET | `/programs/:id` (etc.) | public |
| POST/PATCH/DELETE | all the collections above | staff |
| POST | `/newsletter` | public |
| GET/DELETE | `/newsletter` · `/newsletter/:id` | staff |
| POST | `/volunteers/apply` | public / auth |
| GET | `/volunteers/me` | auth |
| GET | `/volunteers` · `/volunteers/:id` | staff |
| PATCH | `/volunteers/:id/status` | staff |
| DELETE | `/volunteers/:id` | staff |
| POST | `/contact` | public |
| GET | `/contact` · `/contact/:id` | staff |
| PATCH | `/contact/:id/status` | staff |
| DELETE | `/contact/:id` | staff |
| GET | `/users` · `/users/:id` | admin |
| POST | `/users` (create account, choose role) | admin |
| PATCH/DELETE | `/users/:id` (change role / activate / delete) | admin |
| GET | `/dashboard/admin` | staff |
| GET | `/dashboard/me` | auth |

### List query params

`?page=1&limit=20&sort=-createdAt&search=term` plus per-resource filters
(e.g. `/programs?category=Education&status=Active`).

### Response shape

```jsonc
// success
{ "success": true, "data": ... , "pagination": { "page": 1, "limit": 20, "total": 6, "pages": 1 } }
// error
{ "success": false, "message": "…", "details": ... }
```

## Project structure

```
src/
  server.ts          bootstrap (connect DB, listen, graceful shutdown)
  app.ts             express app + global middleware
  config/            env parsing, mongoose connection
  middleware/        auth, optionalAuth, validate, error handling
  models/            Mongoose schemas
  controllers/       auth, user, volunteer, contact, dashboard
  utils/             ApiError, asyncHandler, token, slug, CRUD + resource-router factories
  validators/        Zod request schemas
  routes/            route definitions, mounted in routes/index.ts
  seed/              database seeder
```

Generic resources (programs, projects, events, news, gallery) share the
`resourceRouter` / `crudController` factories in `src/utils`.
