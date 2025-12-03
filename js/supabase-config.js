// Supabase Configuration
const SUPABASE_URL = 'https://wihvzkfolnvxceqccbpc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaHZ6a2ZvbG52eGNlcWNjYnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODg4MTcsImV4cCI6MjA4MDM2NDgxN30.MsVIwBQSdSKoaGaXcSiDcghyI9C3Amw1sPIQMnxl0P0';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabase;

// Example: Test connection
async function testConnection() {
    try {
        const { data, error } = await supabase.from('your_table').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Supabase connected successfully!');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection error:', error.message);
        return false;
    }
}

// Example: User authentication
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
