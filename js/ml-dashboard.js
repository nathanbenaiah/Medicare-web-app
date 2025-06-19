/**
 * 📊 ML Dashboard - Frontend Integration
 * Interactive dashboard for machine learning predictions and analytics
 */

class MLDashboard {
    constructor() {
        this.apiUrl = '/api/ml';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.isLoading = false;
        
        this.init();
    }

    init() {
        console.log('🤖 Initializing ML Dashboard...');
        this.setupEventListeners();
        this.checkMLServiceHealth();
        this.loadStoredPredictions();
    }

    setupEventListeners() {
        // Health Risk Prediction
        document.getElementById('predict-health-risk-btn')?.addEventListener('click', () => {
            this.predictHealthRisk();
        });

        // Medication Adherence Prediction
        document.getElementById('predict-adherence-btn')?.addEventListener('click', () => {
            this.predictMedicationAdherence();
        });

        // Vital Signs Anomaly Detection
        document.getElementById('detect-anomalies-btn')?.addEventListener('click', () => {
            this.detectVitalAnomalies();
        });

        // Comprehensive Analysis
        document.getElementById('comprehensive-analysis-btn')?.addEventListener('click', () => {
            this.runComprehensiveAnalysis();
        });

        // Auto-prediction toggle
        document.getElementById('auto-predict-toggle')?.addEventListener('change', (e) => {
            this.toggleAutoPrediction(e.target.checked);
        });

        // Export results
        document.getElementById('export-results-btn')?.addEventListener('click', () => {
            this.exportResults();
        });

        // Sample data buttons
        document.getElementById('load-sample-data-btn')?.addEventListener('click', () => {
            this.loadSampleData();
        });
    }

    async checkMLServiceHealth() {
        try {
            const response = await fetch(`${this.apiUrl}/health`);
            const health = await response.json();
            
            this.updateHealthStatus(health);
            
            if (health.success && health.status === 'healthy') {
                console.log('✅ ML Service is healthy');
                this.enableMLFeatures();
            } else {
                console.warn('⚠️ ML Service is not fully ready');
                this.showMLServiceWarning(health);
            }
            
        } catch (error) {
            console.error('❌ ML Service health check failed:', error);
            this.showMLServiceError();
        }
    }

    // ==================== HEALTH RISK PREDICTION ====================

    async predictHealthRisk() {
        if (this.isLoading) return;
        
        try {
            this.setLoading(true, 'Predicting health risk...');
            
            const patientData = this.collectPatientData();
            
            if (!this.validatePatientData(patientData)) {
                this.showError('Please fill in all required patient information');
                return;
            }

            // Check cache first
            const cacheKey = `health-risk-${JSON.stringify(patientData)}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                this.displayHealthRiskPrediction(cached);
                return;
            }

            const response = await fetch(`${this.apiUrl}/predict-health-risk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ patientData })
            });

            const result = await response.json();
            
            if (result.success) {
                this.cacheResult(cacheKey, result.prediction);
                this.displayHealthRiskPrediction(result.prediction);
                this.logPrediction('health-risk', result.prediction);
            } else {
                this.showError('Health risk prediction failed: ' + result.error);
                if (result.fallback) {
                    this.displayHealthRiskPrediction(result.fallback, true);
                }
            }
            
        } catch (error) {
            console.error('❌ Health risk prediction error:', error);
            this.showError('Network error during health risk prediction');
        } finally {
            this.setLoading(false);
        }
    }

    displayHealthRiskPrediction(prediction, isFallback = false) {
        const resultContainer = document.getElementById('health-risk-results');
        if (!resultContainer) return;

        const riskColors = {
            'low': '#10B981',
            'medium': '#F59E0B',
            'high': '#EF4444'
        };

        const urgencyIcons = {
            'immediate': '🚨',
            'within_week': '⚠️',
            'routine': '✅'
        };

        resultContainer.innerHTML = `
            <div class="prediction-result ${isFallback ? 'fallback' : ''}">
                <div class="result-header">
                    <h3>Health Risk Assessment ${isFallback ? '(Fallback Mode)' : ''}</h3>
                    <div class="prediction-meta">
                        <span class="confidence">Confidence: ${(prediction.confidence * 100).toFixed(1)}%</span>
                        ${prediction.modelVersion ? `<span class="model-version">Model v${prediction.modelVersion}</span>` : ''}
                    </div>
                </div>

                <div class="risk-overview">
                    <div class="risk-level" style="color: ${riskColors[prediction.riskLevel]}">
                        <span class="risk-label">Risk Level:</span>
                        <span class="risk-value">${prediction.riskLevel.toUpperCase()}</span>
                        <span class="urgency-indicator">${urgencyIcons[prediction.urgency] || '📋'}</span>
                    </div>
                    
                    <div class="risk-score">
                        <div class="score-circle" style="border-color: ${riskColors[prediction.riskLevel]}">
                            ${(prediction.riskScore * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>

                <div class="prediction-details">
                    <div class="risk-factors">
                        <h4>Risk Factors</h4>
                        <ul>
                            ${prediction.factors.map(factor => `<li>${factor}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="recommendations">
                        <h4>Recommendations</h4>
                        <ul>
                            ${prediction.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    ${prediction.nextSteps ? `
                        <div class="next-steps">
                            <h4>Next Steps</h4>
                            <ul>
                                ${prediction.nextSteps.map(step => `<li>${step}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${prediction.insights ? `
                        <div class="insights">
                            <h4>Health Insights</h4>
                            ${prediction.insights.map(insight => `
                                <div class="insight-item impact-${insight.impact}">
                                    <strong>${insight.category.replace('_', ' ')}:</strong> ${insight.insight}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <div class="prediction-actions">
                    <button class="btn btn-primary" onclick="mlDashboard.shareResults('health-risk', ${JSON.stringify(prediction).replace(/"/g, '&quot;')})">
                        Share Results
                    </button>
                    <button class="btn btn-secondary" onclick="mlDashboard.saveResults('health-risk', ${JSON.stringify(prediction).replace(/"/g, '&quot;')})">
                        Save Results
                    </button>
                </div>
            </div>
        `;

        this.animateResult(resultContainer);
    }

    // ==================== MEDICATION ADHERENCE PREDICTION ====================

    async predictMedicationAdherence() {
        if (this.isLoading) return;
        
        try {
            this.setLoading(true, 'Analyzing medication adherence...');
            
            const patientData = this.collectMedicationData();
            
            const response = await fetch(`${this.apiUrl}/predict-medication-adherence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ patientData })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayMedicationAdherencePrediction(result.prediction);
                this.logPrediction('medication-adherence', result.prediction);
            } else {
                this.showError('Medication adherence prediction failed: ' + result.error);
            }
            
        } catch (error) {
            console.error('❌ Medication adherence prediction error:', error);
            this.showError('Network error during medication adherence prediction');
        } finally {
            this.setLoading(false);
        }
    }

    displayMedicationAdherencePrediction(prediction) {
        const resultContainer = document.getElementById('medication-adherence-results');
        if (!resultContainer) return;

        const adherencePercent = (prediction.adherenceProbability * 100).toFixed(1);
        const riskColor = prediction.riskLevel === 'high' ? '#EF4444' : 
                         prediction.riskLevel === 'medium' ? '#F59E0B' : '#10B981';

        resultContainer.innerHTML = `
            <div class="prediction-result">
                <div class="result-header">
                    <h3>Medication Adherence Prediction</h3>
                    <div class="adherence-score" style="color: ${riskColor}">
                        ${adherencePercent}%
                    </div>
                </div>

                <div class="adherence-details">
                    <div class="risk-assessment">
                        <span class="risk-label">Adherence Risk:</span>
                        <span class="risk-badge risk-${prediction.riskLevel}">${prediction.riskLevel.toUpperCase()}</span>
                    </div>

                    ${prediction.factors ? `
                        <div class="adherence-factors">
                            <h4>Contributing Factors</h4>
                            <ul>
                                ${prediction.factors.map(factor => `<li>${factor}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="interventions">
                        <h4>Recommended Interventions</h4>
                        <ul>
                            ${prediction.interventions.map(intervention => `<li>${intervention}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="monitoring">
                        <h4>Monitoring Plan</h4>
                        <ul>
                            ${prediction.monitoring.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>

                    ${prediction.personalizedStrategies ? `
                        <div class="personalized-strategies">
                            <h4>Personalized Strategies</h4>
                            <ul>
                                ${prediction.personalizedStrategies.map(strategy => `<li>${strategy}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.animateResult(resultContainer);
    }

    // ==================== VITAL SIGNS ANOMALY DETECTION ====================

    async detectVitalAnomalies() {
        if (this.isLoading) return;
        
        try {
            this.setLoading(true, 'Detecting vital signs anomalies...');
            
            const vitalSigns = this.collectVitalSigns();
            
            const response = await fetch(`${this.apiUrl}/detect-vital-anomalies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vitalSigns })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayVitalAnomaliesDetection(result.detection);
                this.logPrediction('vital-anomalies', result.detection);
            } else {
                this.showError('Vital signs anomaly detection failed: ' + result.error);
            }
            
        } catch (error) {
            console.error('❌ Vital signs anomaly detection error:', error);
            this.showError('Network error during vital signs analysis');
        } finally {
            this.setLoading(false);
        }
    }

    displayVitalAnomaliesDetection(detection) {
        const resultContainer = document.getElementById('vital-anomalies-results');
        if (!resultContainer) return;

        const statusColor = detection.isAnomalous ? '#EF4444' : '#10B981';
        const statusIcon = detection.isAnomalous ? '⚠️' : '✅';

        resultContainer.innerHTML = `
            <div class="prediction-result">
                <div class="result-header">
                    <h3>Vital Signs Anomaly Detection</h3>
                    <div class="anomaly-status" style="color: ${statusColor}">
                        ${statusIcon} ${detection.isAnomalous ? 'Anomalies Detected' : 'Normal Range'}
                    </div>
                </div>

                <div class="anomaly-details">
                    <div class="anomaly-metrics">
                        <div class="metric">
                            <label>Anomaly Score:</label>
                            <span>${detection.anomalyScore.toFixed(3)}</span>
                        </div>
                        <div class="metric">
                            <label>Severity:</label>
                            <span class="severity-${detection.severity}">${detection.severity.toUpperCase()}</span>
                        </div>
                        <div class="metric">
                            <label>Confidence:</label>
                            <span>${(detection.confidence * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    ${detection.concerningParameters?.length > 0 ? `
                        <div class="concerning-parameters">
                            <h4>Concerning Parameters</h4>
                            <ul>
                                ${detection.concerningParameters.map(param => `<li>${param}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="recommendations">
                        <h4>Recommendations</h4>
                        <ul>
                            ${detection.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    ${detection.alerts?.length > 0 ? `
                        <div class="alerts">
                            <h4>Alerts</h4>
                            <ul>
                                ${detection.alerts.map(alert => `<li class="alert-${alert.severity}">${alert.message}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.animateResult(resultContainer);
    }

    // ==================== COMPREHENSIVE ANALYSIS ====================

    async runComprehensiveAnalysis() {
        if (this.isLoading) return;
        
        try {
            this.setLoading(true, 'Running comprehensive ML analysis...');
            
            const patientData = this.collectComprehensiveData();
            
            const response = await fetch(`${this.apiUrl}/comprehensive-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ patientData })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayComprehensiveAnalysis(result.analysis);
                this.logPrediction('comprehensive', result.analysis);
            } else {
                this.showError('Comprehensive analysis failed: ' + result.error);
            }
            
        } catch (error) {
            console.error('❌ Comprehensive analysis error:', error);
            this.showError('Network error during comprehensive analysis');
        } finally {
            this.setLoading(false);
        }
    }

    displayComprehensiveAnalysis(analysis) {
        const resultContainer = document.getElementById('comprehensive-analysis-results');
        if (!resultContainer) return;

        const overallAssessment = analysis.overallAssessment;
        const priorityColor = overallAssessment.priority === 'urgent' ? '#EF4444' : 
                            overallAssessment.priority === 'high' ? '#F59E0B' : '#10B981';

        resultContainer.innerHTML = `
            <div class="prediction-result comprehensive">
                <div class="result-header">
                    <h3>Comprehensive Health Analysis</h3>
                    <div class="overall-priority" style="color: ${priorityColor}">
                        Priority: ${overallAssessment.priority.toUpperCase()}
                    </div>
                </div>

                <div class="overall-assessment">
                    <div class="assessment-score">
                        <div class="score-circle" style="border-color: ${priorityColor}">
                            ${(overallAssessment.overallRiskScore * 100).toFixed(0)}%
                        </div>
                        <div class="score-label">Overall Risk</div>
                    </div>
                    
                    <div class="key-findings">
                        <h4>Key Findings</h4>
                        <ul>
                            ${overallAssessment.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="analysis-sections">
                    ${this.renderAnalysisSection('Health Risk', analysis.healthRisk)}
                    ${this.renderAnalysisSection('Medication Adherence', analysis.medicationAdherence)}
                    ${analysis.vitalAnomalies ? this.renderAnalysisSection('Vital Signs', analysis.vitalAnomalies) : ''}
                    ${analysis.treatmentOutcome ? this.renderAnalysisSection('Treatment Outcome', analysis.treatmentOutcome) : ''}
                </div>

                ${analysis.prioritizedActions?.length > 0 ? `
                    <div class="prioritized-actions">
                        <h4>Prioritized Actions</h4>
                        <div class="actions-list">
                            ${analysis.prioritizedActions.map(action => `
                                <div class="action-item priority-${action.priority}">
                                    <div class="action-priority">${action.priority.toUpperCase()}</div>
                                    <div class="action-details">
                                        <div class="action-text">${action.action}</div>
                                        <div class="action-meta">
                                            <span class="category">${action.category.replace('_', ' ')}</span>
                                            <span class="timeframe">${action.timeframe.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        this.animateResult(resultContainer);
    }

    renderAnalysisSection(title, data) {
        if (!data) return '';
        
        return `
            <div class="analysis-section">
                <h4>${title}</h4>
                <div class="section-summary">
                    ${this.generateSectionSummary(title, data)}
                </div>
            </div>
        `;
    }

    generateSectionSummary(title, data) {
        switch (title) {
            case 'Health Risk':
                return `
                    <span class="summary-item">Risk Level: <strong>${data.riskLevel}</strong></span>
                    <span class="summary-item">Confidence: <strong>${(data.confidence * 100).toFixed(1)}%</strong></span>
                `;
            case 'Medication Adherence':
                return `
                    <span class="summary-item">Adherence: <strong>${(data.adherenceProbability * 100).toFixed(1)}%</strong></span>
                    <span class="summary-item">Risk: <strong>${data.riskLevel}</strong></span>
                `;
            case 'Vital Signs':
                return `
                    <span class="summary-item">Status: <strong>${data.isAnomalous ? 'Anomalous' : 'Normal'}</strong></span>
                    <span class="summary-item">Severity: <strong>${data.severity}</strong></span>
                `;
            case 'Treatment Outcome':
                return `
                    <span class="summary-item">Success Rate: <strong>${(data.successProbability * 100).toFixed(1)}%</strong></span>
                    <span class="summary-item">Outcome: <strong>${data.expectedOutcome}</strong></span>
                `;
            default:
                return '<span class="summary-item">Analysis complete</span>';
        }
    }

    // ==================== DATA COLLECTION ====================

    collectPatientData() {
        return {
            age: parseInt(document.getElementById('patient-age')?.value) || 0,
            bmi: parseFloat(document.getElementById('patient-bmi')?.value) || 0,
            systolicBP: parseInt(document.getElementById('systolic-bp')?.value) || 0,
            diastolicBP: parseInt(document.getElementById('diastolic-bp')?.value) || 0,
            heartRate: parseInt(document.getElementById('heart-rate')?.value) || 0,
            cholesterol: parseInt(document.getElementById('cholesterol')?.value) || 0,
            glucose: parseInt(document.getElementById('glucose')?.value) || 0,
            smoker: document.getElementById('smoker')?.checked || false,
            familyHistory: document.getElementById('family-history')?.checked || false,
            exerciseHours: parseFloat(document.getElementById('exercise-hours')?.value) || 0,
            stressLevel: parseInt(document.getElementById('stress-level')?.value) || 0,
            sleepHours: parseFloat(document.getElementById('sleep-hours')?.value) || 0,
            medicationCount: parseInt(document.getElementById('medication-count')?.value) || 0,
            chronicConditions: parseInt(document.getElementById('chronic-conditions')?.value) || 0,
            previousHospitalizations: parseInt(document.getElementById('hospitalizations')?.value) || 0
        };
    }

    collectMedicationData() {
        const baseData = this.collectPatientData();
        return {
            ...baseData,
            medicationComplexity: parseInt(document.getElementById('medication-complexity')?.value) || 0,
            dailyDoses: parseInt(document.getElementById('daily-doses')?.value) || 0,
            cognitiveScore: parseInt(document.getElementById('cognitive-score')?.value) || 0,
            supportSystem: document.getElementById('support-system')?.checked || false,
            financialStatus: parseInt(document.getElementById('financial-status')?.value) || 0,
            healthLiteracy: parseInt(document.getElementById('health-literacy')?.value) || 0,
            previousAdherence: parseFloat(document.getElementById('previous-adherence')?.value) || 0,
            sideEffectsConcern: parseInt(document.getElementById('side-effects-concern')?.value) || 0
        };
    }

    collectVitalSigns() {
        return {
            systolicBP: parseInt(document.getElementById('vs-systolic')?.value) || 0,
            diastolicBP: parseInt(document.getElementById('vs-diastolic')?.value) || 0,
            heartRate: parseInt(document.getElementById('vs-heart-rate')?.value) || 0,
            temperature: parseFloat(document.getElementById('vs-temperature')?.value) || 0,
            respiratoryRate: parseInt(document.getElementById('vs-respiratory')?.value) || 0,
            oxygenSaturation: parseInt(document.getElementById('vs-oxygen')?.value) || 0,
            weight: parseFloat(document.getElementById('vs-weight')?.value) || 0,
            glucoseLevel: parseInt(document.getElementById('vs-glucose')?.value) || 0
        };
    }

    collectComprehensiveData() {
        const patientData = this.collectMedicationData();
        const vitalSigns = this.collectVitalSigns();
        
        return {
            ...patientData,
            latestVitals: vitalSigns,
            currentTreatment: this.collectTreatmentData()
        };
    }

    collectTreatmentData() {
        return {
            complexity: parseInt(document.getElementById('treatment-complexity')?.value) || 0,
            duration: parseInt(document.getElementById('treatment-duration')?.value) || 0,
            invasive: document.getElementById('treatment-invasive')?.checked || false
        };
    }

    // ==================== UTILITY FUNCTIONS ====================

    validatePatientData(data) {
        return data.age > 0 && data.age < 150;
    }

    setLoading(isLoading, message = '') {
        this.isLoading = isLoading;
        const loadingIndicator = document.getElementById('ml-loading');
        const loadingMessage = document.getElementById('ml-loading-message');
        
        if (loadingIndicator) {
            loadingIndicator.style.display = isLoading ? 'block' : 'none';
        }
        
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
    }

    showError(message) {
        console.error('ML Dashboard Error:', message);
        const errorDiv = document.getElementById('ml-error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    animateResult(container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    cacheResult(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    logPrediction(type, data) {
        const log = {
            type,
            data,
            timestamp: new Date().toISOString()
        };
        
        const predictions = JSON.parse(localStorage.getItem('ml-predictions') || '[]');
        predictions.unshift(log);
        predictions.splice(20); // Keep only last 20
        
        localStorage.setItem('ml-predictions', JSON.stringify(predictions));
    }

    loadStoredPredictions() {
        const predictions = JSON.parse(localStorage.getItem('ml-predictions') || '[]');
        console.log(`📊 Loaded ${predictions.length} stored predictions`);
    }

    updateHealthStatus(health) {
        const statusElement = document.getElementById('ml-service-status');
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="status-item">
                    <span class="status-label">Status:</span>
                    <span class="status-value status-${health.status}">${health.status}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Models:</span>
                    <span class="status-value">${health.modelsActive || 0}/${health.models || 0}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Cache:</span>
                    <span class="status-value">${health.cacheSize || 0} items</span>
                </div>
            `;
        }
    }

    enableMLFeatures() {
        document.querySelectorAll('.ml-feature').forEach(element => {
            element.classList.remove('disabled');
        });
    }

    showMLServiceWarning(health) {
        const warningDiv = document.getElementById('ml-service-warning');
        if (warningDiv) {
            warningDiv.innerHTML = `
                ⚠️ ML Service Status: ${health.status}. Some features may be limited.
            `;
            warningDiv.style.display = 'block';
        }
    }

    showMLServiceError() {
        const errorDiv = document.getElementById('ml-service-error');
        if (errorDiv) {
            errorDiv.innerHTML = '❌ ML Service unavailable. Please try again later.';
            errorDiv.style.display = 'block';
        }
    }

    loadSampleData() {
        // Load sample patient data for testing
        const sampleData = {
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
            chronicConditions: 2,
            previousHospitalizations: 1
        };

        Object.entries(sampleData).forEach(([key, value]) => {
            const element = document.getElementById(key === 'patient-age' ? 'patient-age' : key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });

        console.log('📝 Sample data loaded');
    }

    exportResults() {
        const predictions = JSON.parse(localStorage.getItem('ml-predictions') || '[]');
        
        const exportData = {
            exportDate: new Date().toISOString(),
            predictions: predictions
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ml-predictions-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📁 Results exported');
    }

    shareResults(type, prediction) {
        if (navigator.share) {
            navigator.share({
                title: `ML Prediction - ${type}`,
                text: `Health prediction results from MediCare+ AI`,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            const shareText = `MediCare+ ML Prediction\nType: ${type}\nGenerated: ${new Date().toLocaleString()}`;
            navigator.clipboard.writeText(shareText).then(() => {
                console.log('📋 Results copied to clipboard');
            });
        }
    }

    saveResults(type, prediction) {
        // Save specific prediction with timestamp
        const savedResult = {
            type,
            prediction,
            savedAt: new Date().toISOString(),
            id: Date.now().toString()
        };

        const savedResults = JSON.parse(localStorage.getItem('ml-saved-results') || '[]');
        savedResults.unshift(savedResult);
        savedResults.splice(50); // Keep only last 50

        localStorage.setItem('ml-saved-results', JSON.stringify(savedResults));
        
        console.log('💾 Results saved');
    }

    toggleAutoPrediction(enabled) {
        this.autoPredictionEnabled = enabled;
        console.log(`🔄 Auto-prediction ${enabled ? 'enabled' : 'disabled'}`);
        
        if (enabled) {
            // Set up auto-prediction logic
            this.setupAutoPrediction();
        } else {
            this.teardownAutoPrediction();
        }
    }

    setupAutoPrediction() {
        // Monitor form changes and trigger predictions automatically
        document.querySelectorAll('.ml-input').forEach(input => {
            input.addEventListener('change', this.debounce(() => {
                if (this.autoPredictionEnabled && this.validatePatientData(this.collectPatientData())) {
                    this.predictHealthRisk();
                }
            }, 2000));
        });
    }

    teardownAutoPrediction() {
        // Remove auto-prediction listeners
        document.querySelectorAll('.ml-input').forEach(input => {
            input.removeEventListener('change', this.autoPredictionHandler);
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize ML Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mlDashboard = new MLDashboard();
    console.log('🚀 ML Dashboard initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MLDashboard;
} 