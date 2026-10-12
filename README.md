# YEEP Somalia website

Next.js 16 app with MongoDB Atlas. Production target: Hostinger Node.js hosting, served at **https://yeepsomalia.so** (domain registered at Sostec).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3000
```

Do not run `npm run seed` against the production database. It is only for a brand-new empty database.

---

# Deploy to yeepsomalia.so (step by step)

You need: the GitHub repo, a Hostinger plan with **Node.js Apps**, a MongoDB Atlas cluster, and access to your Sostec account.

## Part 1. Check the code is on GitHub

1. Repo: `https://github.com/omerapdalla10/YEEP-SOMALIA`
2. Branch to deploy: `migration/nextjs` (or `main` once you merge it).
3. The repo should be **private**. Secrets are never in Git (`.env.local` is ignored).

## Part 2. MongoDB Atlas

1. Log in at https://cloud.mongodb.com.
2. **Network Access** → **Add IP Address**.
   - Best: add the Hostinger server's outgoing IP.
   - If you cannot find it, add `0.0.0.0/0`. With a strong password this is acceptable.
3. **Database Access**: confirm your user has "Read and write to any database". Change the password if it was ever shared in chat or email.
4. Copy the connection string and keep the database name:

   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/yeep_ngo?retryWrites=true&w=majority
   ```

   If the password has special characters (`@ : / # ?`), URL-encode them.

## Part 3. ImageKit (image uploads)

1. Log in at https://imagekit.io → **Developer options**.
2. Copy the Public key, Private key, and URL endpoint.
3. Without these, uploaded images are stored inside MongoDB and will fill the free 512 MB.

## Part 4. Create the app on Hostinger

1. Log in to **hPanel**.
2. **Websites → Add website → Node.js Apps**.
3. Choose **Import Git Repository** and connect GitHub. Select `YEEP-SOMALIA` and the branch.
4. Settings:
   - Framework: **Next.js**
   - Node version: **20 or 22**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Do not set a port. Hostinger provides `PORT`.
5. Add the **environment variables** below, then save.

| Variable | Value |
|---|---|
| `MONGODB_URI` | Atlas string from Part 2 |
| `JWT_SECRET` | long random string (e.g. `openssl rand -base64 48`) |
| `JWT_EXPIRES_IN` | `7d` |
| `APP_URL` | `https://yeepsomalia.so` |
| `IMAGEKIT_PUBLIC_KEY` | from Part 3 |
| `IMAGEKIT_PRIVATE_KEY` | from Part 3 |
| `IMAGEKIT_URL_ENDPOINT` | from Part 3 |
| `CRON_SECRET` | long random string (used in Part 7) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `252611676253` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | optional, needed only for emails |

`NEXT_PUBLIC_*` values are baked in at build time. Set them before the first build.

6. Click **Deploy**. Wait for the build to finish. Hostinger gives a temporary URL. Open it and check the site loads with data.

## Part 5. Point yeepsomalia.so to Hostinger

The domain is at Sostec, so the change is made there. Pick **one** method.

### Method A: change nameservers (simplest)

1. In hPanel, open **Domains → Add domain / connect existing domain**, enter `yeepsomalia.so`. Hostinger shows its nameservers (for example `ns1.dns-parking.com` and `ns2.dns-parking.com`). Copy exactly what hPanel shows.
2. Log in to Sostec → your domain → **Nameservers / DNS management**.
3. Replace the existing nameservers with the Hostinger ones and save.
4. If the domain has email (MX records) at Sostec, recreate those records in Hostinger's DNS zone first, or the email will stop.

### Method B: keep Sostec DNS, add records (if you use Sostec email)

1. In hPanel, find the server **IP address** for your app (Node.js app / Hosting details).
2. In Sostec DNS, set:
   - **A record**: host `@` → the Hostinger IP
   - **CNAME record**: host `www` → `yeepsomalia.so`
3. Remove any old A or AAAA records for `@` and `www` that point elsewhere.

### Then, in hPanel

1. Open your Node.js app → **Domains** and attach `yeepsomalia.so` (and `www`).
2. Turn on **SSL** (free Let's Encrypt). The site sends HSTS headers, so HTTPS must work.

DNS can take from 15 minutes up to 24 hours. Check with https://dnschecker.org (search `yeepsomalia.so`).

## Part 6. Test the live site

Open https://yeepsomalia.so and check:

- [ ] Home, articles, events, team and projects show your data
- [ ] Admin login works (use your existing admin account)
- [ ] Contact form submits
- [ ] Event RSVP works
- [ ] Image upload works in admin
- [ ] `/robots.txt` and `/sitemap.xml` show `yeepsomalia.so` links
- [ ] Padlock (HTTPS) appears, and `www` redirects correctly

If pages show errors but the layout loads, it is nearly always Atlas Network Access (Part 2 step 2) or a wrong `MONGODB_URI`.

## Part 7. Daily event-reminder cron

In hPanel → **Advanced → Cron Jobs**, add a job that runs daily at 08:00:

```
curl -s "https://yeepsomalia.so/api/cron/event-reminders?key=YOUR_CRON_SECRET"
```

Use the same value as `CRON_SECRET` from Part 4.

## Part 8. Updating the site later

1. Push changes to the deployed branch on GitHub.
2. In hPanel → your Node.js app → **Redeploy** (or enable auto-deploy).
3. Never run the seed script on production.

## Backups

Atlas free (M0) has no automatic backup. Periodically run:

```bash
mongodump --uri="<your Atlas URI>" --out=./backup
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| Build fails | Wrong Node version, or a missing env var at build time |
| Site loads, data pages error | Atlas IP not allowed, or bad `MONGODB_URI` |
| Domain shows old/parked page | DNS not propagated yet, or old A record still present |
| "Not secure" warning | SSL not enabled yet in hPanel |
| Images upload but disappear or bloat DB | ImageKit keys not set |
| No emails sent | `SMTP_*` blank (this is silent by design) |
