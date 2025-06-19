/**
 * MediCare+ AI Health Assistant
 * Advanced AI-powered health assistant with DeepSeek API integration
 * 
 * Features:
 * - Intelligent symptom checking and analysis
 * - Personalized health recommendations
 * - Medical knowledge base queries
 * - Drug interaction checking
 * - Health risk assessment
 * - Emergency situation detection
 * - Natural language health conversations
 */

class AIHealthAssistant {
    constructor(healthcareAPI) {
        this.healthcareAPI = healthcareAPI;
        // Set your DeepSeek API key by default - FREE for all users
        this.deepSeekApiKey = 'sk-749701ac48284005b0c8bcb3e5303ea8';
        this.deepSeekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.isDemo = false; // Enable full AI features by default
        
        // Medical knowledge base
        this.medicalKnowledge = {
            symptoms: new Map(),
            conditions: new Map(),
            medications: new Map(),
            emergencyKeywords: [
                'chest pain', 'difficulty breathing', 'severe headache', 
                'loss of consciousness', 'severe bleeding', 'stroke symptoms',
                'heart attack', 'allergic reaction', 'poisoning', 'overdose'
            ]
        };
        
        // Conversation context
        this.conversationHistory = new Map();
        this.maxContextLength = 10;
        
        // AI model configuration optimized for medical advice
        this.modelConfig = {
            model: 'deepseek-chat',
            temperature: 0.2,  // More conservative for medical advice
            max_tokens: 1500,  // Increased for comprehensive responses
            top_p: 0.85
        };
        
        this.initializeMedicalKnowledge();
        console.log('✅ AI Health Assistant initialized with FREE DeepSeek API access for all users');
    }

    // ==================== INITIALIZATION ====================
    
    setApiKey(apiKey) {
        // Keep the default key for free access, but allow override if needed
        if (apiKey && apiKey !== 'sk-your-deepseek-api-key-here' && apiKey !== this.deepSeekApiKey) {
            this.deepSeekApiKey = apiKey;
            this.isDemo = false;
            console.log('✅ Custom DeepSeek API key configured');
        } else {
            // Use default free API key
            this.deepSeekApiKey = 'sk-749701ac48284005b0c8bcb3e5303ea8';
            this.isDemo = false;
            console.log('✅ Using default FREE DeepSeek API for all users');
        }
    }

    initializeMedicalKnowledge() {
        // Common symptoms and their potential conditions
        this.medicalKnowledge.symptoms.set('fever', {
            commonCauses: ['infection', 'flu', 'cold', 'covid-19'],
            urgencyLevel: 'medium',
            recommendations: ['rest', 'hydration', 'monitor temperature']
        });
        
        this.medicalKnowledge.symptoms.set('headache', {
            commonCauses: ['tension', 'migraine', 'dehydration', 'stress'],
            urgencyLevel: 'low',
            recommendations: ['rest', 'hydration', 'pain relief']
        });
        
        this.medicalKnowledge.symptoms.set('chest pain', {
            commonCauses: ['heart attack', 'angina', 'muscle strain', 'anxiety'],
            urgencyLevel: 'high',
            recommendations: ['seek immediate medical attention']
        });
        
        // Add more medical knowledge...
        console.log('✅ Medical knowledge base initialized');
    }

    // ==================== DEEPSEEK API INTEGRATION ====================
    
    async callDeepSeekAPI(messages, options = {}) {
        if (this.isDemo) {
            // Return demo AI responses
            return this.getDemoAIResponse(messages);
        }
        
        if (!this.deepSeekApiKey) {
            throw new Error('DeepSeek API key not configured');
        }
        
        try {
            const response = await fetch(this.deepSeekApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.deepSeekApiKey}`
                },
                body: JSON.stringify({
                    ...this.modelConfig,
                    ...options,
                    messages: messages
                })
            });
            
            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('❌ DeepSeek API call failed:', error);
            throw error;
        }
    }

    getDemoAIResponse(messages) {
        const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
        
        // Demo responses based on keywords
        if (userMessage.includes('symptom') || userMessage.includes('pain') || userMessage.includes('hurt')) {
            return `Based on your symptoms, I recommend:

1. **Monitor your symptoms** - Keep track of when they occur and their severity
2. **Stay hydrated** - Drink plenty of water
3. **Rest** - Get adequate sleep and avoid strenuous activities
4. **Consult a healthcare provider** if symptoms persist or worsen

**Important:** This is a demo response. For real medical advice, please consult with a qualified healthcare professional.

Is there anything specific about your symptoms you'd like to discuss?`;
        }
        
        if (userMessage.includes('medication') || userMessage.includes('drug') || userMessage.includes('pill')) {
            return `Regarding medications:

1. **Always follow prescribed dosages** - Take medications exactly as directed
2. **Check for interactions** - Inform your doctor about all medications you're taking
3. **Set reminders** - Use our medication reminder feature
4. **Don't stop suddenly** - Consult your doctor before discontinuing any medication

**Demo Mode:** This is a simulated response. For actual medication advice, consult your healthcare provider.

Would you like help setting up medication reminders?`;
        }
        
        if (userMessage.includes('blood pressure') || userMessage.includes('bp') || userMessage.includes('hypertension')) {
            return `Blood pressure management tips:

1. **Regular monitoring** - Check your BP at consistent times
2. **Healthy diet** - Reduce sodium, increase fruits and vegetables
3. **Regular exercise** - 30 minutes of moderate activity most days
4. **Stress management** - Practice relaxation techniques
5. **Medication compliance** - Take BP medications as prescribed

**Normal ranges:**
- Systolic: Less than 120 mmHg
- Diastolic: Less than 80 mmHg

**Demo Response:** For personalized advice, consult your healthcare provider.`;
        }
        
        // Default response
        return `Hello! I'm your AI health assistant (demo mode). I can help you with:

• **Symptom analysis** - Describe your symptoms for guidance
• **Medication management** - Questions about your prescriptions
• **Health monitoring** - Understanding your vital signs
• **Lifestyle advice** - Tips for healthy living
• **Emergency guidance** - When to seek immediate care

**Note:** This is a demonstration. For real medical advice, always consult qualified healthcare professionals.

How can I assist you with your health today?`;
    }

    // ==================== ENHANCED SYMPTOM CHECKING (Infermedica-inspired) ====================
    
    async analyzeSymptoms(userId, symptoms, additionalInfo = {}) {
        try {
            // Get comprehensive user context
            const userProfile = await this.healthcareAPI.getUserProfile(userId);
            const medications = await this.healthcareAPI.getUserMedications(userId);
            const recentVitals = await this.healthcareAPI.getUserVitalSigns(userId, 5);
            
            // Step 1: Emergency Detection (Critical Safety Check)
            const emergencyCheck = this.checkEmergencySymptoms(symptoms, additionalInfo);
            if (emergencyCheck.isEmergency) {
                return {
                    urgency: 'emergency',
                    triageLevel: 1, // Immediate care required
                    recommendation: 'SEEK IMMEDIATE MEDICAL ATTENTION',
                    reasoning: emergencyCheck.reason,
                    nextSteps: [
                        'Call emergency services (911) immediately',
                        'Go to the nearest emergency room',
                        'Do not drive yourself - call an ambulance'
                    ],
                    educationalContent: {
                        title: 'Emergency Medical Situation',
                        description: 'Your symptoms indicate a potentially serious medical emergency that requires immediate professional medical attention.',
                        whenToSeekCare: 'Immediately - do not delay'
                    }
                };
            }
            
            // Step 2: Comprehensive Symptom Analysis
            const medicalContext = this.prepareMedicalContext(userProfile, medications, recentVitals);
            const analysisPrompt = this.createEnhancedSymptomAnalysisPrompt(symptoms, additionalInfo, medicalContext);
            
            let aiResponse;
            try {
                aiResponse = await this.callDeepSeekAPI([
                    { role: 'system', content: this.getEnhancedSystemPrompt('symptom_analysis') },
                    { role: 'user', content: analysisPrompt }
                ]);
            } catch (error) {
                console.warn('AI analysis failed, using enhanced fallback:', error);
                return this.getEnhancedFallbackAnalysis(symptoms, additionalInfo);
            }
            
            // Step 3: Parse and enhance AI response
            const analysis = this.parseEnhancedSymptomAnalysis(aiResponse);
            
            // Step 4: Add triage level and care navigation
            const triageAssessment = this.calculateTriageLevel(analysis, additionalInfo);
            
            // Step 5: Generate evidence-based recommendations
            const recommendations = this.generateEvidenceBasedRecommendations(analysis, triageAssessment, medicalContext);
            
            // Step 6: Create educational content
            const educationalContent = this.generatePatientEducation(analysis.possibleConditions);
            
            // Step 7: Add care navigation
            const careNavigation = this.generateCareNavigation(triageAssessment.level, analysis.possibleConditions);
            
            return {
                ...analysis,
                triageLevel: triageAssessment.level,
                triageLevelDescription: triageAssessment.description,
                urgency: triageAssessment.urgency,
                recommendations: recommendations.immediate,
                selfCareOptions: recommendations.selfCare,
                followUpGuidance: recommendations.followUp,
                specialistRecommendation: careNavigation.specialist,
                careLevel: careNavigation.level,
                educationalContent: educationalContent,
                nextSteps: this.generateNextSteps(triageAssessment.level, analysis),
                riskFactors: this.identifyRiskFactors(symptoms, additionalInfo, medicalContext),
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Enhanced symptom analysis failed:', error);
            return this.getEnhancedFallbackAnalysis(symptoms, additionalInfo);
        }
    }

    // Enhanced emergency detection with severity assessment
    checkEmergencySymptoms(symptoms, additionalInfo = {}) {
        const emergencyKeywords = [
            // Cardiovascular emergencies
            'chest pain', 'heart attack', 'severe chest pressure', 'crushing chest pain',
            // Respiratory emergencies
            'difficulty breathing', 'can\'t breathe', 'shortness of breath', 'choking',
            // Neurological emergencies
            'stroke', 'severe headache', 'loss of consciousness', 'seizure', 'paralysis',
            // Trauma/bleeding
            'severe bleeding', 'heavy bleeding', 'major injury', 'broken bone',
            // Poisoning/overdose
            'poisoning', 'overdose', 'allergic reaction', 'anaphylaxis',
            // Other critical
            'severe abdominal pain', 'sudden vision loss', 'severe burns'
        ];
        
        const symptomText = symptoms.join(' ').toLowerCase();
        const descriptionText = (additionalInfo.description || '').toLowerCase();
        const combinedText = `${symptomText} ${descriptionText}`;
        
        // Check for emergency keywords
        for (const keyword of emergencyKeywords) {
            if (combinedText.includes(keyword)) {
                return {
                    isEmergency: true,
                    reason: `Symptoms suggest possible ${keyword} - requires immediate medical evaluation`,
                    keyword: keyword
                };
            }
        }
        
        // Check severity-based emergency criteria
        const severity = parseInt(additionalInfo.severity) || 0;
        const duration = additionalInfo.duration || '';
        
        if (severity >= 9 && (duration.includes('sudden') || additionalInfo.onset === 'sudden')) {
            return {
                isEmergency: true,
                reason: 'Severe symptoms (9-10/10) with sudden onset require immediate evaluation'
            };
        }
        
        return { isEmergency: false };
    }

    // Enhanced system prompt based on Infermedica methodology
    getEnhancedSystemPrompt(type) {
        return `You are an advanced AI medical triage assistant based on evidence-based medicine and clinical guidelines. Your role is to provide accurate, safe, and helpful symptom analysis following these principles:

CORE PRINCIPLES:
1. Patient safety is paramount - err on the side of caution
2. Use evidence-based medicine and clinical guidelines
3. Provide clear, understandable explanations in simple language
4. Always recommend professional medical consultation for serious concerns
5. Consider patient demographics, medical history, and risk factors

ANALYSIS FRAMEWORK:
- Assess symptom patterns and combinations
- Consider differential diagnoses with confidence levels
- Evaluate urgency and appropriate care level
- Provide actionable, specific recommendations
- Include patient education and self-care guidance

TRIAGE LEVELS (1-5):
1. Emergency (Immediate) - Life-threatening, requires emergency care
2. Urgent (2-4 hours) - Serious condition, needs prompt medical attention
3. Semi-urgent (24 hours) - Concerning symptoms, see doctor within day
4. Non-urgent (72 hours) - Mild symptoms, routine medical care
5. Self-care - Minor symptoms, home management appropriate

OUTPUT FORMAT:
Provide structured analysis with:
- Primary assessment and confidence level
- Possible conditions (ranked by likelihood)
- Triage level with clear reasoning
- Specific recommendations for each condition
- Red flag symptoms to watch for
- Self-care options when appropriate
- When to seek immediate vs routine care

Remember: You are providing guidance, not diagnosis. Always emphasize the importance of professional medical evaluation for concerning symptoms.`;
    }

    // Enhanced symptom analysis prompt
    createEnhancedSymptomAnalysisPrompt(symptoms, additionalInfo, medicalContext) {
        return `PATIENT SYMPTOM ANALYSIS REQUEST

PRESENTING SYMPTOMS:
${symptoms.length > 0 ? symptoms.map(s => `- ${s}`).join('\n') : 'No specific symptoms selected'}

SYMPTOM DETAILS:
- Description: ${additionalInfo.description || 'Not provided'}
- Duration: ${additionalInfo.duration || 'Not specified'}
- Severity (1-10): ${additionalInfo.severity || 'Not rated'}
- Onset: ${additionalInfo.onset || 'Not specified'}
- Triggers/Factors: ${additionalInfo.triggers || 'None identified'}

PATIENT CONTEXT:
${medicalContext}

ANALYSIS REQUIRED:
1. Primary symptom assessment with confidence levels
2. Differential diagnosis (top 3-5 most likely conditions)
3. Triage level determination (1-5 scale)
4. Risk stratification and red flag symptoms
5. Evidence-based recommendations
6. Self-care options and limitations
7. Follow-up guidance and timing
8. Patient education points

Please provide a comprehensive analysis following evidence-based medical guidelines, prioritizing patient safety and appropriate care navigation.`;
    }

    // Calculate triage level based on Infermedica's 5-level system
    calculateTriageLevel(analysis, additionalInfo) {
        const severity = parseInt(additionalInfo.severity) || 5;
        const duration = additionalInfo.duration || '';
        const onset = additionalInfo.onset || '';
        
        // Level 1: Emergency (Immediate care)
        if (analysis.urgency === 'emergency' || severity >= 9) {
            return {
                level: 1,
                urgency: 'emergency',
                description: 'Emergency - Immediate medical attention required',
                timeframe: 'Immediately',
                careLocation: 'Emergency Department'
            };
        }
        
        // Level 2: Urgent (2-4 hours)
        if (severity >= 7 || onset === 'sudden' || duration.includes('worsening')) {
            return {
                level: 2,
                urgency: 'urgent',
                description: 'Urgent - Medical attention needed within 2-4 hours',
                timeframe: '2-4 hours',
                careLocation: 'Urgent Care or Emergency Department'
            };
        }
        
        // Level 3: Semi-urgent (24 hours)
        if (severity >= 5 || duration.includes('days') || duration.includes('week')) {
            return {
                level: 3,
                urgency: 'semi-urgent',
                description: 'Semi-urgent - See healthcare provider within 24 hours',
                timeframe: 'Within 24 hours',
                careLocation: 'Primary Care or Urgent Care'
            };
        }
        
        // Level 4: Non-urgent (72 hours)
        if (severity >= 3 || duration.includes('weeks')) {
            return {
                level: 4,
                urgency: 'non-urgent',
                description: 'Non-urgent - Schedule routine medical appointment',
                timeframe: 'Within 72 hours',
                careLocation: 'Primary Care Provider'
            };
        }
        
        // Level 5: Self-care
        return {
            level: 5,
            urgency: 'self-care',
            description: 'Self-care - Monitor symptoms and use home remedies',
            timeframe: 'Monitor for changes',
            careLocation: 'Home care with monitoring'
        };
    }

    // Generate evidence-based recommendations
    generateEvidenceBasedRecommendations(analysis, triageAssessment, medicalContext) {
        const recommendations = {
            immediate: [],
            selfCare: [],
            followUp: []
        };
        
        // Immediate actions based on triage level
        switch (triageAssessment.level) {
            case 1: // Emergency
                recommendations.immediate = [
                    'Call 911 or go to emergency department immediately',
                    'Do not drive yourself - call ambulance if needed',
                    'Bring list of current medications',
                    'Have someone accompany you if possible'
                ];
                break;
                
            case 2: // Urgent
                recommendations.immediate = [
                    'Seek medical attention within 2-4 hours',
                    'Contact your healthcare provider or visit urgent care',
                    'Monitor symptoms closely for any worsening',
                    'Prepare medical history and medication list'
                ];
                break;
                
            case 3: // Semi-urgent
                recommendations.immediate = [
                    'Schedule appointment with healthcare provider within 24 hours',
                    'Monitor symptoms and note any changes',
                    'Continue current medications as prescribed',
                    'Avoid activities that worsen symptoms'
                ];
                break;
                
            case 4: // Non-urgent
                recommendations.immediate = [
                    'Schedule routine appointment with primary care provider',
                    'Keep symptom diary to track patterns',
                    'Continue normal activities unless symptoms worsen'
                ];
                break;
                
            case 5: // Self-care
                recommendations.immediate = [
                    'Monitor symptoms for any changes',
                    'Use appropriate self-care measures',
                    'Seek medical attention if symptoms worsen'
                ];
                break;
        }
        
        // Self-care recommendations
        if (triageAssessment.level >= 3) {
            recommendations.selfCare = [
                'Stay well hydrated with water',
                'Get adequate rest and sleep',
                'Eat nutritious, easily digestible foods',
                'Avoid alcohol and smoking',
                'Use over-the-counter medications as appropriate',
                'Apply heat or cold therapy if helpful',
                'Practice stress reduction techniques'
            ];
        }
        
        // Follow-up guidance
        recommendations.followUp = [
            'Return for care if symptoms worsen or new symptoms develop',
            'Follow up as recommended by healthcare provider',
            'Keep track of symptom progression',
            'Bring symptom diary to medical appointments'
        ];
        
        return recommendations;
    }

    // Generate patient education content
    generatePatientEducation(possibleConditions) {
        if (!possibleConditions || possibleConditions.length === 0) {
            return {
                title: 'General Health Guidance',
                description: 'Monitor your symptoms and maintain good health practices.',
                commonCauses: ['Various factors can contribute to symptoms'],
                whenToSeekCare: 'If symptoms persist, worsen, or you develop new concerning symptoms'
            };
        }
        
        const primaryCondition = possibleConditions[0];
        
        return {
            title: primaryCondition.name || 'Symptom Information',
            description: primaryCondition.description || 'Learn about your symptoms and when to seek care.',
            commonCauses: this.getCommonCauses(primaryCondition.name),
            careMethods: this.getCareMethods(primaryCondition.name),
            whenToSeekCare: this.getWhenToSeekCare(primaryCondition.name),
            preventionTips: this.getPreventionTips(primaryCondition.name)
        };
    }

    // Generate care navigation recommendations
    generateCareNavigation(triageLevel, possibleConditions) {
        const navigation = {
            level: 'primary-care',
            specialist: null,
            services: []
        };
        
        // Determine appropriate care level
        if (triageLevel <= 2) {
            navigation.level = 'emergency-care';
            navigation.services = ['Emergency Department', 'Urgent Care'];
        } else if (triageLevel === 3) {
            navigation.level = 'urgent-care';
            navigation.services = ['Urgent Care', 'Primary Care'];
        } else {
            navigation.level = 'primary-care';
            navigation.services = ['Primary Care Provider'];
        }
        
        // Specialist recommendations based on symptoms
        if (possibleConditions && possibleConditions.length > 0) {
            const primaryCondition = possibleConditions[0].name?.toLowerCase() || '';
            
            if (primaryCondition.includes('heart') || primaryCondition.includes('cardiac')) {
                navigation.specialist = 'Cardiologist';
            } else if (primaryCondition.includes('lung') || primaryCondition.includes('respiratory')) {
                navigation.specialist = 'Pulmonologist';
            } else if (primaryCondition.includes('skin') || primaryCondition.includes('dermatology')) {
                navigation.specialist = 'Dermatologist';
            } else if (primaryCondition.includes('mental') || primaryCondition.includes('anxiety')) {
                navigation.specialist = 'Mental Health Professional';
            }
        }
        
        return navigation;
    }

    // Generate next steps based on triage level
    generateNextSteps(triageLevel, analysis) {
        const baseSteps = [
            'Keep a detailed symptom diary',
            'Note any triggers or patterns',
            'Monitor for symptom changes'
        ];
        
        switch (triageLevel) {
            case 1:
                return [
                    'Seek emergency medical care immediately',
                    'Call 911 if symptoms are severe',
                    'Do not delay medical attention'
                ];
                
            case 2:
                return [
                    'Contact healthcare provider within 2-4 hours',
                    'Visit urgent care if primary care unavailable',
                    ...baseSteps
                ];
                
            case 3:
                return [
                    'Schedule appointment within 24 hours',
                    'Call healthcare provider for guidance',
                    ...baseSteps
                ];
                
            case 4:
                return [
                    'Schedule routine appointment within 72 hours',
                    'Continue monitoring symptoms',
                    ...baseSteps
                ];
                
            case 5:
                return [
                    'Try appropriate self-care measures',
                    'Monitor for improvement over 3-5 days',
                    'Seek care if symptoms worsen',
                    ...baseSteps
                ];
                
            default:
                return baseSteps;
        }
    }

    // Enhanced fallback analysis with triage system
    getEnhancedFallbackAnalysis(symptoms, additionalInfo) {
        const severity = parseInt(additionalInfo.severity) || 5;
        const triageAssessment = this.calculateTriageLevel({ urgency: 'low' }, additionalInfo);
        
        return {
            urgency: triageAssessment.urgency,
            triageLevel: triageAssessment.level,
            triageLevelDescription: triageAssessment.description,
            reasoning: 'Analysis based on symptom severity and duration patterns',
            possibleConditions: [
                {
                    name: 'Common Health Concern',
                    description: 'Your symptoms may be related to a common health issue',
                    confidence: 60
                }
            ],
            recommendations: [
                'Monitor your symptoms closely',
                'Stay hydrated and get adequate rest',
                'Consider over-the-counter remedies if appropriate',
                'Consult healthcare provider if symptoms persist or worsen'
            ],
            selfCareOptions: [
                'Rest and adequate sleep',
                'Proper hydration',
                'Healthy nutrition',
                'Stress management'
            ],
            nextSteps: this.generateNextSteps(triageAssessment.level, {}),
            educationalContent: {
                title: 'General Health Guidance',
                description: 'Monitor symptoms and practice good health habits',
                whenToSeekCare: 'If symptoms persist beyond 3-5 days or worsen'
            },
            careLevel: triageAssessment.careLocation,
            timestamp: new Date().toISOString()
        };
    }

    // Helper methods for educational content
    getCommonCauses(condition) {
        const causes = {
            'common cold': ['Viral infection', 'Seasonal changes', 'Exposure to infected individuals'],
            'headache': ['Tension', 'Dehydration', 'Stress', 'Eye strain'],
            'fever': ['Infection', 'Immune response', 'Inflammatory conditions'],
            'fatigue': ['Poor sleep', 'Stress', 'Nutritional deficiencies', 'Medical conditions']
        };
        
        return causes[condition?.toLowerCase()] || ['Various factors may contribute to symptoms'];
    }

    getCareMethods(condition) {
        const methods = {
            'common cold': ['Rest', 'Hydration', 'Symptom relief medications', 'Throat lozenges'],
            'headache': ['Rest', 'Hydration', 'Pain relievers', 'Stress management'],
            'fever': ['Rest', 'Fluids', 'Fever reducers', 'Cool compresses'],
            'fatigue': ['Adequate sleep', 'Balanced nutrition', 'Regular exercise', 'Stress management']
        };
        
        return methods[condition?.toLowerCase()] || ['Rest', 'Hydration', 'Appropriate self-care'];
    }

    getWhenToSeekCare(condition) {
        return 'Seek medical attention if symptoms worsen, persist beyond expected timeframe, or if you develop concerning new symptoms';
    }

    getPreventionTips(condition) {
        const tips = {
            'common cold': ['Frequent handwashing', 'Avoid close contact with sick individuals', 'Maintain good hygiene'],
            'headache': ['Stay hydrated', 'Manage stress', 'Regular sleep schedule', 'Limit screen time'],
            'fever': ['Good hygiene practices', 'Vaccination when appropriate', 'Healthy lifestyle'],
            'fatigue': ['Regular sleep schedule', 'Balanced diet', 'Regular exercise', 'Stress management']
        };
        
        return tips[condition?.toLowerCase()] || ['Maintain healthy lifestyle habits', 'Regular medical check-ups'];
    }

    // Identify risk factors
    identifyRiskFactors(symptoms, additionalInfo, medicalContext) {
        const riskFactors = [];
        
        // Age-based risks
        if (medicalContext.includes('age') && medicalContext.includes('65')) {
            riskFactors.push('Advanced age increases risk for complications');
        }
        
        // Chronic condition risks
        if (medicalContext.includes('diabetes')) {
            riskFactors.push('Diabetes may affect healing and infection risk');
        }
        
        if (medicalContext.includes('hypertension')) {
            riskFactors.push('High blood pressure requires monitoring during illness');
        }
        
        // Medication interactions
        if (medicalContext.includes('medications')) {
            riskFactors.push('Current medications may interact with treatments');
        }
        
        return riskFactors;
    }

    // Parse enhanced AI response
    parseEnhancedSymptomAnalysis(aiResponse) {
        try {
            // Try to parse structured response
            const lines = aiResponse.split('\n');
            const analysis = {
                possibleConditions: [],
                recommendations: [],
                urgency: 'low',
                reasoning: ''
            };
            
            // Extract possible conditions
            let inConditionsSection = false;
            let inRecommendationsSection = false;
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                
                if (trimmedLine.toLowerCase().includes('possible conditions') || 
                    trimmedLine.toLowerCase().includes('differential diagnosis')) {
                    inConditionsSection = true;
                    inRecommendationsSection = false;
                    continue;
                }
                
                if (trimmedLine.toLowerCase().includes('recommendations') || 
                    trimmedLine.toLowerCase().includes('treatment')) {
                    inConditionsSection = false;
                    inRecommendationsSection = true;
                    continue;
                }
                
                if (inConditionsSection && trimmedLine.startsWith('-')) {
                    const conditionText = trimmedLine.substring(1).trim();
                    analysis.possibleConditions.push({
                        name: conditionText,
                        confidence: 70 // Default confidence
                    });
                }
                
                if (inRecommendationsSection && trimmedLine.startsWith('-')) {
                    analysis.recommendations.push(trimmedLine.substring(1).trim());
                }
                
                if (trimmedLine.toLowerCase().includes('urgent') || 
                    trimmedLine.toLowerCase().includes('emergency')) {
                    analysis.urgency = 'high';
                }
            }
            
            analysis.reasoning = aiResponse.substring(0, 200) + '...';
            return analysis;
            
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return {
                possibleConditions: [{ name: 'General health concern', confidence: 50 }],
                recommendations: ['Monitor symptoms', 'Consult healthcare provider if needed'],
                urgency: 'low',
                reasoning: 'Unable to parse detailed analysis'
            };
        }
    }

    // ==================== HEALTH RECOMMENDATIONS ====================
    
    async getPersonalizedRecommendations(userId, focusArea = 'general') {
        try {
            // Gather user data
            const userProfile = await this.healthcareAPI.getUserProfile(userId);
            const medications = await this.healthcareAPI.getUserMedications(userId);
            const vitals = await this.healthcareAPI.getUserVitalSigns(userId, 10);
            const analytics = await this.healthcareAPI.getHealthAnalytics(userId);
            
            // Create personalized prompt
            const prompt = this.createRecommendationPrompt(
                userProfile, medications, vitals, analytics, focusArea
            );
            
            // Get AI recommendations
            const aiRecommendations = await this.callDeepSeekAPI([
                {
                    role: 'system',
                    content: this.getSystemPrompt('health_recommendations')
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]);
            
            // Parse and structure recommendations
            const recommendations = this.parseRecommendations(aiRecommendations);
            
            // Store recommendations
            await this.healthcareAPI.createAIInsight({
                user_id: userId,
                insight_type: 'recommendation',
                title: `Personalized Health Recommendations - ${focusArea}`,
                description: 'AI-generated personalized health recommendations',
                recommendation: recommendations.summary,
                severity: 'low',
                priority: 2,
                confidence_score: 0.8,
                status: 'new'
            });
            
            return recommendations;
            
        } catch (error) {
            console.error('❌ Failed to get recommendations:', error);
            return this.getFallbackRecommendations();
        }
    }

    createRecommendationPrompt(userProfile, medications, vitals, analytics, focusArea) {
        return `
Please provide personalized health recommendations for this patient:

FOCUS AREA: ${focusArea}

PATIENT PROFILE:
- Age: ${this.calculateAge(userProfile?.created_at)}
- BMI: ${this.calculateBMI(userProfile?.height_cm, userProfile?.weight_kg)}
- Blood Type: ${userProfile?.blood_type || 'Unknown'}

CURRENT MEDICATIONS:
${medications.map(med => `- ${med.name} (${med.dosage})`).join('\n') || 'None'}

VITAL SIGNS TRENDS:
${this.summarizeVitalsTrends(vitals)}

HEALTH ANALYTICS:
${this.summarizeAnalytics(analytics)}

Please provide:
1. Lifestyle recommendations
2. Dietary suggestions
3. Exercise recommendations
4. Preventive care suggestions
5. Medication optimization (if applicable)
6. Risk factors to monitor
7. Health goals to set

Tailor recommendations to the focus area: ${focusArea}
        `;
    }

    // ==================== DRUG INTERACTION CHECKING ====================
    
    async checkDrugInteractions(userId, newMedication) {
        try {
            const currentMedications = await this.healthcareAPI.getUserMedications(userId);
            
            if (currentMedications.length === 0) {
                return {
                    hasInteractions: false,
                    interactions: [],
                    recommendation: 'No current medications to check against'
                };
            }
            
            // Create drug interaction prompt
            const prompt = `
Check for drug interactions between the new medication and current medications:

NEW MEDICATION: ${newMedication}

CURRENT MEDICATIONS:
${currentMedications.map(med => `- ${med.name} (${med.dosage})`).join('\n')}

Please provide:
1. Any potential interactions
2. Severity level of interactions
3. Clinical significance
4. Recommendations for management
5. Monitoring requirements
            `;
            
            const aiResponse = await this.callDeepSeekAPI([
                {
                    role: 'system',
                    content: this.getSystemPrompt('drug_interactions')
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]);
            
            const interactionAnalysis = this.parseDrugInteractions(aiResponse);
            
            // Create alert if significant interactions found
            if (interactionAnalysis.hasInteractions) {
                await this.healthcareAPI.createNotification({
                    user_id: userId,
                    type: 'drug_interaction',
                    title: 'Potential Drug Interaction Detected',
                    content: `Potential interaction between ${newMedication} and current medications`
                });
            }
            
            return interactionAnalysis;
            
        } catch (error) {
            console.error('❌ Drug interaction check failed:', error);
            return {
                hasInteractions: false,
                interactions: [],
                recommendation: 'Unable to check interactions - consult pharmacist'
            };
        }
    }

    // ==================== HEALTH RISK ASSESSMENT ====================
    
    async assessHealthRisks(userId) {
        try {
            // Gather comprehensive health data
            const userProfile = await this.healthcareAPI.getUserProfile(userId);
            const vitals = await this.healthcareAPI.getUserVitalSigns(userId, 20);
            const medications = await this.healthcareAPI.getUserMedications(userId);
            const analytics = await this.healthcareAPI.getHealthAnalytics(userId);
            
            // Calculate risk factors
            const riskFactors = this.calculateRiskFactors(userProfile, vitals, medications);
            
            // Create risk assessment prompt
            const prompt = this.createRiskAssessmentPrompt(userProfile, vitals, riskFactors);
            
            // Get AI risk assessment
            const aiAssessment = await this.callDeepSeekAPI([
                {
                    role: 'system',
                    content: this.getSystemPrompt('risk_assessment')
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]);
            
            const riskAssessment = this.parseRiskAssessment(aiAssessment);
            
            // Store risk assessment
            await this.healthcareAPI.createAIInsight({
                user_id: userId,
                insight_type: 'risk_assessment',
                title: 'Health Risk Assessment',
                description: 'Comprehensive health risk analysis',
                recommendation: riskAssessment.summary,
                severity: riskAssessment.overallRisk === 'high' ? 'high' : riskAssessment.overallRisk === 'medium' ? 'medium' : 'low',
                priority: riskAssessment.overallRisk === 'high' ? 4 : riskAssessment.overallRisk === 'medium' ? 3 : 2,
                confidence_score: 0.85,
                status: 'new'
            });
            
            return riskAssessment;
            
        } catch (error) {
            console.error('❌ Health risk assessment failed:', error);
            return this.getFallbackRiskAssessment();
        }
    }

    calculateRiskFactors(userProfile, vitals, medications) {
        const risks = [];
        
        // BMI risk
        const bmi = this.calculateBMI(userProfile?.height_cm, userProfile?.weight_kg);
        if (bmi > 30) risks.push({ factor: 'obesity', level: 'high' });
        else if (bmi > 25) risks.push({ factor: 'overweight', level: 'medium' });
        
        // Blood pressure risk
        if (vitals.length > 0) {
            const avgSystolic = vitals.reduce((sum, v) => sum + (v.blood_pressure_systolic || 0), 0) / vitals.length;
            const avgDiastolic = vitals.reduce((sum, v) => sum + (v.blood_pressure_diastolic || 0), 0) / vitals.length;
            
            if (avgSystolic > 140 || avgDiastolic > 90) {
                risks.push({ factor: 'hypertension', level: 'high' });
            }
        }
        
        // Medication-related risks
        const highRiskMeds = medications.filter(med => 
            med.name.toLowerCase().includes('warfarin') ||
            med.name.toLowerCase().includes('insulin') ||
            med.name.toLowerCase().includes('digoxin')
        );
        
        if (highRiskMeds.length > 0) {
            risks.push({ factor: 'high_risk_medications', level: 'medium' });
        }
        
        return risks;
    }

    // ==================== CONVERSATIONAL AI ====================
    
    async chatWithAI(userId, message, conversationType = 'general') {
        try {
            // Get conversation history
            const history = this.getConversationHistory(userId);
            
            // Add user message to history
            history.push({ role: 'user', content: message });
            
            // Prepare context based on conversation type
            let systemPrompt = this.getSystemPrompt(conversationType);
            
            // Add relevant medical context if needed
            if (conversationType === 'medical') {
                const userProfile = await this.healthcareAPI.getUserProfile(userId);
                const medicalContext = this.prepareMedicalContext(
                    userProfile,
                    await this.healthcareAPI.getUserMedications(userId),
                    await this.healthcareAPI.getUserVitalSigns(userId, 3)
                );
                
                systemPrompt += `\n\nPatient Context:\n${medicalContext}`;
            }
            
            // Prepare messages for AI
            const messages = [
                { role: 'system', content: systemPrompt },
                ...history.slice(-this.maxContextLength)
            ];
            
            // Get AI response
            const aiResponse = await this.callDeepSeekAPI(messages);
            
            // Add AI response to history
            history.push({ role: 'assistant', content: aiResponse });
            
            // Update conversation history
            this.updateConversationHistory(userId, history);
            
            // Check if response contains medical advice that should be logged
            if (this.containsMedicalAdvice(aiResponse)) {
                await this.healthcareAPI.createAIInsight({
                    user_id: userId,
                    insight_type: 'recommendation',
                    title: 'AI Health Consultation',
                    description: `User query: ${message}`,
                    recommendation: aiResponse,
                    severity: 'medium',
                    priority: 2,
                    confidence_score: 0.75,
                    status: 'new'
                });
            }
            
            return {
                response: aiResponse,
                conversationType: conversationType,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ AI chat failed:', error);
            return {
                response: "I'm sorry, I'm having trouble processing your request right now. Please try again later or consult with a healthcare professional.",
                conversationType: conversationType,
                timestamp: new Date().toISOString(),
                error: true
            };
        }
    }

    // ==================== SYSTEM PROMPTS ====================
    
    getSystemPrompt(type) {
        const prompts = {
            symptom_analysis: `
You are a medical AI assistant specializing in symptom analysis. Provide careful, evidence-based assessments while emphasizing the importance of professional medical consultation. Always include appropriate disclaimers about not replacing professional medical advice.

Guidelines:
- Be thorough but not alarmist
- Provide differential diagnoses with confidence levels
- Emphasize when to seek immediate care
- Include self-care recommendations when appropriate
- Always recommend professional consultation for serious concerns
            `,
            
            health_recommendations: `
You are a health and wellness AI assistant providing personalized recommendations. Focus on evidence-based lifestyle, dietary, and wellness advice tailored to the individual's health profile.

Guidelines:
- Provide actionable, specific recommendations
- Consider the person's current health status and medications
- Emphasize preventive care
- Include both short-term and long-term goals
- Recommend professional consultation when needed
            `,
            
            drug_interactions: `
You are a pharmaceutical AI assistant specializing in drug interactions. Provide accurate information about potential medication interactions, their clinical significance, and management recommendations.

Guidelines:
- Classify interaction severity (minor, moderate, major)
- Explain the mechanism of interaction
- Provide management strategies
- Recommend monitoring parameters
- Emphasize consulting healthcare providers for medication changes
            `,
            
            risk_assessment: `
You are a medical AI assistant specializing in health risk assessment. Analyze patient data to identify potential health risks and provide evidence-based recommendations for risk mitigation.

Guidelines:
- Use established risk assessment tools and guidelines
- Provide quantitative risk estimates when possible
- Recommend appropriate screening and monitoring
- Focus on modifiable risk factors
- Emphasize preventive interventions
            `,
            
            general: `
You are a helpful AI health assistant. Provide accurate, helpful information about health and wellness topics while always emphasizing that you cannot replace professional medical advice.

Guidelines:
- Be supportive and empathetic
- Provide educational information
- Encourage healthy behaviors
- Recommend professional consultation for medical concerns
- Maintain appropriate boundaries
            `,
            
            medical: `
You are a medical AI assistant providing health information and guidance. You have access to the user's medical context and should provide personalized, relevant advice while maintaining appropriate medical disclaimers.

Guidelines:
- Consider the user's medical history and current conditions
- Provide evidence-based information
- Be specific and actionable in recommendations
- Always include appropriate medical disclaimers
- Encourage professional medical consultation when appropriate
            `
        };
        
        return prompts[type] || prompts.general;
    }

    // ==================== UTILITY METHODS ====================
    
    calculateAge(createdAt) {
        if (!createdAt) return 'Unknown';
        const birthYear = new Date(createdAt).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }

    calculateBMI(heightCm, weightKg) {
        if (!heightCm || !weightKg) return null;
        const heightM = heightCm / 100;
        return (weightKg / (heightM * heightM)).toFixed(1);
    }

    summarizeVitalsTrends(vitals) {
        if (!vitals || vitals.length === 0) return 'No recent vital signs data';
        
        const latest = vitals[0];
        return `Latest: BP ${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic}, HR ${latest.heart_rate}`;
    }

    summarizeAnalytics(analytics) {
        if (!analytics) return 'No analytics data available';
        
        return `Medication adherence trends, vital signs patterns, and appointment history available`;
    }

    getConversationHistory(userId) {
        if (!this.conversationHistory.has(userId)) {
            this.conversationHistory.set(userId, []);
        }
        return this.conversationHistory.get(userId);
    }

    updateConversationHistory(userId, history) {
        // Keep only recent messages to manage memory
        const trimmedHistory = history.slice(-this.maxContextLength);
        this.conversationHistory.set(userId, trimmedHistory);
    }

    containsMedicalAdvice(response) {
        const medicalKeywords = [
            'recommend', 'suggest', 'should', 'treatment', 'medication',
            'diagnosis', 'condition', 'symptoms', 'consult', 'doctor'
        ];
        
        const lowerResponse = response.toLowerCase();
        return medicalKeywords.some(keyword => lowerResponse.includes(keyword));
    }

    parseDrugInteractions(aiResponse) {
        // Simplified parser - in production, implement robust parsing
        return {
            hasInteractions: aiResponse.toLowerCase().includes('interaction'),
            interactions: [],
            recommendation: aiResponse
        };
    }

    parseRiskAssessment(aiResponse) {
        // Simplified parser - in production, implement robust parsing
        return {
            overallRisk: 'medium',
            riskFactors: [],
            recommendations: [],
            summary: aiResponse
        };
    }

    parseRecommendations(aiResponse) {
        // Simplified parser - in production, implement robust parsing
        return {
            lifestyle: [],
            dietary: [],
            exercise: [],
            preventive: [],
            summary: aiResponse
        };
    }

    getFallbackRecommendations() {
        return {
            lifestyle: ['Maintain regular sleep schedule', 'Manage stress levels'],
            dietary: ['Eat balanced meals', 'Stay hydrated'],
            exercise: ['Regular physical activity', 'Consult doctor before starting new exercise'],
            preventive: ['Regular check-ups', 'Stay up to date with vaccinations'],
            summary: 'General health recommendations - consult healthcare provider for personalized advice'
        };
    }

    getFallbackRiskAssessment() {
        return {
            overallRisk: 'unknown',
            riskFactors: [],
            recommendations: ['Consult healthcare provider for comprehensive risk assessment'],
            summary: 'Unable to assess risks - professional evaluation recommended'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIHealthAssistant;
} else if (typeof window !== 'undefined') {
    window.AIHealthAssistant = AIHealthAssistant;
}

console.log('🤖 AI Health Assistant module loaded successfully'); 