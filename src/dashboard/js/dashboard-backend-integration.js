/**
 * DASHBOARD BACKEND INTEGRATION
 * Comprehensive integration layer for all dashboard features
 * Supports both User Dashboard and Provider Dashboard
 */

class DashboardBackendIntegration {
    constructor() {
        this.backend = null;
        this.aiAssistant = null;
        this.currentUser = null;
        this.dashboardType = 'user'; // 'user' or 'provider'
        this.isInitialized = false;
        this.eventHandlers = new Map();
        this.refreshIntervals = new Map();
        this.notificationQueue = [];
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================

    async initialize(dashboardType = 'user') {
        try {
            console.log(`🚀 Initializing ${dashboardType} dashboard integration...`);
            
            this.dashboardType = dashboardType;
            
            // Initialize comprehensive backend
            this.backend = new ComprehensiveHealthcareBackend();
            await this.backend.initialize();
            
            // Initialize AI assistant if available
            if (window.AIHealthAssistant) {
                this.aiAssistant = new AIHealthAssistant(this.backend);
            }
            
            // Load current user
            await this.loadCurrentUser();
            
            // Initialize dashboard-specific features
            if (dashboardType === 'user') {
                await this.initializeUserDashboard();
            } else if (dashboardType === 'provider') {
                await this.initializeProviderDashboard();
            }
            
            // Set up real-time updates
            this.setupRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('✅ Dashboard integration initialized successfully');
            
            return { success: true, dashboardType: this.dashboardType };
            
        } catch (error) {
            console.error('❌ Dashboard integration failed:', error);
            return { success: false, error: error.message };
        }
    }

    async loadCurrentUser() {
        const userResult = await this.backend.getCurrentUser();
        if (userResult.success) {
            this.currentUser = userResult.data;
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        if (!this.currentUser) return;
        
        // Update user profile display
        const userNameElement = document.getElementById('userName');
        const userAvatarElement = document.getElementById('userAvatar');
        
        if (userNameElement) {
            userNameElement.textContent = `${this.currentUser.profile?.first_name || 'User'} ${this.currentUser.profile?.last_name || ''}`.trim();
        }
        
        if (userAvatarElement) {
            const initials = `${this.currentUser.profile?.first_name?.[0] || 'U'}${this.currentUser.profile?.last_name?.[0] || ''}`;
            userAvatarElement.textContent = initials;
        }
    }

    // =====================================================
    // USER DASHBOARD FEATURES
    // =====================================================

    async initializeUserDashboard() {
        console.log('🏥 Initializing user dashboard features...');
        
        // Load dashboard data
        await Promise.all([
            this.loadDashboardStats(),
            this.loadRecentAppointments(),
            this.loadActiveMedications(),
            this.loadRecentVitals(),
            this.loadAIInsights(),
            this.loadNotifications()
        ]);
        
        // Set up auto-refresh for dynamic content
        this.setupAutoRefresh();
    }

    async loadDashboardStats() {
        try {
            const analytics = await this.backend.getDashboardAnalytics(this.currentUser.id, 'patient');
            if (analytics.success) {
                this.updateStatsDisplay(analytics.data);
            }
        } catch (error) {
            console.error('❌ Failed to load dashboard stats:', error);
        }
    }

    updateStatsDisplay(stats) {
        // Update appointment stats
        const appointmentCountElement = document.getElementById('appointmentCount');
        if (appointmentCountElement) {
            appointmentCountElement.textContent = stats.appointments?.total || 0;
        }
        
        // Update medication stats
        const medicationCountElement = document.getElementById('medicationCount');
        if (medicationCountElement) {
            medicationCountElement.textContent = stats.medications?.active || 0;
        }
        
        // Update vital signs stats
        const vitalSignsCountElement = document.getElementById('vitalSignsCount');
        if (vitalSignsCountElement) {
            vitalSignsCountElement.textContent = stats.vitals?.recorded || 0;
        }
        
        // Update AI insights stats
        const aiInsightsCountElement = document.getElementById('aiInsightsCount');
        if (aiInsightsCountElement) {
            aiInsightsCountElement.textContent = stats.insights?.total || 0;
        }
    }

    async loadRecentAppointments() {
        try {
            const appointments = await this.backend.getAppointments(this.currentUser.id);
            if (appointments.success) {
                this.displayAppointments(appointments.data);
            }
        } catch (error) {
            console.error('❌ Failed to load appointments:', error);
        }
    }

    displayAppointments(appointments) {
        const container = document.getElementById('appointmentsList');
        if (!container) return;
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <p>No appointments scheduled</p>
                    <button class="btn btn-primary" onclick="scheduleAppointment()">
                        Schedule Your First Appointment
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = appointments.map(appointment => `
            <div class="appointment-card" data-id="${appointment.id}">
                <div class="appointment-header">
                    <div class="appointment-type">
                        <i class="fas fa-stethoscope"></i>
                        ${appointment.appointment_type || 'Consultation'}
                    </div>
                    <div class="appointment-status status-${appointment.status}">
                        ${appointment.status}
                    </div>
                </div>
                <div class="appointment-details">
                    <div class="appointment-provider">
                        <strong>${appointment.provider_name || 'Dr. Unknown'}</strong>
                    </div>
                    <div class="appointment-datetime">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(appointment.scheduled_date)} at ${appointment.scheduled_time}
                    </div>
                    <div class="appointment-department">
                        <i class="fas fa-hospital"></i>
                        ${appointment.department || 'General'}
                    </div>
                    ${appointment.notes ? `<div class="appointment-notes">${appointment.notes}</div>` : ''}
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-sm btn-secondary" onclick="viewAppointment('${appointment.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${appointment.status === 'scheduled' ? `
                        <button class="btn btn-sm btn-warning" onclick="rescheduleAppointment('${appointment.id}')">
                            <i class="fas fa-edit"></i> Reschedule
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    async loadActiveMedications() {
        try {
            const medications = await this.backend.getMedications(this.currentUser.id, true);
            if (medications.success) {
                this.displayMedications(medications.data);
            }
        } catch (error) {
            console.error('❌ Failed to load medications:', error);
        }
    }

    displayMedications(medications) {
        const container = document.getElementById('medicationsList');
        if (!container) return;
        
        if (medications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <p>No active medications</p>
                    <button class="btn btn-primary" onclick="addMedication()">
                        Add Medication
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = medications.map(medication => `
            <div class="medication-card" data-id="${medication.id}">
                <div class="medication-header">
                    <div class="medication-name">
                        <i class="fas fa-pills"></i>
                        <strong>${medication.medication_name}</strong>
                    </div>
                    <div class="medication-status status-${medication.status}">
                        ${medication.status}
                    </div>
                </div>
                <div class="medication-details">
                    <div class="medication-dosage">
                        <strong>Dosage:</strong> ${medication.dosage}
                    </div>
                    <div class="medication-frequency">
                        <strong>Frequency:</strong> ${medication.frequency}
                    </div>
                    <div class="medication-prescribed">
                        <strong>Prescribed by:</strong> ${medication.prescribed_by}
                    </div>
                    ${medication.instructions ? `
                        <div class="medication-instructions">
                            <strong>Instructions:</strong> ${medication.instructions}
                        </div>
                    ` : ''}
                </div>
                <div class="medication-actions">
                    <button class="btn btn-sm btn-success" onclick="markMedicationTaken('${medication.id}')">
                        <i class="fas fa-check"></i> Mark Taken
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="viewMedication('${medication.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadRecentVitals() {
        try {
            const vitals = await this.backend.getVitalSigns(this.currentUser.id, 10);
            if (vitals.success) {
                this.displayVitalSigns(vitals.data);
            }
        } catch (error) {
            console.error('❌ Failed to load vital signs:', error);
        }
    }

    displayVitalSigns(vitals) {
        const container = document.getElementById('vitalSignsGrid');
        if (!container) return;
        
        if (vitals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heartbeat"></i>
                    <p>No vital signs recorded</p>
                    <button class="btn btn-primary" onclick="recordVitalSigns()">
                        Record Vital Signs
                    </button>
                </div>
            `;
            return;
        }
        
        const latest = vitals[0];
        container.innerHTML = `
            <div class="vital-card">
                <div class="vital-header">
                    <h4><i class="fas fa-heartbeat"></i> Blood Pressure</h4>
                    <span class="vital-value">${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic} mmHg</span>
                </div>
                <div class="vital-status ${this.getBloodPressureStatus(latest.blood_pressure_systolic, latest.blood_pressure_diastolic)}">
                    ${this.getBloodPressureStatusText(latest.blood_pressure_systolic, latest.blood_pressure_diastolic)}
                </div>
            </div>
            
            <div class="vital-card">
                <div class="vital-header">
                    <h4><i class="fas fa-heartbeat"></i> Heart Rate</h4>
                    <span class="vital-value">${latest.heart_rate} bpm</span>
                </div>
                <div class="vital-status ${this.getHeartRateStatus(latest.heart_rate)}">
                    ${this.getHeartRateStatusText(latest.heart_rate)}
                </div>
            </div>
            
            ${latest.weight ? `
                <div class="vital-card">
                    <div class="vital-header">
                        <h4><i class="fas fa-weight"></i> Weight</h4>
                        <span class="vital-value">${latest.weight} kg</span>
                    </div>
                    <div class="vital-status normal">Normal</div>
                </div>
            ` : ''}
            
            ${latest.temperature ? `
                <div class="vital-card">
                    <div class="vital-header">
                        <h4><i class="fas fa-thermometer-half"></i> Temperature</h4>
                        <span class="vital-value">${latest.temperature}°F</span>
                    </div>
                    <div class="vital-status ${this.getTemperatureStatus(latest.temperature)}">
                        ${this.getTemperatureStatusText(latest.temperature)}
                    </div>
                </div>
            ` : ''}
            
            <div class="vital-card vital-actions">
                <button class="btn btn-primary" onclick="recordVitalSigns()">
                    <i class="fas fa-plus"></i> Record New
                </button>
                <button class="btn btn-secondary" onclick="viewVitalHistory()">
                    <i class="fas fa-chart-line"></i> View History
                </button>
            </div>
        `;
    }

    async loadAIInsights() {
        try {
            const insights = await this.backend.getAIInsights(this.currentUser.id);
            if (insights.success) {
                this.displayAIInsights(insights.data);
            }
        } catch (error) {
            console.error('❌ Failed to load AI insights:', error);
        }
    }

    displayAIInsights(insights) {
        const container = document.getElementById('aiInsightsList');
        if (!container) return;
        
        if (insights.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <p>No AI insights available</p>
                    <button class="btn btn-primary" onclick="generateAIInsights()">
                        Generate Insights
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = insights.slice(0, 5).map(insight => `
            <div class="insight-card severity-${insight.severity}">
                <div class="insight-header">
                    <div class="insight-title">
                        <i class="fas fa-lightbulb"></i>
                        ${insight.title}
                    </div>
                    <div class="insight-severity severity-${insight.severity}">
                        ${insight.severity}
                    </div>
                </div>
                <div class="insight-description">
                    ${insight.description}
                </div>
                <div class="insight-recommendation">
                    <strong>Recommendation:</strong> ${insight.recommendation}
                </div>
                <div class="insight-footer">
                    <span class="insight-date">${this.formatDate(insight.created_at)}</span>
                    <button class="btn btn-sm btn-secondary" onclick="viewInsight('${insight.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    // =====================================================
    // PROVIDER DASHBOARD FEATURES
    // =====================================================

    async initializeProviderDashboard() {
        console.log('👨‍⚕️ Initializing provider dashboard features...');
        
        // Load provider-specific data
        await Promise.all([
            this.loadProviderStats(),
            this.loadTodaySchedule(),
            this.loadRecentPatients(),
            this.loadPendingTasks()
        ]);
        
        // Set up provider-specific auto-refresh
        this.setupProviderAutoRefresh();
    }

    async loadProviderStats() {
        try {
            const analytics = await this.backend.getDashboardAnalytics(this.currentUser.id, 'provider');
            if (analytics.success) {
                this.updateProviderStatsDisplay(analytics.data);
            }
        } catch (error) {
            console.error('❌ Failed to load provider stats:', error);
        }
    }

    updateProviderStatsDisplay(stats) {
        // Update patient count
        const patientCountElement = document.getElementById('totalPatients');
        if (patientCountElement) {
            patientCountElement.textContent = stats.patients?.total || 0;
        }
        
        // Update today's appointments
        const todayAppointmentsElement = document.getElementById('todayAppointments');
        if (todayAppointmentsElement) {
            todayAppointmentsElement.textContent = stats.appointments?.today || 0;
        }
        
        // Update revenue
        const revenueElement = document.getElementById('monthlyRevenue');
        if (revenueElement) {
            revenueElement.textContent = `$${stats.revenue?.this_month || 0}`;
        }
        
        // Update satisfaction rating
        const satisfactionElement = document.getElementById('satisfactionRating');
        if (satisfactionElement) {
            satisfactionElement.textContent = stats.satisfaction?.rating || '0.0';
        }
    }

    async loadTodaySchedule() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const schedule = await this.backend.getProviderSchedule(this.currentUser.id, today);
            if (schedule.success) {
                this.displayProviderSchedule(schedule.data);
            }
        } catch (error) {
            console.error('❌ Failed to load today\'s schedule:', error);
        }
    }

    displayProviderSchedule(appointments) {
        const container = document.getElementById('todaySchedule');
        if (!container) return;
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <p>No appointments scheduled for today</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = appointments.map(appointment => `
            <div class="schedule-item status-${appointment.status}">
                <div class="schedule-time">
                    ${appointment.scheduled_time}
                </div>
                <div class="schedule-details">
                    <div class="patient-name">
                        <strong>${appointment.patient_name || 'Unknown Patient'}</strong>
                    </div>
                    <div class="appointment-type">
                        ${appointment.appointment_type || 'Consultation'}
                    </div>
                    <div class="appointment-duration">
                        ${appointment.duration || 30} minutes
                    </div>
                </div>
                <div class="schedule-actions">
                    <button class="btn btn-sm btn-primary" onclick="startConsultation('${appointment.id}')">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="viewPatient('${appointment.patient_id}')">
                        <i class="fas fa-user"></i> Patient
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadRecentPatients() {
        try {
            const patients = await this.backend.getProviderPatients(this.currentUser.id, 10);
            if (patients.success) {
                this.displayRecentPatients(patients.data);
            }
        } catch (error) {
            console.error('❌ Failed to load recent patients:', error);
        }
    }

    displayRecentPatients(patients) {
        const container = document.getElementById('recentPatients');
        if (!container) return;
        
        if (patients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No patients found</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = patients.slice(0, 5).map(patient => `
            <div class="patient-item" onclick="viewPatient('${patient.id}')">
                <div class="patient-avatar">
                    ${patient.first_name?.[0] || 'P'}${patient.last_name?.[0] || ''}
                </div>
                <div class="patient-info">
                    <div class="patient-name">
                        <strong>${patient.first_name} ${patient.last_name}</strong>
                    </div>
                    <div class="patient-details">
                        ${patient.patient_number} • ${this.calculateAge(patient.date_of_birth)} years
                    </div>
                    <div class="patient-last-visit">
                        Last visit: ${this.formatDate(patient.last_visit)}
                    </div>
                </div>
                <div class="patient-status status-${patient.status}">
                    ${patient.status}
                </div>
            </div>
        `).join('');
    }

    // =====================================================
    // COMMON DASHBOARD FEATURES
    // =====================================================

    async loadNotifications() {
        try {
            // Check if backend has getNotifications method
            if (typeof this.backend.getNotifications === 'function') {
                const notifications = await this.backend.getNotifications(this.currentUser.id, 'pending');
                if (notifications.success) {
                    this.displayNotifications(notifications.data);
                }
            } else {
                // Use demo notifications
                this.displayNotifications([]);
            }
        } catch (error) {
            console.error('❌ Failed to load notifications:', error);
        }
    }

    displayNotifications(notifications) {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell"></i>
                    <p>No new notifications</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = notifications.slice(0, 5).map(notification => `
            <div class="notification-item type-${notification.type}">
                <div class="notification-icon">
                    <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        ${notification.title}
                    </div>
                    <div class="notification-message">
                        ${notification.content}
                    </div>
                    <div class="notification-time">
                        ${this.formatRelativeTime(notification.created_at)}
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-sm btn-secondary" onclick="markNotificationRead('${notification.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // =====================================================
    // REAL-TIME UPDATES
    // =====================================================

    setupRealTimeUpdates() {
        // Set up periodic refresh for dynamic content
        this.refreshIntervals.set('stats', setInterval(() => {
            this.loadDashboardStats();
        }, 60000)); // Every minute
        
        this.refreshIntervals.set('notifications', setInterval(() => {
            this.loadNotifications();
        }, 30000)); // Every 30 seconds
    }

    setupAutoRefresh() {
        // User dashboard specific auto-refresh
        this.refreshIntervals.set('appointments', setInterval(() => {
            this.loadRecentAppointments();
        }, 120000)); // Every 2 minutes
        
        this.refreshIntervals.set('medications', setInterval(() => {
            this.loadActiveMedications();
        }, 300000)); // Every 5 minutes
    }

    setupProviderAutoRefresh() {
        // Provider dashboard specific auto-refresh
        this.refreshIntervals.set('schedule', setInterval(() => {
            this.loadTodaySchedule();
        }, 60000)); // Every minute
        
        this.refreshIntervals.set('patients', setInterval(() => {
            this.loadRecentPatients();
        }, 300000)); // Every 5 minutes
    }

    // =====================================================
    // ACTION HANDLERS
    // =====================================================

    async scheduleAppointment() {
        console.log('📅 Opening appointment scheduler...');
        this.showNotification('Appointment scheduler would open here', 'info');
    }

    async recordVitalSigns() {
        console.log('📊 Opening vital signs recorder...');
        this.showNotification('Vital signs recorder would open here', 'info');
    }

    async addMedication() {
        console.log('💊 Opening medication form...');
        this.showNotification('Medication form would open here', 'info');
    }

    async analyzeSymptoms() {
        console.log('🔍 Opening symptom checker...');
        this.showNotification('Symptom checker would open here', 'info');
    }

    async markMedicationTaken(medicationId) {
        try {
            console.log(`💊 Marking medication ${medicationId} as taken`);
            this.showNotification('Medication marked as taken', 'success');
        } catch (error) {
            console.error('❌ Failed to mark medication as taken:', error);
            this.showNotification('Failed to mark medication as taken', 'error');
        }
    }

    async cancelAppointment(appointmentId) {
        try {
            const reason = prompt('Please provide a reason for cancellation:');
            if (reason) {
                const result = await this.backend.cancelAppointment(appointmentId, reason);
                if (result.success) {
                    this.showNotification('Appointment cancelled successfully', 'success');
                    this.loadRecentAppointments();
                } else {
                    this.showNotification('Failed to cancel appointment', 'error');
                }
            }
        } catch (error) {
            console.error('❌ Failed to cancel appointment:', error);
            this.showNotification('Failed to cancel appointment', 'error');
        }
    }

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatRelativeTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return this.formatDate(dateString);
    }

    calculateAge(birthDate) {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    getBloodPressureStatus(systolic, diastolic) {
        if (systolic >= 180 || diastolic >= 120) return 'critical';
        if (systolic >= 140 || diastolic >= 90) return 'high';
        if (systolic >= 130 || diastolic >= 80) return 'elevated';
        return 'normal';
    }

    getBloodPressureStatusText(systolic, diastolic) {
        const status = this.getBloodPressureStatus(systolic, diastolic);
        const statusTexts = {
            normal: 'Normal',
            elevated: 'Elevated',
            high: 'High',
            critical: 'Critical - Seek immediate care'
        };
        return statusTexts[status] || 'Unknown';
    }

    getHeartRateStatus(heartRate) {
        if (heartRate < 60) return 'low';
        if (heartRate > 100) return 'high';
        return 'normal';
    }

    getHeartRateStatusText(heartRate) {
        const status = this.getHeartRateStatus(heartRate);
        const statusTexts = {
            low: 'Below Normal',
            normal: 'Normal',
            high: 'Above Normal'
        };
        return statusTexts[status] || 'Unknown';
    }

    getTemperatureStatus(temperature) {
        if (temperature < 97) return 'low';
        if (temperature > 99.5) return 'high';
        return 'normal';
    }

    getTemperatureStatusText(temperature) {
        const status = this.getTemperatureStatus(temperature);
        const statusTexts = {
            low: 'Below Normal',
            normal: 'Normal',
            high: 'Fever'
        };
        return statusTexts[status] || 'Unknown';
    }

    getNotificationIcon(type) {
        const icons = {
            appointment: 'fa-calendar',
            medication: 'fa-pills',
            health_alert: 'fa-exclamation-triangle',
            lab_result: 'fa-flask',
            message: 'fa-envelope',
            reminder: 'fa-bell'
        };
        return icons[type] || 'fa-info-circle';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // =====================================================
    // CLEANUP
    // =====================================================

    destroy() {
        // Clear all intervals
        this.refreshIntervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.refreshIntervals.clear();
        
        // Clear event handlers
        this.eventHandlers.clear();
        
        console.log('🧹 Dashboard integration cleaned up');
    }
}

// Global instance
let dashboardIntegration = null;

// Initialize dashboard integration when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Determine dashboard type from URL or page content
    const dashboardType = window.location.pathname.includes('provider') ? 'provider' : 'user';
    
    // Initialize dashboard integration
    dashboardIntegration = new DashboardBackendIntegration();
    await dashboardIntegration.initialize(dashboardType);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardBackendIntegration;
} else if (typeof window !== 'undefined') {
    window.DashboardBackendIntegration = DashboardBackendIntegration;
} 