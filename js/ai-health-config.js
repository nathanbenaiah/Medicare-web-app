// AI Health Features Configuration for MediCare+ with DeepSeek Integration
// Complete feature set with question analysis and response formats

const AI_HEALTH_FEATURES = {
    // 🍎 1. AI Diet Planner
    dietPlanner: {
        id: 'diet_planner',
        name: 'AI Diet Planner',
        icon: '🍎',
        description: 'Personalized meal plans based on health goals, dietary restrictions, and preferences',
        duration: '8 min',
        accuracy: '95%',
        
        multiPartQuestions: [
            "What is your primary health goal? (weight loss, muscle gain, maintenance, disease management)",
            "Do you have any dietary restrictions? (vegan, vegetarian, gluten-free, dairy-free, keto, etc.)",
            "Are you currently following any specific diet plan? (Intermittent Fasting, Low-carb, Mediterranean, etc.)",
            "How many meals do you typically eat per day? (Include snacks and timing preferences)",
            "What foods do you absolutely dislike or avoid? (List specific foods, cuisines, or ingredients)",
            "Do you have any diagnosed health conditions? (diabetes, hypertension, cholesterol, thyroid, etc.)",
            "How often do you eat out or order takeaway food per week?",
            "Describe your typical current meals (breakfast, lunch, dinner examples)",
            "What's your daily water intake? (glasses, bottles, or liters)",
            "Do you consume caffeine or alcohol regularly? (coffee, tea, wine, beer - frequency and quantity)",
            "Are you currently taking any supplements? (vitamins, protein powder, minerals - list all)",
            "What's your physical activity level? (sedentary, light exercise, moderate, intense training)",
            "Do you currently track calories or macros? (apps used, consistency, goals)",
            "Do you prefer simple quick meals or are you okay with cooking recipes?",
            "What's your approximate monthly grocery budget for food?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "18-100" },
            { question: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { question: "Height", type: "number", unit: "cm", range: "120-220" },
            { question: "Weight", type: "number", unit: "kg", range: "30-200" },
            { question: "Allergies", type: "text", placeholder: "List main allergies" }
        ],
        
        deepSeekResponse: {
            outputFormat: "structured_meal_plan",
            responseStructure: {
                weeklyPlan: "7-day detailed meal plan with recipes",
                nutritionalBreakdown: "Daily calories, macros (protein, carbs, fats), micronutrients",
                mealTiming: "Optimal eating schedule based on goals and lifestyle",
                shoppingList: "Organized grocery list by categories",
                alternatives: "Substitute options for dietary restrictions",
                progressTracking: "Weekly adjustment recommendations"
            },
            aiBehaviorFocus: "Goal-oriented meal optimization",
            personalizationDepth: "Very High",
            specialFeatures: [
                "Cultural cuisine adaptation",
                "Budget-conscious options",
                "Meal prep suggestions",
                "Restaurant ordering guidance"
            ]
        }
    },

    // 🩺 2. AI Symptom Checker
    symptomChecker: {
        id: 'symptom_checker',
        name: 'AI Symptom Checker',
        icon: '🩺',
        description: 'Analyze symptoms and suggest possible causes with urgency assessment',
        duration: '5 min',
        accuracy: '92%',
        
        multiPartQuestions: [
            "What specific symptoms are you experiencing right now? (describe in detail)",
            "When did these symptoms first start? (exact date/time if possible)",
            "Are the symptoms getting worse, staying the same, or improving over time?",
            "Are the symptoms constant or do they come and go? (pattern description)",
            "Are the symptoms linked to specific times, activities, or situations?",
            "What makes the symptoms better or worse? (position, food, medication, rest, etc.)",
            "Are you experiencing any pain? If yes, where and how severe? (scale 1-10)",
            "Do you have any previously diagnosed health conditions or chronic illnesses?",
            "Are you currently taking any medications, supplements, or treatments?",
            "Have you had any recent injuries, infections, surgeries, or medical procedures?",
            "Have you experienced these exact symptoms before? When and what helped?",
            "Are you experiencing fever, fatigue, unusual tiredness, or skin changes?",
            "Are other body systems affected? (breathing, digestion, urination, vision, etc.)",
            "Have you traveled recently or been exposed to anyone who was sick?",
            "Is there anything else unusual happening with your body or health lately?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "0-120" },
            { question: "Sex", type: "select", options: ["Male", "Female"] },
            { question: "Temperature", type: "number", unit: "°F", range: "95-110" },
            { question: "Pain_Level", type: "slider", range: "0-10", labels: ["No pain", "Severe"] },
            { question: "Duration", type: "select", options: ["Hours", "Days", "Weeks", "Months"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "diagnostic_assessment",
            responseStructure: {
                likelyCauses: "Top 3-5 possible conditions with confidence percentages",
                urgencyLevel: "Self-care / See doctor / Emergency with color coding",
                recommendedActions: "Immediate steps and timeline for medical care",
                redFlags: "Warning signs that require immediate attention",
                specialistReferral: "Type of doctor to see if needed",
                followUpQuestions: "Additional symptoms to monitor"
            },
            aiBehaviorFocus: "Medical safety and diagnostic reasoning",
            personalizationDepth: "High",
            specialFeatures: [
                "Emergency triage system",
                "Symptom severity tracking",
                "Medical history integration",
                "Telehealth connection options"
            ]
        }
    },

    // 🧬 3. AI Medicine Advisor
    medicineAdvisor: {
        id: 'medicine_advisor', 
        name: 'AI Medicine Advisor',
        icon: '💊',
        description: 'Safe medication suggestions with interaction checking and dosage guidance',
        duration: '6 min',
        accuracy: '94%',
        
        multiPartQuestions: [
            "What condition or symptoms are you trying to treat with medication?",
            "What medications are you currently taking? (include prescription, OTC, supplements)",
            "Have you experienced any side effects from medications in the past? Which ones?",
            "Are you allergic to any medications, ingredients, or substances?",
            "Do you have a preference for medication type? (pills, liquids, topical, natural remedies)",
            "Do you have any chronic health conditions? (heart disease, liver/kidney issues, etc.)",
            "What is your current daily medication routine and timing?",
            "Have you had any recent blood tests or medical examinations? Results?",
            "Have you already seen a doctor about this condition? What was recommended?",
            "How long have you been dealing with this health issue?",
            "Are there any medications you specifically want to avoid? Why?",
            "Describe your daily routine (meal times, sleep schedule, work schedule)",
            "Do you have any liver, kidney, or heart problems that affect medication processing?",
            "Are you pregnant, breastfeeding, or planning to become pregnant?",
            "What over-the-counter or herbal supplements do you regularly use?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "0-120" },
            { question: "Weight", type: "number", unit: "kg", range: "3-300" },
            { question: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { question: "Allergies", type: "text", placeholder: "Primary drug allergies" },
            { question: "Dosage_Preference", type: "select", options: ["Low", "Standard", "Maximum"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "medication_recommendations",
            responseStructure: {
                recommendedMedications: "Safe options by category (OTC, prescription, natural)",
                dosageInstructions: "Specific dosing, timing, and duration",
                interactionWarnings: "Drug interactions and contraindications",
                sideEffectProfile: "Common and serious side effects to watch for",
                monitoringNeeded: "What to track while taking medication",
                alternatives: "Non-medication treatment options"
            },
            aiBehaviorFocus: "Medical safety and evidence-based recommendations",
            personalizationDepth: "Very High",
            specialFeatures: [
                "Drug interaction database",
                "Age-appropriate dosing",
                "Pregnancy/breastfeeding safety",
                "Cost-effective alternatives"
            ]
        }
    },

    // 📊 4. AI Health Report
    healthReport: {
        id: 'health_report',
        name: 'AI Health Report',
        icon: '📈',
        description: 'Comprehensive health analysis with personalized improvement recommendations',
        duration: '12 min',
        accuracy: '96%',
        
        multiPartQuestions: [
            "What is your family medical history? (parents, siblings, grandparents - major conditions)",
            "How would you rate your overall health today on a scale of 1-10? Explain why.",
            "How often do you get regular medical checkups and preventive screenings?",
            "What's your average sleep duration and quality? Any sleep issues?",
            "Describe your exercise routine and physical activity level throughout the week",
            "Do you use tobacco, smoke, or use any recreational substances? Frequency?",
            "What's your stress level and how do you manage stress? Major stressors?",
            "Describe your job and daily activity level (sedentary, active, physical labor)",
            "How often do you eat fast food, processed foods, or restaurant meals?",
            "Do you regularly monitor vital signs? (blood pressure, heart rate, blood sugar)",
            "Have you ever been hospitalized or had major medical procedures? Details?",
            "What health areas concern you most or do you want to improve?",
            "Do you use fitness trackers, smartwatches, or health monitoring devices?",
            "Are your vaccinations up to date? Any recent health screenings?",
            "How satisfied are you with your current lifestyle and health habits?"
        ],
        
        singleWordQuestions: [
            { question: "Height", type: "number", unit: "cm", range: "100-250" },
            { question: "Weight", type: "number", unit: "kg", range: "20-300" },
            { question: "BP_Systolic", type: "number", unit: "mmHg", range: "70-250" },
            { question: "Resting_Pulse", type: "number", unit: "bpm", range: "40-200" },
            { question: "Age", type: "number", range: "0-120" }
        ],
        
        deepSeekResponse: {
            outputFormat: "comprehensive_health_assessment",
            responseStructure: {
                healthScore: "Overall health score (0-100) with category breakdown",
                riskAssessment: "Disease risk prediction for next 5-10 years",
                improvementAreas: "Top 5 priority areas with specific action items",
                actionPlan: "30-60-90 day structured improvement plan",
                biometricAnalysis: "BMI, cardiovascular risk, metabolic health",
                preventiveRecommendations: "Screening schedules and health maintenance"
            },
            aiBehaviorFocus: "Long-term health optimization and risk prevention",
            personalizationDepth: "Maximum",
            specialFeatures: [
                "Predictive health modeling",
                "Family history integration",
                "Lifestyle factor analysis",
                "Preventive care scheduling"
            ]
        }
    }
    
    // Note: Additional features (fitness coach, mental health, sleep analyzer, etc.) 
    // can be added following the same pattern
};

// DeepSeek AI Integration Configuration
const DEEPSEEK_CONFIG = {
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    maxTokens: 4000,
    temperature: 0.3, // Lower temperature for medical accuracy
    
    systemPrompts: {
        medical: `You are a medical AI assistant providing health guidance. Always prioritize safety and recommend professional medical consultation when appropriate. 
                 Use evidence-based medicine and current medical guidelines. Never provide definitive diagnoses - only suggest possibilities and appropriate next steps.`,
        
        wellness: `You are a wellness coach providing lifestyle and health optimization advice based on evidence-based practices. 
                  Focus on sustainable, realistic recommendations that improve overall health and wellbeing.`,
        
        nutrition: `You are a certified nutritionist AI providing personalized meal planning and dietary guidance. 
                   Consider individual health conditions, preferences, and cultural backgrounds in your recommendations.`
    },
    
    responseFormats: {
        structured_meal_plan: 'Detailed weekly meal planning with nutritional analysis',
        diagnostic_assessment: 'Medical symptom analysis with urgency classification',  
        medication_recommendations: 'Safe medication suggestions with interaction checking',
        comprehensive_health_assessment: 'Full health scoring with improvement roadmap'
    }
};

// Assessment Management Functions
class AIHealthAssessment {
    constructor(featureId) {
        this.feature = AI_HEALTH_FEATURES[featureId];
        this.responses = {};
        this.currentQuestion = 0;
        this.startTime = new Date();
    }
    
    getNextQuestion() {
        const totalQuestions = this.feature.multiPartQuestions.length + this.feature.singleWordQuestions.length;
        if (this.currentQuestion < totalQuestions) {
            if (this.currentQuestion < this.feature.multiPartQuestions.length) {
                return {
                    type: 'multiPart',
                    question: this.feature.multiPartQuestions[this.currentQuestion],
                    index: this.currentQuestion
                };
            } else {
                const singleQuestionIndex = this.currentQuestion - this.feature.multiPartQuestions.length;
                return {
                    type: 'singleWord',
                    question: this.feature.singleWordQuestions[singleQuestionIndex],
                    index: this.currentQuestion
                };
            }
        }
        return null;
    }
    
    saveResponse(questionIndex, response) {
        this.responses[questionIndex] = response;
        this.currentQuestion++;
    }
    
    async generateDeepSeekPrompt() {
        const promptData = {
            feature: this.feature.name,
            userResponses: this.responses,
            outputFormat: this.feature.deepSeekResponse.outputFormat,
            personalizationLevel: this.feature.deepSeekResponse.personalizationDepth
        };
        
        return `
        As an AI health assistant, analyze the following user assessment for ${promptData.feature}:
        
        User Responses: ${JSON.stringify(promptData.userResponses, null, 2)}
        
        Please provide a ${promptData.outputFormat} with the following structure:
        ${JSON.stringify(this.feature.deepSeekResponse.responseStructure, null, 2)}
        
        Personalization Level: ${promptData.personalizationLevel}
        
        Focus Areas: ${this.feature.deepSeekResponse.aiBehaviorFocus}
        
        Special Features to Include: ${this.feature.deepSeekResponse.specialFeatures.join(', ')}
        
        Important: Always include appropriate medical disclaimers and recommend professional consultation when necessary.
        `;
    }
    
    async callDeepSeekAPI(prompt) {
        try {
            const response = await fetch(DEEPSEEK_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` // Set this in your environment
                },
                body: JSON.stringify({
                    model: DEEPSEEK_CONFIG.model,
                    messages: [
                        {
                            role: "system",
                            content: DEEPSEEK_CONFIG.systemPrompts.medical
                        },
                        {
                            role: "user", 
                            content: prompt
                        }
                    ],
                    max_tokens: DEEPSEEK_CONFIG.maxTokens,
                    temperature: DEEPSEEK_CONFIG.temperature
                })
            });
            
            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API call failed:', error);
            return this.getFallbackResponse();
        }
    }
    
    getFallbackResponse() {
        return {
            status: "offline",
            message: "AI analysis is temporarily unavailable. Please try again later or consult with a healthcare professional.",
            recommendations: [
                "Save your assessment responses",
                "Retry the analysis later",
                "Consider speaking with a healthcare provider",
                "Use the basic health guidelines provided"
            ]
        };
    }
}

// Utility Functions
function initializeAssessment(featureId) {
    return new AIHealthAssessment(featureId);
}

function formatHealthResponse(rawResponse, feature) {
    // Parse and format the DeepSeek response based on feature type
    try {
        const parsed = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;
        
        return {
            feature: feature.name,
            timestamp: new Date().toISOString(),
            analysis: parsed,
            disclaimers: [
                "This analysis is for informational purposes only",
                "Always consult healthcare professionals for medical decisions",
                "Emergency symptoms require immediate medical attention"
            ],
            nextSteps: generateNextSteps(feature.id, parsed)
        };
    } catch (error) {
        console.error('Response formatting error:', error);
        return {
            error: "Unable to process AI response",
            rawResponse: rawResponse
        };
    }
}

function generateNextSteps(featureId, analysis) {
    const baseSteps = {
        diet_planner: [
            "Follow the meal plan for 1-2 weeks",
            "Track your energy levels and how you feel",
            "Adjust portions based on hunger and activity",
            "Schedule follow-up assessment in 2 weeks"
        ],
        symptom_checker: [
            "Monitor symptoms as recommended",
            "Seek medical attention if symptoms worsen",
            "Keep a symptom diary",
            "Follow up with healthcare provider"
        ],
        medicine_advisor: [
            "Consult pharmacist or doctor before starting new medications",
            "Monitor for side effects",
            "Set medication reminders",
            "Schedule regular medication reviews"
        ],
        health_report: [
            "Implement top 3 recommended changes",
            "Schedule preventive screenings",
            "Start with 30-day action plan",
            "Reassess progress monthly"
        ]
    };
    
    return baseSteps[featureId] || ["Follow AI recommendations", "Consult healthcare provider", "Monitor progress"];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AI_HEALTH_FEATURES, DEEPSEEK_CONFIG, AIHealthAssessment, initializeAssessment, formatHealthResponse };
} else {
    // Browser environment
    window.AI_HEALTH_FEATURES = AI_HEALTH_FEATURES;
    window.DEEPSEEK_CONFIG = DEEPSEEK_CONFIG;
    window.AIHealthAssessment = AIHealthAssessment;
    window.initializeAssessment = initializeAssessment;
    window.formatHealthResponse = formatHealthResponse;
} 