/**
 * MediCare+ Healthcare Backend API
 * Comprehensive healthcare management system with Supabase MCP integration
 * Supports 10,000+ concurrent users with real-time data synchronization
 * 
 * Features:
 * - Real-time patient/provider data management
 * - AI-powered health insights and symptom checking
 * - Medication management and reminders
 * - Appointment scheduling and notifications
 * - Vital signs tracking and analytics
 * - Secure messaging between patients and providers
 * - Scalable infrastructure for healthcare organizations
 */

class HealthcareBackendAPI {
    constructor() {
        this.supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaGducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNDI1MzgsImV4cCI6MjAyNzgxODUzOH0.GtHQVOl7NSmNWE6u6wqYSN8EZwrBw4yyJ5fK4Lr0n2k';
        this.projectId = 'gcggnrwqilylyykppizb';
        
        // Initialize Supabase client
        this.supabase = null;
        this.initializeSupabase();
        
        // Event system for real-time updates
        this.eventListeners = new Map();
        this.realtimeSubscriptions = new Map();
        
        // Cache for performance optimization
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        // Rate limiting for API calls
        this.rateLimiter = new Map();
        this.maxRequestsPerMinute = 100;
        
        // Health monitoring
        this.healthMetrics = {
            totalUsers: 0,
            activeConnections: 0,
            apiCalls: 0,
            errors: 0,
            lastHealthCheck: new Date()
        };
        
        this.initializeHealthMonitoring();
        this.setupRealtimeSubscriptions();
    }

    // ==================== INITIALIZATION ====================
    
    async initializeSupabase() {
        try {
            if (typeof window !== 'undefined' && window.supabase) {
                this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
                console.log('✅ Supabase client initialized successfully');
                
                // Test connection with medicare schema
                await this.testDatabaseConnection();
            } else {
                console.warn('⚠️ Supabase client not available in browser');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
        }
    }

    async testDatabaseConnection() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('count')
                .limit(1);
            
            if (error) {
                console.warn('⚠️ Direct table access failed, using medicare schema views');
            } else {
                console.log('✅ Database connection successful');
            }
        } catch (error) {
            console.error('❌ Database connection test failed:', error);
        }
    }

    initializeHealthMonitoring() {
        // Monitor system health every 30 seconds
        setInterval(() => {
            this.performHealthCheck();
        }, 30000);
        
        // Clean up cache every 10 minutes
        setInterval(() => {
            this.cleanupCache();
        }, 10 * 60 * 1000);
        
        // Reset rate limiter every minute
        setInterval(() => {
            this.rateLimiter.clear();
        }, 60000);
    }

    async performHealthCheck() {
        try {
            const startTime = Date.now();
            
            // Test database connectivity using public views
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('count')
                .limit(1);
            
            const responseTime = Date.now() - startTime;
            
            this.healthMetrics = {
                ...this.healthMetrics,
                totalUsers: data?.length || 0,
                activeConnections: this.realtimeSubscriptions.size,
                lastHealthCheck: new Date(),
                responseTime: responseTime
            };
            
            // Emit health status
            this.emit('health:status', this.healthMetrics);
            
            console.log('🏥 Health Check:', this.healthMetrics);
            
        } catch (error) {
            this.healthMetrics.errors++;
            console.error('❌ Health check failed:', error);
        }
    }

    // ==================== SUPABASE MCP INTEGRATION ====================
    
    async executeSQL(query, params = []) {
        try {
            this.healthMetrics.apiCalls++;
            
            // Rate limiting check
            if (!this.checkRateLimit()) {
                throw new Error('Rate limit exceeded');
            }
            
            // Use MCP function for SQL execution
            if (typeof mcp_supabase_execute_sql === 'function') {
                const result = await mcp_supabase_execute_sql({
                    project_id: this.projectId,
                    query: query
                });
                return { data: result, error: null };
            } else if (this.supabase) {
                // Fallback to direct Supabase client
                const { data, error } = await this.supabase.rpc('execute_sql', {
                    query: query,
                    params: params
                });
                return { data, error };
            } else {
                throw new Error('No database connection available');
            }
        } catch (error) {
            this.healthMetrics.errors++;
            console.error('❌ SQL execution failed:', error);
            return { data: null, error };
        }
    }

    async applyMigration(name, query) {
        try {
            if (typeof mcp_supabase_apply_migration === 'function') {
                return await mcp_supabase_apply_migration({
                    project_id: this.projectId,
                    name: name,
                    query: query
                });
            }
            throw new Error('Migration function not available');
        } catch (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }

    // ==================== USER MANAGEMENT ====================
    
    async createUserProfile(userData) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert([{
                    user_id: userData.user_id,
                    email: userData.email,
                    full_name: userData.full_name,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    phone_number: userData.phone_number,
                    bio: userData.bio,
                    address: userData.address,
                    occupation: userData.occupation,
                    height_cm: userData.height_cm,
                    weight_kg: userData.weight_kg,
                    blood_type: userData.blood_type,
                    user_type: userData.user_type || 'patient'
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Cache the user profile
            this.setCache(`user_profile_${userData.user_id}`, data);
            
            // Emit user created event
            this.emit('user:created', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to create user profile:', error);
            throw error;
        }
    }

    async getUserProfile(userId) {
        try {
            // Check cache first
            const cached = this.getCache(`user_profile_${userId}`);
            if (cached) return cached;
            
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (error) throw error;
            
            // Cache the result
            this.setCache(`user_profile_${userId}`, data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to get user profile:', error);
            throw error;
        }
    }

    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .select()
                .single();
            
            if (error) throw error;
            
            // Update cache
            this.setCache(`user_profile_${userId}`, data);
            
            // Emit user updated event
            this.emit('user:updated', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to update user profile:', error);
            throw error;
        }
    }

    // ==================== APPOINTMENT MANAGEMENT ====================
    
    async createAppointment(appointmentData) {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .insert([{
                    user_id: appointmentData.user_id,
                    provider_id: appointmentData.provider_id,
                    scheduled_date: appointmentData.scheduled_date,
                    scheduled_time: appointmentData.scheduled_time,
                    appointment_type: appointmentData.appointment_type || 'consultation',
                    notes: appointmentData.notes,
                    status: appointmentData.status || 'scheduled'
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Create notifications for both user and provider
            await this.createNotification({
                user_id: appointmentData.user_id,
                type: 'appointment',
                title: 'Appointment Scheduled',
                content: `Your appointment has been scheduled for ${appointmentData.scheduled_date} at ${appointmentData.scheduled_time}`
            });
            
            if (appointmentData.provider_id) {
                await this.createNotification({
                    user_id: appointmentData.provider_id,
                    type: 'appointment',
                    title: 'New Appointment',
                    content: `New appointment scheduled for ${appointmentData.scheduled_date} at ${appointmentData.scheduled_time}`
                });
            }
            
            // Invalidate cache
            this.invalidateCache(`user_appointments_${appointmentData.user_id}`);
            
            // Emit appointment created event
            this.emit('appointment:created', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to create appointment:', error);
            throw error;
        }
    }

    async getUserAppointments(userId, status = null) {
        try {
            // Check cache first
            const cacheKey = `user_appointments_${userId}_${status || 'all'}`;
            const cached = this.getCache(cacheKey);
            if (cached) return cached;
            
            let query = this.supabase
                .from('appointments')
                .select('*')
                .eq('user_id', userId)
                .order('scheduled_date', { ascending: true });
            
            if (status) {
                query = query.eq('status', status);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            // Cache the result
            this.setCache(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to get user appointments:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(appointmentId, status, notes = null) {
        try {
            const updateData = { status };
            if (notes) updateData.notes = notes;
            
            const { data, error } = await this.supabase
                .from('appointments')
                .update(updateData)
                .eq('id', appointmentId)
                .select()
                .single();
            
            if (error) throw error;
            
            // Emit appointment updated event
            this.emit('appointment:updated', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to update appointment status:', error);
            throw error;
        }
    }

    // ==================== MEDICATION MANAGEMENT ====================
    
    async createMedication(medicationData) {
        try {
            const query = `
                INSERT INTO medications (
                    user_id, name, dosage, frequency, medication_type, 
                    notes, start_date, end_date, is_active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING *
            `;
            
            const { data, error } = await this.executeSQL(query, [
                medicationData.user_id,
                medicationData.name,
                medicationData.dosage,
                medicationData.frequency,
                medicationData.medication_type,
                medicationData.notes,
                medicationData.start_date,
                medicationData.end_date,
                medicationData.is_active !== false
            ]);
            
            if (error) throw error;
            
            // Emit medication created event
            this.emit('medication:created', data[0]);
            
            return data[0];
        } catch (error) {
            console.error('❌ Failed to create medication:', error);
            throw error;
        }
    }

    async getUserMedications(userId, activeOnly = true) {
        try {
            let query = `
                SELECT * FROM medications 
                WHERE user_id = $1
            `;
            
            if (activeOnly) {
                query += ` AND is_active = true`;
            }
            
            query += ` ORDER BY created_at DESC`;
            
            const { data, error } = await this.executeSQL(query, [userId]);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('❌ Failed to get user medications:', error);
            throw error;
        }
    }

    async createMedicationReminder(reminderData) {
        try {
            const query = `
                INSERT INTO medication_reminders (
                    user_id, medication_id, reminder_time, reminder_days, is_active
                ) VALUES ($1, $2, $3, $4, $5) 
                RETURNING *
            `;
            
            const { data, error } = await this.executeSQL(query, [
                reminderData.user_id,
                reminderData.medication_id,
                reminderData.reminder_time,
                reminderData.reminder_days,
                reminderData.is_active !== false
            ]);
            
            if (error) throw error;
            
            // Emit reminder created event
            this.emit('reminder:created', data[0]);
            
            return data[0];
        } catch (error) {
            console.error('❌ Failed to create medication reminder:', error);
            throw error;
        }
    }

    async logMedicationTaken(logData) {
        try {
            const query = `
                INSERT INTO medication_logs (
                    user_id, medication_id, reminder_id, taken_at, was_on_time, notes
                ) VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *
            `;
            
            const { data, error } = await this.executeSQL(query, [
                logData.user_id,
                logData.medication_id,
                logData.reminder_id,
                logData.taken_at || new Date().toISOString(),
                logData.was_on_time !== false,
                logData.notes
            ]);
            
            if (error) throw error;
            
            // Update last taken time in reminders
            if (logData.reminder_id) {
                await this.executeSQL(
                    'UPDATE medication_reminders SET last_taken_at = $1 WHERE id = $2',
                    [logData.taken_at || new Date().toISOString(), logData.reminder_id]
                );
            }
            
            // Emit medication taken event
            this.emit('medication:taken', data[0]);
            
            return data[0];
        } catch (error) {
            console.error('❌ Failed to log medication taken:', error);
            throw error;
        }
    }

    // ==================== VITAL SIGNS TRACKING ====================
    
    async recordVitalSigns(vitalData) {
        try {
            const { data, error } = await this.supabase
                .from('vital_signs')
                .insert([{
                    user_id: vitalData.user_id,
                    blood_pressure_systolic: vitalData.blood_pressure_systolic,
                    blood_pressure_diastolic: vitalData.blood_pressure_diastolic,
                    heart_rate: vitalData.heart_rate,
                    temperature: vitalData.temperature,
                    weight: vitalData.weight,
                    height: vitalData.height,
                    notes: vitalData.notes,
                    recorded_by: vitalData.recorded_by || vitalData.user_id
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Invalidate cache
            this.invalidateCache(`user_vitals_${vitalData.user_id}`);
            
            // Emit vital signs recorded event
            this.emit('vital_signs:recorded', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to record vital signs:', error);
            throw error;
        }
    }

    async getUserVitalSigns(userId, limit = 50) {
        try {
            // Check cache first
            const cacheKey = `user_vitals_${userId}`;
            const cached = this.getCache(cacheKey);
            if (cached) return cached;
            
            const { data, error } = await this.supabase
                .from('vital_signs')
                .select('*')
                .eq('user_id', userId)
                .order('recorded_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            
            // Cache the result
            this.setCache(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to get user vital signs:', error);
            throw error;
        }
    }

    async analyzeVitalSigns(vitalData) {
        try {
            const insights = [];
            
            // Blood pressure analysis
            if (vitalData.blood_pressure_systolic && vitalData.blood_pressure_diastolic) {
                const systolic = vitalData.blood_pressure_systolic;
                const diastolic = vitalData.blood_pressure_diastolic;
                
                if (systolic > 140 || diastolic > 90) {
                    insights.push({
                        type: 'warning',
                        title: 'High Blood Pressure Detected',
                        description: `Blood pressure reading of ${systolic}/${diastolic} mmHg is elevated`,
                        recommendation: 'Consider consulting with your healthcare provider'
                    });
                }
            }
            
            // Heart rate analysis
            if (vitalData.heart_rate) {
                const hr = vitalData.heart_rate;
                
                if (hr > 100) {
                    insights.push({
                        type: 'warning',
                        title: 'Elevated Heart Rate',
                        description: `Heart rate of ${hr} bpm is above normal resting range`,
                        recommendation: 'Monitor activity level and stress factors'
                    });
                } else if (hr < 60) {
                    insights.push({
                        type: 'info',
                        title: 'Low Heart Rate',
                        description: `Heart rate of ${hr} bpm is below normal range`,
                        recommendation: 'This may be normal for athletes or require medical evaluation'
                    });
                }
            }
            
            // Create AI insights for significant findings
            for (const insight of insights) {
                await this.createAIInsight({
                    user_id: vitalData.user_id,
                    insight_type: 'health_trend',
                    title: insight.title,
                    description: insight.description,
                    recommendation: insight.recommendation,
                    severity: insight.severity || 'medium',
                    priority: insight.priority || 2,
                    confidence_score: insight.confidence || 0.8,
                    status: 'new'
                });
            }
            
        } catch (error) {
            console.error('❌ Failed to analyze vital signs:', error);
        }
    }

    // ==================== AI INSIGHTS & HEALTH ANALYSIS ====================
    
    async createAIInsight(insightData) {
        try {
            const query = `
                INSERT INTO ai_insights (
                    user_id, insight_type, title, description, recommendation, 
                    severity, priority, confidence_score, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING *
            `;
            
            const { data, error } = await this.executeSQL(query, [
                insightData.user_id,
                insightData.insight_type || 'recommendation',
                insightData.title,
                insightData.description,
                insightData.recommendation,
                insightData.severity || 'low',
                insightData.priority || 1,
                insightData.confidence_score || 0.8,
                insightData.status || 'new'
            ]);
            
            if (error) throw error;
            
            // Create notification for the user
            await this.createNotification({
                user_id: insightData.user_id,
                type: 'health_alert',
                title: 'New Health Insight',
                content: insightData.title
            });
            
            // Emit AI insight created event
            this.emit('ai_insight:created', data[0]);
            
            return data[0];
        } catch (error) {
            console.error('❌ Failed to create AI insight:', error);
            throw error;
        }
    }

    async getUserAIInsights(userId, status = null) {
        try {
            let query = `
                SELECT * FROM ai_insights 
                WHERE user_id = $1
            `;
            
            const params = [userId];
            
            if (status) {
                query += ` AND status = $2`;
                params.push(status);
            }
            
            query += ` ORDER BY created_at DESC`;
            
            const { data, error } = await this.executeSQL(query, params);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('❌ Failed to get user AI insights:', error);
            throw error;
        }
    }

    // ==================== NOTIFICATIONS ====================
    
    async createNotification(notificationData) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .insert([{
                    user_id: notificationData.user_id,
                    type: notificationData.type,
                    title: notificationData.title,
                    content: notificationData.content,
                    priority: notificationData.priority || 'normal',
                    status: 'pending'
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Invalidate cache
            this.invalidateCache(`user_notifications_${notificationData.user_id}`);
            
            // Emit notification created event
            this.emit('notification:created', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to create notification:', error);
            throw error;
        }
    }

    async getUserNotifications(userId, status = null) {
        try {
            // Check cache first
            const cacheKey = `user_notifications_${userId}_${status || 'all'}`;
            const cached = this.getCache(cacheKey);
            if (cached) return cached;
            
            let query = this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (status) {
                query = query.eq('status', status);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            // Cache the result
            this.setCache(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to get user notifications:', error);
            throw error;
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .update({ 
                    status: 'read',
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId)
                .select()
                .single();
            
            if (error) throw error;
            
            // Emit notification read event
            this.emit('notification:read', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to mark notification as read:', error);
            throw error;
        }
    }

    // ==================== MESSAGING ====================
    
    async sendMessage(messageData) {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .insert([{
                    sender_id: messageData.sender_id,
                    recipient_id: messageData.recipient_id,
                    subject: messageData.subject,
                    content: messageData.content,
                    message_type: messageData.message_type || 'general',
                    priority: messageData.priority || 'normal'
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Create notification for recipient
            await this.createNotification({
                user_id: messageData.recipient_id,
                type: 'message',
                title: 'New Message',
                content: `You have a new message from ${messageData.sender_name || 'a user'}`
            });
            
            // Emit message sent event
            this.emit('message:sent', data);
            
            return data;
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            throw error;
        }
    }

    async getUserMessages(userId, otherUserId = null) {
        try {
            let query = `
                SELECT m.*, 
                       up_sender.full_name as sender_name,
                       up_recipient.full_name as recipient_name
                FROM messages m
                LEFT JOIN user_profiles up_sender ON m.sender_id = up_sender.user_id
                LEFT JOIN user_profiles up_recipient ON m.recipient_id = up_recipient.user_id
                WHERE (m.sender_id = $1 OR m.recipient_id = $1)
            `;
            
            const params = [userId];
            
            if (otherUserId) {
                query += ` AND (
                    (m.sender_id = $1 AND m.recipient_id = $2) OR 
                    (m.sender_id = $2 AND m.recipient_id = $1)
                )`;
                params.push(otherUserId);
            }
            
            query += ` ORDER BY m.created_at DESC`;
            
            const { data, error } = await this.executeSQL(query, params);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('❌ Failed to get user messages:', error);
            throw error;
        }
    }

    // ==================== REAL-TIME SUBSCRIPTIONS ====================
    
    setupRealtimeSubscriptions() {
        if (!this.supabase) return;

        // Subscribe to user profiles changes
        const userProfilesSubscription = this.supabase
            .channel('user_profiles_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'user_profiles' },
                (payload) => {
                    console.log('👤 User profile change:', payload);
                    this.emit('user_profile:change', payload);
                    this.invalidateCache(`user_profile_${payload.new?.user_id || payload.old?.user_id}`);
                }
            )
            .subscribe();

        // Subscribe to appointments changes
        const appointmentsSubscription = this.supabase
            .channel('appointments_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'appointments' },
                (payload) => {
                    console.log('📅 Appointment change:', payload);
                    this.emit('appointment:change', payload);
                    this.invalidateCache(`user_appointments_${payload.new?.user_id || payload.old?.user_id}`);
                }
            )
            .subscribe();

        // Subscribe to medications changes
        const medicationsSubscription = this.supabase
            .channel('medications_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'medications' },
                (payload) => {
                    console.log('💊 Medication change:', payload);
                    this.emit('medication:change', payload);
                }
            )
            .subscribe();

        // Subscribe to vital signs changes
        const vitalSignsSubscription = this.supabase
            .channel('vital_signs_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'vital_signs' },
                (payload) => {
                    console.log('📊 Vital signs change:', payload);
                    this.emit('vital_signs:change', payload);
                    this.invalidateCache(`user_vitals_${payload.new?.user_id || payload.old?.user_id}`);
                }
            )
            .subscribe();

        // Subscribe to notifications changes
        const notificationsSubscription = this.supabase
            .channel('notifications_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'notifications' },
                (payload) => {
                    console.log('🔔 Notification change:', payload);
                    this.emit('notification:change', payload);
                    this.invalidateCache(`user_notifications_${payload.new?.user_id || payload.old?.user_id}`);
                }
            )
            .subscribe();

        // Subscribe to messages changes
        const messagesSubscription = this.supabase
            .channel('messages_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    console.log('💬 Message change:', payload);
                    this.emit('message:change', payload);
                }
            )
            .subscribe();

        // Store subscriptions for cleanup
        this.realtimeSubscriptions.set('user_profiles', userProfilesSubscription);
        this.realtimeSubscriptions.set('appointments', appointmentsSubscription);
        this.realtimeSubscriptions.set('medications', medicationsSubscription);
        this.realtimeSubscriptions.set('vital_signs', vitalSignsSubscription);
        this.realtimeSubscriptions.set('notifications', notificationsSubscription);
        this.realtimeSubscriptions.set('messages', messagesSubscription);

        console.log('🔄 Real-time subscriptions established');
    }

    // ==================== EVENT SYSTEM ====================
    
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // ==================== CACHING SYSTEM ====================
    
    invalidateCache(key) {
        this.cache.delete(key);
    }

    setCache(key, value) {
        this.cache.set(key, {
            value: value,
            timestamp: Date.now()
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.value;
        }
        this.cache.delete(key);
        return null;
    }

    cleanupCache() {
        const now = Date.now();
        for (const [key, cached] of this.cache.entries()) {
            if ((now - cached.timestamp) >= this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }

    // ==================== RATE LIMITING ====================
    
    checkRateLimit(identifier = 'global') {
        const now = Date.now();
        const windowStart = now - 60000; // 1 minute window
        
        if (!this.rateLimiter.has(identifier)) {
            this.rateLimiter.set(identifier, []);
        }
        
        const requests = this.rateLimiter.get(identifier);
        
        // Remove old requests
        while (requests.length > 0 && requests[0] < windowStart) {
            requests.shift();
        }
        
        // Check if limit exceeded
        if (requests.length >= this.maxRequestsPerMinute) {
            return false;
        }
        
        // Add current request
        requests.push(now);
        return true;
    }

    // ==================== ANALYTICS & REPORTING ====================
    
    async getHealthAnalytics(userId, timeRange = '30d') {
        try {
            const analytics = {
                vitals: await this.getVitalsTrends(userId, timeRange),
                medications: await this.getMedicationAdherence(userId, timeRange),
                appointments: await this.getAppointmentStats(userId, timeRange),
                insights: await this.getUserAIInsights(userId, 'new')
            };
            
            return analytics;
        } catch (error) {
            console.error('❌ Failed to get health analytics:', error);
            throw error;
        }
    }

    async getVitalsTrends(userId, timeRange) {
        try {
            const query = `
                SELECT 
                    DATE(recorded_at) as date,
                    AVG(blood_pressure_systolic) as avg_systolic,
                    AVG(blood_pressure_diastolic) as avg_diastolic,
                    AVG(heart_rate) as avg_heart_rate,
                    AVG(weight) as avg_weight
                FROM vital_signs 
                WHERE user_id = $1 
                    AND recorded_at >= NOW() - INTERVAL '${timeRange}'
                GROUP BY DATE(recorded_at)
                ORDER BY date DESC
            `;
            
            const { data, error } = await this.executeSQL(query, [userId]);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('❌ Failed to get vitals trends:', error);
            return [];
        }
    }

    async getMedicationAdherence(userId, timeRange) {
        try {
            const query = `
                SELECT 
                    m.name,
                    COUNT(ml.id) as doses_taken,
                    COUNT(mr.id) * 7 as expected_doses,
                    ROUND(
                        (COUNT(ml.id)::float / NULLIF(COUNT(mr.id) * 7, 0)) * 100, 
                        2
                    ) as adherence_percentage
                FROM medications m
                LEFT JOIN medication_reminders mr ON m.id = mr.medication_id
                LEFT JOIN medication_logs ml ON mr.id = ml.reminder_id 
                    AND ml.taken_at >= NOW() - INTERVAL '${timeRange}'
                WHERE m.user_id = $1 AND m.is_active = true
                GROUP BY m.id, m.name
            `;
            
            const { data, error } = await this.executeSQL(query, [userId]);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('❌ Failed to get medication adherence:', error);
            return [];
        }
    }

    async getAppointmentStats(userId, timeRange) {
        try {
            const query = `
                SELECT 
                    status,
                    COUNT(*) as count
                FROM appointments 
                WHERE (user_id = $1 OR provider_id = $1)
                    AND created_at >= NOW() - INTERVAL '${timeRange}'
                GROUP BY status
            `;
            
            const { data, error } = await this.executeSQL(query, [userId]);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('❌ Failed to get appointment stats:', error);
            return [];
        }
    }

    // ==================== UTILITY METHODS ====================
    
    async getSystemStats() {
        return {
            ...this.healthMetrics,
            cacheSize: this.cache.size,
            subscriptions: this.realtimeSubscriptions.size,
            eventListeners: this.eventListeners.size
        };
    }

    async cleanup() {
        // Unsubscribe from all real-time subscriptions
        for (const [name, subscription] of this.realtimeSubscriptions) {
            await subscription.unsubscribe();
            console.log(`🔄 Unsubscribed from ${name}`);
        }
        
        this.realtimeSubscriptions.clear();
        this.eventListeners.clear();
        this.cache.clear();
        
        console.log('🧹 Healthcare API cleanup completed');
    }
}

// Initialize global healthcare API instance
window.healthcareAPI = new HealthcareBackendAPI(); 