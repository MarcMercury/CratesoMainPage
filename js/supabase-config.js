/**
 * Supabase Configuration
 *
 * The Supabase anon key below is a public key intentionally safe for client-side use.
 * It enforces Row Level Security (RLS) policies defined in your Supabase project.
 *
 * For Vercel deployments:
 *   1. Go to Vercel Dashboard → Settings → Environment Variables
 *   2. Add: NEXT_PUBLIC_SUPABASE_URL  and  NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   3. If you add a build step (e.g., via a Makefile or vercel.json build command),
 *      inject them at build time: sed -i "s|__SUPABASE_URL__|$NEXT_PUBLIC_SUPABASE_URL|g" js/supabase-config.js
 *
 * For a GitHub Actions → Vercel CI pipeline, use GitHub Secrets for the same values.
 *
 * ⚠️  Never put your SERVICE_ROLE key here — that key bypasses RLS and must stay server-side only.
 */

const SUPABASE_URL = 'https://wihvzkfolnvxceqccbpc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaHZ6a2ZvbG52eGNlcWNjYnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODg4MTcsImV4cCI6MjA4MDM2NDgxN30.MsVIwBQSdSKoaGaXcSiDcghyI9C3Amw1sPIQMnxl0P0';

// Initialize Supabase client (requires supabase-js CDN loaded before this file)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabase;

// --- Auth helpers ---
async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    return { data, error };
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

// Get current user
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
