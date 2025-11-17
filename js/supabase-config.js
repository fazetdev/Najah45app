// Supabase configuration - REPLACE WITH YOUR ACTUAL CREDENTIALS
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Initialize Supabase client (will be used when credentials are added)
let supabase;

try {
    if (typeof supabaseClient !== 'undefined') {
        supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized');
    }
} catch (error) {
    console.log('Supabase not available, using local storage only');
}

// For demo purposes - we'll use localStorage until Supabase is configured
const demoMode = true;

console.log('App running in demo mode - using localStorage');
