// Health Assessments JavaScript - Combined functionality for all AI health assessments

// Assessment configuration
const ASSESSMENT_CONFIG = {
    'diet-planner': {
        name: 'Diet Planner',
        icon: 'fas fa-utensils',
        color: '#11998e',
        duration: 5,
        questions: 15
    },
    'symptom-checker': {
        name: 'Symptom Checker',
        icon: 'fas fa-stethoscope',
        color: '#4facfe',
        duration: 3,
        questions: 10
    },
    'mental-health': {
        name: 'Mental Health',
        icon: 'fas fa-brain',
        color: '#667eea',
        duration: 8,
        questions: 20
    },
    'womens-health': {
        name: "Women's Health",
        icon: 'fas fa-female',
        color: '#ffecd2',
        duration: 6,
        questions: 18
    },
    'health-report': {
        name: 'Health Report',
        icon: 'fas fa-file-medical',
        color: '#a8edea',
        duration: 10,
        questions: 25
    },
    'medicine-advisor': {
        name: 'Medicine Advisor',
        icon: 'fas fa-pills',
        color: '#ff9a9e',
        duration: 4,
        questions: 12
    },
    'fitness-coach': {
        name: 'Fitness Coach',
        icon: 'fas fa-dumbbell',
        color: '#ff6a00',
        duration: 7,
        questions: 16
    },
    'sleep-analyzer': {
        name: 'Sleep Analyzer',
        icon: 'fas fa-moon',
        color: '#4e54c8',
        duration: 5,
        questions: 14
    },
    'chronic-condition': {
        name: 'Chronic Condition Manager',
        icon: 'fas fa-heartbeat',
        color: '#fc466b',
        duration: 12,
        questions: 30
    },
    'risk-predictor': {
        name: 'Health Risk Predictor',
        icon: 'fas fa-chart-line',
        color: '#667eea',
        duration: 9,
        questions: 22
    }
};

// Assessment state management
let currentAssessment = null;
let assessmentData = {
    type: null,
    responses: [],
    startTime: null,
    currentQuestion: 0,
    totalQuestions: 0
};

// Initialize assessment system
function initializeAssessments() {
    console.log('🧠 Initializing AI Health Assessments...');
    
    // Setup assessment cards
    setupAssessmentCards();
    
    // Setup assessment forms
    setupAssessmentForms();
    
    // Setup progress tracking
    setupProgressTracking();
    
    console.log('✅ AI Health Assessments Initialized');
}

// Setup assessment cards
function setupAssessmentCards() {
    const assessmentCards = document.querySelectorAll('.assessment-card, .ai-feature-card');
    
    assessmentCards.forEach(card => {
        const assessmentType = card.getAttribute('data-assessment-type');
        if (assessmentType && ASSESSMENT_CONFIG[assessmentType]) {
            const config = ASSESSMENT_CONFIG[assessmentType];
            
            // Update card styling
            const icon = card.querySelector('.assessment-icon, .ai-feature-icon');
            if (icon) {
                icon.innerHTML = `<i class="${config.icon}"></i>`;
                icon.style.background = `linear-gradient(135deg, ${config.color}, ${adjustColor(config.color, -20)})`;
            }
            
            // Update duration display
            const duration = card.querySelector('.assessment-duration');
            if (duration) {
                duration.textContent = `${config.duration} min`;
            }
            
            // Add click handler
            card.addEventListener('click', () => startAssessment(assessmentType));
        }
    });
}

// Setup assessment forms
function setupAssessmentForms() {
    const assessmentForms = document.querySelectorAll('.assessment-form');
    
    assessmentForms.forEach(form => {
        form.addEventListener('submit', handleAssessmentSubmission);
        
        // Setup question navigation
        const nextButtons = form.querySelectorAll('.next-question');
        const prevButtons = form.querySelectorAll('.prev-question');
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => nextQuestion(form));
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => previousQuestion(form));
        });
    });
}

// Setup progress tracking
function setupProgressTracking() {
    // Initialize progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        updateProgressBar(bar, 0);
    });
}

// Start assessment
function startAssessment(assessmentType) {
    console.log(`🚀 Starting ${assessmentType} assessment...`);
    
    if (!ASSESSMENT_CONFIG[assessmentType]) {
        console.error('Unknown assessment type:', assessmentType);
        return;
    }
    
    // Initialize assessment data
    currentAssessment = assessmentType;
    assessmentData = {
        type: assessmentType,
        responses: [],
        startTime: new Date(),
        currentQuestion: 0,
        totalQuestions: ASSESSMENT_CONFIG[assessmentType].questions
    };
    
    // Navigate to assessment page
    const assessmentUrl = `/assessment/${assessmentType}`;
    window.location.href = assessmentUrl;
}

// Handle assessment form submission
function handleAssessmentSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const responses = {};
    
    // Collect form responses
    for (let [key, value] of formData.entries()) {
        if (responses[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(responses[key])) {
                responses[key].push(value);
            } else {
                responses[key] = [responses[key], value];
            }
        } else {
            responses[key] = value;
        }
    }
    
    // Add to assessment data
    assessmentData.responses.push(responses);
    
    // Submit to server
    submitAssessmentData(assessmentData);
}

// Submit assessment data to server
async function submitAssessmentData(data) {
    try {
        showLoadingState();
        
        const response = await fetch('/api/assessments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit assessment');
        }
        
        const result = await response.json();
        
        // Process AI analysis
        if (result.aiAnalysis) {
            displayAssessmentResults(result);
        }
        
        hideLoadingState();
        showNotification('Assessment completed successfully!', 'success');
        
    } catch (error) {
        console.error('Error submitting assessment:', error);
        hideLoadingState();
        showNotification('Error submitting assessment. Please try again.', 'error');
    }
}

// Display assessment results
function displayAssessmentResults(results) {
    const resultsContainer = document.querySelector('.assessment-results');
    if (!resultsContainer) return;
    
    const config = ASSESSMENT_CONFIG[results.type];
    
    resultsContainer.innerHTML = `
        <div class="results-header">
            <div class="results-icon" style="background: linear-gradient(135deg, ${config.color}, ${adjustColor(config.color, -20)})">
                <i class="${config.icon}"></i>
            </div>
            <h2>${config.name} Results</h2>
            <p class="results-date">Completed on ${new Date(results.completedAt).toLocaleDateString()}</p>
        </div>
        
        <div class="results-content">
            <div class="ai-analysis">
                <h3>🤖 AI Analysis</h3>
                <div class="analysis-text">${results.aiAnalysis}</div>
            </div>
            
            <div class="recommendations">
                <h3>💡 Recommendations</h3>
                <ul class="recommendation-list">
                    ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="next-steps">
                <h3>🎯 Next Steps</h3>
                <div class="steps-grid">
                    ${results.nextSteps.map(step => `
                        <div class="step-card">
                            <div class="step-icon">${step.icon}</div>
                            <div class="step-content">
                                <h4>${step.title}</h4>
                                <p>${step.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="results-actions">
            <button class="btn btn-primary" onclick="downloadResults()">
                <i class="fas fa-download"></i> Download Report
            </button>
            <button class="btn btn-secondary" onclick="shareResults()">
                <i class="fas fa-share"></i> Share Results
            </button>
            <button class="btn btn-outline" onclick="retakeAssessment()">
                <i class="fas fa-redo"></i> Retake Assessment
            </button>
        </div>
    `;
    
    // Animate results in
    resultsContainer.classList.add('show');
}

// Question navigation
function nextQuestion(form) {
    const questions = form.querySelectorAll('.question-group');
    const currentQuestionEl = form.querySelector('.question-group.active');
    const currentIndex = Array.from(questions).indexOf(currentQuestionEl);
    
    if (currentIndex < questions.length - 1) {
        currentQuestionEl.classList.remove('active');
        questions[currentIndex + 1].classList.add('active');
        
        assessmentData.currentQuestion = currentIndex + 1;
        updateProgressBar(form.querySelector('.progress-bar'), (currentIndex + 1) / questions.length * 100);
    }
}

function previousQuestion(form) {
    const questions = form.querySelectorAll('.question-group');
    const currentQuestionEl = form.querySelector('.question-group.active');
    const currentIndex = Array.from(questions).indexOf(currentQuestionEl);
    
    if (currentIndex > 0) {
        currentQuestionEl.classList.remove('active');
        questions[currentIndex - 1].classList.add('active');
        
        assessmentData.currentQuestion = currentIndex - 1;
        updateProgressBar(form.querySelector('.progress-bar'), (currentIndex - 1) / questions.length * 100);
    }
}

// Update progress bar
function updateProgressBar(progressBar, percentage) {
    if (!progressBar) return;
    
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${Math.round(percentage)}%`;
    }
}

// Utility functions
function adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

function showLoadingState() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>🤖 AI is analyzing your responses...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

function hideLoadingState() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Result actions
function downloadResults() {
    // Implementation for downloading results as PDF
    console.log('Downloading results...');
}

function shareResults() {
    // Implementation for sharing results
    console.log('Sharing results...');
}

function retakeAssessment() {
    if (currentAssessment) {
        startAssessment(currentAssessment);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAssessments);

// Export for global access
window.HealthAssessments = {
    startAssessment,
    ASSESSMENT_CONFIG,
    currentAssessment,
    assessmentData
}; 