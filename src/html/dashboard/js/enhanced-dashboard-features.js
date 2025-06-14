// Enhanced Dashboard Features JavaScript
// Advanced functionality for the premium user dashboard

// Supabase Configuration
const SUPABASE_URL = 'https://gcggnrwqilylyykppizb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzE4NzEsImV4cCI6MjA1MDEwNzg3MX0.4_8nOLLaLdtaUNJhJNhWJhJhJNhWJhJhJNhWJhJhJNhW';

// DeepSeek AI Configuration
const DEEPSEEK_API_KEY = 'sk-your-deepseek-api-key';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let healthChart = null;
let notificationPanel = false;
let healthData = {};
let aiInsights = [];

// Enhanced Dashboard Initialization
async function initializePremiumDashboard() {
    try {
        showLoading(true);
        
        // Initialize user session
        await initializeUser();
        
        // Load all dashboard components
        await Promise.all([
            loadHealthMetrics(),
            loadAIInsights(),
            loadUpcomingEvents(),
            loadRecentActivities(),
            loadHealthTips(),
            loadNotifications()
        ]);
        
        // Initialize charts
        initializeHealthChart();
        
        // Set up real-time subscriptions
        setupRealtimeSubscriptions();
        
        // Start health monitoring
        startHealthMonitoring();
        
        // Initialize voice commands
        initializeVoiceCommands();
        
        showLoading(false);
        showWelcomeMessage();
        
    } catch (error) {
        console.error('Error initializing premium dashboard:', error);
        showToast('Error loading dashboard', 'error');
        showLoading(false);
    }
}

// Initialize user session
async function initializeUser() {
    // For demo purposes, using mock user data
    currentUser = {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD',
        healthScore: 92,
        memberSince: '2023-01-15',
        preferences: {
            notifications: true,
            darkMode: false,
            language: 'en'
        }
    };
    
    // Update user-specific elements
    updateUserInterface();
}

// Update user interface with personalized data
function updateUserInterface() {
    // Update hero section with user data
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}! 👋`;
    }
    
    // Update avatar
    const avatarContainer = document.querySelector('.avatar-container span');
    if (avatarContainer) {
        avatarContainer.textContent = currentUser.avatar;
    }
    
    // Update health score
    const healthScoreElement = document.getElementById('health-score');
    if (healthScoreElement) {
        healthScoreElement.textContent = currentUser.healthScore;
    }
}

// Load health metrics with enhanced data
async function loadHealthMetrics() {
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
    if (!container) return;
    
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
    
    // Store metrics data for later use
    healthData.metrics = metrics;
}

// Load AI-powered health insights
async function loadAIInsights() {
    const insights = [
        {
            id: 1,
            title: 'Sleep Pattern Analysis',
            content: 'Your sleep quality has improved by 15% this week. Consider maintaining your current bedtime routine for optimal rest.',
            type: 'positive',
            action: 'View Sleep Report',
            priority: 'medium'
        },
        {
            id: 2,
            title: 'Medication Reminder',
            content: 'You\'ve missed 2 doses of Lisinopril this week. Set up automatic reminders to improve adherence.',
            type: 'warning',
            action: 'Set Reminders',
            priority: 'high'
        },
        {
            id: 3,
            title: 'Exercise Recommendation',
            content: 'Based on your heart rate data, consider adding 15 minutes of cardio to your routine for better cardiovascular health.',
            type: 'suggestion',
            action: 'Create Plan',
            priority: 'low'
        },
        {
            id: 4,
            title: 'Nutrition Insight',
            content: 'Your sodium intake is 20% above recommended levels. Try reducing processed foods and adding more fresh vegetables.',
            type: 'warning',
            action: 'View Nutrition Plan',
            priority: 'medium'
        }
    ];
    
    const container = document.getElementById('ai-insights');
    if (!container) return;
    
    container.innerHTML = insights.map(insight => `
        <div class="ai-insight ${insight.type}">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-content">${insight.content}</div>
            <button class="insight-action" onclick="handleInsightAction('${insight.id}', '${insight.action}')">
                ${insight.action}
            </button>
        </div>
    `).join('');
    
    aiInsights = insights;
}

// Load upcoming events and appointments
async function loadUpcomingEvents() {
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
        },
        {
            id: 4,
            title: 'Physical Therapy',
            details: 'Knee rehabilitation session',
            date: '2024-01-25',
            time: '11:00 AM',
            type: 'therapy'
        }
    ];
    
    const container = document.getElementById('upcoming-events');
    if (!container) return;
    
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

// Load recent health activities
async function loadRecentActivities() {
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
        },
        {
            id: 4,
            title: 'Sleep data synced',
            time: '8 hours ago',
            icon: 'fas fa-moon',
            color: '#6f42c1'
        },
        {
            id: 5,
            title: 'Weight recorded: 165 lbs',
            time: 'Yesterday',
            icon: 'fas fa-weight',
            color: '#dc3545'
        }
    ];
    
    const container = document.getElementById('recent-activities');
    if (!container) return;
    
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

// Load personalized health tips
async function loadHealthTips() {
    const tips = [
        {
            id: 1,
            title: 'Hydration Reminder',
            content: 'Drink a glass of water every hour to maintain optimal hydration levels.',
            icon: 'fas fa-tint',
            category: 'hydration'
        },
        {
            id: 2,
            title: 'Posture Check',
            content: 'Take a 2-minute break every 30 minutes to stretch and improve posture.',
            icon: 'fas fa-user-check',
            category: 'ergonomics'
        },
        {
            id: 3,
            title: 'Mindful Breathing',
            content: 'Practice deep breathing for 5 minutes to reduce stress and improve focus.',
            icon: 'fas fa-lungs',
            category: 'mental-health'
        }
    ];
    
    const container = document.getElementById('health-tips');
    if (!container) return;
    
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

// Load notifications
async function loadNotifications() {
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
        },
        {
            id: 3,
            title: 'Lab Results Ready',
            message: 'Your blood work results are now available',
            time: '4 hours ago',
            type: 'lab',
            read: true
        },
        {
            id: 4,
            title: 'Health Goal Achieved',
            message: 'Congratulations! You reached your daily step goal',
            time: '6 hours ago',
            type: 'achievement',
            read: true
        }
    ];
    
    const container = document.getElementById('notification-list');
    if (!container) return;
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" onclick="markAsRead('${notification.id}')">
            <div style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem;">
                ${notification.title}
            </div>
            <div style="color: var(--text-gray); font-size: 0.9rem; margin-bottom: 0.25rem;">
                ${notification.message}
            </div>
            <div style="color: var(--text-gray); font-size: 0.8rem;">
                ${notification.time}
            </div>
        </div>
    `).join('');
}

// Initialize health chart with advanced visualization
function initializeHealthChart() {
    const ctx = document.getElementById('healthChart');
    if (!ctx) return;
    
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
            },
            {
                label: 'Sleep Hours',
                data: [7.5, 8, 7, 8.5, 7.5, 8, 7.5],
                borderColor: '#6f42c1',
                backgroundColor: 'rgba(111, 66, 193, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    healthChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Advanced Quick Actions
function openSymptomChecker() {
    showToast('Opening AI Symptom Checker...', 'info');
    // Advanced symptom checker with AI integration
    setTimeout(() => {
        const symptoms = prompt('Describe your symptoms:');
        if (symptoms) {
            analyzeSymptoms(symptoms);
        }
    }, 500);
}

async function analyzeSymptoms(symptoms) {
    try {
        showLoading(true);
        
        // Simulate AI analysis (in production, this would call DeepSeek API)
        const analysis = await simulateAIAnalysis(symptoms);
        
        showLoading(false);
        displaySymptomAnalysis(analysis);
        
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        showToast('Error analyzing symptoms', 'error');
        showLoading(false);
    }
}

function simulateAIAnalysis(symptoms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                severity: 'moderate',
                possibleCauses: [
                    'Common cold',
                    'Seasonal allergies',
                    'Viral infection'
                ],
                recommendations: [
                    'Rest and stay hydrated',
                    'Monitor symptoms for 24-48 hours',
                    'Consider over-the-counter medication',
                    'Consult healthcare provider if symptoms worsen'
                ],
                urgency: 'low',
                confidence: 85
            });
        }, 2000);
    });
}

function displaySymptomAnalysis(analysis) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 2rem; max-width: 500px; width: 90%;">
            <h3 style="margin-bottom: 1rem; color: var(--text-dark);">🤖 AI Symptom Analysis</h3>
            <div style="margin-bottom: 1rem;">
                <strong>Severity:</strong> <span style="color: ${analysis.severity === 'high' ? 'red' : analysis.severity === 'moderate' ? 'orange' : 'green'}">${analysis.severity}</span>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Possible Causes:</strong>
                <ul style="margin-left: 1rem;">
                    ${analysis.possibleCauses.map(cause => `<li>${cause}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Recommendations:</strong>
                <ul style="margin-left: 1rem;">
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Confidence:</strong> ${analysis.confidence}%
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: var(--primary-blue); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function recordVitals() {
    showToast('Opening vitals recorder...', 'info');
    // Advanced vitals recording with device integration
    openVitalsModal();
}

function openVitalsModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 2rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <h3 style="margin-bottom: 1.5rem; color: var(--text-dark);">📊 Record Vitals</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div style="padding: 1rem; border: 2px solid #e9ecef; border-radius: 10px;">
                    <h4>Blood Pressure</h4>
                    <input type="number" placeholder="Systolic" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
                    <input type="number" placeholder="Diastolic" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div style="padding: 1rem; border: 2px solid #e9ecef; border-radius: 10px;">
                    <h4>Heart Rate</h4>
                    <input type="number" placeholder="BPM" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div style="padding: 1rem; border: 2px solid #e9ecef; border-radius: 10px;">
                    <h4>Weight</h4>
                    <input type="number" placeholder="lbs" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div style="padding: 1rem; border: 2px solid #e9ecef; border-radius: 10px;">
                    <h4>Temperature</h4>
                    <input type="number" placeholder="°F" step="0.1" style="width: 100%; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="saveVitals()" style="background: var(--success-green); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
                    Save Vitals
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: var(--text-gray); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveVitals() {
    showToast('Vitals saved successfully!', 'success');
    // In production, this would save to Supabase
    document.querySelector('.modal')?.remove();
    loadHealthMetrics(); // Refresh metrics
}

function bookAppointment() {
    showToast('Opening appointment booking...', 'info');
    window.location.href = 'user-appointments.html';
}

function viewReports() {
    showToast('Loading health reports...', 'info');
    // Advanced health reports with AI insights
}

function emergencyContact() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(220, 53, 69, 0.9); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 2rem; max-width: 400px; width: 90%; text-align: center;">
            <h3 style="color: #dc3545; margin-bottom: 1rem;">🚨 Emergency Contacts</h3>
            
            <div style="margin-bottom: 1rem;">
                <button onclick="window.open('tel:911')" style="background: #dc3545; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; width: 100%; margin-bottom: 0.5rem; font-size: 1.1rem;">
                    📞 Call 911
                </button>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <button onclick="window.open('tel:+15551234567')" style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; width: 100%; margin-bottom: 0.5rem;">
                    🏥 Primary Care: Dr. Johnson
                </button>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <button onclick="window.open('tel:+15559876543')" style="background: #28a745; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; width: 100%; margin-bottom: 0.5rem;">
                    👨‍⚕️ Cardiologist: Dr. Chen
                </button>
            </div>
            
            <button onclick="this.parentElement.parentElement.remove()" style="background: var(--text-gray); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function healthGoals() {
    showToast('Opening health goals tracker...', 'info');
    // Advanced goal tracking with AI recommendations
}

// Voice Commands Integration
function initializeVoiceCommands() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };
        
        // Add voice activation button
        addVoiceButton(recognition);
    }
}

function addVoiceButton(recognition) {
    const voiceBtn = document.createElement('div');
    voiceBtn.style.cssText = `
        position: fixed; bottom: 100px; right: 30px; width: 60px; height: 60px;
        background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%;
        display: flex; align-items: center; justify-content: center; color: white;
        font-size: 1.5rem; cursor: pointer; z-index: 1000; transition: all 0.3s ease;
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
    `;
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceBtn.title = 'Voice Commands';
    
    voiceBtn.onclick = () => {
        recognition.start();
        voiceBtn.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
        setTimeout(() => {
            voiceBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }, 3000);
    };
    
    document.body.appendChild(voiceBtn);
}

function handleVoiceCommand(command) {
    console.log('Voice command:', command);
    
    if (command.includes('record vitals') || command.includes('add vitals')) {
        recordVitals();
    } else if (command.includes('book appointment') || command.includes('schedule appointment')) {
        bookAppointment();
    } else if (command.includes('symptom checker') || command.includes('check symptoms')) {
        openSymptomChecker();
    } else if (command.includes('emergency') || command.includes('help')) {
        emergencyContact();
    } else if (command.includes('notifications') || command.includes('messages')) {
        toggleNotifications();
    } else {
        showToast(`Command not recognized: "${command}"`, 'warning');
    }
}

// Health Monitoring System
function startHealthMonitoring() {
    // Simulate real-time health monitoring
    setInterval(() => {
        updateHealthMetrics();
        checkHealthAlerts();
    }, 30000); // Check every 30 seconds
}

function updateHealthMetrics() {
    // Simulate real-time updates from wearable devices
    const metrics = document.querySelectorAll('.health-metric');
    metrics.forEach(metric => {
        // Add subtle animation to show live updates
        metric.style.transform = 'scale(1.02)';
        setTimeout(() => {
            metric.style.transform = 'scale(1)';
        }, 200);
    });
}

function checkHealthAlerts() {
    // Simulate health alerts based on thresholds
    const alerts = [
        {
            condition: 'heart_rate_high',
            message: 'Heart rate elevated (85 BPM). Consider taking a break.',
            severity: 'warning'
        }
    ];
    
    // Randomly trigger alerts for demo
    if (Math.random() < 0.1) { // 10% chance
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        showHealthAlert(alert);
    }
}

function showHealthAlert(alert) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed; top: 120px; right: 20px; width: 300px;
        background: ${alert.severity === 'warning' ? '#fff3cd' : '#d4edda'};
        border: 1px solid ${alert.severity === 'warning' ? '#ffeaa7' : '#c3e6cb'};
        border-radius: 10px; padding: 1rem; z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <i class="fas fa-exclamation-triangle" style="color: ${alert.severity === 'warning' ? '#856404' : '#155724'};"></i>
            <strong>Health Alert</strong>
        </div>
        <p style="margin: 0; color: ${alert.severity === 'warning' ? '#856404' : '#155724'};">${alert.message}</p>
        <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}

// Notification System
function toggleNotifications() {
    const panel = document.getElementById('notification-panel');
    notificationPanel = !notificationPanel;
    
    if (notificationPanel) {
        panel.classList.add('show');
    } else {
        panel.classList.remove('show');
    }
}

function markAsRead(notificationId) {
    showToast('Notification marked as read', 'success');
    // In production, this would update the database
}

// Real-time Subscriptions
function setupRealtimeSubscriptions() {
    // In production, this would set up Supabase real-time subscriptions
    console.log('Setting up real-time subscriptions...');
    
    // Simulate real-time updates
    setInterval(() => {
        // Update notification badges
        updateNotificationBadges();
    }, 60000); // Update every minute
}

function updateNotificationBadges() {
    // Simulate new notifications
    const badges = document.querySelectorAll('.notification-badge');
    badges.forEach(badge => {
        const currentCount = parseInt(badge.textContent);
        if (Math.random() < 0.3) { // 30% chance of new notification
            badge.textContent = currentCount + 1;
        }
    });
}

// Utility Functions
function showWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    
    if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
    } else if (hour >= 17) {
        greeting = 'Good evening';
    }
    
    showToast(`${greeting}, ${currentUser.name.split(' ')[0]}! Welcome to your health dashboard.`, 'success');
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'info') {
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

// Event Handlers
function viewMetricDetails(metricId) {
    showToast(`Viewing details for ${metricId}`, 'info');
    // Open detailed metric view
}

function handleInsightAction(insightId, action) {
    showToast(`Executing action: ${action}`, 'info');
    // Handle specific insight actions
}

function viewEventDetails(eventId) {
    showToast(`Viewing event details`, 'info');
    // Open event details modal
}

function viewActivityDetails(activityId) {
    showToast(`Viewing activity details`, 'info');
    // Open activity details modal
}

function updateChart() {
    const period = document.getElementById('chart-period').value;
    showToast(`Updating chart for ${period}`, 'info');
    // Update chart data based on selected period
}

function openQuickActions() {
    showToast('Quick actions menu', 'info');
    // Open floating quick actions menu
}

// Export functions for global access
window.initializePremiumDashboard = initializePremiumDashboard;
window.openSymptomChecker = openSymptomChecker;
window.recordVitals = recordVitals;
window.bookAppointment = bookAppointment;
window.viewReports = viewReports;
window.emergencyContact = emergencyContact;
window.healthGoals = healthGoals;
window.toggleNotifications = toggleNotifications;
window.markAsRead = markAsRead;
window.viewMetricDetails = viewMetricDetails;
window.handleInsightAction = handleInsightAction;
window.viewEventDetails = viewEventDetails;
window.viewActivityDetails = viewActivityDetails;
window.updateChart = updateChart;
window.openQuickActions = openQuickActions;
window.saveVitals = saveVitals; 