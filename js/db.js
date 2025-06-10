// Database client initialization for Supabase
// Uses environment variables for production deployment
const SUPABASE_URL = window?.process?.env?.VITE_SUPABASE_URL || 'https://gcggnrwqilylyykppizb.supabase.co'
const SUPABASE_ANON_KEY = window?.process?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE'

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Make client globally available
window.supabaseClient = supabase

// Enhanced Database Client with comprehensive functions
class DatabaseClient {
    constructor() {
        this.supabase = supabase
    }

    // ========== PROFILE MANAGEMENT ==========
    
    // Check if user profile exists and is complete
    async checkUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') {
                throw error
            }

            return data
        } catch (error) {
            console.error('Error checking user profile:', error)
            return null
        }
    }

    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting user profile:', error)
            return null
        }
    }

    // Create user profile
    async createUserProfile(userData) {
        try {
            const profileData = {
                user_id: userData.user_id,
                email: userData.email,
                full_name: userData.full_name,
                phone_number: userData.phone_number || null,
                bio: userData.bio || null,
                address: userData.address || null,
                occupation: userData.occupation || null,
                skills: Array.isArray(userData.skills) ? userData.skills : this.skillsStringToArray(userData.skills),
                profile_image_url: userData.profile_image_url || null
            }

            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert(profileData)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error creating user profile:', error)
            throw error
        }
    }

    // Update user profile
    async updateUserProfile(userId, updates) {
        try {
            const updateData = {}
            
            if (updates.full_name !== undefined) updateData.full_name = updates.full_name
            if (updates.phone_number !== undefined) updateData.phone_number = updates.phone_number
            if (updates.bio !== undefined) updateData.bio = updates.bio
            if (updates.address !== undefined) updateData.address = updates.address
            if (updates.occupation !== undefined) updateData.occupation = updates.occupation
            if (updates.skills !== undefined) {
                updateData.skills = Array.isArray(updates.skills) ? updates.skills : this.skillsStringToArray(updates.skills)
            }
            if (updates.profile_image_url !== undefined) updateData.profile_image_url = updates.profile_image_url

            const { data, error } = await this.supabase
                .from('user_profiles')
                .update(updateData)
                .eq('user_id', userId)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error updating user profile:', error)
            throw error
        }
    }

    // Validate profile data client-side
    validateProfileData(profileData) {
        const errors = []
        
        if (!profileData.full_name || profileData.full_name.trim().length < 2) {
            errors.push('Full name must be at least 2 characters long')
        }
        
        if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
            errors.push('Valid email address is required')
        }
        
        if (profileData.phone_number && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(profileData.phone_number)) {
            errors.push('Phone number format is invalid')
        }

        return { valid: errors.length === 0, errors }
    }

    // Find users by skills
    async findUsersBySkills(skillsArray) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('id, full_name, email, occupation, skills, profile_image_url')
                .overlaps('skills', skillsArray)

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Error finding users by skills:', error)
            return []
        }
    }

    // ========== MEDICATION MANAGEMENT ==========
    
    // Get user medications
    async getUserMedications(userId) {
        try {
            const { data, error } = await this.supabase
                .from('medications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Error getting user medications:', error)
            return []
        }
    }

    // Add medication
    async addMedication(medicationData) {
        try {
            const { data, error } = await this.supabase
                .from('medications')
                .insert(medicationData)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error adding medication:', error)
            throw error
        }
    }

    // Update medication
    async updateMedication(medicationId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('medications')
                .update(updates)
                .eq('id', medicationId)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error updating medication:', error)
            throw error
        }
    }

    // Delete medication
    async deleteMedication(medicationId) {
        try {
            const { error } = await this.supabase
                .from('medications')
                .delete()
                .eq('id', medicationId)

            if (error) throw error
            return true
        } catch (error) {
            console.error('Error deleting medication:', error)
            throw error
        }
    }

    // ========== IMAGE HANDLING ==========

    // Upload profile picture with compression
    async uploadProfilePicture(userId, file) {
        try {
            // Compress image first
            const compressedFile = await this.compressImage(file)
            
            const fileExt = compressedFile.name.split('.').pop()
            const fileName = `${userId}-${Date.now()}.${fileExt}`

            // Upload to storage
            const { data, error } = await this.supabase.storage
                .from('profile-pics')
                .upload(fileName, compressedFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('profile-pics')
                .getPublicUrl(fileName)

            return urlData.publicUrl
        } catch (error) {
            console.error('Error uploading profile picture:', error)
            throw error
        }
    }

    // Compress image before upload
    async compressImage(file, maxSizeMB = 1) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            
            img.onload = () => {
                // Calculate new dimensions (max 800px)
                const maxSize = 800
                let { width, height } = img
                
                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width
                    width = maxSize
                } else if (height > maxSize) {
                    width = (width * maxSize) / height
                    height = maxSize
                }
                
                canvas.width = width
                canvas.height = height
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height)
                
                canvas.toBlob(
                    (blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        })
                        resolve(compressedFile)
                    },
                    'image/jpeg',
                    0.8 // 80% quality
                )
            }
            
            img.src = URL.createObjectURL(file)
        })
    }

    // Delete profile image from storage
    async deleteProfileImage(imagePath) {
        if (!imagePath) return
        
        try {
            const fileName = imagePath.split('/').pop()
            const { error } = await this.supabase.storage
                .from('profile-pics')
                .remove([fileName])
            
            if (error) console.error('Error deleting image:', error)
        } catch (error) {
            console.error('Error deleting profile image:', error)
        }
    }

    // Get profile picture URL (fallback method)
    getProfilePictureUrl(userId) {
        const { data } = this.supabase.storage
            .from('profile-pics')
            .getPublicUrl(`${userId}/profile.jpg`)
        
        return data.publicUrl
    }

    // ========== UTILITY FUNCTIONS ==========

    // Skills conversion helpers
    skillsStringToArray(skillsString) {
        if (!skillsString) return []
        return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill)
    }

    skillsArrayToString(skillsArray) {
        if (!skillsArray || !Array.isArray(skillsArray)) return ''
        return skillsArray.join(', ')
    }

    // ========== ANALYTICS ==========

    // Log user events for analytics
    async logEvent(eventType, eventData = {}) {
        try {
            const { error } = await this.supabase
                .from('medicare.user_analytics')
                .insert({
                    event_type: eventType,
                    event_data: eventData,
                    timestamp: new Date().toISOString()
                })
            
            if (error) console.error('Analytics error:', error)
        } catch (error) {
            console.error('Error logging event:', error)
        }
    }

    // ========== MEDICATIONS DATABASE ==========

    // Search medications by name, generic name, or category
    async searchMedications(searchTerm) {
        try {
            const { data, error } = await this.supabase
                .from('medicare.medications_db')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
                .limit(10)

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error searching medications:', error)
            return []
        }
    }

    // Get medication details by ID
    async getMedication(id) {
        try {
            const { data, error } = await this.supabase
                .from('medicare.medications_db')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting medication:', error)
            return null
        }
    }

    // Get all medication categories
    async getMedicationCategories() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.medications_db')
                .select('category')
                .order('category')

            if (error) throw error
            
            // Return unique categories
            const uniqueCategories = [...new Set(data.map(item => item.category))]
            return uniqueCategories
        } catch (error) {
            console.error('Error getting medication categories:', error)
            return []
        }
    }

    // ========== PHARMACIES ==========

    // Get all pharmacies
    async getAllPharmacies() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.pharmacies')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting pharmacies:', error)
            return []
        }
    }

    // Get nearby pharmacies (if location is available)
    async getNearbyPharmacies(lat, lng, radiusKm = 10) {
        try {
            // Note: This would require PostGIS extension for actual distance calculation
            // For now, return all pharmacies
            const { data, error } = await this.supabase
                .from('medicare.pharmacies')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting nearby pharmacies:', error)
            return []
        }
    }

    // ========== NOTIFICATIONS ==========

    // Get user notifications
    async getUserNotifications(userId, limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('medicare.system_notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting notifications:', error)
            return []
        }
    }

    // Mark notification as read
    async markNotificationRead(notificationId) {
        try {
            const { error } = await this.supabase
                .from('medicare.system_notifications')
                .update({ read_at: new Date().toISOString() })
                .eq('id', notificationId)

            if (error) throw error
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    // Get system notifications (public announcements)
    async getSystemNotifications(limit = 5) {
        try {
            const { data, error } = await this.supabase
                .from('medicare.system_notifications')
                .select('*')
                .eq('type', 'system')
                .is('user_id', null)
                .gte('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting system notifications:', error)
            return []
        }
    }
}

// Create global database client instance
window.dbClient = new DatabaseClient()

export { supabase, DatabaseClient } 