/**
 * MediCare+ Dashboard Integration
 * Connects UI components with backend API and AI assistant
 * Provides real-time data synchronization and interactive functionality
 */

// Global configuration
const DASHBOARD_CONFIG = {
    version: '2.0.0',
    environment: 'development',
    features: {
        aiHealthCoach: true,
        medicationTracker: true,
        fitnessIntegration: true,
        voiceCommands: true,
        smartAnalytics: true,
        realTimeUpdates: true
    },
    supabase: {
        url: 'https://gcggnrwqilylyykppizb.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzE4NzEsImV4cCI6MjA1MDEwNzg3MX0.4_8nOLLaLdtaUNJhJNhWJhJhJNhWJhJhJNhWJhJhJNhW'
    },
    deepseek: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat'
    }
};

// Main Dashboard Controller
class EnhancedDashboardController {
    constructor() {
        this.initialized = false;
        this.modules = {};
        this.eventListeners = [];
        this.updateInterval = null;
    }

    async initialize() {
        try {
            console.log('🚀 Initializing Enhanced Dashboard v' + DASHBOARD_CONFIG.version);
            
            // Show loading state
            this.showLoadingState();
            
            // Initialize core modules
            await this.initializeCore();
            
            // Initialize feature modules
            await this.initializeFeatures();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('✅ Enhanced Dashboard initialized successfully');
            this.hideLoadingState();
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Error initializing dashboard:', error);
            this.showErrorState(error);
        }
    }

    async initializeCore() {
        // Initialize Supabase client
        if (window.supabase && DASHBOARD_CONFIG.supabase.url) {
            this.supabaseClient = window.supabase.createClient(
                DASHBOARD_CONFIG.supabase.url,
                DASHBOARD_CONFIG.supabase.key
            );
            console.log('✅ Supabase client initialized');
        }

        // Initialize user session
        await this.initializeUserSession();
        
        // Initialize base UI components
        this.initializeBaseUI();
    }

    async initializeUserSession() {
        // Mock user session for demo
        this.currentUser = {
            id: 'user-001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'JD',
            healthScore: 92,
            memberSince: '2023-01-15',
            preferences: {
                notifications: true,
                darkMode: false,
                language: 'en',
                units: 'imperial'
            },
            healthProfile: {
                age: 35,
                gender: 'male',
                height: 175,
                weight: 75,
                conditions: ['hypertension'],
                allergies: ['penicillin'],
                medications: ['lisinopril', 'metformin']
            }
        };

        // Update UI with user data
        this.updateUserInterface();
    }

    updateUserInterface() {
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = `Welcome back, ${this.currentUser.name.split(' ')[0]}! 👋`;
        }

        // Update avatar
        const avatarContainer = document.querySelector('.avatar-container span');
        if (avatarContainer) {
            avatarContainer.textContent = this.currentUser.avatar;
        }

        // Update health score
        const healthScoreElement = document.getElementById('health-score');
        if (healthScoreElement) {
            healthScoreElement.textContent = this.currentUser.healthScore;
        }
    }

    initializeBaseUI() {
        // Initialize AOS animations
        if (window.AOS) {
            window.AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }

        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize modals
        this.initializeModals();
        
        // Initialize responsive handlers
        this.initializeResponsiveHandlers();
    }

    async initializeFeatures() {
        const features = DASHBOARD_CONFIG.features;

        // Initialize AI Health Coach
        if (features.aiHealthCoach && window.AIHealthCoach) {
            this.modules.aiHealthCoach = new window.AIHealthCoach();
            await this.modules.aiHealthCoach.initialize(this.currentUser.id);
            console.log('✅ AI Health Coach initialized');
        }

        // Initialize Medication Tracker
        if (features.medicationTracker && window.SmartMedicationTracker) {
            this.modules.medicationTracker = new window.SmartMedicationTracker();
            await this.modules.medicationTracker.initialize();
            console.log('✅ Medication Tracker initialized');
        }

        // Initialize Fitness Integration
        if (features.fitnessIntegration && window.FitnessIntegration) {
            this.modules.fitnessIntegration = new window.FitnessIntegration();
            await this.modules.fitnessIntegration.initialize();
            console.log('✅ Fitness Integration initialized');
        }

        // Initialize Smart Analytics
        if (features.smartAnalytics && window.SmartAnalytics) {
            this.modules.smartAnalytics = new window.SmartAnalytics();
            await this.modules.smartAnalytics.initialize();
            console.log('✅ Smart Analytics initialized');
        }

        // Initialize Voice Commands
        if (features.voiceCommands) {
            this.initializeVoiceCommands();
            console.log('✅ Voice Commands initialized');
        }

        // Load dashboard data
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            // Load all dashboard components in parallel
            await Promise.all([
                this.loadHealthMetrics(),
                this.loadUpcomingEvents(),
                this.loadRecentActivities(),
                this.loadHealthTips(),
                this.loadNotifications()
            ]);

            // Initialize charts
            this.initializeCharts();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadHealthMetrics() {
        const metrics = [
            {
                id: 'blood-pressure',
                icon: 'fas fa-heartbeat',
                value: '120/80',
                label: 'Blood Pressure',
                trend: 'stable',
                color: '#28a745',
                lastUpdated: '2 hours ago'
            },
            {
                id: 'heart-rate',
                icon: 'fas fa-heart',
                value: '72',
                label: 'Heart Rate',
                trend: 'up',
                color: '#dc3545',
                lastUpdated: '1 hour ago'
            },
            {
                id: 'weight',
                icon: 'fas fa-weight',
                value: '165 lbs',
                label: 'Weight',
                trend: 'down',
                color: '#007bff',
                lastUpdated: 'This morning'
            },
            {
                id: 'sleep',
                icon: 'fas fa-moon',
                value: '7.5h',
                label: 'Sleep',
                trend: 'up',
                color: '#6f42c1',
                lastUpdated: 'Last night'
            },
            {
                id: 'steps',
                icon: 'fas fa-walking',
                value: '8,432',
                label: 'Steps Today',
                trend: 'up',
                color: '#fd7e14',
                lastUpdated: 'Live'
            },
            {
                id: 'hydration',
                icon: 'fas fa-tint',
                value: '6/8',
                label: 'Water Intake',
                trend: 'stable',
                color: '#20c997',
                lastUpdated: '30 min ago'
            }
        ];

        const container = document.getElementById('health-metrics');
        if (container) {
            container.innerHTML = metrics.map(metric => `
                <div class="health-metric" onclick="viewMetricDetails('${metric.id}')">
                    <div class="metric-icon" style="background: ${metric.color};">
                        <i class="${metric.icon}"></i>
                    </div>
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-label">${metric.label}</div>
                    <div class="metric-trend trend-${metric.trend}">
                        <i class="fas fa-arrow-${metric.trend === 'up' ? 'up' : metric.trend === 'down' ? 'down' : 'right'}"></i>
                        ${metric.lastUpdated}
                    </div>
                </div>
            `).join('');
        }
    }

    async loadUpcomingEvents() {
        const events = [
            {
                id: 1,
                title: 'Cardiology Appointment',
                details: 'Dr. Michael Chen - Heart Center',
                date: '2024-01-18',
                time: '2:30 PM',
                type: 'appointment'
            },
            {
                id: 2,
                title: 'Medication Refill',
                details: 'Lisinopril prescription expires',
                date: '2024-01-20',
                time: 'All day',
                type: 'medication'
            },
            {
                id: 3,
                title: 'Lab Results',
                details: 'Blood work results available',
                date: '2024-01-22',
                time: '9:00 AM',
                type: 'lab'
            }
        ];

        const container = document.getElementById('upcoming-events');
        if (container) {
            container.innerHTML = events.map(event => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
                
                return `
                    <div class="event-item" onclick="viewEventDetails('${event.id}')">
                        <div class="event-date">
                            <div class="event-day">${day}</div>
                            <div class="event-month">${month}</div>
                        </div>
                        <div class="event-content">
                            <div class="event-title">${event.title}</div>
                            <div class="event-details">${event.details} • ${event.time}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    async loadRecentActivities() {
        const activities = [
            {
                id: 1,
                title: 'Blood pressure recorded',
                time: '2 hours ago',
                icon: 'fas fa-heartbeat',
                color: '#28a745'
            },
            {
                id: 2,
                title: 'Medication taken: Lisinopril',
                time: '4 hours ago',
                icon: 'fas fa-pills',
                color: '#007bff'
            },
            {
                id: 3,
                title: 'Exercise completed: 30 min walk',
                time: '6 hours ago',
                icon: 'fas fa-walking',
                color: '#fd7e14'
            }
        ];

        const container = document.getElementById('recent-activities');
        if (container) {
            container.innerHTML = activities.map(activity => `
                <div class="activity-item" onclick="viewActivityDetails('${activity.id}')">
                    <div class="activity-icon" style="background: ${activity.color};">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    async loadHealthTips() {
        const tips = [
            {
                title: 'Hydration Reminder',
                content: 'Drink a glass of water every hour to maintain optimal hydration levels.',
                icon: 'fas fa-tint'
            },
            {
                title: 'Posture Check',
                content: 'Take a 2-minute break every 30 minutes to stretch and improve posture.',
                icon: 'fas fa-user-check'
            },
            {
                title: 'Mindful Breathing',
                content: 'Practice deep breathing for 5 minutes to reduce stress and improve focus.',
                icon: 'fas fa-lungs'
            }
        ];

        const container = document.getElementById('health-tips');
        if (container) {
            container.innerHTML = tips.map(tip => `
                <div class="health-tip" style="padding: 1rem; background: rgba(0, 123, 255, 0.05); border-radius: 10px; margin-bottom: 1rem; border-left: 4px solid var(--primary-blue);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <i class="${tip.icon}" style="color: var(--primary-blue);"></i>
                        <strong>${tip.title}</strong>
                    </div>
                    <p style="color: var(--text-gray); font-size: 0.9rem; line-height: 1.5;">${tip.content}</p>
                </div>
            `).join('');
        }
    }

    async loadNotifications() {
        // Load notifications from various sources
        const notifications = [
            {
                id: 1,
                title: 'Appointment Reminder',
                message: 'Cardiology appointment tomorrow at 2:30 PM',
                time: '1 hour ago',
                type: 'appointment',
                read: false
            },
            {
                id: 2,
                title: 'Medication Alert',
                message: 'Time to take your evening medication',
                time: '2 hours ago',
                type: 'medication',
                read: false
            }
        ];

        // Update notification UI
        this.updateNotificationUI(notifications);
    }

    initializeCharts() {
        const ctx = document.getElementById('healthChart');
        if (ctx && window.Chart) {
            const chartData = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Blood Pressure (Systolic)',
                        data: [118, 122, 115, 125, 120, 119, 121],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Heart Rate',
                        data: [68, 72, 70, 75, 71, 69, 73],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            };

            this.healthChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
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
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.openQuickSearch();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.toggleNotifications();
                        break;
                }
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseRealTimeUpdates();
            } else {
                this.resumeRealTimeUpdates();
            }
        });
    }

    startRealTimeUpdates() {
        if (DASHBOARD_CONFIG.features.realTimeUpdates) {
            this.updateInterval = setInterval(() => {
                this.performRealTimeUpdate();
            }, 30000); // Update every 30 seconds
        }
    }

    performRealTimeUpdate() {
        // Update health metrics
        this.updateHealthMetrics();
        
        // Check for new notifications
        this.checkNewNotifications();
        
        // Update activity status
        this.updateActivityStatus();
    }

    initializeVoiceCommands() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'en-US';
            
            this.speechRecognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.handleVoiceCommand(command);
            };
            
            this.speechRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
            
            this.addVoiceButton();
        }
    }

    addVoiceButton() {
        const voiceBtn = document.createElement('div');
        voiceBtn.className = 'voice-command-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.title = 'Voice Commands (Click and speak)';
        voiceBtn.style.cssText = `
            position: fixed; bottom: 100px; right: 30px; width: 60px; height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; color: white;
            font-size: 1.5rem; cursor: pointer; z-index: 1000; transition: all 0.3s ease;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        `;
        
        voiceBtn.onclick = () => {
            this.speechRecognition.start();
            voiceBtn.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
            setTimeout(() => {
                voiceBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }, 3000);
        };
        
        document.body.appendChild(voiceBtn);
    }

    handleVoiceCommand(command) {
        console.log('Voice command:', command);
        
        if (command.includes('record vitals') || command.includes('add vitals')) {
            this.openVitalsRecorder();
        } else if (command.includes('book appointment') || command.includes('schedule appointment')) {
            window.location.href = 'user-appointments.html';
        } else if (command.includes('symptom checker') || command.includes('check symptoms')) {
            this.openSymptomChecker();
        } else if (command.includes('emergency') || command.includes('help')) {
            this.openEmergencyContacts();
        } else if (command.includes('notifications') || command.includes('messages')) {
            this.toggleNotifications();
        } else {
            this.showToast(`Command not recognized: "${command}"`, 'warning');
        }
    }

    // Utility methods
    showLoadingState() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoadingState() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showWelcomeMessage() {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        
        if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17) {
            greeting = 'Good evening';
        }
        
        this.showToast(`${greeting}, ${this.currentUser.name.split(' ')[0]}! Welcome to your enhanced dashboard.`, 'success');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast toast-${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    showErrorState(error) {
        console.error('Dashboard error:', error);
        this.showToast('Error loading dashboard. Please refresh the page.', 'error');
    }

    // Public API methods
    openVitalsRecorder() {
        if (window.recordVitals) {
            window.recordVitals();
        }
    }

    openSymptomChecker() {
        if (window.openSymptomChecker) {
            window.openSymptomChecker();
        }
    }

    openEmergencyContacts() {
        if (window.emergencyContact) {
            window.emergencyContact();
        }
    }

    toggleNotifications() {
        if (window.toggleNotifications) {
            window.toggleNotifications();
        }
    }

    // Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.eventListeners.forEach(listener => {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        
        if (this.speechRecognition) {
            this.speechRecognition.stop();
        }
        
        this.initialized = false;
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.dashboardController = new EnhancedDashboardController();
    await window.dashboardController.initialize();
});

// Export for global access
window.EnhancedDashboardController = EnhancedDashboardController;
window.DASHBOARD_CONFIG = DASHBOARD_CONFIG; 