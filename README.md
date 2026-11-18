# CratesoMainPage
The Main Marketing Page for all Crateso Products

## Hosting & security

- Production (`www.crateso.com`) is served by **Vercel** (project `crateso-main-page`, auto-deploys
  from `main`); `crateso.com` 308-redirects to `www`. DNS is at GoDaddy (apex `A 76.76.21.21`,
  `www CNAME cname.vercel-dns.com`). Security headers come from `vercel.json`; every page also
  carries CSP/referrer `<meta>` tags as defense in depth. `trailingSlash: true` is required so
  relative asset paths resolve.
- All JavaScript lives in external files (`js/`, plus per-page `main.js`); inline scripts
  and `on*=""` handlers are blocked by the CSP.
- Waitlist forms post to the Vercel serverless function `api/waitlist.js`, which validates input
  and writes to the Supabase table defined in `supabase/migrations/`. It requires the Vercel env
  vars `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (production only, server-side, never in client JS).
- The waitlist uses the Crateso Supabase project `wihvzkfolnvxceqccbpc` ("CratesoMainPage"). This site must
  have no connection to any product database (e.g. EmployeeGM). Admin access is via the
  `SUPABASE_ACCESS_TOKEN` Codespaces secret (Supabase Management API).
- `supabase/security-audit.sql` contains read-only queries for auditing RLS and grants.
- CI (`.github/workflows/security.yml`) runs `node scripts/check-html-security.mjs` and gitleaks.
- See [SECURITY.md](SECURITY.md) for contributor rules and vulnerability reporting.
