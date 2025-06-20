// AI Fitness Coach 30-Question Assessment
class FitnessCoach30Q {
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
                question: "What is your primary fitness goal?",
                options: ["Weight loss", "Muscle gain", "Improve endurance", "General fitness", "Strength building", "Athletic performance"]
            },
            {
                id: 2,
                type: 'multiple',
                question: "What is your current activity level?",
                options: ["Sedentary (little to no exercise)", "Lightly active (1-3 days/week)", "Moderately active (3-5 days/week)", "Very active (6-7 days/week)", "Extremely active (2x/day)"]
            },
            {
                id: 3,
                type: 'number',
                question: "What is your age?",
                placeholder: "Enter your age in years"
            },
            {
                id: 4,
                type: 'multiple',
                question: "What is your biological sex?",
                options: ["Male", "Female", "Prefer not to say"]
            },
            {
                id: 5,
                type: 'number',
                question: "What is your height in centimeters?",
                placeholder: "e.g., 175"
            },
            {
                id: 6,
                type: 'number',
                question: "What is your current weight in kilograms?",
                placeholder: "e.g., 70"
            },
            {
                id: 7,
                type: 'number',
                question: "What is your target weight in kilograms? (Optional)",
                placeholder: "e.g., 65"
            },
            {
                id: 8,
                type: 'checkbox',
                question: "Do you have any health conditions or injuries? (Select all that apply)",
                options: ["None", "Back problems", "Knee problems", "Heart condition", "Diabetes", "High blood pressure", "Joint issues", "Previous injuries"]
            },
            {
                id: 9,
                type: 'multiple',
                question: "How much time can you dedicate to exercise per session?",
                options: ["15-30 minutes", "30-45 minutes", "45-60 minutes", "60-90 minutes", "90+ minutes"]
            },
            {
                id: 10,
                type: 'multiple',
                question: "How many days per week can you commit to exercising?",
                options: ["1-2 days", "3-4 days", "5-6 days", "7 days", "Flexible schedule"]
            },
            {
                id: 11,
                type: 'checkbox',
                question: "What types of exercise do you enjoy? (Select all that apply)",
                options: ["Cardio/Running", "Weight training", "Yoga", "Swimming", "Cycling", "Dancing", "Sports", "Hiking", "Group classes"]
            },
            {
                id: 12,
                type: 'multiple',
                question: "Where do you prefer to exercise?",
                options: ["At home", "Gym/Fitness center", "Outdoors", "Community center", "No preference"]
            },
            {
                id: 13,
                type: 'checkbox',
                question: "What equipment do you have access to? (Select all that apply)",
                options: ["None (bodyweight only)", "Dumbbells", "Resistance bands", "Yoga mat", "Treadmill", "Full gym equipment", "Bicycle", "Swimming pool"]
            },
            {
                id: 14,
                type: 'scale',
                question: "Rate your current fitness level (1-10)",
                min: 1,
                max: 10,
                labels: ["Beginner", "Expert"]
            },
            {
                id: 15,
                type: 'multiple',
                question: "How experienced are you with weight training?",
                options: ["Complete beginner", "Some experience", "Intermediate", "Advanced", "Expert level"]
            },
            {
                id: 16,
                type: 'scale',
                question: "How important is weight loss to you? (1-10)",
                min: 1,
                max: 10,
                labels: ["Not important", "Very important"]
            },
            {
                id: 17,
                type: 'scale',
                question: "How important is building muscle to you? (1-10)",
                min: 1,
                max: 10,
                labels: ["Not important", "Very important"]
            },
            {
                id: 18,
                type: 'multiple',
                question: "What time of day do you prefer to exercise?",
                options: ["Early morning (5-8 AM)", "Morning (8-11 AM)", "Afternoon (12-5 PM)", "Evening (5-8 PM)", "Night (8+ PM)", "No preference"]
            },
            {
                id: 19,
                type: 'checkbox',
                question: "What are your biggest fitness challenges? (Select all that apply)",
                options: ["Lack of time", "Lack of motivation", "Don't know what to do", "Plateau in progress", "Injuries", "Consistency", "Diet"]
            },
            {
                id: 20,
                type: 'multiple',
                question: "How do you prefer to track your progress?",
                options: ["Mobile app", "Written journal", "Photos", "Measurements", "Weight scale", "Performance metrics", "Don't track"]
            },
            {
                id: 21,
                type: 'scale',
                question: "How motivated are you to start/continue exercising? (1-10)",
                min: 1,
                max: 10,
                labels: ["Not motivated", "Extremely motivated"]
            },
            {
                id: 22,
                type: 'checkbox',
                question: "What dietary goals support your fitness? (Select all that apply)",
                options: ["Weight loss", "Muscle gain", "Better energy", "Improved performance", "General health", "No specific goals"]
            },
            {
                id: 23,
                type: 'multiple',
                question: "How would you describe your current diet?",
                options: ["Very healthy", "Mostly healthy", "Average", "Needs improvement", "Poor"]
            },
            {
                id: 24,
                type: 'scale',
                question: "Rate your current stress levels (1-10)",
                min: 1,
                max: 10,
                labels: ["No stress", "Very stressed"]
            },
            {
                id: 25,
                type: 'multiple',
                question: "How many hours do you sleep per night on average?",
                options: ["Less than 5", "5-6 hours", "6-7 hours", "7-8 hours", "8-9 hours", "More than 9"]
            },
            {
                id: 26,
                type: 'checkbox',
                question: "What types of cardio do you enjoy? (Select all that apply)",
                options: ["Running", "Walking", "Cycling", "Swimming", "Dancing", "Sports", "HIIT", "Elliptical", "None"]
            },
            {
                id: 27,
                type: 'multiple',
                question: "How important is flexibility/mobility to you?",
                options: ["Very important", "Somewhat important", "Neutral", "Not very important", "Not important"]
            },
            {
                id: 28,
                type: 'scale',
                question: "How confident are you in your exercise form/technique? (1-10)",
                min: 1,
                max: 10,
                labels: ["Not confident", "Very confident"]
            },
            {
                id: 29,
                type: 'checkbox',
                question: "What would motivate you to exercise regularly? (Select all that apply)",
                options: ["Workout partner", "Personal trainer", "Group classes", "Music/podcasts", "Fitness apps", "Progress tracking", "Rewards system"]
            },
            {
                id: 30,
                type: 'text',
                question: "Any specific fitness goals, preferences, or concerns you'd like to share?",
                placeholder: "Share any additional information that would help create your personalized fitness plan..."
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
                    <button class="nav-btn secondary" onclick="fitnessCoach.previousQuestion()" 
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="nav-btn primary" onclick="fitnessCoach.nextQuestion()" 
                            id="next-btn" disabled>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Create Fitness Plan' : 'Next'} 
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
                    <button class="option-btn" onclick="fitnessCoach.selectSingle(${question.id}, '${option}')">
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
                    <button class="option-btn" onclick="fitnessCoach.selectMultiple(${question.id}, '${option}')">
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
                       onchange="fitnessCoach.updateScale(${question.id}, this.value)">
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
                       onchange="fitnessCoach.updateNumber(${question.id}, this.value)">
            </div>
        `;
    }

    renderText(question) {
        return `
            <div class="text-container">
                <textarea class="text-input" placeholder="${question.placeholder || ''}" rows="4"
                          onchange="fitnessCoach.updateText(${question.id}, this.value)"></textarea>
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
            const plan = this.generateFitnessPlan();
            this.showResults(plan);
        }, 2000);
    }

    generateFitnessPlan() {
        const responses = this.responses;
        
        // Calculate basic metrics
        const bmi = this.calculateBMI(responses[6], responses[5]);
        const fitnessLevel = responses[14] || 5;
        const goal = responses[1];
        
        // Generate personalized plan
        const workoutPlan = this.createWorkoutPlan(responses);
        const nutritionGuidance = this.generateNutritionGuidance(responses);
        const progressTracking = this.generateProgressTracking(responses);
        
        return {
            timestamp: new Date().toLocaleString(),
            sessionId: this.sessionId,
            personalInfo: {
                age: responses[3],
                bmi: bmi,
                bmiCategory: this.getBMICategory(bmi),
                currentWeight: responses[6],
                targetWeight: responses[7],
                fitnessLevel: fitnessLevel,
                primaryGoal: goal
            },
            workoutPlan: workoutPlan,
            nutritionGuidance: nutritionGuidance,
            progressTracking: progressTracking,
            recommendations: this.generateRecommendations(responses),
            safetyConsiderations: this.getSafetyConsiderations(responses),
            responses: responses
        };
    }

    calculateBMI(weight, height) {
        if (!weight || !height) return null;
        const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2));
        return Math.round(bmi * 10) / 10;
    }

    getBMICategory(bmi) {
        if (!bmi) return 'Unknown';
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    createWorkoutPlan(responses) {
        const goal = responses[1];
        const timePerSession = responses[9];
        const daysPerWeek = responses[10];
        const equipment = responses[13] || [];
        const fitnessLevel = responses[14] || 5;
        const preferredExercises = responses[11] || [];
        
        const plan = {
            frequency: daysPerWeek,
            sessionDuration: timePerSession,
            focusAreas: this.determineFocusAreas(goal),
            weeklySchedule: this.generateWeeklySchedule(responses),
            exerciseTypes: this.recommendExerciseTypes(responses)
        };
        
        return plan;
    }

    determineFocusAreas(goal) {
        const focusMap = {
            'Weight loss': ['Cardio', 'Strength training', 'HIIT'],
            'Muscle gain': ['Strength training', 'Progressive overload', 'Compound movements'],
            'Improve endurance': ['Cardio', 'Interval training', 'Stamina building'],
            'General fitness': ['Cardio', 'Strength training', 'Flexibility'],
            'Strength building': ['Strength training', 'Power lifting', 'Core strengthening'],
            'Athletic performance': ['Sport-specific training', 'Agility', 'Power development']
        };
        
        return focusMap[goal] || ['Balanced training', 'Cardio', 'Strength'];
    }

    generateWeeklySchedule(responses) {
        const days = parseInt(responses[10]?.split('-')[0]) || 3;
        const schedule = [];
        
        for (let i = 0; i < days; i++) {
            let focus;
            if (i % 3 === 0) focus = 'Upper body strength';
            else if (i % 3 === 1) focus = 'Lower body strength';
            else focus = 'Cardio & flexibility';
            
            schedule.push({
                day: i + 1,
                focus: focus,
                duration: responses[9],
                intensity: this.getIntensityLevel(responses[14])
            });
        }
        
        return schedule;
    }

    getIntensityLevel(fitnessLevel) {
        if (fitnessLevel <= 3) return 'Beginner';
        if (fitnessLevel <= 6) return 'Intermediate';
        return 'Advanced';
    }

    recommendExerciseTypes(responses) {
        const equipment = responses[13] || [];
        const preferences = responses[11] || [];
        const goal = responses[1];
        
        const exercises = [];
        
        if (equipment.includes('None (bodyweight only)')) {
            exercises.push('Push-ups', 'Squats', 'Lunges', 'Planks', 'Burpees');
        }
        
        if (equipment.includes('Dumbbells')) {
            exercises.push('Dumbbell rows', 'Chest press', 'Shoulder press', 'Bicep curls');
        }
        
        if (preferences.includes('Cardio/Running')) {
            exercises.push('Running', 'Jogging', 'Sprint intervals');
        }
        
        if (preferences.includes('Yoga')) {
            exercises.push('Yoga flows', 'Stretching routines', 'Balance poses');
        }
        
        return exercises.slice(0, 8); // Limit to 8 exercises
    }

    generateNutritionGuidance(responses) {
        const goal = responses[1];
        const currentDiet = responses[23];
        const dietaryGoals = responses[22] || [];
        
        const guidance = {
            calorieGuidance: this.getCalorieGuidance(goal, responses),
            macroSplit: this.getMacroSplit(goal),
            mealTiming: this.getMealTiming(responses),
            hydration: this.getHydrationAdvice(responses),
            supplements: this.getSupplementAdvice(goal, responses)
        };
        
        return guidance;
    }

    getCalorieGuidance(goal, responses) {
        const bmr = this.calculateBMR(responses);
        let modifier = 1.2; // Sedentary base
        
        // Adjust based on activity level
        const activityLevel = responses[2];
        if (activityLevel?.includes('Very active')) modifier = 1.7;
        else if (activityLevel?.includes('Moderately active')) modifier = 1.5;
        else if (activityLevel?.includes('Lightly active')) modifier = 1.3;
        
        const maintenanceCalories = Math.round(bmr * modifier);
        
        let targetCalories = maintenanceCalories;
        if (goal === 'Weight loss') targetCalories -= 300;
        else if (goal === 'Muscle gain') targetCalories += 200;
        
        return {
            maintenance: maintenanceCalories,
            target: targetCalories,
            deficit: goal === 'Weight loss' ? 300 : 0,
            surplus: goal === 'Muscle gain' ? 200 : 0
        };
    }

    calculateBMR(responses) {
        const weight = parseFloat(responses[6]) || 70;
        const height = parseFloat(responses[5]) || 170;
        const age = parseInt(responses[3]) || 30;
        const sex = responses[4];
        
        // Mifflin-St Jeor Equation
        if (sex === 'Male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    getMacroSplit(goal) {
        const splits = {
            'Weight loss': { protein: 30, carbs: 35, fat: 35 },
            'Muscle gain': { protein: 25, carbs: 45, fat: 30 },
            'Improve endurance': { protein: 20, carbs: 55, fat: 25 },
            'General fitness': { protein: 25, carbs: 45, fat: 30 },
            'Strength building': { protein: 30, carbs: 40, fat: 30 },
            'Athletic performance': { protein: 25, carbs: 50, fat: 25 }
        };
        
        return splits[goal] || splits['General fitness'];
    }

    getMealTiming(responses) {
        const workoutTime = responses[18];
        
        if (workoutTime?.includes('morning')) {
            return {
                preWorkout: 'Light carbs 30-60 min before',
                postWorkout: 'Protein + carbs within 30 min',
                general: 'Regular meals throughout day'
            };
        }
        
        return {
            preWorkout: 'Balanced meal 2-3 hours before',
            postWorkout: 'Protein + carbs within 30 min',
            general: 'Consistent meal timing'
        };
    }

    getHydrationAdvice(responses) {
        const weight = parseFloat(responses[6]) || 70;
        const baseWater = weight * 35; // ml per kg
        
        return {
            daily: `${Math.round(baseWater / 1000 * 10) / 10} liters`,
            workout: 'Additional 500-750ml per hour of exercise',
            timing: 'Spread throughout the day, more before/during/after workouts'
        };
    }

    getSupplementAdvice(goal, responses) {
        const supplements = [];
        
        supplements.push('Multivitamin for general health');
        
        if (goal === 'Muscle gain' || goal === 'Strength building') {
            supplements.push('Protein powder (whey or plant-based)');
            supplements.push('Creatine monohydrate (3-5g daily)');
        }
        
        if (goal === 'Weight loss') {
            supplements.push('Omega-3 fatty acids');
            supplements.push('Vitamin D3');
        }
        
        return supplements;
    }

    generateProgressTracking(responses) {
        const trackingMethods = responses[20] || 'Performance metrics';
        
        return {
            methods: Array.isArray(trackingMethods) ? trackingMethods : [trackingMethods],
            frequency: 'Weekly measurements and assessments',
            metrics: this.getRelevantMetrics(responses[1]),
            goals: this.setProgressGoals(responses)
        };
    }

    getRelevantMetrics(goal) {
        const metricsMap = {
            'Weight loss': ['Body weight', 'Body fat %', 'Waist circumference', 'Progress photos'],
            'Muscle gain': ['Body weight', 'Muscle mass', 'Strength metrics', 'Progress photos'],
            'Improve endurance': ['Cardio performance', 'Heart rate', 'Distance/time'],
            'General fitness': ['Overall fitness score', 'Energy levels', 'Sleep quality'],
            'Strength building': ['Lifting numbers', '1RM tests', 'Strength progressions'],
            'Athletic performance': ['Sport-specific metrics', 'Speed', 'Agility', 'Power']
        };
        
        return metricsMap[goal] || metricsMap['General fitness'];
    }

    setProgressGoals(responses) {
        const goal = responses[1];
        const timeframe = '12 weeks';
        
        const goals = [];
        
        if (goal === 'Weight loss' && responses[7]) {
            const currentWeight = parseFloat(responses[6]);
            const targetWeight = parseFloat(responses[7]);
            const weightDiff = currentWeight - targetWeight;
            goals.push(`Lose ${weightDiff}kg in ${timeframe}`);
        }
        
        goals.push('Improve overall fitness level');
        goals.push('Establish consistent exercise routine');
        goals.push('Increase strength and endurance');
        
        return goals;
    }

    generateRecommendations(responses) {
        const recommendations = [];
        
        // Based on fitness level
        const fitnessLevel = responses[14] || 5;
        if (fitnessLevel <= 3) {
            recommendations.push('Start with basic movements and focus on form');
            recommendations.push('Gradually increase intensity over time');
        }
        
        // Based on health conditions
        const healthConditions = responses[8] || [];
        if (healthConditions.includes('Back problems')) {
            recommendations.push('Focus on core strengthening and avoid heavy spinal loading');
        }
        if (healthConditions.includes('Knee problems')) {
            recommendations.push('Choose low-impact exercises and strengthen quadriceps');
        }
        
        // General recommendations
        recommendations.push('Always warm up before exercising');
        recommendations.push('Stay hydrated throughout workouts');
        recommendations.push('Get adequate sleep for recovery');
        recommendations.push('Listen to your body and rest when needed');
        
        return recommendations;
    }

    getSafetyConsiderations(responses) {
        const considerations = [];
        
        const healthConditions = responses[8] || [];
        
        if (healthConditions.includes('Heart condition')) {
            considerations.push('Consult with cardiologist before starting program');
            considerations.push('Monitor heart rate during exercise');
        }
        
        if (healthConditions.includes('Diabetes')) {
            considerations.push('Monitor blood sugar before and after exercise');
            considerations.push('Have quick carbs available during workouts');
        }
        
        if (healthConditions.includes('High blood pressure')) {
            considerations.push('Avoid breath-holding during heavy lifts');
            considerations.push('Monitor blood pressure regularly');
        }
        
        considerations.push('Stop exercise if you feel pain, dizziness, or shortness of breath');
        considerations.push('Progress gradually to avoid injury');
        
        return considerations;
    }

    showLoading() {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h3>Creating Your Personalized Fitness Plan</h3>
                <p>Analyzing your goals, fitness level, and preferences...</p>
                <div class="loading-steps">
                    <div class="step">Calculating your fitness metrics...</div>
                    <div class="step">Designing workout routines...</div>
                    <div class="step">Creating nutrition guidance...</div>
                    <div class="step">Preparing your plan...</div>
                </div>
            </div>
        `;
    }

    showResults(plan) {
        const container = document.getElementById('assessment-container');
        container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2><i class="fas fa-dumbbell"></i> Your Personalized Fitness Plan</h2>
                    <div class="results-meta">
                        <span><i class="fas fa-calendar"></i> ${plan.timestamp}</span>
                        <span><i class="fas fa-target"></i> Goal: ${plan.personalInfo.primaryGoal}</span>
                    </div>
                </div>

                <div class="results-summary">
                    <div class="summary-card">
                        <h3>Personal Profile</h3>
                        <div class="profile-info">
                            <div class="info-item">
                                <span class="label">Age:</span>
                                <span class="value">${plan.personalInfo.age} years</span>
                            </div>
                            <div class="info-item">
                                <span class="label">BMI:</span>
                                <span class="value">${plan.personalInfo.bmi || 'N/A'} (${plan.personalInfo.bmiCategory})</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Fitness Level:</span>
                                <span class="value">${plan.personalInfo.fitnessLevel}/10</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Workout Schedule</h3>
                        <div class="schedule-info">
                            <div class="info-item">
                                <span class="label">Frequency:</span>
                                <span class="value">${plan.workoutPlan.frequency}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Duration:</span>
                                <span class="value">${plan.workoutPlan.sessionDuration}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Focus Areas:</span>
                                <span class="value">${plan.workoutPlan.focusAreas.join(', ')}</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Nutrition Goals</h3>
                        <div class="nutrition-info">
                            <div class="info-item">
                                <span class="label">Target Calories:</span>
                                <span class="value">${plan.nutritionGuidance.calorieGuidance.target} kcal/day</span>
                            </div>
                            <div class="macro-split">
                                <div class="macro-item">
                                    <span class="macro-name">Protein</span>
                                    <span class="macro-value">${plan.nutritionGuidance.macroSplit.protein}%</span>
                                </div>
                                <div class="macro-item">
                                    <span class="macro-name">Carbs</span>
                                    <span class="macro-value">${plan.nutritionGuidance.macroSplit.carbs}%</span>
                                </div>
                                <div class="macro-item">
                                    <span class="macro-name">Fat</span>
                                    <span class="macro-value">${plan.nutritionGuidance.macroSplit.fat}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="analysis-details">
                    <div class="detail-section">
                        <h3><i class="fas fa-calendar-week"></i> Weekly Workout Schedule</h3>
                        <div class="schedule-grid">
                            ${plan.workoutPlan.weeklySchedule.map(day => `
                                <div class="schedule-day">
                                    <h4>Day ${day.day}</h4>
                                    <p class="focus">${day.focus}</p>
                                    <p class="duration">${day.duration}</p>
                                    <p class="intensity">${day.intensity} intensity</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-dumbbell"></i> Recommended Exercises</h3>
                        <div class="exercises-grid">
                            ${plan.workoutPlan.exerciseTypes.map(exercise => `
                                <div class="exercise-item">${exercise}</div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-apple-alt"></i> Nutrition Guidance</h3>
                        <div class="nutrition-details">
                            <div class="nutrition-item">
                                <h4>Hydration</h4>
                                <p>${plan.nutritionGuidance.hydration.daily} daily</p>
                                <p>${plan.nutritionGuidance.hydration.workout}</p>
                            </div>
                            <div class="nutrition-item">
                                <h4>Meal Timing</h4>
                                <p>Pre-workout: ${plan.nutritionGuidance.mealTiming.preWorkout}</p>
                                <p>Post-workout: ${plan.nutritionGuidance.mealTiming.postWorkout}</p>
                            </div>
                            <div class="nutrition-item">
                                <h4>Supplements</h4>
                                <ul>
                                    ${plan.nutritionGuidance.supplements.map(supp => `<li>${supp}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-chart-line"></i> Progress Tracking</h3>
                        <div class="tracking-info">
                            <div class="tracking-item">
                                <h4>Methods</h4>
                                <ul>
                                    ${plan.progressTracking.methods.map(method => `<li>${method}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="tracking-item">
                                <h4>Key Metrics</h4>
                                <ul>
                                    ${plan.progressTracking.metrics.map(metric => `<li>${metric}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="tracking-item">
                                <h4>Goals (12 weeks)</h4>
                                <ul>
                                    ${plan.progressTracking.goals.map(goal => `<li>${goal}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3><i class="fas fa-lightbulb"></i> Recommendations</h3>
                        <ul class="recommendation-list">
                            ${plan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    ${plan.safetyConsiderations.length > 0 ? `
                        <div class="detail-section safety-section">
                            <h3><i class="fas fa-shield-alt"></i> Safety Considerations</h3>
                            <ul class="safety-list">
                                ${plan.safetyConsiderations.map(safety => `<li>${safety}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="fitnessCoach.downloadPlan()">
                        <i class="fas fa-download"></i> Download Plan
                    </button>
                    <button class="action-btn secondary" onclick="fitnessCoach.shareResults()">
                        <i class="fas fa-share"></i> Share Plan
                    </button>
                    <button class="action-btn secondary" onclick="fitnessCoach.startNew()">
                        <i class="fas fa-redo"></i> New Assessment
                    </button>
                </div>
            </div>
        `;
    }

    async downloadPlan() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const plan = this.generateFitnessPlan();
        this.generateDetailedPDF(doc, plan);
        doc.save(`fitness-plan-${plan.sessionId}.pdf`);
    }

    generateDetailedPDF(doc, plan) {
        let yPos = 20;
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 44, 52);
        doc.text('Personalized Fitness Plan', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated: ${plan.timestamp} | Session: ${plan.sessionId}`, 20, yPos);
        
        yPos += 20;
        
        // Personal Profile
        doc.setFontSize(16);
        doc.setTextColor(40, 44, 52);
        doc.text('Personal Profile', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.text(`Primary Goal: ${plan.personalInfo.primaryGoal}`, 20, yPos);
        yPos += 6;
        doc.text(`Age: ${plan.personalInfo.age} years`, 20, yPos);
        yPos += 6;
        if (plan.personalInfo.bmi) {
            doc.text(`BMI: ${plan.personalInfo.bmi} (${plan.personalInfo.bmiCategory})`, 20, yPos);
            yPos += 6;
        }
        doc.text(`Fitness Level: ${plan.personalInfo.fitnessLevel}/10`, 20, yPos);
        
        yPos += 20;
        
        // Workout Plan
        doc.setFontSize(14);
        doc.text('Workout Plan', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.text(`Frequency: ${plan.workoutPlan.frequency}`, 20, yPos);
        yPos += 6;
        doc.text(`Session Duration: ${plan.workoutPlan.sessionDuration}`, 20, yPos);
        yPos += 6;
        doc.text(`Focus Areas: ${plan.workoutPlan.focusAreas.join(', ')}`, 20, yPos);
        
        yPos += 15;
        
        // Weekly Schedule
        doc.setFontSize(12);
        doc.text('Weekly Schedule:', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        plan.workoutPlan.weeklySchedule.forEach((day, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`Day ${day.day}: ${day.focus} (${day.duration}, ${day.intensity})`, 25, yPos);
            yPos += 6;
        });
        
        yPos += 10;
        
        // Nutrition Guidance
        doc.setFontSize(14);
        doc.text('Nutrition Guidance', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.text(`Target Calories: ${plan.nutritionGuidance.calorieGuidance.target} kcal/day`, 20, yPos);
        yPos += 6;
        doc.text(`Protein: ${plan.nutritionGuidance.macroSplit.protein}% | Carbs: ${plan.nutritionGuidance.macroSplit.carbs}% | Fat: ${plan.nutritionGuidance.macroSplit.fat}%`, 20, yPos);
        yPos += 6;
        doc.text(`Hydration: ${plan.nutritionGuidance.hydration.daily} daily`, 20, yPos);
        
        yPos += 15;
        
        // Recommendations
        doc.setFontSize(12);
        doc.text('Key Recommendations:', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        plan.recommendations.slice(0, 8).forEach((rec, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`• ${rec}`, 25, yPos);
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
        doc.text('DISCLAIMER: This fitness plan is for informational purposes only. Consult with', 20, yPos);
        yPos += 4;
        doc.text('qualified fitness professionals and healthcare providers before starting any', 20, yPos);
        yPos += 4;
        doc.text('new exercise program, especially if you have health conditions.', 20, yPos);
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'My Personalized Fitness Plan',
                text: 'I got a custom fitness plan based on my goals and preferences. Create yours too!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Fitness plan link copied to clipboard!');
        }
    }

    startNew() {
        if (confirm('Are you sure you want to create a new fitness plan? Your current plan will be lost.')) {
            this.currentQuestion = 0;
            this.responses = {};
            this.sessionId = this.generateSessionId();
            this.init();
        }
    }

    generateSessionId() {
        return 'fit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize
let fitnessCoach = new FitnessCoach30Q(); 