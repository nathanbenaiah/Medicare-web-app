class SymptomChecker30Q {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = Date.now().toString();
        this.totalQuestions = 30;
    }

    getQuestions() {
        return [
            {
                id: 1,
                question: "What is your primary symptom?",
                type: "multiple",
                options: ["Headache", "Chest pain", "Abdominal pain", "Back pain", "Joint pain", "Breathing issues", "Fatigue", "Skin problems", "Digestive issues", "Other"],
                required: true
            },
            {
                id: 2,
                question: "Rate your pain level (1-10)",
                type: "scale",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 3,
                question: "When did symptoms start?",
                type: "multiple",
                options: ["Less than 1 hour", "1-6 hours", "6-24 hours", "1-3 days", "4-7 days", "1-2 weeks", "More than 2 weeks"],
                required: true
            },
            {
                id: 4,
                question: "Select emergency symptoms you have:",
                type: "checkbox",
                options: ["Fever/chills", "Nausea/vomiting", "Dizziness", "Shortness of breath", "Rapid heartbeat", "Sweating", "Confusion", "Severe weakness", "None"],
                required: true
            },
            {
                id: 5,
                question: "Describe your pain type:",
                type: "multiple",
                options: ["Sharp/stabbing", "Dull/aching", "Burning", "Cramping", "Throbbing", "Pressure-like", "Electric shock", "No pain"],
                required: true
            },
            {
                id: 6,
                question: "What makes symptoms better?",
                type: "checkbox",
                options: ["Rest", "Movement", "Heat", "Cold", "OTC medications", "Prescription meds", "Food/water", "Nothing helps"],
                required: true
            },
            {
                id: 7,
                question: "What makes symptoms worse?",
                type: "checkbox",
                options: ["Physical activity", "Certain positions", "Eating/drinking", "Stress", "Weather changes", "Touch/pressure", "Deep breathing", "Nothing"],
                required: true
            },
            {
                id: 8,
                question: "Current temperature (°F):",
                type: "number",
                min: 95,
                max: 110,
                required: true
            },
            {
                id: 9,
                question: "Neurological symptoms present:",
                type: "checkbox",
                options: ["Memory problems", "Confusion", "Difficulty concentrating", "Seizures", "Tremors", "Muscle weakness", "Coordination issues", "Speech problems", "Vision changes", "None"],
                required: true
            },
            {
                id: 10,
                question: "Recent travel history:",
                type: "multiple",
                options: ["No travel", "Domestic travel", "International travel", "High-risk area travel", "Sick contact during travel"],
                required: true
            },
            {
                id: 11,
                question: "Known allergies:",
                type: "checkbox",
                options: ["Food allergies", "Drug allergies", "Environmental allergies", "Latex allergy", "Animal allergies", "Insect allergies", "No allergies"],
                required: true
            },
            {
                id: 12,
                question: "Current medications:",
                type: "checkbox",
                options: ["Blood pressure meds", "Diabetes meds", "Heart medications", "Blood thinners", "Pain medications", "Antibiotics", "Vitamins", "Birth control", "Antidepressants", "None"],
                required: true
            },
            {
                id: 13,
                question: "Recent injuries:",
                type: "multiple",
                options: ["No injuries", "Head injury", "Fall/trauma", "Sports injury", "Car accident", "Work injury", "Cut/wound"],
                required: true
            },
            {
                id: 14,
                question: "Appetite changes:",
                type: "multiple",
                options: ["Normal appetite", "Increased appetite", "Decreased appetite", "No appetite", "Nausea when eating", "Difficulty swallowing"],
                required: true
            },
            {
                id: 15,
                question: "Sleep quality:",
                type: "multiple",
                options: ["Normal sleep", "Trouble falling asleep", "Frequent waking", "Early waking", "Sleeping more", "Pain disrupts sleep", "Can't sleep"],
                required: true
            },
            {
                id: 16,
                question: "Chronic conditions:",
                type: "checkbox",
                options: ["Diabetes", "High blood pressure", "Heart disease", "Asthma", "Arthritis", "Cancer", "Kidney disease", "Liver disease", "Mental health", "None"],
                required: true
            },
            {
                id: 17,
                question: "Stress level (1-10):",
                type: "scale",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 18,
                question: "Recent illness exposure:",
                type: "multiple",
                options: ["No exposure", "Family member sick", "Coworker sick", "Healthcare exposure", "Public gathering", "School/daycare exposure"],
                required: true
            },
            {
                id: 19,
                question: "Energy level (1-10):",
                type: "scale",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 20,
                question: "Bowel movement changes:",
                type: "multiple",
                options: ["Normal", "Constipation", "Diarrhea", "Blood in stool", "Black stool", "Severe cramping", "No bowel movement 3+ days"],
                required: true
            },
            {
                id: 21,
                question: "Urination changes:",
                type: "multiple",
                options: ["Normal", "Frequent urination", "Painful urination", "Blood in urine", "Difficulty urinating", "Unable to urinate", "Unusual odor/color"],
                required: true
            },
            {
                id: 22,
                question: "Breathing description:",
                type: "multiple",
                options: ["Normal", "Slightly short", "Moderately short", "Severely short", "Can't catch breath", "Wheezing", "Cough with breathing"],
                required: true
            },
            {
                id: 23,
                question: "Skin changes:",
                type: "checkbox",
                options: ["No changes", "Rash/redness", "Itching", "Swelling", "Bruising", "Cuts/wounds", "Color changes", "New moles"],
                required: true
            },
            {
                id: 24,
                question: "Anxiety about symptoms (1-10):",
                type: "scale",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 25,
                question: "Treatments tried:",
                type: "checkbox",
                options: ["No treatments", "OTC pain relievers", "Home remedies", "Prescription meds", "Physical therapy", "Alternative treatments", "Previous doctor visit"],
                required: true
            },
            {
                id: 26,
                question: "Impact on daily activities:",
                type: "multiple",
                options: ["No impact", "Slightly limiting", "Moderately limiting", "Severely limiting", "Unable to perform activities", "Need assistance"],
                required: true
            },
            {
                id: 27,
                question: "Family history:",
                type: "checkbox",
                options: ["No history", "Similar symptoms", "Heart disease", "Cancer", "Diabetes", "Mental health", "Unknown history"],
                required: true
            },
            {
                id: 28,
                question: "Lifestyle factors:",
                type: "checkbox",
                options: ["Regular exercise", "Sedentary lifestyle", "Healthy diet", "Poor diet", "Regular sleep", "Irregular sleep", "Tobacco use", "Alcohol use", "High stress job", "Good support system"],
                required: true
            },
            {
                id: 29,
                question: "Duration of symptoms:",
                type: "multiple",
                options: ["Constant", "Intermittent", "Getting worse", "Getting better", "Stays the same", "Comes and goes"],
                required: true
            },
            {
                id: 30,
                question: "Additional concerns:",
                type: "text",
                placeholder: "Describe any other symptoms or concerns...",
                required: false
            }
        ];
    }

    init() {
        this.questions = this.getQuestions();
        this.renderQuestion();
        this.updateProgress();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('question-container');
        
        container.innerHTML = `
            <div class="question-card white-bg">
                <div class="question-header">
                    <span class="question-number ash-text">Question ${this.currentQuestion + 1} of ${this.totalQuestions}</span>
                    <h3 class="question-title">${question.question}</h3>
                </div>
                <div class="question-content">
                    ${this.renderQuestionInput(question)}
                </div>
                <div class="question-navigation">
                    ${this.currentQuestion > 0 ? '<button class="nav-btn secondary" onclick="symptomChecker.previousQuestion()">Previous</button>' : ''}
                    <button class="nav-btn primary" onclick="symptomChecker.nextQuestion()" ${!this.isAnswered(question.id) ? 'disabled' : ''}>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Complete' : 'Next'}
                    </button>
                </div>
            </div>
        `;
    }

    renderQuestionInput(question) {
        switch(question.type) {
            case 'multiple':
                return this.renderMultipleChoice(question);
            case 'checkbox':
                return this.renderCheckbox(question);
            case 'scale':
                return this.renderScale(question);
            case 'number':
                return this.renderNumber(question);
            case 'text':
                return this.renderText(question);
        }
    }

    renderMultipleChoice(question) {
        let html = '<div class="options-grid">';
        question.options.forEach(option => {
            const selected = this.responses[question.id] === option;
            html += `
                <button class="option-btn ash-bg ${selected ? 'selected' : ''}" 
                        onclick="symptomChecker.selectSingle(${question.id}, '${option}')">
                    ${option}
                </button>`;
        });
        return html + '</div>';
    }

    renderCheckbox(question) {
        let html = '<div class="options-grid">';
        question.options.forEach(option => {
            const selected = this.responses[question.id]?.includes(option);
            html += `
                <button class="option-btn ash-bg ${selected ? 'selected' : ''}" 
                        onclick="symptomChecker.selectMultiple(${question.id}, '${option}')">
                    <i class="fas ${selected ? 'fa-check-square' : 'fa-square'}"></i>
                    ${option}
                </button>`;
        });
        return html + '</div>';
    }

    renderScale(question) {
        const value = this.responses[question.id] || question.min;
        return `
            <div class="scale-container ash-bg">
                <div class="scale-labels">
                    <span>${question.min}</span>
                    <span>${question.max}</span>
                </div>
                <input type="range" min="${question.min}" max="${question.max}" 
                       value="${value}" class="scale-slider"
                       oninput="symptomChecker.updateScale(${question.id}, this.value)">
                <div class="scale-value">
                    <span id="scale-${question.id}">${value}</span>
                </div>
            </div>`;
    }

    renderNumber(question) {
        const value = this.responses[question.id] || '';
        return `
            <div class="number-container">
                <input type="number" min="${question.min}" max="${question.max}" 
                       value="${value}" class="number-input ash-bg"
                       oninput="symptomChecker.updateNumber(${question.id}, this.value)"
                       placeholder="Enter value">
            </div>`;
    }

    renderText(question) {
        const value = this.responses[question.id] || '';
        return `
            <div class="text-container">
                <textarea class="text-input ash-bg" 
                          placeholder="${question.placeholder}"
                          oninput="symptomChecker.updateText(${question.id}, this.value)">${value}</textarea>
            </div>`;
    }

    selectSingle(questionId, value) {
        this.responses[questionId] = value;
        this.renderQuestion();
    }

    selectMultiple(questionId, value) {
        if (!this.responses[questionId]) this.responses[questionId] = [];
        const index = this.responses[questionId].indexOf(value);
        if (index > -1) {
            this.responses[questionId].splice(index, 1);
        } else {
            this.responses[questionId].push(value);
        }
        this.renderQuestion();
    }

    updateScale(questionId, value) {
        this.responses[questionId] = parseInt(value);
        document.getElementById(`scale-${questionId}`).textContent = value;
        this.updateButtons();
    }

    updateNumber(questionId, value) {
        this.responses[questionId] = value ? parseInt(value) : null;
        this.updateButtons();
    }

    updateText(questionId, value) {
        this.responses[questionId] = value;
        this.updateButtons();
    }

    isAnswered(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question.required) return true;
        
        const response = this.responses[questionId];
        if (question.type === 'checkbox') {
            return response && response.length > 0;
        }
        return response !== undefined && response !== null && response !== '';
    }

    updateButtons() {
        const nextBtn = document.querySelector('.nav-btn.primary');
        if (nextBtn) {
            const question = this.questions[this.currentQuestion];
            nextBtn.disabled = !this.isAnswered(question.id);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
        } else {
            this.completeAssessment();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateProgress();
        }
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const percentage = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${this.currentQuestion + 1} of ${this.totalQuestions}`;
    }

    async completeAssessment() {
        this.showLoading();
        setTimeout(() => {
            const analysis = this.analyzeSymptoms();
            this.showResults(analysis);
        }, 2000);
    }

    analyzeSymptoms() {
        // Calculate detailed risk score
        const painLevel = this.responses[2] || 0;
        const temperature = this.responses[8] || 98.6;
        const emergencySymptoms = this.responses[4] || [];
        const neurologicalSymptoms = this.responses[9] || [];
        const breathingIssues = this.responses[22];
        const activityImpact = this.responses[26];
        const stressLevel = this.responses[17] || 1;
        const energyLevel = this.responses[19] || 10;

        let riskScore = 0;

        // Pain contribution (0-20 points)
        riskScore += (painLevel / 10) * 20;

        // Temperature contribution (0-15 points)
        if (temperature >= 103) riskScore += 15;
        else if (temperature >= 101) riskScore += 10;
        else if (temperature >= 99.5) riskScore += 5;

        // Emergency symptoms (0-25 points)
        const criticalSymptoms = ['Shortness of breath', 'Rapid heartbeat', 'Confusion', 'Severe weakness'];
        const criticalCount = emergencySymptoms.filter(s => criticalSymptoms.includes(s)).length;
        riskScore += criticalCount * 8;

        // Neurological symptoms (0-20 points)
        const seriousNeuro = ['Seizures', 'Speech problems', 'Vision changes', 'Severe weakness'];
        const neuroCount = neurologicalSymptoms.filter(s => seriousNeuro.includes(s)).length;
        riskScore += neuroCount * 10;

        // Breathing issues (0-15 points)
        const breathingScores = {
            'Can\'t catch breath': 15,
            'Severely short': 12,
            'Moderately short': 8,
            'Slightly short': 4,
            'Normal': 0
        };
        riskScore += breathingScores[breathingIssues] || 0;

        // Activity impact (0-5 points)
        const impactScores = {
            'Need assistance': 5,
            'Unable to perform activities': 4,
            'Severely limiting': 3,
            'Moderately limiting': 2,
            'Slightly limiting': 1,
            'No impact': 0
        };
        riskScore += impactScores[activityImpact] || 0;

        riskScore = Math.min(riskScore, 100);

        // Determine urgency
        let urgencyLevel = 'Low';
        let urgencyColor = '#27ae60';
        
        if (riskScore >= 70 || criticalCount > 0 || neuroCount > 0) {
            urgencyLevel = 'High';
            urgencyColor = '#e74c3c';
        } else if (riskScore >= 40) {
            urgencyLevel = 'Moderate';
            urgencyColor = '#f39c12';
        }

        // Generate possible conditions
        const primarySymptom = this.responses[1];
        const possibleConditions = this.getPossibleConditions(primarySymptom, this.responses);

        // Generate recommendations
        const recommendations = this.generateRecommendations(urgencyLevel, riskScore, this.responses);

        // Generate next steps
        const nextSteps = this.generateNextSteps(urgencyLevel, riskScore);

        return {
            riskScore,
            urgencyLevel,
            urgencyColor,
            possibleConditions,
            recommendations,
            nextSteps,
            keyFindings: this.getKeyFindings(this.responses),
            timeline: this.getTimeline(urgencyLevel),
            primaryConcern: primarySymptom,
            isEmergency: urgencyLevel === 'High' && riskScore >= 80
        };
    }

    getPossibleConditions(primarySymptom, responses) {
        const conditionMap = {
            'Headache': ['Tension headache', 'Migraine', 'Cluster headache', 'Sinus infection'],
            'Chest pain': ['Angina', 'Anxiety', 'GERD', 'Muscle strain'],
            'Abdominal pain': ['Gastritis', 'Appendicitis', 'IBS', 'Food poisoning'],
            'Back pain': ['Muscle strain', 'Herniated disc', 'Arthritis', 'Sciatica'],
            'Joint pain': ['Arthritis', 'Bursitis', 'Tendinitis', 'Injury'],
            'Breathing issues': ['Asthma', 'Bronchitis', 'Pneumonia', 'Anxiety'],
            'Fatigue': ['Anemia', 'Thyroid disorder', 'Depression', 'Viral infection'],
            'Skin problems': ['Allergic reaction', 'Eczema', 'Infection', 'Dermatitis'],
            'Digestive issues': ['IBS', 'Gastroenteritis', 'GERD', 'Food intolerance']
        };

        return conditionMap[primarySymptom] || ['Requires medical evaluation'];
    }

    generateRecommendations(urgencyLevel, riskScore, responses) {
        if (urgencyLevel === 'High') {
            return [
                'Seek immediate medical attention',
                'Go to emergency room or call 911',
                'Do not drive yourself',
                'Bring list of current medications',
                'Have someone stay with you'
            ];
        }

        if (urgencyLevel === 'Moderate') {
            return [
                'Contact your doctor today',
                'Monitor symptoms closely',
                'Rest and avoid strenuous activity',
                'Stay hydrated',
                'Use over-the-counter pain relief as appropriate'
            ];
        }

        return [
            'Monitor symptoms for 24-48 hours',
            'Rest and maintain normal activities as tolerated',
            'Stay hydrated and eat well',
            'Use home remedies as appropriate',
            'Contact doctor if symptoms worsen'
        ];
    }

    generateNextSteps(urgencyLevel, riskScore) {
        if (urgencyLevel === 'High') {
            return [
                'Immediate: Seek emergency care',
                'Call 911 or go to emergency room',
                'Do not delay treatment'
            ];
        }

        if (urgencyLevel === 'Moderate') {
            return [
                'Today: Contact healthcare provider',
                'Schedule appointment within 24-48 hours',
                'Monitor symptoms and keep symptom diary'
            ];
        }

        return [
            'Monitor symptoms for 1-2 days',
            'Try appropriate self-care measures',
            'Contact doctor if no improvement or worsening'
        ];
    }

    getKeyFindings(responses) {
        const findings = [];
        
        if (responses[2] >= 7) findings.push(`High pain level (${responses[2]}/10)`);
        if (responses[8] >= 101) findings.push(`Fever present (${responses[8]}°F)`);
        if (responses[4]?.length > 2) findings.push('Multiple concerning symptoms');
        if (responses[26] === 'Unable to perform activities') findings.push('Severe functional impairment');
        if (responses[17] >= 8) findings.push('High stress level');
        if (responses[19] <= 3) findings.push('Very low energy level');

        return findings;
    }

    getTimeline(urgencyLevel) {
        const timelines = {
            'High': 'Immediate action required',
            'Moderate': 'Seek care within 24-48 hours',
            'Low': 'Monitor for 1-2 days, seek care if worsening'
        };
        return timelines[urgencyLevel];
    }

    showLoading() {
        document.getElementById('assessment-container').innerHTML = `
            <div class="loading-container white-bg">
                <div class="loading-spinner"></div>
                <h3>Analyzing Your Symptoms</h3>
                <p class="ash-text">Processing 30 data points and generating personalized assessment...</p>
            </div>
        `;
    }

    showResults(analysis) {
        document.getElementById('assessment-container').innerHTML = `
            <div class="results-container white-bg">
                <div class="results-header ash-bg">
                    <h2>Symptom Analysis Complete</h2>
                    <div class="urgency-badge" style="background-color: ${analysis.urgencyColor};">
                        ${analysis.urgencyLevel} Priority
                    </div>
                </div>

                <div class="results-summary">
                    <div class="summary-card ash-bg">
                        <h3>Risk Assessment</h3>
                        <div class="risk-score">
                            <span class="score-number">${analysis.riskScore}</span>
                            <span class="score-total">/100</span>
                        </div>
                    </div>

                    <div class="summary-card ash-bg">
                        <h3>Primary Concern</h3>
                        <p class="concern-text">${analysis.primaryConcern}</p>
                    </div>

                    <div class="summary-card ash-bg">
                        <h3>Recommended Timeline</h3>
                        <p class="timeline-text">${analysis.timeline}</p>
                    </div>
                </div>

                ${analysis.isEmergency ? `
                    <div class="emergency-alert">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Emergency Situation Detected</h3>
                        <p>Based on your symptoms, immediate medical attention is strongly recommended.</p>
                    </div>
                ` : ''}

                <div class="analysis-details">
                    <div class="detail-section ash-bg">
                        <h3>Possible Conditions</h3>
                        <ul class="condition-list">
                            ${analysis.possibleConditions.map(condition => `<li>${condition}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section ash-bg">
                        <h3>Recommendations</h3>
                        <ul class="recommendation-list">
                            ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section ash-bg">
                        <h3>Next Steps</h3>
                        <ul class="next-steps-list">
                            ${analysis.nextSteps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>

                    ${analysis.keyFindings.length > 0 ? `
                        <div class="detail-section ash-bg">
                            <h3>Key Findings</h3>
                            <ul class="findings-list">
                                ${analysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="symptomChecker.downloadReport()">
                        <i class="fas fa-download"></i>
                        Download Report
                    </button>
                    <button class="action-btn secondary" onclick="symptomChecker.startNew()">
                        <i class="fas fa-redo"></i>
                        New Assessment
                    </button>
                    <button class="action-btn secondary" onclick="symptomChecker.shareResults()">
                        <i class="fas fa-share"></i>
                        Share Results
                    </button>
                </div>

                <div class="medical-disclaimer ash-bg">
                    <h4><i class="fas fa-info-circle"></i> Important Medical Disclaimer</h4>
                    <p>This assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper medical evaluation and care.</p>
                </div>
            </div>
        `;

        this.lastAnalysis = analysis;
    }

    async downloadReport() {
        // Generate comprehensive PDF report
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add comprehensive content
        this.generateDetailedPDF(doc, this.lastAnalysis);
        
        doc.save(`symptom-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    generateDetailedPDF(doc, analysis) {
        let y = 20;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text('Comprehensive Symptom Analysis Report', 20, y);
        y += 15;

        // Report details
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Report ID: SYM-${this.sessionId}`, 20, y);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 120, y);
        y += 20;

        // Executive Summary
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('Executive Summary', 20, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Urgency Level: ${analysis.urgencyLevel}`, 20, y);
        y += 7;
        doc.text(`Risk Score: ${analysis.riskScore}/100`, 20, y);
        y += 7;
        doc.text(`Primary Concern: ${analysis.primaryConcern}`, 20, y);
        y += 15;

        // Detailed Analysis
        doc.setFontSize(16);
        doc.text('Detailed Analysis', 20, y);
        y += 10;

        doc.setFontSize(12);
        doc.text('Possible Conditions:', 20, y);
        y += 7;
        analysis.possibleConditions.forEach(condition => {
            doc.text(`• ${condition}`, 25, y);
            y += 6;
        });

        y += 10;
        doc.text('Recommendations:', 20, y);
        y += 7;
        analysis.recommendations.forEach(rec => {
            const lines = doc.splitTextToSize(`• ${rec}`, 165);
            doc.text(lines, 25, y);
            y += lines.length * 6 + 2;
        });

        y += 10;
        doc.text('Next Steps:', 20, y);
        y += 7;
        analysis.nextSteps.forEach(step => {
            const lines = doc.splitTextToSize(`• ${step}`, 165);
            doc.text(lines, 25, y);
            y += lines.length * 6 + 2;
        });

        // Key Findings
        if (analysis.keyFindings.length > 0) {
            y += 15;
            doc.setFontSize(16);
            doc.text('Key Findings', 20, y);
            y += 10;

            doc.setFontSize(12);
            analysis.keyFindings.forEach(finding => {
                doc.text(`• ${finding}`, 25, y);
                y += 6;
            });
        }

        // Disclaimer
        y += 20;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        const disclaimer = "MEDICAL DISCLAIMER: This assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper medical evaluation and care. In case of emergency, call 911 immediately.";
        const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
        doc.text(disclaimerLines, 20, y);
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'Symptom Analysis Results',
                text: `Symptom analysis completed. Urgency: ${this.lastAnalysis.urgencyLevel}, Risk Score: ${this.lastAnalysis.riskScore}/100`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const text = `Symptom Analysis Results:\nUrgency: ${this.lastAnalysis.urgencyLevel}\nRisk Score: ${this.lastAnalysis.riskScore}/100\nTimeline: ${this.lastAnalysis.timeline}`;
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    startNew() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = Date.now().toString();
        this.lastAnalysis = null;
        this.init();
    }
}

// Initialize
let symptomChecker;
document.addEventListener('DOMContentLoaded', () => {
    symptomChecker = new SymptomChecker30Q();
    symptomChecker.init();
}); 