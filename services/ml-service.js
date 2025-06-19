/**
 * 🤖 Medicare AI Machine Learning Service
 * Advanced ML and Predictive Analytics Integration
 * 
 * Features:
 * - Health Risk Prediction
 * - Disease Progression Modeling
 * - Personalized Treatment Recommendations
 * - Medication Adherence Prediction
 * - Health Trend Analysis
 * - Anomaly Detection in Vital Signs
 */

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

class MLService {
    constructor() {
        // Initialize Supabase client
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        this.models = {
            healthRisk: null,
            medicationAdherence: null,
            vitalSignsAnomaly: null,
            diseaseProgression: null,
            treatmentOutcome: null
        };
        
        this.modelPaths = {
            healthRisk: './models/health-risk-model.json',
            medicationAdherence: './models/medication-adherence-model.json',
            vitalSignsAnomaly: './models/vitals-anomaly-model.json',
            diseaseProgression: './models/disease-progression-model.json',
            treatmentOutcome: './models/treatment-outcome-model.json'
        };
        
        this.isInitialized = false;
        this.trainingData = [];
        this.predictionCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        console.log('🤖 ML Service initialized');
        this.initializeModels();
    }

    // ==================== MODEL INITIALIZATION ====================
    
    async initializeModels() {
        try {
            console.log('🔄 Loading ML models...');
            
            // Create models directory if it doesn't exist
            await this.ensureDirectoryExists('./models');
            
            // Load pre-trained models or create new ones
            await this.loadOrCreateModels();
            
            this.isInitialized = true;
            console.log('✅ ML models initialized successfully');
            
        } catch (error) {
            console.error('❌ ML initialization error:', error);
            // Initialize with basic models
            await this.createBasicModels();
        }
    }

    async loadOrCreateModels() {
        for (const [modelName, modelPath] of Object.entries(this.modelPaths)) {
            try {
                // Try to load existing model
                const modelExists = await this.fileExists(modelPath);
                
                if (modelExists) {
                    this.models[modelName] = await tf.loadLayersModel(`file://${modelPath}`);
                    console.log(`✅ Loaded ${modelName} model`);
                } else {
                    // Create new model
                    this.models[modelName] = await this.createModel(modelName);
                    console.log(`🆕 Created new ${modelName} model`);
                }
                
            } catch (error) {
                console.warn(`⚠️ Error with ${modelName} model:`, error.message);
                this.models[modelName] = await this.createModel(modelName);
            }
        }
    }

    async createBasicModels() {
        for (const modelName of Object.keys(this.models)) {
            this.models[modelName] = await this.createModel(modelName);
        }
        this.isInitialized = true;
        console.log('✅ Basic ML models created');
    }

    // ==================== MODEL CREATION ====================
    
    async createModel(modelType) {
        switch (modelType) {
            case 'healthRisk':
                return this.createHealthRiskModel();
            case 'medicationAdherence':
                return this.createMedicationAdherenceModel();
            case 'vitalSignsAnomaly':
                return this.createVitalSignsAnomalyModel();
            case 'diseaseProgression':
                return this.createDiseaseProgressionModel();
            case 'treatmentOutcome':
                return this.createTreatmentOutcomeModel();
            default:
                return this.createGenericModel();
        }
    }

    createHealthRiskModel() {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [15], // Age, BMI, BP, cholesterol, etc.
                    units: 64,
                    activation: 'relu',
                    kernelInitializer: 'glorotUniform',
                    name: 'input_layer'
                }),
                tf.layers.dropout({ rate: 0.3 }),
                tf.layers.dense({
                    units: 32,
                    activation: 'relu',
                    name: 'hidden_layer_1'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 16,
                    activation: 'relu',
                    name: 'hidden_layer_2'
                }),
                tf.layers.dense({
                    units: 3, // Low, Medium, High risk
                    activation: 'softmax',
                    name: 'output_layer'
                })
            ]
        });

        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    createMedicationAdherenceModel() {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [10], // Age, medication count, complexity, etc.
                    units: 32,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 16,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid' // Probability of adherence
                })
            ]
        });

        model.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    createVitalSignsAnomalyModel() {
        // Autoencoder for anomaly detection
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [8], // BP, HR, temp, etc.
                    units: 16,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 8,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 4,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 8,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 8, // Reconstruct input
                    activation: 'linear'
                })
            ]
        });

        model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError'
        });

        return model;
    }

    createDiseaseProgressionModel() {
        // LSTM for time series prediction
        const model = tf.sequential({
            layers: [
                tf.layers.lstm({
                    inputShape: [30, 5], // 30 days, 5 features
                    units: 50,
                    returnSequences: true
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.lstm({
                    units: 25,
                    returnSequences: false
                }),
                tf.layers.dense({
                    units: 10,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 1,
                    activation: 'linear' // Progression score
                })
            ]
        });

        model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError',
            metrics: ['mae']
        });

        return model;
    }

    createTreatmentOutcomeModel() {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [12], // Treatment and patient features
                    units: 48,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.3 }),
                tf.layers.dense({
                    units: 24,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 12,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid' // Success probability
                })
            ]
        });

        model.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    createGenericModel() {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [10],
                    units: 20,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 10,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid'
                })
            ]
        });

        model.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    // ==================== PREDICTIVE ANALYTICS ====================
    
    async predictHealthRisk(patientData) {
        if (!this.isInitialized || !this.models.healthRisk) {
            throw new Error('Health risk model not initialized');
        }

        try {
            // Check cache first
            const cacheKey = `healthRisk_${JSON.stringify(patientData)}`;
            const cached = this.getCachedPrediction(cacheKey);
            if (cached) return cached;

            // Preprocess patient data
            const features = this.preprocessHealthData(patientData);
            
            // Make prediction
            const prediction = this.models.healthRisk.predict(features);
            const riskScores = await prediction.data();
            
            // Interpret results
            const riskAssessment = this.interpretRiskPrediction(riskScores);
            
            // Add additional insights
            riskAssessment.insights = await this.generateHealthInsights(patientData, riskAssessment);
            riskAssessment.trends = this.analyzeHealthTrends(patientData);
            
            // Cleanup tensors
            prediction.dispose();
            features.dispose();
            
            // Cache result
            this.setCachedPrediction(cacheKey, riskAssessment);
            
            return {
                ...riskAssessment,
                modelVersion: '1.0',
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Health risk prediction error:', error);
            return this.getFallbackRiskPrediction(patientData);
        }
    }

    async predictMedicationAdherence(patientData) {
        if (!this.isInitialized || !this.models.medicationAdherence) {
            throw new Error('Medication adherence model not initialized');
        }

        try {
            const cacheKey = `medAdherence_${JSON.stringify(patientData)}`;
            const cached = this.getCachedPrediction(cacheKey);
            if (cached) return cached;

            const features = this.preprocessMedicationData(patientData);
            const prediction = this.models.medicationAdherence.predict(features);
            const adherenceScore = await prediction.data();
            
            const adherenceAssessment = {
                adherenceProbability: adherenceScore[0],
                riskLevel: this.categorizeAdherenceRisk(adherenceScore[0]),
                factors: this.identifyAdherenceFactors(patientData),
                interventions: this.getAdherenceInterventions(adherenceScore[0]),
                monitoring: this.getMonitoringRecommendations(adherenceScore[0]),
                confidence: this.calculateConfidence(adherenceScore[0]),
                personalizedStrategies: this.generatePersonalizedStrategies(patientData, adherenceScore[0])
            };
            
            prediction.dispose();
            features.dispose();
            
            this.setCachedPrediction(cacheKey, adherenceAssessment);
            
            return adherenceAssessment;
            
        } catch (error) {
            console.error('❌ Medication adherence prediction error:', error);
            return this.getFallbackAdherencePrediction(patientData);
        }
    }

    async detectVitalSignsAnomalies(vitalSigns) {
        if (!this.isInitialized || !this.models.vitalSignsAnomaly) {
            throw new Error('Vital signs anomaly model not initialized');
        }

        try {
            const features = this.preprocessVitalSigns(vitalSigns);
            const reconstruction = this.models.vitalSignsAnomaly.predict(features);
            
            // Calculate reconstruction error
            const originalData = await features.data();
            const reconstructedData = await reconstruction.data();
            
            const errors = originalData.map((val, idx) => 
                Math.abs(val - reconstructedData[idx])
            );
            
            const averageError = errors.reduce((a, b) => a + b, 0) / errors.length;
            const anomalyThreshold = 0.15; // Adjust based on training
            
            const anomalyDetection = {
                isAnomalous: averageError > anomalyThreshold,
                anomalyScore: averageError,
                severity: this.categorizeSeverity(averageError),
                confidence: Math.min(averageError / anomalyThreshold, 1.0),
                concerningParameters: this.identifyAnomalousParameters(errors, originalData, vitalSigns),
                recommendations: this.getAnomalyRecommendations(averageError, errors),
                trends: this.analyzeVitalTrends(vitalSigns),
                alerts: this.generateAnomalyAlerts(averageError, errors)
            };
            
            reconstruction.dispose();
            features.dispose();
            
            return anomalyDetection;
            
        } catch (error) {
            console.error('❌ Vital signs anomaly detection error:', error);
            return this.getFallbackAnomalyDetection(vitalSigns);
        }
    }

    async predictDiseaseProgression(patientHistory) {
        if (!this.isInitialized || !this.models.diseaseProgression) {
            throw new Error('Disease progression model not initialized');
        }

        try {
            const sequenceData = this.preprocessTimeSeriesData(patientHistory);
            const prediction = this.models.diseaseProgression.predict(sequenceData);
            const progressionScore = await prediction.data();
            
            const progressionAnalysis = {
                progressionScore: progressionScore[0],
                trend: this.categorizeProgression(progressionScore[0]),
                riskLevel: this.calculateProgressionRisk(progressionScore[0]),
                timeframe: this.estimateProgressionTimeframe(progressionScore[0]),
                interventions: this.getProgressionInterventions(progressionScore[0]),
                monitoring: this.getProgressionMonitoring(progressionScore[0]),
                lifestyle: this.getLifestyleRecommendations(progressionScore[0]),
                confidence: 0.75
            };
            
            prediction.dispose();
            sequenceData.dispose();
            
            return progressionAnalysis;
            
        } catch (error) {
            console.error('❌ Disease progression prediction error:', error);
            return this.getFallbackProgressionPrediction(patientHistory);
        }
    }

    async predictTreatmentOutcome(patientData, treatmentPlan) {
        if (!this.isInitialized || !this.models.treatmentOutcome) {
            throw new Error('Treatment outcome model not initialized');
        }

        try {
            const features = this.preprocessTreatmentData(patientData, treatmentPlan);
            const prediction = this.models.treatmentOutcome.predict(features);
            const outcomeScore = await prediction.data();
            
            const outcomeAnalysis = {
                successProbability: outcomeScore[0],
                expectedOutcome: this.categorizeOutcome(outcomeScore[0]),
                confidenceLevel: this.calculateOutcomeConfidence(outcomeScore[0]),
                optimizationSuggestions: this.getOptimizationSuggestions(patientData, treatmentPlan, outcomeScore[0]),
                riskFactors: this.identifyTreatmentRiskFactors(patientData, treatmentPlan),
                timeline: this.estimateTreatmentTimeline(treatmentPlan, outcomeScore[0]),
                alternatives: this.suggestAlternativeTreatments(patientData, treatmentPlan, outcomeScore[0])
            };
            
            prediction.dispose();
            features.dispose();
            
            return outcomeAnalysis;
            
        } catch (error) {
            console.error('❌ Treatment outcome prediction error:', error);
            return this.getFallbackTreatmentPrediction(patientData, treatmentPlan);
        }
    }

    // ==================== DATA PREPROCESSING ====================
    
    preprocessHealthData(patientData) {
        // Extract relevant features for health risk prediction
        const features = [
            this.normalizeAge(patientData.age || 0),
            this.normalizeBMI(patientData.bmi || 0),
            this.normalizeBP(patientData.systolicBP || 0),
            this.normalizeBP(patientData.diastolicBP || 0, 'diastolic'),
            this.normalizeHeartRate(patientData.heartRate || 0),
            this.normalizeCholesterol(patientData.cholesterol || 0),
            this.normalizeGlucose(patientData.glucose || 0),
            patientData.smoker ? 1 : 0,
            patientData.familyHistory ? 1 : 0,
            this.normalizeExercise(patientData.exerciseHours || 0),
            this.normalizeStress(patientData.stressLevel || 0),
            this.normalizeSleep(patientData.sleepHours || 0),
            this.normalizeMedications(patientData.medicationCount || 0),
            this.normalizeConditions(patientData.chronicConditions || 0),
            this.normalizeHospitalizations(patientData.previousHospitalizations || 0)
        ];
        
        return tf.tensor2d([features]);
    }

    preprocessMedicationData(patientData) {
        const features = [
            this.normalizeAge(patientData.age || 0),
            this.normalizeMedications(patientData.medicationCount || 0),
            this.normalizeMedicationComplexity(patientData.medicationComplexity || 0),
            this.normalizeDailyDoses(patientData.dailyDoses || 0),
            this.normalizeCognitive(patientData.cognitiveScore || 0),
            patientData.supportSystem ? 1 : 0,
            this.normalizeFinancial(patientData.financialStatus || 0),
            this.normalizeHealthLiteracy(patientData.healthLiteracy || 0),
            this.normalizeAdherence(patientData.previousAdherence || 0),
            this.normalizeSideEffects(patientData.sideEffectsConcern || 0)
        ];
        
        return tf.tensor2d([features]);
    }

    preprocessVitalSigns(vitalSigns) {
        const features = [
            this.normalizeBP(vitalSigns.systolicBP || 0),
            this.normalizeBP(vitalSigns.diastolicBP || 0, 'diastolic'),
            this.normalizeHeartRate(vitalSigns.heartRate || 0),
            this.normalizeTemperature(vitalSigns.temperature || 0),
            this.normalizeRespiratory(vitalSigns.respiratoryRate || 0),
            this.normalizeOxygen(vitalSigns.oxygenSaturation || 0),
            this.normalizeWeight(vitalSigns.weight || 0),
            this.normalizeGlucose(vitalSigns.glucoseLevel || 0)
        ];
        
        return tf.tensor2d([features]);
    }

    preprocessTimeSeriesData(patientHistory) {
        // Convert patient history to time series format
        const sequenceLength = 30;
        const features = 5; // Number of features per time step
        
        const timeSeriesData = [];
        
        for (let i = 0; i < sequenceLength; i++) {
            const dayData = patientHistory[i] || this.getDefaultDayData();
            timeSeriesData.push([
                dayData.symptomSeverity || 0,
                dayData.medicationAdherence || 0,
                dayData.activityLevel || 0,
                dayData.sleepQuality || 0,
                dayData.stressLevel || 0
            ]);
        }
        
        return tf.tensor3d([timeSeriesData]);
    }

    preprocessTreatmentData(patientData, treatmentPlan) {
        const features = [
            this.normalizeAge(patientData.age || 0),
            this.normalizeBMI(patientData.bmi || 0),
            this.normalizeConditions(patientData.chronicConditions || 0),
            this.normalizeMedications(patientData.medicationCount || 0),
            this.normalizeTreatmentComplexity(treatmentPlan.complexity || 0),
            this.normalizeTreatmentDuration(treatmentPlan.duration || 0),
            treatmentPlan.invasive ? 1 : 0,
            patientData.previousTreatments || 0,
            this.normalizeAdherence(patientData.previousAdherence || 0),
            patientData.supportSystem ? 1 : 0,
            this.normalizeFinancial(patientData.financialStatus || 0),
            this.normalizeCognitive(patientData.cognitiveScore || 0)
        ];
        
        return tf.tensor2d([features]);
    }

    // ==================== NORMALIZATION FUNCTIONS ====================
    
    normalizeAge(age) {
        return Math.min(age / 100, 1);
    }

    normalizeBMI(bmi) {
        return Math.min(bmi / 50, 1);
    }

    normalizeBP(bp, type = 'systolic') {
        const max = type === 'systolic' ? 200 : 120;
        return Math.min(bp / max, 1);
    }

    normalizeHeartRate(hr) {
        return Math.min(hr / 200, 1);
    }

    normalizeCholesterol(cholesterol) {
        return Math.min(cholesterol / 400, 1);
    }

    normalizeGlucose(glucose) {
        return Math.min(glucose / 300, 1);
    }

    normalizeExercise(hours) {
        return Math.min(hours / 10, 1);
    }

    normalizeStress(level) {
        return Math.min(level / 10, 1);
    }

    normalizeSleep(hours) {
        return Math.min(hours / 12, 1);
    }

    normalizeMedications(count) {
        return Math.min(count / 20, 1);
    }

    normalizeConditions(count) {
        return Math.min(count / 10, 1);
    }

    normalizeHospitalizations(count) {
        return Math.min(count / 10, 1);
    }

    normalizeMedicationComplexity(complexity) {
        return Math.min(complexity / 10, 1);
    }

    normalizeDailyDoses(doses) {
        return Math.min(doses / 10, 1);
    }

    normalizeCognitive(score) {
        return Math.min(score / 100, 1);
    }

    normalizeFinancial(status) {
        return Math.min(status / 10, 1);
    }

    normalizeHealthLiteracy(literacy) {
        return Math.min(literacy / 100, 1);
    }

    normalizeAdherence(adherence) {
        return Math.min(adherence, 1);
    }

    normalizeSideEffects(concern) {
        return Math.min(concern / 10, 1);
    }

    normalizeTemperature(temp) {
        return Math.min((temp - 95) / 10, 1);
    }

    normalizeRespiratory(rate) {
        return Math.min(rate / 30, 1);
    }

    normalizeOxygen(saturation) {
        return Math.min(saturation / 100, 1);
    }

    normalizeWeight(weight) {
        return Math.min(weight / 200, 1);
    }

    normalizeTreatmentComplexity(complexity) {
        return Math.min(complexity / 10, 1);
    }

    normalizeTreatmentDuration(duration) {
        return Math.min(duration / 365, 1); // Normalize to 1 year
    }

    // ==================== RESULT INTERPRETATION ====================
    
    interpretRiskPrediction(riskScores) {
        const [lowRisk, mediumRisk, highRisk] = riskScores;
        
        let level, score, confidence;
        
        if (highRisk > mediumRisk && highRisk > lowRisk) {
            level = 'high';
            score = highRisk;
            confidence = highRisk;
        } else if (mediumRisk > lowRisk) {
            level = 'medium';
            score = mediumRisk;
            confidence = mediumRisk;
        } else {
            level = 'low';
            score = lowRisk;
            confidence = lowRisk;
        }
        
        return {
            riskLevel: level,
            riskScore: score,
            confidence: confidence,
            factors: this.getRiskFactors(level),
            recommendations: this.getRiskRecommendations(level),
            urgency: this.getUrgencyLevel(level),
            nextSteps: this.getNextSteps(level)
        };
    }

    categorizeAdherenceRisk(score) {
        if (score < 0.6) return 'high';
        if (score < 0.8) return 'medium';
        return 'low';
    }

    categorizeSeverity(score) {
        if (score > 0.8) return 'critical';
        if (score > 0.4) return 'high';
        if (score > 0.2) return 'medium';
        return 'low';
    }

    categorizeProgression(score) {
        if (score > 0.7) return 'rapidly_progressing';
        if (score > 0.5) return 'progressing';
        if (score > 0.3) return 'stable_with_concern';
        return 'stable';
    }

    categorizeOutcome(score) {
        if (score > 0.8) return 'excellent';
        if (score > 0.6) return 'good';
        if (score > 0.4) return 'fair';
        return 'poor';
    }

    // ==================== INSIGHT GENERATION ====================
    
    async generateHealthInsights(patientData, riskAssessment) {
        const insights = [];
        
        // Age-related insights
        if (patientData.age > 65) {
            insights.push({
                category: 'age',
                insight: 'Age is a significant risk factor. Regular screenings become more important.',
                impact: 'medium'
            });
        }
        
        // BMI insights
        if (patientData.bmi > 30) {
            insights.push({
                category: 'weight',
                insight: 'BMI indicates obesity, which increases risk for multiple conditions.',
                impact: 'high'
            });
        }
        
        // Blood pressure insights
        if (patientData.systolicBP > 140) {
            insights.push({
                category: 'blood_pressure',
                insight: 'Elevated blood pressure detected. Monitor closely and consider lifestyle changes.',
                impact: 'high'
            });
        }
        
        return insights;
    }

    getRiskFactors(riskLevel) {
        const riskFactors = {
            high: [
                'Multiple chronic conditions',
                'Poor medication adherence history',
                'Irregular vital signs patterns',
                'Limited physical activity',
                'High stress levels',
                'Poor sleep quality'
            ],
            medium: [
                'Some chronic conditions present',
                'Occasional medication issues',
                'Borderline vital signs',
                'Moderate activity levels',
                'Some lifestyle risk factors'
            ],
            low: [
                'Good overall health status',
                'Regular medical checkups',
                'Stable vital signs',
                'Active lifestyle',
                'Good medication adherence'
            ]
        };
        
        return riskFactors[riskLevel] || riskFactors.medium;
    }

    getRiskRecommendations(riskLevel) {
        const recommendations = {
            high: [
                'Schedule immediate healthcare consultation',
                'Implement daily vital signs monitoring',
                'Enhance medication adherence support',
                'Begin structured lifestyle modification program',
                'Arrange weekly health check-ins',
                'Consider care coordination services'
            ],
            medium: [
                'Schedule healthcare consultation within 2 weeks',
                'Begin regular vital signs monitoring',
                'Review and optimize medication regimen',
                'Increase physical activity gradually',
                'Implement stress management techniques',
                'Monthly health assessments'
            ],
            low: [
                'Continue current healthy practices',
                'Maintain annual health screenings',
                'Keep active lifestyle',
                'Regular preventive care',
                'Quarterly health check-ins'
            ]
        };
        
        return recommendations[riskLevel] || recommendations.medium;
    }

    getUrgencyLevel(riskLevel) {
        const urgencyMap = {
            high: 'immediate',
            medium: 'within_week',
            low: 'routine'
        };
        
        return urgencyMap[riskLevel] || 'routine';
    }

    getNextSteps(riskLevel) {
        const nextSteps = {
            high: [
                'Contact healthcare provider immediately',
                'Begin intensive monitoring protocol',
                'Implement emergency action plan'
            ],
            medium: [
                'Schedule follow-up appointment',
                'Begin enhanced monitoring',
                'Implement preventive measures'
            ],
            low: [
                'Continue current care plan',
                'Schedule routine follow-up',
                'Maintain healthy habits'
            ]
        };
        
        return nextSteps[riskLevel] || nextSteps.medium;
    }

    // ==================== CACHING SYSTEM ====================
    
    getCachedPrediction(key) {
        const cached = this.predictionCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedPrediction(key, data) {
        this.predictionCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // ==================== UTILITY METHODS ====================
    
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async ensureDirectoryExists(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            // Directory might already exist
            console.log(`Directory ${dirPath} handling:`, error.message);
        }
    }

    getDefaultDayData() {
        return {
            symptomSeverity: 0,
            medicationAdherence: 1,
            activityLevel: 0.5,
            sleepQuality: 0.7,
            stressLevel: 0.3
        };
    }

    calculateConfidence(score) {
        // Convert prediction score to confidence level
        const confidence = Math.abs(score - 0.5) * 2;
        return Math.min(confidence, 0.95);
    }

    // ==================== FALLBACK METHODS ====================
    
    getFallbackRiskPrediction(patientData) {
        // Simple rule-based fallback
        let riskScore = 0;
        
        if (patientData.age > 65) riskScore += 0.2;
        if (patientData.bmi > 30) riskScore += 0.2;
        if (patientData.chronicConditions > 2) riskScore += 0.3;
        if (patientData.smoker) riskScore += 0.3;
        
        const level = riskScore > 0.6 ? 'high' : riskScore > 0.3 ? 'medium' : 'low';
        
        return {
            riskLevel: level,
            riskScore: riskScore,
            confidence: 0.6,
            factors: this.getRiskFactors(level),
            recommendations: this.getRiskRecommendations(level),
            fallback: true,
            timestamp: new Date().toISOString()
        };
    }

    getFallbackAdherencePrediction(patientData) {
        let adherenceScore = 0.8; // Default assumption
        
        if (patientData.medicationCount > 5) adherenceScore -= 0.2;
        if (patientData.age > 75) adherenceScore -= 0.1;
        if (!patientData.supportSystem) adherenceScore -= 0.2;
        
        return {
            adherenceProbability: Math.max(0, adherenceScore),
            riskLevel: adherenceScore < 0.6 ? 'high' : 'medium',
            interventions: ['Medication reminders', 'Simplified regimen'],
            monitoring: ['Weekly check-ins', 'Pill count verification'],
            fallback: true
        };
    }

    getFallbackAnomalyDetection(vitalSigns) {
        return {
            isAnomalous: false,
            anomalyScore: 0.1,
            severity: 'low',
            confidence: 0.5,
            concerningParameters: [],
            recommendations: ['Continue regular monitoring'],
            fallback: true
        };
    }

    getFallbackProgressionPrediction(patientHistory) {
        return {
            progressionScore: 0.5,
            trend: 'stable',
            riskLevel: 'medium',
            timeframe: '6-12 months',
            interventions: ['Continue current treatment'],
            monitoring: ['Monthly assessments'],
            fallback: true
        };
    }

    getFallbackTreatmentPrediction(patientData, treatmentPlan) {
        return {
            successProbability: 0.7,
            expectedOutcome: 'good',
            confidenceLevel: 0.6,
            optimizationSuggestions: ['Follow treatment plan consistently'],
            riskFactors: ['Standard treatment risks'],
            timeline: 'Standard timeline expected',
            alternatives: [],
            fallback: true
        };
    }

    // ==================== MODEL MANAGEMENT ====================
    
    async saveModel(modelName) {
        if (this.models[modelName]) {
            const modelPath = this.modelPaths[modelName];
            await this.models[modelName].save(`file://${modelPath}`);
            console.log(`💾 Model ${modelName} saved to ${modelPath}`);
        }
    }

    async loadModel(modelName) {
        const modelPath = this.modelPaths[modelName];
        if (await this.fileExists(modelPath)) {
            this.models[modelName] = await tf.loadLayersModel(`file://${modelPath}`);
            console.log(`📂 Model ${modelName} loaded from ${modelPath}`);
        }
    }

    getModelInfo() {
        return {
            isInitialized: this.isInitialized,
            models: Object.keys(this.models),
            cacheSize: this.predictionCache.size,
            memoryUsage: tf.memory()
        };
    }

    // ==================== ANALYTICS INTEGRATION ====================
    
    async generateComprehensiveAnalysis(patientData) {
        try {
            const analysis = {};
            
            // Run all predictions in parallel
            const [
                healthRisk,
                medicationAdherence,
                vitalAnomalies,
                treatmentOutcome
            ] = await Promise.all([
                this.predictHealthRisk(patientData),
                this.predictMedicationAdherence(patientData),
                patientData.latestVitals ? this.detectVitalSignsAnomalies(patientData.latestVitals) : Promise.resolve(null),
                patientData.currentTreatment ? this.predictTreatmentOutcome(patientData, patientData.currentTreatment) : Promise.resolve(null)
            ]);
            
            analysis.healthRisk = healthRisk;
            analysis.medicationAdherence = medicationAdherence;
            if (vitalAnomalies) analysis.vitalAnomalies = vitalAnomalies;
            if (treatmentOutcome) analysis.treatmentOutcome = treatmentOutcome;
            
            // Generate overall assessment
            analysis.overallAssessment = this.generateOverallAssessment(analysis);
            analysis.prioritizedActions = this.prioritizeActions(analysis);
            
            return {
                success: true,
                analysis,
                generatedAt: new Date().toISOString(),
                modelVersion: '1.0'
            };
            
        } catch (error) {
            console.error('❌ Comprehensive analysis error:', error);
            return {
                success: false,
                error: error.message,
                fallbackAnalysis: this.getFallbackComprehensiveAnalysis(patientData)
            };
        }
    }

    generateOverallAssessment(analysis) {
        let overallRiskScore = 0;
        let riskFactorCount = 0;
        
        if (analysis.healthRisk) {
            overallRiskScore += analysis.healthRisk.riskScore * 0.4;
            riskFactorCount++;
        }
        
        if (analysis.medicationAdherence) {
            overallRiskScore += (1 - analysis.medicationAdherence.adherenceProbability) * 0.3;
            riskFactorCount++;
        }
        
        if (analysis.vitalAnomalies?.isAnomalous) {
            overallRiskScore += analysis.vitalAnomalies.anomalyScore * 0.3;
            riskFactorCount++;
        }
        
        const finalScore = riskFactorCount > 0 ? overallRiskScore / riskFactorCount : 0;
        
        return {
            overallRiskScore: finalScore,
            riskLevel: finalScore > 0.6 ? 'high' : finalScore > 0.3 ? 'medium' : 'low',
            keyFindings: this.extractKeyFindings(analysis),
            priority: this.determinePriority(finalScore, analysis)
        };
    }

    prioritizeActions(analysis) {
        const actions = [];
        
        // High priority actions
        if (analysis.healthRisk?.riskLevel === 'high') {
            actions.push({
                priority: 'high',
                action: 'Schedule immediate healthcare consultation',
                category: 'health_risk',
                timeframe: 'immediate'
            });
        }
        
        if (analysis.vitalAnomalies?.isAnomalous && analysis.vitalAnomalies.severity === 'critical') {
            actions.push({
                priority: 'high',
                action: 'Seek immediate medical attention for vital signs',
                category: 'vital_signs',
                timeframe: 'immediate'
            });
        }
        
        // Medium priority actions
        if (analysis.medicationAdherence?.riskLevel === 'high') {
            actions.push({
                priority: 'medium',
                action: 'Implement medication adherence support program',
                category: 'medication',
                timeframe: 'within_week'
            });
        }
        
        return actions.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    extractKeyFindings(analysis) {
        const findings = [];
        
        if (analysis.healthRisk) {
            findings.push(`Health risk level: ${analysis.healthRisk.riskLevel}`);
        }
        
        if (analysis.medicationAdherence) {
            findings.push(`Medication adherence: ${(analysis.medicationAdherence.adherenceProbability * 100).toFixed(0)}%`);
        }
        
        if (analysis.vitalAnomalies?.isAnomalous) {
            findings.push('Vital signs anomalies detected');
        }
        
        return findings;
    }

    determinePriority(riskScore, analysis) {
        if (riskScore > 0.7) return 'urgent';
        if (riskScore > 0.4) return 'high';
        if (riskScore > 0.2) return 'medium';
        return 'low';
    }

    getFallbackComprehensiveAnalysis(patientData) {
        return {
            overallAssessment: {
                overallRiskScore: 0.3,
                riskLevel: 'medium',
                keyFindings: ['Analysis unavailable - fallback mode'],
                priority: 'medium'
            },
            recommendations: ['Consult healthcare provider for comprehensive assessment'],
            fallback: true
        };
    }
}

module.exports = MLService; 