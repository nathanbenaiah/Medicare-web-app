// =====================================================
// 🏥 PREMIUM DASHBOARD FUNCTIONS
// =====================================================
// Comprehensive dashboard functionality with Supabase & DeepSeek AI

// Supabase Configuration
const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzI4NzEsImV4cCI6MjA0OTU0ODg3MX0.VoPOoOhJbXKJNmu_3HE_bqKdKNqQNhKJOEJzKEHNEJE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// DeepSeek AI Configuration
const DEEPSEEK_API_KEY = 'sk-b8f8c8e8f8e8f8e8f8e8f8e8f8e8f8e8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Global Variables
let currentUser = null;
let healthChart = null;
let dashboardData = {
    appointments: [],
    medications: [],
    vitalSigns: [],
    aiInsights: [],
    notifications: []
};

// =====================================================
// 🚀 DASHBOARD INITIALIZATION
// =====================================================

async function initializeDashboard() {
    try {
        showLoading(true);
        
        // Initialize user session
        await initializeUser();
        
        // Load dashboard data
        await loadDashboardData();
        
        // Initialize components
        initializeComponents();
        
        // Setup real-time subscriptions
        setupRealTimeSubscriptions();
        
        showLoading(false);
        showToast('Dashboard loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        showToast('Failed to load dashboard. Please refresh the page.', 'error');
        showLoading(false);
    }
}

async function initializeUser() {
    try {
        // Get current user session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
            currentUser = session.user;
            
            // Load user profile
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();
                
            if (profile) {
                document.getElementById('user-name').textContent = profile.full_name || 'User';
            }
        } else {
            // Create demo user for testing
            currentUser = { id: 'demo-user', email: 'demo@medicare.com' };
            document.getElementById('user-name').textContent = 'Demo User';
        }
        
    } catch (error) {
        console.error('User initialization failed:', error);
        // Continue with demo mode
        currentUser = { id: 'demo-user', email: 'demo@medicare.com' };
    }
}

// =====================================================
// 📊 DATA LOADING FUNCTIONS
// =====================================================

async function loadDashboardData() {
    try {
        // Load all dashboard data in parallel
        const [appointments, medications, vitalSigns, aiInsights] = await Promise.all([
            loadAppointments(),
            loadMedications(),
            loadVitalSigns(),
            loadAIInsights()
        ]);
        
        dashboardData = {
            appointments,
            medications,
            vitalSigns,
            aiInsights
        };
        
        // Update dashboard UI
        updateDashboardStats();
        renderAppointments();
        renderMedications();
        renderHealthChart();
        renderHealthInsights();
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showToast('Some data could not be loaded', 'warning');
    }
}

async function loadAppointments() {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                provider:provider_id(full_name)
            `)
            .eq('user_id', currentUser.id)
            .order('scheduled_date', { ascending: true })
            .limit(10);
            
        if (error) throw error;
        return data || [];
        
    } catch (error) {
        console.error('Failed to load appointments:', error);
        return getDemoAppointments();
    }
}

async function loadMedications() {
    try {
        const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
        
    } catch (error) {
        console.error('Failed to load medications:', error);
        return getDemoMedications();
    }
}

async function loadVitalSigns() {
    try {
        const { data, error } = await supabase
            .from('vital_signs')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('recorded_at', { ascending: false })
            .limit(30);
            
        if (error) throw error;
        return data || [];
        
    } catch (error) {
        console.error('Failed to load vital signs:', error);
        return getDemoVitalSigns();
    }
}

async function loadAIInsights() {
    try {
        const { data, error } = await supabase
            .from('ai_insights')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (error) throw error;
        return data || [];
        
    } catch (error) {
        console.error('Failed to load AI insights:', error);
        return getDemoAIInsights();
    }
}

// =====================================================
// 🎨 UI RENDERING FUNCTIONS
// =====================================================

function updateDashboardStats() {
    document.getElementById('appointments-count').textContent = dashboardData.appointments.length;
    document.getElementById('medications-count').textContent = dashboardData.medications.length;
    document.getElementById('ai-insights-count').textContent = dashboardData.aiInsights.length;
    
    // Calculate health score based on data
    const healthScore = calculateHealthScore();
    document.getElementById('health-score').textContent = `${healthScore}%`;
}

function renderAppointments() {
    const container = document.getElementById('appointments-list');
    
    if (dashboardData.appointments.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6c757d;">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No upcoming appointments</p>
                <button onclick="scheduleAppointment()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007BFF; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Schedule Appointment
                </button>
            </div>
        `;
        return;
    }
    
    const appointmentsHTML = dashboardData.appointments.map(appointment => `
        <div class="appointment-item" style="display: flex; align-items: center; padding: 1rem; border-radius: 15px; background: #f8f9fa; margin-bottom: 1rem; border-left: 4px solid #007BFF;">
            <div class="appointment-date" style="text-align: center; margin-right: 1rem; min-width: 80px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #007BFF;">
                    ${new Date(appointment.scheduled_date).getDate()}
                </div>
                <div style="font-size: 0.8rem; color: #6c757d; text-transform: uppercase;">
                    ${new Date(appointment.scheduled_date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
            </div>
            <div class="appointment-details" style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: #212529;">${appointment.type || 'General Consultation'}</h4>
                <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">
                    <i class="fas fa-user-md"></i> ${appointment.provider?.full_name || 'Dr. Smith'}
                </p>
                <p style="margin: 0.25rem 0 0 0; color: #6c757d; font-size: 0.9rem;">
                    <i class="fas fa-clock"></i> ${new Date(appointment.scheduled_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            <div class="appointment-status">
                <span class="status-badge" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background: #e3f2fd; color: #1976d2;">
                    ${appointment.status || 'Scheduled'}
                </span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = appointmentsHTML;
}

function renderMedications() {
    const container = document.getElementById('medications-list');
    
    if (dashboardData.medications.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6c757d;">
                <i class="fas fa-pills" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No active medications</p>
            </div>
        `;
        return;
    }
    
    const medicationsHTML = dashboardData.medications.map(medication => `
        <div class="medication-item" style="display: flex; align-items: center; padding: 1rem; border-radius: 15px; background: #f8f9fa; margin-bottom: 1rem; border-left: 4px solid #28a745;">
            <div class="medication-icon" style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #28a745, #20c997); display: flex; align-items: center; justify-content: center; margin-right: 1rem;">
                <i class="fas fa-pills" style="color: white; font-size: 1.2rem;"></i>
            </div>
            <div class="medication-details" style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: #212529;">${medication.name}</h4>
                <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">
                    ${medication.dosage} - ${medication.frequency}
                </p>
                <p style="margin: 0.25rem 0 0 0; color: #6c757d; font-size: 0.8rem;">
                    <i class="fas fa-calendar"></i> Started: ${new Date(medication.start_date).toLocaleDateString()}
                </p>
            </div>
            <div class="medication-actions">
                <button onclick="takeMedication('${medication.id}')" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
                    <i class="fas fa-check"></i> Take
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = medicationsHTML;
}

function renderHealthChart() {
    const ctx = document.getElementById('healthChart').getContext('2d');
    
    // Prepare chart data
    const dates = dashboardData.vitalSigns.slice(0, 7).reverse().map(vs => 
        new Date(vs.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    const systolicData = dashboardData.vitalSigns.slice(0, 7).reverse().map(vs => vs.blood_pressure_systolic || 0);
    const heartRateData = dashboardData.vitalSigns.slice(0, 7).reverse().map(vs => vs.heart_rate || 0);
    
    if (healthChart) {
        healthChart.destroy();
    }
    
    healthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.length > 0 ? dates : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Systolic BP',
                data: systolicData.length > 0 ? systolicData : [120, 118, 122, 119, 121, 117, 120],
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Heart Rate',
                data: heartRateData.length > 0 ? heartRateData : [72, 75, 70, 73, 71, 74, 72],
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
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function renderHealthInsights() {
    const container = document.getElementById('health-insights');
    
    if (dashboardData.aiInsights.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6c757d;">
                <i class="fas fa-lightbulb" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No health insights available</p>
                <button onclick="generateHealthInsights()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007BFF; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Generate Insights
                </button>
            </div>
        `;
        return;
    }
    
    const insightsHTML = dashboardData.aiInsights.map(insight => `
        <div class="insight-item" style="padding: 1.5rem; border-radius: 15px; background: linear-gradient(135deg, #e3f2fd, #f3e5f5); margin-bottom: 1rem; border-left: 4px solid #9c27b0;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <i class="fas fa-brain" style="color: #9c27b0; font-size: 1.2rem; margin-right: 0.75rem;"></i>
                <h4 style="margin: 0; color: #212529;">${insight.title}</h4>
            </div>
            <p style="margin: 0 0 1rem 0; color: #6c757d; line-height: 1.5;">
                ${insight.description}
            </p>
            <div style="background: rgba(156, 39, 176, 0.1); padding: 1rem; border-radius: 10px;">
                <strong style="color: #9c27b0;">Recommendation:</strong>
                <p style="margin: 0.5rem 0 0 0; color: #212529;">${insight.recommendation}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = insightsHTML;
}

// =====================================================
// 🤖 AI INTEGRATION FUNCTIONS
// =====================================================

function initializeComponents() {
    // Initialize Symptom Checker
    initializeSymptomChecker();
    
    // Initialize Vitals Recorder
    initializeVitalsRecorder();
}

function initializeSymptomChecker() {
    const container = document.getElementById('symptom-checker-container');
    
    container.innerHTML = `
        <div class="symptom-checker">
            <div style="margin-bottom: 1.5rem;">
                <textarea 
                    id="symptoms-input" 
                    placeholder="Describe your symptoms in detail... (e.g., headache, fever, fatigue)"
                    style="width: 100%; min-height: 120px; padding: 1rem; border: 2px solid #e9ecef; border-radius: 12px; font-family: 'Poppins', sans-serif; font-size: 1rem; line-height: 1.6; resize: vertical;"
                ></textarea>
            </div>
            <button 
                id="analyze-symptoms-btn"
                onclick="analyzeSymptoms()"
                style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 0.5rem; margin: 0 auto;"
            >
                <i class="fas fa-brain"></i>
                Analyze Symptoms
            </button>
            <div id="symptom-analysis-result" style="margin-top: 2rem;"></div>
        </div>
    `;
}

async function analyzeSymptoms() {
    const symptomsInput = document.getElementById('symptoms-input');
    const analyzeBtn = document.getElementById('analyze-symptoms-btn');
    const resultContainer = document.getElementById('symptom-analysis-result');
    
    const symptoms = symptomsInput.value.trim();
    
    if (!symptoms) {
        showToast('Please describe your symptoms', 'warning');
        return;
    }
    
    // Show loading state
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        const analysis = await getAISymptomAnalysis(symptoms);
        
        resultContainer.innerHTML = `
            <div style="background: linear-gradient(135deg, #f8f9ff, #e8f2ff); border-radius: 15px; padding: 2rem; border-left: 4px solid #007BFF;">
                <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle" style="color: #28a745; font-size: 1.5rem; margin-right: 0.75rem;"></i>
                    <h4 style="margin: 0; color: #212529;">AI Analysis Complete</h4>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h5 style="color: #212529; font-weight: 600; margin-bottom: 0.5rem;">🎯 Assessment</h5>
                    <p style="color: #6c757d; line-height: 1.6;">${analysis.title}</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h5 style="color: #212529; font-weight: 600; margin-bottom: 0.5rem;">📋 Description</h5>
                    <p style="color: #6c757d; line-height: 1.6;">${analysis.description}</p>
                </div>
                
                <div style="background: rgba(40, 167, 69, 0.1); padding: 1rem; border-radius: 10px; border-left: 3px solid #28a745;">
                    <h5 style="color: #28a745; font-weight: 600; margin-bottom: 0.5rem;">💡 Recommendations</h5>
                    <p style="color: #28a745; font-weight: 500; margin: 0;">${analysis.recommendation}</p>
                </div>
                
                <div style="background: rgba(255, 193, 7, 0.1); padding: 1rem; border-radius: 10px; border-left: 3px solid #ffc107; margin-top: 1rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                    <i class="fas fa-exclamation-triangle" style="color: #ffc107; margin-top: 0.25rem;"></i>
                    <small style="color: #856404; line-height: 1.4;">
                        This AI analysis is for informational purposes only. 
                        Please consult with a healthcare professional for proper medical advice.
                    </small>
                </div>
            </div>
        `;
        
        // Save AI insight to database
        await saveAIInsight(analysis);
        
    } catch (error) {
        console.error('Symptom analysis failed:', error);
        resultContainer.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 10px; border-left: 4px solid #dc3545;">
                <i class="fas fa-exclamation-circle"></i>
                Failed to analyze symptoms. Please try again later.
            </div>
        `;
    } finally {
        // Reset button
        analyzeBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze Symptoms';
        analyzeBtn.disabled = false;
    }
}

async function getAISymptomAnalysis(symptoms) {
    const prompt = `As a medical AI assistant, analyze these symptoms and provide a helpful assessment: "${symptoms}"

Please provide:
1. A brief assessment title
2. A detailed description of possible conditions
3. Practical recommendations for the patient

Format your response as JSON with keys: title, description, recommendation`;

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful medical AI assistant. Provide informative but not diagnostic advice.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('AI service unavailable');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        try {
            return JSON.parse(aiResponse);
        } catch {
            // Fallback if JSON parsing fails
            return {
                title: 'Symptom Analysis',
                description: aiResponse,
                recommendation: 'Please consult with a healthcare professional for proper evaluation.'
            };
        }
        
    } catch (error) {
        console.error('AI analysis failed:', error);
        // Return fallback analysis
        return {
            title: 'General Health Advice',
            description: 'Based on your symptoms, it\'s important to monitor your condition closely.',
            recommendation: 'Consider consulting with a healthcare professional if symptoms persist or worsen. Stay hydrated, get adequate rest, and maintain a healthy diet.'
        };
    }
}

// =====================================================
// 💾 DATABASE FUNCTIONS
// =====================================================

async function saveAIInsight(analysis) {
    try {
        const { data, error } = await supabase
            .from('ai_insights')
            .insert([{
                user_id: currentUser.id,
                title: analysis.title,
                description: analysis.description,
                recommendation: analysis.recommendation,
                status: 'new'
            }]);
            
        if (error) throw error;
        
        // Refresh insights
        dashboardData.aiInsights = await loadAIInsights();
        renderHealthInsights();
        updateDashboardStats();
        
    } catch (error) {
        console.error('Failed to save AI insight:', error);
    }
}

// =====================================================
// 🔄 REAL-TIME SUBSCRIPTIONS
// =====================================================

function setupRealTimeSubscriptions() {
    // Subscribe to appointments changes
    supabase
        .channel('appointments')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'appointments' },
            handleAppointmentUpdate
        )
        .subscribe();
        
    // Subscribe to medications changes
    supabase
        .channel('medications')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'medications' },
            handleMedicationUpdate
        )
        .subscribe();
        
    // Subscribe to vital signs changes
    supabase
        .channel('vital_signs')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'vital_signs' },
            handleVitalSignsUpdate
        )
        .subscribe();
}

function handleAppointmentUpdate(payload) {
    console.log('Appointment update:', payload);
    loadDashboardData();
    showToast('Appointments updated', 'info');
}

function handleMedicationUpdate(payload) {
    console.log('Medication update:', payload);
    loadDashboardData();
    showToast('Medications updated', 'info');
}

function handleVitalSignsUpdate(payload) {
    console.log('Vital signs update:', payload);
    loadDashboardData();
    showToast('Vital signs updated', 'info');
}

// =====================================================
// 🛠️ UTILITY FUNCTIONS
// =====================================================

function calculateHealthScore() {
    let score = 100;
    
    // Deduct points for missing data
    if (dashboardData.vitalSigns.length === 0) score -= 20;
    if (dashboardData.appointments.length === 0) score -= 10;
    if (dashboardData.medications.length > 5) score -= 10;
    
    // Add points for recent activity
    const recentVitals = dashboardData.vitalSigns.filter(vs => 
        new Date(vs.recorded_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    if (recentVitals.length > 0) score += 5;
    
    return Math.max(60, Math.min(100, score));
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'success') {
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

// =====================================================
// 📊 DEMO DATA FUNCTIONS
// =====================================================

function getDemoAppointments() {
    return [
        {
            id: 'demo-1',
            type: 'General Consultation',
            scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'scheduled',
            provider: { full_name: 'Dr. Sarah Johnson' }
        },
        {
            id: 'demo-2',
            type: 'Follow-up Visit',
            scheduled_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'scheduled',
            provider: { full_name: 'Dr. Michael Chen' }
        }
    ];
}

function getDemoMedications() {
    return [
        {
            id: 'demo-med-1',
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'demo-med-2',
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

function getDemoVitalSigns() {
    const vitals = [];
    for (let i = 0; i < 7; i++) {
        vitals.push({
            id: `demo-vital-${i}`,
            blood_pressure_systolic: 120 + Math.floor(Math.random() * 10) - 5,
            blood_pressure_diastolic: 80 + Math.floor(Math.random() * 6) - 3,
            heart_rate: 72 + Math.floor(Math.random() * 8) - 4,
            recorded_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    return vitals;
}

function getDemoAIInsights() {
    return [
        {
            id: 'demo-insight-1',
            title: 'Blood Pressure Trend',
            description: 'Your blood pressure readings have been consistently within normal range over the past week.',
            recommendation: 'Continue your current lifestyle and medication regimen. Regular monitoring is recommended.',
            created_at: new Date().toISOString()
        },
        {
            id: 'demo-insight-2',
            title: 'Medication Adherence',
            description: 'You have been taking your medications regularly, which is excellent for managing your health conditions.',
            recommendation: 'Keep up the good work with medication adherence. Set reminders if needed to maintain consistency.',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Premium Dashboard Functions Loaded');
}); 