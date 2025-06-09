// Database client initialization for Supabase
// Uses environment variables for production deployment
const SUPABASE_URL = window?.process?.env?.VITE_SUPABASE_URL || 'https://gcggnrwqilylykppizb.supabase.co'
const SUPABASE_ANON_KEY = window?.process?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHlrcHBpemIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzIxMzgzNiwiZXhwIjoyMDUyNzg5ODM2fQ.LzgHWMlVzLKmP3cEYdwv5mVSUjRJU8VCCCgCMN_eVkc'

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
    
    // Check if user profile exists and is complete using SQL function
    async checkUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .rpc('medicare.is_user_profile_complete', { user_uuid: userId })

            if (error && error.code !== 'PGRST116') {
                throw error
            }

            return data
        } catch (error) {
            console.error('Error checking user profile:', error)
            return null
        }
    }

    // Get user profile with computed fields
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .rpc('medicare.get_user_profile', { user_uuid: userId })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error getting user profile:', error)
            return null
        }
    }

    // Create or update user profile using SQL function
    async createUserProfile(userData) {
        try {
            const { data, error } = await this.supabase
                .rpc('medicare.create_user_profile', {
                    p_id: userData.id,
                    p_full_name: userData.full_name,
                    p_phone_number: userData.phone_number,
                    p_bio: userData.bio,
                    p_address: userData.address,
                    p_occupation: userData.occupation,
                    p_skills: this.skillsStringToArray(userData.skills),
                    p_profile_picture: userData.profile_picture
                })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error creating user profile:', error)
            throw error
        }
    }

    // Update user profile using SQL function
    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .rpc('medicare.update_user_profile', {
                    p_user_id: userId,
                    p_full_name: updates.full_name,
                    p_phone_number: updates.phone_number,
                    p_bio: updates.bio,
                    p_address: updates.address,
                    p_occupation: updates.occupation,
                    p_skills: Array.isArray(updates.skills) ? updates.skills : this.skillsStringToArray(updates.skills),
                    p_profile_picture: updates.profile_picture
                })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error updating user profile:', error)
            throw error
        }
    }

    // Validate profile data server-side
    async validateProfileData(profileData) {
        try {
            const { data, error } = await this.supabase
                .rpc('medicare.validate_profile_data', { profile_data: profileData })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error validating profile data:', error)
            return { valid: false, errors: ['Validation failed'] }
        }
    }

    // Find users by skills
    async findUsersBySkills(skillsArray) {
        try {
            const { data, error } = await this.supabase
                .rpc('medicare.find_users_by_skills', { search_skills: skillsArray })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error finding users by skills:', error)
            return []
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