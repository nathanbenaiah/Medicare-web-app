class MentalHealthAssessment30Q {
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
                question: "How would you rate your overall mental health today?",
                options: ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
            },
            {
                id: 2,
                type: 'scale',
                question: "On a scale of 1-10, how stressed do you feel right now?",
                min: 1,
                max: 10,
                labels: ["Not stressed", "Extremely stressed"]
            },
            {
                id: 3,
                type: 'multiple',
                question: "How often have you felt sad or depressed in the past 2 weeks?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: 4,
                type: 'multiple',
                question: "How well are you sleeping lately?",
                options: ["Very well", "Well", "Okay", "Poorly", "Very poorly"]
            },
            {
                id: 5,
                type: 'scale',
                question: "Rate your energy levels on a scale of 1-10",
                min: 1,
                max: 10,
                labels: ["No energy", "Very energetic"]
            },
            {
                id: 6,
                type: 'checkbox',
                question: "Which anxiety symptoms have you experienced recently? (Select all that apply)",
                options: ["Racing heart", "Shortness of breath", "Sweating", "Trembling", "Worry thoughts", "Panic attacks", "None"]
            },
            {
                id: 7,
                type: 'multiple',
                question: "How often do you feel overwhelmed by daily tasks?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: 8,
                type: 'scale',
                question: "Rate your concentration and focus levels (1-10)",
                min: 1,
                max: 10,
                labels: ["Cannot focus", "Excellent focus"]
            },
            {
                id: 9,
                type: 'multiple',
                question: "How satisfied are you with your relationships?",
                options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]
            },
            {
                id: 10,
                type: 'checkbox',
                question: "What coping strategies do you currently use? (Select all that apply)",
                options: ["Exercise", "Meditation", "Talking to friends", "Hobbies", "Professional therapy", "Medication", "None"]
            },
            {
                id: 11,
                type: 'multiple',
                question: "How often do you engage in activities you enjoy?",
                options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"]
            },
            {
                id: 12,
                type: 'scale',
                question: "Rate your self-esteem and confidence (1-10)",
                min: 1,
                max: 10,
                labels: ["Very low", "Very high"]
            },
            {
                id: 13,
                type: 'multiple',
                question: "Have you experienced any major life changes recently?",
                options: ["No changes", "Minor changes", "Moderate changes", "Major changes", "Multiple major changes"]
            },
            {
                id: 14,
                type: 'multiple',
                question: "How often do you feel lonely or isolated?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: 15,
                type: 'checkbox',
                question: "Which physical symptoms of stress do you experience? (Select all that apply)",
                options: ["Headaches", "Muscle tension", "Fatigue", "Stomach issues", "Changes in appetite", "Sleep problems", "None"]
            },
            {
                id: 16,
                type: 'scale',
                question: "Rate your ability to manage stress (1-10)",
                min: 1,
                max: 10,
                labels: ["Cannot manage", "Excellent management"]
            },
            {
                id: 17,
                type: 'multiple',
                question: "How often do you practice mindfulness or relaxation techniques?",
                options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"]
            },
            {
                id: 18,
                type: 'multiple',
                question: "Have you ever sought professional mental health support?",
                options: ["Currently seeing someone", "Previously saw someone", "Considering it", "Not interested", "No, but need to"]
            },
            {
                id: 19,
                type: 'scale',
                question: "Rate your work-life balance (1-10)",
                min: 1,
                max: 10,
                labels: ["Very poor", "Excellent balance"]
            },
            {
                id: 20,
                type: 'multiple',
                question: "How often do you feel hopeful about the future?",
                options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
            },
            {
                id: 21,
                type: 'checkbox',
                question: "What are your main sources of stress? (Select all that apply)",
                options: ["Work", "Relationships", "Finances", "Health", "Family", "Social situations", "Future uncertainty"]
            },
            {
                id: 22,
                type: 'multiple',
                question: "How often do you have mood swings?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Daily"]
            },
            {
                id: 23,
                type: 'scale',
                question: "Rate your motivation levels (1-10)",
                min: 1,
                max: 10,
                labels: ["No motivation", "Highly motivated"]
            },
            {
                id: 24,
                type: 'multiple',
                question: "How do you typically handle difficult emotions?",
                options: ["Talk to someone", "Keep to myself", "Use healthy coping strategies", "Avoid dealing with them", "Seek professional help"]
            },
            {
                id: 25,
                type: 'multiple',
                question: "How often do you feel irritable or angry?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: 26,
                type: 'checkbox',
                question: "Which activities help improve your mood? (Select all that apply)",
                options: ["Exercise", "Music", "Nature/outdoors", "Social activities", "Creative pursuits", "Reading", "Nothing helps"]
            },
            {
                id: 27,
                type: 'scale',
                question: "Rate your overall life satisfaction (1-10)",
                min: 1,
                max: 10,
                labels: ["Very dissatisfied", "Very satisfied"]
            },
            {
                id: 28,
                type: 'multiple',
                question: "How often do you experience racing or anxious thoughts?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Constantly"]
            },
            {
                id: 29,
                type: 'multiple',
                question: "Do you have a support system you can rely on?",
                options: ["Strong support system", "Some support", "Limited support", "Little support", "No support"]
            },
            {
                id: 30,
                type: 'text',
                question: "What would help you feel better mentally and emotionally? (Optional)",
                placeholder: "Describe what support or changes would be most helpful..."
            }
        ];
    }

    init() {
        this.renderQuestion();
        this.updateProgress();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('assessment-container');
        
        container.innerHTML = `
            <div class="question-card white-bg">
                <div class="question-header">
                    <span class="question-number">${this.currentQuestion + 1}</span>
                    <h3 class="question-title">${question.question}</h3>
                </div>
                <div class="question-content">
                    ${this.renderQuestionInput(question)}
                </div>
                <div class="question-navigation">
                    <button class="nav-btn secondary" onclick="mentalHealthAssessment.previousQuestion()" 
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="nav-btn primary" onclick="mentalHealthAssessment.nextQuestion()" 
                            id="next-btn" disabled>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Complete Assessment' : 'Next'} 
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.updateButtons();
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
            default:
                return '';
        }
    }

    renderMultipleChoice(question) {
        return `
            <div class="options-grid">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="mentalHealthAssessment.selectSingle(${question.id}, '${option}')">
                        <i class="fas fa-circle"></i>
                        <span>${option}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderCheckbox(question) {
        return `
            <div class="options-grid">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="mentalHealthAssessment.selectMultiple(${question.id}, '${option}')">
                        <i class="fas fa-square"></i>
                        <span>${option}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderScale(question) {
        return `
            <div class="scale-container">
                <div class="scale-labels">
                    <span>${question.labels[0]}</span>
                    <span>${question.labels[1]}</span>
                </div>
                <input type="range" class="scale-slider" min="${question.min}" max="${question.max}" 
                       onchange="mentalHealthAssessment.updateScale(${question.id}, this.value)">
                <div class="scale-value">
                    <span id="scale-value-${question.id}">5</span>
                </div>
            </div>
        `;
    }

    renderNumber(question) {
        return `
            <div class="number-container">
                <input type="number" class="number-input" placeholder="${question.placeholder || ''}"
                       onchange="mentalHealthAssessment.updateNumber(${question.id}, this.value)">
            </div>
        `;
    }

    renderText(question) {
        return `
            <div class="text-container">
                <textarea class="text-input" placeholder="${question.placeholder || ''}" rows="4"
                          onchange="mentalHealthAssessment.updateText(${question.id}, this.value)"></textarea>
            </div>
        `;
    }

    selectSingle(questionId, value) {
        this.responses[questionId] = value;
        
        // Update UI
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.querySelector('span').textContent === value) {
                btn.classList.add('selected');
            }
        });
        
        this.updateButtons();
    }

    selectMultiple(questionId, value) {
        if (!this.responses[questionId]) {
            this.responses[questionId] = [];
        }
        
        const responses = this.responses[questionId];
        const index = responses.indexOf(value);
        
        if (index > -1) {
            responses.splice(index, 1);
        } else {
            responses.push(value);
        }
        
        // Update UI
        document.querySelectorAll('.option-btn').forEach(btn => {
            const btnValue = btn.querySelector('span').textContent;
            if (responses.includes(btnValue)) {
                btn.classList.add('selected');
                btn.querySelector('i').className = 'fas fa-check-square';
            } else {
                btn.classList.remove('selected');
                btn.querySelector('i').className = 'fas fa-square';
            }
        });
        
        this.updateButtons();
    }

    updateScale(questionId, value) {
        this.responses[questionId] = parseInt(value);
        document.getElementById(`scale-value-${questionId}`).textContent = value;
        this.updateButtons();
    }

    updateNumber(questionId, value) {
        this.responses[questionId] = value;
        this.updateButtons();
    }

    updateText(questionId, value) {
        this.responses[questionId] = value;
        this.updateButtons();
    }

    isAnswered(questionId) {
        const response = this.responses[questionId];
        if (Array.isArray(response)) {
            return response.length > 0;
        }
        return response !== undefined && response !== null && response !== '';
    }

    updateButtons() {
        const nextBtn = document.getElementById('next-btn');
        const currentQuestion = this.questions[this.currentQuestion];
        
        if (this.isAnswered(currentQuestion.id)) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
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
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const percentage = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${this.currentQuestion + 1} of ${this.totalQuestions}`;
    }

    async completeAssessment() {
        this.showLoading();
        
        setTimeout(() => {
            const assessment = this.analyzeMentalHealth();
            this.showResults(assessment);
        }, 2000);
    }

    analyzeMentalHealth() {
        const responses = this.responses;
        
        // Calculate mental health scores
        const stressScore = this.calculateStressLevel(responses);
        const depressionScore = this.calculateDepressionRisk(responses);
        const anxietyScore = this.calculateAnxietyLevel(responses);
        const overallScore = this.calculateOverallWellbeing(responses);
        
        // Determine risk levels
        const riskLevel = this.determineRiskLevel(stressScore, depressionScore, anxietyScore);
        
        return {
            timestamp: new Date().toLocaleString(),
            sessionId: this.sessionId,
            overallScore: overallScore,
            stressLevel: stressScore,
            depressionRisk: depressionScore,
            anxietyLevel: anxietyScore,
            riskLevel: riskLevel,
            recommendations: this.generateRecommendations(riskLevel, responses),
            copingStrategies: this.getCopingStrategies(responses),
            nextSteps: this.getNextSteps(riskLevel),
            supportResources: this.getSupportResources(riskLevel),
            responses: responses
        };
    }

    calculateStressLevel(responses) {
        let score = 0;
        
        // Stress rating (Q2)
        if (responses[2]) score += parseInt(responses[2]) * 10;
        
        // Overwhelmed by tasks (Q7)
        const overwhelm = responses[7];
        if (overwhelm === 'Always') score += 25;
        else if (overwhelm === 'Often') score += 20;
        else if (overwhelm === 'Sometimes') score += 10;
        
        // Work-life balance (Q19)
        if (responses[19]) score += (10 - parseInt(responses[19])) * 5;
        
        return Math.min(100, score);
    }

    calculateDepressionRisk(responses) {
        let score = 0;
        
        // Sadness/depression frequency (Q3)
        const sadness = responses[3];
        if (sadness === 'Always') score += 30;
        else if (sadness === 'Often') score += 25;
        else if (sadness === 'Sometimes') score += 15;
        
        // Energy levels (Q5)
        if (responses[5]) score += (5 - parseInt(responses[5])) * 8;
        
        // Hopefulness (Q20)
        const hope = responses[20];
        if (hope === 'Never') score += 25;
        else if (hope === 'Rarely') score += 20;
        else if (hope === 'Sometimes') score += 10;
        
        // Life satisfaction (Q27)
        if (responses[27]) score += (5 - parseInt(responses[27])) * 6;
        
        return Math.min(100, score);
    }

    calculateAnxietyLevel(responses) {
        let score = 0;
        
        // Anxiety symptoms (Q6)
        if (Array.isArray(responses[6])) {
            const symptoms = responses[6].filter(s => s !== 'None');
            score += symptoms.length * 12;
        }
        
        // Racing thoughts (Q28)
        const racing = responses[28];
        if (racing === 'Constantly') score += 25;
        else if (racing === 'Often') score += 20;
        else if (racing === 'Sometimes') score += 10;
        
        // Concentration (Q8)
        if (responses[8]) score += (5 - parseInt(responses[8])) * 8;
        
        return Math.min(100, score);
    }

    calculateOverallWellbeing(responses) {
        const stress = this.calculateStressLevel(responses);
        const depression = this.calculateDepressionRisk(responses);
        const anxiety = this.calculateAnxietyLevel(responses);
        
        const averageRisk = (stress + depression + anxiety) / 3;
        return Math.max(0, 100 - averageRisk);
    }

    determineRiskLevel(stress, depression, anxiety) {
        const maxScore = Math.max(stress, depression, anxiety);
        
        if (maxScore >= 70) return 'High';
        if (maxScore >= 50) return 'Moderate';
        if (maxScore >= 30) return 'Mild';
        return 'Low';
    }

    generateRecommendations(riskLevel, responses) {
        const recommendations = [];
        
        if (riskLevel === 'High') {
            recommendations.push("Consider seeking immediate professional mental health support");
            recommendations.push("Contact a mental health crisis line if you're having thoughts of self-harm");
            recommendations.push("Reach out to trusted friends or family members for support");
        }
        
        if (riskLevel === 'Moderate' || riskLevel === 'High') {
            recommendations.push("Schedule an appointment with a mental health professional");
            recommendations.push("Practice daily stress-reduction techniques");
            recommendations.push("Maintain a regular sleep schedule");
        }
        
        recommendations.push("Engage in regular physical exercise");
        recommendations.push("Practice mindfulness or meditation");
        recommendations.push("Maintain social connections");
        recommendations.push("Limit alcohol and caffeine intake");
        
        return recommendations;
    }

    getCopingStrategies(responses) {
        const strategies = [
            "Deep breathing exercises",
            "Progressive muscle relaxation",
            "Journaling thoughts and feelings",
            "Regular exercise routine",
            "Mindfulness meditation",
            "Time in nature",
            "Creative activities",
            "Social support"
        ];
        
        return strategies;
    }

    getNextSteps(riskLevel) {
        const steps = [];
        
        switch(riskLevel) {
            case 'High':
                steps.push("Seek immediate professional help");
                steps.push("Contact emergency services if in crisis");
                steps.push("Inform trusted contacts about your situation");
                break;
            case 'Moderate':
                steps.push("Schedule appointment with therapist or counselor");
                steps.push("Implement daily stress management routine");
                steps.push("Monitor symptoms daily");
                break;
            case 'Mild':
                steps.push("Try self-help strategies for 2-4 weeks");
                steps.push("Monitor progress with mood tracking");
                steps.push("Consider professional support if no improvement");
                break;
            default:
                steps.push("Continue current positive practices");
                steps.push("Maintain regular self-care routine");
                steps.push("Stay connected with support system");
        }
        
        return steps;
    }

    getSupportResources(riskLevel) {
        return [
            {
                name: "National Suicide Prevention Lifeline",
                contact: "988",
                description: "24/7 crisis support"
            },
            {
                name: "Crisis Text Line",
                contact: "Text HOME to 741741",
                description: "24/7 text-based crisis support"
            },
            {
                name: "NAMI Help Line",
                contact: "1-800-950-NAMI",
                description: "Mental health information and support"
            },
            {
                name: "Psychology Today",
                contact: "www.psychologytoday.com",
                description: "Find mental health professionals"
            }
        ];
    }

    showLoading() {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h3>Analyzing Your Mental Health Assessment</h3>
                <p>Processing your responses and generating personalized insights...</p>
                <div class="loading-steps">
                    <div class="step">Evaluating stress levels...</div>
                    <div class="step">Assessing emotional wellbeing...</div>
                    <div class="step">Generating recommendations...</div>
                    <div class="step">Preparing your report...</div>
                </div>
            </div>
        `;
    }

    showResults(assessment) {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2><i class="fas fa-brain"></i> Mental Health Assessment Results</h2>
                    <div class="results-meta">
                        <span><i class="fas fa-calendar"></i> ${assessment.timestamp}</span>
                        <span><i class="fas fa-user"></i> Session: ${assessment.sessionId}</span>
                    </div>
                </div>

                <div class="results-summary">
                    <div class="summary-card">
                        <h3>Overall Wellbeing</h3>
                        <div class="score-display">
                            <span class="score-number">${assessment.overallScore}</span>
                            <span class="score-total">/100</span>
                        </div>
                        <p class="${this.getScoreClass(assessment.overallScore)}">${this.getWellbeingCategory(assessment.overallScore)}</p>
                    </div>

                    <div class="summary-card">
                        <h3>Risk Level</h3>
                        <div class="risk-badge ${assessment.riskLevel.toLowerCase()}">${assessment.riskLevel}</div>
                        <p>Current mental health risk assessment</p>
                    </div>

                    <div class="summary-card">
                        <h3>Key Areas</h3>
                        <div class="metric-grid">
                            <div class="metric">
                                <span>Stress: ${assessment.stressLevel}%</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${assessment.stressLevel}%"></div>
                                </div>
                            </div>
                            <div class="metric">
                                <span>Anxiety: ${assessment.anxietyLevel}%</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${assessment.anxietyLevel}%"></div>
                                </div>
                            </div>
                            <div class="metric">
                                <span>Depression Risk: ${assessment.depressionRisk}%</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${assessment.depressionRisk}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${assessment.riskLevel === 'High' ? `
                    <div class="emergency-alert">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Important Notice</h3>
                        <p>Your assessment indicates you may benefit from immediate professional support. Please consider reaching out to a mental health professional or crisis support service.</p>
                    </div>
                ` : ''}

                <div class="analysis-details">
                    <div class="detail-section">
                        <h3><i class="fas fa-lightbulb"></i> Recommendations</h3>
                        <ul class="recommendation-list">
                            ${assessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-tools"></i> Coping Strategies</h3>
                        <ul class="strategy-list">
                            ${assessment.copingStrategies.map(strategy => `<li>${strategy}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-route"></i> Next Steps</h3>
                        <ul class="steps-list">
                            ${assessment.nextSteps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-hands-helping"></i> Support Resources</h3>
                        <div class="resources-grid">
                            ${assessment.supportResources.map(resource => `
                                <div class="resource-card">
                                    <h4>${resource.name}</h4>
                                    <p class="contact">${resource.contact}</p>
                                    <p>${resource.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="mentalHealthAssessment.downloadReport()">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                    <button class="action-btn secondary" onclick="mentalHealthAssessment.shareResults()">
                        <i class="fas fa-share"></i> Share Results
                    </button>
                    <button class="action-btn secondary" onclick="mentalHealthAssessment.startNew()">
                        <i class="fas fa-redo"></i> New Assessment
                    </button>
                </div>
            </div>
        `;
    }

    getScoreClass(score) {
        if (score >= 70) return 'metric-value healthy';
        if (score >= 50) return 'metric-value warning';
        return 'metric-value danger';
    }

    getWellbeingCategory(score) {
        if (score >= 80) return 'Excellent wellbeing';
        if (score >= 70) return 'Good wellbeing';
        if (score >= 50) return 'Fair wellbeing';
        if (score >= 30) return 'Poor wellbeing';
        return 'Very poor wellbeing';
    }

    async downloadReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get the latest assessment data
        const assessment = this.analyzeMentalHealth();
        
        this.generateDetailedPDF(doc, assessment);
        doc.save(`mental-health-assessment-${assessment.sessionId}.pdf`);
    }

    generateDetailedPDF(doc, assessment) {
        let yPos = 20;
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 44, 52);
        doc.text('Mental Health Assessment Report', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated: ${assessment.timestamp} | Session: ${assessment.sessionId}`, 20, yPos);
        
        yPos += 20;
        
        // Overall Wellbeing Score
        doc.setFontSize(16);
        doc.setTextColor(40, 44, 52);
        doc.text('Overall Mental Wellbeing', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(24);
        doc.setTextColor(52, 152, 219);
        doc.text(`${assessment.overallScore}/100`, 20, yPos);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(40, 44, 52);
        doc.text(`Category: ${this.getWellbeingCategory(assessment.overallScore)}`, 20, yPos);
        
        yPos += 20;
        
        // Risk Assessment
        doc.setFontSize(14);
        doc.text('Risk Assessment', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.text(`Overall Risk Level: ${assessment.riskLevel}`, 20, yPos);
        yPos += 6;
        doc.text(`Stress Level: ${assessment.stressLevel}%`, 20, yPos);
        yPos += 6;
        doc.text(`Anxiety Level: ${assessment.anxietyLevel}%`, 20, yPos);
        yPos += 6;
        doc.text(`Depression Risk: ${assessment.depressionRisk}%`, 20, yPos);
        
        yPos += 20;
        
        // Recommendations
        doc.setFontSize(14);
        doc.text('Recommendations', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        assessment.recommendations.forEach((rec, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${rec}`, 25, yPos);
            yPos += 6;
        });
        
        yPos += 10;
        
        // Next Steps
        doc.setFontSize(14);
        doc.text('Next Steps', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        assessment.nextSteps.forEach((step, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${step}`, 25, yPos);
            yPos += 6;
        });
        
        // Disclaimer
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 20;
        }
        
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('DISCLAIMER: This assessment is for informational purposes only and does not', 20, yPos);
        yPos += 4;
        doc.text('replace professional mental health diagnosis or treatment. Please consult with', 20, yPos);
        yPos += 4;
        doc.text('qualified mental health professionals for personalized care.', 20, yPos);
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'Mental Health Assessment Results',
                text: 'I completed a comprehensive mental health assessment. Check out your own mental wellbeing!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Assessment link copied to clipboard!');
        }
    }

    startNew() {
        if (confirm('Are you sure you want to start a new assessment? Your current results will be lost.')) {
            this.currentQuestion = 0;
            this.responses = {};
            this.sessionId = this.generateSessionId();
            this.init();
        }
    }

    generateSessionId() {
        return 'mh-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

// Global variable for assessment instance
let mentalHealthAssessment;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof MentalHealthAssessment30Q !== 'undefined') {
        mentalHealthAssessment = new MentalHealthAssessment30Q();
    }
}); 