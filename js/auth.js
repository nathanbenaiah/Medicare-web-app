// Authentication functionality
class AuthManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentUser = null
        this.init()
    }

    async init() {
        // Get current session
        const { data: { session } } = await this.supabase.auth.getSession()
        if (session) {
            this.currentUser = session.user
            this.updateUI(true)
        }
    }

    // Google OAuth Sign In
    async signInWithGoogle() {
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/html/dashboard.html`
                }
            })

            if (error) {
                console.error('Google sign-in error:', error)
                this.showError('Failed to sign in with Google. Please try again.')
                return false
            }

            return true
        } catch (error) {
            console.error('Google sign-in error:', error)
            this.showError('An unexpected error occurred. Please try again.')
            return false
        }
    }

    // Email/Password Sign In
    async signInWithEmail(email, password) {
        try {
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
            this.updateUI(true)
            
            // Redirect to dashboard
            window.location.href = '/html/dashboard.html'
            return true
        } catch (error) {
            console.error('Email sign-in error:', error)
            this.showError('An unexpected error occurred. Please try again.')
            return false
        }
    }

    // Email/Password Sign Up
    async signUpWithEmail(email, password, fullName) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })

            if (error) {
                console.error('Sign-up error:', error)
                this.showError(error.message)
                return false
            }

            if (data.user && !data.user.email_confirmed_at) {
                this.showSuccess('Please check your email to confirm your account!')
                return true
            }

            this.currentUser = data.user
            this.updateUI(true)
            
            // Redirect to dashboard
            window.location.href = '/html/dashboard.html'
            return true
        } catch (error) {
            console.error('Sign-up error:', error)
            this.showError('An unexpected error occurred. Please try again.')
            return false
        }
    }

    // Sign Out
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut()
            
            if (error) {
                console.error('Sign-out error:', error)
                this.showError('Failed to sign out. Please try again.')
                return false
            }

            this.currentUser = null
            this.updateUI(false)
            
            // Redirect to home
            window.location.href = '/html/index.html'
            return true
        } catch (error) {
            console.error('Sign-out error:', error)
            this.showError('An unexpected error occurred.')
            return false
        }
    }

    // Reset Password
    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/html/reset-password.html`
            })

            if (error) {
                console.error('Password reset error:', error)
                this.showError(error.message)
                return false
            }

            this.showSuccess('Password reset email sent! Check your inbox.')
            return true
        } catch (error) {
            console.error('Password reset error:', error)
            this.showError('An unexpected error occurred. Please try again.')
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
                    btn.textContent = '👤 Dashboard'
                    btn.onclick = () => window.location.href = '/html/dashboard.html'
                }
            })
            
            signOutBtns.forEach(btn => btn.style.display = 'block')
            
            userDisplays.forEach(display => {
                display.textContent = `Hello, ${this.currentUser.user_metadata?.full_name || this.currentUser.email}`
                display.style.display = 'block'
            })
        } else {
            signInBtns.forEach(btn => {
                if (btn.textContent.includes('Dashboard')) {
                    btn.textContent = '🔑 Sign In'
                    btn.onclick = () => this.signInWithGoogle()
                }
            })
            
            signOutBtns.forEach(btn => btn.style.display = 'none')
            userDisplays.forEach(display => display.style.display = 'none')
        }
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error')
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success')
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div')
        notification.className = `notification notification-${type}`
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
            ${type === 'error' ? 'background: #ef4444;' : ''}
            ${type === 'success' ? 'background: #10b981;' : ''}
            ${type === 'info' ? 'background: #3b82f6;' : ''}
        `

        document.body.appendChild(notification)

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove()
            }
        }, 5000)
    }
}

// Initialize auth manager
const authManager = new AuthManager()

// Global functions for HTML onclick handlers
window.signInWithGoogle = () => authManager.signInWithGoogle()
window.signOut = () => authManager.signOut()

// Export for use in other files
window.authManager = authManager 