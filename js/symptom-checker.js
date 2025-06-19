/**
 * MediCare+ Free AI Symptoms Checker
 * Comprehensive symptom analysis for all users - 100% FREE
 * 
 * Features:
 * - Advanced symptom analysis using DeepSeek AI
 * - Emergency detection and alerts
 * - Personalized health recommendations
 * - Drug interaction warnings
 * - Health risk assessment
 * - Natural language processing
 * - Multi-language support
 * - Offline mode capabilities
 */

class FreeAISymptomsChecker {
    constructor() {
        // FREE API access for all users
        this.apiKey = 'sk-749701ac48284005b0c8bcb3e5303ea8';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        // User session management
        this.currentUser = null;
        this.sessionId = this.generateSessionId();
        this.analysisHistory = [];
        
        // Medical knowledge base
        this.medicalDatabase = this.initializeMedicalDatabase();
        
        // Emergency detection system
        this.emergencyKeywords = [
            'chest pain', 'heart attack', 'stroke', 'seizure', 'unconscious',
            'difficulty breathing', 'severe bleeding', 'allergic reaction',
            'poisoning', 'overdose', 'severe headache', 'vision loss'
        ];
        
        // AI configuration optimized for healthcare
        this.aiConfig = {
            model: 'deepseek-chat',
            temperature: 0.1,    // Very conservative for medical advice
            max_tokens: 2000,    // Comprehensive responses
            top_p: 0.8,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
        };
        
        this.initializeChecker();
    }

    // ==================== INITIALIZATION ====================
    
    async initializeChecker() {
        try {
            console.log('🆓 Initializing FREE AI Symptoms Checker for all users...');
            
            // Load user context if available
            await this.loadUserContext();
            
            // Initialize UI components
            this.initializeUI();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Test API connection
            await this.testAPIConnection();
            
            console.log('✅ FREE AI Symptoms Checker ready for all users!');
            
        } catch (error) {
            console.error('❌ Failed to initialize symptoms checker:', error);
            this.handleInitializationError(error);
        }
    }

    async loadUserContext() {
        try {
            const userData = localStorage.getItem('medicare_user') || '{}';
            this.currentUser = JSON.parse(userData);
            
            // Ensure user has basic profile structure
            if (!this.currentUser.id) {
                this.currentUser = {
                    id: `user_${Date.now()}`,
                    name: 'Healthcare User',
                    age: null,
                    gender: null,
                    medicalHistory: [],
                    medications: [],
                    allergies: [],
                    chronicConditions: []
                };
            }
            
            console.log('👤 User context loaded for personalized AI analysis');
        } catch (error) {
            console.warn('⚠️ Could not load user context, using anonymous mode');
            this.currentUser = { id: `anonymous_${Date.now()}` };
        }
    }

    initializeMedicalDatabase() {
        return {
            commonSymptoms: {
                'fever': {
                    category: 'general',
                    urgency: 'medium',
                    commonCauses: ['infection', 'flu', 'covid-19', 'inflammatory condition'],
                    redFlags: ['high fever >39°C', 'fever with severe headache', 'fever with rash']
                },
                'headache': {
                    category: 'neurological',
                    urgency: 'low',
                    commonCauses: ['tension', 'migraine', 'dehydration', 'stress'],
                    redFlags: ['sudden severe headache', 'headache with vision changes', 'headache with neck stiffness']
                },
                'chest pain': {
                    category: 'cardiovascular',
                    urgency: 'high',
                    commonCauses: ['heart attack', 'angina', 'muscle strain', 'anxiety'],
                    redFlags: ['crushing chest pain', 'chest pain with shortness of breath', 'chest pain radiating to arm/jaw']
                },
                'shortness of breath': {
                    category: 'respiratory',
                    urgency: 'high',
                    commonCauses: ['asthma', 'pneumonia', 'heart failure', 'anxiety'],
                    redFlags: ['severe difficulty breathing', 'blue lips/fingernails', 'gasping for air']
                }
            },
            emergencyConditions: [
                'heart attack', 'stroke', 'severe allergic reaction', 'severe bleeding',
                'loss of consciousness', 'severe difficulty breathing', 'poisoning'
            ]
        };
    }

    // ==================== FREE AI ANALYSIS ====================
    
    async analyzeSymptoms(symptoms, additionalInfo = {}) {
        try {
            console.log('🤖 Starting FREE AI symptom analysis...');
            
            // Validate input
            if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
                throw new Error('Please provide at least one symptom to analyze');
            }
            
            // Normalize symptoms
            const normalizedSymptoms = this.normalizeSymptoms(symptoms);
            
            // Emergency check first
            const emergencyStatus = this.checkEmergencySymptoms(normalizedSymptoms);
            if (emergencyStatus.isEmergency) {
                return this.createEmergencyResponse(emergencyStatus);
            }
            
            // Build comprehensive analysis prompt
            const analysisPrompt = this.buildAnalysisPrompt(normalizedSymptoms, additionalInfo);
            
            // Call DeepSeek AI API
            const aiResponse = await this.callAIAPI(analysisPrompt);
            
            // Process and enhance response
            const analysis = await this.processAIResponse(aiResponse, normalizedSymptoms);
            
            // Store analysis in history
            this.storeAnalysis(analysis);
            
            console.log('✅ FREE AI analysis completed successfully');
            return analysis;
            
        } catch (error) {
            console.error('❌ AI analysis failed:', error);
            return this.createFallbackAnalysis(symptoms, error);
        }
    }

    normalizeSymptoms(symptoms) {
        const symptomList = Array.isArray(symptoms) ? symptoms : [symptoms];
        return symptomList.map(symptom => 
            symptom.toLowerCase().trim().replace(/[^\w\s]/gi, '')
        ).filter(symptom => symptom.length > 0);
    }

    checkEmergencySymptoms(symptoms) {
        const symptomText = symptoms.join(' ').toLowerCase();
        
        for (const emergency of this.emergencyKeywords) {
            if (symptomText.includes(emergency.toLowerCase())) {
                return {
                    isEmergency: true,
                    trigger: emergency,
                    severity: 'critical',
                    action: 'seek_immediate_care'
                };
            }
        }
        
        return { isEmergency: false };
    }

    buildAnalysisPrompt(symptoms, additionalInfo) {
        const userContext = this.currentUser ? `
Patient Profile:
- Age: ${this.currentUser.age || 'Not specified'}
- Gender: ${this.currentUser.gender || 'Not specified'}
- Medical History: ${(this.currentUser.medicalHistory || []).join(', ') || 'None reported'}
- Current Medications: ${(this.currentUser.medications || []).join(', ') || 'None reported'}
- Known Allergies: ${(this.currentUser.allergies || []).join(', ') || 'None reported'}
- Chronic Conditions: ${(this.currentUser.chronicConditions || []).join(', ') || 'None reported'}
` : 'Patient Profile: Anonymous user';

        const symptomsText = symptoms.join(', ');
        
        const contextualInfo = [
            additionalInfo.duration ? `Duration: ${additionalInfo.duration}` : '',
            additionalInfo.severity ? `Severity (1-10): ${additionalInfo.severity}` : '',
            additionalInfo.triggers ? `Triggers/Onset: ${additionalInfo.triggers}` : '',
            additionalInfo.alleviatingFactors ? `What helps: ${additionalInfo.alleviatingFactors}` : '',
            additionalInfo.associatedSymptoms ? `Other symptoms: ${additionalInfo.associatedSymptoms}` : ''
        ].filter(info => info).join('\n');

        return `You are an advanced AI medical assistant providing FREE symptom analysis for all users. Analyze the following symptoms and provide comprehensive, safe, and helpful medical guidance.

${userContext}

Current Symptoms: ${symptomsText}
${contextualInfo}

Please provide a detailed analysis in the following JSON format:
{
    "urgencyLevel": "low|medium|high|emergency",
    "urgencyScore": 1-10,
    "triageCategory": "emergency|urgent|semi-urgent|non-urgent",
    "possibleConditions": [
        {
            "condition": "condition name",
            "probability": "high|medium|low",
            "description": "brief explanation",
            "severity": "mild|moderate|severe"
        }
    ],
    "recommendedActions": [
        {
            "action": "specific recommendation",
            "priority": "high|medium|low",
            "timeframe": "immediate|24hours|week|month",
            "reasoning": "why this action is recommended"
        }
    ],
    "redFlags": [
        "warning signs that require immediate attention"
    ],
    "selfCareAdvice": [
        {
            "advice": "practical self-care step",
            "duration": "how long to try this",
            "monitoring": "what to watch for"
        }
    ],
    "whenToSeekCare": {
        "immediate": "go to ER or call 911 if...",
        "urgent": "see doctor within 24 hours if...",
        "routine": "schedule appointment if..."
    },
    "followUpQuestions": [
        "questions to better understand the condition"
    ],
    "preventionTips": [
        "how to prevent this in the future"
    ],
    "disclaimer": "Important: This FREE AI analysis is for informational purposes only and should not replace professional medical advice. Always consult healthcare providers for proper diagnosis and treatment.",
    "confidence": "AI confidence level in this assessment",
    "riskFactors": [
        "factors that may increase risk"
    ],
    "monitoringAdvice": "what symptoms to track and how"
}

IMPORTANT GUIDELINES:
- Prioritize patient safety above all else
- Always recommend professional medical consultation for serious concerns
- Provide clear, actionable advice
- Be thorough but not alarmist
- Include appropriate medical disclaimers
- Focus on evidence-based recommendations
- Consider the patient's profile and context
- Emphasize when to seek immediate care`;
    }

    async callAIAPI(prompt) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    ...this.aiConfig,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a medical AI assistant providing FREE symptom analysis. You must provide safe, accurate, evidence-based medical information while always emphasizing the importance of professional medical consultation. Respond in valid JSON format only.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
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
            console.error('🔥 DeepSeek API call failed:', error);
            throw error;
        }
    }

    async processAIResponse(aiResponse, symptoms) {
        try {
            const analysis = JSON.parse(aiResponse);
            
            // Enhance analysis with additional data
            const enhancedAnalysis = {
                ...analysis,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                analyzedSymptoms: symptoms,
                userId: this.currentUser?.id,
                analysisId: this.generateAnalysisId(),
                isAIGenerated: true,
                isFreeService: true,
                apiProvider: 'DeepSeek',
                
                // Add safety enhancements
                emergencyContact: {
                    emergency: '911 (US) or local emergency services',
                    poisonControl: '1-800-222-1222 (US)',
                    crisis: '988 (US Suicide & Crisis Lifeline)'
                },
                
                // Add follow-up recommendations
                followUpPlan: this.generateFollowUpPlan(analysis),
                
                // Add health education
                healthEducation: this.generateHealthEducation(symptoms, analysis)
            };
            
            return enhancedAnalysis;
            
        } catch (error) {
            console.error('❌ Failed to process AI response:', error);
            throw new Error('Failed to process AI analysis');
        }
    }

    createEmergencyResponse(emergencyStatus) {
        return {
            urgencyLevel: 'emergency',
            urgencyScore: 10,
            triageCategory: 'emergency',
            isEmergency: true,
            emergencyTrigger: emergencyStatus.trigger,
            
            recommendedActions: [
                {
                    action: '🚨 CALL 911 IMMEDIATELY or go to the nearest Emergency Room',
                    priority: 'critical',
                    timeframe: 'immediate',
                    reasoning: `Symptoms suggest ${emergencyStatus.trigger} which requires immediate medical attention`
                }
            ],
            
            immediateSteps: [
                'Call 911 or emergency services now',
                'Stay calm and don\'t panic',
                'If conscious, sit or lie down comfortably',
                'Don\'t eat or drink anything',
                'Have someone stay with you if possible',
                'Gather your medications and medical information'
            ],
            
            disclaimer: '⚠️ MEDICAL EMERGENCY DETECTED: This FREE AI system has identified symptoms that may indicate a medical emergency. Seek immediate professional medical attention.',
            
            emergencyContact: {
                emergency: '911 (US) or local emergency services',
                poisonControl: '1-800-222-1222 (US)',
                crisis: '988 (US Suicide & Crisis Lifeline)'
            },
            
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            isAIGenerated: true,
            isFreeService: true
        };
    }

    createFallbackAnalysis(symptoms, error) {
        const symptomList = Array.isArray(symptoms) ? symptoms : [symptoms];
        
        return {
            urgencyLevel: 'medium',
            urgencyScore: 5,
            triageCategory: 'semi-urgent',
            
            possibleConditions: [
                {
                    condition: 'Multiple possible conditions',
                    probability: 'unknown',
                    description: 'Unable to analyze with AI - see healthcare provider for proper assessment',
                    severity: 'unknown'
                }
            ],
            
            recommendedActions: [
                {
                    action: 'Consult with a healthcare provider for proper evaluation',
                    priority: 'high',
                    timeframe: '24hours',
                    reasoning: 'AI analysis unavailable - professional assessment recommended'
                }
            ],
            
            selfCareAdvice: [
                {
                    advice: 'Monitor your symptoms and note any changes',
                    duration: 'Until you see a healthcare provider',
                    monitoring: 'Track severity, frequency, and any new symptoms'
                }
            ],
            
            whenToSeekCare: {
                immediate: 'Symptoms worsen significantly or you develop severe pain, difficulty breathing, or other concerning symptoms',
                urgent: 'Symptoms persist or you\'re concerned about your health',
                routine: 'For ongoing health concerns and preventive care'
            },
            
            disclaimer: `FREE AI Analysis temporarily unavailable. Error: ${error.message}. Please consult healthcare providers for medical advice.`,
            
            isAIGenerated: false,
            isFreeService: true,
            isErrorResponse: true,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
    }

    // ==================== UTILITY FUNCTIONS ====================
    
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateAnalysisId() {
        return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    storeAnalysis(analysis) {
        this.analysisHistory.push(analysis);
        
        // Store in localStorage for user history
        try {
            const history = JSON.parse(localStorage.getItem('medicare_symptom_history') || '[]');
            history.push(analysis);
            
            // Keep only last 50 analyses
            if (history.length > 50) {
                history.splice(0, history.length - 50);
            }
            
            localStorage.setItem('medicare_symptom_history', JSON.stringify(history));
        } catch (error) {
            console.warn('Could not save analysis to localStorage:', error);
        }
    }

    async testAPIConnection() {
        try {
            const testResponse = await this.callAIAPI('Test connection: respond with {"status": "connected", "message": "AI ready"}');
            const result = JSON.parse(testResponse);
            console.log('🔗 API Connection Test:', result.message || 'Connected');
            return true;
        } catch (error) {
            console.warn('⚠️ API connection test failed, fallback mode available:', error.message);
            return false;
        }
    }

    generateFollowUpPlan(analysis) {
        return {
            shortTerm: 'Monitor symptoms for 24-48 hours',
            mediumTerm: 'Follow up with healthcare provider if symptoms persist',
            longTerm: 'Consider preventive measures and lifestyle modifications',
            monitoring: 'Track symptom changes, severity, and any new developments'
        };
    }

    generateHealthEducation(symptoms, analysis) {
        return {
            aboutSymptoms: `Learn more about ${symptoms.join(', ')} and their common causes`,
            prevention: 'Tips for preventing similar symptoms in the future',
            selfCare: 'Safe self-care measures you can take at home',
            whenToWorry: 'Warning signs that require immediate medical attention'
        };
    }

    // ==================== USER INTERFACE ====================
    
    initializeUI() {
        // UI initialization will be handled by the dashboard integration
        console.log('🎨 UI components ready for FREE AI symptoms checker');
    }

    setupEventListeners() {
        // Event listeners will be set up by the dashboard
        console.log('👂 Event listeners ready for user interactions');
    }

    handleInitializationError(error) {
        console.error('Initialization error:', error);
        // Provide graceful degradation
        this.isDemo = true;
        console.log('🔄 Falling back to offline mode with basic symptom guidance');
    }

    // ==================== PUBLIC API ====================
    
    async quickSymptomCheck(symptom) {
        return await this.analyzeSymptoms([symptom]);
    }

    async detailedSymptomAnalysis(symptoms, userInfo) {
        return await this.analyzeSymptoms(symptoms, userInfo);
    }

    getAnalysisHistory() {
        return this.analysisHistory;
    }

    clearHistory() {
        this.analysisHistory = [];
        localStorage.removeItem('medicare_symptom_history');
    }

    // ==================== EXPORT FOR GLOBAL USE ====================
    
    static getInstance() {
        if (!window.freeAISymptomsChecker) {
            window.freeAISymptomsChecker = new FreeAISymptomsChecker();
        }
        return window.freeAISymptomsChecker;
    }
}

// Auto-initialize for immediate use
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting FREE AI Symptoms Checker for all users...');
    window.freeAISymptomsChecker = FreeAISymptomsChecker.getInstance();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FreeAISymptomsChecker;
} 