/**
 * Comprehensive Health Dashboard JavaScript
 * Inspired by Mayo Clinic, Kaiser Permanente, and Cleveland Clinic
 * Features: AI Health Assistant, Family Management, Wearables Integration, EHR Interoperability
 */

class HealthDashboard {
    constructor() {
        this.familyMembers = [];
        this.wearableDevices = [];
        this.healthInsights = [];
        this.aiChatHistory = [];
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.initializeEventListeners();
        this.initializeWearableSync();
        this.initializeAIAssistant();
        this.loadFamilyMembers();
        this.startHealthMonitoring();
    }

    // User Data Management
    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateWelcomeMessage();
        }
    }

    updateWelcomeMessage() {
        const welcomeElement = document.querySelector('.welcome-message');
        if (welcomeElement && this.currentUser) {
            welcomeElement.textContent = `Welcome back, ${this.currentUser.name}! 👋`;
        }
    }

    // Family Management System
    loadFamilyMembers() {
        // Simulate loading family data
        this.familyMembers = [
            {
                id: 'fam_001',
                name: 'Sarah Martinez',
                relation: 'Wife',
                age: 42,
                healthStatus: 'excellent',
                conditions: ['Diabetes Type 2', 'Hypertension'],
                metrics: {
                    heartRate: 72,
                    bloodPressure: '120/80',
                    bloodSugar: 95,
                    weight: 138
                },
                lastCheckup: '2024-01-15',
                nextAppointment: '2024-03-15',
                avatar: 'SM'
            },
            {
                id: 'fam_002',
                name: 'Michael Martinez',
                relation: 'Son',
                age: 16,
                healthStatus: 'good',
                conditions: ['Asthma'],
                metrics: {
                    heartRate: 78,
                    height: '5\'8"',
                    weight: 145,
                    bmi: 22.1
                },
                lastCheckup: '2024-01-20',
                nextAppointment: '2024-04-20',
                avatar: 'MM'
            },
            {
                id: 'fam_003',
                name: 'Elena Martinez',
                relation: 'Daughter',
                age: 12,
                healthStatus: 'excellent',
                conditions: [],
                metrics: {
                    heartRate: 85,
                    height: '4\'10"',
                    weight: 95,
                    bmi: 19.8
                },
                lastCheckup: '2024-01-22',
                nextAppointment: '2024-04-22',
                avatar: 'EM'
            }
        ];

        this.renderFamilyMembers();
    }

    renderFamilyMembers() {
        const container = document.querySelector('.family-members-grid');
        if (!container) return;

        container.innerHTML = '';

        this.familyMembers.forEach(member => {
            const memberCard = this.createFamilyMemberCard(member);
            container.appendChild(memberCard);
        });
    }

    createFamilyMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'family-member-card';
        card.setAttribute('data-member-id', member.id);

        // Set gradient based on health status
        const gradientMap = {
            'excellent': '--member-gradient: var(--health-gradient-primary)',
            'good': '--member-gradient: var(--health-gradient-secondary)',
            'attention': '--member-gradient: var(--health-gradient-warning)',
            'critical': '--member-gradient: var(--health-gradient-danger)'
        };

        card.style.cssText = gradientMap[member.healthStatus] || '';

        card.innerHTML = `
            <div class="member-header">
                <div class="member-avatar">
                    ${member.avatar}
                    <div class="member-status-indicator status-${member.healthStatus}"></div>
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <div class="member-relation">${member.relation}</div>
                    <div class="member-age">${member.age} years old</div>
                </div>
            </div>
            
            <div class="member-health-summary">
                ${Object.entries(member.metrics).slice(0, 4).map(([key, value]) => `
                    <div class="health-metric">
                        <span class="metric-value">${value}</span>
                        <span class="metric-label">${this.formatMetricLabel(key)}</span>
                    </div>
                `).join('')}
            </div>
            
            ${member.conditions.length > 0 ? `
                <div class="member-conditions">
                    <div class="conditions-title">Conditions:</div>
                    <div class="condition-tags">
                        ${member.conditions.map(condition => `
                            <span class="condition-tag">${condition}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="member-actions">
                <button class="action-btn view-records-btn" onclick="healthDashboard.viewMemberRecords('${member.id}')">
                    <i class="fas fa-file-medical"></i>
                    <span>Records</span>
                </button>
                <button class="action-btn schedule-appointment-btn" onclick="healthDashboard.scheduleAppointment('${member.id}')">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Schedule</span>
                </button>
            </div>
        `;

        return card;
    }

    formatMetricLabel(key) {
        const labelMap = {
            'heartRate': 'Heart Rate',
            'bloodPressure': 'BP',
            'bloodSugar': 'Blood Sugar',
            'weight': 'Weight',
            'height': 'Height',
            'bmi': 'BMI'
        };
        return labelMap[key] || key;
    }

    addFamilyMember() {
        // Show add family member modal
        this.showModal('add-family-modal');
    }

    viewMemberRecords(memberId) {
        const member = this.familyMembers.find(m => m.id === memberId);
        if (member) {
            console.log('Viewing records for:', member.name);
            this.showToast(`Opening health records for ${member.name}`, 'info');
        }
    }

    scheduleAppointment(memberId) {
        const member = this.familyMembers.find(m => m.id === memberId);
        if (member) {
            console.log('Scheduling appointment for:', member.name);
            this.showToast(`Scheduling appointment for ${member.name}`, 'success');
        }
    }

    // Wearable Device Integration
    initializeWearableSync() {
        this.wearableDevices = [
            {
                id: 'device_001',
                name: 'Apple Watch Series 9',
                type: 'smartwatch',
                status: 'connected',
                batteryLevel: 85,
                lastSync: new Date(),
                metrics: {
                    steps: 8547,
                    heartRate: 68,
                    calories: 2150,
                    sleep: '7h 32m'
                }
            },
            {
                id: 'device_002',
                name: 'Fitbit Charge 5',
                type: 'fitness_tracker',
                status: 'syncing',
                batteryLevel: 92,
                lastSync: new Date(Date.now() - 15 * 60 * 1000),
                metrics: {
                    steps: 8547,
                    distance: '4.2 mi',
                    activeMinutes: 45,
                    stress: 'Low'
                }
            },
            {
                id: 'device_003',
                name: 'Omron Blood Pressure Monitor',
                type: 'medical_device',
                status: 'connected',
                batteryLevel: 78,
                lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
                metrics: {
                    systolic: 118,
                    diastolic: 76,
                    pulse: 68,
                    lastReading: '2 hours ago'
                }
            }
        ];

        this.renderWearableDevices();
        this.startRealtimeSync();
    }

    renderWearableDevices() {
        const container = document.querySelector('.wearable-devices-grid');
        if (!container) return;

        container.innerHTML = '';

        this.wearableDevices.forEach(device => {
            const deviceCard = this.createWearableDeviceCard(device);
            container.appendChild(deviceCard);
        });
    }

    createWearableDeviceCard(device) {
        const card = document.createElement('div');
        card.className = 'wearable-device-card';
        card.setAttribute('data-device-id', device.id);

        const deviceIcons = {
            smartwatch: 'fas fa-clock',
            fitness_tracker: 'fas fa-running',
            medical_device: 'fas fa-heartbeat'
        };

        const statusColors = {
            connected: 'status-connected',
            syncing: 'status-syncing',
            disconnected: 'status-disconnected'
        };

        card.innerHTML = `
            <div class="device-header">
                <div class="device-icon">
                    <i class="${deviceIcons[device.type]}"></i>
                </div>
                <div class="device-info">
                    <h3>${device.name}</h3>
                    <div class="device-model">${device.type.replace('_', ' ').toUpperCase()}</div>
                    <div class="device-status ${statusColors[device.status]}">
                        <i class="fas fa-circle"></i>
                        <span>${device.status.charAt(0).toUpperCase() + device.status.slice(1)}</span>
                        <span style="margin-left: 0.5rem;">• ${device.batteryLevel}%</span>
                    </div>
                </div>
            </div>
            
            <div class="device-metrics">
                ${Object.entries(device.metrics).slice(0, 4).map(([key, value]) => `
                    <div class="device-metric">
                        <span class="device-metric-value">${value}</span>
                        <span class="device-metric-label">${this.formatMetricLabel(key)}</span>
                    </div>
                `).join('')}
            </div>
        `;

        return card;
    }

    syncAllDevices() {
        this.showToast('Syncing all devices...', 'info');
        
        // Simulate sync process
        this.wearableDevices.forEach((device, index) => {
            setTimeout(() => {
                device.status = 'syncing';
                device.lastSync = new Date();
                
                setTimeout(() => {
                    device.status = 'connected';
                    this.renderWearableDevices();
                    
                    if (index === this.wearableDevices.length - 1) {
                        this.showToast('All devices synchronized successfully!', 'success');
                    }
                }, 2000 + Math.random() * 1000);
            }, index * 500);
        });
    }

    startRealtimeSync() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateRealtimeMetrics();
        }, 30000); // Update every 30 seconds
    }

    updateRealtimeMetrics() {
        // Simulate changing metrics
        this.wearableDevices.forEach(device => {
            if (device.type === 'smartwatch' || device.type === 'fitness_tracker') {
                // Update steps gradually
                if (device.metrics.steps) {
                    device.metrics.steps += Math.floor(Math.random() * 50);
                }
                
                // Update heart rate slightly
                if (device.metrics.heartRate) {
                    device.metrics.heartRate += Math.floor(Math.random() * 6) - 3;
                    device.metrics.heartRate = Math.max(50, Math.min(120, device.metrics.heartRate));
                }
            }
        });

        this.renderWearableDevices();
    }

    // AI Health Assistant
    initializeAIAssistant() {
        this.aiChatHistory = [
            {
                type: 'ai',
                message: 'Hello! I\'m your AI Health Assistant. I can help you with symptom checking, medication reminders, health insights, and appointment scheduling. How can I assist you today?',
                timestamp: new Date()
            }
        ];

        this.renderChatHistory();
    }

    toggleAIChat() {
        const chatContainer = document.querySelector('.ai-chat-container');
        if (chatContainer) {
            chatContainer.classList.toggle('active');
        }
    }

    sendAIMessage() {
        const input = document.querySelector('.chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.aiChatHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date()
        });

        input.value = '';
        this.renderChatHistory();

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = this.generateAIResponse(message);
            this.aiChatHistory.push({
                type: 'ai',
                message: aiResponse,
                timestamp: new Date()
            });
            this.renderChatHistory();
        }, 1000 + Math.random() * 2000);
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('symptom') || message.includes('pain') || message.includes('hurt')) {
            return 'I understand you\'re experiencing symptoms. Can you describe where you feel discomfort and how long you\'ve been experiencing this? I can help assess your symptoms and recommend next steps.';
        }
        
        if (message.includes('medication') || message.includes('medicine') || message.includes('prescription')) {
            return 'For medication questions, I can help you understand dosages, set reminders, and check for interactions. What specific medication information do you need?';
        }
        
        if (message.includes('appointment') || message.includes('doctor') || message.includes('schedule')) {
            return 'I can help you schedule appointments with your healthcare providers. Would you like to see available slots for your primary care physician or a specialist?';
        }
        
        if (message.includes('family') || message.includes('child') || message.includes('spouse')) {
            return 'I can assist with family health management. Would you like to view health summaries for family members, schedule appointments, or set up health reminders?';
        }
        
        if (message.includes('data') || message.includes('sync') || message.includes('device')) {
            return 'Your wearable devices are providing valuable health data. I can analyze trends in your activity, sleep, and vital signs. Would you like to see your latest health insights?';
        }
        
        return 'Thank you for your message. I\'m here to help with all your health-related questions. You can ask me about symptoms, medications, appointments, family health, or device data. How can I assist you further?';
    }

    renderChatHistory() {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';

        this.aiChatHistory.forEach(chat => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ${chat.type}`;
            
            messageDiv.innerHTML = `
                <div class="message-avatar ${chat.type}-avatar">
                    ${chat.type === 'ai' ? 'AI' : 'You'}
                </div>
                <div class="message-content">
                    ${chat.message}
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Health Monitoring & Insights
    startHealthMonitoring() {
        this.generateHealthInsights();
        
        // Update insights periodically
        setInterval(() => {
            this.generateHealthInsights();
        }, 300000); // Every 5 minutes
    }

    generateHealthInsights() {
        const insights = [
            {
                type: 'activity',
                title: 'Activity Goal Achievement',
                message: 'You\'ve reached 85% of your daily step goal. Keep it up!',
                priority: 'medium',
                timestamp: new Date()
            },
            {
                type: 'heart_rate',
                title: 'Heart Rate Variability',
                message: 'Your resting heart rate has improved by 3 BPM this week.',
                priority: 'low',
                timestamp: new Date()
            },
            {
                type: 'sleep',
                title: 'Sleep Quality',
                message: 'Your sleep score has been consistently above 80. Excellent!',
                priority: 'low',
                timestamp: new Date()
            },
            {
                type: 'medication',
                title: 'Medication Reminder',
                message: 'Time for your evening medication (Lisinopril 10mg)',
                priority: 'high',
                timestamp: new Date()
            }
        ];

        this.healthInsights = insights;
        this.displayHealthInsights();
    }

    displayHealthInsights() {
        // Display insights in notifications area or dedicated section
        const highPriorityInsights = this.healthInsights.filter(insight => insight.priority === 'high');
        
        if (highPriorityInsights.length > 0) {
            highPriorityInsights.forEach(insight => {
                this.showToast(insight.message, 'warning');
            });
        }
    }

    // Event Listeners
    initializeEventListeners() {
        // Family management
        const addFamilyBtn = document.querySelector('.add-family-btn');
        if (addFamilyBtn) {
            addFamilyBtn.addEventListener('click', () => this.addFamilyMember());
        }

        // Wearable sync
        const syncAllBtn = document.querySelector('.sync-all-btn');
        if (syncAllBtn) {
            syncAllBtn.addEventListener('click', () => this.syncAllDevices());
        }

        // AI Chat
        const chatInput = document.querySelector('.chat-input');
        const chatSendBtn = document.querySelector('.chat-send-btn');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendAIMessage();
                }
            });
        }
        
        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', () => this.sendAIMessage());
        }

        // AI Chat toggle
        const aiChatToggle = document.querySelector('.ai-chat-toggle');
        if (aiChatToggle) {
            aiChatToggle.addEventListener('click', () => this.toggleAIChat());
        }

        // Close AI Chat
        const aiChatClose = document.querySelector('.ai-chat-close');
        if (aiChatClose) {
            aiChatClose.addEventListener('click', () => this.toggleAIChat());
        }
    }

    // Utility Functions
    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Health Records Integration
    exportHealthData() {
        const healthData = {
            user: this.currentUser,
            familyMembers: this.familyMembers,
            wearableData: this.wearableDevices,
            insights: this.healthInsights,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(healthData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `health-data-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showToast('Health data exported successfully!', 'success');
    }

    // Emergency Contact System
    triggerEmergencyAlert() {
        // In a real implementation, this would contact emergency services
        console.log('Emergency alert triggered!');
        this.showToast('Emergency alert sent to your emergency contacts', 'warning');
        
        // Simulate sending alerts to family members
        this.familyMembers.forEach(member => {
            console.log(`Emergency alert sent to ${member.name}`);
        });
    }
}

// Initialize the health dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.healthDashboard = new HealthDashboard();
});

// Toast notification styles (if not already in CSS)
const toastStyles = `
    .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .toast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-radius: 10px;
        color: white;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    }

    .toast-success { background: var(--health-gradient-primary); }
    .toast-error { background: var(--health-gradient-danger); }
    .toast-warning { background: var(--health-gradient-warning); }
    .toast-info { background: var(--health-gradient-secondary); }

    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .toast-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject toast styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet); 