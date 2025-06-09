// Enhanced Authentication & User Management System
class AuthManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentUser = null
        this.userProfile = null
        this.init()
    }

    async init() {
        // Get current session
        const { data: { session } } = await this.supabase.auth.getSession()
        if (session) {
            this.currentUser = session.user
            await this.loadUserProfile()
            this.updateUI(true)
        }

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event)
            
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user
                await this.handleUserSignIn()
            } else if (event === 'SIGNED_OUT') {
                await this.handleUserSignOut()
            }
        })
    }

    // Google OAuth Sign In with Complete User Setup
    async signInWithGoogle() {
        try {
            this.showLoadingState('Connecting to Google...')
            
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/html/dashboard.html`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            })

            if (error) {
                console.error('Google sign-in error:', error)
                this.showError('Failed to sign in with Google. Please try again.')
                return false
            }

            // The redirect will handle the rest
            return true
        } catch (error) {
            console.error('Google sign-in error:', error)
            this.showError('An unexpected error occurred. Please try again.')
            return false
        }
    }

    // Handle successful user sign-in
    async handleUserSignIn() {
        try {
            this.showLoadingState('Setting up your account...')
            
            // Create or update user profile
            await this.createUserProfile()
            
            // Initialize user analytics
            await this.trackUserEvent('user_signed_in')
            
            // Clear any dummy data
            await this.clearDummyData()
            
            // Load user profile
            await this.loadUserProfile()
            
            // Update UI
            this.updateUI(true)
            
            this.showSuccess(`Welcome ${this.userProfile?.full_name || this.currentUser.email}!`)
            
            // Redirect to dashboard if not already there
            if (!window.location.pathname.includes('dashboard')) {
                setTimeout(() => {
                    window.location.href = '/html/dashboard.html'
                }, 1500)
            }
            
        } catch (error) {
            console.error('Error handling sign-in:', error)
            this.showError('Error setting up your account. Please try again.')
        }
    }

    // Create or update user profile in database
    async createUserProfile() {
        try {
            const userData = {
                id: this.currentUser.id,
                email: this.currentUser.email,
                full_name: this.currentUser.user_metadata?.full_name || this.currentUser.user_metadata?.name,
                avatar_url: this.currentUser.user_metadata?.avatar_url,
                provider: 'google',
                last_sign_in: new Date().toISOString(),
                created_at: new Date().toISOString()
            }

            // Insert or update user profile
            const { data, error } = await this.supabase
                .from('user_profiles')
                .upsert(userData, { 
                    onConflict: 'id',
                    ignoreDuplicates: false 
                })
                .select()

            if (error) {
                console.error('Error creating user profile:', error)
                throw error
            }

            // Create default user preferences
            await this.createDefaultPreferences()
            
            console.log('User profile created/updated:', data)
            return data

        } catch (error) {
            console.error('Error in createUserProfile:', error)
            throw error
        }
    }

    // Create default user preferences
    async createDefaultPreferences() {
        try {
            const preferences = {
                user_id: this.currentUser.id,
                notification_enabled: true,
                reminder_advance_time: 15,
                timezone: 'Asia/Colombo',
                language: 'en',
                theme: 'light'
            }

            const { error } = await this.supabase
                .from('user_preferences')
                .upsert(preferences, { onConflict: 'user_id' })

            if (error) {
                console.error('Error creating preferences:', error)
            }
        } catch (error) {
            console.error('Error in createDefaultPreferences:', error)
        }
    }

    // Load user profile from database
    async loadUserProfile() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading user profile:', error)
                return null
            }

            this.userProfile = data
            return data
        } catch (error) {
            console.error('Error in loadUserProfile:', error)
            return null
        }
    }

    // Clear any dummy/sample data for new user
    async clearDummyData() {
        try {
            // Clear any existing reminders
            await this.supabase
                .from('reminders')
                .delete()
                .eq('user_id', this.currentUser.id)

            // Clear any existing appointments
            await this.supabase
                .from('appointments')
                .delete()
                .eq('user_id', this.currentUser.id)

            // Clear reminder logs
            await this.supabase
                .from('reminder_logs')
                .delete()
                .eq('user_id', this.currentUser.id)

            console.log('Dummy data cleared for user:', this.currentUser.id)
        } catch (error) {
            console.error('Error clearing dummy data:', error)
        }
    }

    // Track user events for analytics
    async trackUserEvent(event_type, event_data = {}) {
        try {
            const analyticsData = {
                user_id: this.currentUser?.id,
                event_type: event_type,
                event_data: event_data,
                timestamp: new Date().toISOString(),
                session_id: this.generateSessionId(),
                user_agent: navigator.userAgent,
                page_url: window.location.href
            }

            const { error } = await this.supabase
                .from('user_analytics')
                .insert(analyticsData)

            if (error) {
                console.error('Error tracking event:', error)
            }
        } catch (error) {
            console.error('Error in trackUserEvent:', error)
        }
    }

    // Generate session ID for analytics
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }

    // Email/Password Sign In (Enhanced)
    async signInWithEmail(email, password) {
        try {
            this.showLoadingState('Signing you in...')
            
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                console.error('Email sign-in error:', error)
                this.showError(error.message)
                return false
            }

            this.currentUser = data.user
            await this.handleUserSignIn()
            return true
        } catch (error) {
            console.error('Email sign-in error:', error)
            this.showError('An unexpected error occurred. Please try again.')
            return false
        }
    }

    // Handle user sign out
    async handleUserSignOut() {
        try {
            // Track sign out event
            if (this.currentUser) {
                await this.trackUserEvent('user_signed_out')
            }
            
            this.currentUser = null
            this.userProfile = null
            this.updateUI(false)
            
            // Redirect to home
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = '/html/index.html'
            }
        } catch (error) {
            console.error('Error handling sign out:', error)
        }
    }

    // Sign Out
    async signOut() {
        try {
            this.showLoadingState('Signing you out...')
            
            const { error } = await this.supabase.auth.signOut()
            
            if (error) {
                console.error('Sign-out error:', error)
                this.showError('Failed to sign out. Please try again.')
                return false
            }

            return true
        } catch (error) {
            console.error('Sign-out error:', error)
            this.showError('An unexpected error occurred.')
            return false
        }
    }

    // Update UI based on auth state
    updateUI(isSignedIn) {
        // Update sign-in buttons
        const signInBtns = document.querySelectorAll('.google-sign-btn, .sign-in-btn')
        const signOutBtns = document.querySelectorAll('.sign-out-btn')
        const userDisplays = document.querySelectorAll('.user-display')

        if (isSignedIn && this.currentUser) {
            signInBtns.forEach(btn => {
                if (btn.textContent.includes('Sign')) {
                    btn.innerHTML = '<i class="bx bx-user"></i> Dashboard'
                    btn.onclick = () => window.location.href = '/html/dashboard.html'
                }
            })
            
            signOutBtns.forEach(btn => {
                btn.style.display = 'block'
                btn.onclick = () => this.signOut()
            })
            
            userDisplays.forEach(display => {
                const displayName = this.userProfile?.full_name || this.currentUser.email
                display.innerHTML = `
                    <div class="user-info">
                        <img src="${this.userProfile?.avatar_url || '/images/default-avatar.png'}" alt="Profile" class="user-avatar">
                        <span>Hello, ${displayName}</span>
                    </div>
                `
                display.style.display = 'flex'
            })
        } else {
            signInBtns.forEach(btn => {
                if (btn.textContent.includes('Dashboard')) {
                    btn.innerHTML = '<i class="bx bxl-google"></i> Sign In'
                    btn.onclick = () => this.signInWithGoogle()
                }
            })
            
            signOutBtns.forEach(btn => btn.style.display = 'none')
            userDisplays.forEach(display => display.style.display = 'none')
        }
    }

    // Show loading state
    showLoadingState(message) {
        this.showNotification(message, 'info', 10000)
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error')
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success')
    }

    // Enhanced notification system
    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification')
        existingNotifications.forEach(notification => notification.remove())

        // Create notification element
        const notification = document.createElement('div')
        notification.className = `notification notification-${type}`
        
        const icon = type === 'error' ? 'bx-error-circle' : 
                    type === 'success' ? 'bx-check-circle' : 'bx-info-circle'
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bx ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="bx bx-x"></i>
            </button>
        `
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            animation: slideIn 0.3s ease;
            ${type === 'error' ? 'background: linear-gradient(135deg, #ef4444, #dc2626);' : ''}
            ${type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669);' : ''}
            ${type === 'info' ? 'background: linear-gradient(135deg, #3b82f6, #2563eb);' : ''}
        `

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style')
            style.id = 'notification-styles'
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                    transition: background 0.2s;
                }
                .notification-close:hover {
                    background: rgba(255,255,255,0.2);
                }
            `
            document.head.appendChild(style)
        }

        document.body.appendChild(notification)

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove()
                }
            }, duration)
        }
    }

    // Get user statistics for dashboard
    async getUserStats() {
        try {
            const [remindersResult, appointmentsResult, logsResult] = await Promise.all([
                this.supabase
                    .from('reminders')
                    .select('*', { count: 'exact' })
                    .eq('user_id', this.currentUser.id)
                    .eq('is_active', true),
                
                this.supabase
                    .from('appointments')
                    .select('*', { count: 'exact' })
                    .eq('user_id', this.currentUser.id)
                    .gte('appointment_date', new Date().toISOString().split('T')[0]),
                
                this.supabase
                    .from('reminder_logs')
                    .select('*', { count: 'exact' })
                    .eq('user_id', this.currentUser.id)
                    .eq('status', 'taken')
                    .gte('taken_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            ])

            return {
                activeReminders: remindersResult.count || 0,
                upcomingAppointments: appointmentsResult.count || 0,
                medicationsTaken: logsResult.count || 0,
                adherenceRate: this.calculateAdherenceRate(logsResult.data || [])
            }
        } catch (error) {
            console.error('Error getting user stats:', error)
            return {
                activeReminders: 0,
                upcomingAppointments: 0,
                medicationsTaken: 0,
                adherenceRate: 0
            }
        }
    }

    // Calculate medication adherence rate
    calculateAdherenceRate(logs) {
        if (!logs.length) return 0
        
        const takenCount = logs.filter(log => log.status === 'taken').length
        const totalCount = logs.length
        
        return Math.round((takenCount / totalCount) * 100)
    }
}

// Initialize auth manager globally
window.AuthManager = AuthManager

// Global functions for HTML onclick handlers
window.signInWithGoogle = () => {
    if (window.authManager) {
        window.authManager.signInWithGoogle()
    } else {
        alert('Authentication system is loading. Please try again in a moment.')
    }
}

window.signOut = () => {
    if (window.authManager) {
        window.authManager.signOut()
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseClient && !window.authManager) {
        window.authManager = new AuthManager()
        console.log('Auth manager initialized')
    }
}) 