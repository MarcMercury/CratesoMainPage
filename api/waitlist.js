// POST /api/waitlist — stores a waitlist signup in Supabase.
// Required env vars (server-side only): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const PRODUCTS = new Set(['nycdeli', 'hottiesthathit', 'petpodcast', 'clo']);
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/;

function sameOrigin(req) {
    const origin = req.headers.origin;
    if (!origin) return false;
    try {
        return new URL(origin).host === req.headers.host;
    } catch {
        return false;
    }
}

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }
    if (!sameOrigin(req)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (!(req.headers['content-type'] || '').startsWith('application/json')) {
        return res.status(415).json({ error: 'Unsupported media type' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};

    // Honeypot: bots fill hidden fields; pretend success so they don't retry.
    if (body.website) {
        return res.status(200).json({ ok: true });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const product = typeof body.product === 'string' ? body.product : '';

    if (email.length > 254 || !EMAIL_RE.test(email) || !PRODUCTS.has(product)) {
        return res.status(400).json({ error: 'Invalid email or product' });
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('waitlist: Supabase env vars are not configured');
        return res.status(503).json({ error: 'Signups are temporarily unavailable' });
    }

    try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups?on_conflict=email,product`, {
            method: 'POST',
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'resolution=ignore-duplicates,return=minimal'
            },
            body: JSON.stringify({ email, product })
        });
        if (!r.ok) {
            console.error('waitlist: Supabase insert failed', r.status, await r.text());
            return res.status(502).json({ error: 'Could not save signup' });
        }
    } catch (err) {
        console.error('waitlist: Supabase request error', err);
        return res.status(502).json({ error: 'Could not save signup' });
    }

    // Same response for new and duplicate signups to avoid email enumeration.
    return res.status(200).json({ ok: true });
};
