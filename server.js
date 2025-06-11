const express = require('express')
const cors = require('cors')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://gcggnrwqilylyykppizb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4MDU2MCwiZXhwIjoyMDY1MDU2NTYwfQ.Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8Hs8'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE'

// Initialize Supabase clients
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://your-domain.com'],
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files
app.use(express.static(path.join(__dirname)))
app.use('/html', express.static(path.join(__dirname, 'html')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/images', express.static(path.join(__dirname, 'images')))

// Authentication middleware
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.substring(7)
        const { data: { user }, error } = await supabaseClient.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        res.status(500).json({ error: 'Authentication failed' })
    }
}

// ========== ROUTES ==========

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'))
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
})

// ========== AUTH ROUTES ==========

// Get current user profile
app.get('/api/auth/profile', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabaseClient
            .from('medicare.user_profiles')
            .select('*')
            .eq('id', req.user.id)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        res.json({ user: req.user, profile: data })
    } catch (error) {
        console.error('Profile fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch profile' })
    }
})

// Update user profile
app.put('/api/auth/profile', authenticateUser, async (req, res) => {
    try {
        const { full_name, phone_number, bio, address, occupation, skills } = req.body

        const profileData = {
            id: req.user.id,
            email: req.user.email,
            full_name,
            phone_number,
            bio,
            address,
            occupation,
            skills: Array.isArray(skills) ? skills : []
        }

        const { data, error } = await supabaseClient
            .from('medicare.user_profiles')
            .upsert(profileData)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, profile: data })
    } catch (error) {
        console.error('Profile update error:', error)
        res.status(500).json({ error: 'Failed to update profile' })
    }
})

// ========== MEDICATION ROUTES ==========

// Get user medications
app.get('/api/medications', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabaseClient
            .from('medicare.medication_reminders')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json({ medications: data || [] })
    } catch (error) {
        console.error('Medications fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch medications' })
    }
})

// Add medication
app.post('/api/medications', authenticateUser, async (req, res) => {
    try {
        const medicationData = {
            ...req.body,
            user_id: req.user.id,
            is_active: true
        }

        const { data, error } = await supabaseClient
            .from('medicare.medication_reminders')
            .insert(medicationData)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, medication: data })
    } catch (error) {
        console.error('Medication add error:', error)
        res.status(500).json({ error: 'Failed to add medication' })
    }
})

// Update medication
app.put('/api/medications/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const { data, error } = await supabaseClient
            .from('medicare.medication_reminders')
            .update(updates)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, medication: data })
    } catch (error) {
        console.error('Medication update error:', error)
        res.status(500).json({ error: 'Failed to update medication' })
    }
})

// Delete medication
app.delete('/api/medications/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabaseClient
            .from('medicare.medication_reminders')
            .update({ is_active: false })
            .eq('id', id)
            .eq('user_id', req.user.id)

        if (error) throw error

        res.json({ success: true })
    } catch (error) {
        console.error('Medication delete error:', error)
        res.status(500).json({ error: 'Failed to delete medication' })
    }
})

// ========== APPOINTMENTS ROUTES ==========

// Get user appointments
app.get('/api/appointments', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabaseClient
            .from('medicare.medical_appointments')
            .select('*')
            .eq('user_id', req.user.id)
            .gte('appointment_date', new Date().toISOString().split('T')[0])
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true })

        if (error) throw error

        res.json({ appointments: data || [] })
    } catch (error) {
        console.error('Appointments fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch appointments' })
    }
})

// Add appointment
app.post('/api/appointments', authenticateUser, async (req, res) => {
    try {
        const appointmentData = {
            ...req.body,
            user_id: req.user.id
        }

        const { data, error } = await supabaseClient
            .from('medicare.medical_appointments')
            .insert(appointmentData)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, appointment: data })
    } catch (error) {
        console.error('Appointment add error:', error)
        res.status(500).json({ error: 'Failed to add appointment' })
    }
})

// Update appointment
app.put('/api/appointments/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const { data, error } = await supabaseClient
            .from('medicare.medical_appointments')
            .update(updates)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, appointment: data })
    } catch (error) {
        console.error('Appointment update error:', error)
        res.status(500).json({ error: 'Failed to update appointment' })
    }
})

// ========== REMINDER ROUTES ==========

// Get medication reminders
app.get('/api/reminders', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabaseClient
            .from('medicare.medication_reminders')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('is_active', true)
            .order('time', { ascending: true })

        if (error) throw error

        res.json({ reminders: data || [] })
    } catch (error) {
        console.error('Reminders fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch reminders' })
    }
})

// Add reminder
app.post('/api/reminders', authenticateUser, async (req, res) => {
    try {
        const reminderData = {
            ...req.body,
            user_id: req.user.id
        }

        const { data, error } = await supabaseClient
            .from('medication_reminders')
            .insert(reminderData)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, reminder: data })
    } catch (error) {
        console.error('Reminder add error:', error)
        res.status(500).json({ error: 'Failed to add reminder' })
    }
})

// ========== PHARMACY ROUTES ==========

// Get nearby pharmacies
app.get('/api/pharmacies/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude required' })
        }

        // This would typically use a geospatial query
        // For now, return mock data
        const mockPharmacies = [
            {
                id: 1,
                name: "HealthPlus Pharmacy",
                address: "123 Main St, Colombo",
                phone: "+94 11 234 5678",
                distance: 0.5,
                is_open: true,
                hours: "8:00 AM - 10:00 PM"
            },
            {
                id: 2,
                name: "MediCare Pharmacy",
                address: "456 Galle Rd, Colombo",
                phone: "+94 11 345 6789",
                distance: 1.2,
                is_open: true,
                hours: "24 Hours"
            }
        ]

        res.json({ pharmacies: mockPharmacies })
    } catch (error) {
        console.error('Pharmacies fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch pharmacies' })
    }
})

// ========== NOTIFICATION ROUTES ==========

// Get user notifications
app.get('/api/notifications', authenticateUser, async (req, res) => {
    try {
        const { limit = 10 } = req.query

        const { data, error } = await supabaseClient
            .from('medicare.system_notifications')
            .select('*')
            .or(`user_id.eq.${req.user.id},user_id.is.null`)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error

        res.json({ notifications: data || [] })
    } catch (error) {
        console.error('Notifications fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch notifications' })
    }
})

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params

        const { data, error } = await supabaseClient
            .from('medicare.system_notifications')
            .update({ 
                is_read: true,
                read_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, notification: data })
    } catch (error) {
        console.error('Notification update error:', error)
        res.status(500).json({ error: 'Failed to update notification' })
    }
})

// ========== FILE UPLOAD ROUTES ==========

// Upload profile picture
app.post('/api/upload/profile-picture', authenticateUser, async (req, res) => {
    try {
        const { file, fileName } = req.body

        if (!file || !fileName) {
            return res.status(400).json({ error: 'File and fileName required' })
        }

        // Convert base64 to buffer
        const fileBuffer = Buffer.from(file.split(',')[1], 'base64')
        const filePath = `profiles/${req.user.id}/${fileName}`

        const { data, error } = await supabaseClient.storage
            .from('profile-pictures')
            .upload(filePath, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: true
            })

        if (error) throw error

        const { data: { publicUrl } } = supabaseClient.storage
            .from('profile-pictures')
            .getPublicUrl(filePath)

        res.json({ success: true, url: publicUrl })
    } catch (error) {
        console.error('File upload error:', error)
        res.status(500).json({ error: 'Failed to upload file' })
    }
})

// ========== ERROR HANDLING ==========

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'html', '404.html'))
})

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error:', error)
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🏥 Medicare Web App Server running on port ${PORT}`)
    console.log(`📱 Access the app at: http://localhost:${PORT}`)
    console.log(`🔗 Supabase URL: ${supabaseUrl}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

module.exports = app 