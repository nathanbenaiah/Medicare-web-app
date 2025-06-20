class SleepAnalyzer30Q {
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
                question: "How would you rate your overall sleep quality?",
                options: ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
            },
            {
                id: 2,
                type: 'number',
                question: "On average, how many hours do you sleep per night?",
                placeholder: "e.g., 7.5"
            },
            {
                id: 3,
                type: 'multiple',
                question: "What time do you usually go to bed on weekdays?",
                options: ["Before 9 PM", "9-10 PM", "10-11 PM", "11 PM-12 AM", "After 12 AM"]
            },
            {
                id: 4,
                type: 'multiple',
                question: "What time do you usually wake up on weekdays?",
                options: ["Before 5 AM", "5-6 AM", "6-7 AM", "7-8 AM", "After 8 AM"]
            },
            {
                id: 5,
                type: 'scale',
                question: "How long does it typically take you to fall asleep? (minutes)",
                min: 5,
                max: 60,
                labels: ["5 minutes", "60+ minutes"]
            },
            {
                id: 6,
                type: 'multiple',
                question: "How often do you wake up during the night?",
                options: ["Never", "Rarely (1x/week)", "Sometimes (2-3x/week)", "Often (4-5x/week)", "Every night"]
            },
            {
                id: 7,
                type: 'scale',
                question: "Rate how refreshed you feel when you wake up (1-10)",
                min: 1,
                max: 10,
                labels: ["Exhausted", "Very refreshed"]
            },
            {
                id: 8,
                type: 'checkbox',
                question: "What sleep issues do you experience? (Select all that apply)",
                options: ["None", "Difficulty falling asleep", "Frequent waking", "Early morning awakening", "Snoring", "Sleep apnea", "Restless legs", "Nightmares"]
            },
            {
                id: 9,
                type: 'multiple',
                question: "Do you have a consistent bedtime routine?",
                options: ["Yes, very consistent", "Mostly consistent", "Sometimes", "Rarely", "No routine"]
            },
            {
                id: 10,
                type: 'checkbox',
                question: "What activities do you do before bed? (Select all that apply)",
                options: ["Reading", "Watching TV/screens", "Meditation", "Bath/shower", "Listening to music", "Exercise", "Eating", "Working"]
            },
            {
                id: 11,
                type: 'scale',
                question: "Rate your bedroom temperature comfort (1-10)",
                min: 1,
                max: 10,
                labels: ["Too hot/cold", "Perfect"]
            },
            {
                id: 12,
                type: 'multiple',
                question: "How dark is your bedroom when you sleep?",
                options: ["Completely dark", "Mostly dark", "Some light", "Fairly bright", "Very bright"]
            },
            {
                id: 13,
                type: 'multiple',
                question: "How quiet is your sleeping environment?",
                options: ["Completely silent", "Very quiet", "Some noise", "Moderately noisy", "Very noisy"]
            },
            {
                id: 14,
                type: 'checkbox',
                question: "What do you use to help you sleep? (Select all that apply)",
                options: ["Nothing", "Sleep mask", "Earplugs", "White noise", "Fan", "Blackout curtains", "Sleep medication", "Melatonin"]
            },
            {
                id: 15,
                type: 'scale',
                question: "Rate your mattress comfort (1-10)",
                min: 1,
                max: 10,
                labels: ["Very uncomfortable", "Very comfortable"]
            },
            {
                id: 16,
                type: 'multiple',
                question: "How often do you nap during the day?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Daily"]
            },
            {
                id: 17,
                type: 'multiple',
                question: "When do you typically nap?",
                options: ["I don't nap", "Morning", "Early afternoon", "Late afternoon", "Evening"]
            },
            {
                id: 18,
                type: 'checkbox',
                question: "What substances do you consume that might affect sleep? (Select all that apply)",
                options: ["None", "Caffeine (coffee/tea)", "Alcohol", "Nicotine", "Sleep medication", "Energy drinks", "Large meals before bed"]
            },
            {
                id: 19,
                type: 'multiple',
                question: "When do you have your last caffeinated drink?",
                options: ["I don't drink caffeine", "Morning only", "Before noon", "Early afternoon", "Late afternoon", "Evening"]
            },
            {
                id: 20,
                type: 'scale',
                question: "Rate your stress levels before bedtime (1-10)",
                min: 1,
                max: 10,
                labels: ["Very relaxed", "Very stressed"]
            },
            {
                id: 21,
                type: 'multiple',
                question: "How much screen time do you have in the 2 hours before bed?",
                options: ["None", "Less than 30 min", "30-60 min", "1-2 hours", "More than 2 hours"]
            },
            {
                id: 22,
                type: 'multiple',
                question: "When do you typically exercise?",
                options: ["I don't exercise", "Morning", "Afternoon", "Early evening", "Late evening (within 3 hours of bed)"]
            },
            {
                id: 23,
                type: 'scale',
                question: "How often do you feel tired during the day? (1-10 scale)",
                min: 1,
                max: 10,
                labels: ["Never tired", "Always tired"]
            },
            {
                id: 24,
                type: 'checkbox',
                question: "What symptoms do you experience due to poor sleep? (Select all that apply)",
                options: ["None", "Difficulty concentrating", "Mood changes", "Memory problems", "Headaches", "Weight gain", "Frequent illness", "Low energy"]
            },
            {
                id: 25,
                type: 'multiple',
                question: "Do you sleep differently on weekends vs weekdays?",
                options: ["No, same schedule", "Slightly different", "Moderately different", "Very different", "Completely different"]
            },
            {
                id: 26,
                type: 'multiple',
                question: "How often do you use electronic devices in bed?",
                options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: 27,
                type: 'multiple',
                question: "Have you ever been diagnosed with a sleep disorder?",
                options: ["No", "Sleep apnea", "Insomnia", "Restless leg syndrome", "Narcolepsy", "Other", "Suspected but not diagnosed"]
            },
            {
                id: 28,
                type: 'scale',
                question: "Rate your partner's impact on your sleep quality (1-10)",
                min: 1,
                max: 10,
                labels: ["Very disruptive", "Very helpful"]
            },
            {
                id: 29,
                type: 'checkbox',
                question: "What relaxation techniques do you use before bed? (Select all that apply)",
                options: ["None", "Deep breathing", "Progressive muscle relaxation", "Meditation", "Yoga", "Journaling", "Prayer", "Aromatherapy"]
            },
            {
                id: 30,
                type: 'text',
                question: "What specific sleep challenges would you most like to improve?",
                placeholder: "Describe your main sleep concerns or goals for better sleep..."
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
                    <button class="nav-btn secondary" onclick="sleepAnalyzer.previousQuestion()" 
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="nav-btn primary" onclick="sleepAnalyzer.nextQuestion()" 
                            id="next-btn" disabled>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Analyze Sleep' : 'Next'} 
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
                    <button class="option-btn" onclick="sleepAnalyzer.selectSingle(${question.id}, '${option}')">
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
                    <button class="option-btn" onclick="sleepAnalyzer.selectMultiple(${question.id}, '${option}')">
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
                       onchange="sleepAnalyzer.updateScale(${question.id}, this.value)">
                <div class="scale-value">
                    <span id="scale-value-${question.id}">${Math.round((question.min + question.max) / 2)}</span>
                </div>
            </div>
        `;
    }

    renderNumber(question) {
        return `
            <div class="number-container">
                <input type="number" class="number-input" placeholder="${question.placeholder || ''}" step="0.5"
                       onchange="sleepAnalyzer.updateNumber(${question.id}, this.value)">
            </div>
        `;
    }

    renderText(question) {
        return `
            <div class="text-container">
                <textarea class="text-input" placeholder="${question.placeholder || ''}" rows="4"
                          onchange="sleepAnalyzer.updateText(${question.id}, this.value)"></textarea>
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
        this.responses[questionId] = parseFloat(value);
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
            const analysis = this.analyzeSleep();
            this.showResults(analysis);
        }, 2000);
    }

    analyzeSleep() {
        const responses = this.responses;
        
        // Calculate sleep metrics
        const sleepQuality = this.calculateSleepQuality(responses);
        const sleepEfficiency = this.calculateSleepEfficiency(responses);
        const sleepHygiene = this.calculateSleepHygiene(responses);
        const overallScore = Math.round((sleepQuality + sleepEfficiency + sleepHygiene) / 3);
        
        // Identify main issues
        const issues = this.identifySleepIssues(responses);
        const recommendations = this.generateRecommendations(responses, issues);
        
        return {
            timestamp: new Date().toLocaleString(),
            sessionId: this.sessionId,
            overallScore: overallScore,
            sleepQuality: sleepQuality,
            sleepEfficiency: sleepEfficiency,
            sleepHygiene: sleepHygiene,
            sleepHours: responses[2] || 'Not specified',
            bedtime: responses[3] || 'Not specified',
            wakeTime: responses[4] || 'Not specified',
            timeToSleep: responses[5] || 'Not specified',
            issues: issues,
            recommendations: recommendations,
            sleepEnvironment: this.analyzeSleepEnvironment(responses),
            lifestyle: this.analyzeLifestyleFactors(responses),
            responses: responses
        };
    }

    calculateSleepQuality(responses) {
        let score = 70; // Start with baseline
        
        // Overall quality rating (Q1)
        const quality = responses[1];
        if (quality === 'Excellent') score += 30;
        else if (quality === 'Good') score += 20;
        else if (quality === 'Fair') score += 0;
        else if (quality === 'Poor') score -= 20;
        else if (quality === 'Very Poor') score -= 30;
        
        // Refreshed feeling (Q7)
        const refreshed = responses[7];
        if (refreshed) {
            score += (refreshed - 5) * 4; // Scale adjustment
        }
        
        // Night wakings (Q6)
        const wakings = responses[6];
        if (wakings === 'Never') score += 15;
        else if (wakings === 'Rarely (1x/week)') score += 10;
        else if (wakings === 'Sometimes (2-3x/week)') score -= 5;
        else if (wakings === 'Often (4-5x/week)') score -= 15;
        else if (wakings === 'Every night') score -= 25;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateSleepEfficiency(responses) {
        let score = 70;
        
        // Time to fall asleep (Q5)
        const timeToSleep = responses[5];
        if (timeToSleep) {
            if (timeToSleep <= 15) score += 20;
            else if (timeToSleep <= 30) score += 10;
            else if (timeToSleep <= 45) score -= 10;
            else score -= 20;
        }
        
        // Sleep hours (Q2)
        const hours = responses[2];
        if (hours) {
            if (hours >= 7 && hours <= 9) score += 20;
            else if (hours >= 6 && hours < 7) score += 10;
            else if (hours >= 5 && hours < 6) score -= 10;
            else score -= 20;
        }
        
        // Daytime tiredness (Q23)
        const tiredness = responses[23];
        if (tiredness) {
            score -= (tiredness - 1) * 8; // Higher tiredness = lower score
        }
        
        return Math.max(0, Math.min(100, score));
    }

    calculateSleepHygiene(responses) {
        let score = 50;
        
        // Bedtime routine (Q9)
        const routine = responses[9];
        if (routine === 'Yes, very consistent') score += 20;
        else if (routine === 'Mostly consistent') score += 15;
        else if (routine === 'Sometimes') score += 5;
        else score -= 10;
        
        // Screen time before bed (Q21)
        const screenTime = responses[21];
        if (screenTime === 'None') score += 20;
        else if (screenTime === 'Less than 30 min') score += 10;
        else if (screenTime === '30-60 min') score -= 5;
        else score -= 15;
        
        // Caffeine timing (Q19)
        const caffeine = responses[19];
        if (caffeine === "I don't drink caffeine" || caffeine === 'Morning only') score += 15;
        else if (caffeine === 'Before noon') score += 10;
        else if (caffeine === 'Early afternoon') score -= 5;
        else score -= 15;
        
        // Exercise timing (Q22)
        const exercise = responses[22];
        if (exercise === 'Late evening (within 3 hours of bed)') score -= 15;
        else if (exercise !== "I don't exercise") score += 10;
        
        return Math.max(0, Math.min(100, score));
    }

    identifySleepIssues(responses) {
        const issues = [];
        
        // Sleep disorders (Q8)
        const sleepIssues = responses[8] || [];
        if (sleepIssues.includes('Difficulty falling asleep')) {
            issues.push({
                type: 'Sleep Onset',
                severity: 'Moderate',
                description: 'Difficulty falling asleep'
            });
        }
        
        if (sleepIssues.includes('Frequent waking')) {
            issues.push({
                type: 'Sleep Maintenance',
                severity: 'Moderate',
                description: 'Frequent nighttime awakenings'
            });
        }
        
        if (sleepIssues.includes('Snoring') || sleepIssues.includes('Sleep apnea')) {
            issues.push({
                type: 'Breathing',
                severity: 'High',
                description: 'Breathing-related sleep disorder'
            });
        }
        
        // Environmental issues
        if (responses[12] !== 'Completely dark' && responses[12] !== 'Mostly dark') {
            issues.push({
                type: 'Environment',
                severity: 'Low',
                description: 'Room too bright for optimal sleep'
            });
        }
        
        if (responses[13] === 'Moderately noisy' || responses[13] === 'Very noisy') {
            issues.push({
                type: 'Environment',
                severity: 'Moderate',
                description: 'Noisy sleep environment'
            });
        }
        
        // Lifestyle issues
        if (responses[21] === 'More than 2 hours' || responses[21] === '1-2 hours') {
            issues.push({
                type: 'Sleep Hygiene',
                severity: 'Moderate',
                description: 'Excessive screen time before bed'
            });
        }
        
        return issues;
    }

    generateRecommendations(responses, issues) {
        const recommendations = [];
        
        // Based on sleep quality
        if (this.calculateSleepQuality(responses) < 60) {
            recommendations.push({
                category: 'Sleep Quality',
                priority: 'High',
                action: 'Establish a consistent bedtime routine',
                explanation: 'Regular routines signal your body to prepare for sleep'
            });
        }
        
        // Based on identified issues
        issues.forEach(issue => {
            if (issue.type === 'Sleep Onset') {
                recommendations.push({
                    category: 'Sleep Onset',
                    priority: 'High',
                    action: 'Practice relaxation techniques before bed',
                    explanation: 'Deep breathing, meditation, or progressive muscle relaxation can help'
                });
            }
            
            if (issue.type === 'Environment') {
                recommendations.push({
                    category: 'Sleep Environment',
                    priority: 'Medium',
                    action: 'Optimize your bedroom environment',
                    explanation: 'Use blackout curtains, white noise, and maintain cool temperature'
                });
            }
            
            if (issue.type === 'Sleep Hygiene') {
                recommendations.push({
                    category: 'Sleep Hygiene',
                    priority: 'High',
                    action: 'Limit screen time before bed',
                    explanation: 'Blue light can interfere with melatonin production'
                });
            }
        });
        
        // General recommendations
        recommendations.push({
            category: 'General',
            priority: 'Medium',
            action: 'Maintain consistent sleep schedule',
            explanation: 'Go to bed and wake up at the same time every day, including weekends'
        });
        
        recommendations.push({
            category: 'General',
            priority: 'Medium',
            action: 'Create a sleep-conducive environment',
            explanation: 'Keep bedroom cool (60-67°F), dark, and quiet'
        });
        
        return recommendations.slice(0, 8); // Limit to top 8 recommendations
    }

    analyzeSleepEnvironment(responses) {
        return {
            temperature: responses[11] ? `${responses[11]}/10` : 'Not rated',
            darkness: responses[12] || 'Not specified',
            noise: responses[13] || 'Not specified',
            mattressComfort: responses[15] ? `${responses[15]}/10` : 'Not rated',
            sleepAids: responses[14] || []
        };
    }

    analyzeLifestyleFactors(responses) {
        return {
            caffeine: responses[19] || 'Not specified',
            exercise: responses[22] || 'Not specified',
            screenTime: responses[21] || 'Not specified',
            stress: responses[20] ? `${responses[20]}/10` : 'Not rated',
            substances: responses[18] || []
        };
    }

    showLoading() {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h3>Analyzing Your Sleep Patterns</h3>
                <p>Processing your sleep habits and generating personalized insights...</p>
                <div class="loading-steps">
                    <div class="step">Evaluating sleep quality...</div>
                    <div class="step">Analyzing sleep efficiency...</div>
                    <div class="step">Assessing sleep hygiene...</div>
                    <div class="step">Generating recommendations...</div>
                </div>
            </div>
        `;
    }

    showResults(analysis) {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2><i class="fas fa-moon"></i> Sleep Quality Analysis Results</h2>
                    <div class="results-meta">
                        <span><i class="fas fa-calendar"></i> ${analysis.timestamp}</span>
                        <span><i class="fas fa-bed"></i> Session: ${analysis.sessionId}</span>
                    </div>
                </div>

                <div class="results-summary">
                    <div class="summary-card">
                        <h3>Overall Sleep Score</h3>
                        <div class="score-display">
                            <span class="score-number">${analysis.overallScore}</span>
                            <span class="score-total">/100</span>
                        </div>
                        <p class="${this.getScoreClass(analysis.overallScore)}">${this.getScoreCategory(analysis.overallScore)}</p>
                    </div>

                    <div class="summary-card">
                        <h3>Sleep Pattern</h3>
                        <div class="pattern-info">
                            <div class="pattern-item">
                                <span class="label">Sleep Duration:</span>
                                <span class="value">${analysis.sleepHours} hours</span>
                            </div>
                            <div class="pattern-item">
                                <span class="label">Bedtime:</span>
                                <span class="value">${analysis.bedtime}</span>
                            </div>
                            <div class="pattern-item">
                                <span class="label">Time to Sleep:</span>
                                <span class="value">${analysis.timeToSleep} min</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Sleep Metrics</h3>
                        <div class="metrics-grid">
                            <div class="metric">
                                <span class="metric-name">Quality</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${analysis.sleepQuality}%"></div>
                                </div>
                                <span class="metric-value">${analysis.sleepQuality}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-name">Efficiency</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${analysis.sleepEfficiency}%"></div>
                                </div>
                                <span class="metric-value">${analysis.sleepEfficiency}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-name">Hygiene</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${analysis.sleepHygiene}%"></div>
                                </div>
                                <span class="metric-value">${analysis.sleepHygiene}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                ${analysis.issues.length > 0 ? `
                    <div class="issues-section">
                        <h3><i class="fas fa-exclamation-circle"></i> Identified Sleep Issues</h3>
                        <div class="issues-grid">
                            ${analysis.issues.map(issue => `
                                <div class="issue-card ${issue.severity.toLowerCase()}">
                                    <h4>${issue.type}</h4>
                                    <p class="severity">${issue.severity} Priority</p>
                                    <p>${issue.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="analysis-details">
                    <div class="detail-section">
                        <h3><i class="fas fa-lightbulb"></i> Personalized Recommendations</h3>
                        <div class="recommendations-grid">
                            ${analysis.recommendations.map(rec => `
                                <div class="recommendation-card ${rec.priority.toLowerCase()}">
                                    <div class="rec-header">
                                        <h4>${rec.action}</h4>
                                        <span class="priority ${rec.priority.toLowerCase()}">${rec.priority}</span>
                                    </div>
                                    <p class="category">${rec.category}</p>
                                    <p class="explanation">${rec.explanation}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-home"></i> Sleep Environment</h3>
                        <div class="environment-grid">
                            <div class="env-item">
                                <span class="env-label">Temperature Comfort:</span>
                                <span class="env-value">${analysis.sleepEnvironment.temperature}</span>
                            </div>
                            <div class="env-item">
                                <span class="env-label">Room Darkness:</span>
                                <span class="env-value">${analysis.sleepEnvironment.darkness}</span>
                            </div>
                            <div class="env-item">
                                <span class="env-label">Noise Level:</span>
                                <span class="env-value">${analysis.sleepEnvironment.noise}</span>
                            </div>
                            <div class="env-item">
                                <span class="env-label">Mattress Comfort:</span>
                                <span class="env-value">${analysis.sleepEnvironment.mattressComfort}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-life-ring"></i> Lifestyle Factors</h3>
                        <div class="lifestyle-grid">
                            <div class="lifestyle-item">
                                <span class="lifestyle-label">Caffeine Timing:</span>
                                <span class="lifestyle-value">${analysis.lifestyle.caffeine}</span>
                            </div>
                            <div class="lifestyle-item">
                                <span class="lifestyle-label">Exercise Timing:</span>
                                <span class="lifestyle-value">${analysis.lifestyle.exercise}</span>
                            </div>
                            <div class="lifestyle-item">
                                <span class="lifestyle-label">Screen Time:</span>
                                <span class="lifestyle-value">${analysis.lifestyle.screenTime}</span>
                            </div>
                            <div class="lifestyle-item">
                                <span class="lifestyle-label">Stress Level:</span>
                                <span class="lifestyle-value">${analysis.lifestyle.stress}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="sleepAnalyzer.downloadReport()">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                    <button class="action-btn secondary" onclick="sleepAnalyzer.shareResults()">
                        <i class="fas fa-share"></i> Share Results
                    </button>
                    <button class="action-btn secondary" onclick="sleepAnalyzer.startNew()">
                        <i class="fas fa-redo"></i> New Analysis
                    </button>
                </div>
            </div>
        `;
    }

    getScoreClass(score) {
        if (score >= 80) return 'metric-value healthy';
        if (score >= 60) return 'metric-value warning';
        return 'metric-value danger';
    }

    getScoreCategory(score) {
        if (score >= 85) return 'Excellent sleep quality';
        if (score >= 70) return 'Good sleep quality';
        if (score >= 55) return 'Fair sleep quality';
        if (score >= 40) return 'Poor sleep quality';
        return 'Very poor sleep quality';
    }

    async downloadReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const analysis = this.analyzeSleep();
        this.generateDetailedPDF(doc, analysis);
        doc.save(`sleep-analysis-${analysis.sessionId}.pdf`);
    }

    generateDetailedPDF(doc, analysis) {
        let yPos = 20;
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 44, 52);
        doc.text('Sleep Quality Analysis Report', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated: ${analysis.timestamp} | Session: ${analysis.sessionId}`, 20, yPos);
        
        yPos += 20;
        
        // Overall Score
        doc.setFontSize(16);
        doc.setTextColor(40, 44, 52);
        doc.text('Overall Sleep Score', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(24);
        doc.setTextColor(52, 152, 219);
        doc.text(`${analysis.overallScore}/100`, 20, yPos);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(40, 44, 52);
        doc.text(`Category: ${this.getScoreCategory(analysis.overallScore)}`, 20, yPos);
        
        yPos += 20;
        
        // Sleep Metrics
        doc.setFontSize(14);
        doc.text('Sleep Metrics', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.text(`Sleep Quality: ${analysis.sleepQuality}%`, 20, yPos);
        yPos += 6;
        doc.text(`Sleep Efficiency: ${analysis.sleepEfficiency}%`, 20, yPos);
        yPos += 6;
        doc.text(`Sleep Hygiene: ${analysis.sleepHygiene}%`, 20, yPos);
        
        yPos += 20;
        
        // Sleep Pattern
        doc.setFontSize(14);
        doc.text('Sleep Pattern', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.text(`Sleep Duration: ${analysis.sleepHours} hours`, 20, yPos);
        yPos += 6;
        doc.text(`Bedtime: ${analysis.bedtime}`, 20, yPos);
        yPos += 6;
        doc.text(`Time to Fall Asleep: ${analysis.timeToSleep} minutes`, 20, yPos);
        
        yPos += 20;
        
        // Recommendations
        if (analysis.recommendations.length > 0) {
            doc.setFontSize(14);
            doc.text('Key Recommendations', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            analysis.recommendations.slice(0, 6).forEach((rec, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`${index + 1}. ${rec.action}`, 25, yPos);
                yPos += 6;
                doc.text(`   ${rec.explanation}`, 25, yPos);
                yPos += 8;
            });
        }
        
        // Issues
        if (analysis.issues.length > 0) {
            yPos += 10;
            doc.setFontSize(14);
            doc.text('Identified Issues', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            analysis.issues.forEach((issue, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${issue.type}: ${issue.description} (${issue.severity} priority)`, 25, yPos);
                yPos += 6;
            });
        }
        
        // Disclaimer
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 20;
        }
        
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('DISCLAIMER: This sleep analysis is for informational purposes only and does not', 20, yPos);
        yPos += 4;
        doc.text('replace professional medical advice. Consult with a sleep specialist or healthcare', 20, yPos);
        yPos += 4;
        doc.text('provider for persistent sleep problems or suspected sleep disorders.', 20, yPos);
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'My Sleep Quality Analysis',
                text: 'I analyzed my sleep patterns and got personalized recommendations. Check your sleep quality too!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Sleep analysis link copied to clipboard!');
        }
    }

    startNew() {
        if (confirm('Are you sure you want to start a new sleep analysis? Your current results will be lost.')) {
            this.currentQuestion = 0;
            this.responses = {};
            this.sessionId = this.generateSessionId();
            this.init();
        }
    }

    generateSessionId() {
        return 'sleep-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

// Global variable for assessment instance
let sleepAnalyzer;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof SleepAnalyzer30Q !== 'undefined') {
        sleepAnalyzer = new SleepAnalyzer30Q();
    }
}); 