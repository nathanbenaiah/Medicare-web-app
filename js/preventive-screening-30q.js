// Preventive Health Screening 30-Question Assessment
class PreventiveScreening30Q {
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
            { id: 2, type: 'multiple', question: "What is your biological sex?", options: ["Male", "Female", "Prefer not to say"] },
            { id: 3, type: 'checkbox', question: "What family history of diseases do you have?", options: ["None known", "Heart disease", "Cancer", "Diabetes", "High blood pressure", "Stroke", "Mental health conditions", "Other"] },
            { id: 4, type: 'multiple', question: "When was your last complete physical exam?", options: ["Within 6 months", "6-12 months ago", "1-2 years ago", "2-3 years ago", "More than 3 years ago", "Never"] },
            { id: 5, type: 'multiple', question: "When was your last blood pressure check?", options: ["Within 3 months", "3-6 months ago", "6-12 months ago", "1-2 years ago", "More than 2 years ago"] },
            { id: 6, type: 'multiple', question: "When was your last cholesterol screening?", options: ["Within 1 year", "1-2 years ago", "2-5 years ago", "More than 5 years ago", "Never"] },
            { id: 7, type: 'multiple', question: "When was your last blood sugar/diabetes screening?", options: ["Within 1 year", "1-3 years ago", "3-5 years ago", "More than 5 years ago", "Never"] },
            { id: 8, type: 'multiple', question: "When was your last cancer screening (appropriate for your age/sex)?", options: ["Within 1 year", "1-2 years ago", "2-3 years ago", "3-5 years ago", "More than 5 years ago", "Never"] },
            { id: 9, type: 'checkbox', question: "What cancer screenings have you had?", options: ["None", "Mammogram", "Pap smear", "Colonoscopy", "Prostate screening", "Skin cancer check", "Lung screening", "Other"] },
            { id: 10, type: 'multiple', question: "Are you up-to-date with recommended vaccinations?", options: ["Yes, completely", "Mostly up-to-date", "Some missing", "Significantly behind", "Don't know"] },
            { id: 11, type: 'checkbox', question: "What vaccines have you received recently?", options: ["None", "Flu shot", "COVID-19", "Shingles", "Pneumonia", "Tdap", "Other"] },
            { id: 12, type: 'scale', question: "Rate your overall health awareness (1-10)", min: 1, max: 10, labels: ["Very low", "Very high"] },
            { id: 13, type: 'multiple', question: "Do you perform regular self-examinations?", options: ["Yes, regularly", "Sometimes", "Rarely", "Never", "Don't know how"] },
            { id: 14, type: 'checkbox', question: "What self-examinations do you do?", options: ["None", "Breast self-exam", "Testicular self-exam", "Skin checks", "Oral exam", "Other"] },
            { id: 15, type: 'multiple', question: "How often do you monitor your weight?", options: ["Daily", "Weekly", "Monthly", "Occasionally", "Never"] },
            { id: 16, type: 'scale', question: "Rate your knowledge of health risks (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 17, type: 'checkbox', question: "What risk factors apply to you?", options: ["None", "Smoking", "High stress", "Poor diet", "Lack of exercise", "Family history", "Obesity", "Excessive alcohol"] },
            { id: 18, type: 'multiple', question: "Do you smoke or use tobacco?", options: ["Never", "Former smoker", "Occasionally", "Daily"] },
            { id: 19, type: 'multiple', question: "How much alcohol do you consume weekly?", options: ["None", "1-2 drinks", "3-7 drinks", "8-14 drinks", "More than 14 drinks"] },
            { id: 20, type: 'multiple', question: "How often do you exercise?", options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never"] },
            { id: 21, type: 'scale', question: "Rate the quality of your diet (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 22, type: 'scale', question: "Rate your stress levels (1-10)", min: 1, max: 10, labels: ["No stress", "Very stressed"] },
            { id: 23, type: 'scale', question: "Rate your sleep quality (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 24, type: 'multiple', question: "Do you take any supplements or preventive medications?", options: ["None", "Multivitamin", "Vitamin D", "Calcium", "Fish oil", "Aspirin", "Other"] },
            { id: 25, type: 'checkbox', question: "What preventive measures do you currently practice?", options: ["None", "Regular exercise", "Healthy diet", "Stress management", "Regular checkups", "Self-examinations", "Sun protection", "Safety measures"] },
            { id: 26, type: 'multiple', question: "How motivated are you to prevent health problems?", options: ["Very motivated", "Somewhat motivated", "Neutral", "Not very motivated", "Not motivated at all"] },
            { id: 27, type: 'checkbox', question: "What barriers prevent you from getting screenings?", options: ["None", "Cost", "Time", "Fear", "Lack of symptoms", "Don't know what's needed", "Transportation", "Insurance issues"] },
            { id: 28, type: 'checkbox', question: "What screening information would be helpful?", options: ["When to get screened", "What tests are needed", "How to prepare", "Cost information", "Finding providers", "Understanding results", "None needed"] },
            { id: 29, type: 'scale', question: "Rate your confidence in managing your health (1-10)", min: 1, max: 10, labels: ["Not confident", "Very confident"] },
            { id: 30, type: 'text', question: "What specific health concerns would you like to prevent or screen for?", placeholder: "Share any health concerns, family history, or prevention goals you have..." }
        ];
    }

    generateSessionId() {
        return 'preventive-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

let preventiveScreening = new PreventiveScreening30Q(); 