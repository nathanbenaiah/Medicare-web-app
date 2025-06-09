// Form Handler for Signup and Profile Management
class FormHandler {
    constructor() {
        this.supabase = window.supabaseClient
        this.dbClient = window.dbClient
        this.authManager = window.authManager
        this.skills = []
        this.selectedFile = null
        this.isSubmitting = false
        
        this.init()
    }

    init() {
        // Check if user is authenticated
        if (!this.authManager?.getCurrentUser()) {
            window.location.href = '/html/index.html'
            return
        }

        this.setupEventListeners()
        this.prefillUserData()
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
    prefillUserData() {
        const user = this.authManager.getCurrentUser()
        const profile = this.authManager.getUserProfile()

        if (user) {
            // Pre-fill email
            const emailInput = document.getElementById('email')
            if (emailInput) {
                emailInput.value = user.email
            }

            // Pre-fill name if available
            const nameInput = document.getElementById('full_name')
            if (nameInput && profile?.full_name) {
                nameInput.value = profile.full_name
            } else if (nameInput && user.user_metadata?.full_name) {
                nameInput.value = user.user_metadata.full_name
            }

            // Pre-fill other fields if profile exists
            if (profile) {
                this.fillFormField('phone_number', profile.phone_number)
                this.fillFormField('bio', profile.bio)
                this.fillFormField('address', profile.address)
                this.fillFormField('occupation', profile.occupation)

                // Handle skills array
                if (profile.skills && Array.isArray(profile.skills)) {
                    this.skills = [...profile.skills]
                    this.renderSkills()
                }

                // Show existing profile picture
                if (profile.profile_picture || profile.avatar_url) {
                    this.showProfileImage(profile.profile_picture || profile.avatar_url)
                }
            }
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

            const user = this.authManager.getCurrentUser()
            let profilePictureUrl = null

            // Upload profile picture if selected
            if (this.selectedFile) {
                this.updateLoadingText('Uploading profile picture...')
                profilePictureUrl = await this.dbClient.uploadProfilePicture(user.id, this.selectedFile)
            }

            // Prepare update data
            const updateData = {
                ...userData,
                is_profile_complete: true,
                updated_at: new Date().toISOString()
            }

            if (profilePictureUrl) {
                updateData.profile_picture = profilePictureUrl
            }

            // Validate data server-side first
            this.updateLoadingText('Validating profile data...')
            const validation = await this.dbClient.validateProfileData(updateData)
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '))
            }

            // Update user profile using enhanced function
            this.updateLoadingText('Saving your profile...')
            await this.dbClient.updateUserProfile(user.id, updateData)

            // Log successful profile completion
            await this.dbClient.logEvent('profile_completed', {
                fields_completed: Object.keys(updateData).length,
                has_profile_picture: !!profilePictureUrl,
                skills_count: this.skills.length,
                completion_time: new Date().toISOString()
            })

            // Refresh auth manager
            await this.authManager.refreshUserProfile()

            this.showSuccess('Profile completed successfully!')

            // Redirect to profile page or dashboard
            setTimeout(() => {
                window.location.href = '/html/profile.html'
            }, 2000)

        } catch (error) {
            console.error('Error submitting form:', error)
            this.showError('Failed to save profile. Please try again.')
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
        if (this.authManager) {
            this.authManager.showSuccess(message)
        }
    }

    // Show error message
    showError(message) {
        if (this.authManager) {
            this.authManager.showError(message)
        }
    }
}

// Make FormHandler globally available
window.FormHandler = FormHandler 