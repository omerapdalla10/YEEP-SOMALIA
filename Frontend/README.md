# YEEP Somalia Website

Frontend for **YEEP Somalia — Youth Engagement and Empowerment Programme** — a youth-led
NGO in Mogadishu advancing Youth, Peace and Security (YPS), youth leadership, civic
engagement, and community resilience across Somalia. A marketing and community site
with public pages, authentication, and user/admin dashboards.

Built with **React 19**, **Vite**, **React Router**, **Tailwind CSS v4**, `lucide-react`
icons and `recharts`. All page content comes from the **Backend API** — there is no
mock data.

## Getting started

```bash
pnpm install
cp .env.example .env        # set VITE_API_URL if the API isn't on :5000
pnpm dev
```

The dev server runs on `http://localhost:5173`. It expects the API from `../Backend`
to be running (default `http://localhost:5000/api`, configurable via `VITE_API_URL`).

## Scripts

| Command        | Description                        |
| -------------- | --------------------------------- |
| `pnpm dev`     | Start the Vite dev server          |
| `pnpm build`   | Production build to `dist/`        |
| `pnpm preview` | Preview the production build       |
| `pnpm format`  | Format the codebase with `oxfmt`   |

## Architecture

```
src/
  lib/
    api.ts        fetch wrapper — base URL, bearer token, error handling
    hooks.ts      useCollection() / useResource() data-fetching hooks
    types.ts      shared API response types
    img.ts        resolves image refs (Unsplash id or URL)
    format.ts     date / number formatting helpers
  context/
    AuthContext.tsx   user + JWT (localStorage), login / register / logout
  components/
    ProtectedRoute.tsx   route guard (auth + role)
    DataStates.tsx       Loading / Error / Empty / QueryBoundary
    Layout, Navbar, Footer
  pages/          one component per route, each fetching its own data
```

Auth: `POST /auth/login` → `{ user, token }`. The token is stored in `localStorage`
(`yeep_token`) and attached to every request. `/dashboard` requires a session;
`/admin` additionally requires `role: 'admin'`.

**Google sign-in** (redirect flow): `GoogleButton` links to `GET <API>/auth/google`
(a full-page navigation, not a SPA route). After Google, the API redirects back to
`/auth/callback#token=<jwt>`, handled by `AuthCallbackPage` → `loginWithToken()` →
`/auth/me` → forward to the dashboard (or the route the user came from, remembered in
`sessionStorage`). Failures land on `/login?error=<message>`. `GoogleSignInPrompt`
(mounted in `App.tsx`) shows the same button in an auto modal to signed-out visitors.
Requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` set on the Backend.

Static marketing copy (hero headlines, mission/vision, section titles, core values)
lives in the components by design. Everything list-shaped — programs, projects, events,
news, gallery, team, timeline, testimonials, partners, volunteer roles, applications,
messages, users, dashboard stats — is fetched from the API.
