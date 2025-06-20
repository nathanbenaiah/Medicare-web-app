// Senior Health Care 30-Question Assessment
class SeniorCare30Q {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = this.generateSessionId();
        this.questions = this.getQuestions();
        this.totalQuestions = this.questions.length;
    }

    getQuestions() {
        return [
            { id: 1, type: 'number', question: "What is your age?", placeholder: "Enter your age in years" },
            { id: 2, type: 'multiple', question: "How would you rate your overall health?", options: ["Excellent", "Very good", "Good", "Fair", "Poor"] },
            { id: 3, type: 'checkbox', question: "What chronic conditions do you have?", options: ["None", "Arthritis", "Diabetes", "High blood pressure", "Heart disease", "Osteoporosis", "COPD", "Depression", "Memory problems"] },
            { id: 4, type: 'number', question: "How many prescription medications do you take?", placeholder: "Number of daily medications" },
            { id: 5, type: 'scale', question: "Rate your mobility/ability to get around (1-10)", min: 1, max: 10, labels: ["Very limited", "Fully mobile"] },
            { id: 6, type: 'checkbox', question: "What mobility aids do you use?", options: ["None", "Cane", "Walker", "Wheelchair", "Grab bars", "Stair lift", "Other assistive devices"] },
            { id: 7, type: 'scale', question: "Rate your balance/risk of falling (1-10)", min: 1, max: 10, labels: ["High fall risk", "Excellent balance"] },
            { id: 8, type: 'multiple', question: "Have you fallen in the past year?", options: ["No", "Once", "2-3 times", "4-5 times", "More than 5 times"] },
            { id: 9, type: 'scale', question: "Rate your memory and thinking abilities (1-10)", min: 1, max: 10, labels: ["Significant problems", "Sharp as ever"] },
            { id: 10, type: 'checkbox', question: "What cognitive concerns do you have?", options: ["None", "Memory lapses", "Confusion", "Difficulty concentrating", "Getting lost", "Word finding", "Decision making"] },
            { id: 11, type: 'scale', question: "Rate your vision (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 12, type: 'scale', question: "Rate your hearing (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 13, type: 'multiple', question: "When was your last eye exam?", options: ["Within 6 months", "6-12 months ago", "1-2 years ago", "More than 2 years ago", "Can't remember"] },
            { id: 14, type: 'multiple', question: "When was your last hearing test?", options: ["Within 6 months", "6-12 months ago", "1-2 years ago", "More than 2 years ago", "Never had one"] },
            { id: 15, type: 'multiple', question: "How independent are you with daily activities?", options: ["Completely independent", "Mostly independent", "Need some help", "Need significant help", "Fully dependent"] },
            { id: 16, type: 'checkbox', question: "What activities do you need help with?", options: ["None", "Bathing", "Dressing", "Cooking", "Cleaning", "Shopping", "Transportation", "Managing medications"] },
            { id: 17, type: 'scale', question: "Rate your energy levels (1-10)", min: 1, max: 10, labels: ["Very low", "Very high"] },
            { id: 18, type: 'scale', question: "Rate your sleep quality (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 19, type: 'checkbox', question: "What sleep problems do you experience?", options: ["None", "Difficulty falling asleep", "Frequent waking", "Early morning waking", "Restless legs", "Sleep apnea", "Nightmares"] },
            { id: 20, type: 'multiple', question: "How often do you feel sad or depressed?", options: ["Never", "Rarely", "Sometimes", "Often", "Most of the time"] },
            { id: 21, type: 'scale', question: "Rate your social connections (1-10)", min: 1, max: 10, labels: ["Very isolated", "Very social"] },
            { id: 22, type: 'multiple', question: "How often do you interact with others?", options: ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely"] },
            { id: 23, type: 'multiple', question: "Do you live alone?", options: ["Yes, alone", "With spouse/partner", "With family", "In assisted living", "In nursing home"] },
            { id: 24, type: 'scale', question: "Rate your appetite (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 25, type: 'checkbox', question: "What nutrition concerns do you have?", options: ["None", "Poor appetite", "Weight loss", "Weight gain", "Difficulty chewing", "Difficulty swallowing", "Limited food access"] },
            { id: 26, type: 'multiple', question: "How often do you exercise?", options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never", "Unable to exercise"] },
            { id: 27, type: 'checkbox', question: "What types of exercise do you do?", options: ["None", "Walking", "Swimming", "Chair exercises", "Balance training", "Strength training", "Yoga/Tai Chi"] },
            { id: 28, type: 'multiple', question: "How often do you see your doctor?", options: ["Monthly", "Every 3 months", "Every 6 months", "Annually", "Only when sick"] },
            { id: 29, type: 'checkbox', question: "What health screenings have you had recently?", options: ["None", "Blood pressure", "Cholesterol", "Diabetes screening", "Cancer screenings", "Bone density", "Vision/hearing tests"] },
            { id: 30, type: 'text', question: "What are your main health concerns or goals for aging well?", placeholder: "Share your concerns about aging, health goals, or questions about senior care..." }
        ];
    }

    generateSessionId() {
        return 'senior-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

let seniorCare = new SeniorCare30Q(); 