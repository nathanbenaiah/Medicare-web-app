// Profile Manager for viewing and editing user profiles
class ProfileManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.dbClient = window.dbClient
        this.authManager = window.authManager
        this.isEditMode = false
        this.skills = []
        this.selectedFile = null
        this.originalData = {}
        
        this.init()
    }

    async init() {
        // Check authentication
        if (!this.authManager?.isAuthenticated()) {
            window.location.href = '/html/index.html'
            return
        }

        this.setupEventListeners()
        await this.loadProfileData()
        await this.loadPharmacies()
        this.setupMedicationSearch()
    }

    setupEventListeners() {
        // Profile picture upload
        const fileInput = document.getElementById('profile-picture-input')
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleProfilePictureChange(e))
        }

        // Skills input in edit mode
        const skillsInput = document.getElementById('edit-skills')
        if (skillsInput) {
            skillsInput.addEventListener('keypress', (e) => this.handleSkillsInput(e))
        }
    }

    // Load profile data from database
    async loadProfileData() {
        try {
            this.showLoading('Loading your profile...')

            const user = this.authManager.getCurrentUser()
            const profile = this.authManager.getUserProfile()

            if (!user || !profile) {
                throw new Error('User profile not found')
            }

            this.originalData = { ...profile }
            this.skills = profile.skills ? [...profile.skills] : []

            this.displayProfileData(user, profile)

        } catch (error) {
            console.error('Error loading profile:', error)
            this.showError('Failed to load profile data.')
        } finally {
            this.hideLoading()
        }
    }

    // Display profile data in UI
    displayProfileData(user, profile) {
        // Header information
        document.getElementById('profile-name').textContent = profile.full_name || 'Unknown User'
        document.getElementById('profile-email').textContent = user.email

        // Profile avatar
        const avatarImg = document.getElementById('profile-avatar-img')
        const avatarPlaceholder = document.getElementById('avatar-placeholder')
        
        if (profile.profile_picture || profile.avatar_url) {
            avatarImg.src = profile.profile_picture || profile.avatar_url
            avatarImg.style.display = 'block'
            avatarPlaceholder.style.display = 'none'
        } else {
            avatarImg.style.display = 'none'
            avatarPlaceholder.style.display = 'flex'
        }

        // Personal information
        this.setDisplayValue('display-name', profile.full_name)
        this.setDisplayValue('display-phone', profile.phone_number)
        this.setDisplayValue('display-bio', profile.bio)
        this.setDisplayValue('display-address', profile.address)

        // Professional information
        this.setDisplayValue('display-occupation', profile.occupation)

        // Skills
        this.displaySkills()

        // Account information
        if (profile.created_at) {
            const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            this.setDisplayValue('display-joined', joinDate)
        }

        if (profile.last_sign_in) {
            const lastActive = new Date(profile.last_sign_in).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            this.setDisplayValue('display-active', lastActive)
        }

        // Pre-fill edit fields
        this.prefillEditFields(profile)
    }

    setDisplayValue(elementId, value) {
        const element = document.getElementById(elementId)
        if (element) {
            element.textContent = value || '-'
        }
    }

    displaySkills() {
        const container = document.getElementById('display-skills')
        if (!container) return

        if (this.skills.length === 0) {
            container.innerHTML = '<span style="color: #999;">No skills added</span>'
            return
        }

        container.innerHTML = this.skills.map(skill => 
            `<div class="skill-tag">${skill}</div>`
        ).join('')
    }

    prefillEditFields(profile) {
        document.getElementById('edit-name').value = profile.full_name || ''
        document.getElementById('edit-phone').value = profile.phone_number || ''
        document.getElementById('edit-bio').value = profile.bio || ''
        document.getElementById('edit-address').value = profile.address || ''
        document.getElementById('edit-occupation').value = profile.occupation || ''
    }

    // Toggle edit mode
    toggleEditMode() {
        this.isEditMode = !this.isEditMode
        const editBtn = document.getElementById('edit-btn-text')
        
        if (this.isEditMode) {
            this.enterEditMode()
            editBtn.textContent = 'Save Changes'
        } else {
            this.saveChanges()
        }
    }

    enterEditMode() {
        document.body.classList.add('edit-mode')

        // Hide display elements, show edit inputs
        const displayElements = document.querySelectorAll('.info-value')
        const editElements = document.querySelectorAll('.edit-input, #edit-skills-container')

        displayElements.forEach(el => {
            if (!el.closest('#edit-skills-container')) {
                el.style.display = 'none'
            }
        })

        editElements.forEach(el => el.classList.remove('hidden'))

        // Show edit skills
        document.getElementById('display-skills').style.display = 'none'
        document.getElementById('edit-skills-container').classList.remove('hidden')
        this.renderEditSkills()
    }

    exitEditMode() {
        this.isEditMode = false
        document.body.classList.remove('edit-mode')

        // Show display elements, hide edit inputs
        const displayElements = document.querySelectorAll('.info-value')
        const editElements = document.querySelectorAll('.edit-input, #edit-skills-container')

        displayElements.forEach(el => el.style.display = 'block')
        editElements.forEach(el => el.classList.add('hidden'))

        // Show display skills
        document.getElementById('display-skills').style.display = 'block'
        document.getElementById('edit-skills-container').classList.add('hidden')

        // Reset button text
        document.getElementById('edit-btn-text').textContent = 'Edit Profile'
    }

    // Save changes
    async saveChanges() {
        try {
            this.showLoading('Saving your changes...')

            const user = this.authManager.getCurrentUser()
            const updateData = {
                full_name: document.getElementById('edit-name').value.trim(),
                phone_number: document.getElementById('edit-phone').value.trim(),
                bio: document.getElementById('edit-bio').value.trim(),
                address: document.getElementById('edit-address').value.trim(),
                occupation: document.getElementById('edit-occupation').value.trim(),
                skills: this.skills,
                updated_at: new Date().toISOString()
            }

            // Validate required fields
            if (!updateData.full_name) {
                this.showError('Full name is required.')
                return
            }

            let profilePictureUrl = null

            // Upload new profile picture if selected
            if (this.selectedFile) {
                this.updateLoadingText('Uploading profile picture...')
                profilePictureUrl = await this.dbClient.uploadProfilePicture(user.id, this.selectedFile)
                updateData.profile_picture = profilePictureUrl
            }

            // Update profile in database
            this.updateLoadingText('Saving profile information...')
            await this.dbClient.updateUserProfile(user.id, updateData)

            // Refresh auth manager
            await this.authManager.refreshUserProfile()

            // Update display
            const updatedProfile = { ...this.originalData, ...updateData }
            this.displayProfileData(user, updatedProfile)

            this.exitEditMode()
            this.showSuccess('Profile updated successfully!')

            // Reset selected file
            this.selectedFile = null

        } catch (error) {
            console.error('Error saving profile:', error)
            this.showError('Failed to save changes. Please try again.')
        } finally {
            this.hideLoading()
        }
    }

    // Handle profile picture change
    changeProfilePicture() {
        if (this.isEditMode) {
            document.getElementById('profile-picture-input').click()
        }
    }

    handleProfilePictureChange(event) {
        const file = event.target.files[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image size should be less than 5MB.')
            return
        }

        this.selectedFile = file

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
            const avatarImg = document.getElementById('profile-avatar-img')
            const avatarPlaceholder = document.getElementById('avatar-placeholder')
            
            avatarImg.src = e.target.result
            avatarImg.style.display = 'block'
            avatarPlaceholder.style.display = 'none'
        }
        reader.readAsDataURL(file)
    }

    // Handle skills input
    handleSkillsInput(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            const skill = event.target.value.trim()
            
            if (skill && !this.skills.includes(skill)) {
                this.skills.push(skill)
                event.target.value = ''
                this.renderEditSkills()
            }
        }
    }

    // Render skills in edit mode
    renderEditSkills() {
        const container = document.getElementById('edit-skills-tags')
        if (!container) return

        container.innerHTML = this.skills.map(skill => `
            <div class="skill-tag">
                <span>${skill}</span>
                <span style="margin-left: 8px; cursor: pointer;" onclick="profileManager.removeSkill('${skill}')">&times;</span>
            </div>
        `).join('')
    }

    // Remove skill
    removeSkill(skill) {
        this.skills = this.skills.filter(s => s !== skill)
        this.renderEditSkills()
    }

    // Sign out
    async signOut() {
        if (confirm('Are you sure you want to sign out?')) {
            await this.authManager.signOut()
        }
    }

    // Loading management
    showLoading(message) {
        const overlay = document.getElementById('loading-overlay')
        const text = document.getElementById('loading-text')
        
        if (overlay && text) {
            text.textContent = message
            overlay.classList.remove('hidden')
        }
    }

    updateLoadingText(message) {
        const text = document.getElementById('loading-text')
        if (text) {
            text.textContent = message
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay')
        if (overlay) {
            overlay.classList.add('hidden')
        }
    }

    // Notifications
    showSuccess(message) {
        if (this.authManager) {
            this.authManager.showSuccess(message)
        }
    }

    showError(message) {
        if (this.authManager) {
            this.authManager.showError(message)
        }
    }

    // ========== MEDICATION SEARCH FUNCTIONALITY ==========

    setupMedicationSearch() {
        const searchInput = document.getElementById('med-search')
        if (searchInput) {
            let searchTimeout
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout)
                searchTimeout = setTimeout(() => {
                    this.searchMedications(e.target.value)
                }, 300) // Debounce search
            })
        }
    }

    async searchMedications(query) {
        const resultsContainer = document.getElementById('medications-results')
        
        if (!query || query.trim().length < 2) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; color: #666; padding: 20px;">
                    Search for medications to view details...
                </div>
            `
            return
        }

        try {
            resultsContainer.innerHTML = `
                <div style="text-align: center; color: #666; padding: 20px;">
                    <div class="spinner" style="width: 20px; height: 20px; margin: 0 auto 10px;"></div>
                    Searching medications...
                </div>
            `

            const medications = await this.dbClient.searchMedications(query.trim())
            
            if (medications.length === 0) {
                resultsContainer.innerHTML = `
                    <div style="text-align: center; color: #666; padding: 20px;">
                        No medications found for "${query}"
                    </div>
                `
                return
            }

            resultsContainer.innerHTML = medications.map(med => `
                <div class="medication-card" style="
                    background: #f8fafc; 
                    border-radius: 12px; 
                    padding: 15px; 
                    margin-bottom: 12px; 
                    border-left: 4px solid #667eea;
                    transition: all 0.3s ease;
                    cursor: pointer;
                " onclick="profileManager.showMedicationDetails('${med.id}')">
                    <div style="font-weight: 600; color: #2d3748; margin-bottom: 5px;">
                        ${med.name}
                    </div>
                    <div style="color: #718096; font-size: 0.9rem; margin-bottom: 8px;">
                        ${med.generic_name} • ${med.category}
                    </div>
                    <div style="color: #4a5568; font-size: 0.85rem; line-height: 1.4;">
                        ${med.description || 'No description available'}
                    </div>
                    ${med.common_dosages ? `
                        <div style="margin-top: 8px;">
                            ${med.common_dosages.slice(0, 3).map(dose => `
                                <span style="
                                    background: #667eea; 
                                    color: white; 
                                    padding: 2px 8px; 
                                    border-radius: 12px; 
                                    font-size: 0.75rem; 
                                    margin-right: 5px;
                                ">${dose}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')

            // Log medication search for analytics
            await this.dbClient.logEvent('medication_search', {
                query: query,
                results_count: medications.length,
                user_id: this.authManager.getCurrentUser().id
            })

        } catch (error) {
            console.error('Error searching medications:', error)
            resultsContainer.innerHTML = `
                <div style="text-align: center; color: #e53e3e; padding: 20px;">
                    Error searching medications. Please try again.
                </div>
            `
        }
    }

    async showMedicationDetails(medicationId) {
        try {
            const medication = await this.dbClient.getMedication(medicationId)
            
            if (!medication) {
                this.showError('Medication details not found')
                return
            }

            // Create modal for medication details
            const modal = document.createElement('div')
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            `

            modal.innerHTML = `
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: #2d3748; font-size: 1.5rem; margin: 0;">${medication.name}</h2>
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            color: #666;
                            padding: 5px;
                        ">&times;</button>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <strong>Generic Name:</strong> ${medication.generic_name}
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <strong>Category:</strong> ${medication.category}
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <strong>Description:</strong><br>
                        ${medication.description || 'No description available'}
                    </div>
                    
                    ${medication.common_dosages?.length ? `
                        <div style="margin-bottom: 15px;">
                            <strong>Common Dosages:</strong><br>
                            ${medication.common_dosages.map(dose => `
                                <span style="
                                    background: #667eea; 
                                    color: white; 
                                    padding: 4px 12px; 
                                    border-radius: 20px; 
                                    font-size: 0.8rem; 
                                    margin-right: 8px;
                                    display: inline-block;
                                    margin-bottom: 5px;
                                ">${dose}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${medication.side_effects?.length ? `
                        <div style="margin-bottom: 15px;">
                            <strong>Side Effects:</strong><br>
                            ${medication.side_effects.map(effect => `
                                <span style="
                                    background: #e53e3e; 
                                    color: white; 
                                    padding: 4px 12px; 
                                    border-radius: 20px; 
                                    font-size: 0.8rem; 
                                    margin-right: 8px;
                                    display: inline-block;
                                    margin-bottom: 5px;
                                ">${effect}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${medication.warnings?.length ? `
                        <div style="margin-bottom: 15px;">
                            <strong>Warnings:</strong><br>
                            <ul style="margin-top: 5px; padding-left: 20px;">
                                ${medication.warnings.map(warning => `<li style="margin-bottom: 5px;">${warning}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${medication.storage_instructions ? `
                        <div style="margin-bottom: 15px;">
                            <strong>Storage Instructions:</strong><br>
                            ${medication.storage_instructions}
                        </div>
                    ` : ''}
                </div>
            `

            document.body.appendChild(modal)

            // Log medication view for analytics
            await this.dbClient.logEvent('medication_view', {
                medication_id: medicationId,
                medication_name: medication.name,
                user_id: this.authManager.getCurrentUser().id
            })

        } catch (error) {
            console.error('Error showing medication details:', error)
            this.showError('Failed to load medication details')
        }
    }

    // ========== PHARMACIES FUNCTIONALITY ==========

    async loadPharmacies() {
        const pharmaciesList = document.getElementById('pharmacies-list')
        
        try {
            pharmaciesList.innerHTML = `
                <div style="text-align: center; color: #666; padding: 20px;">
                    <div class="spinner" style="width: 20px; height: 20px; margin: 0 auto 10px;"></div>
                    Loading pharmacies...
                </div>
            `

            const pharmacies = await this.dbClient.getAllPharmacies()
            
            if (pharmacies.length === 0) {
                pharmaciesList.innerHTML = `
                    <div style="text-align: center; color: #666; padding: 20px;">
                        No pharmacies found
                    </div>
                `
                return
            }

            pharmaciesList.innerHTML = pharmacies.map(pharmacy => `
                <div class="pharmacy-card" style="
                    background: linear-gradient(135deg, #48bb78, #38a169);
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 12px;
                    color: white;
                    transition: transform 0.3s ease;
                    cursor: pointer;
                " onclick="profileManager.showPharmacyDetails('${pharmacy.id}')">
                    <div style="font-weight: 600; margin-bottom: 5px;">
                        ${pharmacy.name}
                    </div>
                    <div style="opacity: 0.9; font-size: 0.9rem; margin-bottom: 8px;">
                        📍 ${pharmacy.city}
                    </div>
                    <div style="opacity: 0.8; font-size: 0.85rem;">
                        📞 ${pharmacy.phone}<br>
                        🕒 ${pharmacy.hours}
                    </div>
                </div>
            `).join('')

        } catch (error) {
            console.error('Error loading pharmacies:', error)
            pharmaciesList.innerHTML = `
                <div style="text-align: center; color: #e53e3e; padding: 20px;">
                    Error loading pharmacies. Please try again.
                </div>
            `
        }
    }

    showPharmacyDetails(pharmacyId) {
        // This could open a map or more detailed view
        // For now, we'll show basic info
        this.showSuccess('Pharmacy details feature coming soon!')
    }
}

// Make ProfileManager globally available
window.ProfileManager = ProfileManager 