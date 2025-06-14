/**
 * DeepSeek AI Symptoms Checker
 * Advanced symptom analysis and health recommendations
 */

class DeepSeekSymptomsChecker {
    constructor() {
        this.apiKey = 'sk-749701ac48284005b0c8bcb3e5303ea8';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.currentSession = null;
        this.symptomHistory = [];
        this.userProfile = null;
        
        this.initializeChecker();
    }

    async initializeChecker() {
        try {
            // Load user profile if available
            this.userProfile = await this.loadUserProfile();
            
            // Initialize symptom categories
            this.symptomCategories = {
                general: ['fever', 'fatigue', 'weakness', 'weight_loss', 'weight_gain', 'appetite_loss'],
                respiratory: ['cough', 'shortness_of_breath', 'chest_pain', 'wheezing', 'sore_throat'],
                cardiovascular: ['chest_pain', 'palpitations', 'dizziness', 'fainting', 'leg_swelling'],
                gastrointestinal: ['nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal_pain'],
                neurological: ['headache', 'confusion', 'memory_loss', 'seizures', 'numbness'],
                musculoskeletal: ['joint_pain', 'muscle_pain', 'stiffness', 'swelling', 'limited_mobility'],
                dermatological: ['rash', 'itching', 'skin_changes', 'bruising', 'hair_loss'],
                psychological: ['anxiety', 'depression', 'mood_changes', 'sleep_problems', 'stress']
            };

            console.log('✅ DeepSeek Symptoms Checker initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize symptoms checker:', error);
        }
    }

    async loadUserProfile() {
        try {
            const storedUser = localStorage.getItem('medicare_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                return {
                    age: user.age || 30,
                    gender: user.gender || 'not_specified',
                    medicalHistory: user.medicalHistory || [],
                    allergies: user.allergies || [],
                    medications: user.medications || [],
                    chronicConditions: user.chronicConditions || []
                };
            }
            return null;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    }

    async analyzeSymptoms(symptoms, additionalInfo = {}) {
        try {
            // Validate input
            if (!symptoms || symptoms.length === 0) {
                throw new Error('Please provide at least one symptom');
            }

            // Prepare the analysis prompt
            const analysisPrompt = this.buildAnalysisPrompt(symptoms, additionalInfo);
            
            // Call DeepSeek API
            const response = await this.callDeepSeekAPI(analysisPrompt);
            
            // Process and structure the response
            const analysis = await this.processAnalysisResponse(response);
            
            // Store in session history
            this.storeAnalysisSession(symptoms, analysis, additionalInfo);
            
            return analysis;
        } catch (error) {
            console.error('Symptom analysis error:', error);
            throw new Error(`Analysis failed: ${error.message}`);
        }
    }

    buildAnalysisPrompt(symptoms, additionalInfo) {
        const userContext = this.userProfile ? `
Patient Profile:
- Age: ${this.userProfile.age}
- Gender: ${this.userProfile.gender}
- Medical History: ${this.userProfile.medicalHistory.join(', ') || 'None reported'}
- Current Medications: ${this.userProfile.medications.join(', ') || 'None reported'}
- Allergies: ${this.userProfile.allergies.join(', ') || 'None reported'}
- Chronic Conditions: ${this.userProfile.chronicConditions.join(', ') || 'None reported'}
` : 'Patient Profile: Not available';

        const symptomsText = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
        
        const additionalContext = additionalInfo.duration ? `Duration: ${additionalInfo.duration}` : '';
        const severity = additionalInfo.severity ? `Severity (1-10): ${additionalInfo.severity}` : '';
        const triggers = additionalInfo.triggers ? `Triggers: ${additionalInfo.triggers}` : '';

        return `You are an advanced AI medical assistant. Analyze the following symptoms and provide a comprehensive health assessment.

${userContext}

Current Symptoms: ${symptomsText}
${additionalContext}
${severity}
${triggers}

Please provide a detailed analysis in the following JSON format:
{
    "urgencyLevel": "low|medium|high|emergency",
    "urgencyScore": 1-10,
    "possibleConditions": [
        {
            "condition": "condition name",
            "probability": "percentage",
            "description": "brief description",
            "severity": "mild|moderate|severe"
        }
    ],
    "recommendedActions": [
        {
            "action": "action description",
            "priority": "high|medium|low",
            "timeframe": "immediate|24hours|week|month"
        }
    ],
    "redFlags": [
        "list of concerning symptoms that require immediate attention"
    ],
    "selfCareAdvice": [
        "practical self-care recommendations"
    ],
    "whenToSeekCare": {
        "immediate": "conditions requiring emergency care",
        "urgent": "conditions requiring care within 24 hours",
        "routine": "conditions that can wait for routine appointment"
    },
    "followUpQuestions": [
        "questions to gather more information"
    ],
    "disclaimer": "Important medical disclaimer",
    "confidence": "percentage of confidence in assessment"
}

Important: This is for informational purposes only and should not replace professional medical advice. Always recommend consulting healthcare providers for proper diagnosis and treatment.`;
    }

    async callDeepSeekAPI(prompt) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a medical AI assistant specializing in symptom analysis. Provide accurate, helpful, and safe medical information while always emphasizing the importance of professional medical consultation.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API call failed:', error);
            throw error;
        }
    }

    async processAnalysisResponse(response) {
        try {
            const analysis = JSON.parse(response);
            
            // Validate and enhance the response
            return {
                ...analysis,
                timestamp: new Date().toISOString(),
                sessionId: this.generateSessionId(),
                analysisId: this.generateAnalysisId()
            };
        } catch (error) {
            console.error('Failed to parse analysis response:', error);
            throw new Error('Invalid response format from AI analysis');
        }
    }

    async getSymptomSuggestions(partialSymptom) {
        const allSymptoms = Object.values(this.symptomCategories).flat();
        return allSymptoms.filter(symptom => 
            symptom.toLowerCase().includes(partialSymptom.toLowerCase())
        ).slice(0, 10);
    }

    async getDetailedSymptomInfo(symptom) {
        try {
            const prompt = `Provide detailed information about the symptom "${symptom}" including:
            - Common causes
            - Associated symptoms
            - When to be concerned
            - Self-care measures
            
            Format as JSON with keys: causes, associatedSymptoms, concerningSigns, selfCare`;

            const response = await this.callDeepSeekAPI(prompt);
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to get symptom info:', error);
            return null;
        }
    }

    storeAnalysisSession(symptoms, analysis, additionalInfo) {
        const session = {
            id: analysis.sessionId,
            timestamp: new Date().toISOString(),
            symptoms: symptoms,
            additionalInfo: additionalInfo,
            analysis: analysis,
            userProfile: this.userProfile
        };

        this.symptomHistory.push(session);
        
        // Store in localStorage for persistence
        try {
            localStorage.setItem('symptom_history', JSON.stringify(this.symptomHistory));
        } catch (error) {
            console.warn('Failed to store symptom history:', error);
        }
    }

    getSymptomHistory() {
        return this.symptomHistory;
    }

    async generateHealthReport() {
        if (this.symptomHistory.length === 0) {
            return null;
        }

        try {
            const recentSessions = this.symptomHistory.slice(-5);
            const prompt = `Based on the following symptom analysis history, generate a comprehensive health report:

${JSON.stringify(recentSessions, null, 2)}

Provide insights about:
- Health trends
- Recurring patterns
- Risk factors
- Recommendations for ongoing care
- Suggested lifestyle modifications

Format as JSON with appropriate structure.`;

            const response = await this.callDeepSeekAPI(prompt);
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to generate health report:', error);
            return null;
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateAnalysisId() {
        return 'analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Emergency detection
    detectEmergencySymptoms(symptoms) {
        const emergencyKeywords = [
            'chest pain', 'difficulty breathing', 'severe headache', 'loss of consciousness',
            'severe bleeding', 'severe burns', 'poisoning', 'overdose', 'stroke symptoms',
            'heart attack', 'severe allergic reaction', 'severe abdominal pain'
        ];

        const symptomsText = Array.isArray(symptoms) ? symptoms.join(' ').toLowerCase() : symptoms.toLowerCase();
        
        return emergencyKeywords.some(keyword => symptomsText.includes(keyword));
    }

    // Integration with existing healthcare system
    async integrateWithHealthRecord(analysisResult) {
        try {
            if (window.mcpBackend) {
                await window.mcpBackend.createHealthRecord({
                    type: 'symptom_analysis',
                    data: analysisResult,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn('Failed to integrate with health record:', error);
        }
    }
}

// Symptoms Checker UI Component
class SymptomsCheckerUI {
    constructor() {
        this.checker = new DeepSeekSymptomsChecker();
        this.currentStep = 1;
        this.selectedSymptoms = [];
        this.additionalInfo = {};
        
        this.initializeUI();
    }

    initializeUI() {
        this.createSymptomsCheckerHTML();
        this.attachEventListeners();
    }

    createSymptomsCheckerHTML() {
        const symptomsCheckerHTML = `
            <div id="symptoms-checker-container" class="symptoms-checker-container">
                <div class="symptoms-checker-header">
                    <h2>🩺 AI Symptoms Checker</h2>
                    <p>Get personalized health insights powered by advanced AI</p>
                    <div class="emergency-notice">
                        <strong>⚠️ Emergency:</strong> If you're experiencing severe symptoms, call emergency services immediately.
                    </div>
                </div>

                <div class="symptoms-checker-content">
                    <!-- Step 1: Symptom Selection -->
                    <div id="step-1" class="checker-step active">
                        <h3>Step 1: What symptoms are you experiencing?</h3>
                        <div class="symptom-search">
                            <input type="text" id="symptom-search" placeholder="Type symptoms (e.g., headache, fever, cough)..." />
                            <div id="symptom-suggestions" class="symptom-suggestions"></div>
                        </div>
                        <div class="selected-symptoms">
                            <h4>Selected Symptoms:</h4>
                            <div id="selected-symptoms-list" class="symptoms-list"></div>
                        </div>
                        <button id="next-step-1" class="btn-primary" disabled>Next Step</button>
                    </div>

                    <!-- Step 2: Additional Information -->
                    <div id="step-2" class="checker-step">
                        <h3>Step 2: Additional Information</h3>
                        <div class="additional-info-form">
                            <div class="form-group">
                                <label>How long have you had these symptoms?</label>
                                <select id="symptom-duration">
                                    <option value="">Select duration</option>
                                    <option value="less_than_day">Less than a day</option>
                                    <option value="1-3_days">1-3 days</option>
                                    <option value="4-7_days">4-7 days</option>
                                    <option value="1-2_weeks">1-2 weeks</option>
                                    <option value="more_than_2_weeks">More than 2 weeks</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Severity (1-10 scale):</label>
                                <input type="range" id="symptom-severity" min="1" max="10" value="5" />
                                <span id="severity-value">5</span>
                            </div>
                            <div class="form-group">
                                <label>Any triggers or patterns?</label>
                                <textarea id="symptom-triggers" placeholder="Describe what makes symptoms better or worse..."></textarea>
                            </div>
                        </div>
                        <div class="step-navigation">
                            <button id="prev-step-2" class="btn-secondary">Previous</button>
                            <button id="analyze-symptoms" class="btn-primary">Analyze Symptoms</button>
                        </div>
                    </div>

                    <!-- Step 3: Analysis Results -->
                    <div id="step-3" class="checker-step">
                        <h3>Step 3: Analysis Results</h3>
                        <div id="analysis-loading" class="loading-spinner">
                            <div class="spinner"></div>
                            <p>Analyzing your symptoms with AI...</p>
                        </div>
                        <div id="analysis-results" class="analysis-results" style="display: none;"></div>
                        <div class="step-navigation">
                            <button id="new-analysis" class="btn-primary">New Analysis</button>
                            <button id="save-results" class="btn-secondary">Save to Health Record</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to page or return HTML
        return symptomsCheckerHTML;
    }

    attachEventListeners() {
        // Symptom search functionality
        document.addEventListener('input', (e) => {
            if (e.target.id === 'symptom-search') {
                this.handleSymptomSearch(e.target.value);
            }
        });

        // Severity slider
        document.addEventListener('input', (e) => {
            if (e.target.id === 'symptom-severity') {
                document.getElementById('severity-value').textContent = e.target.value;
            }
        });

        // Navigation buttons
        document.addEventListener('click', (e) => {
            switch (e.target.id) {
                case 'next-step-1':
                    this.goToStep(2);
                    break;
                case 'prev-step-2':
                    this.goToStep(1);
                    break;
                case 'analyze-symptoms':
                    this.analyzeSymptoms();
                    break;
                case 'new-analysis':
                    this.resetChecker();
                    break;
                case 'save-results':
                    this.saveResults();
                    break;
            }
        });
    }

    async handleSymptomSearch(query) {
        if (query.length < 2) {
            document.getElementById('symptom-suggestions').innerHTML = '';
            return;
        }

        try {
            const suggestions = await this.checker.getSymptomSuggestions(query);
            this.displaySymptomSuggestions(suggestions);
        } catch (error) {
            console.error('Error getting symptom suggestions:', error);
        }
    }

    displaySymptomSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('symptom-suggestions');
        suggestionsContainer.innerHTML = suggestions.map(symptom => 
            `<div class="symptom-suggestion" data-symptom="${symptom}">
                ${symptom.replace(/_/g, ' ')}
            </div>`
        ).join('');

        // Add click handlers for suggestions
        suggestionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('symptom-suggestion')) {
                this.addSymptom(e.target.dataset.symptom);
                document.getElementById('symptom-search').value = '';
                suggestionsContainer.innerHTML = '';
            }
        });
    }

    addSymptom(symptom) {
        if (!this.selectedSymptoms.includes(symptom)) {
            this.selectedSymptoms.push(symptom);
            this.updateSelectedSymptomsList();
            this.updateNextButton();
        }
    }

    removeSymptom(symptom) {
        this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
        this.updateSelectedSymptomsList();
        this.updateNextButton();
    }

    updateSelectedSymptomsList() {
        const container = document.getElementById('selected-symptoms-list');
        container.innerHTML = this.selectedSymptoms.map(symptom => 
            `<div class="selected-symptom">
                ${symptom.replace(/_/g, ' ')}
                <button class="remove-symptom" data-symptom="${symptom}">×</button>
            </div>`
        ).join('');

        // Add remove handlers
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-symptom')) {
                this.removeSymptom(e.target.dataset.symptom);
            }
        });
    }

    updateNextButton() {
        const nextButton = document.getElementById('next-step-1');
        nextButton.disabled = this.selectedSymptoms.length === 0;
    }

    goToStep(step) {
        document.querySelectorAll('.checker-step').forEach(el => el.classList.remove('active'));
        document.getElementById(`step-${step}`).classList.add('active');
        this.currentStep = step;
    }

    async analyzeSymptoms() {
        try {
            // Show loading
            this.goToStep(3);
            document.getElementById('analysis-loading').style.display = 'block';
            document.getElementById('analysis-results').style.display = 'none';

            // Collect additional information
            this.additionalInfo = {
                duration: document.getElementById('symptom-duration').value,
                severity: document.getElementById('symptom-severity').value,
                triggers: document.getElementById('symptom-triggers').value
            };

            // Check for emergency symptoms
            if (this.checker.detectEmergencySymptoms(this.selectedSymptoms)) {
                this.showEmergencyAlert();
                return;
            }

            // Perform analysis
            const analysis = await this.checker.analyzeSymptoms(this.selectedSymptoms, this.additionalInfo);
            
            // Display results
            this.displayAnalysisResults(analysis);
            
            // Hide loading
            document.getElementById('analysis-loading').style.display = 'none';
            document.getElementById('analysis-results').style.display = 'block';

        } catch (error) {
            console.error('Analysis failed:', error);
            this.showErrorMessage(error.message);
        }
    }

    showEmergencyAlert() {
        const alertHTML = `
            <div class="emergency-alert">
                <h3>🚨 Emergency Symptoms Detected</h3>
                <p>Based on your symptoms, you may need immediate medical attention.</p>
                <div class="emergency-actions">
                    <button class="btn-emergency" onclick="window.open('tel:911')">Call Emergency (911)</button>
                    <button class="btn-emergency" onclick="window.open('tel:1990')">Call Sri Lanka Emergency (1990)</button>
                </div>
                <p><strong>Do not delay seeking immediate medical care.</strong></p>
            </div>
        `;
        
        document.getElementById('analysis-results').innerHTML = alertHTML;
        document.getElementById('analysis-loading').style.display = 'none';
        document.getElementById('analysis-results').style.display = 'block';
    }

    displayAnalysisResults(analysis) {
        const resultsHTML = `
            <div class="analysis-summary">
                <div class="urgency-level urgency-${analysis.urgencyLevel}">
                    <h4>Urgency Level: ${analysis.urgencyLevel.toUpperCase()}</h4>
                    <div class="urgency-score">Score: ${analysis.urgencyScore}/10</div>
                </div>
            </div>

            <div class="possible-conditions">
                <h4>🔍 Possible Conditions</h4>
                ${analysis.possibleConditions.map(condition => `
                    <div class="condition-item">
                        <div class="condition-header">
                            <strong>${condition.condition}</strong>
                            <span class="probability">${condition.probability}</span>
                        </div>
                        <p>${condition.description}</p>
                        <span class="severity severity-${condition.severity}">${condition.severity}</span>
                    </div>
                `).join('')}
            </div>

            <div class="recommended-actions">
                <h4>📋 Recommended Actions</h4>
                ${analysis.recommendedActions.map(action => `
                    <div class="action-item priority-${action.priority}">
                        <div class="action-text">${action.action}</div>
                        <div class="action-meta">
                            <span class="priority">Priority: ${action.priority}</span>
                            <span class="timeframe">Timeframe: ${action.timeframe}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${analysis.redFlags && analysis.redFlags.length > 0 ? `
                <div class="red-flags">
                    <h4>⚠️ Warning Signs</h4>
                    <ul>
                        ${analysis.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="self-care-advice">
                <h4>🏠 Self-Care Recommendations</h4>
                <ul>
                    ${analysis.selfCareAdvice.map(advice => `<li>${advice}</li>`).join('')}
                </ul>
            </div>

            <div class="when-to-seek-care">
                <h4>🏥 When to Seek Care</h4>
                <div class="care-timeline">
                    <div class="care-immediate">
                        <strong>Immediate:</strong> ${analysis.whenToSeekCare.immediate}
                    </div>
                    <div class="care-urgent">
                        <strong>Within 24 hours:</strong> ${analysis.whenToSeekCare.urgent}
                    </div>
                    <div class="care-routine">
                        <strong>Routine appointment:</strong> ${analysis.whenToSeekCare.routine}
                    </div>
                </div>
            </div>

            <div class="medical-disclaimer">
                <h4>⚖️ Important Disclaimer</h4>
                <p>${analysis.disclaimer}</p>
                <p><strong>Confidence Level:</strong> ${analysis.confidence}</p>
            </div>
        `;

        document.getElementById('analysis-results').innerHTML = resultsHTML;
    }

    showErrorMessage(message) {
        const errorHTML = `
            <div class="error-message">
                <h4>❌ Analysis Error</h4>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">Try Again</button>
            </div>
        `;
        
        document.getElementById('analysis-results').innerHTML = errorHTML;
        document.getElementById('analysis-loading').style.display = 'none';
        document.getElementById('analysis-results').style.display = 'block';
    }

    resetChecker() {
        this.selectedSymptoms = [];
        this.additionalInfo = {};
        this.currentStep = 1;
        
        document.getElementById('symptom-search').value = '';
        document.getElementById('selected-symptoms-list').innerHTML = '';
        document.getElementById('symptom-duration').value = '';
        document.getElementById('symptom-severity').value = '5';
        document.getElementById('severity-value').textContent = '5';
        document.getElementById('symptom-triggers').value = '';
        
        this.goToStep(1);
        this.updateNextButton();
    }

    async saveResults() {
        try {
            // Integration with existing health record system
            const analysis = this.checker.symptomHistory[this.checker.symptomHistory.length - 1];
            await this.checker.integrateWithHealthRecord(analysis);
            
            alert('Results saved to your health record successfully!');
        } catch (error) {
            console.error('Failed to save results:', error);
            alert('Failed to save results. Please try again.');
        }
    }
}

// Initialize the symptoms checker when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.symptomsChecker = new SymptomsCheckerUI();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DeepSeekSymptomsChecker, SymptomsCheckerUI };
}

// Export for global use
window.DeepSeekSymptomsChecker = DeepSeekSymptomsChecker; 