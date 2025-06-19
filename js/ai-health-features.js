// AI Health Features Configuration for MediCare+ with DeepSeek Integration
// Complete feature set with question analysis and response formats

const AI_HEALTH_FEATURES = {
    // 🧠 1. AI Diet Planner
    dietPlanner: {
        id: 'diet_planner',
        name: 'AI Diet Planner',
        icon: '🍎',
        description: 'Personalized meal plans based on health goals, dietary restrictions, and preferences',
        duration: '8 min',
        accuracy: '95%',
        
        multiPartQuestions: [
            "What is your primary health goal? (weight loss, muscle gain, maintenance, disease management)",
            "Do you have any dietary restrictions? (vegan, vegetarian, gluten-free, dairy-free, keto, etc.)",
            "Are you currently following any specific diet plan? (Intermittent Fasting, Low-carb, Mediterranean, etc.)",
            "How many meals do you typically eat per day? (Include snacks and timing preferences)",
            "What foods do you absolutely dislike or avoid? (List specific foods, cuisines, or ingredients)",
            "Do you have any diagnosed health conditions? (diabetes, hypertension, cholesterol, thyroid, etc.)",
            "How often do you eat out or order takeaway food per week?",
            "Describe your typical current meals (breakfast, lunch, dinner examples)",
            "What's your daily water intake? (glasses, bottles, or liters)",
            "Do you consume caffeine or alcohol regularly? (coffee, tea, wine, beer - frequency and quantity)",
            "Are you currently taking any supplements? (vitamins, protein powder, minerals - list all)",
            "What's your physical activity level? (sedentary, light exercise, moderate, intense training)",
            "Do you currently track calories or macros? (apps used, consistency, goals)",
            "Do you prefer simple quick meals or are you okay with cooking recipes?",
            "What's your approximate monthly grocery budget for food?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "18-100" },
            { question: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { question: "Height", type: "number", unit: "cm", range: "120-220" },
            { question: "Weight", type: "number", unit: "kg", range: "30-200" },
            { question: "Allergies", type: "text", placeholder: "List main allergies" }
        ],
        
        deepSeekResponse: {
            outputFormat: "structured_meal_plan",
            responseStructure: {
                weeklyPlan: "7-day detailed meal plan with recipes",
                nutritionalBreakdown: "Daily calories, macros (protein, carbs, fats), micronutrients",
                mealTiming: "Optimal eating schedule based on goals and lifestyle",
                shoppingList: "Organized grocery list by categories",
                alternatives: "Substitute options for dietary restrictions",
                progressTracking: "Weekly adjustment recommendations"
            },
            aiBehaviorFocus: "Goal-oriented meal optimization",
            personalizationDepth: "Very High",
            specialFeatures: [
                "Cultural cuisine adaptation",
                "Budget-conscious options",
                "Meal prep suggestions",
                "Restaurant ordering guidance"
            ]
        }
    },

    // 💊 2. AI Symptom Checker
    symptomChecker: {
        id: 'symptom_checker',
        name: 'AI Symptom Checker',
        icon: '🩺',
        description: 'Analyze symptoms and suggest possible causes with urgency assessment',
        duration: '5 min',
        accuracy: '92%',
        
        multiPartQuestions: [
            "What specific symptoms are you experiencing right now? (describe in detail)",
            "When did these symptoms first start? (exact date/time if possible)",
            "Are the symptoms getting worse, staying the same, or improving over time?",
            "Are the symptoms constant or do they come and go? (pattern description)",
            "Are the symptoms linked to specific times, activities, or situations?",
            "What makes the symptoms better or worse? (position, food, medication, rest, etc.)",
            "Are you experiencing any pain? If yes, where and how severe? (scale 1-10)",
            "Do you have any previously diagnosed health conditions or chronic illnesses?",
            "Are you currently taking any medications, supplements, or treatments?",
            "Have you had any recent injuries, infections, surgeries, or medical procedures?",
            "Have you experienced these exact symptoms before? When and what helped?",
            "Are you experiencing fever, fatigue, unusual tiredness, or skin changes?",
            "Are other body systems affected? (breathing, digestion, urination, vision, etc.)",
            "Have you traveled recently or been exposed to anyone who was sick?",
            "Is there anything else unusual happening with your body or health lately?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "0-120" },
            { question: "Sex", type: "select", options: ["Male", "Female"] },
            { question: "Temperature", type: "number", unit: "°F", range: "95-110" },
            { question: "Pain_Level", type: "slider", range: "0-10", labels: ["No pain", "Severe"] },
            { question: "Duration", type: "select", options: ["Hours", "Days", "Weeks", "Months"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "diagnostic_assessment",
            responseStructure: {
                likelyCauses: "Top 3-5 possible conditions with confidence percentages",
                urgencyLevel: "Self-care / See doctor / Emergency with color coding",
                recommendedActions: "Immediate steps and timeline for medical care",
                redFlags: "Warning signs that require immediate attention",
                specialistReferral: "Type of doctor to see if needed",
                followUpQuestions: "Additional symptoms to monitor"
            },
            aiBehaviorFocus: "Medical safety and diagnostic reasoning",
            personalizationDepth: "High",
            specialFeatures: [
                "Emergency triage system",
                "Symptom severity tracking",
                "Medical history integration",
                "Telehealth connection options"
            ]
        }
    },

    // 🧬 3. AI Medicine Advisor
    medicineAdvisor: {
        id: 'medicine_advisor', 
        name: 'AI Medicine Advisor',
        icon: '💊',
        description: 'Safe medication suggestions with interaction checking and dosage guidance',
        duration: '6 min',
        accuracy: '94%',
        
        multiPartQuestions: [
            "What condition or symptoms are you trying to treat with medication?",
            "What medications are you currently taking? (include prescription, OTC, supplements)",
            "Have you experienced any side effects from medications in the past? Which ones?",
            "Are you allergic to any medications, ingredients, or substances?",
            "Do you have a preference for medication type? (pills, liquids, topical, natural remedies)",
            "Do you have any chronic health conditions? (heart disease, liver/kidney issues, etc.)",
            "What is your current daily medication routine and timing?",
            "Have you had any recent blood tests or medical examinations? Results?",
            "Have you already seen a doctor about this condition? What was recommended?",
            "How long have you been dealing with this health issue?",
            "Are there any medications you specifically want to avoid? Why?",
            "Describe your daily routine (meal times, sleep schedule, work schedule)",
            "Do you have any liver, kidney, or heart problems that affect medication processing?",
            "Are you pregnant, breastfeeding, or planning to become pregnant?",
            "What over-the-counter or herbal supplements do you regularly use?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "0-120" },
            { question: "Weight", type: "number", unit: "kg", range: "3-300" },
            { question: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { question: "Allergies", type: "text", placeholder: "Primary drug allergies" },
            { question: "Dosage_Preference", type: "select", options: ["Low", "Standard", "Maximum"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "medication_recommendations",
            responseStructure: {
                recommendedMedications: "Safe options by category (OTC, prescription, natural)",
                dosageInstructions: "Specific dosing, timing, and duration",
                interactionWarnings: "Drug interactions and contraindications",
                sideEffectProfile: "Common and serious side effects to watch for",
                monitoringNeeded: "What to track while taking medication",
                alternatives: "Non-medication treatment options"
            },
            aiBehaviorFocus: "Medical safety and evidence-based recommendations",
            personalizationDepth: "Very High",
            specialFeatures: [
                "Drug interaction database",
                "Age-appropriate dosing",
                "Pregnancy/breastfeeding safety",
                "Cost-effective alternatives"
            ]
        }
    },

    // 📊 4. AI Health Report
    healthReport: {
        id: 'health_report',
        name: 'AI Health Report',
        icon: '📈',
        description: 'Comprehensive health analysis with personalized improvement recommendations',
        duration: '12 min',
        accuracy: '96%',
        
        multiPartQuestions: [
            "What is your family medical history? (parents, siblings, grandparents - major conditions)",
            "How would you rate your overall health today on a scale of 1-10? Explain why.",
            "How often do you get regular medical checkups and preventive screenings?",
            "What's your average sleep duration and quality? Any sleep issues?",
            "Describe your exercise routine and physical activity level throughout the week",
            "Do you use tobacco, smoke, or use any recreational substances? Frequency?",
            "What's your stress level and how do you manage stress? Major stressors?",
            "Describe your job and daily activity level (sedentary, active, physical labor)",
            "How often do you eat fast food, processed foods, or restaurant meals?",
            "Do you regularly monitor vital signs? (blood pressure, heart rate, blood sugar)",
            "Have you ever been hospitalized or had major medical procedures? Details?",
            "What health areas concern you most or do you want to improve?",
            "Do you use fitness trackers, smartwatches, or health monitoring devices?",
            "Are your vaccinations up to date? Any recent health screenings?",
            "How satisfied are you with your current lifestyle and health habits?"
        ],
        
        singleWordQuestions: [
            { question: "Height", type: "number", unit: "cm", range: "100-250" },
            { question: "Weight", type: "number", unit: "kg", range: "20-300" },
            { question: "BP_Systolic", type: "number", unit: "mmHg", range: "70-250" },
            { question: "Resting_Pulse", type: "number", unit: "bpm", range: "40-200" },
            { question: "Age", type: "number", range: "0-120" }
        ],
        
        deepSeekResponse: {
            outputFormat: "comprehensive_health_assessment",
            responseStructure: {
                healthScore: "Overall health score (0-100) with category breakdown",
                riskAssessment: "Disease risk prediction for next 5-10 years",
                improvementAreas: "Top 5 priority areas with specific action items",
                actionPlan: "30-60-90 day structured improvement plan",
                biometricAnalysis: "BMI, cardiovascular risk, metabolic health",
                preventiveRecommendations: "Screening schedules and health maintenance"
            },
            aiBehaviorFocus: "Long-term health optimization and risk prevention",
            personalizationDepth: "Maximum",
            specialFeatures: [
                "Predictive health modeling",
                "Family history integration",
                "Lifestyle factor analysis",
                "Preventive care scheduling"
            ]
        }
    },

    // 🏃‍♂️ 5. AI Fitness Coach
    fitnessCoach: {
        id: 'fitness_coach',
        name: 'AI Fitness Coach',
        icon: '🏃‍♂️',
        description: 'Personalized workout plans based on fitness level, goals, and medical conditions',
        duration: '6 min',
        accuracy: '93%',
        
        multiPartQuestions: [
            "What are your primary fitness goals? (weight loss, muscle gain, endurance, strength, flexibility)",
            "What's your current activity level? (sedentary, beginner, intermediate, advanced athlete)",
            "Do you have any injuries, physical limitations, or medical conditions affecting exercise?",
            "What types of exercise do you enjoy or prefer? (cardio, weights, yoga, sports, etc.)",
            "How many days per week can you realistically commit to exercise?",
            "How much time per workout session do you have available?",
            "Do you have access to a gym, home equipment, or prefer bodyweight exercises?",
            "Have you worked with trainers before or followed structured programs?",
            "What's your exercise history? (sports background, previous programs, consistency)",
            "Do you have any specific areas you want to focus on or improve?",
            "What time of day do you prefer to exercise and why?",
            "How do you currently track your fitness progress? (apps, devices, measurements)",
            "What motivates you most to stay consistent with exercise?",
            "Do you prefer solo workouts or group/partner activities?",
            "What has prevented you from reaching fitness goals in the past?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "12-100" },
            { question: "Fitness_Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
            { question: "Weight", type: "number", unit: "kg", range: "30-200" },
            { question: "Height", type: "number", unit: "cm", range: "120-220" },
            { question: "Available_Days", type: "number", range: "1-7" }
        ],
        
        deepSeekResponse: {
            outputFormat: "personalized_fitness_program",
            responseStructure: {
                workoutPlan: "Weekly structured exercise routine with progressions",
                exerciseLibrary: "Detailed instructions, reps, sets, and modifications",
                progressTracking: "Metrics to monitor and milestone targets",
                nutritionTips: "Exercise-supporting dietary recommendations",
                recoveryPlan: "Rest day activities and injury prevention",
                adaptations: "Program modifications for different fitness levels"
            },
            aiBehaviorFocus: "Safe, progressive, and sustainable fitness development",
            personalizationDepth: "High",
            specialFeatures: [
                "Injury prevention protocols",
                "Equipment-free alternatives",
                "Progress photo analysis",
                "Motivation and habit building"
            ]
        }
    },

    // 🧠 6. Mental Health Checker
    mentalHealthChecker: {
        id: 'mental_health_checker',
        name: 'Mental Health Checker',
        icon: '🧠',
        description: 'Assessment for anxiety, stress, depression with supportive guidance and resources',
        duration: '4 min',
        accuracy: '91%',
        
        multiPartQuestions: [
            "How would you describe your mood over the past two weeks?",
            "Have you been feeling more anxious, worried, or stressed than usual lately?",
            "Are you experiencing changes in your sleep patterns? (difficulty falling asleep, waking up, oversleeping)",
            "How has your energy level and motivation been recently?",
            "Have you noticed changes in your appetite or eating patterns?",
            "Are you finding it harder to concentrate or make decisions than usual?",
            "Have you been feeling overwhelmed by daily tasks or responsibilities?",
            "Are you experiencing any physical symptoms? (headaches, muscle tension, stomach issues)",
            "How are your relationships with family, friends, or colleagues lately?",
            "Have you had thoughts of hurting yourself or that life isn't worth living?",
            "What major stressors or life changes are you currently dealing with?",
            "How do you typically cope with stress or difficult emotions?",
            "Are you currently receiving any mental health treatment or counseling?",
            "Have you experienced similar mental health challenges in the past?",
            "What support systems do you have available? (family, friends, professionals)"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "13-100" },
            { question: "Stress_Level", type: "slider", range: "1-10", labels: ["Very low", "Extremely high"] },
            { question: "Sleep_Hours", type: "number", range: "0-15" },
            { question: "Support_System", type: "select", options: ["Strong", "Moderate", "Limited", "None"] },
            { question: "Previous_Treatment", type: "select", options: ["Yes", "No", "Currently"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "mental_health_assessment",
            responseStructure: {
                riskAssessment: "Depression, anxiety, and stress level indicators",
                immediateSupport: "Crisis resources and emergency contacts",
                coping strategies: "Personalized stress management techniques",
                professionalHelp: "When and how to seek mental health services",
                selfCareplan: "Daily wellness activities and mood tracking",
                resources: "Apps, hotlines, and local mental health services"
            },
            aiBehaviorFocus: "Supportive, non-judgmental, and safety-focused",
            personalizationDepth: "High",
            specialFeatures: [
                "Crisis intervention protocols",
                "Mood tracking integration",
                "Therapist matching service",
                "Peer support community access"
            ]
        }
    },

    // 🌙 7. Sleep Quality Analyzer
    sleepAnalyzer: {
        id: 'sleep_analyzer',
        name: 'Sleep Quality Analyzer',
        icon: '🌙',
        description: 'Analyze sleep patterns and provide personalized improvement recommendations',
        duration: '3 min',
        accuracy: '90%',
        
        multiPartQuestions: [
            "What time do you typically go to bed and wake up on weekdays and weekends?",
            "How long does it usually take you to fall asleep after getting into bed?",
            "How many times do you typically wake up during the night?",
            "How would you rate your overall sleep quality? (refreshed vs. tired upon waking)",
            "Do you experience any specific sleep problems? (snoring, sleep apnea, restless legs, etc.)",
            "What's your bedtime routine? (activities in the hour before sleep)",
            "Describe your sleep environment (room temperature, darkness, noise level, mattress comfort)",
            "Do you use electronic devices before bed? (phones, tablets, TV, etc.)",
            "What do you consume in the evening? (caffeine, alcohol, large meals, water)",
            "Do you take naps during the day? How long and at what time?",
            "How does stress or anxiety affect your sleep patterns?",
            "Do you take any sleep aids, medications, or supplements?",
            "How has your sleep changed over the past few months or years?",
            "What factors seem to help or hurt your sleep quality?",
            "How does poor sleep affect your daily functioning and mood?"
        ],
        
        singleWordQuestions: [
            { question: "Bedtime", type: "time", format: "HH:MM" },
            { question: "Wake_Time", type: "time", format: "HH:MM" },
            { question: "Sleep_Duration", type: "number", unit: "hours", range: "2-15" },
            { question: "Quality_Rating", type: "slider", range: "1-10", labels: ["Very poor", "Excellent"] },
            { question: "Age", type: "number", range: "5-100" }
        ],
        
        deepSeekResponse: {
            outputFormat: "sleep_optimization_plan",
            responseStructure: {
                sleepAssessment: "Sleep quality score and pattern analysis",
                improvementPlan: "Personalized sleep hygiene recommendations",
                environmentOptimization: "Bedroom setup and atmosphere adjustments",
                routineDesign: "Optimal bedtime and morning routines",
                lifestyleFactors: "Diet, exercise, and timing recommendations",
                trackingTools: "Sleep monitoring methods and apps"
            },
            aiBehaviorFocus: "Evidence-based sleep science and behavioral change",
            personalizationDepth: "Medium-High",
            specialFeatures: [
                "Circadian rhythm optimization",
                "Sleep disorder screening",
                "Smart device integration",
                "Progress tracking dashboard"
            ]
        }
    },

    // 🔄 8. Chronic Condition Manager
    chronicConditionManager: {
        id: 'chronic_condition_manager',
        name: 'Chronic Condition Manager',
        icon: '🔄',
        description: 'Ongoing support for diabetes, hypertension, asthma, and other chronic conditions',
        duration: '10 min',
        accuracy: '94%',
        
        multiPartQuestions: [
            "What chronic condition(s) have you been diagnosed with? When were you diagnosed?",
            "What medications are you currently taking for your condition(s)? Dosages and timing?",
            "How often do you monitor your condition? (blood sugar, blood pressure, peak flow, etc.)",
            "What are your most recent lab results or vital sign measurements?",
            "How well controlled is your condition currently? Any recent changes or concerns?",
            "What symptoms do you experience regularly related to your condition?",
            "How does your condition affect your daily activities and quality of life?",
            "What triggers tend to worsen your condition? (stress, diet, weather, activity)",
            "How often do you see your doctor or specialist for this condition?",
            "What lifestyle modifications have you made to help manage your condition?",
            "Do you have any complications related to your chronic condition?",
            "How do you currently track and manage your symptoms and medications?",
            "What challenges do you face in managing your condition day-to-day?",
            "Do you have family history of the same or related conditions?",
            "What goals do you have for better managing your condition?"
        ],
        
        singleWordQuestions: [
            { question: "Primary_Condition", type: "select", options: ["Diabetes", "Hypertension", "Asthma", "Arthritis", "Other"] },
            { question: "Years_Diagnosed", type: "number", range: "0-50" },
            { question: "Control_Rating", type: "slider", range: "1-10", labels: ["Very poor", "Excellent"] },
            { question: "Age", type: "number", range: "18-100" },
            { question: "Medication_Count", type: "number", range: "0-20" }
        ],
        
        deepSeekResponse: {
            outputFormat: "chronic_care_plan",
            responseStructure: {
                managementPlan: "Personalized daily and weekly care routines",
                monitoringSchedule: "Tracking parameters and target ranges",
                medicationOptimization: "Adherence strategies and timing recommendations",
                lifestyleGuidance: "Diet, exercise, and stress management for condition",
                emergencyPlan: "When to seek immediate medical care",
                progressTracking: "Metrics to monitor improvement over time"
            },
            aiBehaviorFocus: "Long-term health maintenance and complication prevention",
            personalizationDepth: "Maximum",
            specialFeatures: [
                "Condition-specific dashboards",
                "Medication reminders",
                "Doctor visit preparation",
                "Complication risk assessment"
            ]
        }
    },

    // 🌸 9. Women's Health Assistant  
    womensHealthAssistant: {
        id: 'womens_health_assistant',
        name: "Women's Health Assistant",
        icon: '🌸',
        description: 'Specialized support for menstrual health, pregnancy, menopause, and hormonal balance',
        duration: '7 min',
        accuracy: '92%',
        
        multiPartQuestions: [
            "What is your current life stage? (reproductive years, trying to conceive, pregnant, postpartum, perimenopause, menopause)",
            "Tell me about your menstrual cycle (length, regularity, flow, symptoms)",
            "Are you currently using any form of birth control? What type?",
            "Have you been trying to conceive? How long? Any fertility concerns?",
            "Are you currently pregnant? What trimester? Any complications?",
            "Do you experience PMS or PMDD symptoms? Which ones and how severe?",
            "Are you experiencing any menopausal symptoms? (hot flashes, mood changes, sleep issues)",
            "Have you had any gynecological procedures or surgeries?",
            "Do you perform regular breast self-exams? When was your last mammogram/pap smear?",
            "Are you experiencing any hormonal symptoms? (acne, weight changes, mood swings, hair changes)",
            "How is your sexual health? Any concerns with intimacy or reproductive function?",
            "Do you have family history of breast cancer, ovarian cancer, or other women's health issues?",
            "Are you taking any hormones, supplements, or medications affecting reproductive health?",
            "How do you manage stress and its impact on your hormonal health?",
            "What women's health goals or concerns do you have currently?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "12-65" },
            { question: "Cycle_Length", type: "number", unit: "days", range: "21-45" },
            { question: "Pregnancies", type: "number", range: "0-20" },
            { question: "Life_Stage", type: "select", options: ["Reproductive", "Pregnant", "Postpartum", "Perimenopause", "Menopause"] },
            { question: "Contraception", type: "select", options: ["None", "Pill", "IUD", "Implant", "Barrier", "Other"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "womens_health_plan",
            responseStructure: {
                cycleTracking: "Menstrual cycle analysis and predictions",
                hormonalHealth: "Hormone balance assessment and optimization tips",
                reproductiveGuidance: "Fertility, pregnancy, or menopause support",
                preventiveCare: "Screening schedules and health maintenance",
                symptomManagement: "Natural and medical options for common issues",
                wellnessplan: "Nutrition, exercise, and lifestyle for hormonal health"
            },
            aiBehaviorFocus: "Sensitive, comprehensive women's health support",
            personalizationDepth: "Very High",
            specialFeatures: [
                "Cycle prediction algorithms",
                "Fertility window calculation",
                "Symptom pattern recognition",
                "Menopause transition support"
            ]
        }
    },

    // 🔮 10. AI Health Risk Predictor
    healthRiskPredictor: {
        id: 'health_risk_predictor',
        name: 'AI Health Risk Predictor',
        icon: '🔮',
        description: 'Predict future health risks using lifestyle and family history data with prevention planning',
        duration: '7 min',
        accuracy: '89%',
        
        multiPartQuestions: [
            "What is your complete family medical history? (parents, siblings, grandparents - all major conditions)",
            "Describe your current diet in detail (typical meals, frequency, portion sizes, food types)",
            "What is your exercise and physical activity routine? (type, frequency, intensity, duration)",
            "Do you have any current health conditions or take any medications regularly?",
            "What are your smoking, alcohol, and substance use habits? (current and past)",
            "Describe your stress levels and how you manage stress in your daily life",
            "What is your occupation and typical daily activity level?",
            "How is your sleep quality and duration? Any sleep disorders?",
            "What is your current weight history? (stable, gaining, losing, fluctuating)",
            "Have you had any major injuries, surgeries, or medical procedures?",
            "What preventive care do you currently receive? (checkups, screenings, vaccinations)",
            "How would you describe your mental health and emotional wellbeing?",
            "What environmental factors might affect your health? (pollution, chemicals, radiation exposure)",
            "Do you take any supplements or follow any alternative health practices?",
            "What health concerns run in your family that worry you most?"
        ],
        
        singleWordQuestions: [
            { question: "Age", type: "number", range: "18-100" },
            { question: "BMI", type: "number", range: "15-50" },
            { question: "Exercise_Hours", type: "number", unit: "hours/week", range: "0-20" },
            { question: "Stress_Level", type: "slider", range: "1-10", labels: ["Very low", "Extremely high"] },
            { question: "Family_Risk", type: "select", options: ["Low", "Moderate", "High", "Very High"] }
        ],
        
        deepSeekResponse: {
            outputFormat: "risk_assessment_report",
            responseStructure: {
                riskScoring: "Personalized risk scores for major health conditions (0-100%)",
                timelineProjections: "Risk evolution over 5, 10, and 20 year periods",
                preventionPlan: "Specific actions to reduce identified risks",
                screeningSchedule: "Recommended tests and monitoring based on risk profile",
                lifestyleModifications: "Priority changes for maximum risk reduction",
                geneticConsiderations: "Family history impact and genetic counseling recommendations"
            },
            aiBehaviorFocus: "Evidence-based risk modeling and prevention strategies",
            personalizationDepth: "Maximum",
            specialFeatures: [
                "Multi-factor risk algorithms",
                "Genetic risk integration",
                "Preventive intervention prioritization",
                "Risk tracking over time"
            ]
        }
    }
};

// DeepSeek AI Integration Configuration
const DEEPSEEK_CONFIG = {
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    responseFormats: {
        structured_meal_plan: 'Detailed weekly meal planning with nutritional analysis',
        diagnostic_assessment: 'Medical symptom analysis with urgency classification',  
        medication_recommendations: 'Safe medication suggestions with interaction checking',
        comprehensive_health_assessment: 'Full health scoring with improvement roadmap',
        personalized_fitness_program: 'Custom workout plans with progressive overload',
        mental_health_assessment: 'Psychological wellbeing evaluation with support resources',
        sleep_optimization_plan: 'Sleep quality improvement with behavior modification',
        chronic_care_plan: 'Long-term condition management with tracking protocols',
        womens_health_plan: 'Reproductive and hormonal health guidance',
        risk_assessment_report: 'Predictive health modeling with prevention strategies'
    }
};

// Export for use in other modules
export { AI_HEALTH_FEATURES, DEEPSEEK_CONFIG }; 