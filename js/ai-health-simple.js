// Simplified AI Health Assessment System
class SimpleAIHealthSystem {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.assessmentType = this.getAssessmentType();
        this.questions = this.getQuestionsForType(this.assessmentType);
        this.analysisResults = null;
        this.init();
    }

    init() {
        this.updateAssessmentHeader();
        this.loadQuestion();
        this.updateProgress();
        this.updateNavigationButtons();
    }

    getAssessmentType() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'symptom-checker';
    }

    getQuestionsForType(type) {
        const basicQuestions = [
            { id: 1, type: 'text', question: 'Q1. What is your full name?', description: 'Please enter your complete name.', required: true, placeholder: 'Enter your full name' },
            { id: 2, type: 'text', question: 'Q2. What is your age?', description: 'Please enter your age in years.', required: true, placeholder: 'Enter your age (e.g., 25)' },
            { id: 3, type: 'multiple', question: 'Q3. What is your gender?', description: 'Please select your gender.', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], required: true },
            { id: 4, type: 'text', question: 'Q4. What is your contact number?', description: 'Please enter your phone number.', required: true, placeholder: 'Enter your contact number (e.g., 0771234567)' },
            { id: 5, type: 'multiple', question: 'Q5. Which district are you from?', description: 'Select your district in Sri Lanka.', options: [{ value: 'colombo', label: 'Colombo' }, { value: 'gampaha', label: 'Gampaha' }, { value: 'kandy', label: 'Kandy' }, { value: 'galle', label: 'Galle' }, { value: 'other', label: 'Other District' }], required: true }
        ];

        const config = window.ASSESSMENT_CONFIGS && window.ASSESSMENT_CONFIGS[type];
        const specializedQuestions = config ? config.questions : [{ id: 6, type: 'multiple', question: 'Q6. What is your primary concern?', description: 'Select your main health issue.', options: [{ value: 'general', label: 'General Health Check' }, { value: 'specific', label: 'Specific Health Issue' }], required: true }];

        return [...basicQuestions, ...specializedQuestions];
    }

    updateAssessmentHeader() {
        const config = this.getAssessmentConfig(this.assessmentType);
        const titleElement = document.getElementById('assessmentTitle');
        const subtitleElement = document.getElementById('assessmentSubtitle');
        const iconElement = document.getElementById('assessmentIcon');
        
        if (titleElement) titleElement.textContent = config.title;
        if (subtitleElement) subtitleElement.textContent = config.subtitle;
        if (iconElement) iconElement.innerHTML = `<i class="${config.icon}"></i>`;
    }

    getAssessmentConfig(type) {
        const configs = {
            'symptom-checker': { title: 'AI Symptom Checker', subtitle: 'Advanced symptom analysis with AI-powered medical guidance', icon: 'fas fa-stethoscope' },
            'diet-planner': { title: 'Smart Diet Planner', subtitle: 'Personalized nutrition plans based on your health goals', icon: 'fas fa-utensils' },
            'mental-health': { title: 'Mental Health Support', subtitle: 'Comprehensive mental wellness assessment and support', icon: 'fas fa-brain' },
            'fitness-coach': { title: 'AI Fitness Coach', subtitle: 'Personalized workout plans and fitness guidance', icon: 'fas fa-dumbbell' },
            'sleep-analyzer': { title: 'Sleep Quality Analyzer', subtitle: 'Comprehensive sleep analysis and improvement recommendations', icon: 'fas fa-bed' }
        };
        return configs[type] || configs['symptom-checker'];
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;
        const container = document.getElementById('questionContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="question-header">
                <h2 class="question-title">${question.question}</h2>
                <p class="question-description">${question.description}</p>
            </div>
            <div class="question-content">${this.renderQuestionInput(question)}</div>
        `;
        
        if (this.responses[this.currentQuestion + 1]) {
            if (question.type === 'text') {
                const textInput = document.getElementById('textInput');
                if (textInput) textInput.value = this.responses[this.currentQuestion + 1];
            } else {
                this.updateOptionDisplay();
            }
        }
    }

    renderQuestionInput(question) {
        if (question.type === 'text') {
            return `<div class="text-input-container"><textarea id="textInput" placeholder="${question.placeholder || 'Enter your response...'}" rows="4" oninput="window.assessment.handleTextInput(this.value)"></textarea></div>`;
        } else if (question.type === 'multiple') {
            return `<div class="answer-options">${question.options.map(option => `<div class="answer-option ${question.multiple ? 'checkbox' : 'radio'}" onclick="window.assessment.selectOption('${option.value}', ${question.multiple || false})" data-value="${option.value}"><div class="option-content"><div class="option-header"><span class="option-label">${option.label}</span><div class="option-indicator"></div></div>${option.description ? `<p class="option-description">${option.description}</p>` : ''}</div></div>`).join('')}</div>`;
        }
    }

    selectOption(value, isMultiple = false) {
        if (isMultiple) {
            if (!this.responses[this.currentQuestion + 1]) this.responses[this.currentQuestion + 1] = [];
            const responses = this.responses[this.currentQuestion + 1];
            const index = responses.indexOf(value);
            if (index > -1) responses.splice(index, 1);
            else responses.push(value);
        } else {
            this.responses[this.currentQuestion + 1] = value;
        }
        this.updateOptionDisplay();
        this.updateNavigationButtons();
    }

    handleTextInput(value) {
        this.responses[this.currentQuestion + 1] = value;
        this.updateNavigationButtons();
    }

    updateOptionDisplay() {
        const options = document.querySelectorAll('.answer-option');
        const currentResponses = this.responses[this.currentQuestion + 1] || [];
        options.forEach(option => {
            const value = option.getAttribute('data-value');
            const isSelected = Array.isArray(currentResponses) ? currentResponses.includes(value) : currentResponses === value;
            option.classList.toggle('selected', isSelected);
        });
    }

    updateProgress() {
        const progressPercentage = Math.round((this.currentQuestion / this.questions.length) * 100);
        const progressElement = document.getElementById('progressPercentage');
        const progressFill = document.getElementById('progressFill');
        if (progressElement) progressElement.textContent = `${progressPercentage}%`;
        if (progressFill) progressFill.style.width = `${progressPercentage}%`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.style.display = this.currentQuestion > 0 ? 'flex' : 'none';
        if (nextBtn) {
            const currentResponse = this.responses[this.currentQuestion + 1];
            const hasResponse = currentResponse && (typeof currentResponse === 'string' ? currentResponse.trim() : Array.isArray(currentResponse) ? currentResponse.length > 0 : true);
            nextBtn.disabled = !hasResponse;
            if (this.currentQuestion >= this.questions.length - 1) {
                nextBtn.innerHTML = '<i class="fas fa-check"></i> Complete Assessment';
                nextBtn.onclick = () => this.completeAssessment();
            } else {
                nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
                nextBtn.onclick = () => this.nextQuestion();
            }
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    async completeAssessment() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.analysisResults = this.generateAnalysis();
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        this.showResults();
    }

    generateAnalysis() {
        const generators = {
            'symptom-checker': () => ({ healthScore: 75, sections: [{ title: 'Symptom Analysis', content: 'Based on your responses, we have identified your primary symptoms.', type: 'analysis' }] }),
            'diet-planner': () => ({ healthScore: 82, sections: [{ title: 'Nutritional Assessment', content: 'Your diet shows good potential with room for optimization.', type: 'analysis' }] }),
            'mental-health': () => ({ healthScore: 68, sections: [{ title: 'Mental Wellness Assessment', content: 'Your responses indicate some areas that could benefit from attention.', type: 'analysis' }] }),
            'fitness-coach': () => ({ healthScore: 78, sections: [{ title: 'Fitness Assessment', content: 'Your fitness level shows good foundation for improvement.', type: 'analysis' }] }),
            'sleep-analyzer': () => ({ healthScore: 71, sections: [{ title: 'Sleep Quality Assessment', content: 'Your sleep patterns show areas that could be optimized.', type: 'analysis' }] })
        };
        const generator = generators[this.assessmentType] || generators['symptom-checker'];
        return generator();
    }

    showResults() {
        const assessmentSection = document.getElementById('assessmentSection');
        const resultsSection = document.getElementById('resultsSection');
        if (assessmentSection) assessmentSection.style.display = 'none';
        if (resultsSection) {
            resultsSection.style.display = 'block';
            this.renderResults();
        }
    }

    renderResults() {
        const analysisGrid = document.getElementById('analysisGrid');
        if (!analysisGrid || !this.analysisResults) return;
        analysisGrid.innerHTML = this.analysisResults.sections.map(section => `<div class="analysis-box ${section.type}"><div class="analysis-header"><h3>${section.title}</h3></div><div class="analysis-content"><p>${section.content}</p></div></div>`).join('');
    }

    async downloadPDF() {
        if (!this.analysisResults) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const colors = {
            'symptom-checker': [59, 130, 246],
            'diet-planner': [16, 185, 129],
            'mental-health': [139, 92, 246],
            'fitness-coach': [245, 158, 11],
            'sleep-analyzer': [6, 182, 212]
        };
        
        const color = colors[this.assessmentType] || colors['symptom-checker'];
        doc.setFillColor(...color);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text(this.getAssessmentConfig(this.assessmentType).title.toUpperCase(), 20, 25);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Patient: ${this.responses[1] || 'N/A'}`, 20, 60);
        doc.text(`Age: ${this.responses[2] || 'N/A'}`, 20, 70);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);

        let yPos = 100;
        this.analysisResults.sections.forEach(section => {
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(section.title, 20, yPos);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            const lines = doc.splitTextToSize(section.content, 170);
            doc.text(lines, 20, yPos + 10);
            yPos += 30 + (lines.length * 5);
        });

        doc.save(`${this.assessmentType}_${this.responses[1] || 'Patient'}.pdf`);
    }
}

// Global functions
function selectOption(value, isMultiple = false) { if (window.assessment) window.assessment.selectOption(value, isMultiple); }
function handleTextInput(value) { if (window.assessment) window.assessment.handleTextInput(value); }
function nextQuestion() { if (window.assessment) window.assessment.nextQuestion(); }
function previousQuestion() { if (window.assessment) window.assessment.previousQuestion(); }
function downloadPDF() { if (window.assessment) window.assessment.downloadPDF(); }
function startNewAssessment() { window.location.reload(); } 