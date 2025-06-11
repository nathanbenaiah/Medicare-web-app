// Supabase Client Configuration
// Uses environment variables for production deployment

const SUPABASE_URL = window?.process?.env?.VITE_SUPABASE_URL || 'https://gcggnrwqilylyykppizb.supabase.co'
const SUPABASE_ANON_KEY = window?.process?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE'

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Export for use in other files
window.supabaseClient = supabase

// Flag to control automatic redirects (can be set by auth pages)
window.disableAutoRedirect = false

// Auth state change listener - WITH OTP PROTECTION
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔔 Auth event:', event, session?.user?.email)
    
    // COMPLETELY IGNORE auth events during OTP flow
    if (window.disableAutoRedirect) {
        console.log('🛡️ Auto-redirect disabled, ignoring auth event')
        return
    }
    
    // IGNORE events if OTP tab is protected
    if (window.protectOTPTab) {
        console.log('🛡️ OTP tab protected, ignoring auth event')
        return
    }
    
    // Don't redirect during OTP flow or on auth pages
    if (window.location.pathname.includes('auth') || 
        window.location.pathname.includes('otp') ||
        window.location.pathname.includes('login') ||
        window.location.pathname.includes('signup')) {
        console.log('📍 On auth page, skipping auto-redirect')
        return
    }
    
    // ONLY redirect for successful sign-ins with complete sessions
    if (event === 'SIGNED_IN' && session && session.user) {
        console.log('✅ User signed in successfully:', session.user.email)
        // Only redirect to dashboard if not already there
        if (!window.location.pathname.includes('dashboard')) {
            console.log('🚀 Redirecting to dashboard...')
            window.location.href = '/html/dashboard.html'
        }
    } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out')
        // Only redirect from protected pages
        if (window.location.pathname.includes('dashboard') || 
            window.location.pathname.includes('profile') ||
            window.location.pathname.includes('reminders') ||
            window.location.pathname.includes('schedule')) {
            console.log('🏠 Redirecting to home...')
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