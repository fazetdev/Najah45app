// Supabase configuration - DEMO MODE
console.log('Supabase config loaded - running in demo mode');

// Demo mode - skip Supabase initialization for now
const demoMode = true;

// Mock supabase object for demo
const supabase = {
    auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve(),
        user: () => null
    }
};

console.log('Running in demo mode - all data saved locally');
