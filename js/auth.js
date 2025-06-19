// Enhanced Authentication Manager with Profile System
class AuthManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.dbClient = window.dbClient
        this.currentUser = null
        this.userProfile = null
        this.init()
    }

    async init() {
        try {
            // Get current session
            const { data: { session } } = await this.supabase.auth.getSession()
            
            if (session) {
                this.currentUser = session.user
                await this.handleUserSession()
            }

            // Listen for auth changes
            this.supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth event:', event)
                
                if (event === 'SIGNED_IN') {
                    this.currentUser = session.user
                    await this.handleUserSession()
                } else if (event === 'SIGNED_OUT') {
                    this.handleSignOut()
                }
            })

            this.updateUI()
        } catch (error) {
            console.error('Error initializing auth:', error)
        }
    }

    // Handle user session after sign-in
    async handleUserSession() {
        try {
            this.showLoading('Checking your profile...')
            
            // Check if user profile exists and is complete using new SQL function
            const isComplete = await this.dbClient.checkUserProfile(this.currentUser.id)
            
            if (isComplete !== null) {
                // Get full profile data using enhanced function
                this.userProfile = await this.dbClient.getUserProfile(this.currentUser.id)
                
                if (!isComplete) {
                    // Redirect to signup form to complete profile
                    this.redirectToSignup()
                } else {
                    // User has complete profile, update UI
                    this.updateUI()
                    this.showSuccess(`Welcome back, ${this.userProfile.full_name || this.currentUser.email}!`)
                    
                    // Log successful user session for analytics
                    await this.dbClient.logEvent('user_session_started', {
                        user_id: this.currentUser.id,
                        page: window.location.pathname,
                        has_complete_profile: true,
                        last_login: new Date().toISOString()
                    })
                }
            } else {
                // New user, create basic profile and redirect to signup
                await this.createBasicProfile()
                this.redirectToSignup()
                
                // Log new user registration
                await this.dbClient.logEvent('new_user_registration', {
                    user_id: this.currentUser.id,
                    provider: 'google',
                    registration_time: new Date().toISOString()
                })
            }
        } catch (error) {
            console.error('Error handling user session:', error)
            this.showError('Error loading your profile. Please try again.')
        } finally {
            this.hideLoading()
        }
    }

    // Create basic profile for new user
    async createBasicProfile() {
        try {
            const userData = {
                id: this.currentUser.id,
                email: this.currentUser.email,
                full_name: this.currentUser.user_metadata?.full_name || '',
                avatar_url: this.currentUser.user_metadata?.avatar_url || '',
                provider: 'google',
                is_profile_complete: false,
                last_sign_in: new Date().toISOString()
            }

            this.userProfile = await this.dbClient.createUserProfile(userData)
            console.log('Basic profile created for new user')
        } catch (error) {
            console.error('Error creating basic profile:', error)
            throw error
        }
    }

    // Email Sign Up
    async signUpWithEmail(email, password, fullName) {
        try {
            this.showLoading('Creating your account...')
            
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            })

            if (error) {
                throw error
            }

            if (data.user && !data.session) {
                // Email confirmation required
                this.showSuccess('Please check your email and click the confirmation link to complete your registration.')
                return { success: true, needsConfirmation: true }
            }

            return { success: true, needsConfirmation: false }
        } catch (error) {
            console.error('Email sign-up error:', error)
            this.showError(error.message || 'Failed to create account. Please try again.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Email Sign In (Traditional)
    async signInWithEmail(email, password) {
        try {
            this.showLoading('Signing you in...')
            
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                throw error
            }

            return { success: true }
        } catch (error) {
            console.error('Email sign-in error:', error)
            this.showError(error.message || 'Failed to sign in. Please check your credentials.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Email OTP Sign In (Step 1: Send OTP)
    async signInWithOTP(email, shouldCreateUser = true) {
        try {
            this.showLoading('Sending verification code...')
            
            const { data, error } = await this.supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: shouldCreateUser,
                    data: {
                        // You can add additional metadata here if needed
                    }
                }
            })

            if (error) {
                throw error
            }

            this.showSuccess('Verification code sent! Please check your email.')
            return { success: true, needsVerification: true }
        } catch (error) {
            console.error('OTP send error:', error)
            this.showError(error.message || 'Failed to send verification code. Please try again.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Email OTP Verify (Step 2: Verify OTP)
    async verifyOTP(email, token) {
        try {
            this.showLoading('Verifying code...')
            
            const { data: { session }, error } = await this.supabase.auth.verifyOtp({
                email: email,
                token: token,
                type: 'email'
            })

            if (error) {
                throw error
            }

            if (session) {
                this.showSuccess('Code verified successfully!')
                return { success: true, session: session }
            } else {
                throw new Error('No session created after verification')
            }
        } catch (error) {
            console.error('OTP verify error:', error)
            this.showError(error.message || 'Invalid verification code. Please try again.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Resend OTP
    async resendOTP(email) {
        try {
            this.showLoading('Resending verification code...')
            
            const { data, error } = await this.supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: false // Don't create new user on resend
                }
            })

            if (error) {
                throw error
            }

            this.showSuccess('New verification code sent!')
            return { success: true }
        } catch (error) {
            console.error('OTP resend error:', error)
            this.showError(error.message || 'Failed to resend verification code.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Password Reset
    async resetPassword(email) {
        try {
            this.showLoading('Sending password reset email...')
            
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/html/auth.html?mode=reset`,
            })

            if (error) {
                throw error
            }

            this.showSuccess('Password reset email sent! Please check your inbox.')
            return { success: true }
        } catch (error) {
            console.error('Password reset error:', error)
            this.showError(error.message || 'Failed to send password reset email.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Update Password (for password reset)
    async updatePassword(newPassword) {
        try {
            this.showLoading('Updating your password...')
            
            const { error } = await this.supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                throw error
            }

            this.showSuccess('Password updated successfully!')
            return { success: true }
        } catch (error) {
            console.error('Password update error:', error)
            this.showError(error.message || 'Failed to update password.')
            return { success: false, error: error.message }
        } finally {
            this.hideLoading()
        }
    }

    // Google OAuth Sign In
    async signInWithGoogle() {
        try {
            this.showLoading('Connecting to Google...')
            
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth-callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            })

            if (error) {
                throw error
            }

            return true
        } catch (error) {
            console.error('Google sign-in error:', error)
            this.showError('Failed to sign in with Google. Please try again.')
            this.hideLoading()
            return false
        }
    }

    // Sign Out
    async signOut() {
        try {
            this.showLoading('Signing you out...')
            
            const { error } = await this.supabase.auth.signOut()
            
            if (error) {
                throw error
            }

            return true
        } catch (error) {
            console.error('Sign-out error:', error)
            this.showError('Failed to sign out. Please try again.')
            return false
        } finally {
            this.hideLoading()
        }
    }

    // Handle sign out
    handleSignOut() {
        this.currentUser = null
        this.userProfile = null
        this.updateUI()
        
        // Redirect to home if on protected pages
        if (window.location.pathname.includes('profile') || 
            window.location.pathname.includes('signup')) {
            window.location.href = '/html/index.html'
        }
    }

    // Redirect to signup form
    redirectToSignup() {
        if (!window.location.pathname.includes('signup')) {
            window.location.href = '/html/signup.html'
        }
    }

    // Redirect to profile page
    redirectToProfile() {
        window.location.href = '/html/profile.html'
    }

    // Update UI based on auth state
    updateUI() {
        this.updateSignInButton()
        this.updateUserDisplay()
        this.updateNavigation()
    }

    // Update sign-in button
    updateSignInButton() {
        const signInBtn = document.getElementById('signin')
        const userIcon = document.getElementById('user-icon')
        
        if (this.currentUser && this.userProfile?.is_profile_complete) {
            // Show user icon
            if (signInBtn) signInBtn.style.display = 'none'
            if (userIcon) {
                userIcon.style.display = 'flex'
                const profileImg = this.userProfile.profile_picture || this.userProfile.avatar_url || this.getDefaultAvatar()
                userIcon.innerHTML = `
                    <img src="${profileImg}" 
                         alt="Profile" class="profile-icon" onclick="authManager.redirectToProfile()"
                         onerror="this.src='${this.getDefaultAvatar()}'">
                `
            }
        } else {
            // Show sign-in button
            if (signInBtn) {
                signInBtn.style.display = 'block'
                signInBtn.innerHTML = '<i class="bx bxl-google"></i> Sign In with Google'
            }
            if (userIcon) userIcon.style.display = 'none'
        }
    }

    // Get default avatar URL
    getDefaultAvatar() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iOCIgeT0iOCI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'
    }

    // Update user display elements
    updateUserDisplay() {
        const userDisplays = document.querySelectorAll('.user-display')
        
        userDisplays.forEach(display => {
            if (this.currentUser && this.userProfile) {
                const displayName = this.userProfile.full_name || this.currentUser.email
                const profileImg = this.userProfile.profile_picture || this.userProfile.avatar_url || this.getDefaultAvatar()
                display.innerHTML = `
                    <div class="user-info">
                        <img src="${profileImg}" 
                             alt="Profile" class="user-avatar"
                             onerror="this.src='${this.getDefaultAvatar()}'">
                        <span>Hello, ${displayName}</span>
                    </div>
                `
                display.style.display = 'flex'
            } else {
                display.style.display = 'none'
            }
        })
    }

    // Update navigation for authenticated users
    updateNavigation() {
        const protectedLinks = document.querySelectorAll('.protected-link')
        const signOutBtns = document.querySelectorAll('.sign-out-btn')
        
        if (this.currentUser && this.userProfile?.is_profile_complete) {
            protectedLinks.forEach(link => link.style.display = 'block')
            signOutBtns.forEach(btn => {
                btn.style.display = 'block'
                btn.onclick = () => this.signOut()
            })
        } else {
            protectedLinks.forEach(link => link.style.display = 'none')
            signOutBtns.forEach(btn => btn.style.display = 'none')
        }
    }

    // Check if user is authenticated and has complete profile
    isAuthenticated() {
        return this.currentUser && this.userProfile?.is_profile_complete
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser
    }

    // Get user profile
    getUserProfile() {
        return this.userProfile
    }

    // Refresh user profile
    async refreshUserProfile() {
        if (this.currentUser) {
            this.userProfile = await this.dbClient.checkUserProfile(this.currentUser.id)
            this.updateUI()
        }
    }

    // Loading state management
    showLoading(message = 'Loading...') {
        this.showNotification(message, 'info', 0)
    }

    hideLoading() {
        const notifications = document.querySelectorAll('.notification')
        notifications.forEach(notification => {
            if (notification.classList.contains('notification-info')) {
                notification.remove()
            }
        })
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success')
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error')
    }

    // Enhanced notification system
    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications of the same type
        const existingNotifications = document.querySelectorAll(`.notification-${type}`)
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
            ${duration > 0 ? `<button class="notification-close" onclick="this.parentElement.remove()">
                <i class="bx bx-x"></i>
            </button>` : ''}
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

        // Add animation keyframes if not exists
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
                .profile-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.2s;
                    border: 2px solid rgba(255,255,255,0.3);
                }
                .profile-icon:hover {
                    transform: scale(1.1);
                    border-color: rgba(255,255,255,0.8);
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
    if (window.supabaseClient && window.dbClient && !window.authManager) {
        window.authManager = new AuthManager()
        console.log('Auth manager initialized')
    }
}) 