// Chronic Disease Management 30-Question Assessment
class ChronicDisease30Q {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = this.generateSessionId();
        this.questions = this.getQuestions();
        this.totalQuestions = this.questions.length;
    }

    getQuestions() {
        return [
            { id: 1, type: 'checkbox', question: "Which chronic conditions have you been diagnosed with?", options: ["None", "Type 1 Diabetes", "Type 2 Diabetes", "High Blood Pressure", "Heart Disease", "Kidney Disease", "COPD", "Arthritis", "Depression", "Other"] },
            { id: 2, type: 'number', question: "How long have you had your primary chronic condition?", placeholder: "Years" },
            { id: 3, type: 'scale', question: "How well controlled is your primary condition? (1-10)", min: 1, max: 10, labels: ["Poorly controlled", "Well controlled"] },
            { id: 4, type: 'text', question: "List your current medications for chronic conditions", placeholder: "Include names and dosages..." },
            { id: 5, type: 'multiple', question: "How often do you monitor your condition at home?", options: ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely", "Never"] },
            { id: 6, type: 'scale', question: "Rate your adherence to prescribed medications (1-10)", min: 1, max: 10, labels: ["Poor adherence", "Perfect adherence"] },
            { id: 7, type: 'multiple', question: "How often do you see your primary care doctor?", options: ["Every 3 months", "Every 6 months", "Annually", "Only when sick", "Rarely"] },
            { id: 8, type: 'checkbox', question: "What symptoms do you experience regularly?", options: ["None", "Fatigue", "Pain", "Shortness of breath", "Dizziness", "Nausea", "Sleep problems", "Mood changes"] },
            { id: 9, type: 'scale', question: "How much does your condition affect daily activities? (1-10)", min: 1, max: 10, labels: ["No impact", "Severely limits"] },
            { id: 10, type: 'multiple', question: "Do you follow a special diet for your condition?", options: ["Yes, strictly", "Yes, mostly", "Sometimes", "Rarely", "No"] },
            { id: 11, type: 'multiple', question: "How often do you exercise?", options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never", "Unable due to condition"] },
            { id: 12, type: 'scale', question: "Rate your stress levels (1-10)", min: 1, max: 10, labels: ["No stress", "Very stressed"] },
            { id: 13, type: 'multiple', question: "Do you smoke or use tobacco?", options: ["Never", "Former smoker", "Occasionally", "Daily", "Trying to quit"] },
            { id: 14, type: 'multiple', question: "How much alcohol do you consume weekly?", options: ["None", "1-2 drinks", "3-7 drinks", "8-14 drinks", "More than 14"] },
            { id: 15, type: 'scale', question: "Rate your sleep quality (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 16, type: 'checkbox', question: "What complications have you experienced?", options: ["None", "Emergency room visits", "Hospitalizations", "New symptoms", "Medication side effects", "Disease progression"] },
            { id: 17, type: 'multiple', question: "Do you have a support system for managing your condition?", options: ["Strong support", "Some support", "Limited support", "No support"] },
            { id: 18, type: 'scale', question: "Rate your understanding of your condition (1-10)", min: 1, max: 10, labels: ["Poor understanding", "Excellent understanding"] },
            { id: 19, type: 'multiple', question: "How do you track your health metrics?", options: ["Written log", "Mobile app", "Medical device", "Memory only", "Don't track"] },
            { id: 20, type: 'checkbox', question: "What self-care activities do you practice?", options: ["Regular monitoring", "Medication adherence", "Diet management", "Exercise", "Stress reduction", "Sleep hygiene", "None"] },
            { id: 21, type: 'scale', question: "How confident are you in managing your condition? (1-10)", min: 1, max: 10, labels: ["Not confident", "Very confident"] },
            { id: 22, type: 'multiple', question: "Do you see specialists for your condition?", options: ["Regularly", "Occasionally", "As needed", "Rarely", "Never"] },
            { id: 23, type: 'checkbox', question: "What barriers affect your care?", options: ["None", "Cost", "Transportation", "Time", "Provider availability", "Language", "Insurance", "Understanding"] },
            { id: 24, type: 'scale', question: "Rate your overall quality of life (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 25, type: 'multiple', question: "How often do you experience flare-ups or acute episodes?", options: ["Never", "Rarely", "Monthly", "Weekly", "Daily"] },
            { id: 26, type: 'checkbox', question: "What lifestyle modifications have you made?", options: ["None", "Diet changes", "Exercise routine", "Weight management", "Smoking cessation", "Stress management", "Sleep improvement"] },
            { id: 27, type: 'scale', question: "How well do you manage stress related to your condition? (1-10)", min: 1, max: 10, labels: ["Poorly", "Very well"] },
            { id: 28, type: 'multiple', question: "Do you participate in disease management programs?", options: ["Yes, actively", "Yes, occasionally", "Interested but not enrolled", "Not interested", "Not available"] },
            { id: 29, type: 'checkbox', question: "What resources would help you better manage your condition?", options: ["Education materials", "Support groups", "Technology tools", "Nutrition counseling", "Exercise programs", "Mental health support", "Financial assistance"] },
            { id: 30, type: 'text', question: "What are your main concerns or goals for managing your chronic condition?", placeholder: "Share your specific concerns, goals, or challenges..." }
        ];
    }

    generateSessionId() {
        return 'chronic-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

let chronicDisease = new ChronicDisease30Q(); 