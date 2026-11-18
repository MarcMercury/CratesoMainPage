# Security Policy

## Reporting a vulnerability

Please report security issues privately to **info@crateso.com** (or via GitHub's
"Report a vulnerability" button under the Security tab). Do not open public issues
for security problems. We aim to acknowledge reports within 3 business days.

## Guidelines for contributors

- This is a static site. Never commit secrets, API keys, or `.env` files. Supabase
  `service_role` keys must never appear in client code.
- All JavaScript must live in external `.js` files. Inline `<script>` blocks and
  `on*=""` attributes are blocked by the Content-Security-Policy.
- Every HTML page must include the CSP and referrer `<meta>` tags found in
  `index.html`. If a new third-party origin is required, update the policy in both
  the page meta tags and `vercel.json`.
- Do not persist personal data (names, emails, phone numbers) in `localStorage`
  or cookies.
- External links opened with `target="_blank"` must include `rel="noopener noreferrer"`.
