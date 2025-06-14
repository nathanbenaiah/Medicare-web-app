// Advanced Health Features JavaScript
// AI Health Coach, Medication Tracker, Fitness Integration, Smart Analytics

// AI Health Coach System
class AIHealthCoach {
    constructor() {
        this.userProfile = null;
        this.healthHistory = [];
        this.recommendations = [];
        this.goals = [];
    }

    async initialize(userId) {
        try {
            await this.loadUserProfile(userId);
            await this.loadHealthHistory();
            await this.generatePersonalizedRecommendations();
            this.startContinuousMonitoring();
        } catch (error) {
            console.error('Error initializing AI Health Coach:', error);
        }
    }

    async loadUserProfile(userId) {
        // Mock user profile data
        this.userProfile = {
            id: userId,
            age: 35,
            gender: 'male',
            height: 175, // cm
            weight: 75, // kg
            activityLevel: 'moderate',
            medicalConditions: ['hypertension'],
            allergies: ['penicillin'],
            medications: ['lisinopril', 'metformin'],
            goals: ['weight_loss', 'blood_pressure_control'],
            preferences: {
                exerciseType: 'cardio',
                dietType: 'mediterranean',
                sleepTarget: 8
            }
        };
    }

    async loadHealthHistory() {
        // Mock health history data
        this.healthHistory = [
            {
                date: '2024-01-14',
                bloodPressure: { systolic: 125, diastolic: 82 },
                heartRate: 72,
                weight: 75.2,
                sleep: 7.5,
                steps: 8432,
                mood: 'good'
            },
            {
                date: '2024-01-13',
                bloodPressure: { systolic: 128, diastolic: 85 },
                heartRate: 75,
                weight: 75.5,
                sleep: 6.8,
                steps: 6234,
                mood: 'fair'
            }
        ];
    }

    async generatePersonalizedRecommendations() {
        const recommendations = [];

        // Analyze blood pressure trends
        const recentBP = this.healthHistory.slice(-7);
        const avgSystolic = recentBP.reduce((sum, day) => sum + day.bloodPressure.systolic, 0) / recentBP.length;
        
        if (avgSystolic > 120) {
            recommendations.push({
                type: 'blood_pressure',
                priority: 'high',
                title: 'Blood Pressure Management',
                description: 'Your blood pressure has been elevated. Consider reducing sodium intake and increasing physical activity.',
                actions: [
                    'Limit sodium to 2300mg per day',
                    'Add 30 minutes of walking daily',
                    'Practice stress reduction techniques',
                    'Monitor BP twice daily'
                ],
                expectedImprovement: '5-10 mmHg reduction in 2-4 weeks'
            });
        }

        // Analyze sleep patterns
        const avgSleep = recentBP.reduce((sum, day) => sum + day.sleep, 0) / recentBP.length;
        if (avgSleep < 7) {
            recommendations.push({
                type: 'sleep',
                priority: 'medium',
                title: 'Sleep Optimization',
                description: 'Your sleep duration is below optimal levels. Better sleep can improve overall health.',
                actions: [
                    'Establish consistent bedtime routine',
                    'Avoid screens 1 hour before bed',
                    'Keep bedroom cool and dark',
                    'Consider meditation before sleep'
                ],
                expectedImprovement: 'Improved energy and mood within 1 week'
            });
        }

        // Analyze activity levels
        const avgSteps = recentBP.reduce((sum, day) => sum + day.steps, 0) / recentBP.length;
        if (avgSteps < 8000) {
            recommendations.push({
                type: 'activity',
                priority: 'medium',
                title: 'Increase Physical Activity',
                description: 'Your daily step count is below recommended levels for optimal health.',
                actions: [
                    'Aim for 10,000 steps daily',
                    'Take stairs instead of elevators',
                    'Park farther from destinations',
                    'Schedule walking meetings'
                ],
                expectedImprovement: 'Better cardiovascular health and weight management'
            });
        }

        this.recommendations = recommendations;
        this.displayRecommendations();
    }

    displayRecommendations() {
        const container = document.getElementById('ai-coach-recommendations');
        if (!container) return;

        container.innerHTML = this.recommendations.map(rec => `
            <div class="ai-recommendation ${rec.priority}" data-type="${rec.type}">
                <div class="recommendation-header">
                    <h4>${rec.title}</h4>
                    <span class="priority-badge priority-${rec.priority}">${rec.priority}</span>
                </div>
                <p class="recommendation-description">${rec.description}</p>
                <div class="recommendation-actions">
                    <h5>Action Plan:</h5>
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
                <div class="expected-improvement">
                    <strong>Expected Result:</strong> ${rec.expectedImprovement}
                </div>
                <div class="recommendation-buttons">
                    <button onclick="acceptRecommendation('${rec.type}')" class="btn-accept">
                        Accept Plan
                    </button>
                    <button onclick="customizeRecommendation('${rec.type}')" class="btn-customize">
                        Customize
                    </button>
                </div>
            </div>
        `).join('');
    }

    startContinuousMonitoring() {
        // Monitor health metrics and provide real-time insights
        setInterval(() => {
            this.analyzeCurrentMetrics();
        }, 300000); // Check every 5 minutes
    }

    analyzeCurrentMetrics() {
        // Real-time analysis of current health metrics
        const currentTime = new Date().getHours();
        
        // Check for medication reminders
        if (currentTime === 8 || currentTime === 20) {
            this.sendMedicationReminder();
        }

        // Check for hydration reminders
        if (currentTime % 2 === 0) {
            this.checkHydrationStatus();
        }

        // Check for activity reminders
        this.checkActivityStatus();
    }

    sendMedicationReminder() {
        showHealthNotification({
            title: '💊 Medication Reminder',
            message: 'Time to take your Lisinopril',
            type: 'medication',
            actions: ['Take Now', 'Snooze 15min']
        });
    }

    checkHydrationStatus() {
        // Simulate hydration tracking
        const lastHydration = localStorage.getItem('lastHydration');
        const now = Date.now();
        
        if (!lastHydration || (now - parseInt(lastHydration)) > 7200000) { // 2 hours
            showHealthNotification({
                title: '💧 Hydration Reminder',
                message: 'Remember to drink water! Stay hydrated for optimal health.',
                type: 'hydration',
                actions: ['Mark as Drunk', 'Remind Later']
            });
        }
    }

    checkActivityStatus() {
        // Check if user has been inactive
        const lastActivity = localStorage.getItem('lastActivity');
        const now = Date.now();
        
        if (!lastActivity || (now - parseInt(lastActivity)) > 3600000) { // 1 hour
            showHealthNotification({
                title: '🚶‍♂️ Movement Reminder',
                message: 'You\'ve been sitting for a while. Time for a quick walk!',
                type: 'activity',
                actions: ['Start Walk', 'Remind Later']
            });
        }
    }
}

// Smart Medication Tracker
class SmartMedicationTracker {
    constructor() {
        this.medications = [];
        this.adherenceData = {};
        this.interactions = [];
    }

    async initialize() {
        await this.loadMedications();
        await this.checkInteractions();
        this.setupReminders();
        this.trackAdherence();
    }

    async loadMedications() {
        // Mock medication data
        this.medications = [
            {
                id: 1,
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'once daily',
                time: '08:00',
                instructions: 'Take with or without food',
                sideEffects: ['dizziness', 'dry cough'],
                startDate: '2023-06-01',
                endDate: null,
                prescriber: 'Dr. Johnson',
                refillsRemaining: 3,
                lastTaken: '2024-01-14T08:00:00'
            },
            {
                id: 2,
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'twice daily',
                time: ['08:00', '20:00'],
                instructions: 'Take with meals',
                sideEffects: ['nausea', 'diarrhea'],
                startDate: '2023-08-15',
                endDate: null,
                prescriber: 'Dr. Smith',
                refillsRemaining: 2,
                lastTaken: '2024-01-14T20:00:00'
            }
        ];

        this.displayMedications();
    }

    displayMedications() {
        const container = document.getElementById('medication-tracker');
        if (!container) return;

        container.innerHTML = `
            <div class="medication-header">
                <h3>💊 My Medications</h3>
                <button onclick="addNewMedication()" class="btn-add-med">Add Medication</button>
            </div>
            <div class="medication-list">
                ${this.medications.map(med => this.renderMedicationCard(med)).join('')}
            </div>
            <div class="adherence-summary">
                <h4>Adherence Summary</h4>
                <div class="adherence-stats">
                    <div class="stat">
                        <span class="stat-value">92%</span>
                        <span class="stat-label">This Week</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">88%</span>
                        <span class="stat-label">This Month</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">15</span>
                        <span class="stat-label">Day Streak</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderMedicationCard(medication) {
        const nextDose = this.calculateNextDose(medication);
        const adherenceRate = this.calculateAdherence(medication.id);
        
        return `
            <div class="medication-card" data-med-id="${medication.id}">
                <div class="med-header">
                    <h4>${medication.name}</h4>
                    <span class="dosage">${medication.dosage}</span>
                </div>
                <div class="med-details">
                    <p><strong>Frequency:</strong> ${medication.frequency}</p>
                    <p><strong>Next Dose:</strong> ${nextDose}</p>
                    <p><strong>Adherence:</strong> <span class="adherence-rate">${adherenceRate}%</span></p>
                    <p><strong>Refills:</strong> ${medication.refillsRemaining} remaining</p>
                </div>
                <div class="med-actions">
                    <button onclick="takeMedication(${medication.id})" class="btn-take">
                        ✓ Take Now
                    </button>
                    <button onclick="skipMedication(${medication.id})" class="btn-skip">
                        Skip
                    </button>
                    <button onclick="viewMedDetails(${medication.id})" class="btn-details">
                        Details
                    </button>
                </div>
                ${medication.refillsRemaining <= 1 ? '<div class="refill-warning">⚠️ Low on refills - contact prescriber</div>' : ''}
            </div>
        `;
    }

    calculateNextDose(medication) {
        // Calculate next dose time based on frequency and last taken
        const now = new Date();
        const lastTaken = new Date(medication.lastTaken);
        
        if (medication.frequency === 'once daily') {
            const nextDose = new Date(lastTaken);
            nextDose.setDate(nextDose.getDate() + 1);
            return nextDose.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (medication.frequency === 'twice daily') {
            // Logic for twice daily medications
            return 'In 2 hours';
        }
        
        return 'As needed';
    }

    calculateAdherence(medicationId) {
        // Calculate adherence percentage for the last 30 days
        return Math.floor(Math.random() * 20) + 80; // Mock data: 80-100%
    }

    async checkInteractions() {
        // Check for drug interactions
        const interactions = await this.analyzeInteractions();
        if (interactions.length > 0) {
            this.displayInteractionWarnings(interactions);
        }
    }

    async analyzeInteractions() {
        // Mock interaction analysis
        return [
            {
                medications: ['Lisinopril', 'Potassium Supplement'],
                severity: 'moderate',
                description: 'May increase potassium levels',
                recommendation: 'Monitor potassium levels regularly'
            }
        ];
    }

    setupReminders() {
        // Set up medication reminders
        this.medications.forEach(med => {
            if (Array.isArray(med.time)) {
                med.time.forEach(time => this.scheduleReminder(med, time));
            } else {
                this.scheduleReminder(med, med.time);
            }
        });
    }

    scheduleReminder(medication, time) {
        // Schedule reminder for specific time
        const [hours, minutes] = time.split(':');
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }
        
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.sendMedicationReminder(medication);
        }, timeUntilReminder);
    }

    sendMedicationReminder(medication) {
        showHealthNotification({
            title: `💊 ${medication.name} Reminder`,
            message: `Time to take your ${medication.dosage} dose`,
            type: 'medication',
            actions: ['Take Now', 'Snooze 15min', 'Skip']
        });
    }
}

// Fitness Integration System
class FitnessIntegration {
    constructor() {
        this.connectedDevices = [];
        this.workoutHistory = [];
        this.fitnessGoals = {};
    }

    async initialize() {
        await this.detectDevices();
        await this.loadWorkoutHistory();
        await this.loadFitnessGoals();
        this.startActivityTracking();
    }

    async detectDevices() {
        // Mock device detection
        this.connectedDevices = [
            {
                type: 'smartwatch',
                brand: 'Apple Watch',
                model: 'Series 8',
                connected: true,
                lastSync: new Date()
            },
            {
                type: 'fitness_tracker',
                brand: 'Fitbit',
                model: 'Charge 5',
                connected: false,
                lastSync: null
            }
        ];

        this.displayConnectedDevices();
    }

    displayConnectedDevices() {
        const container = document.getElementById('fitness-devices');
        if (!container) return;

        container.innerHTML = `
            <div class="devices-header">
                <h3>📱 Connected Devices</h3>
                <button onclick="addDevice()" class="btn-add-device">Add Device</button>
            </div>
            <div class="devices-list">
                ${this.connectedDevices.map(device => `
                    <div class="device-card ${device.connected ? 'connected' : 'disconnected'}">
                        <div class="device-info">
                            <h4>${device.brand} ${device.model}</h4>
                            <p>Status: ${device.connected ? '✅ Connected' : '❌ Disconnected'}</p>
                            ${device.lastSync ? `<p>Last sync: ${device.lastSync.toLocaleString()}</p>` : ''}
                        </div>
                        <div class="device-actions">
                            ${device.connected ? 
                                '<button onclick="syncDevice()" class="btn-sync">Sync Now</button>' :
                                '<button onclick="connectDevice()" class="btn-connect">Connect</button>'
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadWorkoutHistory() {
        // Mock workout history
        this.workoutHistory = [
            {
                date: '2024-01-14',
                type: 'cardio',
                activity: 'Running',
                duration: 30, // minutes
                calories: 285,
                heartRate: { avg: 145, max: 165 },
                distance: 3.2 // km
            },
            {
                date: '2024-01-13',
                type: 'strength',
                activity: 'Weight Training',
                duration: 45,
                calories: 220,
                heartRate: { avg: 120, max: 140 }
            }
        ];

        this.displayWorkoutHistory();
    }

    displayWorkoutHistory() {
        const container = document.getElementById('workout-history');
        if (!container) return;

        container.innerHTML = `
            <div class="workout-header">
                <h3>🏃‍♂️ Recent Workouts</h3>
                <button onclick="logWorkout()" class="btn-log-workout">Log Workout</button>
            </div>
            <div class="workout-list">
                ${this.workoutHistory.map(workout => `
                    <div class="workout-card">
                        <div class="workout-type">
                            <span class="activity-icon">${this.getActivityIcon(workout.type)}</span>
                            <div>
                                <h4>${workout.activity}</h4>
                                <p>${new Date(workout.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div class="workout-stats">
                            <div class="stat">
                                <span class="stat-value">${workout.duration}</span>
                                <span class="stat-label">min</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">${workout.calories}</span>
                                <span class="stat-label">cal</span>
                            </div>
                            ${workout.distance ? `
                                <div class="stat">
                                    <span class="stat-value">${workout.distance}</span>
                                    <span class="stat-label">km</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            cardio: '🏃‍♂️',
            strength: '💪',
            yoga: '🧘‍♀️',
            swimming: '🏊‍♂️',
            cycling: '🚴‍♂️'
        };
        return icons[type] || '🏃‍♂️';
    }

    startActivityTracking() {
        // Start real-time activity tracking
        setInterval(() => {
            this.updateActivityMetrics();
        }, 60000); // Update every minute
    }

    updateActivityMetrics() {
        // Simulate real-time activity updates
        const stepsElement = document.querySelector('[data-metric="steps"] .metric-value');
        if (stepsElement) {
            const currentSteps = parseInt(stepsElement.textContent.replace(',', ''));
            const newSteps = currentSteps + Math.floor(Math.random() * 50);
            stepsElement.textContent = newSteps.toLocaleString();
        }
    }
}

// Smart Analytics Engine
class SmartAnalytics {
    constructor() {
        this.healthTrends = {};
        this.predictions = {};
        this.insights = [];
    }

    async initialize() {
        await this.analyzeHealthTrends();
        await this.generatePredictions();
        await this.createInsights();
        this.displayAnalytics();
    }

    async analyzeHealthTrends() {
        // Analyze health trends over time
        this.healthTrends = {
            bloodPressure: {
                trend: 'improving',
                change: -5, // mmHg reduction
                timeframe: '30 days'
            },
            weight: {
                trend: 'stable',
                change: -0.5, // kg
                timeframe: '30 days'
            },
            sleep: {
                trend: 'improving',
                change: 0.8, // hours increase
                timeframe: '30 days'
            },
            activity: {
                trend: 'improving',
                change: 1200, // steps increase
                timeframe: '30 days'
            }
        };
    }

    async generatePredictions() {
        // Generate health predictions based on current trends
        this.predictions = {
            bloodPressure: {
                prediction: 'If current trends continue, your blood pressure may reach optimal levels (<120/80) within 6-8 weeks',
                confidence: 78
            },
            weight: {
                prediction: 'Based on current activity and diet patterns, you may lose 2-3 kg in the next 3 months',
                confidence: 65
            },
            fitness: {
                prediction: 'Your cardiovascular fitness is improving. You may be able to run 5km without stopping within 8 weeks',
                confidence: 82
            }
        };
    }

    async createInsights() {
        // Create actionable insights
        this.insights = [
            {
                type: 'correlation',
                title: 'Sleep & Blood Pressure Connection',
                description: 'Your blood pressure is 8% lower on days when you sleep 7+ hours',
                actionable: true,
                recommendation: 'Prioritize 7-8 hours of sleep nightly for better BP control'
            },
            {
                type: 'pattern',
                title: 'Weekend Activity Drop',
                description: 'Your activity levels drop by 35% on weekends',
                actionable: true,
                recommendation: 'Schedule fun weekend activities like hiking or sports'
            },
            {
                type: 'achievement',
                title: 'Medication Adherence Improvement',
                description: 'Your medication adherence has improved by 15% this month',
                actionable: false,
                recommendation: 'Keep up the great work with your medication routine!'
            }
        ];
    }

    displayAnalytics() {
        const container = document.getElementById('smart-analytics');
        if (!container) return;

        container.innerHTML = `
            <div class="analytics-header">
                <h3>📊 Smart Health Analytics</h3>
                <select onchange="updateAnalyticsPeriod(this.value)">
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                    <option value="365">Last Year</option>
                </select>
            </div>
            
            <div class="trends-section">
                <h4>Health Trends</h4>
                <div class="trends-grid">
                    ${Object.entries(this.healthTrends).map(([metric, data]) => `
                        <div class="trend-card">
                            <h5>${this.formatMetricName(metric)}</h5>
                            <div class="trend-indicator ${data.trend}">
                                ${this.getTrendIcon(data.trend)} ${data.trend}
                            </div>
                            <p class="trend-change">
                                ${data.change > 0 ? '+' : ''}${data.change} 
                                ${this.getMetricUnit(metric)} in ${data.timeframe}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="predictions-section">
                <h4>AI Predictions</h4>
                <div class="predictions-list">
                    ${Object.entries(this.predictions).map(([metric, pred]) => `
                        <div class="prediction-card">
                            <div class="prediction-content">
                                <p>${pred.prediction}</p>
                                <div class="confidence-meter">
                                    <span>Confidence: ${pred.confidence}%</span>
                                    <div class="confidence-bar">
                                        <div class="confidence-fill" style="width: ${pred.confidence}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="insights-section">
                <h4>Smart Insights</h4>
                <div class="insights-list">
                    ${this.insights.map(insight => `
                        <div class="insight-card ${insight.type}">
                            <h5>${insight.title}</h5>
                            <p>${insight.description}</p>
                            ${insight.actionable ? `
                                <div class="insight-action">
                                    <strong>💡 Recommendation:</strong> ${insight.recommendation}
                                </div>
                            ` : `
                                <div class="insight-celebration">
                                    🎉 ${insight.recommendation}
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatMetricName(metric) {
        const names = {
            bloodPressure: 'Blood Pressure',
            weight: 'Weight',
            sleep: 'Sleep Quality',
            activity: 'Daily Activity'
        };
        return names[metric] || metric;
    }

    getTrendIcon(trend) {
        const icons = {
            improving: '📈',
            declining: '📉',
            stable: '➡️'
        };
        return icons[trend] || '➡️';
    }

    getMetricUnit(metric) {
        const units = {
            bloodPressure: 'mmHg',
            weight: 'kg',
            sleep: 'hours',
            activity: 'steps'
        };
        return units[metric] || '';
    }
}

// Health Notification System
function showHealthNotification(notification) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'health-notification';
    notificationDiv.style.cssText = `
        position: fixed; top: 120px; right: 20px; width: 350px;
        background: white; border-radius: 15px; padding: 1.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border-left: 4px solid var(--primary-blue);
        z-index: 10000; animation: slideInRight 0.3s ease;
    `;

    notificationDiv.innerHTML = `
        <div class="notification-header">
            <h4>${notification.title}</h4>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">×</button>
        </div>
        <p>${notification.message}</p>
        ${notification.actions ? `
            <div class="notification-actions">
                ${notification.actions.map(action => `
                    <button onclick="handleNotificationAction('${action}', this)" class="notification-action-btn">
                        ${action}
                    </button>
                `).join('')}
            </div>
        ` : ''}
    `;

    document.body.appendChild(notificationDiv);

    // Auto-remove after 10 seconds if no action taken
    setTimeout(() => {
        if (notificationDiv.parentElement) {
            notificationDiv.remove();
        }
    }, 10000);
}

function handleNotificationAction(action, button) {
    const notification = button.closest('.health-notification');
    
    switch (action) {
        case 'Take Now':
            showToast('Medication marked as taken', 'success');
            localStorage.setItem('lastMedication', Date.now().toString());
            break;
        case 'Snooze 15min':
            showToast('Reminder snoozed for 15 minutes', 'info');
            setTimeout(() => {
                showHealthNotification({
                    title: '💊 Medication Reminder',
                    message: 'Snoozed reminder: Time to take your medication',
                    type: 'medication',
                    actions: ['Take Now', 'Skip']
                });
            }, 900000); // 15 minutes
            break;
        case 'Mark as Drunk':
            showToast('Hydration logged', 'success');
            localStorage.setItem('lastHydration', Date.now().toString());
            break;
        case 'Start Walk':
            showToast('Starting activity tracking', 'success');
            localStorage.setItem('lastActivity', Date.now().toString());
            break;
        case 'Remind Later':
            showToast('Will remind you later', 'info');
            break;
    }
    
    notification.remove();
}

// Initialize all advanced features
async function initializeAdvancedFeatures() {
    try {
        // Initialize AI Health Coach
        const healthCoach = new AIHealthCoach();
        await healthCoach.initialize('user-001');

        // Initialize Medication Tracker
        const medicationTracker = new SmartMedicationTracker();
        await medicationTracker.initialize();

        // Initialize Fitness Integration
        const fitnessIntegration = new FitnessIntegration();
        await fitnessIntegration.initialize();

        // Initialize Smart Analytics
        const smartAnalytics = new SmartAnalytics();
        await smartAnalytics.initialize();

        console.log('All advanced health features initialized successfully');
    } catch (error) {
        console.error('Error initializing advanced features:', error);
    }
}

// Global function exports
window.initializeAdvancedFeatures = initializeAdvancedFeatures;
window.acceptRecommendation = function(type) {
    showToast(`Accepted recommendation for ${type}`, 'success');
};
window.customizeRecommendation = function(type) {
    showToast(`Customizing recommendation for ${type}`, 'info');
};
window.takeMedication = function(id) {
    showToast('Medication marked as taken', 'success');
};
window.skipMedication = function(id) {
    showToast('Medication skipped', 'warning');
};
window.viewMedDetails = function(id) {
    showToast('Opening medication details', 'info');
};
window.addNewMedication = function() {
    showToast('Opening add medication form', 'info');
};
window.logWorkout = function() {
    showToast('Opening workout logger', 'info');
};
window.syncDevice = function() {
    showToast('Syncing device data...', 'info');
};
window.connectDevice = function() {
    showToast('Connecting device...', 'info');
};
window.updateAnalyticsPeriod = function(period) {
    showToast(`Updating analytics for ${period} days`, 'info');
}; 