// =====================================================
// 🏥 MODERN PROVIDER DASHBOARD FUNCTIONS
// =====================================================

class ModernProviderDashboard {
    constructor() {
        this.supabase = null;
        this.currentProvider = null;
        this.dashboardData = {
            patients: [],
            appointments: [],
            prescriptions: [],
            analytics: {}
        };
        this.charts = {};
        
        this.init();
    }

    async init() {
        try {
            await this.initializeSupabase();
            await this.initializeProvider();
            await this.loadDashboardData();
            this.setupRealTimeSubscriptions();
            this.initializeCharts();
            
            console.log('✅ Provider Dashboard initialized');
        } catch (error) {
            console.error('❌ Provider Dashboard initialization failed:', error);
            this.showToast('Failed to initialize dashboard', 'error');
        }
    }

    async initializeSupabase() {
        const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzI4NzEsImV4cCI6MjA0OTU0ODg3MX0.VoPOoOhJbXKJNmu_3HE_bqKdKNqQNhKJOEJzKEHNEJE';
        
        this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase connected');
    }

    async initializeProvider() {
        this.currentProvider = {
            id: 'demo-provider-id',
            email: 'dr.smith@medicare.com',
            profile: {
                full_name: 'Dr. Sarah Smith',
                first_name: 'Sarah',
                last_name: 'Smith',
                user_type: 'provider'
            }
        };
        this.updateProviderInterface();
    }

    async loadDashboardData() {
        // Load sample data for demo
        this.dashboardData = {
            patients: [
                {
                    id: '1',
                    full_name: 'John Doe',
                    email: 'john@example.com',
                    phone_number: '+1234567890',
                    status: 'stable',
                    last_visit: '2024-12-15',
                    condition: 'Hypertension'
                },
                {
                    id: '2',
                    full_name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone_number: '+1234567891',
                    status: 'critical',
                    last_visit: '2024-12-18',
                    condition: 'Diabetes'
                },
                {
                    id: '3',
                    full_name: 'Bob Johnson',
                    email: 'bob@example.com',
                    phone_number: '+1234567892',
                    status: 'monitoring',
                    last_visit: '2024-12-10',
                    condition: 'Heart Disease'
                }
            ],
            appointments: [
                {
                    id: '1',
                    patient_name: 'John Doe',
                    appointment_type: 'Follow-up',
                    scheduled_time: '09:00',
                    status: 'confirmed',
                    chief_complaint: 'Blood pressure check'
                },
                {
                    id: '2',
                    patient_name: 'Jane Smith',
                    appointment_type: 'Emergency',
                    scheduled_time: '10:30',
                    status: 'urgent',
                    chief_complaint: 'Chest pain'
                }
            ],
            prescriptions: [
                {
                    id: '1',
                    patient_name: 'John Doe',
                    medication_name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    prescribed_date: '2024-12-18'
                },
                {
                    id: '2',
                    patient_name: 'Jane Smith',
                    medication_name: 'Metformin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    prescribed_date: '2024-12-17'
                }
            ],
            analytics: {
                totalPatients: 150,
                todayAppointments: 12,
                monthlyRevenue: 45000,
                patientSatisfaction: 94
            }
        };
        
        this.updateDashboardStats();
        this.checkCriticalPatients();
    }

    updateProviderInterface() {
        const providerName = this.currentProvider.profile?.last_name || 'Doctor';
        const providerNameElement = document.getElementById('provider-name');
        if (providerNameElement) {
            providerNameElement.textContent = providerName;
        }
    }

    updateDashboardStats() {
        const analytics = this.dashboardData.analytics;
        
        // Update hero stats
        document.getElementById('hero-patients').textContent = analytics.totalPatients;
        document.getElementById('hero-appointments').textContent = analytics.todayAppointments;
        document.getElementById('hero-revenue').textContent = `$${analytics.monthlyRevenue.toLocaleString()}`;
        document.getElementById('hero-satisfaction').textContent = `${analytics.patientSatisfaction}%`;

        // Update stat cards
        document.getElementById('patients-count').textContent = analytics.totalPatients;
        document.getElementById('appointments-count').textContent = analytics.todayAppointments;
        document.getElementById('revenue-count').textContent = `$${analytics.monthlyRevenue.toLocaleString()}`;
        document.getElementById('analytics-count').textContent = `${analytics.patientSatisfaction}%`;

        // Update change indicators
        document.getElementById('patients-change').textContent = '+15 new this month';
        document.getElementById('appointments-change').textContent = '+3 scheduled';
        document.getElementById('revenue-change').textContent = '+12% from last month';
        document.getElementById('analytics-change').textContent = '+2% improvement';

        this.renderTodaysAppointments();
        this.renderCriticalPatients();
        this.renderRecentPrescriptions();
    }

    renderTodaysAppointments() {
        const container = document.getElementById('todays-appointments');
        if (!container) return;

        if (this.dashboardData.appointments.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No appointments scheduled for today</p>
                </div>
            `;
            return;
        }

        const appointmentsHTML = this.dashboardData.appointments.map(appointment => `
            <div class="appointment-item" style="
                display: flex;
                align-items: center;
                padding: 1rem;
                border: 1px solid var(--accent-light-gray);
                border-radius: 10px;
                margin-bottom: 1rem;
                ${appointment.status === 'urgent' ? 'border-left: 4px solid var(--soft-red);' : ''}
            ">
                <div class="appointment-time" style="
                    background: ${appointment.status === 'urgent' ? 'var(--soft-red)' : 'var(--success-green)'};
                    color: white;
                    padding: 0.5rem;
                    border-radius: 8px;
                    text-align: center;
                    margin-right: 1rem;
                    min-width: 60px;
                    font-weight: 600;
                ">
                    ${appointment.scheduled_time}
                </div>
                <div class="appointment-details" style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${appointment.patient_name}
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.9rem;">
                        ${appointment.appointment_type} • ${appointment.status}
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.8rem; margin-top: 0.25rem;">
                        ${appointment.chief_complaint}
                    </div>
                </div>
                <div class="appointment-actions">
                    <button onclick="viewPatient('${appointment.id}')" style="
                        background: none;
                        border: none;
                        color: var(--success-green);
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 5px;
                        margin-right: 0.5rem;
                    ">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="startConsultation('${appointment.id}')" style="
                        background: var(--success-green);
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 0.5rem 1rem;
                        border-radius: 5px;
                        font-size: 0.8rem;
                    ">
                        Start
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = appointmentsHTML;
    }

    renderCriticalPatients() {
        const container = document.getElementById('critical-patients');
        if (!container) return;

        const criticalPatients = this.dashboardData.patients.filter(p => p.status === 'critical' || p.status === 'monitoring');

        if (criticalPatients.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-user-check" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; color: var(--success-green);"></i>
                    <p>All patients are stable</p>
                </div>
            `;
            return;
        }

        const patientsHTML = criticalPatients.map(patient => `
            <div class="patient-item">
                <div class="patient-avatar">
                    ${patient.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="patient-info">
                    <div class="patient-name">${patient.full_name}</div>
                    <div class="patient-details">${patient.condition} • Last visit: ${new Date(patient.last_visit).toLocaleDateString()}</div>
                </div>
                <div class="patient-status ${patient.status}">
                    ${patient.status}
                </div>
            </div>
        `).join('');

        container.innerHTML = patientsHTML;
    }

    renderRecentPrescriptions() {
        const container = document.getElementById('recent-prescriptions');
        if (!container) return;

        const prescriptionsHTML = this.dashboardData.prescriptions.map(prescription => `
            <div class="prescription-item" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                border: 1px solid var(--accent-light-gray);
                border-radius: 10px;
                margin-bottom: 1rem;
            ">
                <div class="prescription-info">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${prescription.medication_name}
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.9rem;">
                        ${prescription.patient_name} • ${prescription.dosage} ${prescription.frequency}
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.8rem;">
                        Prescribed: ${new Date(prescription.prescribed_date).toLocaleDateString()}
                    </div>
                </div>
                <div class="prescription-actions">
                    <button onclick="viewPrescription('${prescription.id}')" style="
                        background: none;
                        border: none;
                        color: var(--success-green);
                        cursor: pointer;
                        padding: 0.5rem;
                    ">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = prescriptionsHTML;
    }

    initializeCharts() {
        const ctx = document.getElementById('analyticsChart');
        if (!ctx) return;

        this.charts.analytics = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Stable', 'Monitoring', 'Critical', 'Recovered'],
                datasets: [{
                    data: [120, 20, 5, 5],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545',
                        '#007bff'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    checkCriticalPatients() {
        const criticalPatients = this.dashboardData.patients.filter(p => p.status === 'critical');
        
        if (criticalPatients.length > 0) {
            this.showEmergencyAlert(`${criticalPatients.length} patient(s) require immediate attention`);
        }
    }

    showEmergencyAlert(message) {
        const alertElement = document.getElementById('emergency-alert');
        const messageElement = document.getElementById('emergency-message');
        
        if (alertElement && messageElement) {
            messageElement.textContent = message;
            alertElement.style.display = 'flex';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 10000);
        }
    }

    setupRealTimeSubscriptions() {
        console.log('Provider real-time subscriptions setup');
    }

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

    // Provider-specific functions
    async addNewPatient(patientData) {
        try {
            this.showToast('Adding new patient...', 'info');
            
            // Simulate adding patient
            const newPatient = {
                id: Date.now().toString(),
                full_name: patientData.name || 'New Patient',
                email: patientData.email || 'patient@example.com',
                phone_number: patientData.phone || '+1234567890',
                status: 'stable',
                last_visit: new Date().toISOString().split('T')[0],
                condition: patientData.condition || 'General'
            };

            this.dashboardData.patients.push(newPatient);
            this.dashboardData.analytics.totalPatients++;
            this.updateDashboardStats();
            this.showToast('Patient added successfully!', 'success');
            
            return newPatient;
        } catch (error) {
            console.error('Error adding patient:', error);
            this.showToast('Failed to add patient', 'error');
        }
    }

    async writePrescription(prescriptionData) {
        try {
            this.showToast('Writing prescription...', 'info');
            
            const newPrescription = {
                id: Date.now().toString(),
                patient_name: prescriptionData.patientName || 'Patient',
                medication_name: prescriptionData.medication || 'Medication',
                dosage: prescriptionData.dosage || '10mg',
                frequency: prescriptionData.frequency || 'Once daily',
                prescribed_date: new Date().toISOString().split('T')[0]
            };

            this.dashboardData.prescriptions.unshift(newPrescription);
            this.renderRecentPrescriptions();
            this.showToast('Prescription written successfully!', 'success');
            
            return newPrescription;
        } catch (error) {
            console.error('Error writing prescription:', error);
            this.showToast('Failed to write prescription', 'error');
        }
    }

    async generateAIDiagnostics(patientData, symptoms) {
        try {
            this.showToast('Generating AI diagnostics...', 'info');
            
            // Simulate AI analysis
            const diagnostics = {
                patientId: patientData.id,
                symptoms: symptoms,
                analysis: 'Based on the symptoms provided, the patient may have a common cold or viral infection.',
                recommendations: [
                    'Rest and hydration',
                    'Monitor temperature',
                    'Follow up if symptoms worsen'
                ],
                confidence: 85,
                urgency: 'low'
            };

            this.showToast('AI diagnostics generated successfully!', 'success');
            return diagnostics;
        } catch (error) {
            console.error('Error generating AI diagnostics:', error);
            this.showToast('Failed to generate AI diagnostics', 'error');
        }
    }
}

// Global Functions for Provider Dashboard
window.addNewPatient = function() {
    const patientData = {
        name: prompt('Enter patient name:'),
        email: prompt('Enter patient email:'),
        phone: prompt('Enter patient phone:'),
        condition: prompt('Enter medical condition:')
    };
    
    if (patientData.name && window.providerDashboard) {
        window.providerDashboard.addNewPatient(patientData);
    }
};

window.scheduleAppointment = function() {
    if (window.providerDashboard) {
        window.providerDashboard.showToast('Appointment scheduling opened', 'info');
    }
    window.location.href = '/html/appointments.html';
};

window.writePrescription = function() {
    const prescriptionData = {
        patientName: prompt('Enter patient name:'),
        medication: prompt('Enter medication name:'),
        dosage: prompt('Enter dosage:'),
        frequency: prompt('Enter frequency:')
    };
    
    if (prescriptionData.patientName && window.providerDashboard) {
        window.providerDashboard.writePrescription(prescriptionData);
    }
};

window.viewReports = function() {
    window.location.href = '/html/schedule.html';
};

window.patientRecords = function() {
    if (window.providerDashboard) {
        window.providerDashboard.showToast('Patient records opened', 'info');
    }
};

window.aiDiagnostics = function() {
    const symptoms = prompt('Enter patient symptoms for AI analysis:');
    if (symptoms && window.providerDashboard) {
        const patientData = { id: 'demo-patient' };
        window.providerDashboard.generateAIDiagnostics(patientData, symptoms);
    }
};

window.viewAllPatients = function() {
    if (window.providerDashboard) {
        window.providerDashboard.showToast('All patients view opened', 'info');
    }
};

window.viewAllPrescriptions = function() {
    if (window.providerDashboard) {
        window.providerDashboard.showToast('All prescriptions view opened', 'info');
    }
};

window.viewFullAnalytics = function() {
    if (window.providerDashboard) {
        window.providerDashboard.showToast('Full analytics view opened', 'info');
    }
};

window.viewPatient = function(appointmentId) {
    console.log('Viewing patient for appointment:', appointmentId);
    if (window.providerDashboard) {
        window.providerDashboard.showToast('Patient details opened', 'info');
    }
};

window.startConsultation = function(appointmentId) {
    console.log('Starting consultation for appointment:', appointmentId);
    if (window.providerDashboard) {
        window.providerDashboard.showToast('Consultation started', 'success');
    }
};

window.viewPrescription = function(prescriptionId) {
    console.log('Viewing prescription:', prescriptionId);
    if (window.providerDashboard) {
        window.providerDashboard.showToast('Prescription details opened', 'info');
    }
};

// Initialize Provider Dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.providerDashboard = new ModernProviderDashboard();
});

console.log('✅ Modern Provider Dashboard Functions loaded'); 