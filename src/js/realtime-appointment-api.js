/**
 * Real-time Appointment Booking API
 * Handles both User Dashboard and Provider Dashboard interactions
 * Uses Supabase for real-time updates and data management
 */

class RealtimeAppointmentAPI {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.subscriptions = new Map();
        this.eventListeners = new Map();
        this.currentUser = null;
        this.userProfile = null;
        
        // Initialize the API
        this.init();
    }

    async init() {
        try {
            // Get current user session
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session?.user) {
                this.currentUser = session.user;
                await this.loadUserProfile();
            }

            // Listen for auth changes
            this.supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    this.currentUser = session.user;
                    await this.loadUserProfile();
                    this.emit('auth:signed_in', { user: this.currentUser, profile: this.userProfile });
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.userProfile = null;
                    this.unsubscribeAll();
                    this.emit('auth:signed_out');
                }
            });

            console.log('✅ RealtimeAppointmentAPI initialized');
        } catch (error) {
            console.error('❌ Failed to initialize RealtimeAppointmentAPI:', error);
            throw error;
        }
    }

    // Event System
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
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // User Profile Management
    async loadUserProfile() {
        if (!this.currentUser) return null;

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // Not found error
                throw error;
            }

            this.userProfile = data;
            return data;
        } catch (error) {
            console.error('Failed to load user profile:', error);
            return null;
        }
    }

    async createUserProfile(profileData) {
        if (!this.currentUser) throw new Error('User not authenticated');

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert([{
                    user_id: this.currentUser.id,
                    email: this.currentUser.email,
                    ...profileData
                }])
                .select()
                .single();

            if (error) throw error;

            this.userProfile = data;
            this.emit('profile:created', data);
            return data;
        } catch (error) {
            console.error('Failed to create user profile:', error);
            throw error;
        }
    }

    async updateUserProfile(updates) {
        if (!this.userProfile) throw new Error('User profile not loaded');

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', this.userProfile.id)
                .select()
                .single();

            if (error) throw error;

            this.userProfile = data;
            this.emit('profile:updated', data);
            return data;
        } catch (error) {
            console.error('Failed to update user profile:', error);
            throw error;
        }
    }

    // Hospital and Doctor Search (User Dashboard)
    async searchHospitals(filters = {}) {
        try {
            let query = this.supabase
                .from('hospitals')
                .select('*')
                .eq('is_active', true);

            // Apply filters
            if (filters.city) {
                query = query.ilike('city', `%${filters.city}%`);
            }
            if (filters.specialties && filters.specialties.length > 0) {
                query = query.overlaps('specialties', filters.specialties);
            }
            if (filters.rating) {
                query = query.gte('rating', filters.rating);
            }

            // Sorting
            if (filters.sortBy === 'rating') {
                query = query.order('rating', { ascending: false });
            } else if (filters.sortBy === 'name') {
                query = query.order('name', { ascending: true });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw error;

            this.emit('hospitals:loaded', data);
            return data;
        } catch (error) {
            console.error('Failed to search hospitals:', error);
            throw error;
        }
    }

    async searchDoctors(filters = {}) {
        try {
            let query = this.supabase
                .from('available_doctors')
                .select('*');

            // Apply filters
            if (filters.specialization) {
                query = query.ilike('specialization', `%${filters.specialization}%`);
            }
            if (filters.hospital_id) {
                query = query.eq('hospital_id', filters.hospital_id);
            }
            if (filters.city) {
                query = query.ilike('city', `%${filters.city}%`);
            }
            if (filters.max_fee) {
                query = query.lte('consultation_fee', filters.max_fee);
            }

            // Sorting
            if (filters.sortBy === 'experience') {
                query = query.order('years_experience', { ascending: false });
            } else if (filters.sortBy === 'fee') {
                query = query.order('consultation_fee', { ascending: true });
            } else if (filters.sortBy === 'rating') {
                query = query.order('hospital_rating', { ascending: false });
            } else {
                query = query.order('doctor_name', { ascending: true });
            }

            const { data, error } = await query;
            if (error) throw error;

            this.emit('doctors:loaded', data);
            return data;
        } catch (error) {
            console.error('Failed to search doctors:', error);
            throw error;
        }
    }

    async getDoctorSchedule(doctorId, hospitalId) {
        try {
            const { data, error } = await this.supabase
                .from('doctor_schedules')
                .select('*')
                .eq('doctor_id', doctorId)
                .eq('hospital_id', hospitalId)
                .eq('is_active', true)
                .order('day_of_week');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Failed to get doctor schedule:', error);
            throw error;
        }
    }

    // Appointment Booking (User Dashboard)
    async createAppointmentRequest(appointmentData) {
        if (!this.userProfile) throw new Error('User profile required');
        if (this.userProfile.user_type !== 'user') throw new Error('Only users can book appointments');

        try {
            const { data, error } = await this.supabase
                .from('appointment_requests')
                .insert([{
                    user_id: this.userProfile.id,
                    ...appointmentData,
                    status: 'pending'
                }])
                .select()
                .single();

            if (error) throw error;

            this.emit('appointment:requested', data);
            return data;
        } catch (error) {
            console.error('Failed to create appointment request:', error);
            throw error;
        }
    }

    async getUserAppointments(status = null) {
        if (!this.userProfile) throw new Error('User profile required');

        try {
            let query = this.supabase
                .from('appointment_details')
                .select('*')
                .eq('user_id', this.userProfile.id);

            if (status) {
                query = query.eq('status', status);
            }

            query = query.order('requested_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;

            this.emit('user_appointments:loaded', data);
            return data;
        } catch (error) {
            console.error('Failed to get user appointments:', error);
            throw error;
        }
    }

    async cancelAppointment(appointmentId, reason) {
        try {
            const { data, error } = await this.supabase
                .from('appointment_requests')
                .update({
                    status: 'cancelled',
                    cancellation_reason: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;

            this.emit('appointment:cancelled', data);
            return data;
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
            throw error;
        }
    }

    // Provider Dashboard Functions
    async getProviderAppointments(status = null) {
        if (!this.userProfile) throw new Error('User profile required');
        if (this.userProfile.user_type !== 'provider') throw new Error('Only providers can access this');

        try {
            let query = this.supabase
                .from('appointment_details')
                .select('*')
                .eq('doctor_id', this.userProfile.id);

            if (status) {
                query = query.eq('status', status);
            }

            query = query.order('requested_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;

            this.emit('provider_appointments:loaded', data);
            return data;
        } catch (error) {
            console.error('Failed to get provider appointments:', error);
            throw error;
        }
    }

    async confirmAppointment(appointmentId, confirmationData) {
        if (!this.userProfile || this.userProfile.user_type !== 'provider') {
            throw new Error('Only providers can confirm appointments');
        }

        try {
            const { data, error } = await this.supabase
                .from('appointment_requests')
                .update({
                    status: 'confirmed',
                    confirmed_date: confirmationData.confirmed_date,
                    confirmed_time: confirmationData.confirmed_time,
                    estimated_duration: confirmationData.estimated_duration || 30,
                    consultation_fee: confirmationData.consultation_fee,
                    notes: confirmationData.notes,
                    confirmed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', appointmentId)
                .eq('doctor_id', this.userProfile.id)
                .select()
                .single();

            if (error) throw error;

            this.emit('appointment:confirmed', data);
            return data;
        } catch (error) {
            console.error('Failed to confirm appointment:', error);
            throw error;
        }
    }

    async rescheduleAppointment(appointmentId, newDateTime, reason) {
        try {
            const { data, error } = await this.supabase
                .from('appointment_requests')
                .update({
                    status: 'rescheduled',
                    confirmed_date: newDateTime.date,
                    confirmed_time: newDateTime.time,
                    notes: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;

            this.emit('appointment:rescheduled', data);
            return data;
        } catch (error) {
            console.error('Failed to reschedule appointment:', error);
            throw error;
        }
    }

    async completeAppointment(appointmentId, completionNotes) {
        if (!this.userProfile || this.userProfile.user_type !== 'provider') {
            throw new Error('Only providers can complete appointments');
        }

        try {
            const { data, error } = await this.supabase
                .from('appointment_requests')
                .update({
                    status: 'completed',
                    notes: completionNotes,
                    completed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', appointmentId)
                .eq('doctor_id', this.userProfile.id)
                .select()
                .single();

            if (error) throw error;

            this.emit('appointment:completed', data);
            return data;
        } catch (error) {
            console.error('Failed to complete appointment:', error);
            throw error;
        }
    }

    // Notifications
    async getNotifications(isRead = null) {
        if (!this.userProfile) throw new Error('User profile required');

        try {
            let query = this.supabase
                .from('appointment_notifications')
                .select('*')
                .eq('recipient_id', this.userProfile.id);

            if (isRead !== null) {
                query = query.eq('is_read', isRead);
            }

            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;

            this.emit('notifications:loaded', data);
            return data;
        } catch (error) {
            console.error('Failed to get notifications:', error);
            throw error;
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const { data, error } = await this.supabase
                .from('appointment_notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId)
                .eq('recipient_id', this.userProfile.id)
                .select()
                .single();

            if (error) throw error;

            this.emit('notification:read', data);
            return data;
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }

    async markAllNotificationsAsRead() {
        if (!this.userProfile) throw new Error('User profile required');

        try {
            const { data, error } = await this.supabase
                .from('appointment_notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('recipient_id', this.userProfile.id)
                .eq('is_read', false);

            if (error) throw error;

            this.emit('notifications:all_read', data);
            return data;
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            throw error;
        }
    }

    // Real-time Subscriptions
    subscribeToAppointments() {
        if (!this.userProfile) {
            console.warn('Cannot subscribe to appointments without user profile');
            return;
        }

        const subscriptionKey = 'appointments';
        
        // Unsubscribe if already subscribed
        if (this.subscriptions.has(subscriptionKey)) {
            this.subscriptions.get(subscriptionKey).unsubscribe();
        }

        const subscription = this.supabase
            .channel('appointment_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointment_requests',
                    filter: this.userProfile.user_type === 'user' 
                        ? `user_id=eq.${this.userProfile.id}`
                        : `doctor_id=eq.${this.userProfile.id}`
                },
                (payload) => {
                    console.log('📅 Appointment change:', payload);
                    this.emit('appointment:realtime_update', payload);
                    
                    // Emit specific events based on the change
                    if (payload.eventType === 'INSERT') {
                        this.emit('appointment:new', payload.new);
                    } else if (payload.eventType === 'UPDATE') {
                        this.emit('appointment:updated', payload.new);
                        
                        // Emit status-specific events
                        if (payload.new.status !== payload.old?.status) {
                            this.emit(`appointment:${payload.new.status}`, payload.new);
                        }
                    } else if (payload.eventType === 'DELETE') {
                        this.emit('appointment:deleted', payload.old);
                    }
                }
            )
            .subscribe();

        this.subscriptions.set(subscriptionKey, subscription);
        console.log('✅ Subscribed to appointment changes');
    }

    subscribeToNotifications() {
        if (!this.userProfile) {
            console.warn('Cannot subscribe to notifications without user profile');
            return;
        }

        const subscriptionKey = 'notifications';
        
        // Unsubscribe if already subscribed
        if (this.subscriptions.has(subscriptionKey)) {
            this.subscriptions.get(subscriptionKey).unsubscribe();
        }

        const subscription = this.supabase
            .channel('notification_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointment_notifications',
                    filter: `recipient_id=eq.${this.userProfile.id}`
                },
                (payload) => {
                    console.log('🔔 Notification change:', payload);
                    this.emit('notification:realtime_update', payload);
                    
                    if (payload.eventType === 'INSERT') {
                        this.emit('notification:new', payload.new);
                        
                        // Show browser notification if supported
                        this.showBrowserNotification(payload.new);
                    } else if (payload.eventType === 'UPDATE') {
                        this.emit('notification:updated', payload.new);
                    }
                }
            )
            .subscribe();

        this.subscriptions.set(subscriptionKey, subscription);
        console.log('✅ Subscribed to notification changes');
    }

    // Browser Notifications
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/images/logo.png', // Add your app icon
                badge: '/images/badge.png',
                tag: `appointment-${notification.appointment_id}`,
                requireInteraction: notification.notification_type === 'urgent'
            });
        }
    }

    // Utility Functions
    unsubscribe(subscriptionKey) {
        if (this.subscriptions.has(subscriptionKey)) {
            this.subscriptions.get(subscriptionKey).unsubscribe();
            this.subscriptions.delete(subscriptionKey);
            console.log(`✅ Unsubscribed from ${subscriptionKey}`);
        }
    }

    unsubscribeAll() {
        this.subscriptions.forEach((subscription, key) => {
            subscription.unsubscribe();
            console.log(`✅ Unsubscribed from ${key}`);
        });
        this.subscriptions.clear();
    }

    // Analytics and Statistics
    async getAppointmentStats() {
        if (!this.userProfile) throw new Error('User profile required');

        try {
            const { data, error } = await this.supabase
                .rpc('get_appointment_stats', {
                    user_id: this.userProfile.id,
                    user_type: this.userProfile.user_type
                });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Failed to get appointment stats:', error);
            return {
                total: 0,
                pending: 0,
                confirmed: 0,
                completed: 0,
                cancelled: 0
            };
        }
    }

    // Helper function to format appointment data for display
    formatAppointmentForDisplay(appointment) {
        return {
            ...appointment,
            displayDate: appointment.confirmed_date || appointment.requested_date,
            displayTime: appointment.confirmed_time || 'Time TBD',
            statusColor: this.getStatusColor(appointment.status),
            statusIcon: this.getStatusIcon(appointment.status),
            isUpcoming: new Date(appointment.confirmed_date || appointment.requested_date) > new Date(),
            formattedFee: appointment.consultation_fee ? `$${appointment.consultation_fee}` : 'TBD'
        };
    }

    getStatusColor(status) {
        const colors = {
            pending: '#F59E0B',
            confirmed: '#10B981',
            completed: '#8B5CF6',
            cancelled: '#EF4444',
            rescheduled: '#06B6D4'
        };
        return colors[status] || '#6B7280';
    }

    getStatusIcon(status) {
        const icons = {
            pending: 'fas fa-clock',
            confirmed: 'fas fa-check-circle',
            completed: 'fas fa-check-double',
            cancelled: 'fas fa-times-circle',
            rescheduled: 'fas fa-calendar-alt'
        };
        return icons[status] || 'fas fa-question-circle';
    }

    // Cleanup
    destroy() {
        this.unsubscribeAll();
        this.eventListeners.clear();
        console.log('✅ RealtimeAppointmentAPI destroyed');
    }
}

// Export for use in both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealtimeAppointmentAPI;
} else if (typeof window !== 'undefined') {
    window.RealtimeAppointmentAPI = RealtimeAppointmentAPI;
}

// Usage Examples:

/*
// Initialize the API
const appointmentAPI = new RealtimeAppointmentAPI(supabase);

// For User Dashboard:
// 1. Search hospitals and doctors
const hospitals = await appointmentAPI.searchHospitals({ city: 'New York', specialties: ['Cardiology'] });
const doctors = await appointmentAPI.searchDoctors({ specialization: 'Cardiology', max_fee: 200 });

// 2. Book an appointment
const appointment = await appointmentAPI.createAppointmentRequest({
    doctor_id: 'doctor-uuid',
    hospital_id: 'hospital-uuid',
    requested_date: '2024-01-15',
    appointment_type: 'consultation',
    symptoms: 'Chest pain and shortness of breath',
    preferred_time_slots: ['09:00', '10:00', '11:00']
});

// 3. Subscribe to real-time updates
appointmentAPI.subscribeToAppointments();
appointmentAPI.subscribeToNotifications();

// 4. Listen for events
appointmentAPI.on('appointment:confirmed', (appointment) => {
    console.log('Appointment confirmed!', appointment);
    // Update UI
});

// For Provider Dashboard:
// 1. Get pending appointments
const pendingAppointments = await appointmentAPI.getProviderAppointments('pending');

// 2. Confirm an appointment
const confirmed = await appointmentAPI.confirmAppointment('appointment-uuid', {
    confirmed_date: '2024-01-15',
    confirmed_time: '10:00',
    estimated_duration: 30,
    consultation_fee: 150,
    notes: 'Please bring previous medical records'
});

// 3. Listen for new appointment requests
appointmentAPI.on('appointment:new', (appointment) => {
    console.log('New appointment request!', appointment);
    // Show notification, update UI
});
*/ 