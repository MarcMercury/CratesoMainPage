# CratesoMainPage
The Main Marketing Page for all Crateso Products

## Hosting & security

- Production (`www.crateso.com`) is served by **GitHub Pages** from `main`. GitHub Pages
  cannot send custom HTTP headers, so each page carries its Content-Security-Policy and
  Referrer-Policy as `<meta>` tags. `vercel.json` defines the full header set for Vercel deployments.
- All JavaScript lives in external files (`js/`, plus per-page `main.js`); inline scripts
  and `on*=""` handlers are blocked by the CSP.
- See [SECURITY.md](SECURITY.md) for contributor rules and vulnerability reporting.
