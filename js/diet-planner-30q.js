class DietPlanner30Q {
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
                question: "What is your primary health goal?",
                type: "multiple",
                options: ["Weight loss", "Weight gain", "Muscle building", "Heart health", "Diabetes management", "General wellness", "Athletic performance", "Digestive health"],
                required: true
            },
            {
                id: 2,
                question: "What is your current weight (lbs)?",
                type: "number",
                min: 50,
                max: 500,
                required: true
            },
            {
                id: 3,
                question: "What is your height (inches)?",
                type: "number",
                min: 36,
                max: 84,
                required: true
            },
            {
                id: 4,
                question: "What is your age?",
                type: "number",
                min: 13,
                max: 100,
                required: true
            },
            {
                id: 5,
                question: "What is your biological sex?",
                type: "multiple",
                options: ["Male", "Female"],
                required: true
            },
            {
                id: 6,
                question: "What is your activity level?",
                type: "multiple",
                options: ["Sedentary (desk job, no exercise)", "Lightly active (light exercise 1-3 days/week)", "Moderately active (moderate exercise 3-5 days/week)", "Very active (hard exercise 6-7 days/week)", "Extremely active (very hard exercise, physical job)"],
                required: true
            },
            {
                id: 7,
                question: "How many meals do you prefer per day?",
                type: "multiple",
                options: ["2 meals", "3 meals", "4 meals", "5-6 small meals", "Intermittent fasting"],
                required: true
            },
            {
                id: 8,
                question: "Do you have any food allergies or intolerances?",
                type: "checkbox",
                options: ["Dairy/Lactose", "Gluten/Wheat", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", "None"],
                required: true
            },
            {
                id: 9,
                question: "What dietary restrictions do you follow?",
                type: "checkbox",
                options: ["None", "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "Low-carb", "Low-fat", "Diabetic", "Heart-healthy"],
                required: true
            },
            {
                id: 10,
                question: "How much water do you drink daily (glasses)?",
                type: "scale",
                min: 1,
                max: 15,
                required: true
            },
            {
                id: 11,
                question: "What foods do you strongly dislike?",
                type: "checkbox",
                options: ["Vegetables", "Fruits", "Red meat", "Poultry", "Fish", "Dairy", "Grains", "Legumes", "Spicy foods", "None"],
                required: true
            },
            {
                id: 12,
                question: "How often do you cook at home?",
                type: "multiple",
                options: ["Never", "1-2 times per week", "3-4 times per week", "5-6 times per week", "Daily"],
                required: true
            },
            {
                id: 13,
                question: "What is your budget for groceries per week?",
                type: "multiple",
                options: ["Under $50", "$50-100", "$100-150", "$150-200", "Over $200"],
                required: true
            },
            {
                id: 14,
                question: "How much time can you spend on meal prep?",
                type: "multiple",
                options: ["Less than 30 minutes", "30-60 minutes", "1-2 hours", "2-3 hours", "More than 3 hours"],
                required: true
            },
            {
                id: 15,
                question: "Do you have any chronic health conditions?",
                type: "checkbox",
                options: ["Diabetes", "High blood pressure", "High cholesterol", "Heart disease", "Kidney disease", "Liver disease", "Thyroid disorder", "PCOS", "None"],
                required: true
            },
            {
                id: 16,
                question: "Are you currently taking any medications?",
                type: "checkbox",
                options: ["Blood pressure medication", "Diabetes medication", "Cholesterol medication", "Blood thinners", "Thyroid medication", "Antidepressants", "None"],
                required: true
            },
            {
                id: 17,
                question: "How would you rate your current energy level?",
                type: "scale",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 18,
                question: "How many hours of sleep do you get nightly?",
                type: "scale",
                min: 3,
                max: 12,
                required: true
            },
            {
                id: 19,
                question: "How often do you experience digestive issues?",
                type: "multiple",
                options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
                required: true
            },
            {
                id: 20,
                question: "What digestive issues do you experience?",
                type: "checkbox",
                options: ["Bloating", "Gas", "Heartburn", "Constipation", "Diarrhea", "Nausea", "Stomach pain", "None"],
                required: true
            },
            {
                id: 21,
                question: "How often do you eat out or order takeout?",
                type: "multiple",
                options: ["Never", "1-2 times per week", "3-4 times per week", "5-6 times per week", "Daily"],
                required: true
            },
            {
                id: 22,
                question: "What time do you usually eat breakfast?",
                type: "multiple",
                options: ["I skip breakfast", "Before 7 AM", "7-9 AM", "9-11 AM", "After 11 AM"],
                required: true
            },
            {
                id: 23,
                question: "What time do you usually eat dinner?",
                type: "multiple",
                options: ["Before 5 PM", "5-6 PM", "6-7 PM", "7-8 PM", "After 8 PM"],
                required: true
            },
            {
                id: 24,
                question: "How often do you snack between meals?",
                type: "multiple",
                options: ["Never", "Once per day", "2-3 times per day", "4-5 times per day", "Constantly"],
                required: true
            },
            {
                id: 25,
                question: "What types of snacks do you prefer?",
                type: "checkbox",
                options: ["Fruits", "Vegetables", "Nuts/Seeds", "Yogurt", "Cheese", "Crackers", "Chips", "Sweets", "Protein bars"],
                required: true
            },
            {
                id: 26,
                question: "How much caffeine do you consume daily?",
                type: "multiple",
                options: ["None", "1 cup coffee/tea", "2-3 cups coffee/tea", "4-5 cups coffee/tea", "More than 5 cups"],
                required: true
            },
            {
                id: 27,
                question: "How often do you consume alcohol?",
                type: "multiple",
                options: ["Never", "Rarely (special occasions)", "1-2 times per week", "3-4 times per week", "Daily"],
                required: true
            },
            {
                id: 28,
                question: "How would you rate your stress level?",
                type: "scale",
                min: 1,
                max: 10,
                required: true
            },
            {
                id: 29,
                question: "Do you take any supplements?",
                type: "checkbox",
                options: ["Multivitamin", "Vitamin D", "Vitamin B12", "Iron", "Calcium", "Omega-3", "Protein powder", "Probiotics", "None"],
                required: true
            },
            {
                id: 30,
                question: "What additional information should we know about your dietary needs?",
                type: "text",
                placeholder: "Include any other health concerns, preferences, or goals...",
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
                    ${this.currentQuestion > 0 ? '<button class="nav-btn secondary" onclick="dietPlanner.previousQuestion()">Previous</button>' : ''}
                    <button class="nav-btn primary" onclick="dietPlanner.nextQuestion()" ${!this.isAnswered(question.id) ? 'disabled' : ''}>
                        ${this.currentQuestion === this.totalQuestions - 1 ? 'Generate Plan' : 'Next'}
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
                        onclick="dietPlanner.selectSingle(${question.id}, '${option}')">
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
                        onclick="dietPlanner.selectMultiple(${question.id}, '${option}')">
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
                       oninput="dietPlanner.updateScale(${question.id}, this.value)">
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
                       oninput="dietPlanner.updateNumber(${question.id}, this.value)"
                       placeholder="Enter value">
            </div>`;
    }

    renderText(question) {
        const value = this.responses[question.id] || '';
        return `
            <div class="text-container">
                <textarea class="text-input ash-bg" 
                          placeholder="${question.placeholder}"
                          oninput="dietPlanner.updateText(${question.id}, this.value)">${value}</textarea>
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
            this.generateDietPlan();
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

    async generateDietPlan() {
        this.showLoading();
        setTimeout(() => {
            const plan = this.createPersonalizedPlan();
            this.showResults(plan);
        }, 3000);
    }

    createPersonalizedPlan() {
        // Calculate BMR and daily calories
        const weight = this.responses[2];
        const height = this.responses[3];
        const age = this.responses[4];
        const sex = this.responses[5];
        const activityLevel = this.responses[6];
        const goal = this.responses[1];

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (sex === 'Male') {
            bmr = 10 * (weight * 0.453592) + 6.25 * (height * 2.54) - 5 * age + 5;
        } else {
            bmr = 10 * (weight * 0.453592) + 6.25 * (height * 2.54) - 5 * age - 161;
        }

        // Activity multipliers
        const activityMultipliers = {
            'Sedentary (desk job, no exercise)': 1.2,
            'Lightly active (light exercise 1-3 days/week)': 1.375,
            'Moderately active (moderate exercise 3-5 days/week)': 1.55,
            'Very active (hard exercise 6-7 days/week)': 1.725,
            'Extremely active (very hard exercise, physical job)': 1.9
        };

        const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

        // Adjust calories based on goal
        let targetCalories = tdee;
        if (goal === 'Weight loss') {
            targetCalories = tdee - 500; // 1 lb per week loss
        } else if (goal === 'Weight gain') {
            targetCalories = tdee + 500; // 1 lb per week gain
        } else if (goal === 'Muscle building') {
            targetCalories = tdee + 300; // Moderate surplus
        }

        // Calculate macros
        const macros = this.calculateMacros(targetCalories, goal);

        // Generate meal plan
        const mealPlan = this.generateMealPlan(targetCalories, macros);

        // Generate recommendations
        const recommendations = this.generateRecommendations();

        // Calculate BMI and health metrics
        const bmi = this.calculateBMI(weight, height);
        const healthMetrics = this.calculateHealthMetrics(bmi, this.responses);

        return {
            calories: Math.round(targetCalories),
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            macros: macros,
            mealPlan: mealPlan,
            recommendations: recommendations,
            healthMetrics: healthMetrics,
            bmi: bmi,
            goal: goal,
            waterIntake: this.calculateWaterIntake(weight),
            supplementSuggestions: this.getSupplementSuggestions(),
            shoppingList: this.generateShoppingList(mealPlan)
        };
    }

    calculateMacros(calories, goal) {
        let proteinPercent, carbPercent, fatPercent;

        // Macro ratios based on goal
        switch(goal) {
            case 'Weight loss':
                proteinPercent = 0.35;
                carbPercent = 0.35;
                fatPercent = 0.30;
                break;
            case 'Muscle building':
                proteinPercent = 0.30;
                carbPercent = 0.45;
                fatPercent = 0.25;
                break;
            case 'Athletic performance':
                proteinPercent = 0.25;
                carbPercent = 0.55;
                fatPercent = 0.20;
                break;
            case 'Keto':
                proteinPercent = 0.25;
                carbPercent = 0.05;
                fatPercent = 0.70;
                break;
            default:
                proteinPercent = 0.25;
                carbPercent = 0.45;
                fatPercent = 0.30;
        }

        return {
            protein: {
                grams: Math.round((calories * proteinPercent) / 4),
                calories: Math.round(calories * proteinPercent),
                percentage: Math.round(proteinPercent * 100)
            },
            carbs: {
                grams: Math.round((calories * carbPercent) / 4),
                calories: Math.round(calories * carbPercent),
                percentage: Math.round(carbPercent * 100)
            },
            fat: {
                grams: Math.round((calories * fatPercent) / 9),
                calories: Math.round(calories * fatPercent),
                percentage: Math.round(fatPercent * 100)
            }
        };
    }

    generateMealPlan(calories, macros) {
        const mealsPerDay = this.responses[7];
        const allergies = this.responses[8] || [];
        const restrictions = this.responses[9] || [];
        const dislikes = this.responses[11] || [];

        // Sample meal plans (simplified for demonstration)
        const sampleMeals = {
            breakfast: [
                { name: "Oatmeal with berries and nuts", calories: 350, protein: 12, carbs: 60, fat: 8 },
                { name: "Greek yogurt with granola", calories: 300, protein: 20, carbs: 35, fat: 6 },
                { name: "Scrambled eggs with toast", calories: 320, protein: 18, carbs: 25, fat: 15 },
                { name: "Protein smoothie", calories: 280, protein: 25, carbs: 30, fat: 5 }
            ],
            lunch: [
                { name: "Grilled chicken salad", calories: 420, protein: 35, carbs: 15, fat: 22 },
                { name: "Quinoa bowl with vegetables", calories: 380, protein: 18, carbs: 55, fat: 12 },
                { name: "Turkey sandwich with avocado", calories: 450, protein: 28, carbs: 40, fat: 18 },
                { name: "Lentil soup with bread", calories: 350, protein: 20, carbs: 50, fat: 8 }
            ],
            dinner: [
                { name: "Baked salmon with sweet potato", calories: 520, protein: 40, carbs: 35, fat: 22 },
                { name: "Lean beef stir-fry", calories: 480, protein: 35, carbs: 30, fat: 20 },
                { name: "Grilled tofu with brown rice", calories: 420, protein: 25, carbs: 45, fat: 15 },
                { name: "Chicken breast with quinoa", calories: 460, protein: 38, carbs: 35, fat: 14 }
            ],
            snacks: [
                { name: "Apple with almond butter", calories: 180, protein: 6, carbs: 20, fat: 8 },
                { name: "Greek yogurt", calories: 120, protein: 15, carbs: 8, fat: 3 },
                { name: "Mixed nuts", calories: 160, protein: 6, carbs: 5, fat: 14 },
                { name: "Protein bar", calories: 200, protein: 20, carbs: 15, fat: 6 }
            ]
        };

        // Create 7-day meal plan
        const weekPlan = [];
        for (let day = 1; day <= 7; day++) {
            const dayMeals = {
                day: day,
                breakfast: sampleMeals.breakfast[Math.floor(Math.random() * sampleMeals.breakfast.length)],
                lunch: sampleMeals.lunch[Math.floor(Math.random() * sampleMeals.lunch.length)],
                dinner: sampleMeals.dinner[Math.floor(Math.random() * sampleMeals.dinner.length)],
                snack1: sampleMeals.snacks[Math.floor(Math.random() * sampleMeals.snacks.length)],
                snack2: sampleMeals.snacks[Math.floor(Math.random() * sampleMeals.snacks.length)]
            };

            // Calculate daily totals
            dayMeals.totalCalories = dayMeals.breakfast.calories + dayMeals.lunch.calories + 
                                   dayMeals.dinner.calories + dayMeals.snack1.calories + dayMeals.snack2.calories;
            dayMeals.totalProtein = dayMeals.breakfast.protein + dayMeals.lunch.protein + 
                                  dayMeals.dinner.protein + dayMeals.snack1.protein + dayMeals.snack2.protein;
            dayMeals.totalCarbs = dayMeals.breakfast.carbs + dayMeals.lunch.carbs + 
                                dayMeals.dinner.carbs + dayMeals.snack1.carbs + dayMeals.snack2.carbs;
            dayMeals.totalFat = dayMeals.breakfast.fat + dayMeals.lunch.fat + 
                              dayMeals.dinner.fat + dayMeals.snack1.fat + dayMeals.snack2.fat;

            weekPlan.push(dayMeals);
        }

        return weekPlan;
    }

    generateRecommendations() {
        const recommendations = [];
        const goal = this.responses[1];
        const activityLevel = this.responses[6];
        const healthConditions = this.responses[15] || [];
        const energyLevel = this.responses[17];
        const stressLevel = this.responses[28];

        // Goal-specific recommendations
        if (goal === 'Weight loss') {
            recommendations.push('Focus on creating a moderate calorie deficit');
            recommendations.push('Increase protein intake to preserve muscle mass');
            recommendations.push('Include high-fiber foods to increase satiety');
        } else if (goal === 'Muscle building') {
            recommendations.push('Consume protein within 30 minutes post-workout');
            recommendations.push('Eat frequent meals to support muscle growth');
            recommendations.push('Include complex carbohydrates for energy');
        }

        // Health condition recommendations
        if (healthConditions.includes('Diabetes')) {
            recommendations.push('Monitor carbohydrate intake and timing');
            recommendations.push('Choose low glycemic index foods');
            recommendations.push('Work with healthcare provider on meal timing');
        }

        if (healthConditions.includes('High blood pressure')) {
            recommendations.push('Reduce sodium intake to less than 2300mg daily');
            recommendations.push('Increase potassium-rich foods');
            recommendations.push('Limit processed and packaged foods');
        }

        // Energy and stress recommendations
        if (energyLevel <= 5) {
            recommendations.push('Ensure adequate iron and B-vitamin intake');
            recommendations.push('Maintain stable blood sugar with regular meals');
            recommendations.push('Consider magnesium-rich foods for energy');
        }

        if (stressLevel >= 7) {
            recommendations.push('Include omega-3 fatty acids for stress management');
            recommendations.push('Limit caffeine and alcohol intake');
            recommendations.push('Focus on anti-inflammatory foods');
        }

        return recommendations;
    }

    calculateBMI(weight, height) {
        const bmi = (weight / (height * height)) * 703;
        return Math.round(bmi * 10) / 10;
    }

    calculateHealthMetrics(bmi, responses) {
        const metrics = {
            bmi: {
                value: bmi,
                category: this.getBMICategory(bmi),
                status: this.getBMIStatus(bmi)
            },
            hydration: {
                current: responses[10],
                recommended: Math.ceil(responses[2] / 2), // Half body weight in ounces
                status: responses[10] >= Math.ceil(responses[2] / 2) ? 'Good' : 'Needs improvement'
            },
            sleep: {
                hours: responses[18],
                status: responses[18] >= 7 && responses[18] <= 9 ? 'Good' : 'Needs improvement'
            },
            energy: {
                level: responses[17],
                status: responses[17] >= 7 ? 'Good' : 'Needs improvement'
            }
        };

        return metrics;
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    getBMIStatus(bmi) {
        if (bmi >= 18.5 && bmi < 25) return 'healthy';
        if (bmi < 18.5 || (bmi >= 25 && bmi < 30)) return 'warning';
        return 'danger';
    }

    calculateWaterIntake(weight) {
        return Math.ceil(weight / 2); // Half body weight in ounces
    }

    getSupplementSuggestions() {
        const suggestions = [];
        const currentSupplements = this.responses[29] || [];
        const healthConditions = this.responses[15] || [];
        const restrictions = this.responses[9] || [];

        if (!currentSupplements.includes('Multivitamin')) {
            suggestions.push('Daily multivitamin for nutritional insurance');
        }

        if (!currentSupplements.includes('Vitamin D')) {
            suggestions.push('Vitamin D3 for bone health and immune function');
        }

        if (restrictions.includes('Vegan') && !currentSupplements.includes('Vitamin B12')) {
            suggestions.push('Vitamin B12 supplement (essential for vegans)');
        }

        if (!currentSupplements.includes('Omega-3')) {
            suggestions.push('Omega-3 fatty acids for heart and brain health');
        }

        return suggestions;
    }

    generateShoppingList(mealPlan) {
        const ingredients = new Set();

        // Extract ingredients from meal plan (simplified)
        const commonIngredients = [
            'Chicken breast', 'Salmon', 'Greek yogurt', 'Eggs', 'Oats',
            'Quinoa', 'Brown rice', 'Sweet potatoes', 'Broccoli', 'Spinach',
            'Avocado', 'Berries', 'Almonds', 'Olive oil', 'Lentils'
        ];

        commonIngredients.forEach(ingredient => ingredients.add(ingredient));

        return Array.from(ingredients).sort();
    }

    showLoading() {
        document.getElementById('assessment-container').innerHTML = `
            <div class="loading-container white-bg">
                <div class="loading-spinner"></div>
                <h3>Creating Your Personalized Diet Plan</h3>
                <p class="ash-text">Analyzing 30 data points to generate optimal nutrition recommendations...</p>
                <div class="loading-steps ash-bg">
                    <div class="step">Calculating metabolic requirements...</div>
                    <div class="step">Determining macro ratios...</div>
                    <div class="step">Generating meal plans...</div>
                    <div class="step">Creating shopping lists...</div>
                </div>
            </div>
        `;
    }

    showResults(plan) {
        document.getElementById('assessment-container').innerHTML = `
            <div class="results-container white-bg">
                <div class="results-header ash-bg">
                    <h2>Your Personalized Diet Plan</h2>
                    <div class="plan-summary">
                        <span class="goal-badge">${plan.goal}</span>
                        <span class="calories-badge">${plan.calories} calories/day</span>
                    </div>
                </div>

                <div class="nutrition-overview">
                    <div class="metric-card ash-bg">
                        <h3>Daily Calories</h3>
                        <div class="metric-value">${plan.calories}</div>
                        <div class="metric-label">Target intake</div>
                    </div>
                    
                    <div class="metric-card ash-bg">
                        <h3>BMI</h3>
                        <div class="metric-value ${plan.healthMetrics.bmi.status}">${plan.bmi}</div>
                        <div class="metric-label">${plan.healthMetrics.bmi.category}</div>
                    </div>
                    
                    <div class="metric-card ash-bg">
                        <h3>Water Goal</h3>
                        <div class="metric-value">${plan.waterIntake}</div>
                        <div class="metric-label">ounces/day</div>
                    </div>
                </div>

                <div class="macros-breakdown ash-bg">
                    <h3>Macro Distribution</h3>
                    <div class="macro-chart">
                        <div class="macro-item">
                            <div class="macro-bar">
                                <div class="macro-fill protein" style="width: ${plan.macros.protein.percentage}%"></div>
                            </div>
                            <div class="macro-info">
                                <span class="macro-name">Protein</span>
                                <span class="macro-amount">${plan.macros.protein.grams}g (${plan.macros.protein.percentage}%)</span>
                            </div>
                        </div>
                        
                        <div class="macro-item">
                            <div class="macro-bar">
                                <div class="macro-fill carbs" style="width: ${plan.macros.carbs.percentage}%"></div>
                            </div>
                            <div class="macro-info">
                                <span class="macro-name">Carbs</span>
                                <span class="macro-amount">${plan.macros.carbs.grams}g (${plan.macros.carbs.percentage}%)</span>
                            </div>
                        </div>
                        
                        <div class="macro-item">
                            <div class="macro-bar">
                                <div class="macro-fill fat" style="width: ${plan.macros.fat.percentage}%"></div>
                            </div>
                            <div class="macro-info">
                                <span class="macro-name">Fat</span>
                                <span class="macro-amount">${plan.macros.fat.grams}g (${plan.macros.fat.percentage}%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="meal-plan-section">
                    <h3>7-Day Meal Plan Sample</h3>
                    <div class="day-selector ash-bg">
                        ${Array.from({length: 7}, (_, i) => 
                            `<button class="day-btn ${i === 0 ? 'active' : ''}" 
                                     onclick="dietPlanner.showDay(${i + 1})">Day ${i + 1}</button>`
                        ).join('')}
                    </div>
                    <div id="meal-plan-display" class="meal-plan-display ash-bg">
                        ${this.renderDayMeals(plan.mealPlan[0])}
                    </div>
                </div>

                <div class="recommendations-section ash-bg">
                    <h3>Personalized Recommendations</h3>
                    <ul class="recommendations-list">
                        ${plan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <div class="supplements-section ash-bg">
                    <h3>Supplement Suggestions</h3>
                    <ul class="supplements-list">
                        ${plan.supplementSuggestions.map(supp => `<li>${supp}</li>`).join('')}
                    </ul>
                </div>

                <div class="shopping-section ash-bg">
                    <h3>Shopping List Essentials</h3>
                    <div class="shopping-grid">
                        ${plan.shoppingList.map(item => `<span class="shopping-item">${item}</span>`).join('')}
                    </div>
                </div>

                <div class="results-actions">
                    <button class="action-btn primary" onclick="dietPlanner.downloadPlan()">
                        <i class="fas fa-download"></i>
                        Download Complete Plan
                    </button>
                    <button class="action-btn secondary" onclick="dietPlanner.shareResults()">
                        <i class="fas fa-share"></i>
                        Share Plan
                    </button>
                    <button class="action-btn secondary" onclick="dietPlanner.startNew()">
                        <i class="fas fa-redo"></i>
                        Create New Plan
                    </button>
                </div>

                <div class="disclaimer ash-bg">
                    <h4><i class="fas fa-info-circle"></i> Important Disclaimer</h4>
                    <p>This diet plan is for general informational purposes only. Consult with a registered dietitian or healthcare provider before making significant dietary changes, especially if you have medical conditions.</p>
                </div>
            </div>
        `;

        this.lastPlan = plan;
    }

    renderDayMeals(dayPlan) {
        return `
            <div class="day-meals">
                <h4>Day ${dayPlan.day} Meals</h4>
                <div class="meals-grid">
                    <div class="meal-item">
                        <h5>Breakfast</h5>
                        <p>${dayPlan.breakfast.name}</p>
                        <span class="meal-calories">${dayPlan.breakfast.calories} cal</span>
                    </div>
                    <div class="meal-item">
                        <h5>Lunch</h5>
                        <p>${dayPlan.lunch.name}</p>
                        <span class="meal-calories">${dayPlan.lunch.calories} cal</span>
                    </div>
                    <div class="meal-item">
                        <h5>Dinner</h5>
                        <p>${dayPlan.dinner.name}</p>
                        <span class="meal-calories">${dayPlan.dinner.calories} cal</span>
                    </div>
                    <div class="meal-item">
                        <h5>Snacks</h5>
                        <p>${dayPlan.snack1.name}, ${dayPlan.snack2.name}</p>
                        <span class="meal-calories">${dayPlan.snack1.calories + dayPlan.snack2.calories} cal</span>
                    </div>
                </div>
                <div class="day-totals">
                    <span>Total: ${dayPlan.totalCalories} cal | ${dayPlan.totalProtein}g protein | ${dayPlan.totalCarbs}g carbs | ${dayPlan.totalFat}g fat</span>
                </div>
            </div>
        `;
    }

    showDay(dayNumber) {
        // Update active button
        document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.day-btn:nth-child(${dayNumber})`).classList.add('active');
        
        // Show day meals
        const dayPlan = this.lastPlan.mealPlan[dayNumber - 1];
        document.getElementById('meal-plan-display').innerHTML = this.renderDayMeals(dayPlan);
    }

    async downloadPlan() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        this.generateDetailedPDF(doc, this.lastPlan);
        doc.save(`diet-plan-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    generateDetailedPDF(doc, plan) {
        let y = 20;

        // Header
        doc.setFontSize(22);
        doc.text('Personalized Diet Plan', 20, y);
        y += 15;

        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
        doc.text(`Goal: ${plan.goal}`, 120, y);
        y += 20;

        // Overview
        doc.setFontSize(16);
        doc.text('Nutrition Overview', 20, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Daily Calories: ${plan.calories}`, 20, y);
        y += 7;
        doc.text(`BMI: ${plan.bmi} (${plan.healthMetrics.bmi.category})`, 20, y);
        y += 7;
        doc.text(`Daily Water Goal: ${plan.waterIntake} ounces`, 20, y);
        y += 15;

        // Macros
        doc.setFontSize(16);
        doc.text('Macro Distribution', 20, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Protein: ${plan.macros.protein.grams}g (${plan.macros.protein.percentage}%)`, 20, y);
        y += 7;
        doc.text(`Carbohydrates: ${plan.macros.carbs.grams}g (${plan.macros.carbs.percentage}%)`, 20, y);
        y += 7;
        doc.text(`Fat: ${plan.macros.fat.grams}g (${plan.macros.fat.percentage}%)`, 20, y);
        y += 15;

        // Recommendations
        doc.setFontSize(16);
        doc.text('Recommendations', 20, y);
        y += 10;

        doc.setFontSize(12);
        plan.recommendations.forEach(rec => {
            const lines = doc.splitTextToSize(`• ${rec}`, 170);
            doc.text(lines, 20, y);
            y += lines.length * 6 + 2;
        });

        y += 10;

        // Shopping List
        doc.setFontSize(16);
        doc.text('Shopping List', 20, y);
        y += 10;

        doc.setFontSize(10);
        plan.shoppingList.forEach((item, index) => {
            if (index % 3 === 0 && index > 0) y += 6;
            doc.text(`• ${item}`, 20 + (index % 3) * 60, y);
            if (index % 3 === 2) y += 6;
        });
    }

    shareResults() {
        const summary = `My Personalized Diet Plan:\n${this.lastPlan.calories} calories/day\nGoal: ${this.lastPlan.goal}\nBMI: ${this.lastPlan.bmi}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Diet Plan',
                text: summary,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(summary).then(() => {
                alert('Plan summary copied to clipboard!');
            });
        }
    }

    startNew() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = Date.now().toString();
        this.lastPlan = null;
        this.init();
    }
}

// Initialize
let dietPlanner;
document.addEventListener('DOMContentLoaded', () => {
    dietPlanner = new DietPlanner30Q();
    dietPlanner.init();
}); 