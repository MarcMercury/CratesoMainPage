# CratesoMainPage
The Main Marketing Page for all Crateso Products

## Hosting & security

- Production (`www.crateso.com`) is served by **GitHub Pages** from `main`. GitHub Pages
  cannot send custom HTTP headers, so each page carries its Content-Security-Policy and
  Referrer-Policy as `<meta>` tags. `vercel.json` defines the full header set for Vercel deployments.
- All JavaScript lives in external files (`js/`, plus per-page `main.js`); inline scripts
  and `on*=""` handlers are blocked by the CSP.
- Waitlist forms post to the Vercel serverless function `api/waitlist.js`, which validates input
  and writes to the Supabase table defined in `supabase/migrations/`. It requires the Vercel env
  vars `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never in client JS).
- The waitlist uses a **dedicated Crateso marketing Supabase project**. This site must have no
  connection to any product database (e.g. EmployeeGM).
- `supabase/security-audit.sql` contains read-only queries for auditing RLS and grants.
- CI (`.github/workflows/security.yml`) runs `node scripts/check-html-security.mjs` and gitleaks.
- See [SECURITY.md](SECURITY.md) for contributor rules and vulnerability reporting.
