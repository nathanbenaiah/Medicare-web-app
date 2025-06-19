/**
 * 🏋️ ML Model Training Script
 * Trains machine learning models for the Medicare AI assistant
 */

const tf = require('@tensorflow/tfjs-node');
const MLService = require('../services/ml-service');
const fs = require('fs').promises;

class ModelTrainer {
    constructor() {
        this.mlService = new MLService();
        this.trainingDataSize = 1000;
        this.validationSplit = 0.2;
        this.epochs = 50;
        this.batchSize = 32;
    }

    async train() {
        console.log('🏋️ Starting ML model training...');
        
        try {
            // Wait for ML service to initialize
            await this.waitForInitialization();
            
            // Train each model
            await this.trainHealthRiskModel();
            await this.trainMedicationAdherenceModel();
            await this.trainVitalSignsAnomalyModel();
            await this.trainDiseaseProgressionModel();
            await this.trainTreatmentOutcomeModel();
            
            console.log('✅ All models trained successfully!');
            
            // Generate training report
            await this.generateTrainingReport();
            
        } catch (error) {
            console.error('❌ Training failed:', error);
            process.exit(1);
        }
    }

    async waitForInitialization() {
        let attempts = 0;
        const maxAttempts = 30;
        
        while (!this.mlService.isInitialized && attempts < maxAttempts) {
            console.log(`⏳ Waiting for ML service initialization... (${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        
        if (!this.mlService.isInitialized) {
            throw new Error('ML service failed to initialize');
        }
        
        console.log('✅ ML service initialized');
    }

    async trainHealthRiskModel() {
        console.log('🔄 Training Health Risk Model...');
        
        // Generate synthetic training data
        const trainingData = this.generateHealthRiskData(this.trainingDataSize);
        
        // Prepare tensors
        const features = tf.tensor2d(trainingData.map(d => d.features));
        const labels = tf.tensor2d(trainingData.map(d => d.labels));
        
        // Split data
        const splitIndex = Math.floor(trainingData.length * (1 - this.validationSplit));
        const trainFeatures = features.slice([0, 0], [splitIndex, -1]);
        const trainLabels = labels.slice([0, 0], [splitIndex, -1]);
        const valFeatures = features.slice([splitIndex, 0], [-1, -1]);
        const valLabels = labels.slice([splitIndex, 0], [-1, -1]);

        // Train model
        const history = await this.mlService.models.healthRisk.fit(trainFeatures, trainLabels, {
            epochs: this.epochs,
            batchSize: this.batchSize,
            validationData: [valFeatures, valLabels],
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 10 === 0) {
                        console.log(`  Epoch ${epoch}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}`);
                    }
                }
            }
        });

        // Save model
        await this.mlService.saveModel('healthRisk');

        // Cleanup
        features.dispose();
        labels.dispose();
        trainFeatures.dispose();
        trainLabels.dispose();
        valFeatures.dispose();
        valLabels.dispose();

        console.log('✅ Health Risk Model trained successfully');
        return history;
    }

    async trainMedicationAdherenceModel() {
        console.log('🔄 Training Medication Adherence Model...');
        
        const trainingData = this.generateMedicationAdherenceData(this.trainingDataSize);
        
        const features = tf.tensor2d(trainingData.map(d => d.features));
        const labels = tf.tensor2d(trainingData.map(d => [d.label]));
        
        const splitIndex = Math.floor(trainingData.length * (1 - this.validationSplit));
        const trainFeatures = features.slice([0, 0], [splitIndex, -1]);
        const trainLabels = labels.slice([0, 0], [splitIndex, -1]);
        const valFeatures = features.slice([splitIndex, 0], [-1, -1]);
        const valLabels = labels.slice([splitIndex, 0], [-1, -1]);

        const history = await this.mlService.models.medicationAdherence.fit(trainFeatures, trainLabels, {
            epochs: this.epochs,
            batchSize: this.batchSize,
            validationData: [valFeatures, valLabels],
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 10 === 0) {
                        console.log(`  Epoch ${epoch}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}`);
                    }
                }
            }
        });

        await this.mlService.saveModel('medicationAdherence');

        features.dispose();
        labels.dispose();
        trainFeatures.dispose();
        trainLabels.dispose();
        valFeatures.dispose();
        valLabels.dispose();

        console.log('✅ Medication Adherence Model trained successfully');
        return history;
    }

    async trainVitalSignsAnomalyModel() {
        console.log('🔄 Training Vital Signs Anomaly Model...');
        
        const trainingData = this.generateVitalSignsData(this.trainingDataSize);
        
        const features = tf.tensor2d(trainingData);
        
        const splitIndex = Math.floor(trainingData.length * (1 - this.validationSplit));
        const trainFeatures = features.slice([0, 0], [splitIndex, -1]);
        const valFeatures = features.slice([splitIndex, 0], [-1, -1]);

        // For autoencoder, labels are the same as features
        const history = await this.mlService.models.vitalSignsAnomaly.fit(trainFeatures, trainFeatures, {
            epochs: this.epochs,
            batchSize: this.batchSize,
            validationData: [valFeatures, valFeatures],
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 10 === 0) {
                        console.log(`  Epoch ${epoch}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}`);
                    }
                }
            }
        });

        await this.mlService.saveModel('vitalSignsAnomaly');

        features.dispose();
        trainFeatures.dispose();
        valFeatures.dispose();

        console.log('✅ Vital Signs Anomaly Model trained successfully');
        return history;
    }

    async trainDiseaseProgressionModel() {
        console.log('🔄 Training Disease Progression Model...');
        
        const trainingData = this.generateDiseaseProgressionData(this.trainingDataSize);
        
        const features = tf.tensor3d(trainingData.map(d => d.sequence));
        const labels = tf.tensor2d(trainingData.map(d => [d.progression]));
        
        const splitIndex = Math.floor(trainingData.length * (1 - this.validationSplit));
        const trainFeatures = features.slice([0, 0, 0], [splitIndex, -1, -1]);
        const trainLabels = labels.slice([0, 0], [splitIndex, -1]);
        const valFeatures = features.slice([splitIndex, 0, 0], [-1, -1, -1]);
        const valLabels = labels.slice([splitIndex, 0], [-1, -1]);

        const history = await this.mlService.models.diseaseProgression.fit(trainFeatures, trainLabels, {
            epochs: this.epochs,
            batchSize: this.batchSize,
            validationData: [valFeatures, valLabels],
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 10 === 0) {
                        console.log(`  Epoch ${epoch}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}`);
                    }
                }
            }
        });

        await this.mlService.saveModel('diseaseProgression');

        features.dispose();
        labels.dispose();
        trainFeatures.dispose();
        trainLabels.dispose();
        valFeatures.dispose();
        valLabels.dispose();

        console.log('✅ Disease Progression Model trained successfully');
        return history;
    }

    async trainTreatmentOutcomeModel() {
        console.log('🔄 Training Treatment Outcome Model...');
        
        const trainingData = this.generateTreatmentOutcomeData(this.trainingDataSize);
        
        const features = tf.tensor2d(trainingData.map(d => d.features));
        const labels = tf.tensor2d(trainingData.map(d => [d.outcome]));
        
        const splitIndex = Math.floor(trainingData.length * (1 - this.validationSplit));
        const trainFeatures = features.slice([0, 0], [splitIndex, -1]);
        const trainLabels = labels.slice([0, 0], [splitIndex, -1]);
        const valFeatures = features.slice([splitIndex, 0], [-1, -1]);
        const valLabels = labels.slice([splitIndex, 0], [-1, -1]);

        const history = await this.mlService.models.treatmentOutcome.fit(trainFeatures, trainLabels, {
            epochs: this.epochs,
            batchSize: this.batchSize,
            validationData: [valFeatures, valLabels],
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 10 === 0) {
                        console.log(`  Epoch ${epoch}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}`);
                    }
                }
            }
        });

        await this.mlService.saveModel('treatmentOutcome');

        features.dispose();
        labels.dispose();
        trainFeatures.dispose();
        trainLabels.dispose();
        valFeatures.dispose();
        valLabels.dispose();

        console.log('✅ Treatment Outcome Model trained successfully');
        return history;
    }

    // ==================== DATA GENERATION ====================

    generateHealthRiskData(count) {
        const data = [];
        
        for (let i = 0; i < count; i++) {
            const age = Math.random() * 80 + 20;
            const bmi = Math.random() * 20 + 18;
            const systolic = Math.random() * 60 + 110;
            const diastolic = Math.random() * 40 + 70;
            const heartRate = Math.random() * 100 + 60;
            const cholesterol = Math.random() * 200 + 150;
            const glucose = Math.random() * 100 + 80;
            const smoker = Math.random() > 0.7;
            const familyHistory = Math.random() > 0.6;
            const exercise = Math.random() * 10;
            const stress = Math.random() * 10;
            const sleep = Math.random() * 4 + 6;
            const medications = Math.floor(Math.random() * 10);
            const conditions = Math.floor(Math.random() * 5);
            const hospitalizations = Math.floor(Math.random() * 5);
            
            const features = [
                age / 100, bmi / 50, systolic / 200, diastolic / 120,
                heartRate / 200, cholesterol / 400, glucose / 300,
                smoker ? 1 : 0, familyHistory ? 1 : 0, exercise / 10,
                stress / 10, sleep / 12, medications / 20,
                conditions / 10, hospitalizations / 10
            ];

            // Generate realistic risk labels
            let riskScore = 0;
            if (age > 65) riskScore += 0.3;
            if (bmi > 30) riskScore += 0.2;
            if (systolic > 140 || diastolic > 90) riskScore += 0.4;
            if (smoker) riskScore += 0.3;
            if (conditions > 2) riskScore += 0.2;
            if (medications > 5) riskScore += 0.1;

            let labels;
            if (riskScore > 0.6) {
                labels = [0, 0, 1]; // High risk
            } else if (riskScore > 0.3) {
                labels = [0, 1, 0]; // Medium risk
            } else {
                labels = [1, 0, 0]; // Low risk
            }

            data.push({ features, labels });
        }

        return data;
    }

    generateMedicationAdherenceData(count) {
        const data = [];
        
        for (let i = 0; i < count; i++) {
            const age = Math.random() * 80 + 20;
            const medicationCount = Math.floor(Math.random() * 15);
            const complexity = Math.random() * 10;
            const dailyDoses = Math.floor(Math.random() * 8) + 1;
            const cognitive = Math.random() * 100;
            const supportSystem = Math.random() > 0.3;
            const financial = Math.random() * 10;
            const literacy = Math.random() * 100;
            const previousAdherence = Math.random();
            const sideEffects = Math.random() * 10;
            
            const features = [
                age / 100, medicationCount / 20, complexity / 10,
                dailyDoses / 10, cognitive / 100, supportSystem ? 1 : 0,
                financial / 10, literacy / 100, previousAdherence,
                sideEffects / 10
            ];

            // Calculate adherence probability
            let adherence = 0.8;
            if (medicationCount > 5) adherence -= 0.2;
            if (complexity > 5) adherence -= 0.15;
            if (dailyDoses > 4) adherence -= 0.1;
            if (age > 75) adherence -= 0.1;
            if (!supportSystem) adherence -= 0.2;
            if (sideEffects > 5) adherence -= 0.15;

            adherence = Math.max(0.1, Math.min(0.95, adherence));

            data.push({ features, label: adherence });
        }

        return data;
    }

    generateVitalSignsData(count) {
        const data = [];
        
        for (let i = 0; i < count; i++) {
            // Generate mostly normal vital signs
            const systolic = 120 + (Math.random() - 0.5) * 40;
            const diastolic = 80 + (Math.random() - 0.5) * 20;
            const heartRate = 70 + (Math.random() - 0.5) * 40;
            const temperature = 98.6 + (Math.random() - 0.5) * 4;
            const respiratory = 16 + (Math.random() - 0.5) * 8;
            const oxygen = 98 + (Math.random() - 0.5) * 4;
            const weight = 70 + (Math.random() - 0.5) * 40;
            const glucose = 100 + (Math.random() - 0.5) * 40;
            
            const vitals = [
                systolic / 200, diastolic / 120, heartRate / 200,
                (temperature - 95) / 10, respiratory / 30, oxygen / 100,
                weight / 200, glucose / 300
            ];

            data.push(vitals);
        }

        return data;
    }

    generateDiseaseProgressionData(count) {
        const data = [];
        
        for (let i = 0; i < count; i++) {
            const sequence = [];
            let baseProgression = Math.random() * 0.5;
            
            // Generate 30-day sequence
            for (let day = 0; day < 30; day++) {
                const dayData = [
                    Math.random(), // symptom severity
                    0.8 + Math.random() * 0.2, // medication adherence
                    Math.random(), // activity level
                    0.6 + Math.random() * 0.4, // sleep quality
                    Math.random() * 0.6 // stress level
                ];
                sequence.push(dayData);
            }
            
            // Final progression score based on trends
            const progression = baseProgression + Math.random() * 0.3;
            
            data.push({ sequence, progression });
        }

        return data;
    }

    generateTreatmentOutcomeData(count) {
        const data = [];
        
        for (let i = 0; i < count; i++) {
            const age = Math.random() * 80 + 20;
            const bmi = Math.random() * 20 + 18;
            const conditions = Math.floor(Math.random() * 5);
            const medications = Math.floor(Math.random() * 10);
            const complexity = Math.random() * 10;
            const duration = Math.random() * 365;
            const invasive = Math.random() > 0.7;
            const previousTreatments = Math.floor(Math.random() * 5);
            const adherence = Math.random();
            const support = Math.random() > 0.3;
            const financial = Math.random() * 10;
            const cognitive = Math.random() * 100;
            
            const features = [
                age / 100, bmi / 50, conditions / 10, medications / 20,
                complexity / 10, duration / 365, invasive ? 1 : 0,
                previousTreatments / 10, adherence, support ? 1 : 0,
                financial / 10, cognitive / 100
            ];

            // Calculate success probability
            let success = 0.7;
            if (age > 70) success -= 0.1;
            if (bmi > 30) success -= 0.1;
            if (conditions > 2) success -= 0.15;
            if (complexity > 5) success -= 0.1;
            if (invasive) success -= 0.1;
            if (adherence < 0.8) success -= 0.2;
            if (!support) success -= 0.1;

            success = Math.max(0.1, Math.min(0.95, success));

            data.push({ features, outcome: success });
        }

        return data;
    }

    async generateTrainingReport() {
        const report = {
            timestamp: new Date().toISOString(),
            trainingParameters: {
                dataSize: this.trainingDataSize,
                validationSplit: this.validationSplit,
                epochs: this.epochs,
                batchSize: this.batchSize
            },
            models: {
                healthRisk: 'Trained successfully',
                medicationAdherence: 'Trained successfully',
                vitalSignsAnomaly: 'Trained successfully',
                diseaseProgression: 'Trained successfully',
                treatmentOutcome: 'Trained successfully'
            },
            nextSteps: [
                '1. Test models with real data',
                '2. Validate predictions against known outcomes',
                '3. Fine-tune hyperparameters if needed',
                '4. Deploy to production environment'
            ]
        };

        const reportPath = './training-report.json';
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n📊 Training Report Generated:');
        console.log(JSON.stringify(report, null, 2));
        console.log(`\n💾 Report saved to: ${reportPath}`);
    }
}

// Run training if this script is executed directly
if (require.main === module) {
    const trainer = new ModelTrainer();
    trainer.train().catch(console.error);
}

module.exports = ModelTrainer; 