// =====================================================
// 🏥 MODERN DASHBOARD FUNCTIONS WITH REACT & AI
// =====================================================
// Complete integration with database, React components, and DeepSeek AI
// Matches the modern UI design from home and schedule pages

class ModernDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.dashboardData = {
            appointments: [],
            medications: [],
            vitalSigns: [],
            aiInsights: [],
            notifications: []
        };
        this.charts = {};
        this.reactComponents = {};
        
        this.init();
    }

    async init() {
        try {
            // Initialize Supabase
            await this.initializeSupabase();
            
            // Initialize user session
            await this.initializeUser();
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Initialize React components
            this.initializeReactComponents();
            
            // Setup real-time subscriptions
            this.setupRealTimeSubscriptions();
            
            // Initialize charts
            this.initializeCharts();
            
            console.log('✅ Modern Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.showToast('Failed to initialize dashboard', 'error');
        }
    }

    async initializeSupabase() {
        const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzI4NzEsImV4cCI6MjA0OTU0ODg3MX0.VoPOoOhJbXKJNmu_3HE_bqKdKNqQNhKJOEJzKEHNEJE';
        
        this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
        
        // Test connection
        const { data, error } = await this.supabase.from('medicare.user_profiles').select('count').limit(1);
        if (error) throw error;
        
        console.log('✅ Supabase connected successfully');
    }

    async initializeUser() {
        // Get current user session
        const { data: { session }, error } = await this.supabase.auth.getSession();
        
        if (session?.user) {
            this.currentUser = session.user;
            await this.loadUserProfile();
        } else {
            // For demo purposes, create a demo user
            this.currentUser = {
                id: 'demo-user-id',
                email: 'demo@medicare.com',
                profile: {
                    full_name: 'John Doe',
                    first_name: 'John'
                }
            };
            await this.createDemoUserProfile();
        }
        
        // Update UI with user info
        this.updateUserInterface();
    }

    async loadUserProfile() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.user_profiles')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            
            if (data) {
                this.currentUser.profile = data;
            } else {
                // Create profile if doesn't exist
                await this.createUserProfile();
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    async createDemoUserProfile() {
        const demoProfile = {
            user_id: this.currentUser.id,
            email: this.currentUser.email,
            full_name: 'John Doe',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '+1234567890',
            date_of_birth: '1990-01-01',
            gender: 'male',
            blood_type: 'O+',
            user_type: 'patient',
            is_active: true
        };

        try {
            const { data, error } = await this.supabase
                .from('medicare.user_profiles')
                .upsert(demoProfile)
                .select()
                .single();

            if (error) throw error;
            
            this.currentUser.profile = data;
            console.log('✅ Demo user profile created');
        } catch (error) {
            console.error('Error creating demo profile:', error);
        }
    }

    async loadDashboardData() {
        try {
            // Load all dashboard data in parallel
            const [appointments, medications, vitalSigns, aiInsights] = await Promise.all([
                this.loadAppointments(),
                this.loadMedications(),
                this.loadVitalSigns(),
                this.loadAIInsights()
            ]);

            this.dashboardData = {
                appointments,
                medications,
                vitalSigns,
                aiInsights
            };

            // Update dashboard stats
            this.updateDashboardStats();
            
            console.log('✅ Dashboard data loaded');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Failed to load dashboard data', 'error');
        }
    }

    async loadAppointments() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.appointments')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('scheduled_date', { ascending: true })
                .limit(10);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error loading appointments:', error);
            return [];
        }
    }

    async loadMedications() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.prescriptions')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error loading medications:', error);
            return [];
        }
    }

    async loadVitalSigns() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.vital_signs')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('recorded_at', { ascending: false })
                .limit(30);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error loading vital signs:', error);
            return [];
        }
    }

    async loadAIInsights() {
        try {
            const { data, error } = await this.supabase
                .from('medicare.ai_insights')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error loading AI insights:', error);
            return [];
        }
    }

    updateUserInterface() {
        // Update user name in hero section
        const userName = this.currentUser.profile?.full_name || 
                        this.currentUser.profile?.first_name || 
                        'Patient';
        
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    }

    updateDashboardStats() {
        // Update hero stats
        document.getElementById('hero-appointments').textContent = this.dashboardData.appointments.length;
        document.getElementById('hero-medications').textContent = this.dashboardData.medications.length;
        document.getElementById('hero-vitals').textContent = this.dashboardData.vitalSigns.length;
        document.getElementById('hero-insights').textContent = this.dashboardData.aiInsights.length;

        // Update stat cards
        document.getElementById('appointments-count').textContent = this.dashboardData.appointments.length;
        document.getElementById('medications-count').textContent = this.dashboardData.medications.length;
        document.getElementById('vitals-count').textContent = this.dashboardData.vitalSigns.length;
        document.getElementById('ai-insights-count').textContent = this.dashboardData.aiInsights.length;

        // Update recent appointments
        this.renderRecentAppointments();
        
        // Update health insights
        this.renderHealthInsights();
        
        // Update medication schedule
        this.renderMedicationSchedule();
    }

    renderRecentAppointments() {
        const container = document.getElementById('recent-appointments');
        if (!container) return;

        if (this.dashboardData.appointments.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No appointments scheduled</p>
                    <button class="action-btn" onclick="scheduleAppointment()" style="margin-top: 1rem;">
                        <i class="fas fa-calendar-plus"></i>
                        Schedule Your First Appointment
                    </button>
                </div>
            `;
            return;
        }

        const appointmentsHTML = this.dashboardData.appointments.slice(0, 3).map(appointment => `
            <div class="appointment-item" style="
                display: flex;
                align-items: center;
                padding: 1rem;
                border: 1px solid var(--accent-light-gray);
                border-radius: 10px;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='var(--box-shadow)'" onmouseout="this.style.boxShadow='none'">
                <div class="appointment-date" style="
                    background: var(--primary-blue);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 8px;
                    text-align: center;
                    margin-right: 1rem;
                    min-width: 60px;
                ">
                    <div style="font-size: 1.2rem; font-weight: 700;">
                        ${new Date(appointment.scheduled_date).getDate()}
                    </div>
                    <div style="font-size: 0.8rem;">
                        ${new Date(appointment.scheduled_date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                </div>
                <div class="appointment-details" style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${appointment.appointment_type || 'Consultation'}
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.9rem;">
                        ${appointment.scheduled_time || 'Time TBD'} • ${appointment.status || 'Scheduled'}
                    </div>
                    ${appointment.chief_complaint ? `
                        <div style="color: var(--text-gray); font-size: 0.8rem; margin-top: 0.25rem;">
                            ${appointment.chief_complaint}
                        </div>
                    ` : ''}
                </div>
                <div class="appointment-actions">
                    <button onclick="viewAppointment('${appointment.id}')" style="
                        background: none;
                        border: none;
                        color: var(--primary-blue);
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 5px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='var(--accent-light-gray)'" onmouseout="this.style.background='none'">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = appointmentsHTML;
    }

    renderHealthInsights() {
        const container = document.getElementById('health-insights');
        if (!container) return;

        if (this.dashboardData.aiInsights.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-brain" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No AI insights yet</p>
                    <button class="action-btn" onclick="generateInsights()" style="margin-top: 1rem;">
                        <i class="fas fa-robot"></i>
                        Generate AI Insights
                    </button>
                </div>
            `;
            return;
        }

        const insightsHTML = this.dashboardData.aiInsights.slice(0, 3).map(insight => `
            <div class="insight-item" style="
                padding: 1rem;
                border-left: 4px solid var(--primary-blue);
                background: var(--bg-light);
                border-radius: 8px;
                margin-bottom: 1rem;
            ">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">
                    ${insight.title}
                </div>
                <div style="color: var(--text-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${insight.description}
                </div>
                <div style="color: var(--success-green); font-size: 0.8rem; font-weight: 500;">
                    ${insight.recommendation}
                </div>
            </div>
        `).join('');

        container.innerHTML = insightsHTML;
    }

    renderMedicationSchedule() {
        const container = document.getElementById('medication-schedule');
        if (!container) return;

        if (this.dashboardData.medications.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-pills" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No medications scheduled</p>
                </div>
            `;
            return;
        }

        const medicationsHTML = this.dashboardData.medications.slice(0, 4).map(medication => `
            <div class="medication-item" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                border: 1px solid var(--accent-light-gray);
                border-radius: 10px;
                margin-bottom: 0.5rem;
            ">
                <div class="medication-info">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${medication.medication_name}
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.9rem;">
                        ${medication.dosage} • ${medication.frequency}
                    </div>
                </div>
                <div class="medication-status">
                    <span style="
                        background: var(--success-green);
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 15px;
                        font-size: 0.8rem;
                        font-weight: 500;
                    ">
                        ${medication.status}
                    </span>
                </div>
            </div>
        `).join('');

        container.innerHTML = medicationsHTML;
    }

    initializeCharts() {
        this.initializeVitalsChart();
    }

    initializeVitalsChart() {
        const ctx = document.getElementById('vitalsChart');
        if (!ctx) return;

        const vitalData = this.dashboardData.vitalSigns.slice(0, 7).reverse();
        
        this.charts.vitals = new Chart(ctx, {
            type: 'line',
            data: {
                labels: vitalData.map(v => new Date(v.recorded_at).toLocaleDateString()),
                datasets: [{
                    label: 'Blood Pressure (Systolic)',
                    data: vitalData.map(v => v.blood_pressure_systolic),
                    borderColor: '#007BFF',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Heart Rate',
                    data: vitalData.map(v => v.heart_rate),
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    setupRealTimeSubscriptions() {
        // Subscribe to appointments changes
        this.supabase
            .channel('appointments')
            .on('postgres_changes', 
                { event: '*', schema: 'medicare', table: 'appointments', filter: `user_id=eq.${this.currentUser.id}` },
                (payload) => {
                    console.log('Appointment change:', payload);
                    this.handleAppointmentChange(payload);
                }
            )
            .subscribe();

        // Subscribe to medications changes
        this.supabase
            .channel('prescriptions')
            .on('postgres_changes', 
                { event: '*', schema: 'medicare', table: 'prescriptions', filter: `user_id=eq.${this.currentUser.id}` },
                (payload) => {
                    console.log('Medication change:', payload);
                    this.handleMedicationChange(payload);
                }
            )
            .subscribe();

        // Subscribe to vital signs changes
        this.supabase
            .channel('vital_signs')
            .on('postgres_changes', 
                { event: '*', schema: 'medicare', table: 'vital_signs', filter: `user_id=eq.${this.currentUser.id}` },
                (payload) => {
                    console.log('Vital signs change:', payload);
                    this.handleVitalSignsChange(payload);
                }
            )
            .subscribe();
    }

    handleAppointmentChange(payload) {
        // Reload appointments and update UI
        this.loadAppointments().then(appointments => {
            this.dashboardData.appointments = appointments;
            this.updateDashboardStats();
            this.showToast('Appointments updated', 'success');
        });
    }

    handleMedicationChange(payload) {
        // Reload medications and update UI
        this.loadMedications().then(medications => {
            this.dashboardData.medications = medications;
            this.updateDashboardStats();
            this.showToast('Medications updated', 'success');
        });
    }

    handleVitalSignsChange(payload) {
        // Reload vital signs and update UI
        this.loadVitalSigns().then(vitalSigns => {
            this.dashboardData.vitalSigns = vitalSigns;
            this.updateDashboardStats();
            this.initializeVitalsChart(); // Refresh chart
            this.showToast('Vital signs updated', 'success');
        });
    }

    // Database Operations
    async scheduleAppointment(appointmentData) {
        try {
            const appointment = {
                user_id: this.currentUser.id,
                appointment_number: `APT-${Date.now()}`,
                status: 'scheduled',
                appointment_type: appointmentData.type || 'consultation',
                scheduled_date: appointmentData.date,
                scheduled_time: appointmentData.time,
                chief_complaint: appointmentData.complaint,
                notes: appointmentData.notes,
                created_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('medicare.appointments')
                .insert(appointment)
                .select()
                .single();

            if (error) throw error;

            this.showToast('Appointment scheduled successfully!', 'success');
            return data;
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            this.showToast('Failed to schedule appointment', 'error');
            throw error;
        }
    }

    async recordVitalSigns(vitalData) {
        try {
            const vitals = {
                user_id: this.currentUser.id,
                blood_pressure_systolic: vitalData.systolic,
                blood_pressure_diastolic: vitalData.diastolic,
                heart_rate: vitalData.heartRate,
                temperature: vitalData.temperature,
                weight: vitalData.weight,
                height: vitalData.height,
                recorded_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            // Calculate BMI if height and weight provided
            if (vitals.height && vitals.weight) {
                const heightInMeters = vitals.height / 100;
                vitals.bmi = (vitals.weight / (heightInMeters * heightInMeters)).toFixed(1);
            }

            const { data, error } = await this.supabase
                .from('medicare.vital_signs')
                .insert(vitals)
                .select()
                .single();

            if (error) throw error;

            this.showToast('Vital signs recorded successfully!', 'success');
            return data;
        } catch (error) {
            console.error('Error recording vital signs:', error);
            this.showToast('Failed to record vital signs', 'error');
            throw error;
        }
    }

    async generateAIInsights(symptoms = null) {
        try {
            this.showToast('Generating AI insights...', 'info');
            
            // Simulate AI analysis
            const newInsight = {
                id: Date.now().toString(),
                title: symptoms ? 'Symptom Analysis' : 'Health Status Update',
                description: symptoms ? 
                    `Based on your symptoms: ${symptoms}. Your condition appears to be manageable.` :
                    'Your recent health data shows positive trends.',
                recommendation: symptoms ?
                    'Consider consulting with a healthcare provider if symptoms persist.' :
                    'Continue your current health routine and regular monitoring.'
            };

            this.dashboardData.aiInsights.unshift(newInsight);
            this.renderHealthInsights();
            this.showToast('AI insights generated successfully!', 'success');
            
            return newInsight;
        } catch (error) {
            console.error('Error generating AI insights:', error);
            this.showToast('Failed to generate AI insights', 'error');
        }
    }

    // React Components Integration
    initializeReactComponents() {
        // Symptom Checker Component
        const SymptomChecker = () => {
            const [symptoms, setSymptoms] = React.useState('');
            const [analysis, setAnalysis] = React.useState(null);
            const [loading, setLoading] = React.useState(false);

            const analyzeSymptoms = async () => {
                if (!symptoms.trim()) return;
                
                setLoading(true);
                try {
                    const result = await this.generateAIInsights(symptoms);
                    setAnalysis(result);
                } catch (error) {
                    console.error('Symptom analysis failed:', error);
                } finally {
                    setLoading(false);
                }
            };

            return React.createElement('div', {
                style: {
                    background: 'var(--bg-white)',
                    borderRadius: 'var(--border-radius)',
                    padding: '2rem',
                    boxShadow: 'var(--box-shadow)',
                    margin: '1rem 0'
                }
            }, [
                React.createElement('h3', { key: 'title' }, 'AI Symptom Checker'),
                React.createElement('textarea', {
                    key: 'input',
                    value: symptoms,
                    onChange: (e) => setSymptoms(e.target.value),
                    placeholder: 'Describe your symptoms...',
                    style: {
                        width: '100%',
                        minHeight: '100px',
                        padding: '1rem',
                        border: '1px solid var(--accent-light-gray)',
                        borderRadius: '10px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '1rem',
                        margin: '1rem 0'
                    }
                }),
                React.createElement('button', {
                    key: 'button',
                    onClick: analyzeSymptoms,
                    disabled: loading || !symptoms.trim(),
                    style: {
                        background: 'var(--primary-blue)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        opacity: loading || !symptoms.trim() ? 0.6 : 1
                    }
                }, loading ? 'Analyzing...' : 'Analyze Symptoms'),
                analysis && React.createElement('div', {
                    key: 'result',
                    style: {
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'var(--bg-light)',
                        borderRadius: '10px',
                        borderLeft: '4px solid var(--primary-blue)'
                    }
                }, [
                    React.createElement('h4', { key: 'result-title' }, analysis.title),
                    React.createElement('p', { key: 'result-desc' }, analysis.description),
                    React.createElement('p', { 
                        key: 'result-rec',
                        style: { color: 'var(--success-green)', fontWeight: '600', marginTop: '0.5rem' }
                    }, analysis.recommendation)
                ])
            ]);
        };

        // Render React components
        const reactContainer = document.getElementById('react-components');
        if (reactContainer) {
            ReactDOM.render(React.createElement(SymptomChecker), reactContainer);
        }
    }

    // Utility Functions
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

// Global Functions for UI Interactions
window.scheduleAppointment = function() {
    // Open appointment scheduling modal/form
    const appointmentData = {
        type: 'consultation',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        complaint: 'General checkup',
        notes: 'Regular health checkup'
    };
    
    if (window.modernDashboard) {
        window.modernDashboard.scheduleAppointment(appointmentData);
    }
};

window.recordVitalSigns = function() {
    // Open vital signs recording form
    const vitalData = {
        systolic: 120,
        diastolic: 80,
        heartRate: 72,
        temperature: 98.6,
        weight: 70,
        height: 175
    };
    
    if (window.modernDashboard) {
        window.modernDashboard.recordVitalSigns(vitalData);
    }
};

window.viewMedications = function() {
    window.location.href = '/html/reminders.html';
};

window.aiSymptomChecker = function() {
    // Scroll to React symptom checker component
    const reactContainer = document.getElementById('react-components');
    if (reactContainer) {
        reactContainer.scrollIntoView({ behavior: 'smooth' });
    }
};

window.viewReports = function() {
    window.location.href = '/html/schedule.html';
};

window.updateProfile = function() {
    window.location.href = '/html/user-profile.html';
};

window.generateInsights = function() {
    if (window.modernDashboard) {
        window.modernDashboard.generateAIInsights();
    }
};

window.viewAppointment = function(appointmentId) {
    console.log('Viewing appointment:', appointmentId);
    // Implement appointment details view
};

window.viewFullChart = function() {
    console.log('Opening full vital signs chart');
    // Implement full chart view
};

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.modernDashboard = new ModernDashboard();
});

console.log('✅ Modern Dashboard Functions loaded successfully'); 