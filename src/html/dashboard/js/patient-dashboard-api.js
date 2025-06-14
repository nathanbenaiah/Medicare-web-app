/**
 * Patient Dashboard API Module
 * Handles all Supabase MCP interactions and real-time features
 */

class PatientDashboardAPI {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.subscriptions = new Map();
        this.currentUserId = null;
        this.eventListeners = new Map();
    }

    // Initialize the API with user context
    async initialize(userId) {
        this.currentUserId = userId;
        await this.setupRealtimeSubscriptions();
        return this;
    }

    // Event system for real-time updates
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emitEvent(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Setup real-time subscriptions
    async setupRealtimeSubscriptions() {
        if (!this.supabase || !this.currentUserId) return;

        try {
            // Subscribe to appointments changes
            const appointmentsChannel = this.supabase
                .channel('appointments_changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                    filter: `user_id=eq.${this.currentUserId}`
                }, (payload) => {
                    console.log('Appointments change:', payload);
                    this.emitEvent('appointments_changed', payload);
                })
                .subscribe();

            this.subscriptions.set('appointments', appointmentsChannel);

            // Subscribe to reminders changes
            const remindersChannel = this.supabase
                .channel('reminders_changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'reminders',
                    filter: `user_id=eq.${this.currentUserId}`
                }, (payload) => {
                    console.log('Reminders change:', payload);
                    this.emitEvent('reminders_changed', payload);
                })
                .subscribe();

            this.subscriptions.set('reminders', remindersChannel);

            // Subscribe to vitals changes
            const vitalsChannel = this.supabase
                .channel('vitals_changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'vitals',
                    filter: `user_id=eq.${this.currentUserId}`
                }, (payload) => {
                    console.log('Vitals change:', payload);
                    this.emitEvent('vitals_changed', payload);
                })
                .subscribe();

            this.subscriptions.set('vitals', vitalsChannel);

            // Subscribe to notifications
            const notificationsChannel = this.supabase
                .channel('notifications_changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${this.currentUserId}`
                }, (payload) => {
                    console.log('Notifications change:', payload);
                    this.emitEvent('notifications_changed', payload);
                })
                .subscribe();

            this.subscriptions.set('notifications', notificationsChannel);

            console.log('✅ Real-time subscriptions established');
        } catch (error) {
            console.error('❌ Failed to setup subscriptions:', error);
        }
    }

    // Clean up subscriptions
    cleanup() {
        this.subscriptions.forEach(channel => {
            channel.unsubscribe();
        });
        this.subscriptions.clear();
        this.eventListeners.clear();
    }

    // Dashboard Summary
    async getDashboardSummary() {
        try {
            const { data, error } = await this.supabase
                .from('dashboard_summary')
                .select('*')
                .eq('user_id', this.currentUserId)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            return { data: null, error };
        }
    }

    // Appointments API
    async getAppointments(limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('appointment_date', { ascending: true })
                .order('appointment_time', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return { data: [], error };
        }
    }

    async getUpcomingAppointments(limit = 5) {
        try {
            const { data, error } = await this.supabase
                .rpc('get_upcoming_appointments', {
                    p_user_id: this.currentUserId,
                    p_limit: limit
                });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching upcoming appointments:', error);
            return { data: [], error };
        }
    }

    async createAppointment(appointmentData) {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .insert({
                    user_id: this.currentUserId,
                    ...appointmentData
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error creating appointment:', error);
            return { data: null, error };
        }
    }

    async updateAppointment(appointmentId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .update(updates)
                .eq('id', appointmentId)
                .eq('user_id', this.currentUserId)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error updating appointment:', error);
            return { data: null, error };
        }
    }

    // Hospital and Doctor Search
    async searchHealthcareProviders(searchTerm, city = null, specialty = null) {
        try {
            const { data, error } = await this.supabase
                .rpc('search_healthcare_providers', {
                    p_search_term: searchTerm,
                    p_city: city,
                    p_specialty: specialty
                });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error searching healthcare providers:', error);
            return { data: [], error };
        }
    }

    async getHospitals(city = null) {
        try {
            let query = this.supabase
                .from('hospitals')
                .select('*')
                .order('rating', { ascending: false });

            if (city) {
                query = query.ilike('city', `%${city}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            return { data: [], error };
        }
    }

    async getDoctorsByHospital(hospitalId) {
        try {
            const { data, error } = await this.supabase
                .from('doctors')
                .select('*')
                .eq('hospital_id', hospitalId)
                .order('rating', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return { data: [], error };
        }
    }

    // Reminders API
    async getReminders(date = null) {
        try {
            let query = this.supabase
                .from('reminders')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('reminder_time', { ascending: true });

            if (date) {
                query = query.eq('reminder_date', date);
            } else {
                query = query.eq('reminder_date', new Date().toISOString().split('T')[0]);
            }

            const { data, error } = await query;
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching reminders:', error);
            return { data: [], error };
        }
    }

    async getTodaysReminders() {
        try {
            const { data, error } = await this.supabase
                .rpc('get_todays_reminders', {
                    p_user_id: this.currentUserId
                });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching today\'s reminders:', error);
            return { data: [], error };
        }
    }

    async createReminder(reminderData) {
        try {
            const { data, error } = await this.supabase
                .from('reminders')
                .insert({
                    user_id: this.currentUserId,
                    ...reminderData
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error creating reminder:', error);
            return { data: null, error };
        }
    }

    async updateReminder(reminderId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('reminders')
                .update(updates)
                .eq('id', reminderId)
                .eq('user_id', this.currentUserId)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error updating reminder:', error);
            return { data: null, error };
        }
    }

    async deleteReminder(reminderId) {
        try {
            const { error } = await this.supabase
                .from('reminders')
                .delete()
                .eq('id', reminderId)
                .eq('user_id', this.currentUserId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Error deleting reminder:', error);
            return { error };
        }
    }

    async toggleReminderCompletion(reminderId, isCompleted) {
        return this.updateReminder(reminderId, { is_completed: isCompleted });
    }

    // Vitals API
    async getVitals(limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('vitals')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('recorded_date', { ascending: false })
                .order('recorded_time', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching vitals:', error);
            return { data: [], error };
        }
    }

    async getLatestVitals() {
        try {
            const { data, error } = await this.supabase
                .from('vitals')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('recorded_date', { ascending: false })
                .order('recorded_time', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching latest vitals:', error);
            return { data: null, error };
        }
    }

    async recordVitals(vitalsData) {
        try {
            const { data, error } = await this.supabase
                .from('vitals')
                .insert({
                    user_id: this.currentUserId,
                    ...vitalsData
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error recording vitals:', error);
            return { data: null, error };
        }
    }

    // Health Score API
    async calculateHealthScore() {
        try {
            const { data, error } = await this.supabase
                .rpc('calculate_health_score', {
                    p_user_id: this.currentUserId
                });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error calculating health score:', error);
            return { data: 85, error }; // Default score
        }
    }

    // AI Chat API
    async getChatHistory(sessionId = null, limit = 50) {
        try {
            let query = this.supabase
                .from('ai_chat_history')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('created_at', { ascending: true })
                .limit(limit);

            if (sessionId) {
                query = query.eq('chat_session_id', sessionId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return { data: [], error };
        }
    }

    async saveChatMessage(message, response, sessionId = null) {
        try {
            const { data, error } = await this.supabase
                .from('ai_chat_history')
                .insert({
                    user_id: this.currentUserId,
                    message,
                    response,
                    chat_session_id: sessionId || this.generateSessionId()
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error saving chat message:', error);
            return { data: null, error };
        }
    }

    // Medications API
    async getMedications() {
        try {
            const { data, error } = await this.supabase
                .from('medications')
                .select('*')
                .eq('user_id', this.currentUserId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching medications:', error);
            return { data: [], error };
        }
    }

    async addMedication(medicationData) {
        try {
            const { data, error } = await this.supabase
                .from('medications')
                .insert({
                    user_id: this.currentUserId,
                    ...medicationData
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error adding medication:', error);
            return { data: null, error };
        }
    }

    // Notifications API
    async getNotifications(unreadOnly = false) {
        try {
            let query = this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('created_at', { ascending: false });

            if (unreadOnly) {
                query = query.eq('is_read', false);
            }

            const { data, error } = await query;
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return { data: [], error };
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId)
                .eq('user_id', this.currentUserId)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return { data: null, error };
        }
    }

    // Utility functions
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDate(date) {
        return new Date(date).toISOString().split('T')[0];
    }

    formatTime(time) {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(dateTime) {
        return new Date(dateTime).toLocaleString();
    }

    // Mock AI Response (replace with actual AI service)
    async getAIResponse(message) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Mock responses based on message content
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
            return "I understand you're experiencing pain. Can you describe the location and intensity of the pain on a scale of 1-10? If it's severe or persistent, I recommend contacting your healthcare provider immediately.";
        }
        
        if (lowerMessage.includes('medication') || lowerMessage.includes('pill')) {
            return "Regarding medications, it's important to take them as prescribed by your doctor. If you have questions about dosage, side effects, or interactions, please consult with your healthcare provider or pharmacist.";
        }
        
        if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
            return "I can help you with appointment-related questions. You can search for doctors and hospitals using our appointment booking feature. Would you like me to help you find a specific type of specialist?";
        }
        
        if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
            return "Blood pressure monitoring is important for your health. Normal blood pressure is typically below 120/80 mmHg. If you're consistently seeing higher readings, please discuss this with your healthcare provider.";
        }
        
        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            return "If this is a medical emergency, please call 911 or go to your nearest emergency room immediately. For urgent but non-emergency situations, contact your healthcare provider or visit an urgent care center.";
        }
        
        // Default response
        return "Thank you for your question. While I can provide general health information, please remember that I'm not a substitute for professional medical advice. For specific health concerns, it's always best to consult with your healthcare provider. Is there anything specific about your health or medications I can help you understand better?";
    }

    // Data export functionality
    async exportData(dataType = 'all') {
        try {
            const exportData = {};
            
            if (dataType === 'all' || dataType === 'appointments') {
                const appointments = await this.getAppointments(100);
                exportData.appointments = appointments.data;
            }
            
            if (dataType === 'all' || dataType === 'vitals') {
                const vitals = await this.getVitals(100);
                exportData.vitals = vitals.data;
            }
            
            if (dataType === 'all' || dataType === 'medications') {
                const medications = await this.getMedications();
                exportData.medications = medications.data;
            }
            
            if (dataType === 'all' || dataType === 'reminders') {
                const reminders = await this.getReminders();
                exportData.reminders = reminders.data;
            }
            
            return {
                data: exportData,
                exportedAt: new Date().toISOString(),
                userId: this.currentUserId
            };
        } catch (error) {
            console.error('Error exporting data:', error);
            return { error };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatientDashboardAPI;
} else if (typeof window !== 'undefined') {
    window.PatientDashboardAPI = PatientDashboardAPI;
} 