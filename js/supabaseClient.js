// Supabase Client Configuration
// Uses environment variables for production deployment

const SUPABASE_URL = window?.process?.env?.VITE_SUPABASE_URL || 'https://gcggnrwqilylykppizb.supabase.co'
const SUPABASE_ANON_KEY = window?.process?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHlrcHBpemIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzIxMzgzNiwiZXhwIjoyMDUyNzg5ODM2fQ.LzgHWMlVzLKmP3cEYdwv5mVSUjRJU8VCCCgCMN_eVkc'

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Export for use in other files
window.supabaseClient = supabase

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event)
    
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user)
        // Redirect to dashboard if not already there
        if (!window.location.pathname.includes('dashboard')) {
            window.location.href = '/html/dashboard.html'
        }
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        // Redirect to home page
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = '/html/index.html'
        }
    }
})

// Utility functions
window.supabaseUtils = {
    // Get current user
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },
    
    // Check if user is authenticated
    isAuthenticated: async () => {
        const user = await window.supabaseUtils.getCurrentUser()
        return !!user
    },
    
    // Sign out user
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error signing out:', error)
            return false
        }
        return true
    }
} 