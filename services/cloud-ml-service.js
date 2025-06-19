/**
 * ☁️ Cloud-Based ML Service
 * Uses cloud APIs for machine learning without local dependencies
 */

const axios = require('axios');

class CloudMLService {
    constructor() {
        this.services = {
            openai: process.env.OPENAI_API_KEY,
            deepseek: process.env.DEEPSEEK_API_KEY,
            huggingface: process.env.HUGGINGFACE_API_KEY
        };
        
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
        
        console.log('☁️ Cloud ML Service initialized');
    }

    // ==================== HEALTH RISK PREDICTION ====================

    async predictHealthRisk(patientData) {
        try {
            const prompt = this.buildHealthRiskPrompt(patientData);
            
            const analysis = await this.callDeepSeekML(prompt, 'health-risk');
            
            return this.parseHealthRiskResponse(analysis, patientData);
            
        } catch (error) {
            console.error('❌ Health risk prediction error:', error);
            return this.getFallbackHealthRisk(patientData);
        }
    }

    buildHealthRiskPrompt(data) {
        return `
Analyze the following patient data and provide a comprehensive health risk assessment:

PATIENT DATA:
- Age: ${data.age}
- BMI: ${data.bmi}
- Blood Pressure: ${data.systolicBP}/${data.diastolicBP}
- Heart Rate: ${data.heartRate}
- Cholesterol: ${data.cholesterol}
- Glucose: ${data.glucose}
- Smoker: ${data.smoker ? 'Yes' : 'No'}
- Family History: ${data.familyHistory ? 'Yes' : 'No'}
- Exercise Hours/Week: ${data.exerciseHours}
- Stress Level (1-10): ${data.stressLevel}
- Sleep Hours: ${data.sleepHours}
- Current Medications: ${data.medicationCount}
- Chronic Conditions: ${data.chronicConditions}

Please provide a JSON response with the following structure:
{
  "riskLevel": "low|medium|high",
  "riskScore": 0.0-1.0,
  "confidence": 0.0-1.0,
  "factors": ["array of risk factors"],
  "recommendations": ["array of recommendations"],
  "urgency": "routine|within_week|immediate",
  "insights": [{"category": "string", "insight": "string", "impact": "low|medium|high"}]
}

Base your assessment on medical guidelines and evidence-based risk factors.
`;
    }

    async callDeepSeekML(prompt, type) {
        try {
            const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a medical AI assistant specializing in predictive health analytics. Always respond with valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 2000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.services.deepseek}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
            
        } catch (error) {
            console.error('❌ DeepSeek API error:', error);
            throw error;
        }
    }

    parseHealthRiskResponse(response, patientData) {
        try {
            const parsed = JSON.parse(response);
            
            return {
                ...parsed,
                timestamp: new Date().toISOString(),
                modelVersion: 'cloud-deepseek-v1',
                patientId: patientData.id || 'anonymous'
            };
            
        } catch (error) {
            console.error('❌ Response parsing error:', error);
            return this.getFallbackHealthRisk(patientData);
        }
    }

    // ==================== MEDICATION ADHERENCE PREDICTION ====================

    async predictMedicationAdherence(patientData) {
        try {
            const prompt = this.buildAdherencePrompt(patientData);
            const analysis = await this.callDeepSeekML(prompt, 'medication-adherence');
            
            return this.parseAdherenceResponse(analysis, patientData);
            
        } catch (error) {
            console.error('❌ Medication adherence prediction error:', error);
            return this.getFallbackAdherence(patientData);
        }
    }

    buildAdherencePrompt(data) {
        return `
Predict medication adherence for this patient:

PATIENT PROFILE:
- Age: ${data.age}
- Number of medications: ${data.medicationCount}
- Medication complexity (1-10): ${data.medicationComplexity || 5}
- Daily doses: ${data.dailyDoses || 2}
- Cognitive score (0-100): ${data.cognitiveScore || 80}
- Support system: ${data.supportSystem ? 'Yes' : 'No'}
- Financial status (1-10): ${data.financialStatus || 5}
- Health literacy (0-100): ${data.healthLiteracy || 70}
- Previous adherence rate: ${data.previousAdherence || 0.8}
- Side effects concern (1-10): ${data.sideEffectsConcern || 3}

Provide JSON response:
{
  "adherenceProbability": 0.0-1.0,
  "riskLevel": "low|medium|high",
  "factors": ["factors affecting adherence"],
  "interventions": ["recommended interventions"],
  "monitoring": ["monitoring strategies"],
  "confidence": 0.0-1.0,
  "personalizedStrategies": ["patient-specific strategies"]
}
`;
    }

    parseAdherenceResponse(response, patientData) {
        try {
            const parsed = JSON.parse(response);
            return {
                ...parsed,
                timestamp: new Date().toISOString(),
                modelVersion: 'cloud-adherence-v1'
            };
        } catch (error) {
            return this.getFallbackAdherence(patientData);
        }
    }

    // ==================== DISEASE PROGRESSION PREDICTION ====================

    async predictDiseaseProgression(patientHistory) {
        try {
            const prompt = this.buildProgressionPrompt(patientHistory);
            const analysis = await this.callDeepSeekML(prompt, 'disease-progression');
            
            return this.parseProgressionResponse(analysis);
            
        } catch (error) {
            console.error('❌ Disease progression prediction error:', error);
            return this.getFallbackProgression();
        }
    }

    buildProgressionPrompt(history) {
        const recentData = history.slice(-30); // Last 30 days
        
        return `
Analyze disease progression based on patient history:

RECENT HEALTH DATA (last 30 days):
${recentData.map((day, index) => `
Day ${index + 1}:
- Symptom severity: ${day.symptomSeverity || 0}/10
- Medication adherence: ${(day.medicationAdherence || 1) * 100}%
- Activity level: ${(day.activityLevel || 0.5) * 100}%
- Sleep quality: ${(day.sleepQuality || 0.7) * 100}%
- Stress level: ${(day.stressLevel || 0.3) * 100}%
`).join('\n')}

Provide JSON response:
{
  "progressionScore": 0.0-1.0,
  "trend": "stable|stable_with_concern|progressing|rapidly_progressing",
  "riskLevel": "low|medium|high",
  "timeframe": "estimated timeframe",
  "interventions": ["recommended interventions"],
  "monitoring": ["monitoring recommendations"],
  "confidence": 0.0-1.0
}
`;
    }

    parseProgressionResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                ...parsed,
                timestamp: new Date().toISOString(),
                modelVersion: 'cloud-progression-v1'
            };
        } catch (error) {
            return this.getFallbackProgression();
        }
    }

    // ==================== COMPREHENSIVE ANALYSIS ====================

    async generateComprehensiveAnalysis(patientData) {
        try {
            // Run multiple analyses in parallel
            const [healthRisk, adherence, treatmentOutcome] = await Promise.all([
                this.predictHealthRisk(patientData),
                this.predictMedicationAdherence(patientData),
                patientData.currentTreatment ? this.predictTreatmentOutcome(patientData) : null
            ]);

            const overallAssessment = this.calculateOverallAssessment(healthRisk, adherence, treatmentOutcome);
            
            return {
                success: true,
                analysis: {
                    healthRisk,
                    medicationAdherence: adherence,
                    treatmentOutcome,
                    overallAssessment,
                    prioritizedActions: this.generatePrioritizedActions(healthRisk, adherence, treatmentOutcome)
                },
                generatedAt: new Date().toISOString(),
                service: 'cloud-ml'
            };
            
        } catch (error) {
            console.error('❌ Comprehensive analysis error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    async predictTreatmentOutcome(patientData) {
        const prompt = `
Predict treatment outcome for patient:

PATIENT DATA:
- Age: ${patientData.age}
- Overall health: ${patientData.overallHealth || 'fair'}
- Comorbidities: ${patientData.chronicConditions}
- Treatment: ${patientData.currentTreatment?.name || 'standard care'}
- Complexity: ${patientData.currentTreatment?.complexity || 5}/10
- Previous treatments: ${patientData.previousTreatments || 0}

Provide JSON:
{
  "successProbability": 0.0-1.0,
  "expectedOutcome": "poor|fair|good|excellent",
  "confidenceLevel": 0.0-1.0,
  "riskFactors": ["array of risk factors"],
  "optimizationSuggestions": ["suggestions"],
  "timeline": "expected timeline"
}
`;

        try {
            const response = await this.callDeepSeekML(prompt, 'treatment-outcome');
            return JSON.parse(response);
        } catch (error) {
            return {
                successProbability: 0.7,
                expectedOutcome: 'good',
                confidenceLevel: 0.6,
                riskFactors: ['Standard treatment risks'],
                optimizationSuggestions: ['Follow treatment plan'],
                timeline: 'Standard timeline'
            };
        }
    }

    calculateOverallAssessment(healthRisk, adherence, treatmentOutcome) {
        let overallScore = 0;
        let factors = 0;

        if (healthRisk) {
            overallScore += healthRisk.riskScore * 0.4;
            factors++;
        }

        if (adherence) {
            overallScore += (1 - adherence.adherenceProbability) * 0.3;
            factors++;
        }

        if (treatmentOutcome) {
            overallScore += (1 - treatmentOutcome.successProbability) * 0.3;
            factors++;
        }

        const finalScore = factors > 0 ? overallScore / factors : 0;

        return {
            overallRiskScore: finalScore,
            riskLevel: finalScore > 0.6 ? 'high' : finalScore > 0.3 ? 'medium' : 'low',
            priority: finalScore > 0.7 ? 'urgent' : finalScore > 0.4 ? 'high' : 'medium',
            keyFindings: this.extractKeyFindings(healthRisk, adherence, treatmentOutcome)
        };
    }

    extractKeyFindings(healthRisk, adherence, treatmentOutcome) {
        const findings = [];
        
        if (healthRisk) {
            findings.push(`Health risk: ${healthRisk.riskLevel}`);
        }
        
        if (adherence) {
            findings.push(`Medication adherence: ${(adherence.adherenceProbability * 100).toFixed(0)}%`);
        }
        
        if (treatmentOutcome) {
            findings.push(`Treatment success rate: ${(treatmentOutcome.successProbability * 100).toFixed(0)}%`);
        }
        
        return findings;
    }

    generatePrioritizedActions(healthRisk, adherence, treatmentOutcome) {
        const actions = [];

        if (healthRisk?.riskLevel === 'high') {
            actions.push({
                priority: 'high',
                action: 'Schedule immediate healthcare consultation',
                category: 'health_risk',
                timeframe: 'immediate'
            });
        }

        if (adherence?.riskLevel === 'high') {
            actions.push({
                priority: 'medium',
                action: 'Implement medication adherence support',
                category: 'medication',
                timeframe: 'within_week'
            });
        }

        return actions.sort((a, b) => {
            const priorities = { high: 3, medium: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
    }

    // ==================== FALLBACK METHODS ====================

    getFallbackHealthRisk(patientData) {
        let risk = 0;
        if (patientData.age > 65) risk += 0.2;
        if (patientData.bmi > 30) risk += 0.2;
        if (patientData.smoker) risk += 0.3;
        
        return {
            riskLevel: risk > 0.5 ? 'high' : risk > 0.2 ? 'medium' : 'low',
            riskScore: risk,
            confidence: 0.6,
            factors: ['Age', 'BMI', 'Lifestyle factors'],
            recommendations: ['Regular checkups', 'Lifestyle modifications'],
            urgency: 'routine',
            fallback: true
        };
    }

    getFallbackAdherence(patientData) {
        let adherence = 0.8;
        if (patientData.medicationCount > 5) adherence -= 0.2;
        if (patientData.age > 75) adherence -= 0.1;
        
        return {
            adherenceProbability: Math.max(0.3, adherence),
            riskLevel: adherence < 0.6 ? 'high' : 'medium',
            factors: ['Medication complexity'],
            interventions: ['Medication reminders'],
            monitoring: ['Weekly check-ins'],
            confidence: 0.6,
            fallback: true
        };
    }

    getFallbackProgression() {
        return {
            progressionScore: 0.3,
            trend: 'stable',
            riskLevel: 'medium',
            timeframe: '6-12 months',
            interventions: ['Continue current care'],
            monitoring: ['Monthly assessments'],
            confidence: 0.5,
            fallback: true
        };
    }

    // ==================== ANALYTICS FEATURES ====================

    async generatePopulationHealthInsights(populationData) {
        const prompt = `
Analyze population health data:

POPULATION METRICS:
- Total patients: ${populationData.length}
- Average age: ${this.calculateAverage(populationData, 'age')}
- High-risk patients: ${populationData.filter(p => p.riskLevel === 'high').length}
- Common conditions: ${this.getMostCommon(populationData, 'conditions')}

Provide insights in JSON:
{
  "trends": ["key trends"],
  "riskFactors": ["common risk factors"],
  "recommendations": ["population-level recommendations"],
  "alerts": ["any concerning patterns"]
}
`;

        try {
            const response = await this.callDeepSeekML(prompt, 'population-health');
            return JSON.parse(response);
        } catch (error) {
            return {
                trends: ['Standard population trends'],
                riskFactors: ['Age', 'Lifestyle factors'],
                recommendations: ['Preventive care', 'Health education'],
                alerts: [],
                fallback: true
            };
        }
    }

    calculateAverage(data, field) {
        const values = data.filter(item => item[field]).map(item => item[field]);
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    getMostCommon(data, field) {
        const counts = {};
        data.forEach(item => {
            if (item[field]) {
                item[field].forEach(value => {
                    counts[value] = (counts[value] || 0) + 1;
                });
            }
        });
        
        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([condition]) => condition);
    }

    // ==================== SERVICE HEALTH ====================

    getServiceHealth() {
        return {
            status: 'healthy',
            service: 'cloud-ml',
            apis: {
                deepseek: !!this.services.deepseek,
                openai: !!this.services.openai,
                huggingface: !!this.services.huggingface
            },
            cacheSize: this.cache.size,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = CloudMLService; 