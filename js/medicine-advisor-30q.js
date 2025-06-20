// Medicine Advisor 30-Question Assessment
class MedicineAdvisor30Q {
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
                type: 'number',
                question: "What is your age?",
                placeholder: "Enter your age in years"
            },
            {
                id: 2,
                type: 'multiple',
                question: "What is your biological sex?",
                options: ["Male", "Female", "Prefer not to say"]
            },
            {
                id: 3,
                type: 'number',
                question: "What is your weight in kilograms?",
                placeholder: "e.g., 70"
            },
            {
                id: 4,
                type: 'checkbox',
                question: "What chronic conditions do you have? (Select all that apply)",
                options: ["None", "Diabetes", "High blood pressure", "Heart disease", "Kidney disease", "Liver disease", "Asthma", "Depression", "Anxiety", "Arthritis", "Other"]
            },
            {
                id: 5,
                type: 'text',
                question: "List all prescription medications you currently take (include dosages if known)",
                placeholder: "e.g., Lisinopril 10mg, Metformin 500mg twice daily..."
            },
            {
                id: 6,
                type: 'text',
                question: "List all over-the-counter medications and supplements you take regularly",
                placeholder: "e.g., Multivitamin, Ibuprofen as needed, Vitamin D..."
            },
            {
                id: 7,
                type: 'multiple',
                question: "How many different medications do you take regularly?",
                options: ["None", "1-2", "3-5", "6-10", "More than 10"]
            },
            {
                id: 8,
                type: 'checkbox',
                question: "What allergies or adverse reactions to medications do you have? (Select all that apply)",
                options: ["None known", "Penicillin", "Sulfa drugs", "NSAIDs (ibuprofen, etc.)", "Opioids", "Latex", "Food allergies", "Other drug allergies"]
            },
            {
                id: 9,
                type: 'multiple',
                question: "How do you typically remember to take your medications?",
                options: ["Memory only", "Pill organizer", "Phone alarms", "Family reminders", "Medication app", "Written schedule"]
            },
            {
                id: 10,
                type: 'scale',
                question: "How often do you miss doses of your medications? (1-10 scale)",
                min: 1,
                max: 10,
                labels: ["Never miss", "Frequently miss"]
            },
            {
                id: 11,
                type: 'multiple',
                question: "Do you take medications at the same times each day?",
                options: ["Always", "Usually", "Sometimes", "Rarely", "Never"]
            },
            {
                id: 12,
                type: 'checkbox',
                question: "What side effects are you currently experiencing? (Select all that apply)",
                options: ["None", "Nausea", "Dizziness", "Fatigue", "Headaches", "Sleep problems", "Digestive issues", "Mood changes", "Weight changes", "Other"]
            },
            {
                id: 13,
                type: 'multiple',
                question: "How often do you discuss medication side effects with your doctor?",
                options: ["Always", "Usually", "Sometimes", "Rarely", "Never"]
            },
            {
                id: 14,
                type: 'multiple',
                question: "Do you read medication labels and instructions?",
                options: ["Always", "Usually", "Sometimes", "Rarely", "Never"]
            },
            {
                id: 15,
                type: 'checkbox',
                question: "What concerns do you have about your medications? (Select all that apply)",
                options: ["No concerns", "Cost", "Side effects", "Effectiveness", "Drug interactions", "Long-term effects", "Dependency", "Complex schedule"]
            },
            {
                id: 16,
                type: 'multiple',
                question: "How do you store your medications?",
                options: ["Original containers", "Pill organizer", "Mixed containers", "Bathroom medicine cabinet", "Kitchen counter", "Refrigerator when needed"]
            },
            {
                id: 17,
                type: 'multiple',
                question: "Do you check expiration dates on your medications?",
                options: ["Always", "Usually", "Sometimes", "Rarely", "Never"]
            },
            {
                id: 18,
                type: 'checkbox',
                question: "What do you do with expired or unused medications? (Select all that apply)",
                options: ["Return to pharmacy", "Throw in trash", "Flush down toilet", "Give to others", "Keep them", "Drug take-back programs"]
            },
            {
                id: 19,
                type: 'multiple',
                question: "Do you inform all your healthcare providers about all medications you take?",
                options: ["Always", "Usually", "Sometimes", "Rarely", "Never"]
            },
            {
                id: 20,
                type: 'multiple',
                question: "How often do you get medication reviews with your pharmacist?",
                options: ["Never", "Rarely", "When starting new medications", "Every 6 months", "Annually", "More frequently"]
            },
            {
                id: 21,
                type: 'checkbox',
                question: "What substances do you consume that might interact with medications? (Select all that apply)",
                options: ["None", "Alcohol", "Tobacco/Nicotine", "Cannabis", "Caffeine", "Grapefruit", "Herbal supplements", "Energy drinks"]
            },
            {
                id: 22,
                type: 'multiple',
                question: "How much alcohol do you consume per week?",
                options: ["None", "1-2 drinks", "3-7 drinks", "8-14 drinks", "More than 14 drinks"]
            },
            {
                id: 23,
                type: 'scale',
                question: "Rate your understanding of why you take each medication (1-10)",
                min: 1,
                max: 10,
                labels: ["Don't understand", "Fully understand"]
            },
            {
                id: 24,
                type: 'multiple',
                question: "Do you take medications with or without food as directed?",
                options: ["Always follow directions", "Usually follow", "Sometimes follow", "Rarely follow", "Don't know the directions"]
            },
            {
                id: 25,
                type: 'checkbox',
                question: "What medication-related problems have you experienced? (Select all that apply)",
                options: ["None", "Wrong medication given", "Wrong dose", "Severe side effects", "Drug interactions", "Allergic reactions", "Medication not working", "Insurance coverage issues"]
            },
            {
                id: 26,
                type: 'multiple',
                question: "How do you handle medication costs?",
                options: ["No cost issues", "Insurance covers most", "Use generic when possible", "Skip doses to save money", "Use patient assistance programs", "Have difficulty affording"]
            },
            {
                id: 27,
                type: 'multiple',
                question: "Do you travel with medications?",
                options: ["Never travel", "Rarely travel with meds", "Sometimes", "Often", "Always carry medications"]
            },
            {
                id: 28,
                type: 'scale',
                question: "Rate your confidence in managing your medications safely (1-10)",
                min: 1,
                max: 10,
                labels: ["Not confident", "Very confident"]
            },
            {
                id: 29,
                type: 'checkbox',
                question: "What additional support would help you manage medications better? (Select all that apply)",
                options: ["None needed", "Medication reminders", "Education about drugs", "Cost assistance", "Simplified dosing", "Regular pharmacist consultations", "Family support", "Technology tools"]
            },
            {
                id: 30,
                type: 'text',
                question: "What specific medication questions or concerns would you like addressed?",
                placeholder: "Share any questions about your medications, interactions, side effects, or management strategies..."
            }
        ];
    }

    init() {
        this.renderQuestion();
        this.updateProgress();
    }

    generateSessionId() {
        return 'med-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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
                    <button class="nav-btn secondary" onclick="medicineAdvisor.previousQuestion()" 
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="nav-btn primary" onclick="medicineAdvisor.nextQuestion()" 
                            id="next-btn" disabled>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Generate Report' : 'Next'} 
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
                    <button class="option-btn" onclick="medicineAdvisor.selectSingle(${question.id}, '${option}')">
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
                    <button class="option-btn" onclick="medicineAdvisor.selectMultiple(${question.id}, '${option}')">
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
                       onchange="medicineAdvisor.updateScale(${question.id}, this.value)">
                <div class="scale-value">
                    <span id="scale-value-${question.id}">${Math.round((question.min + question.max) / 2)}</span>
                </div>
            </div>
        `;
    }

    renderNumber(question) {
        return `
            <div class="number-container">
                <input type="number" class="number-input" placeholder="${question.placeholder || ''}"
                       onchange="medicineAdvisor.updateNumber(${question.id}, this.value)">
            </div>
        `;
    }

    renderText(question) {
        return `
            <div class="text-container">
                <textarea class="text-input" placeholder="${question.placeholder || ''}" rows="4"
                          onchange="medicineAdvisor.updateText(${question.id}, this.value)"></textarea>
            </div>
        `;
    }

    // Add all the missing methods for handling responses
    selectSingle(questionId, value) {
        this.responses[questionId] = value;
        
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
            const report = this.generateMedicationReport();
            this.showResults(report);
        }, 2000);
    }

    generateMedicationReport() {
        const responses = this.responses;
        
        const safetyScore = this.calculateSafetyScore(responses);
        const adherenceScore = this.calculateAdherenceScore(responses);
        const knowledgeScore = this.calculateKnowledgeScore(responses);
        const overallScore = Math.round((safetyScore + adherenceScore + knowledgeScore) / 3);
        
        return {
            timestamp: new Date().toLocaleString(),
            sessionId: this.sessionId,
            overallScore: overallScore,
            safetyScore: safetyScore,
            adherenceScore: adherenceScore,
            knowledgeScore: knowledgeScore,
            riskFactors: this.identifyRiskFactors(responses),
            recommendations: this.generateRecommendations(responses),
            interactions: this.checkInteractions(responses),
            responses: responses
        };
    }

    calculateSafetyScore(responses) {
        let score = 70;
        
        // Allergy awareness
        if (responses[8] && responses[8].length > 1) score += 10;
        
        // Proper storage
        if (responses[16] === 'Original containers') score += 15;
        
        // Expiration checking
        if (responses[17] === 'Always') score += 10;
        else if (responses[17] === 'Usually') score += 5;
        
        // Provider communication
        if (responses[19] === 'Always') score += 15;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateAdherenceScore(responses) {
        let score = 60;
        
        // Missing doses
        const missedDoses = responses[10] || 5;
        score += (10 - missedDoses) * 5;
        
        // Timing consistency
        if (responses[11] === 'Always') score += 20;
        else if (responses[11] === 'Usually') score += 15;
        
        // Reminder system
        if (responses[9] !== 'Memory only') score += 10;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateKnowledgeScore(responses) {
        let score = 50;
        
        // Understanding
        const understanding = responses[23] || 5;
        score += understanding * 5;
        
        // Label reading
        if (responses[14] === 'Always') score += 15;
        else if (responses[14] === 'Usually') score += 10;
        
        // Food interactions
        if (responses[24] === 'Always follow directions') score += 15;
        
        return Math.max(0, Math.min(100, score));
    }

    identifyRiskFactors(responses) {
        const risks = [];
        
        if (responses[7] === 'More than 10') {
            risks.push({
                level: 'High',
                factor: 'Polypharmacy',
                description: 'Taking many medications increases interaction risk'
            });
        }
        
        if (responses[21] && responses[21].includes('Alcohol') && responses[22] !== 'None') {
            risks.push({
                level: 'Medium',
                factor: 'Alcohol interaction',
                description: 'Alcohol can interact with many medications'
            });
        }
        
        if (responses[10] > 7) {
            risks.push({
                level: 'High',
                factor: 'Poor adherence',
                description: 'Frequently missing doses reduces effectiveness'
            });
        }
        
        return risks;
    }

    generateRecommendations(responses) {
        const recommendations = [];
        
        recommendations.push({
            priority: 'High',
            category: 'Safety',
            action: 'Maintain updated medication list',
            explanation: 'Keep a current list of all medications for healthcare visits'
        });
        
        if (responses[10] > 5) {
            recommendations.push({
                priority: 'High',
                category: 'Adherence',
                action: 'Use medication reminders',
                explanation: 'Set up pill organizers or phone alerts to improve adherence'
            });
        }
        
        if (responses[20] === 'Never' || responses[20] === 'Rarely') {
            recommendations.push({
                priority: 'Medium',
                category: 'Professional Care',
                action: 'Schedule medication review',
                explanation: 'Regular pharmacist consultations can optimize your regimen'
            });
        }
        
        return recommendations;
    }

    checkInteractions(responses) {
        const interactions = [];
        
        // Basic interaction checks based on common patterns
        if (responses[21] && responses[21].includes('Grapefruit')) {
            interactions.push({
                type: 'Food-Drug',
                severity: 'Medium',
                description: 'Grapefruit can interact with many medications'
            });
        }
        
        if (responses[21] && responses[21].includes('Alcohol') && responses[4] && responses[4].includes('Depression')) {
            interactions.push({
                type: 'Drug-Alcohol',
                severity: 'High',
                description: 'Alcohol may interact with depression medications'
            });
        }
        
        return interactions;
    }

    showLoading() {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h3>Analyzing Your Medication Profile</h3>
                <p>Reviewing safety, adherence, and generating personalized recommendations...</p>
            </div>
        `;
    }

    showResults(report) {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2><i class="fas fa-pills"></i> Medication Safety Report</h2>
                    <div class="results-meta">
                        <span><i class="fas fa-calendar"></i> ${report.timestamp}</span>
                    </div>
                </div>

                <div class="results-summary">
                    <div class="summary-card">
                        <h3>Overall Safety Score</h3>
                        <div class="score-display">
                            <span class="score-number">${report.overallScore}</span>
                            <span class="score-total">/100</span>
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Safety Metrics</h3>
                        <div class="metrics-grid">
                            <div class="metric">
                                <span class="metric-name">Safety</span>
                                <span class="metric-value">${report.safetyScore}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-name">Adherence</span>
                                <span class="metric-value">${report.adherenceScore}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-name">Knowledge</span>
                                <span class="metric-value">${report.knowledgeScore}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="recommendations-section">
                    <h3><i class="fas fa-lightbulb"></i> Recommendations</h3>
                    ${report.recommendations.map(rec => `
                        <div class="recommendation-card ${rec.priority.toLowerCase()}">
                            <h4>${rec.action}</h4>
                            <p class="category">${rec.category}</p>
                            <p>${rec.explanation}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="medicineAdvisor.downloadReport()">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                    <button class="action-btn secondary" onclick="medicineAdvisor.startNew()">
                        <i class="fas fa-redo"></i> New Assessment
                    </button>
                </div>
            </div>
        `;
    }

    async downloadReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const report = this.generateMedicationReport();
        this.generateDetailedPDF(doc, report);
        doc.save(`medication-report-${report.sessionId}.pdf`);
    }

    generateDetailedPDF(doc, report) {
        let yPos = 20;
        
        doc.setFontSize(20);
        doc.setTextColor(40, 44, 52);
        doc.text('Medication Safety Report', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated: ${report.timestamp}`, 20, yPos);
        
        yPos += 20;
        
        doc.setFontSize(16);
        doc.setTextColor(40, 44, 52);
        doc.text(`Overall Score: ${report.overallScore}/100`, 20, yPos);
        
        yPos += 20;
        
        doc.setFontSize(14);
        doc.text('Recommendations', 20, yPos);
        yPos += 10;
        
        report.recommendations.forEach((rec, index) => {
            doc.setFontSize(11);
            doc.text(`${index + 1}. ${rec.action}`, 25, yPos);
            yPos += 6;
        });
        
        yPos += 20;
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('DISCLAIMER: This is for informational purposes only. Consult healthcare providers', 20, yPos);
        yPos += 4;
        doc.text('for medical advice and medication management.', 20, yPos);
    }

    startNew() {
        if (confirm('Start a new medication assessment?')) {
            this.currentQuestion = 0;
            this.responses = {};
            this.sessionId = this.generateSessionId();
            this.init();
        }
    }
}

// Initialize
let medicineAdvisor = new MedicineAdvisor30Q(); 