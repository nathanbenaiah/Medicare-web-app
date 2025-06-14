/**
 * COMPREHENSIVE HEALTHCARE BACKEND API
 * Complete backend support for all dashboard features
 * Supports both User Dashboard and Provider Dashboard functionality
 */

class ComprehensiveHealthcareBackend {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.demoMode = true;
        this.eventListeners = new Map();
        this.cache = new Map();
        this.rateLimiter = new Map();
        
        // Configuration
        this.config = {
            supabaseUrl: 'your-supabase-url',
            supabaseKey: 'your-supabase-anon-key',
            demoMode: true,
            cacheTimeout: 300000, // 5 minutes
            rateLimit: {
                requests: 100,
                window: 60000 // 1 minute
            }
        };
    }

    // =====================================================
    // INITIALIZATION & CONFIGURATION
    // =====================================================

    async initialize(config = {}) {
        try {
            console.log('🚀 Initializing Comprehensive Healthcare Backend...');
            
            // Merge configuration
            this.config = { ...this.config, ...config };
            
            // Initialize Supabase if credentials provided
            if (this.config.supabaseUrl && this.config.supabaseKey && 
                this.config.supabaseUrl !== 'your-supabase-url') {
                
                this.supabase = window.supabase.createClient(
                    this.config.supabaseUrl,
                    this.config.supabaseKey
                );
                
                // Test connection
                const { data, error } = await this.supabase.from('user_profiles').select('count').limit(1);
                if (!error) {
                    this.demoMode = false;
                    console.log('✅ Connected to Supabase database');
                }
            }
            
            if (this.demoMode) {
                console.log('📱 Running in demo mode');
                this.initializeDemoData();
            }
            
            this.isInitialized = true;
            console.log('✅ Healthcare Backend initialized successfully');
            
            return { success: true, demoMode: this.demoMode };
            
        } catch (error) {
            console.error('❌ Backend initialization failed:', error);
            this.demoMode = true;
            this.initializeDemoData();
            return { success: false, error: error.message, demoMode: true };
        }
    }

    initializeDemoData() {
        // Initialize demo data for all features
        this.demoData = {
            currentUser: {
                id: 'demo-user-123',
                type: 'patient', // or 'provider'
                profile: {
                    first_name: 'John',
                    last_name: 'Smith',
                    email: 'john.smith@email.com',
                    phone_primary: '+94-77-1234567',
                    date_of_birth: '1985-06-15',
                    gender: 'male',
                    blood_type: 'O+',
                    height_cm: 175,
                    weight_kg: 70
                }
            },
            appointments: [
                {
                    id: 'apt-001',
                    patient_id: 'demo-user-123',
                    provider_id: 'prov-001',
                    provider_name: 'Dr. Sarah Johnson',
                    appointment_type: 'consultation',
                    scheduled_date: '2024-12-20',
                    scheduled_time: '10:00',
                    status: 'scheduled',
                    department: 'Cardiology',
                    notes: 'Regular checkup'
                },
                {
                    id: 'apt-002',
                    patient_id: 'demo-user-123',
                    provider_id: 'prov-002',
                    provider_name: 'Dr. Michael Chen',
                    appointment_type: 'follow_up',
                    scheduled_date: '2024-12-25',
                    scheduled_time: '14:30',
                    status: 'confirmed',
                    department: 'General Medicine',
                    notes: 'Follow-up for blood pressure'
                }
            ],
            medications: [
                {
                    id: 'med-001',
                    patient_id: 'demo-user-123',
                    medication_name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    status: 'active',
                    prescribed_date: '2024-12-01',
                    prescribed_by: 'Dr. Sarah Johnson',
                    instructions: 'Take with food'
                },
                {
                    id: 'med-002',
                    patient_id: 'demo-user-123',
                    medication_name: 'Metformin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    status: 'active',
                    prescribed_date: '2024-11-15',
                    prescribed_by: 'Dr. Michael Chen',
                    instructions: 'Take with meals'
                }
            ],
            vitalSigns: [
                {
                    id: 'vital-001',
                    patient_id: 'demo-user-123',
                    blood_pressure_systolic: 120,
                    blood_pressure_diastolic: 80,
                    heart_rate: 72,
                    temperature: 98.6,
                    weight: 70,
                    recorded_at: '2024-12-15T10:30:00Z'
                },
                {
                    id: 'vital-002',
                    patient_id: 'demo-user-123',
                    blood_pressure_systolic: 118,
                    blood_pressure_diastolic: 78,
                    heart_rate: 68,
                    temperature: 98.4,
                    weight: 69.5,
                    recorded_at: '2024-12-10T09:15:00Z'
                }
            ],
            labOrders: [
                {
                    id: 'lab-001',
                    patient_id: 'demo-user-123',
                    test_name: 'Complete Blood Count',
                    status: 'completed',
                    ordered_date: '2024-12-10',
                    result_date: '2024-12-12',
                    provider_name: 'Dr. Sarah Johnson',
                    results: {
                        wbc: '7.2 K/uL',
                        rbc: '4.5 M/uL',
                        hemoglobin: '14.2 g/dL',
                        hematocrit: '42%'
                    }
                }
            ],
            consultations: [
                {
                    id: 'cons-001',
                    patient_id: 'demo-user-123',
                    provider_id: 'prov-001',
                    consultation_date: '2024-12-10',
                    chief_complaint: 'Chest pain',
                    diagnosis: 'Mild hypertension',
                    treatment_plan: 'Lifestyle modifications and medication',
                    follow_up_required: true
                }
            ],
            aiInsights: [
                {
                    id: 'ai-001',
                    patient_id: 'demo-user-123',
                    title: 'Blood Pressure Trend Analysis',
                    description: 'Your blood pressure has been consistently in the normal range',
                    recommendation: 'Continue current medication and lifestyle habits',
                    severity: 'low',
                    created_at: '2024-12-15T08:00:00Z'
                }
            ],
            billing: [
                {
                    id: 'bill-001',
                    patient_id: 'demo-user-123',
                    service_description: 'Cardiology Consultation',
                    amount: 150.00,
                    status: 'paid',
                    date: '2024-12-10'
                }
            ],
            providers: [
                {
                    id: 'prov-001',
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    specialization: 'Cardiology',
                    organization: 'MediCare+ General Hospital',
                    department: 'Cardiology',
                    rating: 4.8,
                    experience_years: 12
                }
            ]
        };
    }

    // =====================================================
    // USER MANAGEMENT
    // =====================================================

    async getCurrentUser() {
        if (this.demoMode) {
            return { success: true, data: this.demoData.currentUser };
        }

        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;

            if (user) {
                const { data: profile } = await this.supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                return { success: true, data: { ...user, profile } };
            }

            return { success: false, error: 'No user found' };
        } catch (error) {
            console.error('❌ Get current user failed:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUserProfile(userId, updates) {
        if (this.demoMode) {
            this.demoData.currentUser.profile = { ...this.demoData.currentUser.profile, ...updates };
            return { success: true, data: this.demoData.currentUser.profile };
        }

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .update(updates)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Update user profile failed:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================================================
    // APPOINTMENT MANAGEMENT
    // =====================================================

    async getAppointments(userId, filters = {}) {
        if (this.demoMode) {
            let appointments = [...this.demoData.appointments];
            
            // Apply filters
            if (filters.status) {
                appointments = appointments.filter(apt => apt.status === filters.status);
            }
            if (filters.date) {
                appointments = appointments.filter(apt => apt.scheduled_date === filters.date);
            }
            
            return { success: true, data: appointments };
        }

        try {
            let query = this.supabase
                .from('appointments')
                .select(`
                    *,
                    healthcare_providers!provider_id (
                        user_profiles!user_id (first_name, last_name)
                    ),
                    departments (name)
                `)
                .eq('patient_id', userId);

            if (filters.status) query = query.eq('status', filters.status);
            if (filters.date) query = query.eq('scheduled_date', filters.date);

            const { data, error } = await query.order('scheduled_date', { ascending: true });
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Get appointments failed:', error);
            return { success: false, error: error.message };
        }
    }

    async createAppointment(appointmentData) {
        if (this.demoMode) {
            const newAppointment = {
                id: `apt-${Date.now()}`,
                ...appointmentData,
                status: 'scheduled',
                created_at: new Date().toISOString()
            };
            this.demoData.appointments.push(newAppointment);
            return { success: true, data: newAppointment };
        }

        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .insert(appointmentData)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Create appointment failed:', error);
            return { success: false, error: error.message };
        }
    }

    async updateAppointment(appointmentId, updates) {
        if (this.demoMode) {
            const index = this.demoData.appointments.findIndex(apt => apt.id === appointmentId);
            if (index !== -1) {
                this.demoData.appointments[index] = { ...this.demoData.appointments[index], ...updates };
                return { success: true, data: this.demoData.appointments[index] };
            }
            return { success: false, error: 'Appointment not found' };
        }

        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .update(updates)
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Update appointment failed:', error);
            return { success: false, error: error.message };
        }
    }

    async cancelAppointment(appointmentId, reason) {
        return this.updateAppointment(appointmentId, {
            status: 'cancelled',
            cancellation_reason: reason,
            cancellation_date: new Date().toISOString()
        });
    }

    // =====================================================
    // MEDICATION MANAGEMENT
    // =====================================================

    async getMedications(userId, activeOnly = true) {
        if (this.demoMode) {
            let medications = [...this.demoData.medications];
            if (activeOnly) {
                medications = medications.filter(med => med.status === 'active');
            }
            return { success: true, data: medications };
        }

        try {
            let query = this.supabase
                .from('prescriptions')
                .select(`
                    *,
                    medications (medication_name, generic_name, dosage_form),
                    healthcare_providers!provider_id (
                        user_profiles!user_id (first_name, last_name)
                    )
                `)
                .eq('patient_id', userId);

            if (activeOnly) query = query.eq('status', 'active');

            const { data, error } = await query.order('prescription_date', { ascending: false });
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Get medications failed:', error);
            return { success: false, error: error.message };
        }
    }

    async addMedication(medicationData) {
        if (this.demoMode) {
            const newMedication = {
                id: `med-${Date.now()}`,
                ...medicationData,
                status: 'active',
                prescribed_date: new Date().toISOString().split('T')[0]
            };
            this.demoData.medications.push(newMedication);
            return { success: true, data: newMedication };
        }

        try {
            const { data, error } = await this.supabase
                .from('prescriptions')
                .insert(medicationData)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Add medication failed:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================================================
    // VITAL SIGNS MANAGEMENT
    // =====================================================

    async getVitalSigns(userId, limit = 50) {
        if (this.demoMode) {
            return { success: true, data: this.demoData.vitalSigns.slice(0, limit) };
        }

        try {
            const { data, error } = await this.supabase
                .from('vital_signs')
                .select('*')
                .eq('user_id', userId)
                .order('recorded_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Get vital signs failed:', error);
            return { success: false, error: error.message };
        }
    }

    async recordVitalSigns(vitalData) {
        if (this.demoMode) {
            const newVital = {
                id: `vital-${Date.now()}`,
                ...vitalData,
                recorded_at: new Date().toISOString()
            };
            this.demoData.vitalSigns.unshift(newVital);
            return { success: true, data: newVital };
        }

        try {
            const { data, error } = await this.supabase
                .from('vital_signs')
                .insert(vitalData)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Record vital signs failed:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================================================
    // AI INSIGHTS & ANALYTICS
    // =====================================================

    async getAIInsights(userId, status = null) {
        if (this.demoMode) {
            let insights = [...this.demoData.aiInsights];
            if (status) {
                insights = insights.filter(insight => insight.status === status);
            }
            return { success: true, data: insights };
        }

        try {
            let query = this.supabase
                .from('ai_insights')
                .select('*')
                .eq('patient_id', userId);

            if (status) query = query.eq('status', status);

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Get AI insights failed:', error);
            return { success: false, error: error.message };
        }
    }

    async createAIInsight(insightData) {
        if (this.demoMode) {
            const newInsight = {
                id: `ai-${Date.now()}`,
                ...insightData,
                created_at: new Date().toISOString()
            };
            this.demoData.aiInsights.push(newInsight);
            return { success: true, data: newInsight };
        }

        try {
            const { data, error } = await this.supabase
                .from('ai_insights')
                .insert(insightData)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Create AI insight failed:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================================================
    // PROVIDER-SPECIFIC FEATURES
    // =====================================================

    async getProviderPatients(providerId, limit = 50) {
        if (this.demoMode) {
            // Return demo patients for provider
            const demoPatients = [
                {
                    id: 'patient-001',
                    patient_number: 'PAT20241201001',
                    first_name: 'John',
                    last_name: 'Smith',
                    date_of_birth: '1985-06-15',
                    gender: 'male',
                    phone_primary: '+94-77-1234567',
                    last_visit: '2024-12-10',
                    status: 'active'
                },
                {
                    id: 'patient-002',
                    patient_number: 'PAT20241201002',
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    date_of_birth: '1990-03-22',
                    gender: 'female',
                    phone_primary: '+94-77-2345678',
                    last_visit: '2024-12-08',
                    status: 'active'
                }
            ];
            return { success: true, data: demoPatients };
        }

        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .select(`
                    patients!patient_id (
                        id,
                        patient_number,
                        user_profiles!user_id (first_name, last_name, date_of_birth, gender, phone_primary)
                    )
                `)
                .eq('provider_id', providerId)
                .limit(limit);

            if (error) throw error;

            // Remove duplicates and flatten structure
            const uniquePatients = [];
            const seenIds = new Set();
            
            data.forEach(appointment => {
                const patient = appointment.patients;
                if (patient && !seenIds.has(patient.id)) {
                    seenIds.add(patient.id);
                    uniquePatients.push({
                        ...patient,
                        ...patient.user_profiles
                    });
                }
            });

            return { success: true, data: uniquePatients };
        } catch (error) {
            console.error('❌ Get provider patients failed:', error);
            return { success: false, error: error.message };
        }
    }

    async getProviderSchedule(providerId, date = null) {
        if (this.demoMode) {
            const demoSchedule = [
                {
                    id: 'apt-001',
                    patient_name: 'John Smith',
                    appointment_type: 'consultation',
                    scheduled_time: '09:00',
                    duration: 30,
                    status: 'scheduled'
                },
                {
                    id: 'apt-002',
                    patient_name: 'Sarah Johnson',
                    appointment_type: 'follow_up',
                    scheduled_time: '10:30',
                    duration: 20,
                    status: 'confirmed'
                }
            ];
            return { success: true, data: demoSchedule };
        }

        try {
            let query = this.supabase
                .from('appointments')
                .select(`
                    *,
                    patients!patient_id (
                        user_profiles!user_id (first_name, last_name)
                    )
                `)
                .eq('provider_id', providerId);

            if (date) {
                query = query.eq('scheduled_date', date);
            } else {
                query = query.gte('scheduled_date', new Date().toISOString().split('T')[0]);
            }

            const { data, error } = await query.order('scheduled_time', { ascending: true });
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Get provider schedule failed:', error);
            return { success: false, error: error.message };
        }
    }

    async getProviderStats(providerId, timeRange = '30d') {
        if (this.demoMode) {
            return {
                success: true,
                data: {
                    total_patients: 45,
                    appointments_today: 8,
                    appointments_this_week: 32,
                    pending_reviews: 5,
                    revenue_this_month: 12500,
                    patient_satisfaction: 4.8
                }
            };
        }

        try {
            const now = new Date();
            const days = parseInt(timeRange.replace('d', ''));
            const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

            // Get appointment stats
            const { data: appointments, error: aptError } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('provider_id', providerId)
                .gte('scheduled_date', startDate.toISOString().split('T')[0]);

            if (aptError) throw aptError;

            // Calculate stats
            const stats = {
                total_appointments: appointments.length,
                completed_appointments: appointments.filter(apt => apt.status === 'completed').length,
                cancelled_appointments: appointments.filter(apt => apt.status === 'cancelled').length,
                no_show_appointments: appointments.filter(apt => apt.status === 'no_show').length
            };

            return { success: true, data: stats };
        } catch (error) {
            console.error('❌ Get provider stats failed:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================================================
    // ANALYTICS & REPORTING
    // =====================================================

    async getDashboardAnalytics(userId, userType = 'patient') {
        if (this.demoMode) {
            if (userType === 'patient') {
                return {
                    success: true,
                    data: {
                        appointments: { total: 12, upcoming: 3, completed: 9 },
                        medications: { active: 5, total: 8 },
                        vitals: { recorded: 15, last_recorded: '2024-12-15' },
                        insights: { new: 2, total: 8 }
                    }
                };
            } else {
                return {
                    success: true,
                    data: {
                        patients: { total: 45, new_this_month: 8 },
                        appointments: { today: 8, this_week: 32 },
                        revenue: { this_month: 12500, last_month: 11200 },
                        satisfaction: { rating: 4.8, reviews: 156 }
                    }
                };
            }
        }

        // Implement real analytics based on user type
        try {
            if (userType === 'patient') {
                return await this.getPatientAnalytics(userId);
            } else {
                return await this.getProviderAnalytics(userId);
            }
        } catch (error) {
            console.error('❌ Get dashboard analytics failed:', error);
            return { success: false, error: error.message };
        }
    }

    async getPatientAnalytics(userId) {
        // Implement patient-specific analytics
        const [appointments, medications, vitals, insights] = await Promise.all([
            this.getAppointments(userId),
            this.getMedications(userId),
            this.getVitalSigns(userId, 10),
            this.getAIInsights(userId)
        ]);

        return {
            success: true,
            data: {
                appointments: {
                    total: appointments.data?.length || 0,
                    upcoming: appointments.data?.filter(apt => apt.status === 'scheduled').length || 0,
                    completed: appointments.data?.filter(apt => apt.status === 'completed').length || 0
                },
                medications: {
                    active: medications.data?.filter(med => med.status === 'active').length || 0,
                    total: medications.data?.length || 0
                },
                vitals: {
                    recorded: vitals.data?.length || 0,
                    last_recorded: vitals.data?.[0]?.recorded_at || null
                },
                insights: {
                    new: insights.data?.filter(insight => insight.status === 'new').length || 0,
                    total: insights.data?.length || 0
                }
            }
        };
    }

    async getProviderAnalytics(providerId) {
        // Implement provider-specific analytics
        const [patients, schedule, stats] = await Promise.all([
            this.getProviderPatients(providerId),
            this.getProviderSchedule(providerId),
            this.getProviderStats(providerId)
        ]);

        return {
            success: true,
            data: {
                patients: {
                    total: patients.data?.length || 0
                },
                appointments: {
                    today: schedule.data?.length || 0
                },
                stats: stats.data || {}
            }
        };
    }

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================

    async executeSQL(query, params = []) {
        if (this.demoMode) {
            console.log('Demo mode: SQL query would be executed:', query);
            return { success: true, data: [] };
        }

        try {
            const { data, error } = await this.supabase.rpc('execute_sql', {
                query: query,
                params: params
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ SQL execution failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Event handling
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('❌ Event callback error:', error);
                }
            });
        }
    }

    // Cache management
    setCache(key, value, timeout = this.config.cacheTimeout) {
        this.cache.set(key, {
            value,
            expires: Date.now() + timeout
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expires > Date.now()) {
            return cached.value;
        }
        this.cache.delete(key);
        return null;
    }

    clearCache() {
        this.cache.clear();
    }

    // Rate limiting
    checkRateLimit(identifier = 'global') {
        const now = Date.now();
        const windowStart = now - this.config.rateLimit.window;
        
        if (!this.rateLimiter.has(identifier)) {
            this.rateLimiter.set(identifier, []);
        }
        
        const requests = this.rateLimiter.get(identifier);
        
        // Remove old requests
        while (requests.length > 0 && requests[0] < windowStart) {
            requests.shift();
        }
        
        // Check if limit exceeded
        if (requests.length >= this.config.rateLimit.requests) {
            return false;
        }
        
        // Add current request
        requests.push(now);
        return true;
    }

    // Health check
    async performHealthCheck() {
        try {
            if (this.demoMode) {
                return {
                    status: 'healthy',
                    mode: 'demo',
                    timestamp: new Date().toISOString()
                };
            }

            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('count')
                .limit(1);

            return {
                status: error ? 'unhealthy' : 'healthy',
                mode: 'production',
                database: error ? 'disconnected' : 'connected',
                timestamp: new Date().toISOString(),
                error: error?.message
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                mode: this.demoMode ? 'demo' : 'production',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveHealthcareBackend;
} else if (typeof window !== 'undefined') {
    window.ComprehensiveHealthcareBackend = ComprehensiveHealthcareBackend;
} 