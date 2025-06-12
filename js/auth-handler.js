// Advanced Authentication Handler for Medicare Web App
class AuthHandler {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentUser = null
        this.redirectAfterAuth = '/html/signup.html' // Profile completion page
        
        this.init()
    }

    init() {
        this.setupEventListeners()
        this.setupPasswordToggles()
        this.setupTabSwitching()
        this.checkExistingSession()
        this.setupGoogleAuth()
    }

    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Form submissions
        document.getElementById('signin-form')?.addEventListener('submit', (e) => {
            e.preventDefault()
            this.handleSignIn()
        })

        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault()
            this.handleSignUp()
        })

        // Google sign-in
        document.getElementById('google-signin')?.addEventListener('click', () => {
            this.handleGoogleSignIn()
        })

        // Forgot password
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault()
            this.handleForgotPassword()
        })

        // Real-time input validation
        this.setupInputValidation()
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target')
                const input = document.getElementById(targetId)
                
                if (input.type === 'password') {
                    input.type = 'text'
                    toggle.className = 'bx bx-show password-toggle'
                } else {
                    input.type = 'password'
                    toggle.className = 'bx bx-hide password-toggle'
                }
            })
        })
    }

    setupTabSwitching() {
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.getAttribute('data-tab')
                this.switchTab(tabType)
            })
        })
    }

    setupInputValidation() {
        // Email validation
        const emailInputs = ['signin-email', 'signup-email']
        emailInputs.forEach(id => {
            const input = document.getElementById(id)
            if (input) {
                input.addEventListener('blur', () => this.validateEmail(input))
                input.addEventListener('input', () => this.clearFieldError(input))
            }
        })

        // Password validation
        const passwordInput = document.getElementById('signup-password')
        const confirmInput = document.getElementById('confirm-password')
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword(passwordInput))
        }
        
        if (confirmInput) {
            confirmInput.addEventListener('blur', () => this.validatePasswordMatch())
        }

        // Phone validation
        const phoneInput = document.getElementById('signup-phone')
        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.formatPhoneNumber(phoneInput))
        }
    }

    // ========== TAB SWITCHING ==========
    switchTab(tabType) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active')
        })
        document.querySelector(`[data-tab="${tabType}"]`).classList.add('active')

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active')
        })
        document.getElementById(`${tabType}-form`).classList.add('active')

        // Clear messages
        this.clearMessages()
    }

    // ========== AUTHENTICATION METHODS ==========
    async handleSignIn() {
        const form = document.getElementById('signin-form')
        const emailOrPhone = document.getElementById('signin-email').value.trim()
        const password = document.getElementById('signin-password').value

        if (!this.validateSignInForm(emailOrPhone, password)) return

        this.setLoading('signin', true)
        this.clearMessages()

        try {
            let email = emailOrPhone

            // Check if input is phone number
            if (this.isPhoneNumber(emailOrPhone)) {
                // For phone authentication, we need to convert to email or handle differently
                // Since Supabase email auth is primary, we'll show an error for now
                throw new Error('Phone number sign-in is not yet supported. Please use your email address.')
            }

            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (error) throw error

            this.currentUser = data.user
            this.showSuccess('Sign in successful! Redirecting...')
            
            // Check if user has completed profile
            await this.handlePostAuthRedirect(data.user)

        } catch (error) {
            console.error('Sign in error:', error)
            this.showError(this.getErrorMessage(error))
        } finally {
            this.setLoading('signin', false)
        }
    }

    async handleSignUp() {
        const form = document.getElementById('signup-form')
        const email = document.getElementById('signup-email').value.trim()
        const phone = document.getElementById('signup-phone').value.trim()
        const password = document.getElementById('signup-password').value
        const confirmPassword = document.getElementById('confirm-password').value

        if (!this.validateSignUpForm(email, password, confirmPassword)) return

        this.setLoading('signup', true)
        this.clearMessages()

        try {
            const signUpData = {
                email: email,
                password: password,
                options: {
                    data: {
                        phone_number: phone ? `${document.getElementById('country-code').value}${phone}` : null
                    }
                }
            }

            const { data, error } = await this.supabase.auth.signUp(signUpData)

            if (error) throw error

            if (data.user && !data.user.email_confirmed_at) {
                this.showSuccess('Please check your email for verification link before signing in.')
                this.switchTab('signin')
            } else {
                this.currentUser = data.user
                await this.handlePostAuthRedirect(data.user)
            }

        } catch (error) {
            console.error('Sign up error:', error)
            this.showError(this.getErrorMessage(error))
        } finally {
            this.setLoading('signup', false)
        }
    }

    async handleGoogleSignIn() {
        this.clearMessages()
        
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth-callback`
                }
            })

            if (error) throw error

        } catch (error) {
            console.error('Google sign in error:', error)
            this.showError('Google sign-in failed. Please try again.')
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('signin-email').value.trim()
        
        if (!email) {
            this.showError('Please enter your email address first.')
            return
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.')
            return
        }

        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/html/reset-password.html`
            })

            if (error) throw error

            this.showSuccess('Password reset link sent to your email!')

        } catch (error) {
            console.error('Password reset error:', error)
            this.showError('Failed to send reset email. Please try again.')
        }
    }

    // ========== POST-AUTHENTICATION HANDLING ==========
    async handlePostAuthRedirect(user) {
        try {
            // Check if user has completed profile
            const dbClient = new DatabaseClient()
            const profile = await dbClient.checkUserProfile(user.id)
            
            if (profile) {
                // Profile exists, redirect to profile page
                window.location.href = '/html/profile.html'
            } else {
                // No profile, redirect to profile completion
                window.location.href = this.redirectAfterAuth
            }
        } catch (error) {
            console.error('Post-auth redirect error:', error)
            // Default redirect to profile completion
            window.location.href = this.redirectAfterAuth
        }
    }

    async checkExistingSession() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession()
            
            if (session) {
                this.currentUser = session.user
                await this.handlePostAuthRedirect(session.user)
            }
        } catch (error) {
            console.error('Session check error:', error)
        }
    }

    // ========== VALIDATION METHODS ==========
    validateSignInForm(emailOrPhone, password) {
        if (!emailOrPhone) {
            this.showError('Please enter your email or phone number.')
            return false
        }

        if (!password) {
            this.showError('Please enter your password.')
            return false
        }

        if (!this.isValidEmail(emailOrPhone) && !this.isPhoneNumber(emailOrPhone)) {
            this.showError('Please enter a valid email address or phone number.')
            return false
        }

        return true
    }

    validateSignUpForm(email, password, confirmPassword) {
        if (!email) {
            this.showError('Please enter your email address.')
            return false
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.')
            return false
        }

        if (!password) {
            this.showError('Please enter a password.')
            return false
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long.')
            return false
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match.')
            return false
        }

        return true
    }

    validateEmail(input) {
        const email = input.value.trim()
        if (email && !this.isValidEmail(email)) {
            this.setFieldError(input, 'Please enter a valid email address')
            return false
        }
        this.clearFieldError(input)
        return true
    }

    validatePassword(input) {
        const password = input.value
        const minLength = 8
        
        if (password.length > 0 && password.length < minLength) {
            this.setFieldError(input, `Password must be at least ${minLength} characters`)
            return false
        }
        
        this.clearFieldError(input)
        return true
    }

    validatePasswordMatch() {
        const password = document.getElementById('signup-password').value
        const confirm = document.getElementById('confirm-password').value
        
        if (confirm && password !== confirm) {
            this.setFieldError(document.getElementById('confirm-password'), 'Passwords do not match')
            return false
        }
        
        this.clearFieldError(document.getElementById('confirm-password'))
        return true
    }

    // ========== UTILITY METHODS ==========
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    isPhoneNumber(input) {
        // Simple phone number detection
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
        return phoneRegex.test(input.replace(/\s/g, ''))
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '')
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1-$2')
        }
        
        input.value = value
    }

    setFieldError(input, message) {
        input.style.borderColor = '#dc2626'
        input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)'
        
        // Remove existing error
        const existingError = input.parentNode.querySelector('.field-error')
        if (existingError) existingError.remove()
        
        // Add error message
        const errorDiv = document.createElement('div')
        errorDiv.className = 'field-error'
        errorDiv.style.cssText = 'color: #dc2626; font-size: 12px; margin-top: 4px;'
        errorDiv.textContent = message
        input.parentNode.appendChild(errorDiv)
    }

    clearFieldError(input) {
        input.style.borderColor = '#d1d5db'
        input.style.boxShadow = ''
        
        const errorDiv = input.parentNode.querySelector('.field-error')
        if (errorDiv) errorDiv.remove()
    }

    setLoading(type, isLoading) {
        const button = document.getElementById(`${type}-btn`)
        const spinner = document.getElementById(`${type}-spinner`)
        
        if (isLoading) {
            button.disabled = true
            spinner.style.display = 'block'
        } else {
            button.disabled = false
            spinner.style.display = 'none'
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message')
        errorDiv.textContent = message
        errorDiv.style.display = 'block'
        
        // Hide success message
        document.getElementById('success-message').style.display = 'none'
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none'
        }, 5000)
    }

    showSuccess(message) {
        const successDiv = document.getElementById('success-message')
        successDiv.textContent = message
        successDiv.style.display = 'block'
        
        // Hide error message
        document.getElementById('error-message').style.display = 'none'
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none'
        }, 5000)
    }

    clearMessages() {
        document.getElementById('error-message').style.display = 'none'
        document.getElementById('success-message').style.display = 'none'
    }

    getErrorMessage(error) {
        const errorMessages = {
            'Invalid login credentials': 'Invalid email or password. Please try again.',
            'Email not confirmed': 'Please check your email and click the confirmation link.',
            'User already registered': 'An account with this email already exists. Please sign in instead.',
            'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
            'Signup requires a valid password': 'Please enter a valid password.',
            'Unable to validate email address: invalid format': 'Please enter a valid email address.'
        }
        
        return errorMessages[error.message] || error.message || 'An unexpected error occurred.'
    }

    setupGoogleAuth() {
        // Configure Google OAuth if needed
        // This can be expanded based on your Google OAuth setup
    }

    // ========== PUBLIC METHODS ==========
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut()
            if (error) throw error
            
            this.currentUser = null
            window.location.href = '/html/auth.html'
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    getCurrentUser() {
        return this.currentUser
    }
}

// Make AuthHandler globally available
window.AuthHandler = AuthHandler 