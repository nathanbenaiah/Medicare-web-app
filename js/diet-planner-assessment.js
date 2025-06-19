// Diet Planner Assessment Configuration
const DIET_PLANNER_CONFIG = {
    title: 'Smart Diet Planner',
    subtitle: 'Personalized nutrition plans based on your health goals',
    icon: 'fas fa-utensils',
    questions: [
        // Basic Questions (1-5)
        { 
            id: 1, 
            type: 'text', 
            question: 'Q1. What is your full name?', 
            description: 'Please enter your complete name.', 
            required: true, 
            placeholder: 'Enter your full name' 
        },
        { 
            id: 2, 
            type: 'text', 
            question: 'Q2. What is your age?', 
            description: 'Please enter your age in years.', 
            required: true, 
            placeholder: 'Enter your age (e.g., 25)' 
        },
        { 
            id: 3, 
            type: 'multiple', 
            question: 'Q3. What is your gender?', 
            description: 'Please select your gender.', 
            options: [
                { value: 'male', label: 'Male' }, 
                { value: 'female', label: 'Female' }
            ], 
            required: true 
        },
        { 
            id: 4, 
            type: 'text', 
            question: 'Q4. What is your contact number?', 
            description: 'Please enter your phone number.', 
            required: true, 
            placeholder: 'Enter your contact number (e.g., 0771234567)' 
        },
        { 
            id: 5, 
            type: 'multiple', 
            question: 'Q5. Which district are you from?', 
            description: 'Select your district in Sri Lanka.', 
            options: [
                { value: 'colombo', label: 'Colombo' },
                { value: 'gampaha', label: 'Gampaha' },
                { value: 'kandy', label: 'Kandy' },
                { value: 'galle', label: 'Galle' },
                { value: 'matara', label: 'Matara' },
                { value: 'hambantota', label: 'Hambantota' },
                { value: 'jaffna', label: 'Jaffna' },
                { value: 'kurunegala', label: 'Kurunegala' },
                { value: 'anuradhapura', label: 'Anuradhapura' },
                { value: 'batticaloa', label: 'Batticaloa' },
                { value: 'other', label: 'Other District' }
            ], 
            required: true 
        },
        
        // Diet-Specific Questions (6-30)
        {
            id: 6,
            type: 'multiple',
            question: 'Q6. What is your primary health goal?',
            description: 'Select your main objective for following a diet plan.',
            options: [
                { value: 'weight_loss', label: 'Weight Loss' },
                { value: 'weight_gain', label: 'Weight Gain' },
                { value: 'muscle_building', label: 'Muscle Building' },
                { value: 'maintenance', label: 'Weight Maintenance' },
                { value: 'health_improvement', label: 'General Health Improvement' }
            ],
            required: true
        },
        {
            id: 7,
            type: 'text',
            question: 'Q7. What is your current weight?',
            description: 'Please enter your current weight in kilograms.',
            required: true,
            placeholder: 'Enter weight in kg (e.g., 65)'
        },
        {
            id: 8,
            type: 'text',
            question: 'Q8. What is your height?',
            description: 'Please enter your height in centimeters.',
            required: true,
            placeholder: 'Enter height in cm (e.g., 170)'
        },
        {
            id: 9,
            type: 'multiple',
            question: 'Q9. What is your activity level?',
            description: 'How physically active are you on a typical day?',
            options: [
                { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                { value: 'lightly_active', label: 'Lightly Active (light exercise 1-3 days/week)' },
                { value: 'moderately_active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
                { value: 'very_active', label: 'Very Active (hard exercise 6-7 days/week)' },
                { value: 'extremely_active', label: 'Extremely Active (very hard exercise, physical job)' }
            ],
            required: true
        },
        {
            id: 10,
            type: 'multiple',
            question: 'Q10. Do you have any dietary restrictions?',
            description: 'Select all that apply to you.',
            options: [
                { value: 'none', label: 'No restrictions' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'vegan', label: 'Vegan' },
                { value: 'gluten_free', label: 'Gluten-free' },
                { value: 'dairy_free', label: 'Dairy-free' },
                { value: 'low_sodium', label: 'Low sodium' },
                { value: 'diabetic', label: 'Diabetic diet' },
                { value: 'keto', label: 'Ketogenic' },
                { value: 'paleo', label: 'Paleo' }
            ],
            multiple: true,
            required: true
        },
        {
            id: 11,
            type: 'multiple',
            question: 'Q11. Do you have any food allergies?',
            description: 'Please select any foods you are allergic to.',
            options: [
                { value: 'none', label: 'No allergies' },
                { value: 'nuts', label: 'Nuts' },
                { value: 'dairy', label: 'Dairy products' },
                { value: 'eggs', label: 'Eggs' },
                { value: 'seafood', label: 'Seafood' },
                { value: 'soy', label: 'Soy products' },
                { value: 'wheat', label: 'Wheat/Gluten' },
                { value: 'shellfish', label: 'Shellfish' }
            ],
            multiple: true,
            required: true
        },
        {
            id: 12,
            type: 'multiple',
            question: 'Q12. How many meals do you prefer per day?',
            description: 'Choose your preferred meal frequency.',
            options: [
                { value: '3', label: '3 main meals' },
                { value: '4', label: '3 main meals + 1 snack' },
                { value: '5', label: '3 main meals + 2 snacks' },
                { value: '6', label: '6 small meals' }
            ],
            required: true
        },
        {
            id: 13,
            type: 'text',
            question: 'Q13. How much water do you drink daily?',
            description: 'Enter the approximate amount in glasses or liters.',
            required: true,
            placeholder: 'e.g., 8 glasses or 2 liters'
        },
        {
            id: 14,
            type: 'multiple',
            question: 'Q14. Do you take any supplements?',
            description: 'Select supplements you currently take.',
            options: [
                { value: 'none', label: 'No supplements' },
                { value: 'multivitamin', label: 'Multivitamin' },
                { value: 'protein', label: 'Protein powder' },
                { value: 'omega3', label: 'Omega-3' },
                { value: 'vitamin_d', label: 'Vitamin D' },
                { value: 'calcium', label: 'Calcium' },
                { value: 'iron', label: 'Iron' },
                { value: 'probiotics', label: 'Probiotics' }
            ],
            multiple: true,
            required: true
        },
        {
            id: 15,
            type: 'multiple',
            question: 'Q15. What is your cooking skill level?',
            description: 'How comfortable are you with cooking?',
            options: [
                { value: 'beginner', label: 'Beginner (basic cooking only)' },
                { value: 'intermediate', label: 'Intermediate (can follow recipes)' },
                { value: 'advanced', label: 'Advanced (comfortable with complex recipes)' },
                { value: 'expert', label: 'Expert (very experienced cook)' }
            ],
            required: true
        },
        {
            id: 16,
            type: 'text',
            question: 'Q16. How much time can you dedicate to meal preparation daily?',
            description: 'Enter time in minutes.',
            required: true,
            placeholder: 'e.g., 30 minutes'
        },
        {
            id: 17,
            type: 'multiple',
            question: 'Q17. What types of cuisine do you enjoy?',
            description: 'Select your preferred cuisines.',
            options: [
                { value: 'sri_lankan', label: 'Sri Lankan' },
                { value: 'indian', label: 'Indian' },
                { value: 'chinese', label: 'Chinese' },
                { value: 'italian', label: 'Italian' },
                { value: 'mediterranean', label: 'Mediterranean' },
                { value: 'american', label: 'American' },
                { value: 'thai', label: 'Thai' },
                { value: 'japanese', label: 'Japanese' }
            ],
            multiple: true,
            required: true
        },
        {
            id: 18,
            type: 'multiple',
            question: 'Q18. Do you have any medical conditions?',
            description: 'Select any conditions that might affect your diet.',
            options: [
                { value: 'none', label: 'No medical conditions' },
                { value: 'diabetes', label: 'Diabetes' },
                { value: 'hypertension', label: 'High blood pressure' },
                { value: 'heart_disease', label: 'Heart disease' },
                { value: 'thyroid', label: 'Thyroid disorders' },
                { value: 'kidney_disease', label: 'Kidney disease' },
                { value: 'liver_disease', label: 'Liver disease' },
                { value: 'digestive_issues', label: 'Digestive issues' }
            ],
            multiple: true,
            required: true
        },
        {
            id: 19,
            type: 'text',
            question: 'Q19. What foods do you absolutely dislike?',
            description: 'List foods you want to avoid in your meal plan.',
            required: false,
            placeholder: 'e.g., broccoli, fish, mushrooms'
        },
        {
            id: 20,
            type: 'text',
            question: 'Q20. What are your favorite foods?',
            description: 'List foods you would like to include more often.',
            required: false,
            placeholder: 'e.g., chicken, rice, fruits'
        },
        {
            id: 21,
            type: 'multiple',
            question: 'Q21. What is your budget for groceries per week?',
            description: 'Select your weekly grocery budget range.',
            options: [
                { value: 'low', label: 'Under Rs. 3,000' },
                { value: 'medium', label: 'Rs. 3,000 - 6,000' },
                { value: 'high', label: 'Rs. 6,000 - 10,000' },
                { value: 'premium', label: 'Above Rs. 10,000' }
            ],
            required: true
        },
        {
            id: 22,
            type: 'multiple',
            question: 'Q22. Do you eat out frequently?',
            description: 'How often do you eat at restaurants or order food?',
            options: [
                { value: 'rarely', label: 'Rarely (less than once a week)' },
                { value: 'occasionally', label: 'Occasionally (1-2 times a week)' },
                { value: 'regularly', label: 'Regularly (3-4 times a week)' },
                { value: 'frequently', label: 'Frequently (5+ times a week)' }
            ],
            required: true
        },
        {
            id: 23,
            type: 'text',
            question: 'Q23. What time do you usually have breakfast?',
            description: 'Enter your typical breakfast time.',
            required: true,
            placeholder: 'e.g., 7:00 AM'
        },
        {
            id: 24,
            type: 'text',
            question: 'Q24. What time do you usually have lunch?',
            description: 'Enter your typical lunch time.',
            required: true,
            placeholder: 'e.g., 12:30 PM'
        },
        {
            id: 25,
            type: 'text',
            question: 'Q25. What time do you usually have dinner?',
            description: 'Enter your typical dinner time.',
            required: true,
            placeholder: 'e.g., 7:30 PM'
        },
        {
            id: 26,
            type: 'multiple',
            question: 'Q26. Do you have access to a gym or exercise equipment?',
            description: 'This helps us align your diet with your exercise routine.',
            options: [
                { value: 'none', label: 'No access to gym or equipment' },
                { value: 'home_equipment', label: 'Home exercise equipment' },
                { value: 'gym_membership', label: 'Gym membership' },
                { value: 'both', label: 'Both home equipment and gym' }
            ],
            required: true
        },
        {
            id: 27,
            type: 'text',
            question: 'Q27. How many hours do you sleep per night?',
            description: 'Sleep affects metabolism and eating patterns.',
            required: true,
            placeholder: 'e.g., 7 hours'
        },
        {
            id: 28,
            type: 'multiple',
            question: 'Q28. What is your stress level?',
            description: 'Stress can affect eating habits and metabolism.',
            options: [
                { value: 'low', label: 'Low stress' },
                { value: 'moderate', label: 'Moderate stress' },
                { value: 'high', label: 'High stress' },
                { value: 'very_high', label: 'Very high stress' }
            ],
            required: true
        },
        {
            id: 29,
            type: 'text',
            question: 'Q29. Do you have any specific weight goals?',
            description: 'If applicable, enter your target weight.',
            required: false,
            placeholder: 'e.g., lose 5kg, gain 3kg'
        },
        {
            id: 30,
            type: 'text',
            question: 'Q30. Any additional information about your lifestyle or dietary preferences?',
            description: 'Share anything else that might help us create a better plan for you.',
            required: false,
            placeholder: 'Additional notes...'
        }
    ]
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DIET_PLANNER_CONFIG;
}

// Diet Planner Analysis Function
function generateDietPlannerAnalysis(responses) {
    return {
        nutritionPlan: generateNutritionPlan(responses),
        mealSchedule: generateMealSchedule(responses),
        healthMetrics: calculateHealthMetrics(responses),
        recommendations: generateDietRecommendations(responses)
    };
}

function generateNutritionPlan(responses) {
    const age = parseInt(responses[2]);
    const weight = parseFloat(responses[7]);
    const height = parseFloat(responses[8]);
    const activity = responses[9];
    const goal = responses[6];
    
    // Calculate BMI
    const bmi = weight / ((height/100) * (height/100));
    
    // Calculate daily calorie needs
    let calories = calculateCalories(weight, height, age, responses[3], activity);
    
    // Adjust based on goals
    if (goal === 'weight_loss') calories -= 500;
    else if (goal === 'weight_gain') calories += 500;
    
    return {
        dailyCalories: Math.round(calories),
        bmi: bmi.toFixed(1),
        protein: Math.round(weight * 1.2), // grams
        carbs: Math.round(calories * 0.45 / 4), // grams
        fats: Math.round(calories * 0.25 / 9), // grams
        fiber: 25, // grams
        water: '2-3 liters'
    };
}

function generateMealSchedule(responses) {
    const mealsPerDay = parseInt(responses[12]);
    const breakfast = responses[23] || '7:00 AM';
    const lunch = responses[24] || '12:30 PM';
    const dinner = responses[25] || '7:30 PM';
    
    return {
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner,
        snacks: mealsPerDay > 3 ? ['10:00 AM', '4:00 PM'] : [],
        totalMeals: mealsPerDay
    };
}

function calculateHealthMetrics(responses) {
    const weight = parseFloat(responses[7]);
    const height = parseFloat(responses[8]);
    const age = parseInt(responses[2]);
    
    const bmi = weight / ((height/100) * (height/100));
    let bmiCategory = 'Normal';
    
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi > 25) bmiCategory = 'Overweight';
    else if (bmi > 30) bmiCategory = 'Obese';
    
    return {
        bmi: bmi.toFixed(1),
        bmiCategory: bmiCategory,
        idealWeight: calculateIdealWeight(height, responses[3]),
        metabolicAge: estimateMetabolicAge(age, bmi, responses[9])
    };
}

function generateDietRecommendations(responses) {
    const recommendations = [];
    const restrictions = responses[10] || [];
    const allergies = responses[11] || [];
    const conditions = responses[18] || [];
    const goal = responses[6];
    
    // Goal-based recommendations
    if (goal === 'weight_loss') {
        recommendations.push('Focus on creating a moderate calorie deficit');
        recommendations.push('Increase protein intake to preserve muscle mass');
        recommendations.push('Include more fiber-rich foods for satiety');
    } else if (goal === 'weight_gain') {
        recommendations.push('Increase calorie density of meals');
        recommendations.push('Add healthy fats like nuts and avocado');
        recommendations.push('Consider protein shakes between meals');
    }
    
    // Condition-based recommendations
    if (conditions.includes('diabetes')) {
        recommendations.push('Focus on low glycemic index foods');
        recommendations.push('Monitor carbohydrate portions carefully');
    }
    
    if (conditions.includes('hypertension')) {
        recommendations.push('Reduce sodium intake significantly');
        recommendations.push('Increase potassium-rich foods');
    }
    
    // Activity-based recommendations
    const activity = responses[9];
    if (activity === 'very_active' || activity === 'extremely_active') {
        recommendations.push('Increase carbohydrate intake for energy');
        recommendations.push('Consider post-workout nutrition timing');
    }
    
    return recommendations;
}

// Helper functions
function calculateCalories(weight, height, age, gender, activity) {
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
    };
    
    return bmr * (activityMultipliers[activity] || 1.2);
}

function calculateIdealWeight(height, gender) {
    const heightM = height / 100;
    if (gender === 'male') {
        return Math.round(22 * heightM * heightM);
    } else {
        return Math.round(21 * heightM * heightM);
    }
}

function estimateMetabolicAge(chronologicalAge, bmi, activity) {
    let metabolicAge = chronologicalAge;
    
    // BMI adjustment
    if (bmi > 25) metabolicAge += 2;
    else if (bmi < 18.5) metabolicAge += 1;
    
    // Activity adjustment
    if (activity === 'very_active' || activity === 'extremely_active') {
        metabolicAge -= 3;
    } else if (activity === 'sedentary') {
        metabolicAge += 2;
    }
    
    return Math.max(18, metabolicAge);
} 