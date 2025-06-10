// Form Handler for Profile Completion
class FormHandler {
    constructor() {
        this.supabase = window.supabaseClient
        this.dbClient = new DatabaseClient()
        this.skills = []
        this.selectedFile = null
        this.isSubmitting = false
        this.currentUser = null
        
        this.init()
    }

    async init() {
        // Check if user is authenticated
        await this.checkAuthentication()
        this.setupEventListeners()
        await this.prefillUserData()
    }

    async checkAuthentication() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession()
            
            if (!session) {
                // No session, redirect to auth page
                window.location.href = '/html/auth.html'
                return
            }
            
            this.currentUser = session.user
            
            // Check if profile already exists
            const profile = await this.dbClient.checkUserProfile(session.user.id)
            if (profile) {
                // Profile already exists, redirect to profile page
                window.location.href = '/html/profile.html'
                return
            }
        } catch (error) {
            console.error('Authentication check error:', error)
            window.location.href = '/html/auth.html'
        }
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('signup-form')
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e))
        }

        // Profile picture upload
        const uploadInput = document.getElementById('profile-upload')
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => this.handleImageUpload(e))
        }

        // Skills input
        const skillsInput = document.getElementById('skills')
        if (skillsInput) {
            skillsInput.addEventListener('keypress', (e) => this.handleSkillsInput(e))
        }
    }

    // Pre-fill form with existing user data
    async prefillUserData() {
        if (!this.currentUser) return

        // Pre-fill email
        const emailInput = document.getElementById('email')
        if (emailInput) {
            emailInput.value = this.currentUser.email
        }

        // Pre-fill name from user metadata (from OAuth providers)
        const nameInput = document.getElementById('full_name')
        if (nameInput && this.currentUser.user_metadata?.full_name) {
            nameInput.value = this.currentUser.user_metadata.full_name
        } else if (nameInput && this.currentUser.user_metadata?.name) {
            nameInput.value = this.currentUser.user_metadata.name
        }

        // Pre-fill phone from user metadata
        const phoneInput = document.getElementById('phone_number')
        if (phoneInput && this.currentUser.user_metadata?.phone_number) {
            phoneInput.value = this.currentUser.user_metadata.phone_number
        }

        // Show avatar from OAuth provider
        if (this.currentUser.user_metadata?.avatar_url) {
            this.showProfileImage(this.currentUser.user_metadata.avatar_url)
        }
    }

    fillFormField(fieldId, value) {
        const field = document.getElementById(fieldId)
        if (field && value) {
            field.value = value
        }
    }

    // Handle image upload
    handleImageUpload(event) {
        const file = event.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image size should be less than 5MB.')
            return
        }

        this.selectedFile = file

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
            this.showProfileImage(e.target.result)
        }
        reader.readAsDataURL(file)
    }

    showProfileImage(src) {
        const img = document.getElementById('profile-image')
        const placeholder = document.getElementById('profile-placeholder')
        
        if (img && placeholder) {
            img.src = src
            img.style.display = 'block'
            placeholder.style.display = 'none'
        }
    }

    // Handle skills input
    handleSkillsInput(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            const skill = event.target.value.trim()
            
            if (skill && !this.skills.includes(skill)) {
                this.skills.push(skill)
                event.target.value = ''
                this.renderSkills()
            }
        }
    }

    // Render skills tags
    renderSkills() {
        const container = document.getElementById('skills-tags')
        if (!container) return

        container.innerHTML = this.skills.map(skill => `
            <div class="skill-tag">
                <span>${skill}</span>
                <span class="remove-skill" onclick="formHandler.removeSkill('${skill}')">&times;</span>
            </div>
        `).join('')
    }

    // Remove skill
    removeSkill(skill) {
        this.skills = this.skills.filter(s => s !== skill)
        this.renderSkills()
    }

    // Validate form
    validateForm(formData) {
        const errors = []

        // Required fields
        if (!formData.full_name?.trim()) {
            errors.push('Full name is required.')
        }

        if (!formData.email?.trim()) {
            errors.push('Email is required.')
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.push('Please enter a valid email address.')
        }

        // Phone validation (if provided)
        if (formData.phone_number) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
            if (!phoneRegex.test(formData.phone_number.replace(/[\s\-\(\)]/g, ''))) {
                errors.push('Please enter a valid phone number.')
            }
        }

        return errors
    }

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault()
        
        if (this.isSubmitting) return
        this.isSubmitting = true

        try {
            this.showLoading(true)

            // Get form data
            const formData = new FormData(event.target)
            const userData = {
                user_id: this.currentUser.id,
                email: formData.get('email'),
                full_name: formData.get('full_name'),
                phone_number: formData.get('phone_number'),
                bio: formData.get('bio'),
                address: formData.get('address'),
                occupation: formData.get('occupation'),
                skills: this.skills
            }

            // Validate form
            const errors = this.validateForm(userData)
            if (errors.length > 0) {
                this.showError(errors.join(' '))
                return
            }

            let profileImageUrl = null

            // Upload profile picture if selected
            if (this.selectedFile) {
                this.updateLoadingText('Uploading profile picture...')
                profileImageUrl = await this.dbClient.uploadProfilePicture(this.currentUser.id, this.selectedFile)
            }

            // Prepare profile data
            const profileData = {
                user_id: this.currentUser.id,
                email: userData.email,
                full_name: userData.full_name,
                phone_number: userData.phone_number || null,
                bio: userData.bio || null,
                address: userData.address || null,
                occupation: userData.occupation || null,
                skills: this.skills,
                profile_image_url: profileImageUrl
            }

            // Validate data client-side
            this.updateLoadingText('Validating profile data...')
            const validation = this.dbClient.validateProfileData(profileData)
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '))
            }

            // Create user profile
            this.updateLoadingText('Creating your profile...')
            const profile = await this.dbClient.createUserProfile(profileData)

            this.showSuccess('Profile created successfully! Welcome to Medicare!')

            // Redirect to profile page
            setTimeout(() => {
                window.location.href = '/html/profile.html'
            }, 2000)

        } catch (error) {
            console.error('Error submitting form:', error)
            
            // Show user-friendly error message
            let errorMessage = 'Failed to save profile. Please try again.'
            if (error.message.includes('unique')) {
                errorMessage = 'A profile already exists for this account.'
            } else if (error.message.includes('email')) {
                errorMessage = 'Please enter a valid email address.'
            } else if (error.message.includes('validation')) {
                errorMessage = error.message
            }
            
            this.showError(errorMessage)
        } finally {
            this.isSubmitting = false
            this.showLoading(false)
        }
    }

    // Loading state management
    showLoading(show) {
        const button = document.getElementById('submit-profile')
        const spinner = document.getElementById('loading-spinner')
        const btnText = document.getElementById('btn-text')

        if (button) {
            button.disabled = show
        }

        if (spinner) {
            spinner.style.display = show ? 'inline-block' : 'none'
        }

        if (btnText && !show) {
            btnText.textContent = 'Complete Profile'
        }
    }

    updateLoadingText(text) {
        const btnText = document.getElementById('btn-text')
        if (btnText) {
            btnText.textContent = text
        }
    }

    // Show success message
    showSuccess(message) {
        // Create and show success notification
        this.showNotification(message, 'success')
    }

    // Show error message
    showError(message) {
        // Create and show error notification
        this.showNotification(message, 'error')
    }

    // Generic notification method
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification')
        existingNotifications.forEach(notification => notification.remove())

        // Create notification element
        const notification = document.createElement('div')
        notification.className = `notification notification-${type}`
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="bx bx-x"></i>
                </button>
            </div>
        `

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `

        // Add notification to body
        document.body.appendChild(notification)

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease'
                setTimeout(() => notification.remove(), 300)
            }
        }, 5000)

        // Add required CSS animations if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style')
            style.id = 'notification-styles'
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    opacity: 0.8;
                    transition: opacity 0.2s ease;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `
            document.head.appendChild(style)
        }
    }
}

// Make FormHandler globally available
window.FormHandler = FormHandler 