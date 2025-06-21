// Enhanced Dashboard JavaScript - Advanced Features
class EnhancedDashboard {
    constructor() {
        this.healthData = {
            score: 85,
            appointments: [],
            medications: [],
            vitals: {},
            aiInsights: []
        };
        
        this.init();
    }

    init() {
        this.loadHealthData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    async loadHealthData() {
        try {
            this.healthData.appointments = await this.fetchAppointments();
            this.healthData.medications = await this.fetchMedications();
            this.healthData.vitals = await this.fetchVitals();
            this.healthData.aiInsights = await this.fetchAIInsights();
            
            this.updateDashboard();
        } catch (error) {
            console.error('Error loading health data:', error);
        }
    }

    async fetchAppointments() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: 'Annual Physical Checkup',
                        doctor: 'Dr. Sarah Johnson',
                        specialty: 'Internal Medicine',
                        date: '2025-01-18',
                        time: '14:00',
                        type: 'In-Person'
                    },
                    {
                        id: 2,
                        title: 'Cardiology Follow-up',
                        doctor: 'Dr. Michael Chen',
                        specialty: 'Cardiology',
                        date: '2025-01-22',
                        time: '10:30',
                        type: 'Telehealth'
                    }
                ]);
            }, 1000);
        });
    }

    async fetchMedications() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: 'Lisinopril',
                        dosage: '10mg',
                        frequency: 'Once daily',
                        adherence: 95
                    },
                    {
                        id: 2,
                        name: 'Metformin',
                        dosage: '500mg',
                        frequency: 'Twice daily',
                        adherence: 98
                    }
                ]);
            }, 800);
        });
    }

    async fetchVitals() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    bloodPressure: {
                        systolic: 120,
                        diastolic: 80,
                        trend: 'improving'
                    },
                    heartRate: {
                        value: 70,
                        trend: 'stable'
                    }
                });
            }, 600);
        });
    }

    async fetchAIInsights() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        type: 'heart_health',
                        title: 'Heart Health',
                        description: 'Your recent blood pressure readings show consistent improvement.',
                        priority: 'medium'
                    },
                    {
                        type: 'medication',
                        title: 'Medication Adherence',
                        description: 'Excellent medication compliance this month.',
                        priority: 'low'
                    }
                ]);
            }, 1200);
        });
    }

    updateDashboard() {
        this.updateQuickStats();
        this.updateAppointmentsList();
        this.updateAIInsights();
    }

    updateQuickStats() {
        const appointmentCount = document.querySelector('.appointments .stat-value');
        if (appointmentCount) {
            appointmentCount.textContent = this.healthData.appointments.length;
        }

        const medicationCount = document.querySelector('.medications .stat-value');
        if (medicationCount) {
            medicationCount.textContent = this.healthData.medications.length;
        }

        const adherence = this.calculateOverallAdherence();
        const adherenceElement = document.querySelector('.medications .stat-trend');
        if (adherenceElement) {
            adherenceElement.innerHTML = `<i class="fas fa-check"></i> ${adherence}% adherence`;
        }
    }

    calculateOverallAdherence() {
        if (this.healthData.medications.length === 0) return 0;
        
        const totalAdherence = this.healthData.medications.reduce((sum, med) => sum + med.adherence, 0);
        return Math.round(totalAdherence / this.healthData.medications.length);
    }

    initializeCharts() {
        this.createHealthMetricsChart();
    }

    createHealthMetricsChart() {
        const ctx = document.getElementById('healthMetricsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 17'],
                datasets: [{
                    label: 'Blood Pressure (Systolic)',
                    data: [140, 135, 130, 125, 120],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Heart Rate',
                    data: [80, 78, 75, 72, 70],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
                }
            }
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const cardType = card.classList[1];
                this.handleStatCardClick(cardType);
            });
        });
    }

    handleStatCardClick(cardType) {
        switch (cardType) {
            case 'health-score':
                alert('Health Score Details');
                break;
            case 'appointments':
                window.location.href = 'appointments.html';
                break;
            case 'medications':
                window.location.href = 'reminders.html';
                break;
            case 'vitals':
                alert('Vitals Details');
                break;
        }
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updateDateTime();
        }, 60000);
    }

    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        const greeting = this.getTimeBasedGreeting();
        const greetingElement = document.querySelector('.welcome-greeting');
        if (greetingElement) {
            greetingElement.innerHTML = `${greeting}, John! 👋`;
        }
    }

    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }

    updateAIInsights() {
        const insightsContainer = document.querySelector('.ai-insights-widget .widget-content');
        if (!insightsContainer) return;

        const insightsHTML = this.healthData.aiInsights.map(insight => `
            <div class="insight-item">
                <div class="insight-header">
                    <div class="insight-icon">
                        <i class="fas fa-${this.getInsightIcon(insight.type)}"></i>
                    </div>
                    <div class="insight-title">${insight.title}</div>
                </div>
                <div class="insight-description">${insight.description}</div>
            </div>
        `).join('');

        insightsContainer.innerHTML = insightsHTML;
    }

    getInsightIcon(type) {
        const icons = {
            'heart_health': 'heart',
            'medication': 'pills',
            'preventive_care': 'calendar-plus',
            'nutrition': 'utensils'
        };
        return icons[type] || 'lightbulb';
    }

    updateAppointmentsList() {
        const container = document.querySelector('.widget-content');
        if (!container) return;

        const appointmentsHTML = this.healthData.appointments.map(appointment => `
            <div class="appointment-item">
                <div class="appointment-time">
                    <div>${this.formatDate(appointment.date)}</div>
                    <div>${this.formatTime(appointment.time)}</div>
                </div>
                <div class="appointment-details">
                    <div class="appointment-title">${appointment.title}</div>
                    <div class="appointment-doctor">${appointment.doctor} - ${appointment.specialty}</div>
                    <span class="appointment-type">${appointment.type}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = appointmentsHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    }
}

// AI Chat Functions
function toggleAIChat() {
    const chatInterface = document.getElementById('aiChatInterface');
    const floatButton = document.querySelector('.ai-float-button');
    
    if (chatInterface.style.display === 'none' || chatInterface.style.display === '') {
        chatInterface.style.display = 'flex';
        floatButton.style.display = 'none';
    } else {
        chatInterface.style.display = 'none';
        floatButton.style.display = 'flex';
    }
}

function sendChatMessage() {
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            addChatMessage(aiResponse, 'ai');
        }, 1000);
    }
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? 'You' : 'AI'}</div>
        <div class="message-content">${message}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const responses = {
        'medication': 'Your medication adherence is excellent at 97%. Keep up the great work!',
        'appointment': 'You have 3 upcoming appointments. Your next one is tomorrow at 2:00 PM.',
        'health': 'Your health score is 85, which is excellent! Your trends are improving.',
        'default': 'I can help you with medication reminders, appointments, and health insights. What would you like to know?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('medication')) {
        return responses.medication;
    } else if (lowerMessage.includes('appointment')) {
        return responses.appointment;
    } else if (lowerMessage.includes('health')) {
        return responses.health;
    } else {
        return responses.default;
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Navigation Functions
function viewHealthScore() {
    alert('Navigating to detailed health score analysis...');
}

function viewAppointments() {
    window.location.href = 'appointments.html';
}

function viewMedications() {
    window.location.href = 'reminders.html';
}

function viewVitals() {
    alert('Navigating to vital signs tracking...');
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new EnhancedDashboard();
}); 