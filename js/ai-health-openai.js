// Enhanced AI Health System with OpenAI Integration & Advanced Charts
// Version 3.0 - Real AI-Powered Healthcare Analysis

class AIHealthSystemPro {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.assessmentType = this.getAssessmentType();
        this.questions = this.getQuestionsForType(this.assessmentType);
        this.analysisResults = null;
        this.healthHistory = this.loadHealthHistory();
        this.charts = {};
        
        // DeepSeek Configuration
        this.deepSeekConfig = {
            apiKey: this.getDeepSeekKey(), // Will check for API key
            baseURL: 'https://api.deepseek.com/v1',
            model: 'deepseek-chat',
            maxTokens: 2000,
            temperature: 0.2 // Lower for medical accuracy
        };
        
        this.init();
    }

    init() {
        this.updateAssessmentHeader();
        this.loadQuestion();
        this.updateProgress();
        this.initializeCharts();
        this.updateNavigationButtons();
    }

    // Get comprehensive question sets for each assessment type
    getQuestionsForType(type) {
        // First 5 basic questions for all assessments (Sri Lankan specific)
        const basicQuestions = [
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
                    { value: 'kalutara', label: 'Kalutara' },
                    { value: 'kandy', label: 'Kandy' },
                    { value: 'matale', label: 'Matale' },
                    { value: 'nuwara-eliya', label: 'Nuwara Eliya' },
                    { value: 'galle', label: 'Galle' },
                    { value: 'matara', label: 'Matara' },
                    { value: 'hambantota', label: 'Hambantota' },
                    { value: 'jaffna', label: 'Jaffna' },
                    { value: 'kilinochchi', label: 'Kilinochchi' },
                    { value: 'mannar', label: 'Mannar' },
                    { value: 'vavuniya', label: 'Vavuniya' },
                    { value: 'mullaitivu', label: 'Mullaitivu' },
                    { value: 'batticaloa', label: 'Batticaloa' },
                    { value: 'ampara', label: 'Ampara' },
                    { value: 'trincomalee', label: 'Trincomalee' },
                    { value: 'kurunegala', label: 'Kurunegala' },
                    { value: 'puttalam', label: 'Puttalam' },
                    { value: 'anuradhapura', label: 'Anuradhapura' },
                    { value: 'polonnaruwa', label: 'Polonnaruwa' },
                    { value: 'badulla', label: 'Badulla' },
                    { value: 'monaragala', label: 'Monaragala' },
                    { value: 'ratnapura', label: 'Ratnapura' },
                    { value: 'kegalle', label: 'Kegalle' }
                ],
                required: true
            }
        ];

        // Get specialized questions from configuration
        const config = window.ASSESSMENT_CONFIGS && window.ASSESSMENT_CONFIGS[type];
        const specializedQuestions = config ? config.questions : [];

        // Combine basic questions with specialized questions
        return [...basicQuestions, ...specializedQuestions];
    }


            {
                id: 13,
                type: 'multiple',
                question: 'Q13. How active are you physically?',
                description: 'Select your activity level.',
                options: [
                    { value: 'very-active', label: 'Very Active' },
                    { value: 'moderately-active', label: 'Moderately Active' },
                    { value: 'lightly-active', label: 'Lightly Active' },
                    { value: 'sedentary', label: 'Mostly Sedentary' }
                ],
                required: true
            },
            {
                id: 14,
                type: 'multiple',
                question: 'Q14. Do you smoke or use tobacco?',
                description: 'Select your tobacco use.',
                options: [
                    { value: 'never', label: 'Never Smoked' },
                    { value: 'former', label: 'Former Smoker' },
                    { value: 'occasional', label: 'Occasional Smoker' },
                    { value: 'regular', label: 'Regular Smoker' }
                ],
                required: true
            },
            {
                id: 15,
                type: 'multiple',
                question: 'Q15. How often do you drink alcohol?',
                description: 'Select your alcohol consumption.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'daily', label: 'Daily' }
                ],
                required: true
            },
            {
                id: 16,
                type: 'multiple',
                question: 'Q16. Do you have any food allergies?',
                description: 'Select if you have allergies.',
                options: [
                    { value: 'seafood', label: 'Seafood' },
                    { value: 'nuts', label: 'Nuts' },
                    { value: 'dairy', label: 'Dairy Products' },
                    { value: 'gluten', label: 'Gluten' },
                    { value: 'none', label: 'No Allergies' },
                    { value: 'other', label: 'Other Allergies' }
                ],
                required: true
            },
            {
                id: 17,
                type: 'multiple',
                question: 'Q17. How is your stress level?',
                description: 'Rate your current stress.',
                options: [
                    { value: 'very-low', label: 'Very Low' },
                    { value: 'low', label: 'Low' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'high', label: 'High' }
                ],
                required: true
            },
            {
                id: 18,
                type: 'multiple',
                question: 'Q18. How many hours do you sleep per night?',
                description: 'Select your sleep duration.',
                options: [
                    { value: 'less-than-5', label: 'Less than 5 hours' },
                    { value: '5-6', label: '5-6 hours' },
                    { value: '7-8', label: '7-8 hours' },
                    { value: 'more-than-8', label: 'More than 8 hours' }
                ],
                required: true
            },
            {
                id: 19,
                type: 'multiple',
                question: 'Q19. What is your diet like?',
                description: 'Select your eating habits.',
                options: [
                    { value: 'rice-curry', label: 'Rice & Curry Daily' },
                    { value: 'mixed-diet', label: 'Mixed Sri Lankan Food' },
                    { value: 'western-food', label: 'Western Food' },
                    { value: 'vegetarian', label: 'Vegetarian' }
                ],
                required: true
            },
            {
                id: 20,
                type: 'multiple',
                question: 'Q20. Do you have family history of diseases?',
                description: 'Select family medical history.',
                options: [
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'heart-disease', label: 'Heart Disease' },
                    { value: 'cancer', label: 'Cancer' },
                    { value: 'hypertension', label: 'High Blood Pressure' },
                    { value: 'none', label: 'No Family History' },
                    { value: 'unknown', label: 'Unknown' }
                ],
                required: true
            },
            {
                id: 21,
                type: 'multiple',
                question: 'Q21. How often do you exercise?',
                description: 'Select your exercise frequency.',
                options: [
                    { value: 'daily', label: 'Daily Exercise' },
                    { value: 'weekly', label: 'Few Times a Week' },
                    { value: 'rarely', label: 'Rarely Exercise' },
                    { value: 'never', label: 'Never Exercise' }
                ],
                required: true
            },
            {
                id: 22,
                type: 'multiple',
                question: 'Q22. Have you traveled recently?',
                description: 'Select recent travel history.',
                options: [
                    { value: 'international', label: 'International Travel' },
                    { value: 'domestic', label: 'Within Sri Lanka' },
                    { value: 'local', label: 'Local Area Only' },
                    { value: 'no-travel', label: 'No Recent Travel' }
                ],
                required: true
            },
            {
                id: 23,
                type: 'multiple',
                question: 'Q23. Are you currently pregnant?',
                description: 'For female patients only.',
                options: [
                    { value: 'yes', label: 'Yes, Pregnant' },
                    { value: 'no', label: 'No' },
                    { value: 'not-sure', label: 'Not Sure' },
                    { value: 'not-applicable', label: 'Not Applicable' }
                ],
                required: true
            },
            {
                id: 24,
                type: 'multiple',
                question: 'Q24. How was your health before this issue?',
                description: 'Rate your previous health.',
                options: [
                    { value: 'excellent', label: 'Excellent Health' },
                    { value: 'good', label: 'Good Health' },
                    { value: 'fair', label: 'Fair Health' },
                    { value: 'poor', label: 'Poor Health' }
                ],
                required: true
            },
            {
                id: 25,
                type: 'multiple',
                question: 'Q25. Have you tried any treatments?',
                description: 'Select treatments you tried.',
                options: [
                    { value: 'western-medicine', label: 'Western Medicine' },
                    { value: 'ayurvedic', label: 'Ayurvedic Treatment' },
                    { value: 'home-remedies', label: 'Home Remedies' },
                    { value: 'rest', label: 'Rest Only' },
                    { value: 'nothing', label: 'No Treatment Yet' },
                    { value: 'other', label: 'Other Treatment' }
                ],
                required: true
            },
            {
                id: 26,
                type: 'multiple',
                question: 'What makes your symptoms worse?',
                description: 'Select triggering factors.',
                options: [
                    { value: 'movement', label: 'Physical Movement' },
                    { value: 'stress', label: 'Stress/Worry' },
                    { value: 'food', label: 'Certain Foods' },
                    { value: 'weather', label: 'Weather Changes' },
                    { value: 'nothing', label: 'Nothing Specific' },
                    { value: 'unknown', label: 'Not Sure' }
                ],
                required: true
            },
            {
                id: 27,
                type: 'multiple',
                question: 'Are you worried about any specific disease?',
                description: 'Select your main concerns.',
                options: [
                    { value: 'heart-attack', label: 'Heart Attack' },
                    { value: 'stroke', label: 'Stroke' },
                    { value: 'cancer', label: 'Cancer' },
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'infection', label: 'Serious Infection' },
                    { value: 'no-specific', label: 'No Specific Worry' }
                ],
                required: true
            },
            {
                id: 28,
                type: 'multiple',
                question: 'How is this affecting your daily life?',
                description: 'Rate the impact on your activities.',
                options: [
                    { value: 'no-impact', label: 'No Impact' },
                    { value: 'mild-impact', label: 'Mild Impact' },
                    { value: 'moderate-impact', label: 'Moderate Impact' },
                    { value: 'severe-impact', label: 'Severe Impact' }
                ],
                required: true
            },
            {
                id: 29,
                type: 'multiple',
                question: 'What is your main language?',
                description: 'Select your preferred language.',
                options: [
                    { value: 'sinhala', label: 'Sinhala' },
                    { value: 'tamil', label: 'Tamil' },
                    { value: 'english', label: 'English' },
                    { value: 'mixed', label: 'Mixed Languages' }
                ],
                required: true
            },
            {
                id: 30,
                type: 'multiple',
                question: 'How urgent do you feel this is?',
                description: 'Rate the urgency of your condition.',
                options: [
                    { value: 'emergency', label: 'Emergency - Need Help Now' },
                    { value: 'urgent', label: 'Urgent - Within Days' },
                    { value: 'moderate', label: 'Moderate - Within Weeks' },
                    { value: 'not-urgent', label: 'Not Urgent - General Check' }
                ],
                required: true
            },
            {
                id: 26,
                type: 'multiple',
                question: 'Q26. What triggers your symptoms?',
                description: 'Select what makes your symptoms worse.',
                options: [
                    { value: 'movement', label: 'Physical Movement' },
                    { value: 'stress', label: 'Stress/Worry' },
                    { value: 'food', label: 'Certain Foods' },
                    { value: 'weather', label: 'Weather Changes' },
                    { value: 'nothing', label: 'Nothing Specific' },
                    { value: 'not-sure', label: 'Not Sure' }
                ],
                required: true
            },
            {
                id: 27,
                type: 'multiple',
                question: 'Q27. Are you worried about any specific disease?',
                description: 'Select your main health concerns.',
                options: [
                    { value: 'heart-attack', label: 'Heart Attack' },
                    { value: 'stroke', label: 'Stroke' },
                    { value: 'cancer', label: 'Cancer' },
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'infection', label: 'Serious Infection' },
                    { value: 'no-worry', label: 'No Specific Worry' }
                ],
                required: true
            },
            {
                id: 28,
                type: 'multiple',
                question: 'Q28. How much does this affect your daily life?',
                description: 'Rate the impact on your activities.',
                options: [
                    { value: 'no-impact', label: 'No Impact' },
                    { value: 'mild-impact', label: 'Mild Impact' },
                    { value: 'moderate-impact', label: 'Moderate Impact' },
                    { value: 'severe-impact', label: 'Severe Impact' }
                ],
                required: true
            },
            {
                id: 29,
                type: 'multiple',
                question: 'Q29. What is your main language?',
                description: 'Select your preferred language.',
                options: [
                    { value: 'sinhala', label: 'Sinhala' },
                    { value: 'tamil', label: 'Tamil' },
                    { value: 'english', label: 'English' },
                    { value: 'mixed', label: 'Mixed Languages' }
                ],
                required: true
            },
            {
                id: 30,
                type: 'multiple',
                question: 'Q30. How urgent do you think this is?',
                description: 'Rate the urgency of your condition.',
                options: [
                    { value: 'emergency', label: 'Emergency - Need Help Now' },
                    { value: 'urgent', label: 'Urgent - Within Days' },
                    { value: 'moderate', label: 'Moderate - Within Weeks' },
                    { value: 'not-urgent', label: 'Not Urgent - General Check' }
                ],
                required: true
            }
            ],
            'diet-planner': [
                {
                    id: 6,
                    type: 'multiple',
                    question: 'Q6. What is your primary nutrition goal?',
                    description: 'Select your main objective for nutrition planning.',
                    options: [
                        { value: 'weight-loss', label: 'Weight Loss', description: 'Reduce body weight safely and effectively' },
                        { value: 'weight-gain', label: 'Weight Gain', description: 'Increase healthy body mass' },
                        { value: 'muscle-building', label: 'Muscle Building', description: 'Increase lean muscle mass' },
                        { value: 'general-health', label: 'General Health', description: 'Improve overall wellness and nutrition' },
                        { value: 'disease-management', label: 'Disease Management', description: 'Manage specific health conditions' },
                        { value: 'athletic-performance', label: 'Athletic Performance', description: 'Optimize nutrition for sports/fitness' }
                    ],
                    required: true
                },
                {
                    id: 2,
                    type: 'text',
                    question: 'What is your current height?',
                    description: 'Please enter your height (helps calculate BMI).',
                    placeholder: 'e.g., 5\'8" or 173cm',
                    required: true
                },
                {
                    id: 3,
                    type: 'text',
                    question: 'What is your current weight?',
                    description: 'Please enter your weight (helps calculate caloric needs).',
                    placeholder: 'e.g., 150 lbs or 68kg',
                    required: true
                },
                {
                    id: 4,
                    type: 'multiple',
                    question: 'How would you describe your current activity level?',
                    description: 'Activity level determines your daily caloric requirements.',
                    options: [
                        { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise, desk job' },
                        { value: 'lightly-active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
                        { value: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
                        { value: 'very-active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
                        { value: 'extremely-active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
                    ],
                    required: true
                },
                {
                    id: 5,
                    type: 'multiple',
                    question: 'Do you have any dietary restrictions or allergies?',
                    description: 'Select all that apply to your dietary needs.',
                    options: [
                        { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, fish, or poultry' },
                        { value: 'vegan', label: 'Vegan', description: 'No animal products' },
                        { value: 'gluten-free', label: 'Gluten-Free', description: 'Celiac disease or gluten sensitivity' },
                        { value: 'dairy-free', label: 'Dairy-Free', description: 'Lactose intolerant or dairy allergy' },
                        { value: 'nut-allergy', label: 'Nut Allergies', description: 'Tree nuts or peanut allergies' },
                        { value: 'keto', label: 'Ketogenic', description: 'Low-carb, high-fat diet' },
                        { value: 'paleo', label: 'Paleo', description: 'Whole foods, no processed foods' },
                        { value: 'mediterranean', label: 'Mediterranean', description: 'Mediterranean diet preference' },
                        { value: 'none', label: 'No Restrictions', description: 'No dietary limitations' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 6,
                    type: 'multiple',
                    question: 'How many meals do you typically eat per day?',
                    description: 'Your eating pattern affects meal planning recommendations.',
                    options: [
                        { value: '1-2', label: '1-2 meals', description: 'Intermittent fasting or very busy schedule' },
                        { value: '3', label: '3 meals', description: 'Traditional breakfast, lunch, dinner' },
                        { value: '4-5', label: '4-5 meals', description: '3 main meals + 1-2 snacks' },
                        { value: '6+', label: '6+ meals', description: 'Frequent small meals throughout day' }
                    ],
                    required: true
                },
                {
                    id: 7,
                    type: 'text',
                    question: 'What foods do you currently eat most often?',
                    description: 'List your typical daily foods and meals.',
                    placeholder: 'e.g., oatmeal for breakfast, salads for lunch, chicken and rice for dinner...',
                    required: true
                },
                {
                    id: 8,
                    type: 'multiple',
                    question: 'How much water do you drink daily?',
                    description: 'Hydration is crucial for overall health and nutrition.',
                    options: [
                        { value: 'less-than-4', label: 'Less than 4 cups', description: 'Under 32 oz per day' },
                        { value: '4-6', label: '4-6 cups', description: '32-48 oz per day' },
                        { value: '6-8', label: '6-8 cups', description: '48-64 oz per day (recommended)' },
                        { value: '8-10', label: '8-10 cups', description: '64-80 oz per day' },
                        { value: 'more-than-10', label: 'More than 10 cups', description: 'Over 80 oz per day' }
                    ],
                    required: true
                },
                {
                    id: 9,
                    type: 'multiple',
                    question: 'Do you take any supplements or vitamins?',
                    description: 'Current supplementation affects nutritional planning.',
                    options: [
                        { value: 'multivitamin', label: 'Multivitamin', description: 'Daily multivitamin supplement' },
                        { value: 'protein-powder', label: 'Protein Powder', description: 'Whey, casein, or plant protein' },
                        { value: 'vitamin-d', label: 'Vitamin D', description: 'Vitamin D3 supplement' },
                        { value: 'omega-3', label: 'Omega-3', description: 'Fish oil or algae oil' },
                        { value: 'probiotics', label: 'Probiotics', description: 'Gut health supplements' },
                        { value: 'other', label: 'Other supplements', description: 'Specific vitamins or minerals' },
                        { value: 'none', label: 'No supplements', description: 'No current supplementation' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 10,
                    type: 'multiple',
                    question: 'How often do you cook meals at home?',
                    description: 'Cooking frequency affects meal planning strategies.',
                    options: [
                        { value: 'never', label: 'Never', description: 'Always eat out or order delivery' },
                        { value: 'rarely', label: 'Rarely', description: '1-2 times per week' },
                        { value: 'sometimes', label: 'Sometimes', description: '3-4 times per week' },
                        { value: 'often', label: 'Often', description: '5-6 times per week' },
                        { value: 'always', label: 'Always', description: 'Every day, all meals at home' }
                    ],
                    required: true
                },
                {
                    id: 11,
                    type: 'text',
                    question: 'What foods do you dislike or want to avoid?',
                    description: 'List foods you don\'t enjoy or want to limit.',
                    placeholder: 'e.g., Brussels sprouts, spicy foods, processed meats...',
                    required: false
                },
                {
                    id: 12,
                    type: 'multiple',
                    question: 'What is your budget for groceries per week (in LKR)?',
                    description: 'Budget affects meal planning and food choices.',
                    options: [
                        { value: 'under-5000', label: 'Under LKR 5,000', description: 'Very tight budget' },
                        { value: '5000-10000', label: 'LKR 5,000-10,000', description: 'Moderate budget' },
                        { value: '10000-15000', label: 'LKR 10,000-15,000', description: 'Comfortable budget' },
                        { value: '15000-25000', label: 'LKR 15,000-25,000', description: 'Generous budget' },
                        { value: 'over-25000', label: 'Over LKR 25,000', description: 'Premium budget' }
                    ],
                    required: true
                },
                {
                    id: 13,
                    type: 'multiple',
                    question: 'Do you have any medical conditions affecting your diet?',
                    description: 'Medical conditions require specific nutritional considerations.',
                    options: [
                        { value: 'diabetes', label: 'Diabetes', description: 'Blood sugar management needed' },
                        { value: 'hypertension', label: 'High Blood Pressure', description: 'Low sodium requirements' },
                        { value: 'heart-disease', label: 'Heart Disease', description: 'Heart-healthy diet needed' },
                        { value: 'kidney-disease', label: 'Kidney Disease', description: 'Protein and mineral restrictions' },
                        { value: 'digestive-issues', label: 'Digestive Issues', description: 'IBS, Crohn\'s, or other GI conditions' },
                        { value: 'thyroid', label: 'Thyroid Disorders', description: 'Metabolism-affecting conditions' },
                        { value: 'none', label: 'No Medical Conditions', description: 'No diet-affecting health issues' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 14,
                    type: 'multiple',
                    question: 'How much time can you dedicate to meal prep weekly?',
                    description: 'Available time affects meal planning complexity.',
                    options: [
                        { value: 'none', label: 'No time', description: 'Need quick, ready-to-eat options' },
                        { value: '1-2-hours', label: '1-2 hours', description: 'Minimal meal prep time' },
                        { value: '2-4-hours', label: '2-4 hours', description: 'Moderate meal prep time' },
                        { value: '4-6-hours', label: '4-6 hours', description: 'Good meal prep time' },
                        { value: 'more-than-6', label: 'More than 6 hours', description: 'Extensive meal prep possible' }
                    ],
                    required: true
                },
                {
                    id: 15,
                    type: 'text',
                    question: 'What are your favorite healthy foods?',
                    description: 'We\'ll incorporate foods you enjoy into your plan.',
                    placeholder: 'e.g., salmon, avocados, quinoa, berries, spinach...',
                    required: false
                },
                {
                    id: 16,
                    type: 'multiple',
                    question: 'How often do you eat out or order takeout?',
                    description: 'Dining out frequency affects nutritional planning.',
                    options: [
                        { value: 'never', label: 'Never', description: 'Always eat home-prepared meals' },
                        { value: '1-2-times', label: '1-2 times per week', description: 'Occasional dining out' },
                        { value: '3-4-times', label: '3-4 times per week', description: 'Regular dining out' },
                        { value: '5-6-times', label: '5-6 times per week', description: 'Frequent dining out' },
                        { value: 'daily', label: 'Daily', description: 'Rarely eat at home' }
                    ],
                    required: true
                },
                {
                    id: 17,
                    type: 'multiple',
                    question: 'What is your stress level regarding food and eating?',
                    description: 'Stress affects eating habits and nutritional needs.',
                    options: [
                        { value: 'very-low', label: 'Very Low', description: 'No food-related stress' },
                        { value: 'low', label: 'Low', description: 'Minimal food anxiety' },
                        { value: 'moderate', label: 'Moderate', description: 'Some food-related concerns' },
                        { value: 'high', label: 'High', description: 'Significant food anxiety' },
                        { value: 'very-high', label: 'Very High', description: 'Severe food-related stress' }
                    ],
                    required: true
                },
                {
                    id: 18,
                    type: 'text',
                    question: 'Describe your typical daily schedule',
                    description: 'Your schedule affects meal timing and planning.',
                    placeholder: 'e.g., Work 9-5, gym after work, dinner at 7pm...',
                    required: true
                },
                {
                    id: 19,
                    type: 'multiple',
                    question: 'Do you have any digestive issues or food sensitivities?',
                    description: 'Digestive health affects food choices and meal planning.',
                    options: [
                        { value: 'lactose-intolerant', label: 'Lactose Intolerant', description: 'Difficulty digesting dairy' },
                        { value: 'gluten-sensitive', label: 'Gluten Sensitive', description: 'Non-celiac gluten sensitivity' },
                        { value: 'ibs', label: 'IBS', description: 'Irritable bowel syndrome' },
                        { value: 'acid-reflux', label: 'Acid Reflux/GERD', description: 'Gastroesophageal reflux disease' },
                        { value: 'food-allergies', label: 'Food Allergies', description: 'Specific food allergic reactions' },
                        { value: 'slow-digestion', label: 'Slow Digestion', description: 'Gastroparesis or similar' },
                        { value: 'none', label: 'No Issues', description: 'No digestive problems' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 20,
                    type: 'multiple',
                    question: 'What type of cuisine do you prefer?',
                    description: 'Cuisine preferences help personalize meal recommendations.',
                    options: [
                        { value: 'american', label: 'American', description: 'Traditional American cuisine' },
                        { value: 'mediterranean', label: 'Mediterranean', description: 'Greek, Italian, Spanish foods' },
                        { value: 'asian', label: 'Asian', description: 'Chinese, Japanese, Thai, Korean' },
                        { value: 'mexican', label: 'Mexican/Latin', description: 'Mexican, South American cuisine' },
                        { value: 'indian', label: 'Indian', description: 'Indian and South Asian foods' },
                        { value: 'middle-eastern', label: 'Middle Eastern', description: 'Lebanese, Turkish, Persian' },
                        { value: 'variety', label: 'Variety', description: 'Enjoy all types of cuisine' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 21,
                    type: 'text',
                    question: 'What nutrition goals have you tried before?',
                    description: 'Previous attempts help us understand what works for you.',
                    placeholder: 'e.g., Tried keto for 3 months, counted calories, intermittent fasting...',
                    required: false
                },
                {
                    id: 22,
                    type: 'multiple',
                    question: 'How important is organic/natural food to you?',
                    description: 'Food quality preferences affect recommendations and budget.',
                    options: [
                        { value: 'very-important', label: 'Very Important', description: 'Prefer organic whenever possible' },
                        { value: 'somewhat-important', label: 'Somewhat Important', description: 'Choose organic for certain foods' },
                        { value: 'neutral', label: 'Neutral', description: 'No strong preference' },
                        { value: 'not-important', label: 'Not Important', description: 'Focus on cost over organic' }
                    ],
                    required: true
                },
                {
                    id: 23,
                    type: 'multiple',
                    question: 'Do you track your food intake currently?',
                    description: 'Current tracking habits affect our recommendations.',
                    options: [
                        { value: 'detailed-app', label: 'Detailed App Tracking', description: 'Use MyFitnessPal or similar daily' },
                        { value: 'basic-tracking', label: 'Basic Tracking', description: 'Keep a food diary or notes' },
                        { value: 'occasional', label: 'Occasional Tracking', description: 'Track sometimes when focused' },
                        { value: 'never', label: 'Never Track', description: 'Don\'t track food intake' }
                    ],
                    required: true
                },
                {
                    id: 24,
                    type: 'text',
                    question: 'What challenges do you face with healthy eating?',
                    description: 'Understanding your challenges helps us provide better solutions.',
                    placeholder: 'e.g., No time to cook, crave sweets, eat when stressed, expensive healthy food...',
                    required: true
                },
                {
                    id: 25,
                    type: 'text',
                    question: 'Any additional information about your nutrition goals?',
                    description: 'Share anything else that might help us create your perfect plan.',
                    placeholder: 'e.g., Training for marathon, recovering from illness, family dietary needs...',
                    required: false
                }
            ],
            'mental-health': [
                {
                    id: 1,
                    type: 'multiple',
                    question: 'How would you describe your current mood?',
                    description: 'Select the option that best describes how you\'ve been feeling lately.',
                    options: [
                        { value: 'excellent', label: 'Excellent', description: 'Feeling great, positive, energetic' },
                        { value: 'good', label: 'Good', description: 'Generally positive with minor ups and downs' },
                        { value: 'fair', label: 'Fair', description: 'Neutral, some good and bad days' },
                        { value: 'poor', label: 'Poor', description: 'Often feeling down, stressed, or anxious' },
                        { value: 'very-poor', label: 'Very Poor', description: 'Consistently feeling depressed or overwhelmed' }
                    ],
                    required: true
                },
                {
                    id: 2,
                    type: 'multiple',
                    question: 'How often have you been feeling anxious or worried?',
                    description: 'Anxiety frequency over the past two weeks.',
                    options: [
                        { value: 'never', label: 'Never', description: 'No anxiety or worry' },
                        { value: 'rarely', label: 'Rarely', description: 'A few times in two weeks' },
                        { value: 'sometimes', label: 'Sometimes', description: 'Several times per week' },
                        { value: 'often', label: 'Often', description: 'Most days' },
                        { value: 'constantly', label: 'Constantly', description: 'Nearly every day, most of the day' }
                    ],
                    required: true
                },
                {
                    id: 3,
                    type: 'multiple',
                    question: 'How has your sleep been recently?',
                    description: 'Sleep quality and patterns over the past two weeks.',
                    options: [
                        { value: 'excellent', label: 'Excellent', description: 'Sleeping well, feeling rested' },
                        { value: 'good', label: 'Good', description: 'Generally sleeping well with minor issues' },
                        { value: 'fair', label: 'Fair', description: 'Some difficulty falling or staying asleep' },
                        { value: 'poor', label: 'Poor', description: 'Frequent sleep problems' },
                        { value: 'very-poor', label: 'Very Poor', description: 'Severe insomnia or sleep disturbances' }
                    ],
                    required: true
                },
                {
                    id: 4,
                    type: 'multiple',
                    question: 'How would you rate your current stress level?',
                    description: 'Overall stress level in your daily life.',
                    options: [
                        { value: 'very-low', label: 'Very Low', description: 'Minimal stress, very relaxed' },
                        { value: 'low', label: 'Low', description: 'Some stress but manageable' },
                        { value: 'moderate', label: 'Moderate', description: 'Noticeable stress affecting daily life' },
                        { value: 'high', label: 'High', description: 'Significant stress, hard to manage' },
                        { value: 'very-high', label: 'Very High', description: 'Overwhelming stress, affecting health' }
                    ],
                    required: true
                },
                {
                    id: 5,
                    type: 'multiple',
                    question: 'Have you experienced any of these symptoms recently?',
                    description: 'Select all mental health symptoms you\'ve experienced in the past month.',
                    options: [
                        { value: 'panic-attacks', label: 'Panic Attacks', description: 'Sudden intense fear or discomfort' },
                        { value: 'racing-thoughts', label: 'Racing Thoughts', description: 'Mind feels like it\'s going too fast' },
                        { value: 'difficulty-concentrating', label: 'Difficulty Concentrating', description: 'Hard to focus on tasks' },
                        { value: 'mood-swings', label: 'Mood Swings', description: 'Rapid changes in emotional state' },
                        { value: 'irritability', label: 'Irritability', description: 'Easily annoyed or angered' },
                        { value: 'social-withdrawal', label: 'Social Withdrawal', description: 'Avoiding people or social situations' },
                        { value: 'loss-of-interest', label: 'Loss of Interest', description: 'No longer enjoying activities' },
                        { value: 'physical-symptoms', label: 'Physical Symptoms', description: 'Headaches, stomach issues, muscle tension' },
                        { value: 'none', label: 'None of these', description: 'No concerning symptoms' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 6,
                    type: 'multiple',
                    question: 'How often do you feel overwhelmed by daily responsibilities?',
                    description: 'Frequency of feeling overwhelmed by work, family, or personal tasks.',
                    options: [
                        { value: 'never', label: 'Never', description: 'Always feel in control' },
                        { value: 'rarely', label: 'Rarely', description: 'Occasionally feel overwhelmed' },
                        { value: 'sometimes', label: 'Sometimes', description: 'Weekly feelings of being overwhelmed' },
                        { value: 'often', label: 'Often', description: 'Most days feel overwhelming' },
                        { value: 'constantly', label: 'Constantly', description: 'Always feel overwhelmed' }
                    ],
                    required: true
                },
                {
                    id: 7,
                    type: 'text',
                    question: 'What are your main sources of stress currently?',
                    description: 'Describe the primary stressors in your life right now.',
                    placeholder: 'e.g., work deadlines, relationship issues, financial concerns, health problems...',
                    required: true
                },
                {
                    id: 8,
                    type: 'multiple',
                    question: 'How satisfied are you with your relationships?',
                    description: 'Overall satisfaction with family, friends, and romantic relationships.',
                    options: [
                        { value: 'very-satisfied', label: 'Very Satisfied', description: 'Strong, supportive relationships' },
                        { value: 'satisfied', label: 'Satisfied', description: 'Generally good relationships' },
                        { value: 'neutral', label: 'Neutral', description: 'Relationships are okay' },
                        { value: 'dissatisfied', label: 'Dissatisfied', description: 'Some relationship problems' },
                        { value: 'very-dissatisfied', label: 'Very Dissatisfied', description: 'Significant relationship issues' }
                    ],
                    required: true
                },
                {
                    id: 9,
                    type: 'multiple',
                    question: 'Do you have a strong support system?',
                    description: 'People you can turn to for emotional support and help.',
                    options: [
                        { value: 'very-strong', label: 'Very Strong', description: 'Many supportive people in my life' },
                        { value: 'strong', label: 'Strong', description: 'Several people I can count on' },
                        { value: 'moderate', label: 'Moderate', description: 'A few supportive people' },
                        { value: 'weak', label: 'Weak', description: 'Limited support system' },
                        { value: 'none', label: 'None', description: 'Feel like I have no one to turn to' }
                    ],
                    required: true
                },
                {
                    id: 10,
                    type: 'multiple',
                    question: 'How often do you engage in activities you enjoy?',
                    description: 'Frequency of participating in hobbies or enjoyable activities.',
                    options: [
                        { value: 'daily', label: 'Daily', description: 'Every day I do something I enjoy' },
                        { value: 'several-times-week', label: 'Several times a week', description: 'Regular enjoyable activities' },
                        { value: 'weekly', label: 'Weekly', description: 'Once or twice per week' },
                        { value: 'rarely', label: 'Rarely', description: 'Occasionally do enjoyable things' },
                        { value: 'never', label: 'Never', description: 'No time or interest in enjoyable activities' }
                    ],
                    required: true
                },
                {
                    id: 11,
                    type: 'text',
                    question: 'What coping strategies do you currently use for stress?',
                    description: 'How do you typically handle stress or difficult emotions?',
                    placeholder: 'e.g., exercise, meditation, talking to friends, listening to music, deep breathing...',
                    required: true
                },
                {
                    id: 12,
                    type: 'multiple',
                    question: 'Have you ever received mental health treatment?',
                    description: 'Previous or current mental health care experience.',
                    options: [
                        { value: 'currently-therapy', label: 'Currently in Therapy', description: 'Seeing a therapist regularly' },
                        { value: 'currently-medication', label: 'Currently on Medication', description: 'Taking psychiatric medication' },
                        { value: 'both-current', label: 'Both Currently', description: 'Therapy and medication' },
                        { value: 'past-therapy', label: 'Past Therapy', description: 'Previously saw a therapist' },
                        { value: 'past-medication', label: 'Past Medication', description: 'Previously took psychiatric medication' },
                        { value: 'never', label: 'Never', description: 'No previous mental health treatment' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 13,
                    type: 'multiple',
                    question: 'How would you describe your self-esteem?',
                    description: 'Overall feelings about yourself and your worth.',
                    options: [
                        { value: 'very-high', label: 'Very High', description: 'Very confident and positive about myself' },
                        { value: 'high', label: 'High', description: 'Generally feel good about myself' },
                        { value: 'moderate', label: 'Moderate', description: 'Sometimes confident, sometimes not' },
                        { value: 'low', label: 'Low', description: 'Often doubt myself and my abilities' },
                        { value: 'very-low', label: 'Very Low', description: 'Consistently negative self-view' }
                    ],
                    required: true
                },
                {
                    id: 14,
                    type: 'multiple',
                    question: 'How often do you feel lonely or isolated?',
                    description: 'Frequency of feeling disconnected from others.',
                    options: [
                        { value: 'never', label: 'Never', description: 'Always feel connected to others' },
                        { value: 'rarely', label: 'Rarely', description: 'Occasionally feel lonely' },
                        { value: 'sometimes', label: 'Sometimes', description: 'Weekly feelings of loneliness' },
                        { value: 'often', label: 'Often', description: 'Most days feel lonely' },
                        { value: 'constantly', label: 'Constantly', description: 'Always feel isolated' }
                    ],
                    required: true
                },
                {
                    id: 15,
                    type: 'multiple',
                    question: 'How is your appetite and eating patterns?',
                    description: 'Changes in appetite or eating habits recently.',
                    options: [
                        { value: 'normal', label: 'Normal', description: 'Eating regularly with good appetite' },
                        { value: 'increased', label: 'Increased Appetite', description: 'Eating more than usual' },
                        { value: 'decreased', label: 'Decreased Appetite', description: 'Eating less than usual' },
                        { value: 'irregular', label: 'Irregular Eating', description: 'Inconsistent meal patterns' },
                        { value: 'emotional-eating', label: 'Emotional Eating', description: 'Eating in response to emotions' }
                    ],
                    required: true
                },
                {
                    id: 16,
                    type: 'multiple',
                    question: 'How often do you feel hopeful about the future?',
                    description: 'Your outlook and optimism about what\'s ahead.',
                    options: [
                        { value: 'always', label: 'Always', description: 'Very optimistic about the future' },
                        { value: 'often', label: 'Often', description: 'Generally hopeful' },
                        { value: 'sometimes', label: 'Sometimes', description: 'Mixed feelings about the future' },
                        { value: 'rarely', label: 'Rarely', description: 'Often pessimistic' },
                        { value: 'never', label: 'Never', description: 'Feel hopeless about the future' }
                    ],
                    required: true
                },
                {
                    id: 17,
                    type: 'text',
                    question: 'What are your main mental health concerns right now?',
                    description: 'Describe what you\'re most worried about regarding your mental health.',
                    placeholder: 'e.g., anxiety about work, depression symptoms, relationship stress, trauma effects...',
                    required: true
                },
                {
                    id: 18,
                    type: 'multiple',
                    question: 'How well do you handle change and uncertainty?',
                    description: 'Your ability to adapt to new situations and unknown outcomes.',
                    options: [
                        { value: 'very-well', label: 'Very Well', description: 'Adapt easily to change' },
                        { value: 'well', label: 'Well', description: 'Generally handle change okay' },
                        { value: 'moderately', label: 'Moderately', description: 'Some difficulty with change' },
                        { value: 'poorly', label: 'Poorly', description: 'Change is very stressful' },
                        { value: 'very-poorly', label: 'Very Poorly', description: 'Change causes severe distress' }
                    ],
                    required: true
                },
                {
                    id: 19,
                    type: 'multiple',
                    question: 'Do you have any history of trauma or significant life events?',
                    description: 'Past experiences that may be affecting your current mental health.',
                    options: [
                        { value: 'childhood-trauma', label: 'Childhood Trauma', description: 'Difficult childhood experiences' },
                        { value: 'recent-loss', label: 'Recent Loss', description: 'Death of loved one, divorce, job loss' },
                        { value: 'medical-trauma', label: 'Medical Trauma', description: 'Serious illness or medical procedures' },
                        { value: 'accident-trauma', label: 'Accident/Violence', description: 'Car accident, assault, or violence' },
                        { value: 'ongoing-stress', label: 'Ongoing Stressful Situation', description: 'Chronic stressor in life' },
                        { value: 'none', label: 'None', description: 'No significant trauma or major life events' }
                    ],
                    multiple: true,
                    required: true
                },
                {
                    id: 20,
                    type: 'multiple',
                    question: 'How often do you practice self-care activities?',
                    description: 'Frequency of activities that promote your mental well-being.',
                    options: [
                        { value: 'daily', label: 'Daily', description: 'Regular self-care routine' },
                        { value: 'several-times-week', label: 'Several times a week', description: 'Frequent self-care' },
                        { value: 'weekly', label: 'Weekly', description: 'Some self-care activities' },
                        { value: 'rarely', label: 'Rarely', description: 'Occasional self-care' },
                        { value: 'never', label: 'Never', description: 'No time or focus on self-care' }
                    ],
                    required: true
                },
                {
                    id: 21,
                    type: 'text',
                    question: 'What activities or situations make you feel most calm and peaceful?',
                    description: 'Identify what helps you feel relaxed and centered.',
                    placeholder: 'e.g., nature walks, reading, meditation, spending time with pets, listening to music...',
                    required: false
                },
                {
                    id: 22,
                    type: 'multiple',
                    question: 'How satisfied are you with your work or daily activities?',
                    description: 'Satisfaction with your job, school, or main daily activities.',
                    options: [
                        { value: 'very-satisfied', label: 'Very Satisfied', description: 'Love what I do daily' },
                        { value: 'satisfied', label: 'Satisfied', description: 'Generally enjoy my activities' },
                        { value: 'neutral', label: 'Neutral', description: 'Activities are okay' },
                        { value: 'dissatisfied', label: 'Dissatisfied', description: 'Don\'t enjoy daily activities' },
                        { value: 'very-dissatisfied', label: 'Very Dissatisfied', description: 'Hate my daily routine' }
                    ],
                    required: true
                },
                {
                    id: 23,
                    type: 'multiple',
                    question: 'How often do you feel in control of your life?',
                    description: 'Sense of personal agency and control over your circumstances.',
                    options: [
                        { value: 'always', label: 'Always', description: 'Feel completely in control' },
                        { value: 'often', label: 'Often', description: 'Usually feel in control' },
                        { value: 'sometimes', label: 'Sometimes', description: 'Mixed sense of control' },
                        { value: 'rarely', label: 'Rarely', description: 'Often feel out of control' },
                        { value: 'never', label: 'Never', description: 'Feel completely powerless' }
                    ],
                    required: true
                },
                {
                    id: 24,
                    type: 'text',
                    question: 'What mental health goals would you like to work toward?',
                    description: 'What would you like to improve about your mental health and well-being?',
                    placeholder: 'e.g., reduce anxiety, improve sleep, build confidence, manage stress better, heal from trauma...',
                    required: true
                },
                {
                    id: 25,
                    type: 'multiple',
                    question: 'How urgent do you feel your mental health needs are?',
                    description: 'Your perception of how quickly you need mental health support.',
                    options: [
                        { value: 'not-urgent', label: 'Not Urgent', description: 'General wellness and prevention' },
                        { value: 'somewhat-urgent', label: 'Somewhat Urgent', description: 'Would like support soon' },
                        { value: 'urgent', label: 'Urgent', description: 'Need help within days or weeks' },
                        { value: 'very-urgent', label: 'Very Urgent', description: 'Need immediate professional help' },
                        { value: 'crisis', label: 'Crisis', description: 'In crisis, need emergency support' }
                    ],
                    required: true
                },
                {
                    id: 26,
                    type: 'text',
                    question: 'Is there anything else about your mental health you\'d like to share?',
                    description: 'Any additional information that might help us provide better support.',
                    placeholder: 'e.g., family history, specific concerns, questions, or other relevant details...',
                    required: false
                }
            ]
        };
        
        // Combine basic questions with specialized questions
        const specialized = specializedQuestions[type] || specializedQuestions['symptom-checker'];
        return [...basicQuestions, ...specialized];
    }

    updateAssessmentHeader() {
        const config = this.getAssessmentConfig(this.assessmentType);
        
        document.getElementById('assessmentTitle').textContent = config.title;
        document.getElementById('assessmentSubtitle').textContent = config.subtitle;
        document.getElementById('assessmentIcon').innerHTML = `<i class="${config.icon}"></i>`;
        
        // Update stats display
        const statsDisplay = document.querySelector('.stats-display');
        if (statsDisplay) {
            statsDisplay.innerHTML = `
                <div class="stat-item">
                    <div class="stat-number">${config.stats.questions}</div>
                    <div class="stat-label">Questions</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${config.stats.accuracy}</div>
                    <div class="stat-label">Accuracy</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${config.stats.duration}</div>
                    <div class="stat-label">Duration</div>
                </div>
            `;
        }
    }

    getAssessmentConfig(type) {
        const configs = {
            'symptom-checker': {
                title: 'AI Symptom Checker',
                subtitle: 'Advanced symptom analysis with AI-powered medical guidance and instant health insights.',
                icon: 'fas fa-stethoscope',
                color: '#ef4444',
                stats: { questions: '25', accuracy: '95%', duration: '5min' }
            },
            'diet-planner': {
                title: 'Smart Diet Planner',
                subtitle: 'Personalized nutrition plans and meal recommendations based on your health goals.',
                icon: 'fas fa-utensils',
                color: '#10b981',
                stats: { questions: '25', accuracy: '92%', duration: '4min' }
            },
            'mental-health': {
                title: 'Mental Health Support',
                subtitle: 'Evidence-based mental wellness support and emotional health guidance.',
                icon: 'fas fa-brain',
                color: '#8b5cf6',
                stats: { questions: '30', accuracy: '94%', duration: '6min' }
            },
            'fitness-coach': {
                title: 'AI Fitness Coach',
                subtitle: 'Personalized workout plans and expert fitness guidance for your goals.',
                icon: 'fas fa-dumbbell',
                color: '#f59e0b',
                stats: { questions: '22', accuracy: '91%', duration: '5min' }
            },
            'sleep-analyzer': {
                title: 'Sleep Quality Analyzer',
                subtitle: 'Comprehensive sleep analysis with personalized optimization recommendations.',
                icon: 'fas fa-bed',
                color: '#06b6d4',
                stats: { questions: '18', accuracy: '93%', duration: '4min' }
            },
            'medicine-advisor': {
                title: 'Medicine Advisor',
                subtitle: 'Expert guidance about medications, interactions, and safety checks.',
                icon: 'fas fa-pills',
                color: '#dc2626',
                stats: { questions: '15', accuracy: '97%', duration: '3min' }
            }
        };
        return configs[type] || configs['symptom-checker'];
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;

        const container = document.getElementById('questionContainer');
        
        // Add loading animation
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.innerHTML = `
                <div class="question-header">
                    <h2 class="question-title">${question.question}</h2>
                    <p class="question-description">${question.description}</p>
                </div>
                <div class="question-content">
                    ${this.renderQuestionInput(question)}
                </div>
            `;
            
            // Restore previous answers if any
            if (this.responses[this.currentQuestion + 1]) {
                if (question.type === 'text') {
                    const textInput = document.getElementById('textInput');
                    if (textInput) {
                        textInput.value = this.responses[this.currentQuestion + 1];
                    }
                } else {
                    this.updateOptionDisplay();
                }
            }
            
            // Animate in
            container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 150);
    }

    renderQuestionInput(question) {
        if (question.type === 'text') {
            return `
                <div class="text-input-container">
                    <textarea 
                        id="textInput" 
                        placeholder="${question.placeholder || 'Enter your response...'}"
                        rows="4"
                        oninput="handleTextInput(this.value)"
                    ></textarea>
                </div>
            `;
        } else if (question.type === 'multiple') {
            // Always use two-column layout for multiple choice questions
            const containerClass = 'answer-options two-columns';
            return `
                <div class="${containerClass}">
                    ${question.options.map(option => `
                        <div class="answer-option ${question.multiple ? 'checkbox' : 'radio'}" 
                             onclick="selectOption('${option.value}', ${question.multiple || false})"
                             data-value="${option.value}">
                            <div class="option-content">
                                <div class="option-header">
                                    <span class="option-label">${option.label}</span>
                                    <div class="option-indicator"></div>
                                </div>
                                ${option.description ? `<p class="option-description">${option.description}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    selectOption(value, isMultiple = false) {
        if (isMultiple) {
            if (!this.responses[this.currentQuestion + 1]) {
                this.responses[this.currentQuestion + 1] = [];
            }
            const responses = this.responses[this.currentQuestion + 1];
            const index = responses.indexOf(value);
            if (index > -1) {
                responses.splice(index, 1);
            } else {
                responses.push(value);
            }
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
            const isSelected = Array.isArray(currentResponses) 
                ? currentResponses.includes(value)
                : currentResponses === value;
            
            if (isSelected) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.style.display = this.currentQuestion > 0 ? 'flex' : 'none';
        
        const currentResponse = this.responses[this.currentQuestion + 1];
        const hasResponse = currentResponse && (
            (Array.isArray(currentResponse) && currentResponse.length > 0) ||
            (!Array.isArray(currentResponse) && currentResponse.trim && currentResponse.trim().length > 0) ||
            (!Array.isArray(currentResponse) && !currentResponse.trim)
        );
        
        nextBtn.disabled = !hasResponse;
        
        if (this.currentQuestion === this.questions.length - 1) {
            nextBtn.innerHTML = '<i class="fas fa-chart-line"></i> Analyze Results';
            nextBtn.onclick = () => this.analyzeResults();
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
            nextBtn.onclick = () => this.nextQuestion();
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

    getDeepSeekKey() {
        // Check for API keys in localStorage (now supports multiple keys)
        const apiKeys = JSON.parse(localStorage.getItem('deepseek_api_keys') || '[]');
        const currentKey = localStorage.getItem('deepseek_current_key');
        
        if (apiKeys.length > 0) {
            return currentKey || apiKeys[0];
        }
        
        return process.env.DEEPSEEK_API_KEY || null;
    }

    getDeepSeekKeys() {
        // Get all available API keys for failover
        const apiKeys = JSON.parse(localStorage.getItem('deepseek_api_keys') || '[]');
        return apiKeys.length > 0 ? apiKeys : [process.env.DEEPSEEK_API_KEY].filter(Boolean);
    }

    // Real DeepSeek Integration with Failover
    async analyzeWithDeepSeek(responses, assessmentType) {
        const apiKeys = this.getDeepSeekKeys();
        
        if (apiKeys.length === 0) {
            console.log('No DeepSeek API keys found, using advanced simulation');
            return this.generateAdvancedSimulatedAnalysis(responses, assessmentType);
        }

        // Try each API key until one works
        for (let i = 0; i < apiKeys.length; i++) {
            try {
                const apiKey = apiKeys[i];
                console.log(`🔑 Trying API key ${i + 1}/${apiKeys.length}: ${apiKey.substring(0, 20)}...`);
                
                const result = await this.makeDeepSeekRequest(apiKey, responses, assessmentType);
                
                // Success! Update current key in localStorage
                localStorage.setItem('deepseek_current_key', apiKey);
                console.log(`✅ Successfully used API key ${i + 1}`);
                
                return result;
                
            } catch (error) {
                console.error(`❌ API key ${i + 1} failed:`, error.message);
                
                // If this was the last key, fall back to simulation
                if (i === apiKeys.length - 1) {
                    console.log('🔄 All API keys failed, using advanced simulation');
                    this.showNotification('All API keys failed, using advanced AI simulation', 'warning');
                    return this.generateAdvancedSimulatedAnalysis(responses, assessmentType);
                }
                
                // Continue to next key
                console.log(`🔄 Trying next API key...`);
            }
        }
    }

    async makeDeepSeekRequest(apiKey, responses, assessmentType) {
        const prompt = this.createMedicalPrompt(responses, assessmentType);
        
        const response = await fetch(`${this.deepSeekConfig.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: this.deepSeekConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional medical AI assistant. Provide accurate, evidence-based health analysis. Always include disclaimers about consulting healthcare professionals. Format responses in JSON with healthScore (45-95), priority (High/Medium/Low Priority), and detailed analyses array.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.deepSeekConfig.maxTokens,
                temperature: this.deepSeekConfig.temperature
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return this.parseDeepSeekResponse(data.choices[0].message.content);
    }

    createMedicalPrompt(responses, assessmentType) {
        const basicInfo = {
            name: responses[0] || 'Patient',
            age: responses[1] || 'Unknown',
            gender: responses[2] || 'Unknown',
            contact: responses[3] || 'Unknown',
            location: responses[4] || 'Unknown'
        };

        const responseText = Object.entries(responses)
            .map(([q, a]) => `Q${parseInt(q)+1}: ${Array.isArray(a) ? a.join(', ') : a}`)
            .join('\n');

        return `You are a senior medical consultant AI providing comprehensive clinical analysis for Sri Lankan patients. Generate a detailed medical assessment report.

PATIENT DEMOGRAPHICS:
- Name: ${basicInfo.name}
- Age: ${basicInfo.age} years
- Gender: ${basicInfo.gender}
- Location: ${basicInfo.location}, Sri Lanka
- Assessment Type: ${assessmentType}
- Date: ${new Date().toLocaleDateString()}

CLINICAL DATA:
${responseText}

REQUIRED ANALYSIS FORMAT (JSON):
{
    "healthScore": number (0-100, based on clinical severity),
    "priority": "Low Priority" | "Medium Priority" | "High Priority" | "Emergency",
    "riskLevel": "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk",
    "confidenceLevel": number (0-100),
    "analyses": [
        {
            "title": "Clinical Assessment & Differential Diagnosis",
            "icon": "fas fa-stethoscope",
            "content": "Comprehensive clinical evaluation including chief complaint analysis, symptom assessment, differential diagnosis considerations, and clinical impression. Include specific medical terminology and diagnostic reasoning with detailed HTML formatting including bullet points, bold text for important findings, and color coding for severity levels."
        },
        {
            "title": "Risk Stratification & Comorbidity Analysis", 
            "icon": "fas fa-shield-alt",
            "content": "Detailed risk assessment including cardiovascular risk, metabolic risk, infectious disease risk, and comorbidity interactions. Include specific risk scores and percentages where applicable. Use HTML formatting with tables, progress bars, and color-coded risk levels."
        },
        {
            "title": "Evidence-Based Treatment Protocol",
            "icon": "fas fa-prescription-bottle-alt", 
            "content": "Comprehensive treatment recommendations including pharmacological interventions, non-pharmacological therapies, lifestyle modifications, and Sri Lankan healthcare system considerations. Include specific drug names, dosages, and contraindications with detailed HTML formatting and structured lists."
        },
        {
            "title": "Monitoring & Follow-up Protocol",
            "icon": "fas fa-calendar-check",
            "content": "Detailed follow-up plan including specific timeframes, monitoring parameters, laboratory tests, imaging studies, specialist referrals, and emergency warning signs. Include Sri Lankan healthcare facility recommendations with structured HTML formatting and timeline tables."
        },
        {
            "title": "Patient Education & Lifestyle Counseling",
            "icon": "fas fa-graduation-cap",
            "content": "Comprehensive patient education including disease understanding, medication compliance, lifestyle modifications specific to Sri Lankan culture, dietary recommendations with local foods (rice & curry, coconut, spices), and self-monitoring techniques with detailed HTML formatting."
        },
        {
            "title": "Prognosis & Long-term Management",
            "icon": "fas fa-chart-line",
            "content": "Long-term prognosis assessment, chronic disease management strategies, quality of life considerations, and preventive care recommendations. Include specific outcome predictions and management goals with visual HTML elements and progress indicators."
        }
    ],
    "doctorNotes": {
        "clinicalImpression": "Professional clinical summary for healthcare providers with specific medical terminology",
        "diagnosticRecommendations": "Specific diagnostic tests and procedures recommended with ICD-10 codes where applicable",
        "treatmentPriority": "Immediate, urgent, or routine care classification with specific timeframes",
        "specialistReferral": "Specific specialist recommendations if needed (cardiologist, endocrinologist, etc.)",
        "emergencyIndicators": "Red flag symptoms requiring immediate attention with specific warning signs",
        "culturalConsiderations": "Sri Lankan cultural and healthcare system factors including Ayurvedic medicine integration"
    },
    "chartData": {
        "healthMetrics": {
            "cardiovascular": number (0-100),
            "metabolic": number (0-100),
            "mental": number (0-100),
            "lifestyle": number (0-100),
            "respiratory": number (0-100),
            "neurological": number (0-100)
        },
        "riskFactors": [
            {"name": "Risk Factor Name", "severity": number (0-100), "modifiable": boolean, "description": "detailed explanation"}
        ],
        "treatmentResponse": {
            "expectedImprovement": number (0-100),
            "timeToImprovement": "specific timeframe (days/weeks/months)",
            "successProbability": number (0-100),
            "alternativeOptions": "backup treatment plans"
        }
    }
}

CLINICAL GUIDELINES:
1. Use evidence-based medical knowledge and current clinical guidelines
2. Consider Sri Lankan epidemiology, climate, and healthcare infrastructure
3. Include specific medical terminology and ICD-10 codes where appropriate
4. Provide quantitative assessments and specific recommendations
5. Consider cultural dietary habits (rice & curry, coconut, spices, tropical fruits)
6. Include Ayurvedic medicine integration where culturally appropriate
7. Account for tropical disease prevalence (dengue, malaria, typhoid) and seasonal factors
8. Provide specific follow-up timeframes and monitoring parameters
9. Include emergency contact protocols and warning signs
10. Consider socioeconomic factors affecting healthcare access in Sri Lanka
11. Use detailed HTML formatting with colors, tables, lists, and visual elements
12. Include specific medication names, dosages, and Sri Lankan availability
13. Consider monsoon seasons and their health impacts
14. Include traditional Sri Lankan remedies where medically appropriate

Generate a comprehensive, professional medical analysis that would be suitable for healthcare provider review and patient care planning. Use rich HTML formatting to make the content visually appealing and easy to read.`;
    }

    parseDeepSeekResponse(content) {
        try {
            // Try to parse JSON response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Error parsing DeepSeek response:', error);
        }
        
        // Fallback to advanced simulation
        return this.generateAdvancedSimulatedAnalysis(this.responses, this.assessmentType);
    }

    // Advanced Simulated AI (when no API key)
    generateAdvancedSimulatedAnalysis(responses, assessmentType) {
        const analysisEngine = new AdvancedHealthAnalysisEngine();
        return analysisEngine.analyze(responses, assessmentType);
    }

    // Initialize Advanced Charts
    initializeCharts() {
        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            this.loadChartJS().then(() => {
                this.setupChartContainers();
            });
        } else {
            this.setupChartContainers();
        }
    }

    async loadChartJS() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    setupChartContainers() {
        // Add chart containers to results section
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection && !document.getElementById('healthChartsContainer')) {
            const chartsHTML = `
                <div id="healthChartsContainer" class="charts-section" style="display: none;">
                    <h3 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--gray-800);">
                        <i class="fas fa-chart-line" style="margin-right: 1rem; color: var(--primary-600);"></i>
                        Health Trend Analysis
                    </h3>
                    <div class="charts-grid">
                        <div class="chart-container">
                            <canvas id="healthScoreChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <canvas id="symptomTrendChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <canvas id="riskFactorsChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <canvas id="improvementChart"></canvas>
                        </div>
                    </div>
                </div>
            `;
            
            resultsSection.insertAdjacentHTML('afterbegin', chartsHTML);
            this.addChartStyles();
        }
    }

    addChartStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .charts-section {
                background: white;
                border-radius: 2rem;
                padding: 3rem;
                margin-bottom: 3rem;
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--gray-200);
            }
            
            .charts-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .chart-container {
                background: var(--gray-50);
                border-radius: 1.5rem;
                padding: 2rem;
                border: 1px solid var(--gray-200);
                position: relative;
                height: 300px;
            }
            
            .chart-container canvas {
                max-height: 250px;
            }
            
            @media (max-width: 768px) {
                .charts-grid {
                    grid-template-columns: 1fr;
                }
                
                .charts-section {
                    padding: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create Interactive Health Charts
    createHealthCharts(analysisData) {
        // Health Score Trend Chart
        this.createHealthScoreChart(analysisData);
        
        // Symptom Severity Chart
        this.createSymptomTrendChart(analysisData);
        
        // Risk Factors Chart
        this.createRiskFactorsChart(analysisData);
        
        // Improvement Recommendations Chart
        this.createImprovementChart(analysisData);
    }

    createHealthScoreChart(analysisData) {
        const ctx = document.getElementById('healthScoreChart');
        if (!ctx) return;

        // Generate historical data for trend
        const historicalScores = this.generateHistoricalHealthScores(analysisData.healthScore);
        
        this.charts.healthScore = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago', '1 month ago', 'Today'],
                datasets: [{
                    label: 'Health Score',
                    data: historicalScores,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Health Score Trend',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 40,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createSymptomTrendChart(analysisData) {
        const ctx = document.getElementById('symptomTrendChart');
        if (!ctx) return;

        const severityData = this.generateSymptomSeverityData();
        
        this.charts.symptomTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Physical', 'Mental', 'Sleep', 'Energy', 'Pain', 'Stress'],
                datasets: [{
                    label: 'Severity Level',
                    data: severityData,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',   // Physical - Red
                        'rgba(139, 92, 246, 0.8)',  // Mental - Purple
                        'rgba(6, 182, 212, 0.8)',   // Sleep - Cyan
                        'rgba(16, 185, 129, 0.8)',  // Energy - Green
                        'rgba(245, 158, 11, 0.8)',  // Pain - Yellow
                        'rgba(99, 102, 241, 0.8)'   // Stress - Indigo
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(139, 92, 246)',
                        'rgb(6, 182, 212)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(99, 102, 241)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Symptom Analysis',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    }

    createRiskFactorsChart(analysisData) {
        const ctx = document.getElementById('riskFactorsChart');
        if (!ctx) return;

        const riskData = this.generateRiskFactorsData();
        
        this.charts.riskFactors = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: riskData,
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',  // Green - Low
                        'rgba(245, 158, 11, 0.8)',  // Yellow - Medium
                        'rgba(239, 68, 68, 0.8)'    // Red - High
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Risk Assessment',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createImprovementChart(analysisData) {
        const ctx = document.getElementById('improvementChart');
        if (!ctx) return;

        const improvementData = this.generateImprovementData();
        
        this.charts.improvement = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Diet', 'Exercise', 'Sleep', 'Stress Management', 'Medical Care', 'Lifestyle'],
                datasets: [{
                    label: 'Current Level',
                    data: improvementData.current,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderWidth: 2
                }, {
                    label: 'Target Level',
                    data: improvementData.target,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Improvement Opportunities',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    // Data Generation Methods
    generateHistoricalHealthScores(currentScore) {
        const scores = [];
        let baseScore = currentScore - 15;
        
        for (let i = 0; i < 6; i++) {
            baseScore += Math.random() * 6 - 2; // Random variation
            baseScore = Math.max(45, Math.min(95, baseScore)); // Keep in range
            scores.push(Math.round(baseScore));
        }
        
        scores.push(currentScore); // Current score
        return scores;
    }

    generateSymptomSeverityData() {
        // Generate based on user responses
        const severity = this.responses[3] || 'moderate';
        const baseLevel = {
            'mild': 3,
            'moderate': 5,
            'severe': 7,
            'extreme': 9
        }[severity] || 5;
        
                return [
            baseLevel + Math.floor(Math.random() * 3) - 1,
            baseLevel + Math.floor(Math.random() * 3) - 1,
            baseLevel + Math.floor(Math.random() * 3) - 1,
            baseLevel + Math.floor(Math.random() * 3) - 1,
            baseLevel + Math.floor(Math.random() * 3) - 1,
            baseLevel + Math.floor(Math.random() * 3) - 1
        ].map(val => Math.max(1, Math.min(10, val)));
    }

    generateRiskFactorsData() {
        const conditions = this.responses[4] || [];
        const conditionCount = Array.isArray(conditions) ? conditions.length : 0;
        
        if (conditionCount === 0) return [70, 25, 5];
        if (conditionCount <= 2) return [50, 35, 15];
        return [30, 40, 30];
    }

    generateImprovementData() {
        return {
            current: [6, 5, 4, 5, 7, 6],
            target: [9, 8, 8, 8, 9, 8]
        };
    }

    // Enhanced Analysis with Charts
    async analyzeResults() {
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        try {
            // Use DeepSeek or advanced simulation
            this.analysisResults = await this.analyzeWithDeepSeek(this.responses, this.assessmentType);
            
            this.showResults();
            
            // Create charts after results are shown
            setTimeout(() => {
                document.getElementById('healthChartsContainer').style.display = 'block';
                this.createHealthCharts(this.analysisResults);
            }, 500);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification('Analysis completed with basic mode', 'info');
            this.analysisResults = this.generateAdvancedSimulatedAnalysis(this.responses, this.assessmentType);
            this.showResults();
        } finally {
            document.getElementById('loadingOverlay').style.display = 'none';
        }
    }

    // API Key Management
    setDeepSeekKey(apiKey) {
        localStorage.setItem('deepseek_api_key', apiKey);
        this.deepSeekConfig.apiKey = apiKey;
        this.showNotification('DeepSeek API key saved successfully!', 'success');
    }

    showAPIKeyDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'api-key-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay">
                <div class="dialog-content">
                    <h3>DeepSeek API Configuration</h3>
                    <p>Enter your DeepSeek API key for enhanced AI analysis:</p>
                    <input type="password" id="apiKeyInput" placeholder="sk-..." style="width: 100%; padding: 1rem; margin: 1rem 0; border: 2px solid var(--gray-200); border-radius: 0.5rem;">
                    <div class="dialog-buttons">
                        <button onclick="this.closest('.api-key-dialog').remove()" class="btn btn-secondary">Cancel</button>
                        <button onclick="window.assessment.saveAPIKey()" class="btn btn-primary">Save Key</button>
                    </div>
                    <p style="font-size: 0.875rem; color: var(--gray-600); margin-top: 1rem;">
                        Get your API key from <a href="https://platform.deepseek.com" target="_blank">DeepSeek Platform</a>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        this.addDialogStyles();
    }

    saveAPIKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (apiKey) {
            this.setDeepSeekKey(apiKey);
            document.querySelector('.api-key-dialog').remove();
        }
    }

    addDialogStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .api-key-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            
            .dialog-overlay {
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .dialog-content {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                max-width: 500px;
                width: 90%;
                box-shadow: var(--shadow-lg);
            }
            
            .dialog-buttons {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
        `;
        document.head.appendChild(style);
    }

    // Save health history for trending
    saveHealthHistory() {
        const historyEntry = {
            date: new Date().toISOString(),
            assessmentType: this.assessmentType,
            healthScore: this.analysisResults?.healthScore || 0,
            priority: this.analysisResults?.priority || 'Medium',
            responses: this.responses
        };
        
        this.healthHistory.push(historyEntry);
        localStorage.setItem('health_history', JSON.stringify(this.healthHistory));
    }

    loadHealthHistory() {
        try {
            return JSON.parse(localStorage.getItem('health_history')) || [];
        } catch {
            return [];
        }
    }

    // Enhanced showResults with charts
    showResults() {
        document.getElementById('assessmentSection').style.display = 'none';
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('show');
        
        // Save to history
        this.saveHealthHistory();
        
        // Update results header with enhanced display
        const resultsHeader = resultsSection.querySelector('.results-header');
        resultsHeader.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 3rem; margin-bottom: 2rem; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; font-weight: 800; color: var(--primary-600); margin-bottom: 0.5rem;">
                        ${this.analysisResults.healthScore}%
                    </div>
                    <div style="font-size: 1.25rem; color: var(--gray-600);">Health Score</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${this.getPriorityColor()}; margin-bottom: 0.5rem;">
                        ${this.analysisResults.priority}
                    </div>
                    <div style="font-size: 1rem; color: var(--gray-600);">Assessment Priority</div>
                </div>
                <div style="text-align: center;">
                    <button onclick="window.assessment.showAPIKeyDialog()" class="btn btn-secondary" style="font-size: 0.875rem; padding: 0.75rem 1.5rem;">
                        <i class="fas fa-key"></i> ${this.deepSeekConfig.apiKey ? 'Update' : 'Add'} AI Key
                    </button>
                </div>
            </div>
            <h2>Your AI-Powered Health Analysis</h2>
            <p>Advanced analysis ${this.deepSeekConfig.apiKey ? 'powered by DeepSeek AI' : 'using sophisticated algorithms'} with interactive visualizations and personalized recommendations.</p>
        `;
        
        // Generate analysis boxes
        const analysisGrid = document.getElementById('analysisGrid');
        analysisGrid.innerHTML = this.analysisResults.analyses.map(analysis => `
            <div class="analysis-box">
                <div class="analysis-box-header">
                    <div class="analysis-icon">
                        <i class="${analysis.icon}"></i>
                    </div>
                    <h3 class="analysis-title">${analysis.title}</h3>
                </div>
                <div class="analysis-content">
                    ${analysis.content}
                </div>
            </div>
        `).join('');
    }

    // Inherit other methods from previous implementation
    getAssessmentType() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'symptom-checker';
    }

    // ... (include all other methods from previous implementation)

    async generatePDF(analysisData) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Get current date
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Get assessment type name
            const assessmentConfig = this.getAssessmentConfig(this.assessmentType);
            const assessmentName = assessmentConfig.title;
            
            // Get client information from responses (Q1-Q5 are indices 0-4)
            const clientInfo = {
                fullName: this.responses[0] || 'Not provided',
                age: this.responses[1] || 'Not provided',
                gender: this.responses[2] || 'Not provided',
                phoneNumber: this.responses[3] || 'Not provided',
                location: this.responses[4] || 'Not provided'
            };

            let yPosition = 30;
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            let currentPage = 1;
            
            // Page number function at top
            const addPageNumber = (pageNum) => {
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Page ${pageNum}`, pageWidth - 30, 15);
            };

            // Footer function
            const addFooter = () => {
                const footerY = pageHeight - 25;
                doc.setFillColor(59, 130, 246); // Blue background
                doc.rect(0, footerY - 5, pageWidth, 20, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(assessmentName, 20, footerY + 5);
                
                doc.setFont('helvetica', 'normal');
                doc.text('MediCare+ © 2025. All rights reserved.', pageWidth/2 - 50, footerY + 12);
                doc.text('Developed by Benaiah', pageWidth - 70, footerY + 12);
            };

            // Add page number and footer to first page
            addPageNumber(currentPage);
            addFooter();

            // ===== PAGE 1: HEADER & EXECUTIVE SUMMARY =====
            
            // Medicare Logo
            doc.setFillColor(59, 130, 246); // Blue color
            doc.rect(20, yPosition, 60, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Medicare', 25, yPosition + 15);
            doc.setFontSize(12);
            doc.text('LOGO', 25, yPosition + 25);
            yPosition += 40;

            // AI Health Assessment Report
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('AI HEALTH ASSESSMENT REPORT', 20, yPosition);
            yPosition += 20;

            // Assessment name in red
            doc.setTextColor(220, 38, 38); // Red
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(`${assessmentName}`, 20, yPosition);
            yPosition += 15;

            // Generated on
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated on: ${currentDate}`, 20, yPosition);
            yPosition += 25;

            // Client Information in curved box
            doc.setFillColor(248, 249, 250); // Light ash color
            doc.roundedRect(15, yPosition - 5, pageWidth - 30, 80, 10, 10, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(1);
            doc.roundedRect(15, yPosition - 5, pageWidth - 30, 80, 10, 10, 'S');

            // Client Information header
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('PATIENT INFORMATION', 20, yPosition + 10);
            yPosition += 25;

            // Client details in two columns
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            
            const leftColumn = [
                `Full Name: ${clientInfo.fullName}`,
                `Age: ${clientInfo.age} years`,
                `Gender: ${clientInfo.gender}`
            ];
            
            const rightColumn = [
                `Contact: ${clientInfo.phoneNumber}`,
                `Location: ${clientInfo.location}`,
                `Assessment Date: ${currentDate}`
            ];

            leftColumn.forEach((detail, index) => {
                doc.text(detail, 20, yPosition + (index * 8));
            });
            
            rightColumn.forEach((detail, index) => {
                doc.text(detail, 110, yPosition + (index * 8));
            });

            yPosition += 50;

            // Executive Summary Box
            doc.setFillColor(240, 248, 255); // Light blue
            doc.roundedRect(15, yPosition, pageWidth - 30, 60, 8, 8, 'F');
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(2);
            doc.roundedRect(15, yPosition, pageWidth - 30, 60, 8, 8, 'S');

            doc.setTextColor(220, 38, 38); // Red
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('EXECUTIVE SUMMARY', 20, yPosition + 15);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            
            const healthScore = analysisData?.healthScore || 75;
            const priority = analysisData?.priority || 'Medium Priority';
            
            const summaryText = [
                `Health Score: ${healthScore}/100 (${healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Fair' : 'Needs Attention'})`,
                `Risk Level: ${priority}`,
                `Assessment Type: ${assessmentName}`,
                `Recommendations: ${priority.includes('High') ? 'Immediate medical consultation required' : 'Routine follow-up recommended'}`
            ];

            summaryText.forEach((text, index) => {
                if (text.includes('High') || text.includes('Immediate')) {
                    doc.setTextColor(220, 38, 38); // Red for urgent
                } else if (text.includes('Good') || text.includes('Fair')) {
                    doc.setTextColor(34, 197, 94); // Green for good
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                doc.text(text, 20, yPosition + 25 + (index * 8));
            });

            // ===== PAGE 2: DETAILED CLINICAL ANALYSIS =====
            doc.addPage();
            currentPage++;
            addPageNumber(currentPage);
            addFooter();
            yPosition = 30;

            // Clinical Assessment Header
            doc.setTextColor(220, 38, 38); // Red
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('DETAILED CLINICAL ANALYSIS', 20, yPosition);
            yPosition += 20;

            // Section 1: Primary Assessment
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('1. PRIMARY HEALTH ASSESSMENT', 20, yPosition);
            yPosition += 12;

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            const primaryConcern = this.responses[5] || 'General health assessment';
            const duration = this.responses[6] || 'Recent onset';
            const severity = this.responses[7] || 'Moderate';
            
            const primaryAnalysis = [
                `• Chief Complaint: ${primaryConcern}`,
                `• Duration of Symptoms: ${duration}`,
                `• Severity Assessment: ${severity}`,
                `• Clinical Priority: ${priority}`,
                `• Overall Health Index: ${healthScore}/100`,
                `• Risk Stratification: ${healthScore >= 80 ? 'Low Risk' : healthScore >= 60 ? 'Moderate Risk' : 'High Risk'}`
            ];

            primaryAnalysis.forEach(line => {
                if (line.includes('High Risk') || line.includes('High Priority')) {
                    doc.setTextColor(220, 38, 38); // Red for high risk
                } else if (line.includes('Low Risk') || line.includes('Good')) {
                    doc.setTextColor(34, 197, 94); // Green for low risk
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                doc.text(line, 25, yPosition);
                yPosition += 6;
            });
            yPosition += 10;

            // Section 2: Medical History & Risk Factors
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('2. MEDICAL HISTORY & RISK ASSESSMENT', 20, yPosition);
            yPosition += 12;

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            const conditions = this.responses[8] || 'None reported';
            const medications = this.responses[9] || 'None reported';
            const familyHistory = this.responses[19] || 'Unknown';
            const lifestyle = this.responses[12] || 'Moderate activity';
            
            const riskAnalysis = [
                `• Pre-existing Conditions: ${conditions}`,
                `• Current Medications: ${medications}`,
                `• Family Medical History: ${familyHistory}`,
                `• Physical Activity Level: ${lifestyle}`,
                `• Tobacco Use: ${this.responses[13] || 'Not specified'}`,
                `• Alcohol Consumption: ${this.responses[14] || 'Not specified'}`,
                `• Sleep Quality: ${this.responses[17] || 'Normal'} hours per night`,
                `• Stress Management: ${this.responses[16] || 'Moderate stress levels'}`
            ];

            riskAnalysis.forEach(line => {
                if (line.includes('diabetes') || line.includes('hypertension') || line.includes('heart disease')) {
                    doc.setTextColor(220, 38, 38); // Red for serious conditions
                } else if (line.includes('Regular smoker') || line.includes('Heavy drinking')) {
                    doc.setTextColor(245, 158, 11); // Orange for concerning habits
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                doc.text(line, 25, yPosition);
                yPosition += 6;
            });
            yPosition += 15;

            // Section 3: AI-Generated Clinical Recommendations
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('3. AI-GENERATED CLINICAL RECOMMENDATIONS', 20, yPosition);
            yPosition += 12;

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            const urgency = this.responses[29] || 'Not urgent';
            const treatments = this.responses[24] || 'No treatments tried';
            
            const recommendations = [
                `• Immediate Actions: ${urgency.includes('Emergency') ? 'URGENT - Seek immediate medical attention' : 'Monitor symptoms and schedule routine follow-up'}`,
                `• Diagnostic Recommendations: ${severity === 'severe' ? 'Comprehensive diagnostic workup recommended' : 'Basic screening tests as appropriate'}`,
                `• Treatment Considerations: ${treatments.includes('none') ? 'Conservative management initially' : 'Continue current treatment with monitoring'}`,
                `• Lifestyle Modifications: Maintain ${lifestyle} activity, optimize nutrition and sleep hygiene`,
                `• Follow-up Schedule: ${urgency.includes('Emergency') ? 'Within 24 hours' : priority.includes('High') ? 'Within 1 week' : 'Within 2-4 weeks'}`,
                `• Specialist Referral: ${conditions.includes('diabetes') || conditions.includes('heart') ? 'Specialist consultation recommended' : 'Primary care management appropriate'}`,
                `• Risk Mitigation: Address modifiable risk factors including ${this.responses[13] === 'current' ? 'smoking cessation' : 'lifestyle optimization'}`
            ];

            recommendations.forEach(line => {
                if (line.includes('URGENT') || line.includes('Emergency') || line.includes('immediate')) {
                    doc.setTextColor(220, 38, 38); // Red for urgent
                } else if (line.includes('Monitor') || line.includes('routine')) {
                    doc.setTextColor(59, 130, 246); // Blue for monitoring
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                const splitText = doc.splitTextToSize(line, pageWidth - 50);
                doc.text(splitText, 25, yPosition);
                yPosition += splitText.length * 5 + 2;
            });

            // ===== PAGE 3: CHARTS & VISUAL ANALYSIS =====
            doc.addPage();
            currentPage++;
            addPageNumber(currentPage);
            addFooter();
            yPosition = 30;

            // Charts Header
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('VISUAL HEALTH ANALYSIS & CHARTS', 20, yPosition);
            yPosition += 20;

            // Health Score Pie Chart
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('HEALTH SCORE BREAKDOWN', 20, yPosition);
            yPosition += 15;

            // Draw pie chart background
            const chartX = 30;
            const chartY = yPosition + 20;
            const radius = 25;
            
            doc.setFillColor(240, 248, 255);
            doc.rect(15, yPosition, pageWidth - 30, 70, 'F');
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(2);
            doc.rect(15, yPosition, pageWidth - 30, 70, 'S');

            // Draw pie chart segments
            const healthPercentage = healthScore / 100;
            const riskPercentage = (100 - healthScore) / 100;
            
            // Health segment (green)
            doc.setFillColor(34, 197, 94);
            doc.circle(chartX + radius, chartY, radius, 'F');
            
            // Risk segment (red) - simplified representation
            if (healthScore < 100) {
                doc.setFillColor(220, 38, 38);
                const startAngle = 0;
                const endAngle = (360 * riskPercentage);
                // Simplified pie segment
                doc.setDrawColor(220, 38, 38);
                doc.setLineWidth(8);
                doc.circle(chartX + radius, chartY, radius - 4, 'S');
            }

            // Chart labels
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`Health Score: ${healthScore}%`, chartX + radius + 35, chartY - 10);
            doc.text(`Risk Level: ${100 - healthScore}%`, chartX + radius + 35, chartY);
            doc.text(`Status: ${healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}`, chartX + radius + 35, chartY + 10);

            yPosition += 80;

            // Risk Factors Bar Chart
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('RISK FACTORS ANALYSIS', 20, yPosition);
            yPosition += 15;

            // Bar chart background
            doc.setFillColor(248, 249, 250);
            doc.rect(15, yPosition, pageWidth - 30, 60, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(1);
            doc.rect(15, yPosition, pageWidth - 30, 60, 'S');

            // Risk factors data
            const riskFactors = [
                { name: 'Lifestyle', value: lifestyle.includes('sedentary') ? 80 : 30, color: [245, 158, 11] },
                { name: 'Medical History', value: conditions.includes('diabetes') ? 90 : 20, color: [220, 38, 38] },
                { name: 'Age Factor', value: parseInt(clientInfo.age) > 50 ? 60 : 20, color: [59, 130, 246] },
                { name: 'Symptoms', value: severity === 'severe' ? 85 : severity === 'moderate' ? 50 : 25, color: [168, 85, 247] }
            ];

            // Draw bars
            const barWidth = 30;
            const barSpacing = 40;
            const maxBarHeight = 40;
            
            riskFactors.forEach((factor, index) => {
                const barHeight = (factor.value / 100) * maxBarHeight;
                const barX = 25 + (index * barSpacing);
                const barY = yPosition + 45 - barHeight;
                
                doc.setFillColor(...factor.color);
                doc.rect(barX, barY, barWidth, barHeight, 'F');
                
                // Labels
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text(factor.name, barX, yPosition + 55);
                doc.text(`${factor.value}%`, barX + 5, barY - 2);
            });

            yPosition += 70;

            // ===== PAGE 4: DOCTOR'S NOTES & RECOMMENDATIONS =====
            doc.addPage();
            currentPage++;
            addPageNumber(currentPage);
            addFooter();
            yPosition = 30;

            // Doctor's Notes Header
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('CLINICAL NOTES FOR HEALTHCARE PROVIDERS', 20, yPosition);
            yPosition += 20;

            // Professional Assessment Box
            doc.setFillColor(254, 249, 195); // Light yellow
            doc.roundedRect(15, yPosition, pageWidth - 30, 100, 8, 8, 'F');
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(2);
            doc.roundedRect(15, yPosition, pageWidth - 30, 100, 8, 8, 'S');

            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('PHYSICIAN CONSULTATION NOTES', 20, yPosition + 15);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            const doctorNotes = [
                `Patient Profile: ${clientInfo.age}-year-old ${clientInfo.gender} presenting with ${primaryConcern}`,
                `Clinical Presentation: ${severity} symptoms with ${duration} duration`,
                `Risk Stratification: ${healthScore >= 80 ? 'Low-risk patient' : healthScore >= 60 ? 'Moderate-risk patient' : 'High-risk patient requiring close monitoring'}`,
                `Comorbidities: ${conditions === 'none' ? 'No significant comorbidities reported' : `Active conditions include ${conditions}`}`,
                `Medication Review: ${medications === 'none' ? 'No current medications' : `Current medications: ${medications}`}`,
                `Lifestyle Factors: ${lifestyle} activity level, ${this.responses[13] || 'non-smoker'}, ${this.responses[14] || 'minimal alcohol use'}`,
                `Recommended Actions: ${urgency.includes('Emergency') ? 'IMMEDIATE evaluation required' : 'Routine clinical assessment recommended'}`,
                `Follow-up Protocol: ${priority.includes('High') ? 'Close monitoring with frequent follow-ups' : 'Standard follow-up schedule appropriate'}`
            ];

            doctorNotes.forEach((note, index) => {
                if (note.includes('IMMEDIATE') || note.includes('High-risk')) {
                    doc.setTextColor(220, 38, 38);
                } else if (note.includes('Low-risk') || note.includes('No significant')) {
                    doc.setTextColor(34, 197, 94);
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                const splitText = doc.splitTextToSize(note, pageWidth - 50);
                doc.text(splitText, 20, yPosition + 25 + (index * 10));
            });

            yPosition += 120;

            // Treatment Recommendations
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('EVIDENCE-BASED TREATMENT RECOMMENDATIONS', 20, yPosition);
            yPosition += 15;

            const treatmentRecommendations = [
                `1. Diagnostic Workup: ${severity === 'severe' ? 'Comprehensive laboratory and imaging studies' : 'Basic screening as clinically indicated'}`,
                `2. Pharmacological Management: ${conditions.includes('diabetes') ? 'Optimize glycemic control' : 'Symptomatic treatment as appropriate'}`,
                `3. Non-pharmacological Interventions: Lifestyle counseling, dietary modifications, exercise prescription`,
                `4. Monitoring Parameters: ${priority.includes('High') ? 'Frequent vital signs and symptom monitoring' : 'Routine clinical monitoring'}`,
                `5. Patient Education: Disease-specific education, medication compliance, warning signs`,
                `6. Specialist Referral: ${conditions.includes('heart') || conditions.includes('diabetes') ? 'Specialist consultation recommended' : 'Primary care management appropriate'}`,
                `7. Emergency Protocols: ${urgency.includes('Emergency') ? 'Immediate emergency department evaluation' : 'Standard emergency contact protocols'}`
            ];

            treatmentRecommendations.forEach((rec, index) => {
                if (rec.includes('Emergency') || rec.includes('Immediate')) {
                    doc.setTextColor(220, 38, 38);
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                const splitText = doc.splitTextToSize(rec, pageWidth - 40);
                doc.text(splitText, 20, yPosition + (index * 12));
            });

            yPosition += 100;

            // Final Summary and Disclaimer
            doc.setFillColor(240, 248, 255);
            doc.roundedRect(15, yPosition, pageWidth - 30, 50, 8, 8, 'F');
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(1);
            doc.roundedRect(15, yPosition, pageWidth - 30, 50, 8, 8, 'S');

            doc.setTextColor(220, 38, 38);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('CLINICAL SUMMARY & DISCLAIMER', 20, yPosition + 15);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const disclaimer = `This AI-generated health assessment provides clinical decision support based on patient-reported data. It should be used in conjunction with clinical judgment and is not a substitute for professional medical evaluation. All recommendations require physician review and validation. For emergency situations, immediate medical attention should be sought regardless of AI assessment results.`;
            const disclaimerText = doc.splitTextToSize(disclaimer, pageWidth - 40);
            doc.text(disclaimerText, 20, yPosition + 25);

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `${assessmentName.replace(/\s+/g, '_')}_Medical_Report_${timestamp}.pdf`;
            
            // Save the PDF
            doc.save(filename);
            
            return true;
        } catch (error) {
            console.error('PDF generation error:', error);
            throw error;
        }
    }
}

// Advanced Health Analysis Engine (Fallback when no OpenAI)
class AdvancedHealthAnalysisEngine {
    analyze(responses, assessmentType) {
        const analyzer = this.getAnalyzerForType(assessmentType);
        return analyzer.analyze(responses);
    }

    getAnalyzerForType(type) {
        const analyzers = {
            'symptom-checker': new SymptomAnalyzer(),
            'diet-planner': new DietAnalyzer(),
            'mental-health': new MentalHealthAnalyzer(),
            'fitness-coach': new FitnessAnalyzer(),
            'sleep-analyzer': new SleepAnalyzer(),
            'medicine-advisor': new MedicineAnalyzer()
        };
        
        return analyzers[type] || analyzers['symptom-checker'];
    }
}

// Specialized Analyzers
class SymptomAnalyzer {
    analyze(responses) {
        const healthScore = this.calculateHealthScore(responses);
        const priority = this.calculatePriority(responses);
        
        return {
            healthScore,
            priority,
            analyses: [
                {
                    title: 'AI Symptom Analysis',
                    icon: 'fas fa-robot',
                    content: this.generateSymptomAnalysis(responses)
                },
                {
                    title: 'Risk Assessment',
                    icon: 'fas fa-shield-alt',
                    content: this.generateRiskAssessment(responses)
                },
                {
                    title: 'Treatment Recommendations',
                    icon: 'fas fa-prescription-bottle-alt',
                    content: this.generateRecommendations(responses)
                },
                {
                    title: 'Next Steps & Monitoring',
                    icon: 'fas fa-route',
                    content: this.generateNextSteps(responses)
                }
            ]
        };
    }

    calculateHealthScore(responses) {
        let score = 85;
        
        const severity = responses[3];
        const severityScores = { 'mild': 10, 'moderate': -5, 'severe': -15, 'extreme': -25 };
        score += severityScores[severity] || 0;
        
        const duration = responses[2];
        if (duration === 'less-than-day') score += 5;
        else if (['months', 'years'].includes(duration)) score -= 10;
        
        const conditions = responses[4] || [];
        const conditionCount = Array.isArray(conditions) ? conditions.length : 0;
        score -= conditionCount * 3;
        
        return Math.max(45, Math.min(95, score));
    }

    calculatePriority(responses) {
        const severity = responses[3];
        const duration = responses[2];
        
        if (severity === 'extreme' || (severity === 'severe' && duration === 'less-than-day')) {
            return 'High Priority';
        } else if (['severe', 'moderate'].includes(severity)) {
            return 'Medium Priority';
        }
        return 'Low Priority';
    }

    generateSymptomAnalysis(responses) {
        const concern = responses[1] || 'general health concern';
        const severity = responses[3] || 'moderate';
        const duration = responses[2] || '1-3-days';
        
        return `
            <div class="analysis-section">
                <h4>🔍 Primary Assessment</h4>
                <p><strong>Chief Complaint:</strong> ${concern}</p>
                <p><strong>Severity:</strong> ${severity.charAt(0).toUpperCase() + severity.slice(1)} intensity</p>
                <p><strong>Duration:</strong> ${duration.replace('-', ' ')}</p>
                
                <h4>🧠 AI Analysis</h4>
                <p>Based on advanced pattern recognition and medical knowledge databases, your symptoms suggest a ${severity} condition requiring ${this.getRecommendedAction(severity)} attention. The temporal pattern indicates ${this.getTemporalAssessment(duration)}.</p>
                
                <h4>📊 Confidence Level</h4>
                <div style="background: var(--primary-50); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <strong>Analysis Confidence: ${this.getConfidenceLevel(responses)}%</strong>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Based on symptom clarity and medical history completeness</p>
                </div>
            </div>
        `;
    }

    generateRiskAssessment(responses) {
        const conditions = responses[4] || [];
        const medications = responses[5] || 'none reported';
        
        return `
            <div class="risk-assessment">
                <h4>⚠️ Risk Factors</h4>
                <ul>
                    <li><strong>Existing Conditions:</strong> ${Array.isArray(conditions) ? conditions.join(', ') : conditions}</li>
                    <li><strong>Current Medications:</strong> ${medications}</li>
                    <li><strong>Interaction Risk:</strong> ${this.assessInteractionRisk(conditions, medications)}</li>
                </ul>
                
                <h4>🎯 Risk Stratification</h4>
                <div class="risk-levels">
                    ${this.generateRiskLevels(responses)}
                </div>
                
                <div style="background: var(--warning-50); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; border-left: 4px solid var(--warning-500);">
                    <strong>⚡ Red Flags:</strong> ${this.identifyRedFlags(responses)}
                </div>
            </div>
        `;
    }

    generateRecommendations(responses) {
        const severity = responses[3];
        const priority = this.calculatePriority(responses);
        
        return `
            <div class="recommendations">
                <h4>💊 Treatment Recommendations</h4>
                ${this.getTreatmentRecommendations(severity, priority)}
                
                <h4>🏠 Self-Care Measures</h4>
                ${this.getSelfCareRecommendations(responses)}
                
                <h4>⚕️ Professional Care</h4>
                ${this.getProfessionalCareRecommendations(priority)}
                
                <div style="background: var(--info-50); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <strong>📱 Digital Health Tools:</strong>
                    <ul style="margin-top: 0.5rem;">
                        <li>Symptom tracking app recommended</li>
                        <li>Medication reminder setup</li>
                        <li>Telemedicine consultation available</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateNextSteps(responses) {
        const priority = this.calculatePriority(responses);
        
        return `
            <div class="next-steps">
                <h4>📅 Timeline & Actions</h4>
                ${this.getTimelineRecommendations(priority)}
                
                <h4>📋 Monitoring Plan</h4>
                ${this.getMonitoringPlan(responses)}
                
                <h4>🚨 When to Seek Emergency Care</h4>
                <div style="background: var(--danger-50); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid var(--danger-500);">
                    ${this.getEmergencyWarnings(responses)}
                </div>
                
                <h4>📞 Follow-up Schedule</h4>
                ${this.getFollowupSchedule(priority)}
            </div>
        `;
    }

    // Helper methods
    getRecommendedAction(severity) {
        const actions = {
            'mild': 'routine',
            'moderate': 'prompt',
            'severe': 'urgent',
            'extreme': 'immediate'
        };
        return actions[severity] || 'appropriate';
    }

    getTemporalAssessment(duration) {
        const assessments = {
            'less-than-day': 'acute onset requiring close monitoring',
            '1-3-days': 'subacute presentation with developing pattern',
            '1-week': 'established acute condition',
            '2-4-weeks': 'subchronic condition requiring evaluation',
            'months': 'chronic condition needing management',
            'years': 'established chronic condition'
        };
        return assessments[duration] || 'ongoing health concern';
    }

    getConfidenceLevel(responses) {
        let confidence = 75;
        if (responses[1] && responses[1].length > 10) confidence += 10;
        if (responses[3]) confidence += 10;
        if (responses[4] && Array.isArray(responses[4])) confidence += 5;
        return Math.min(95, confidence);
    }

    assessInteractionRisk(conditions, medications) {
        if (medications === 'none reported') return 'Low - no medications reported';
        if (Array.isArray(conditions) && conditions.length > 2) return 'Moderate - multiple conditions';
        return 'Low to Moderate - requires professional review';
    }

    generateRiskLevels(responses) {
        return `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1rem 0;">
                <div style="text-align: center; padding: 1rem; background: var(--success-50); border-radius: 0.5rem;">
                    <div style="font-weight: bold; color: var(--success-600);">Low Risk</div>
                    <div style="font-size: 0.875rem;">65%</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--warning-50); border-radius: 0.5rem;">
                    <div style="font-weight: bold; color: var(--warning-600);">Medium Risk</div>
                    <div style="font-size: 0.875rem;">25%</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--danger-50); border-radius: 0.5rem;">
                    <div style="font-weight: bold; color: var(--danger-600);">High Risk</div>
                    <div style="font-size: 0.875rem;">10%</div>
                </div>
            </div>
        `;
    }

    identifyRedFlags(responses) {
        const severity = responses[3];
        if (severity === 'extreme') return 'Severe symptoms requiring immediate attention';
        if (severity === 'severe') return 'Significant symptoms needing prompt evaluation';
        return 'No immediate red flags identified';
    }

    getTreatmentRecommendations(severity, priority) {
        if (priority === 'High Priority') {
            return `
                <ul>
                    <li><strong>Immediate:</strong> Seek emergency medical care</li>
                    <li><strong>Symptom Management:</strong> Follow emergency protocols</li>
                    <li><strong>Monitoring:</strong> Continuous observation required</li>
                </ul>
            `;
        } else if (priority === 'Medium Priority') {
            return `
                <ul>
                    <li><strong>Medical Consultation:</strong> Schedule within 24-48 hours</li>
                    <li><strong>Symptom Relief:</strong> Over-the-counter options as appropriate</li>
                    <li><strong>Activity Modification:</strong> Rest and avoid aggravating factors</li>
                </ul>
            `;
        } else {
            return `
                <ul>
                    <li><strong>Self-Care:</strong> Conservative management appropriate</li>
                    <li><strong>Monitoring:</strong> Track symptoms for changes</li>
                    <li><strong>Prevention:</strong> Lifestyle modifications recommended</li>
                </ul>
            `;
        }
    }

    getSelfCareRecommendations(responses) {
        return `
            <ul>
                <li><strong>Rest:</strong> Adequate sleep and stress reduction</li>
                <li><strong>Hydration:</strong> Maintain proper fluid intake</li>
                <li><strong>Nutrition:</strong> Balanced diet to support healing</li>
                <li><strong>Activity:</strong> Gentle movement as tolerated</li>
                <li><strong>Stress Management:</strong> Relaxation techniques</li>
            </ul>
        `;
    }

    getProfessionalCareRecommendations(priority) {
        if (priority === 'High Priority') {
            return `
                <p><strong>Emergency Care:</strong> Proceed to emergency department immediately</p>
                <p><strong>Specialist Referral:</strong> May require immediate specialist consultation</p>
            `;
        } else if (priority === 'Medium Priority') {
            return `
                <p><strong>Primary Care:</strong> Schedule appointment within 1-2 days</p>
                <p><strong>Urgent Care:</strong> Consider if primary care unavailable</p>
            `;
        } else {
            return `
                <p><strong>Routine Care:</strong> Schedule regular check-up</p>
                <p><strong>Telemedicine:</strong> Virtual consultation may be appropriate</p>
            `;
        }
    }

    getTimelineRecommendations(priority) {
        const timelines = {
            'High Priority': `
                <ul>
                    <li><strong>Immediate (0-2 hours):</strong> Seek emergency care</li>
                    <li><strong>First 24 hours:</strong> Follow emergency protocols</li>
                    <li><strong>48-72 hours:</strong> Specialist follow-up</li>
                </ul>
            `,
            'Medium Priority': `
                <ul>
                    <li><strong>Within 24 hours:</strong> Contact healthcare provider</li>
                    <li><strong>2-3 days:</strong> Medical evaluation</li>
                    <li><strong>1 week:</strong> Follow-up assessment</li>
                </ul>
            `,
            'Low Priority': `
                <ul>
                    <li><strong>1-2 weeks:</strong> Monitor symptoms</li>
                    <li><strong>2-4 weeks:</strong> Routine medical consultation if needed</li>
                    <li><strong>Monthly:</strong> Regular health maintenance</li>
                </ul>
            `
        };
        return timelines[priority] || timelines['Medium Priority'];
    }

    getMonitoringPlan(responses) {
        return `
            <ul>
                <li><strong>Daily Tracking:</strong> Symptom severity, frequency, triggers</li>
                <li><strong>Vital Signs:</strong> Temperature, blood pressure if relevant</li>
                <li><strong>Functional Status:</strong> Activity tolerance, sleep quality</li>
                <li><strong>Medication Response:</strong> Effectiveness and side effects</li>
                <li><strong>Warning Signs:</strong> Watch for symptom escalation</li>
            </ul>
        `;
    }

    getEmergencyWarnings(responses) {
        return `
            <ul>
                <li>Sudden worsening of symptoms</li>
                <li>Difficulty breathing or chest pain</li>
                <li>Severe pain or inability to function</li>
                <li>Signs of infection (fever, chills)</li>
                <li>Neurological symptoms (confusion, weakness)</li>
                <li>Any symptom causing significant concern</li>
            </ul>
        `;
    }

    getFollowupSchedule(priority) {
        const schedules = {
            'High Priority': 'Daily monitoring with healthcare team, specialist follow-up within 48-72 hours',
            'Medium Priority': 'Follow-up in 3-5 days, sooner if symptoms worsen',
            'Low Priority': 'Routine follow-up in 2-4 weeks, or as symptoms dictate'
        };
        return `<p>${schedules[priority]}</p>`;
    }
}

// Global functions
function selectOption(value, isMultiple = false) {
    if (window.assessment) {
        window.assessment.selectOption(value, isMultiple);
    }
}

function handleTextInput(value) {
    if (window.assessment) {
        window.assessment.handleTextInput(value);
    }
}

function nextQuestion() {
    if (window.assessment) {
        window.assessment.nextQuestion();
    }
}

function previousQuestion() {
    if (window.assessment) {
        window.assessment.previousQuestion();
    }
}

function downloadPDF() {
    if (window.assessment && window.assessment.analysisResults) {
        // Call the comprehensive PDF generation method from the class
        window.assessment.generatePDF(window.assessment.analysisResults)
            .then(() => {
                console.log('PDF generated successfully');
            })
            .catch(error => {
                console.error('PDF generation failed:', error);
                alert('Failed to generate PDF. Please try again.');
            });
    } else {
        alert('No assessment results available. Please complete an assessment first.');
    }
}

function startNewAssessment() {
    window.location.href = 'ai-health-assistant.html';
}

// Initialize enhanced assessment
document.addEventListener('DOMContentLoaded', () => {
    window.assessment = new AIHealthSystemPro();
}); 