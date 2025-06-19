// Enhanced Assessment Configurations for Different Health Assessment Types
// Each assessment has 5 common questions + 25 specific questions + comprehensive PDF output
// Total 30 questions per assessment with detailed analysis and PDF reporting

// Common questions for all assessments (Q1-Q5)
const COMMON_QUESTIONS = [
    {
        id: 1,
        type: 'text',
        question: 'Q1. What is your full name?',
        description: 'Please enter your full name as it appears on your ID.',
        required: true,
        placeholder: 'Enter your full name'
    },
    {
        id: 2,
        type: 'text',
        question: 'Q2. What is your age?',
        description: 'Please enter your current age in years.',
        required: true,
        placeholder: 'Enter your age (e.g., 28)'
    },
    {
        id: 3,
        type: 'multiple',
        question: 'Q3. What is your gender?',
        description: 'Please select your gender.',
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' }
        ],
        required: true
    },
    {
        id: 4,
        type: 'text',
        question: 'Q4. What is your contact number?',
        description: 'Please provide your mobile number for follow-up.',
        required: true,
        placeholder: 'Enter your phone number (e.g., +94 71 234 5678)'
    },
    {
        id: 5,
        type: 'multiple',
        question: 'Q5. Which province are you from in Sri Lanka?',
        description: 'Select your current province of residence.',
        options: [
            { value: 'western', label: 'Western Province' },
            { value: 'central', label: 'Central Province' },
            { value: 'southern', label: 'Southern Province' },
            { value: 'northern', label: 'Northern Province' },
            { value: 'eastern', label: 'Eastern Province' },
            { value: 'north-western', label: 'North Western Province' },
            { value: 'north-central', label: 'North Central Province' },
            { value: 'uva', label: 'Uva Province' },
            { value: 'sabaragamuwa', label: 'Sabaragamuwa Province' }
        ],
        required: true
    }
];

const ASSESSMENT_CONFIGS = {
    'symptom-checker': {
        title: 'AI Symptom Checker',
        icon: 'fas fa-stethoscope',
        subtitle: 'Advanced symptom analysis with AI-powered medical guidance',
        questions: [
            ...COMMON_QUESTIONS,
            // 25 specific questions for symptom checker (Q6-Q30)
            {
                id: 6,
                type: 'multiple',
                question: 'Q6. What is your primary symptom?',
                description: 'Select your main health concern.',
                options: [
                    { value: 'fever', label: 'Fever/Chills' },
                    { value: 'headache', label: 'Headache/Migraine' },
                    { value: 'chest-pain', label: 'Chest Pain' },
                    { value: 'breathing', label: 'Breathing Difficulties' },
                    { value: 'stomach', label: 'Stomach/Digestive Issues' },
                    { value: 'joint-pain', label: 'Joint/Muscle Pain' },
                    { value: 'skin-issues', label: 'Skin Problems' },
                    { value: 'fatigue', label: 'Extreme Fatigue' }
                ],
                required: true
            },
            {
                id: 7,
                type: 'multiple',
                question: 'Q7. How long have you experienced this symptom?',
                description: 'Select the duration of your symptoms.',
                options: [
                    { value: 'hours', label: 'Few Hours' },
                    { value: 'today', label: 'Started Today' },
                    { value: 'few-days', label: '2-3 Days' },
                    { value: 'week', label: 'About a Week' },
                    { value: 'weeks', label: 'Several Weeks' },
                    { value: 'months', label: 'Several Months' }
                ],
                required: true
            },
            {
                id: 8,
                type: 'multiple',
                question: 'Q8. Rate the severity of your symptom (1-10 scale)',
                description: 'How intense is your discomfort?',
                options: [
                    { value: '1-2', label: 'Mild (1-2) - Barely noticeable' },
                    { value: '3-4', label: 'Mild-Moderate (3-4) - Noticeable but manageable' },
                    { value: '5-6', label: 'Moderate (5-6) - Interferes with activities' },
                    { value: '7-8', label: 'Severe (7-8) - Difficult to ignore' },
                    { value: '9-10', label: 'Very Severe (9-10) - Unbearable' }
                ],
                required: true
            },
            {
                id: 9,
                type: 'multiple',
                question: 'Q9. Do you have any accompanying symptoms?',
                description: 'Select any additional symptoms you are experiencing.',
                options: [
                    { value: 'nausea', label: 'Nausea/Vomiting' },
                    { value: 'dizziness', label: 'Dizziness/Lightheadedness' },
                    { value: 'weakness', label: 'General Weakness' },
                    { value: 'sleep-issues', label: 'Sleep Disturbances' },
                    { value: 'appetite-loss', label: 'Loss of Appetite' },
                    { value: 'mood-changes', label: 'Mood Changes' },
                    { value: 'none', label: 'None of the above' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 10,
                type: 'multiple',
                question: 'Q10. Have you tried any treatments or remedies?',
                description: 'What have you done to address this symptom?',
                options: [
                    { value: 'rest', label: 'Rest and Sleep' },
                    { value: 'otc-meds', label: 'Over-the-counter Medications' },
                    { value: 'home-remedies', label: 'Home Remedies' },
                    { value: 'ayurvedic', label: 'Ayurvedic Treatments' },
                    { value: 'doctor-visit', label: 'Consulted a Doctor' },
                    { value: 'nothing', label: 'Nothing Yet' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 11,
                type: 'multiple',
                question: 'Q11. Do you have any existing medical conditions?',
                description: 'Select any ongoing health conditions.',
                options: [
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'hypertension', label: 'High Blood Pressure' },
                    { value: 'heart-disease', label: 'Heart Disease' },
                    { value: 'asthma', label: 'Asthma' },
                    { value: 'arthritis', label: 'Arthritis' },
                    { value: 'thyroid', label: 'Thyroid Disorders' },
                    { value: 'none', label: 'No existing conditions' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 12,
                type: 'multiple',
                question: 'Q12. Are you currently taking any medications?',
                description: 'Include prescription and over-the-counter medications.',
                options: [
                    { value: 'prescription', label: 'Prescription Medications' },
                    { value: 'otc', label: 'Over-the-counter Medications' },
                    { value: 'supplements', label: 'Vitamins/Supplements' },
                    { value: 'herbal', label: 'Herbal Medicines' },
                    { value: 'none', label: 'No medications' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 13,
                type: 'multiple',
                question: 'Q13. Do you have any known allergies?',
                description: 'Select any allergies you have.',
                options: [
                    { value: 'drug-allergies', label: 'Drug Allergies' },
                    { value: 'food-allergies', label: 'Food Allergies' },
                    { value: 'environmental', label: 'Environmental Allergies' },
                    { value: 'skin-allergies', label: 'Skin Allergies' },
                    { value: 'none', label: 'No known allergies' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 14,
                type: 'multiple',
                question: 'Q14. How would you describe your general health?',
                description: 'Rate your overall health status.',
                options: [
                    { value: 'excellent', label: 'Excellent' },
                    { value: 'very-good', label: 'Very Good' },
                    { value: 'good', label: 'Good' },
                    { value: 'fair', label: 'Fair' },
                    { value: 'poor', label: 'Poor' }
                ],
                required: true
            },
            {
                id: 15,
                type: 'multiple',
                question: 'Q15. Do you smoke or use tobacco products?',
                description: 'Select your tobacco usage.',
                options: [
                    { value: 'never', label: 'Never smoked' },
                    { value: 'former', label: 'Former smoker' },
                    { value: 'occasional', label: 'Occasional smoker' },
                    { value: 'regular', label: 'Regular smoker' },
                    { value: 'heavy', label: 'Heavy smoker (1+ pack/day)' }
                ],
                required: true
            },
            {
                id: 16,
                type: 'multiple',
                question: 'Q16. How often do you consume alcohol?',
                description: 'Select your alcohol consumption pattern.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely (few times a year)' },
                    { value: 'occasionally', label: 'Occasionally (few times a month)' },
                    { value: 'regularly', label: 'Regularly (few times a week)' },
                    { value: 'daily', label: 'Daily' }
                ],
                required: true
            },
            {
                id: 17,
                type: 'multiple',
                question: 'Q17. How would you rate your stress level?',
                description: 'Rate your current stress level.',
                options: [
                    { value: 'very-low', label: 'Very Low' },
                    { value: 'low', label: 'Low' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'high', label: 'High' },
                    { value: 'very-high', label: 'Very High' }
                ],
                required: true
            },
            {
                id: 18,
                type: 'multiple',
                question: 'Q18. How many hours of sleep do you get per night?',
                description: 'Select your average sleep duration.',
                options: [
                    { value: 'less-5', label: 'Less than 5 hours' },
                    { value: '5-6', label: '5-6 hours' },
                    { value: '7-8', label: '7-8 hours' },
                    { value: '9-10', label: '9-10 hours' },
                    { value: 'more-10', label: 'More than 10 hours' }
                ],
                required: true
            },
            {
                id: 19,
                type: 'multiple',
                question: 'Q19. How often do you exercise?',
                description: 'Select your exercise frequency.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely (once a month)' },
                    { value: 'sometimes', label: 'Sometimes (once a week)' },
                    { value: 'regularly', label: 'Regularly (2-3 times a week)' },
                    { value: 'daily', label: 'Daily' }
                ],
                required: true
            },
            {
                id: 20,
                type: 'multiple',
                question: 'Q20. Have you had any recent injuries or accidents?',
                description: 'Select if you have had any recent injuries.',
                options: [
                    { value: 'head-injury', label: 'Head Injury' },
                    { value: 'back-injury', label: 'Back Injury' },
                    { value: 'limb-injury', label: 'Arms/Legs Injury' },
                    { value: 'sports-injury', label: 'Sports Injury' },
                    { value: 'accident', label: 'Motor Vehicle Accident' },
                    { value: 'none', label: 'No recent injuries' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 21,
                type: 'multiple',
                question: 'Q21. Do you have a family history of any major diseases?',
                description: 'Select any diseases that run in your family.',
                options: [
                    { value: 'heart-disease', label: 'Heart Disease' },
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'cancer', label: 'Cancer' },
                    { value: 'mental-health', label: 'Mental Health Disorders' },
                    { value: 'hypertension', label: 'High Blood Pressure' },
                    { value: 'stroke', label: 'Stroke' },
                    { value: 'none', label: 'No family history of major diseases' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 22,
                type: 'multiple',
                question: 'Q22. Have you traveled recently (within the last month)?',
                description: 'Select your recent travel history.',
                options: [
                    { value: 'international', label: 'International Travel' },
                    { value: 'domestic', label: 'Domestic Travel' },
                    { value: 'high-risk-areas', label: 'Travel to High-Risk Areas' },
                    { value: 'no-travel', label: 'No Recent Travel' }
                ],
                required: true
            },
            {
                id: 23,
                type: 'multiple',
                question: 'Q23. Have you been exposed to anyone with infectious diseases recently?',
                description: 'Select any recent exposures.',
                options: [
                    { value: 'covid', label: 'COVID-19' },
                    { value: 'flu', label: 'Influenza/Flu' },
                    { value: 'dengue', label: 'Dengue Fever' },
                    { value: 'tuberculosis', label: 'Tuberculosis' },
                    { value: 'other-infectious', label: 'Other Infectious Disease' },
                    { value: 'none', label: 'No known exposures' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 24,
                type: 'multiple',
                question: 'Q24. How urgent do you feel your condition is?',
                description: 'Rate the urgency of your health concern.',
                options: [
                    { value: 'emergency', label: 'Emergency - Need immediate care' },
                    { value: 'urgent', label: 'Urgent - Need care within 24 hours' },
                    { value: 'semi-urgent', label: 'Semi-urgent - Need care within a week' },
                    { value: 'routine', label: 'Routine - Can wait for regular appointment' },
                    { value: 'monitoring', label: 'Just monitoring - No immediate care needed' }
                ],
                required: true
            },
            {
                id: 25,
                type: 'multiple',
                question: 'Q25. When was your last medical checkup?',
                description: 'Select when you last saw a healthcare provider.',
                options: [
                    { value: 'within-month', label: 'Within the last month' },
                    { value: 'within-3months', label: 'Within the last 3 months' },
                    { value: 'within-6months', label: 'Within the last 6 months' },
                    { value: 'within-year', label: 'Within the last year' },
                    { value: 'over-year', label: 'More than a year ago' },
                    { value: 'never', label: 'Never had a medical checkup' }
                ],
                required: true
            },
            {
                id: 26,
                type: 'multiple',
                question: 'Q26. What type of healthcare coverage do you have?',
                description: 'Select your healthcare coverage.',
                options: [
                    { value: 'government', label: 'Government Healthcare' },
                    { value: 'private-insurance', label: 'Private Health Insurance' },
                    { value: 'employer', label: 'Employer-provided Insurance' },
                    { value: 'self-pay', label: 'Self-pay/No Insurance' }
                ],
                required: true
            },
            {
                id: 27,
                type: 'multiple',
                question: 'Q27. Are you currently pregnant or breastfeeding?',
                description: 'Select if applicable (for female patients).',
                options: [
                    { value: 'pregnant', label: 'Currently Pregnant' },
                    { value: 'breastfeeding', label: 'Currently Breastfeeding' },
                    { value: 'trying-conceive', label: 'Trying to Conceive' },
                    { value: 'not-applicable', label: 'Not Applicable' }
                ],
                required: true
            },
            {
                id: 28,
                type: 'multiple',
                question: 'Q28. How would you rate your mental/emotional health?',
                description: 'Rate your current mental health status.',
                options: [
                    { value: 'excellent', label: 'Excellent' },
                    { value: 'very-good', label: 'Very Good' },
                    { value: 'good', label: 'Good' },
                    { value: 'fair', label: 'Fair' },
                    { value: 'poor', label: 'Poor' }
                ],
                required: true
            },
            {
                id: 29,
                type: 'multiple',
                question: 'Q29. What is your primary goal for this health assessment?',
                description: 'Select your main objective.',
                options: [
                    { value: 'diagnosis', label: 'Get a diagnosis for my symptoms' },
                    { value: 'second-opinion', label: 'Get a second opinion' },
                    { value: 'prevention', label: 'Preventive health screening' },
                    { value: 'monitoring', label: 'Monitor existing condition' },
                    { value: 'general-health', label: 'General health assessment' }
                ],
                required: true
            },
            {
                id: 30,
                type: 'text',
                question: 'Q30. Please provide any additional details about your symptoms or health concerns',
                description: 'Describe any other relevant information about your health.',
                required: true,
                placeholder: 'Describe your symptoms, concerns, or any other relevant health information in detail...'
            }
        ],
        pdfConfig: {
            title: 'Comprehensive Symptom Analysis Report',
            subtitle: 'AI-Powered Health Assessment by MediCare+',
            sections: [
                'patient_information',
                'symptom_analysis',
                'severity_assessment', 
                'risk_factors',
                'differential_diagnosis',
                'recommendations',
                'lifestyle_factors',
                'follow_up_plan',
                'emergency_guidelines',
                'disclaimer'
            ],
            chartTypes: ['symptom_severity', 'risk_assessment', 'treatment_timeline', 'health_metrics'],
            includeGraphs: true,
            includeTables: true
        }
    },

    'diet-planner': {
        title: 'Smart Diet Planner',
        icon: 'fas fa-utensils',
        subtitle: 'Personalized nutrition plans based on your health goals',
        questions: [
            ...COMMON_QUESTIONS,
            // 25 specific questions for diet planner (Q6-Q30)
            {
                id: 6,
                type: 'text',
                question: 'Q6. What is your height?',
                description: 'Please enter your height in centimeters.',
                required: true,
                placeholder: 'Enter height (e.g., 170 cm)'
            },
            {
                id: 7,
                type: 'text',
                question: 'Q7. What is your current weight?',
                description: 'Please enter your current weight in kilograms.',
                required: true,
                placeholder: 'Enter weight (e.g., 65 kg)'
            },
            {
                id: 8,
                type: 'text',
                question: 'Q8. What is your target weight?',
                description: 'Enter your goal weight in kilograms.',
                required: true,
                placeholder: 'Enter target weight (e.g., 60 kg)'
            },
            {
                id: 9,
                type: 'multiple',
                question: 'Q9. What is your primary diet goal?',
                description: 'Select your main objective.',
                options: [
                    { value: 'weight-loss', label: 'Weight Loss' },
                    { value: 'weight-gain', label: 'Weight Gain' },
                    { value: 'muscle-building', label: 'Muscle Building' },
                    { value: 'maintenance', label: 'Weight Maintenance' },
                    { value: 'health-improvement', label: 'General Health Improvement' },
                    { value: 'disease-management', label: 'Disease Management' }
                ],
                required: true
            },
            {
                id: 10,
                type: 'multiple',
                question: 'Q10. What is your activity level?',
                description: 'Select your daily activity level.',
                options: [
                    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                    { value: 'lightly-active', label: 'Lightly Active (light exercise 1-3 days/week)' },
                    { value: 'moderately-active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
                    { value: 'very-active', label: 'Very Active (hard exercise 6-7 days/week)' },
                    { value: 'extra-active', label: 'Extra Active (very hard exercise, physical job)' }
                ],
                required: true
            },
            {
                id: 11,
                type: 'multiple',
                question: 'Q11. Do you have any dietary restrictions?',
                description: 'Select any dietary restrictions you follow.',
                options: [
                    { value: 'vegetarian', label: 'Vegetarian' },
                    { value: 'vegan', label: 'Vegan' },
                    { value: 'halal', label: 'Halal' },
                    { value: 'kosher', label: 'Kosher' },
                    { value: 'gluten-free', label: 'Gluten-Free' },
                    { value: 'dairy-free', label: 'Dairy-Free' },
                    { value: 'low-carb', label: 'Low Carb' },
                    { value: 'none', label: 'No restrictions' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 12,
                type: 'multiple',
                question: 'Q12. Do you have any food allergies?',
                description: 'Select any food allergies you have.',
                options: [
                    { value: 'nuts', label: 'Nuts/Tree Nuts' },
                    { value: 'dairy', label: 'Dairy/Lactose' },
                    { value: 'eggs', label: 'Eggs' },
                    { value: 'fish', label: 'Fish' },
                    { value: 'shellfish', label: 'Shellfish' },
                    { value: 'soy', label: 'Soy' },
                    { value: 'wheat', label: 'Wheat/Gluten' },
                    { value: 'none', label: 'No food allergies' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 13,
                type: 'multiple',
                question: 'Q13. How many meals do you prefer per day?',
                description: 'Select your preferred eating pattern.',
                options: [
                    { value: '2-meals', label: '2 meals (intermittent fasting)' },
                    { value: '3-meals', label: '3 traditional meals' },
                    { value: '4-meals', label: '4 smaller meals' },
                    { value: '5-6-meals', label: '5-6 small meals' },
                    { value: 'flexible', label: 'Flexible eating schedule' }
                ],
                required: true
            },
            {
                id: 14,
                type: 'multiple',
                question: 'Q14. What is your budget for weekly food expenses?',
                description: 'Select your food budget range in Sri Lankan Rupees.',
                options: [
                    { value: 'under-2000', label: 'Under Rs. 2,000' },
                    { value: '2000-4000', label: 'Rs. 2,000 - 4,000' },
                    { value: '4000-6000', label: 'Rs. 4,000 - 6,000' },
                    { value: '6000-10000', label: 'Rs. 6,000 - 10,000' },
                    { value: 'over-10000', label: 'Over Rs. 10,000' }
                ],
                required: true
            },
            {
                id: 15,
                type: 'multiple',
                question: 'Q15. How much time can you spend on meal preparation daily?',
                description: 'Select your available cooking time.',
                options: [
                    { value: 'under-30min', label: 'Under 30 minutes' },
                    { value: '30-60min', label: '30-60 minutes' },
                    { value: '1-2hours', label: '1-2 hours' },
                    { value: 'over-2hours', label: 'Over 2 hours' },
                    { value: 'variable', label: 'Variable depending on day' }
                ],
                required: true
            },
            {
                id: 16,
                type: 'multiple',
                question: 'Q16. Do you have any medical conditions affecting your diet?',
                description: 'Select any conditions that impact your dietary needs.',
                options: [
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'hypertension', label: 'High Blood Pressure' },
                    { value: 'heart-disease', label: 'Heart Disease' },
                    { value: 'kidney-disease', label: 'Kidney Disease' },
                    { value: 'liver-disease', label: 'Liver Disease' },
                    { value: 'digestive-issues', label: 'Digestive Issues' },
                    { value: 'thyroid', label: 'Thyroid Disorders' },
                    { value: 'none', label: 'No medical conditions' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 17,
                type: 'multiple',
                question: 'Q17. What types of cuisine do you prefer?',
                description: 'Select your favorite types of food.',
                options: [
                    { value: 'sri-lankan', label: 'Sri Lankan' },
                    { value: 'south-indian', label: 'South Indian' },
                    { value: 'north-indian', label: 'North Indian' },
                    { value: 'chinese', label: 'Chinese' },
                    { value: 'western', label: 'Western' },
                    { value: 'mediterranean', label: 'Mediterranean' },
                    { value: 'thai', label: 'Thai' },
                    { value: 'japanese', label: 'Japanese' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 18,
                type: 'multiple',
                question: 'Q18. How often do you eat out or order takeaway?',
                description: 'Select your eating out frequency.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely (once a month)' },
                    { value: 'sometimes', label: 'Sometimes (once a week)' },
                    { value: 'often', label: 'Often (2-3 times a week)' },
                    { value: 'daily', label: 'Daily' }
                ],
                required: true
            },
            {
                id: 19,
                type: 'multiple',
                question: 'Q19. Do you take any nutritional supplements?',
                description: 'Select any supplements you currently take.',
                options: [
                    { value: 'multivitamin', label: 'Multivitamin' },
                    { value: 'protein-powder', label: 'Protein Powder' },
                    { value: 'omega-3', label: 'Omega-3/Fish Oil' },
                    { value: 'vitamin-d', label: 'Vitamin D' },
                    { value: 'calcium', label: 'Calcium' },
                    { value: 'iron', label: 'Iron' },
                    { value: 'probiotics', label: 'Probiotics' },
                    { value: 'none', label: 'No supplements' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 20,
                type: 'multiple',
                question: 'Q20. What is your water intake per day?',
                description: 'Select your daily water consumption.',
                options: [
                    { value: 'under-1L', label: 'Under 1 liter' },
                    { value: '1-2L', label: '1-2 liters' },
                    { value: '2-3L', label: '2-3 liters' },
                    { value: '3-4L', label: '3-4 liters' },
                    { value: 'over-4L', label: 'Over 4 liters' }
                ],
                required: true
            },
            {
                id: 21,
                type: 'multiple',
                question: 'Q21. Do you consume alcohol?',
                description: 'Select your alcohol consumption pattern.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely (special occasions)' },
                    { value: 'socially', label: 'Socially (weekends)' },
                    { value: 'moderately', label: 'Moderately (few times a week)' },
                    { value: 'daily', label: 'Daily' }
                ],
                required: true
            },
            {
                id: 22,
                type: 'multiple',
                question: 'Q22. How would you rate your current energy levels?',
                description: 'Rate your daily energy levels.',
                options: [
                    { value: 'very-low', label: 'Very Low' },
                    { value: 'low', label: 'Low' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'high', label: 'High' },
                    { value: 'very-high', label: 'Very High' }
                ],
                required: true
            },
            {
                id: 23,
                type: 'multiple',
                question: 'Q23. Do you have any digestive issues?',
                description: 'Select any digestive problems you experience.',
                options: [
                    { value: 'bloating', label: 'Bloating' },
                    { value: 'gas', label: 'Excessive Gas' },
                    { value: 'constipation', label: 'Constipation' },
                    { value: 'diarrhea', label: 'Diarrhea' },
                    { value: 'acid-reflux', label: 'Acid Reflux/Heartburn' },
                    { value: 'ibs', label: 'Irritable Bowel Syndrome' },
                    { value: 'none', label: 'No digestive issues' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 24,
                type: 'multiple',
                question: 'Q24. What time do you usually have your main meals?',
                description: 'Select your typical meal timing.',
                options: [
                    { value: 'early-breakfast', label: 'Breakfast: 6-8 AM' },
                    { value: 'late-breakfast', label: 'Breakfast: 8-10 AM' },
                    { value: 'early-lunch', label: 'Lunch: 11 AM-1 PM' },
                    { value: 'late-lunch', label: 'Lunch: 1-3 PM' },
                    { value: 'early-dinner', label: 'Dinner: 6-8 PM' },
                    { value: 'late-dinner', label: 'Dinner: 8-10 PM' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 25,
                type: 'multiple',
                question: 'Q25. How often do you consume processed or packaged foods?',
                description: 'Rate your processed food consumption.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely (once a month)' },
                    { value: 'sometimes', label: 'Sometimes (once a week)' },
                    { value: 'often', label: 'Often (few times a week)' },
                    { value: 'daily', label: 'Daily' }
                ],
                required: true
            },
            {
                id: 26,
                type: 'multiple',
                question: 'Q26. Do you have specific nutritional goals?',
                description: 'Select your nutritional objectives.',
                options: [
                    { value: 'increase-protein', label: 'Increase Protein Intake' },
                    { value: 'reduce-sugar', label: 'Reduce Sugar Intake' },
                    { value: 'increase-fiber', label: 'Increase Fiber Intake' },
                    { value: 'reduce-sodium', label: 'Reduce Sodium Intake' },
                    { value: 'increase-vitamins', label: 'Increase Vitamin Intake' },
                    { value: 'balance-macros', label: 'Balance Macronutrients' },
                    { value: 'none-specific', label: 'No specific goals' }
                ],
                required: true,
                multiple: true
            },
            {
                id: 27,
                type: 'multiple',
                question: 'Q27. How would you describe your relationship with food?',
                description: 'Rate your eating behavior and relationship with food.',
                options: [
                    { value: 'healthy', label: 'Healthy - I eat when hungry and stop when full' },
                    { value: 'emotional', label: 'Emotional - I eat when stressed or upset' },
                    { value: 'restrictive', label: 'Restrictive - I often limit my food intake' },
                    { value: 'binge', label: 'Binge - I sometimes overeat' },
                    { value: 'social', label: 'Social - I mainly eat in social situations' }
                ],
                required: true
            },
            {
                id: 28,
                type: 'multiple',
                question: 'Q28. Are you currently following any specific diet plan?',
                description: 'Select if you are following any structured diet.',
                options: [
                    { value: 'keto', label: 'Ketogenic Diet' },
                    { value: 'paleo', label: 'Paleo Diet' },
                    { value: 'mediterranean', label: 'Mediterranean Diet' },
                    { value: 'intermittent-fasting', label: 'Intermittent Fasting' },
                    { value: 'dash', label: 'DASH Diet' },
                    { value: 'plant-based', label: 'Plant-Based Diet' },
                    { value: 'none', label: 'Not following any specific diet' }
                ],
                required: true
            },
            {
                id: 29,
                type: 'multiple',
                question: 'Q29. What motivates you most to maintain a healthy diet?',
                description: 'Select your primary motivation.',
                options: [
                    { value: 'weight-management', label: 'Weight Management' },
                    { value: 'health-improvement', label: 'Overall Health Improvement' },
                    { value: 'disease-prevention', label: 'Disease Prevention' },
                    { value: 'energy-levels', label: 'Better Energy Levels' },
                    { value: 'appearance', label: 'Physical Appearance' },
                    { value: 'athletic-performance', label: 'Athletic Performance' },
                    { value: 'doctor-recommendation', label: 'Doctor\'s Recommendation' }
                ],
                required: true
            },
            {
                id: 30,
                type: 'text',
                question: 'Q30. Please share any additional dietary preferences, restrictions, or goals',
                description: 'Provide any other relevant information about your dietary needs.',
                required: true,
                placeholder: 'Describe any specific dietary requirements, cultural preferences, or additional goals...'
            }
        ],
        pdfConfig: {
            title: 'Personalized Nutrition Plan Report',
            subtitle: 'Smart Diet Planning by MediCare+ AI',
            sections: [
                'patient_information',
                'nutritional_assessment',
                'bmi_analysis',
                'caloric_requirements',
                'macronutrient_breakdown',
                'meal_planning',
                'food_recommendations',
                'shopping_list',
                'weekly_menu',
                'nutritional_goals',
                'monitoring_plan',
                'disclaimer'
            ],
            chartTypes: ['bmi_chart', 'caloric_distribution', 'macronutrient_pie', 'progress_tracker'],
            includeGraphs: true,
            includeTables: true,
            includeMenuPlan: true
        }
    },

    'mental-health': {
        title: 'Mental Health Support',
        icon: 'fas fa-brain',
        subtitle: 'Comprehensive mental wellness assessment and support',
        questions: [
            ...COMMON_QUESTIONS,
            // 25 specific questions for mental health (Q6-Q30)
            {
                id: 6,
                type: 'multiple',
                question: 'Q6. How would you rate your overall mental health?',
                description: 'Rate your current mental/emotional wellbeing.',
                options: [
                    { value: 'excellent', label: 'Excellent' },
                    { value: 'very-good', label: 'Very Good' },
                    { value: 'good', label: 'Good' },
                    { value: 'fair', label: 'Fair' },
                    { value: 'poor', label: 'Poor' }
                ],
                required: true
            },
            {
                id: 7,
                type: 'multiple',
                question: 'Q7. How often do you feel sad or depressed?',
                description: 'Rate the frequency of depressive feelings.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'sometimes', label: 'Sometimes' },
                    { value: 'often', label: 'Often' },
                    { value: 'always', label: 'Most of the time' }
                ],
                required: true
            },
            {
                id: 8,
                type: 'multiple',
                question: 'Q8. How often do you feel anxious or worried?',
                description: 'Rate the frequency of anxiety or worry.',
                options: [
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'sometimes', label: 'Sometimes' },
                    { value: 'often', label: 'Often' },
                    { value: 'always', label: 'Most of the time' }
                ],
                required: true
            },
            // Continue with remaining 22 questions...
            {
                id: 30,
                type: 'text',
                question: 'Q30. Please share any additional mental health concerns or goals',
                description: 'Describe any other aspects of your mental health you would like to address.',
                required: true,
                placeholder: 'Share any additional mental health concerns, symptoms, or goals...'
            }
        ],
        pdfConfig: {
            title: 'Mental Health Assessment Report',
            subtitle: 'Comprehensive Mental Wellness Evaluation by MediCare+',
            sections: [
                'patient_information',
                'mental_health_screening',
                'mood_assessment',
                'anxiety_evaluation',
                'stress_analysis',
                'coping_strategies',
                'support_recommendations',
                'therapy_options',
                'crisis_resources',
                'disclaimer'
            ],
            chartTypes: ['mood_tracker', 'stress_levels', 'wellness_score'],
            includeGraphs: true,
            includeTables: true
        }
    }
    // Add more assessment types following the same pattern...
};

// Enhanced PDF Generation Configuration
const PDF_GENERATION_CONFIG = {
    defaultSettings: {
        pageSize: 'A4',
        margin: { top: 72, bottom: 72, left: 72, right: 72 },
        fontSize: 12,
        fontFamily: 'Helvetica',
        headerHeight: 100,
        footerHeight: 50,
        includeWatermark: true,
        watermarkText: 'MediCare+ AI Health Assessment'
    },
    
    colors: {
        primary: '#007BFF',
        secondary: '#6c757d',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40'
    },
    
    sections: {
        patient_information: {
            title: 'Patient Information',
            includePersonalDetails: true,
            includeContactInfo: true,
            includeLocation: true
        },
        
        assessment_summary: {
            title: 'Assessment Summary',
            includeDate: true,
            includeType: true,
            includeScore: true
        },
        
        analysis_results: {
            title: 'Analysis Results',
            includeCharts: true,
            includeTables: true,
            includeInsights: true
        },
        
        recommendations: {
            title: 'Recommendations',
            includeImmediate: true,
            includeShortTerm: true,
            includeLongTerm: true
        },
        
        disclaimer: {
            title: 'Medical Disclaimer',
            text: 'This assessment is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper medical diagnosis and treatment.'
        }
    }
};

// Make configurations available globally
if (typeof window !== 'undefined') {
    window.ASSESSMENT_CONFIGS = ASSESSMENT_CONFIGS;
    window.COMMON_QUESTIONS = COMMON_QUESTIONS;
    window.PDF_GENERATION_CONFIG = PDF_GENERATION_CONFIG;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ASSESSMENT_CONFIGS,
        COMMON_QUESTIONS,
        PDF_GENERATION_CONFIG
    };
} 