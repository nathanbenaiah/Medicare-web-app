class HealthAssessment30Q {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = Date.now().toString();
        this.totalQuestions = 30;
    }

    getQuestions() {
        return [
            { id: 1, question: "What is your age?", type: "number", min: 13, max: 100, required: true },
            { id: 2, question: "What is your biological sex?", type: "multiple", options: ["Male", "Female"], required: true },
            { id: 3, question: "What is your current weight (lbs)?", type: "number", min: 50, max: 500, required: true },
            { id: 4, question: "What is your height (inches)?", type: "number", min: 36, max: 84, required: true },
            { id: 5, question: "How would you rate your overall health?", type: "scale", min: 1, max: 10, required: true },
            { id: 6, question: "Do you have any chronic conditions?", type: "checkbox", options: ["Diabetes", "High blood pressure", "Heart disease", "Asthma", "Arthritis", "Depression", "Anxiety", "None"], required: true },
            { id: 7, question: "How often do you exercise?", type: "multiple", options: ["Never", "1-2 times/week", "3-4 times/week", "5-6 times/week", "Daily"], required: true },
            { id: 8, question: "How many hours do you sleep per night?", type: "scale", min: 3, max: 12, required: true },
            { id: 9, question: "How would you rate your stress level?", type: "scale", min: 1, max: 10, required: true },
            { id: 10, question: "Do you smoke or use tobacco?", type: "multiple", options: ["Never", "Former smoker", "Occasional", "Daily"], required: true },
            { id: 11, question: "How often do you drink alcohol?", type: "multiple", options: ["Never", "Rarely", "1-2 drinks/week", "3-7 drinks/week", "More than 7/week"], required: true },
            { id: 12, question: "How many servings of fruits/vegetables do you eat daily?", type: "scale", min: 0, max: 10, required: true },
            { id: 13, question: "Are you currently taking any medications?", type: "checkbox", options: ["Blood pressure meds", "Diabetes meds", "Heart meds", "Antidepressants", "Pain meds", "Vitamins", "None"], required: true },
            { id: 14, question: "When was your last physical exam?", type: "multiple", options: ["Within 6 months", "6-12 months ago", "1-2 years ago", "More than 2 years", "Never"], required: true },
            { id: 15, question: "Do you have a family history of these conditions?", type: "checkbox", options: ["Heart disease", "Diabetes", "Cancer", "High blood pressure", "Mental health", "None"], required: true },
            { id: 16, question: "How would you rate your energy level?", type: "scale", min: 1, max: 10, required: true },
            { id: 17, question: "How often do you experience headaches?", type: "multiple", options: ["Never", "Rarely", "Monthly", "Weekly", "Daily"], required: true },
            { id: 18, question: "Do you experience any of these symptoms regularly?", type: "checkbox", options: ["Fatigue", "Shortness of breath", "Chest pain", "Dizziness", "Joint pain", "Back pain", "None"], required: true },
            { id: 19, question: "How is your appetite?", type: "multiple", options: ["Excellent", "Good", "Fair", "Poor", "Variable"], required: true },
            { id: 20, question: "Have you had any surgeries in the past 5 years?", type: "multiple", options: ["None", "Minor surgery", "Major surgery", "Multiple surgeries"], required: true },
            { id: 21, question: "Do you wear seatbelts and practice safety measures?", type: "multiple", options: ["Always", "Usually", "Sometimes", "Rarely", "Never"], required: true },
            { id: 22, question: "How often do you get preventive screenings?", type: "multiple", options: ["As recommended", "Sometimes", "Rarely", "Never"], required: true },
            { id: 23, question: "Rate your work-life balance", type: "scale", min: 1, max: 10, required: true },
            { id: 24, question: "Do you have a strong social support system?", type: "multiple", options: ["Very strong", "Strong", "Moderate", "Weak", "Very weak"], required: true },
            { id: 25, question: "How often do you feel anxious or worried?", type: "multiple", options: ["Never", "Rarely", "Sometimes", "Often", "Always"], required: true },
            { id: 26, question: "How satisfied are you with your life?", type: "scale", min: 1, max: 10, required: true },
            { id: 27, question: "Do you practice any stress management techniques?", type: "checkbox", options: ["Meditation", "Yoga", "Deep breathing", "Exercise", "Hobbies", "Therapy", "None"], required: true },
            { id: 28, question: "How much water do you drink daily?", type: "scale", min: 1, max: 15, required: true },
            { id: 29, question: "Rate your overall mood", type: "scale", min: 1, max: 10, required: true },
            { id: 30, question: "What health goals do you want to achieve?", type: "text", placeholder: "Describe your health goals...", required: false }
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
                    ${this.currentQuestion > 0 ? '<button class="nav-btn secondary" onclick="healthAssessment.previousQuestion()">Previous</button>' : ''}
                    <button class="nav-btn primary" onclick="healthAssessment.nextQuestion()" ${!this.isAnswered(question.id) ? 'disabled' : ''}>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Complete Assessment' : 'Next'}
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

    // [Render methods same as previous examples...]

    async completeAssessment() {
        this.showLoading();
        setTimeout(() => {
            const assessment = this.analyzeHealth();
            this.showResults(assessment);
        }, 2000);
    }

    analyzeHealth() {
        const age = this.responses[1];
        const weight = this.responses[3];
        const height = this.responses[4];
        const overallHealth = this.responses[5];
        const conditions = this.responses[6] || [];
        const exercise = this.responses[7];
        const sleep = this.responses[8];
        const stress = this.responses[9];

        // Calculate BMI
        const bmi = (weight / (height * height)) * 703;
        
        // Health score calculation (0-100)
        let healthScore = 50; // Start at middle

        // BMI impact
        if (bmi >= 18.5 && bmi < 25) healthScore += 10;
        else if (bmi < 18.5 || bmi >= 30) healthScore -= 15;
        else healthScore -= 5;

        // Exercise impact
        const exerciseScores = { "Never": -15, "1-2 times/week": -5, "3-4 times/week": 10, "5-6 times/week": 15, "Daily": 20 };
        healthScore += exerciseScores[exercise] || 0;

        // Sleep impact
        if (sleep >= 7 && sleep <= 9) healthScore += 10;
        else healthScore -= Math.abs(8 - sleep) * 3;

        // Stress impact
        healthScore -= (stress - 1) * 2;

        // Chronic conditions impact
        healthScore -= (conditions.length - (conditions.includes("None") ? 1 : 0)) * 8;

        healthScore = Math.max(0, Math.min(100, healthScore));

        return {
            healthScore: Math.round(healthScore),
            bmi: Math.round(bmi * 10) / 10,
            bmiCategory: this.getBMICategory(bmi),
            riskFactors: this.identifyRiskFactors(),
            recommendations: this.generateRecommendations(),
            strengths: this.identifyStrengths(),
            goals: this.responses[30] || "Not specified"
        };
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        return "Obese";
    }

    identifyRiskFactors() {
        const factors = [];
        const conditions = this.responses[6] || [];
        const exercise = this.responses[7];
        const smoking = this.responses[10];
        const alcohol = this.responses[11];
        const stress = this.responses[9];

        if (conditions.length > 1 && !conditions.includes("None")) {
            factors.push("Multiple chronic conditions");
        }
        if (exercise === "Never") factors.push("Sedentary lifestyle");
        if (smoking !== "Never") factors.push("Tobacco use");
        if (alcohol === "More than 7/week") factors.push("Excessive alcohol consumption");
        if (stress >= 8) factors.push("High stress levels");

        return factors;
    }

    generateRecommendations() {
        const recs = [];
        const exercise = this.responses[7];
        const sleep = this.responses[8];
        const stress = this.responses[9];
        const nutrition = this.responses[12];

        if (exercise === "Never" || exercise === "1-2 times/week") {
            recs.push("Increase physical activity to at least 150 minutes per week");
        }
        if (sleep < 7 || sleep > 9) {
            recs.push("Improve sleep hygiene and aim for 7-9 hours nightly");
        }
        if (stress >= 7) {
            recs.push("Implement stress management techniques");
        }
        if (nutrition < 5) {
            recs.push("Increase fruit and vegetable consumption");
        }

        return recs;
    }

    identifyStrengths() {
        const strengths = [];
        const exercise = this.responses[7];
        const smoking = this.responses[10];
        const safety = this.responses[21];
        const support = this.responses[24];

        if (exercise === "Daily" || exercise === "5-6 times/week") {
            strengths.push("Regular exercise routine");
        }
        if (smoking === "Never") strengths.push("Non-smoker");
        if (safety === "Always") strengths.push("Good safety practices");
        if (support === "Very strong" || support === "Strong") {
            strengths.push("Strong social support");
        }

        return strengths;
    }

    showResults(assessment) {
        document.getElementById('assessment-container').innerHTML = `
            <div class="results-container white-bg">
                <div class="results-header ash-bg">
                    <h2>Your Health Assessment Results</h2>
                    <div class="health-score-badge" style="background: ${this.getScoreColor(assessment.healthScore)};">
                        Health Score: ${assessment.healthScore}/100
                    </div>
                </div>

                <div class="health-metrics">
                    <div class="metric-card ash-bg">
                        <h3>Overall Health Score</h3>
                        <div class="metric-value">${assessment.healthScore}</div>
                        <div class="metric-label">${this.getScoreCategory(assessment.healthScore)}</div>
                    </div>
                    
                    <div class="metric-card ash-bg">
                        <h3>BMI</h3>
                        <div class="metric-value">${assessment.bmi}</div>
                        <div class="metric-label">${assessment.bmiCategory}</div>
                    </div>
                    
                    <div class="metric-card ash-bg">
                        <h3>Risk Factors</h3>
                        <div class="metric-value">${assessment.riskFactors.length}</div>
                        <div class="metric-label">Identified</div>
                    </div>
                </div>

                <div class="assessment-details">
                    ${assessment.strengths.length > 0 ? `
                        <div class="detail-section ash-bg">
                            <h3>Your Health Strengths</h3>
                            <ul class="strengths-list">
                                ${assessment.strengths.map(strength => `<li>${strength}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${assessment.riskFactors.length > 0 ? `
                        <div class="detail-section ash-bg">
                            <h3>Risk Factors to Address</h3>
                            <ul class="risk-list">
                                ${assessment.riskFactors.map(risk => `<li>${risk}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="detail-section ash-bg">
                        <h3>Personalized Recommendations</h3>
                        <ul class="recommendation-list">
                            ${assessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    ${assessment.goals !== "Not specified" ? `
                        <div class="detail-section ash-bg">
                            <h3>Your Health Goals</h3>
                            <p class="goals-text">${assessment.goals}</p>
                        </div>
                    ` : ''}
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="healthAssessment.downloadReport()">
                        <i class="fas fa-download"></i>
                        Download Report
                    </button>
                    <button class="action-btn secondary" onclick="healthAssessment.shareResults()">
                        <i class="fas fa-share"></i>
                        Share Results
                    </button>
                    <button class="action-btn secondary" onclick="healthAssessment.startNew()">
                        <i class="fas fa-redo"></i>
                        New Assessment
                    </button>
                </div>

                <div class="disclaimer ash-bg">
                    <h4><i class="fas fa-info-circle"></i> Important Disclaimer</h4>
                    <p>This assessment is for informational purposes only and should not replace professional medical advice. Consult with healthcare providers for proper medical evaluation.</p>
                </div>
            </div>
        `;

        this.lastAssessment = assessment;
    }

    getScoreColor(score) {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    }

    getScoreCategory(score) {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Improvement';
    }

    async downloadReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Generate comprehensive PDF
        let y = 20;
        doc.setFontSize(20);
        doc.text('Comprehensive Health Assessment Report', 20, y);
        y += 20;

        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
        y += 15;

        doc.setFontSize(16);
        doc.text('Health Score Summary', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.text(`Overall Health Score: ${this.lastAssessment.healthScore}/100 (${this.getScoreCategory(this.lastAssessment.healthScore)})`, 20, y);
        y += 7;
        doc.text(`BMI: ${this.lastAssessment.bmi} (${this.lastAssessment.bmiCategory})`, 20, y);
        y += 7;
        doc.text(`Risk Factors Identified: ${this.lastAssessment.riskFactors.length}`, 20, y);
        y += 15;

        if (this.lastAssessment.strengths.length > 0) {
            doc.setFontSize(14);
            doc.text('Health Strengths:', 20, y);
            y += 8;
            doc.setFontSize(11);
            this.lastAssessment.strengths.forEach(strength => {
                doc.text(`• ${strength}`, 25, y);
                y += 6;
            });
            y += 8;
        }

        if (this.lastAssessment.riskFactors.length > 0) {
            doc.setFontSize(14);
            doc.text('Risk Factors:', 20, y);
            y += 8;
            doc.setFontSize(11);
            this.lastAssessment.riskFactors.forEach(risk => {
                doc.text(`• ${risk}`, 25, y);
                y += 6;
            });
            y += 8;
        }

        doc.setFontSize(14);
        doc.text('Recommendations:', 20, y);
        y += 8;
        doc.setFontSize(11);
        this.lastAssessment.recommendations.forEach(rec => {
            const lines = doc.splitTextToSize(`• ${rec}`, 165);
            doc.text(lines, 25, y);
            y += lines.length * 6;
        });

        doc.save(`health-assessment-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    shareResults() {
        const summary = `My Health Assessment Results:\nHealth Score: ${this.lastAssessment.healthScore}/100\nBMI: ${this.lastAssessment.bmi}\nCategory: ${this.getScoreCategory(this.lastAssessment.healthScore)}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Health Assessment Results',
                text: summary,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(summary);
            alert('Results copied to clipboard!');
        }
    }

    startNew() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = Date.now().toString();
        this.init();
    }

    // Additional methods for question handling...
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

    renderMultipleChoice(question) {
        let html = '<div class="options-grid">';
        question.options.forEach(option => {
            const selected = this.responses[question.id] === option;
            html += `
                <button class="option-btn ash-bg ${selected ? 'selected' : ''}" 
                        onclick="healthAssessment.selectSingle(${question.id}, '${option}')">
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
                        onclick="healthAssessment.selectMultiple(${question.id}, '${option}')">
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
                       oninput="healthAssessment.updateScale(${question.id}, this.value)">
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
                       oninput="healthAssessment.updateNumber(${question.id}, this.value)"
                       placeholder="Enter value">
            </div>`;
    }

    renderText(question) {
        const value = this.responses[question.id] || '';
        return `
            <div class="text-container">
                <textarea class="text-input ash-bg" 
                          placeholder="${question.placeholder}"
                          oninput="healthAssessment.updateText(${question.id}, this.value)">${value}</textarea>
            </div>`;
    }

    showLoading() {
        document.getElementById('assessment-container').innerHTML = `
            <div class="loading-container white-bg">
                <div class="loading-spinner"></div>
                <h3>Analyzing Your Health Data</h3>
                <p class="ash-text">Processing 30 comprehensive health indicators...</p>
            </div>
        `;
    }
}

// Initialize
let healthAssessment;
document.addEventListener('DOMContentLoaded', () => {
    healthAssessment = new HealthAssessment30Q();
    healthAssessment.init();
}); 