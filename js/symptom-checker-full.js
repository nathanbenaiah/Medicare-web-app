class SymptomCheckerAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = this.generateSessionId();
        this.questions = this.getQuestions();
        this.totalQuestions = this.questions.length;
    }

    getQuestions() {
        return [
            {
                id: 1,
                type: 'multiple',
                question: "What is your primary symptom or concern?",
                options: [
                    "Headache or head pain",
                    "Chest pain or discomfort", 
                    "Abdominal pain",
                    "Back pain",
                    "Joint pain",
                    "Skin issues",
                    "Breathing problems",
                    "Digestive issues",
                    "Fatigue or weakness",
                    "Other"
                ],
                required: true
            },
            {
                id: 2,
                type: 'scale',
                question: "Rate your pain level (1-10, where 10 is severe)",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 3,
                type: 'multiple',
                question: "When did your symptoms start?",
                options: [
                    "Less than 1 hour ago",
                    "1-6 hours ago",
                    "6-24 hours ago",
                    "1-3 days ago",
                    "4-7 days ago",
                    "1-2 weeks ago",
                    "More than 2 weeks ago"
                ],
                required: true
            },
            {
                id: 4,
                type: 'checkbox',
                question: "Select all symptoms you're currently experiencing:",
                options: [
                    "Fever or chills",
                    "Nausea or vomiting",
                    "Dizziness",
                    "Shortness of breath",
                    "Rapid heartbeat",
                    "Sweating",
                    "Confusion",
                    "Severe weakness",
                    "Loss of consciousness",
                    "None of these"
                ],
                required: true
            },
            {
                id: 5,
                type: 'multiple',
                question: "How would you describe the nature of your pain?",
                options: [
                    "Sharp or stabbing",
                    "Dull or aching",
                    "Burning",
                    "Cramping",
                    "Throbbing",
                    "Pressure-like",
                    "Electric shock-like",
                    "No pain present"
                ],
                required: true
            },
            {
                id: 6,
                type: 'multiple',
                question: "Does anything make your symptoms better?",
                options: [
                    "Rest",
                    "Movement or exercise",
                    "Heat application",
                    "Cold application",
                    "Over-the-counter medications",
                    "Prescription medications",
                    "Food or water",
                    "Nothing helps"
                ],
                required: true
            },
            {
                id: 7,
                type: 'multiple',
                question: "Does anything make your symptoms worse?",
                options: [
                    "Physical activity",
                    "Certain positions",
                    "Eating or drinking",
                    "Stress",
                    "Weather changes",
                    "Touch or pressure",
                    "Deep breathing",
                    "Nothing makes it worse"
                ],
                required: true
            },
            {
                id: 8,
                type: 'number',
                question: "What is your current temperature (°F)? (Enter 0 if unknown)",
                min: 0,
                max: 110,
                required: true
            },
            {
                id: 9,
                type: 'checkbox',
                question: "Do you have any of these associated symptoms?",
                options: [
                    "Difficulty breathing",
                    "Chest tightness",
                    "Irregular heartbeat",
                    "Severe headache",
                    "Vision changes",
                    "Speech difficulties",
                    "Numbness or tingling",
                    "Severe dizziness",
                    "Loss of balance",
                    "None of these"
                ],
                required: true
            },
            {
                id: 10,
                type: 'multiple',
                question: "Have you traveled recently?",
                options: [
                    "No recent travel",
                    "Domestic travel (within country)",
                    "International travel",
                    "Travel to areas with known health risks",
                    "Exposure to sick individuals while traveling"
                ],
                required: true
            },
            {
                id: 11,
                type: 'checkbox',
                question: "Do you have any known allergies?",
                options: [
                    "Food allergies",
                    "Medication allergies",
                    "Environmental allergies",
                    "Latex allergy",
                    "Animal allergies",
                    "Insect sting allergies",
                    "No known allergies"
                ],
                required: true
            },
            {
                id: 12,
                type: 'checkbox',
                question: "Are you currently taking any medications?",
                options: [
                    "Blood pressure medications",
                    "Diabetes medications",
                    "Heart medications",
                    "Blood thinners",
                    "Pain medications",
                    "Antibiotics",
                    "Vitamins/supplements",
                    "Birth control",
                    "Antidepressants",
                    "No medications"
                ],
                required: true
            },
            {
                id: 13,
                type: 'multiple',
                question: "Have you had any recent injuries?",
                options: [
                    "No recent injuries",
                    "Head injury",
                    "Fall or trauma",
                    "Sports injury",
                    "Car accident",
                    "Work-related injury",
                    "Cut or wound"
                ],
                required: true
            },
            {
                id: 14,
                type: 'multiple',
                question: "How is your appetite?",
                options: [
                    "Normal appetite",
                    "Increased appetite",
                    "Decreased appetite",
                    "No appetite at all",
                    "Nausea when eating",
                    "Difficulty swallowing"
                ],
                required: true
            },
            {
                id: 15,
                type: 'multiple',
                question: "How has your sleep been affected?",
                options: [
                    "Sleeping normally",
                    "Difficulty falling asleep",
                    "Waking up frequently",
                    "Waking up early",
                    "Sleeping more than usual",
                    "Pain interrupting sleep",
                    "Unable to sleep at all"
                ],
                required: true
            },
            {
                id: 16,
                type: 'checkbox',
                question: "Do you have any chronic medical conditions?",
                options: [
                    "Diabetes",
                    "High blood pressure",
                    "Heart disease",
                    "Asthma",
                    "Arthritis",
                    "Cancer",
                    "Kidney disease",
                    "Liver disease",
                    "Mental health conditions",
                    "No chronic conditions"
                ],
                required: true
            },
            {
                id: 17,
                type: 'multiple',
                question: "How would you rate your overall stress level?",
                options: [
                    "Very low stress",
                    "Low stress",
                    "Moderate stress",
                    "High stress",
                    "Very high stress",
                    "Overwhelming stress"
                ],
                required: true
            },
            {
                id: 18,
                type: 'multiple',
                question: "Have you been exposed to anyone with illness recently?",
                options: [
                    "No known exposure",
                    "Family member with illness",
                    "Coworker with illness",
                    "Healthcare setting exposure",
                    "Public gathering exposure",
                    "School/daycare exposure"
                ],
                required: true
            },
            {
                id: 19,
                type: 'scale',
                question: "Rate your energy level today (1-10, where 10 is full energy)",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 20,
                type: 'multiple',
                question: "Have you noticed any changes in your bowel movements?",
                options: [
                    "Normal bowel movements",
                    "Constipation",
                    "Diarrhea",
                    "Blood in stool",
                    "Black or tarry stool",
                    "Severe cramping",
                    "No bowel movement in 3+ days"
                ],
                required: true
            },
            {
                id: 21,
                type: 'multiple',
                question: "Have you noticed any changes in urination?",
                options: [
                    "Normal urination",
                    "Frequent urination",
                    "Painful urination",
                    "Blood in urine",
                    "Difficulty urinating",
                    "Inability to urinate",
                    "Strong odor or unusual color"
                ],
                required: true
            },
            {
                id: 22,
                type: 'checkbox',
                question: "Are you experiencing any of these neurological symptoms?",
                options: [
                    "Memory problems",
                    "Confusion",
                    "Difficulty concentrating",
                    "Seizures",
                    "Tremors",
                    "Muscle weakness",
                    "Coordination problems",
                    "Speech problems",
                    "Vision changes",
                    "None of these"
                ],
                required: true
            },
            {
                id: 23,
                type: 'multiple',
                question: "How would you describe your breathing?",
                options: [
                    "Normal breathing",
                    "Slightly short of breath",
                    "Moderately short of breath",
                    "Severely short of breath",
                    "Unable to catch breath",
                    "Wheezing or whistling sounds",
                    "Coughing with breathing"
                ],
                required: true
            },
            {
                id: 24,
                type: 'multiple',
                question: "Are you experiencing any skin changes?",
                options: [
                    "No skin changes",
                    "Rash or redness",
                    "Itching",
                    "Swelling",
                    "Bruising",
                    "Cuts or wounds",
                    "Color changes",
                    "New moles or growths"
                ],
                required: true
            },
            {
                id: 25,
                type: 'scale',
                question: "Rate your anxiety level about these symptoms (1-10)",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 26,
                type: 'multiple',
                question: "Have you tried any treatments for these symptoms?",
                options: [
                    "No treatments tried",
                    "Over-the-counter pain relievers",
                    "Home remedies",
                    "Prescription medications",
                    "Physical therapy",
                    "Alternative treatments",
                    "Previous doctor visit"
                ],
                required: true
            },
            {
                id: 27,
                type: 'multiple',
                question: "How are these symptoms affecting your daily activities?",
                options: [
                    "Not affecting activities",
                    "Slightly limiting activities",
                    "Moderately limiting activities",
                    "Severely limiting activities",
                    "Unable to perform daily activities",
                    "Requiring assistance from others"
                ],
                required: true
            },
            {
                id: 28,
                type: 'multiple',
                question: "Do you have a family history of similar symptoms or conditions?",
                options: [
                    "No family history",
                    "Similar symptoms in family",
                    "Heart disease in family",
                    "Cancer in family",
                    "Diabetes in family",
                    "Mental health conditions in family",
                    "Unknown family history"
                ],
                required: true
            },
            {
                id: 29,
                type: 'checkbox',
                question: "Which of these best describes your lifestyle factors?",
                options: [
                    "Regular exercise",
                    "Sedentary lifestyle",
                    "Healthy diet",
                    "Poor diet",
                    "Regular sleep schedule",
                    "Irregular sleep",
                    "Tobacco use",
                    "Alcohol use",
                    "High stress job",
                    "Social support system"
                ],
                required: true
            },
            {
                id: 30,
                type: 'text',
                question: "Please describe any other symptoms or concerns you haven't mentioned:",
                placeholder: "Additional symptoms, concerns, or information...",
                required: false
            }
        ];
    }

    init() {
        this.renderQuestion();
        this.updateProgress();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('question-container');
        
        let html = `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Question ${this.currentQuestion + 1} of ${this.totalQuestions}</span>
                    <h3>${question.question}</h3>
                </div>
                <div class="question-content">
        `;

        switch(question.type) {
            case 'multiple':
                html += this.renderMultipleChoice(question);
                break;
            case 'checkbox':
                html += this.renderCheckbox(question);
                break;
            case 'scale':
                html += this.renderScale(question);
                break;
            case 'number':
                html += this.renderNumber(question);
                break;
            case 'text':
                html += this.renderText(question);
                break;
        }

        html += `
                </div>
                <div class="question-navigation">
                    ${this.currentQuestion > 0 ? '<button class="nav-btn prev-btn" onclick="symptomChecker.previousQuestion()">Previous</button>' : ''}
                    <button class="nav-btn next-btn" onclick="symptomChecker.nextQuestion()" ${!this.isQuestionAnswered(question) ? 'disabled' : ''}>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Complete Assessment' : 'Next'}
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.attachEventListeners();
    }

    renderMultipleChoice(question) {
        let html = '<div class="options-grid">';
        question.options.forEach((option, index) => {
            const isSelected = this.responses[question.id] === option;
            html += `
                <button class="option-btn ${isSelected ? 'selected' : ''}" 
                        onclick="symptomChecker.selectOption(${question.id}, '${option}', 'single')">
                    ${option}
                </button>
            `;
        });
        html += '</div>';
        return html;
    }

    renderCheckbox(question) {
        let html = '<div class="options-grid checkbox-grid">';
        question.options.forEach((option, index) => {
            const isSelected = this.responses[question.id] && this.responses[question.id].includes(option);
            html += `
                <button class="option-btn checkbox-btn ${isSelected ? 'selected' : ''}" 
                        onclick="symptomChecker.selectOption(${question.id}, '${option}', 'multiple')">
                    <i class="fas ${isSelected ? 'fa-check-square' : 'fa-square'}"></i>
                    ${option}
                </button>
            `;
        });
        html += '</div>';
        return html;
    }

    renderScale(question) {
        const currentValue = this.responses[question.id] || question.min;
        return `
            <div class="scale-container">
                <div class="scale-labels">
                    <span>${question.min}</span>
                    <span>${question.max}</span>
                </div>
                <input type="range" 
                       min="${question.min}" 
                       max="${question.max}" 
                       value="${currentValue}"
                       class="scale-input"
                       oninput="symptomChecker.updateScale(${question.id}, this.value)">
                <div class="scale-value">
                    <span id="scale-value-${question.id}">${currentValue}</span>
                </div>
            </div>
        `;
    }

    renderNumber(question) {
        const currentValue = this.responses[question.id] || '';
        return `
            <div class="number-input-container">
                <input type="number" 
                       min="${question.min}" 
                       max="${question.max}" 
                       value="${currentValue}"
                       class="number-input"
                       placeholder="Enter value"
                       oninput="symptomChecker.updateNumber(${question.id}, this.value)">
            </div>
        `;
    }

    renderText(question) {
        const currentValue = this.responses[question.id] || '';
        return `
            <div class="text-input-container">
                <textarea class="text-input"
                          placeholder="${question.placeholder || 'Enter your response...'}"
                          oninput="symptomChecker.updateText(${question.id}, this.value)">${currentValue}</textarea>
            </div>
        `;
    }

    selectOption(questionId, value, type) {
        if (type === 'single') {
            this.responses[questionId] = value;
        } else if (type === 'multiple') {
            if (!this.responses[questionId]) {
                this.responses[questionId] = [];
            }
            const index = this.responses[questionId].indexOf(value);
            if (index > -1) {
                this.responses[questionId].splice(index, 1);
            } else {
                this.responses[questionId].push(value);
            }
        }
        this.renderQuestion();
        this.updateProgress();
    }

    updateScale(questionId, value) {
        this.responses[questionId] = parseInt(value);
        document.getElementById(`scale-value-${questionId}`).textContent = value;
        this.updateNavigationButtons();
    }

    updateNumber(questionId, value) {
        this.responses[questionId] = value ? parseInt(value) : null;
        this.updateNavigationButtons();
    }

    updateText(questionId, value) {
        this.responses[questionId] = value;
        this.updateNavigationButtons();
    }

    isQuestionAnswered(question) {
        const response = this.responses[question.id];
        if (!question.required) return true;
        
        if (question.type === 'checkbox') {
            return response && response.length > 0;
        }
        return response !== undefined && response !== null && response !== '';
    }

    updateNavigationButtons() {
        const question = this.questions[this.currentQuestion];
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.disabled = !this.isQuestionAnswered(question);
        }
    }

    attachEventListeners() {
        // Add any additional event listeners here
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
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${this.currentQuestion + 1} of ${this.totalQuestions}`;
        }
    }

    async completeAssessment() {
        this.showLoading();
        
        try {
            const analysis = await this.analyzeSymptoms();
            this.showResults(analysis);
        } catch (error) {
            console.error('Assessment error:', error);
            this.showError('Unable to complete analysis. Please try again.');
        }
    }

    async analyzeSymptoms() {
        // Calculate severity and urgency
        const painLevel = this.responses[2] || 0;
        const emergencySymptoms = this.responses[4] || [];
        const associatedSymptoms = this.responses[9] || [];
        const breathingIssues = this.responses[23];
        const activityImpact = this.responses[27];

        // Emergency check
        const emergencyConditions = [
            'Loss of consciousness',
            'Severe weakness',
            'Difficulty breathing',
            'Chest tightness',
            'Irregular heartbeat',
            'Severe headache',
            'Speech difficulties'
        ];

        const hasEmergency = emergencySymptoms.some(symptom => emergencyConditions.includes(symptom)) ||
                           associatedSymptoms.some(symptom => emergencyConditions.includes(symptom)) ||
                           breathingIssues === 'Unable to catch breath' ||
                           painLevel >= 9;

        // Calculate risk score
        let riskScore = this.calculateRiskScore();
        
        // Generate analysis
        const analysis = {
            urgencyLevel: this.getUrgencyLevel(riskScore, hasEmergency),
            riskScore: riskScore,
            primaryConcern: this.responses[1],
            possibleConditions: this.getPossibleConditions(),
            recommendations: this.getRecommendations(riskScore, hasEmergency),
            redFlags: this.getRedFlags(),
            nextSteps: this.getNextSteps(riskScore, hasEmergency),
            timeline: this.getTimeline(riskScore, hasEmergency),
            isEmergency: hasEmergency,
            keyFindings: this.getKeyFindings()
        };

        return analysis;
    }

    calculateRiskScore() {
        let score = 0;
        
        // Pain level contribution (0-25 points)
        const painLevel = this.responses[2] || 0;
        score += (painLevel / 10) * 25;

        // Symptom duration (0-20 points)
        const duration = this.responses[3];
        const durationScores = {
            'Less than 1 hour ago': 15,
            '1-6 hours ago': 12,
            '6-24 hours ago': 8,
            '1-3 days ago': 5,
            '4-7 days ago': 3,
            '1-2 weeks ago': 2,
            'More than 2 weeks ago': 1
        };
        score += durationScores[duration] || 0;

        // Emergency symptoms (0-30 points)
        const emergencySymptoms = this.responses[4] || [];
        score += emergencySymptoms.length * 5;

        // Associated symptoms (0-25 points)
        const associatedSymptoms = this.responses[9] || [];
        score += associatedSymptoms.length * 3;

        return Math.min(score, 100);
    }

    getUrgencyLevel(riskScore, hasEmergency) {
        if (hasEmergency) return 'Emergency';
        if (riskScore >= 70) return 'High';
        if (riskScore >= 40) return 'Moderate';
        return 'Low';
    }

    getPossibleConditions() {
        const primarySymptom = this.responses[1];
        const painType = this.responses[5];
        const associatedSymptoms = this.responses[9] || [];

        // This is a simplified condition mapping
        const conditionMap = {
            'Headache or head pain': ['Tension headache', 'Migraine', 'Cluster headache', 'Sinus headache'],
            'Chest pain or discomfort': ['Angina', 'Heart attack', 'Anxiety', 'Gastroesophageal reflux'],
            'Abdominal pain': ['Gastritis', 'Appendicitis', 'Gallbladder disease', 'Peptic ulcer'],
            'Back pain': ['Muscle strain', 'Herniated disc', 'Sciatica', 'Spinal stenosis'],
            'Joint pain': ['Arthritis', 'Bursitis', 'Tendinitis', 'Gout'],
            'Breathing problems': ['Asthma', 'Pneumonia', 'Bronchitis', 'Anxiety'],
            'Digestive issues': ['IBS', 'Food poisoning', 'Gastroenteritis', 'Acid reflux'],
            'Fatigue or weakness': ['Anemia', 'Thyroid disorder', 'Depression', 'Chronic fatigue syndrome']
        };

        return conditionMap[primarySymptom] || ['General medical evaluation needed'];
    }

    getRecommendations(riskScore, hasEmergency) {
        if (hasEmergency) {
            return [
                'Seek immediate emergency medical care',
                'Call 911 or go to emergency room',
                'Do not drive yourself',
                'Have someone stay with you'
            ];
        }

        if (riskScore >= 70) {
            return [
                'Contact your doctor today',
                'Consider urgent care if doctor unavailable',
                'Monitor symptoms closely',
                'Avoid strenuous activities'
            ];
        }

        if (riskScore >= 40) {
            return [
                'Schedule appointment with doctor within 1-2 days',
                'Rest and avoid aggravating activities',
                'Use over-the-counter pain relief as needed',
                'Monitor for worsening symptoms'
            ];
        }

        return [
            'Monitor symptoms for 24-48 hours',
            'Rest and maintain hydration',
            'Use home remedies as appropriate',
            'Contact doctor if symptoms worsen'
        ];
    }

    getRedFlags() {
        const emergencySymptoms = this.responses[4] || [];
        const associatedSymptoms = this.responses[9] || [];
        const painLevel = this.responses[2] || 0;

        const redFlags = [];

        if (painLevel >= 8) {
            redFlags.push('Severe pain level');
        }

        const criticalSymptoms = [
            'Loss of consciousness',
            'Severe weakness',
            'Difficulty breathing',
            'Chest tightness',
            'Irregular heartbeat',
            'Severe headache',
            'Speech difficulties'
        ];

        criticalSymptoms.forEach(symptom => {
            if (emergencySymptoms.includes(symptom) || associatedSymptoms.includes(symptom)) {
                redFlags.push(symptom);
            }
        });

        return redFlags;
    }

    getNextSteps(riskScore, hasEmergency) {
        if (hasEmergency) {
            return [
                'Immediate: Seek emergency care',
                'Call 911 or go to ER',
                'Do not delay treatment'
            ];
        }

        if (riskScore >= 70) {
            return [
                'Today: Contact healthcare provider',
                'Within 24 hours: Medical evaluation',
                'Monitor symptoms closely'
            ];
        }

        if (riskScore >= 40) {
            return [
                'Within 1-2 days: Schedule doctor visit',
                'Continue symptom monitoring',
                'Use appropriate self-care measures'
            ];
        }

        return [
            'Monitor for 24-48 hours',
            'Self-care measures',
            'Contact doctor if worsening'
        ];
    }

    getTimeline(riskScore, hasEmergency) {
        if (hasEmergency) return 'Immediate action required';
        if (riskScore >= 70) return 'Seek care today';
        if (riskScore >= 40) return 'Seek care within 1-2 days';
        return 'Monitor and reassess in 24-48 hours';
    }

    getKeyFindings() {
        const findings = [];
        
        const painLevel = this.responses[2];
        if (painLevel >= 7) {
            findings.push(`High pain level reported (${painLevel}/10)`);
        }

        const duration = this.responses[3];
        if (duration === 'Less than 1 hour ago' || duration === '1-6 hours ago') {
            findings.push('Recent onset of symptoms');
        }

        const emergencySymptoms = this.responses[4] || [];
        if (emergencySymptoms.length > 0) {
            findings.push(`${emergencySymptoms.length} concerning symptoms present`);
        }

        const activityImpact = this.responses[27];
        if (activityImpact === 'Severely limiting activities' || activityImpact === 'Unable to perform daily activities') {
            findings.push('Significant impact on daily functioning');
        }

        return findings;
    }

    showLoading() {
        document.getElementById('assessment-container').innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h3>Analyzing Your Symptoms</h3>
                <p>Processing your responses and generating personalized recommendations...</p>
            </div>
        `;
    }

    showResults(analysis) {
        const resultsHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Symptom Analysis Results</h2>
                    <div class="urgency-badge urgency-${analysis.urgencyLevel.toLowerCase()}">
                        ${analysis.urgencyLevel} Priority
                    </div>
                </div>

                <div class="analysis-summary">
                    <div class="risk-score-card">
                        <h3>Risk Assessment</h3>
                        <div class="score-circle">
                            <span class="score-value">${analysis.riskScore}</span>
                            <span class="score-label">/ 100</span>
                        </div>
                    </div>

                    <div class="timeline-card">
                        <h3>Recommended Timeline</h3>
                        <p class="timeline-text">${analysis.timeline}</p>
                    </div>
                </div>

                ${analysis.isEmergency ? `
                    <div class="emergency-alert">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Emergency Situation Detected</h3>
                        <p>Based on your symptoms, immediate medical attention is recommended.</p>
                    </div>
                ` : ''}

                <div class="analysis-sections">
                    <div class="section">
                        <h3>Possible Conditions</h3>
                        <ul class="conditions-list">
                            ${analysis.possibleConditions.map(condition => `<li>${condition}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="section">
                        <h3>Recommendations</h3>
                        <ul class="recommendations-list">
                            ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="section">
                        <h3>Next Steps</h3>
                        <ul class="next-steps-list">
                            ${analysis.nextSteps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>

                    ${analysis.redFlags.length > 0 ? `
                        <div class="section warning">
                            <h3>Warning Signs Present</h3>
                            <ul class="red-flags-list">
                                ${analysis.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${analysis.keyFindings.length > 0 ? `
                        <div class="section">
                            <h3>Key Findings</h3>
                            <ul class="findings-list">
                                ${analysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="symptomChecker.downloadPDF()">
                        <i class="fas fa-download"></i>
                        Download Report
                    </button>
                    <button class="action-btn secondary" onclick="symptomChecker.startNew()">
                        <i class="fas fa-redo"></i>
                        New Assessment
                    </button>
                </div>

                <div class="medical-disclaimer">
                    <h4>Important Medical Disclaimer</h4>
                    <p>This assessment is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.</p>
                </div>
            </div>
        `;

        document.getElementById('assessment-container').innerHTML = resultsHTML;
        this.lastAnalysis = analysis;
    }

    showError(message) {
        document.getElementById('assessment-container').innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Assessment Error</h3>
                <p>${message}</p>
                <button class="action-btn primary" onclick="symptomChecker.init()">Try Again</button>
            </div>
        `;
    }

    async downloadPDF() {
        if (!this.lastAnalysis) return;

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Add content to PDF
            this.generatePDFContent(doc, this.lastAnalysis);

            // Download the PDF
            doc.save(`symptom-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Unable to generate PDF. Please try again.');
        }
    }

    generatePDFContent(doc, analysis) {
        let y = 20;

        // Header
        doc.setFontSize(20);
        doc.text('Symptom Analysis Report', 20, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
        y += 20;

        // Urgency Level
        doc.setFontSize(16);
        doc.text('Urgency Level:', 20, y);
        doc.setFontSize(14);
        doc.text(analysis.urgencyLevel, 80, y);
        y += 15;

        // Risk Score
        doc.setFontSize(16);
        doc.text('Risk Score:', 20, y);
        doc.setFontSize(14);
        doc.text(`${analysis.riskScore}/100`, 80, y);
        y += 15;

        // Timeline
        doc.setFontSize(16);
        doc.text('Timeline:', 20, y);
        doc.setFontSize(12);
        const timelineLines = doc.splitTextToSize(analysis.timeline, 150);
        doc.text(timelineLines, 20, y + 10);
        y += 10 + (timelineLines.length * 7) + 10;

        // Recommendations
        doc.setFontSize(16);
        doc.text('Recommendations:', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        analysis.recommendations.forEach((rec, index) => {
            const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
            doc.text(lines, 20, y);
            y += lines.length * 7 + 3;
        });

        y += 10;

        // Possible Conditions
        doc.setFontSize(16);
        doc.text('Possible Conditions:', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        analysis.possibleConditions.forEach((condition, index) => {
            doc.text(`• ${condition}`, 25, y);
            y += 7;
        });

        // Add disclaimer
        y += 20;
        doc.setFontSize(10);
        const disclaimer = "This assessment is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.";
        const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
        doc.text(disclaimerLines, 20, y);
    }

    startNew() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = this.generateSessionId();
        this.lastAnalysis = null;
        this.init();
    }

    generateSessionId() {
        return 'symptom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize when page loads
let symptomChecker;
document.addEventListener('DOMContentLoaded', function() {
    symptomChecker = new SymptomCheckerAssessment();
    symptomChecker.init();
}); 