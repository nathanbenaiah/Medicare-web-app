/**
 * 🧪 ML Predictions Test Suite
 * Comprehensive testing of all machine learning features
 */

const axios = require('axios');
const fs = require('fs').promises;

class MLTester {
    constructor() {
        this.baseUrl = 'http://localhost:8000';
        this.testResults = [];
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log('🧪 Starting ML Predictions Test Suite...\n');

        const tests = [
            { name: 'Health Risk Prediction', fn: () => this.testHealthRiskPrediction() },
            { name: 'Medication Adherence', fn: () => this.testMedicationAdherence() },
            { name: 'Vital Signs Anomaly Detection', fn: () => this.testVitalSignsAnomalies() },
            { name: 'Disease Progression', fn: () => this.testDiseaseProgression() },
            { name: 'Treatment Outcome', fn: () => this.testTreatmentOutcome() },
            { name: 'Comprehensive Analysis', fn: () => this.testComprehensiveAnalysis() }
        ];

        for (const test of tests) {
            await this.runTest(test.name, test.fn);
        }

        await this.generateReport();
    }

    async runTest(testName, testFn) {
        console.log(`🔄 Testing: ${testName}`);
        const startTime = Date.now();

        try {
            const result = await testFn();
            const duration = Date.now() - startTime;

            this.testResults.push({
                name: testName,
                status: 'PASS',
                duration,
                result,
                error: null
            });

            console.log(`✅ ${testName} - PASSED (${duration}ms)\n`);

        } catch (error) {
            const duration = Date.now() - startTime;

            this.testResults.push({
                name: testName,
                status: 'FAIL',
                duration,
                result: null,
                error: error.message
            });

            console.log(`❌ ${testName} - FAILED (${duration}ms)`);
            console.log(`   Error: ${error.message}\n`);
        }
    }

    async testHealthRiskPrediction() {
        const testData = {
            patientData: {
                id: 'test-patient-001',
                age: 65,
                bmi: 28.5,
                systolicBP: 140,
                diastolicBP: 90,
                heartRate: 75,
                cholesterol: 220,
                glucose: 110,
                smoker: false,
                familyHistory: true,
                exerciseHours: 2,
                stressLevel: 6,
                sleepHours: 7,
                medicationCount: 3,
                chronicConditions: 2
            }
        };

        const response = await axios.post(`${this.baseUrl}/api/ml/predict-health-risk`, testData);
        
        if (!response.data.success) {
            throw new Error('Health risk prediction failed');
        }

        const prediction = response.data.prediction;
        
        // Validate response structure
        if (!prediction.riskLevel || !prediction.riskScore || !prediction.recommendations) {
            throw new Error('Invalid prediction response structure');
        }

        console.log(`   Risk Level: ${prediction.riskLevel}`);
        console.log(`   Risk Score: ${prediction.riskScore}`);
        console.log(`   Confidence: ${prediction.confidence}`);

        return prediction;
    }

    async testMedicationAdherence() {
        const testData = {
            patientData: {
                id: 'test-patient-002',
                age: 72,
                medicationCount: 5,
                medicationComplexity: 7,
                dailyDoses: 3,
                cognitiveScore: 85,
                supportSystem: true,
                financialStatus: 6,
                healthLiteracy: 75,
                previousAdherence: 0.85,
                sideEffectsConcern: 4
            }
        };

        const response = await axios.post(`${this.baseUrl}/api/ml/predict-medication-adherence`, testData);
        
        if (!response.data.success) {
            throw new Error('Medication adherence prediction failed');
        }

        const prediction = response.data.prediction;
        console.log(`   Adherence Probability: ${prediction.adherenceProbability}`);
        console.log(`   Risk Level: ${prediction.riskLevel}`);

        return prediction;
    }

    async testVitalSignsAnomalies() {
        const testData = {
            vitalSigns: {
                patientId: 'test-patient-003',
                bloodPressure: { systolic: 180, diastolic: 110 },
                heartRate: 105,
                temperature: 99.8,
                respiratoryRate: 22,
                oxygenSaturation: 94,
                weight: 85,
                timestamp: new Date().toISOString()
            }
        };

        const response = await axios.post(`${this.baseUrl}/api/ml/detect-vital-anomalies`, testData);
        
        if (!response.data.success) {
            throw new Error('Vital signs anomaly detection failed');
        }

        const detection = response.data.detection;
        console.log(`   Anomalies Detected: ${detection.anomaliesDetected?.length || 0}`);
        console.log(`   Overall Risk: ${detection.overallRisk}`);

        return detection;
    }

    async testDiseaseProgression() {
        // Generate sample historical data
        const patientHistory = [];
        for (let i = 0; i < 30; i++) {
            patientHistory.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                symptoms: ['fatigue', 'shortness of breath'],
                severity: Math.random() * 10,
                medications: ['metformin', 'lisinopril'],
                vitalSigns: {
                    bp: 140 + Math.random() * 20,
                    hr: 70 + Math.random() * 20
                }
            });
        }

        const testData = { patientHistory };

        const response = await axios.post(`${this.baseUrl}/api/ml/predict-disease-progression`, testData);
        
        if (!response.data.success) {
            throw new Error('Disease progression prediction failed');
        }

        const prediction = response.data.prediction;
        console.log(`   Progression Risk: ${prediction.progressionRisk}`);
        console.log(`   Timeline: ${prediction.timeline}`);

        return prediction;
    }

    async testTreatmentOutcome() {
        const testData = {
            patientData: {
                id: 'test-patient-005',
                age: 58,
                condition: 'diabetes',
                comorbidities: ['hypertension'],
                previousTreatments: ['metformin']
            },
            treatmentPlan: {
                medication: 'insulin',
                dosage: '10 units',
                frequency: 'twice daily',
                duration: '6 months',
                lifestyle: ['diet modification', 'exercise program']
            }
        };

        const response = await axios.post(`${this.baseUrl}/api/ml/predict-treatment-outcome`, testData);
        
        if (!response.data.success) {
            throw new Error('Treatment outcome prediction failed');
        }

        const prediction = response.data.prediction;
        console.log(`   Success Probability: ${prediction.successProbability}`);
        console.log(`   Expected Outcome: ${prediction.expectedOutcome}`);

        return prediction;
    }

    async testComprehensiveAnalysis() {
        const testData = {
            patientData: {
                id: 'test-patient-comprehensive',
                age: 67,
                bmi: 31.2,
                systolicBP: 150,
                diastolicBP: 95,
                heartRate: 82,
                cholesterol: 240,
                glucose: 130,
                smoker: true,
                familyHistory: true,
                exerciseHours: 1,
                stressLevel: 8,
                sleepHours: 6,
                medicationCount: 4,
                chronicConditions: 3,
                medicationComplexity: 8,
                dailyDoses: 4,
                cognitiveScore: 78,
                supportSystem: false,
                financialStatus: 4,
                healthLiteracy: 60
            }
        };

        const response = await axios.post(`${this.baseUrl}/api/ml/comprehensive-analysis`, testData);
        
        if (!response.data.success && !response.data.analysis) {
            throw new Error('Comprehensive analysis failed');
        }

        const analysis = response.data.analysis || response.data;
        console.log(`   Overall Assessment: ${analysis.overallAssessment}`);
        console.log(`   Priority Actions: ${analysis.prioritizedActions?.length || 0}`);

        return analysis;
    }

    async generateReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
        const failedTests = totalTests - passedTests;
        const totalDuration = Date.now() - this.startTime;
        const avgDuration = this.testResults.reduce((sum, t) => sum + t.duration, 0) / totalTests;

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                success_rate: ((passedTests / totalTests) * 100).toFixed(2) + '%',
                total_duration: totalDuration + 'ms',
                average_duration: Math.round(avgDuration) + 'ms'
            },
            results: this.testResults,
            recommendations: this.generateRecommendations()
        };

        // Save report
        await fs.writeFile('ml-test-report.json', JSON.stringify(report, null, 2));

        // Display summary
        console.log('\n📊 ML TEST RESULTS SUMMARY');
        console.log('=' .repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Success Rate: ${report.summary.success_rate}`);
        console.log(`Total Duration: ${totalDuration}ms`);
        console.log(`Average Duration: ${Math.round(avgDuration)}ms`);
        console.log('\n📝 Detailed report saved to: ml-test-report.json');

        if (failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(t => t.status === 'FAIL')
                .forEach(test => {
                    console.log(`   - ${test.name}: ${test.error}`);
                });
        }

        console.log('\n🎉 ML testing completed!');
        
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        const failedTests = this.testResults.filter(t => t.status === 'FAIL');

        if (failedTests.length === 0) {
            recommendations.push('All ML endpoints are functioning correctly');
            recommendations.push('Consider implementing A/B testing for model improvements');
            recommendations.push('Set up monitoring for prediction accuracy in production');
        } else {
            recommendations.push('Fix failed endpoints before production deployment');
            if (failedTests.some(t => t.name.includes('Health Risk'))) {
                recommendations.push('Check DeepSeek API key configuration');
            }
            recommendations.push('Implement fallback mechanisms for failed predictions');
        }

        const avgDuration = this.testResults.reduce((sum, t) => sum + t.duration, 0) / this.testResults.length;
        if (avgDuration > 5000) {
            recommendations.push('Consider implementing response caching for better performance');
        }

        return recommendations;
    }
}

// Run tests if script is executed directly
if (require.main === module) {
    const tester = new MLTester();
    tester.runAllTests().catch(console.error);
}

module.exports = MLTester; 