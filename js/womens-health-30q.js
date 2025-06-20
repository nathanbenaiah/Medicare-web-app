// Women's Health Specialist 30-Question Assessment
class WomensHealth30Q {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = this.generateSessionId();
        this.questions = this.getQuestions();
        this.totalQuestions = this.questions.length;
    }

    getQuestions() {
        return [
            { id: 1, type: 'number', question: "What is your age?", placeholder: "Enter age in years" },
            { id: 2, type: 'multiple', question: "What is your current menstrual status?", options: ["Regular periods", "Irregular periods", "No periods", "Postmenopausal", "Pregnant", "Breastfeeding"] },
            { id: 3, type: 'number', question: "At what age did you start menstruating?", placeholder: "Age of first period" },
            { id: 4, type: 'multiple', question: "How would you describe your typical menstrual cycle?", options: ["Regular (21-35 days)", "Irregular timing", "Very heavy", "Very light", "Painful", "No periods"] },
            { id: 5, type: 'scale', question: "Rate your menstrual pain/discomfort (1-10)", min: 1, max: 10, labels: ["No pain", "Severe pain"] },
            { id: 6, type: 'checkbox', question: "What menstrual symptoms do you experience?", options: ["None", "Cramping", "Heavy bleeding", "Mood changes", "Bloating", "Headaches", "Fatigue", "Breast tenderness"] },
            { id: 7, type: 'multiple', question: "Are you currently using any form of birth control?", options: ["No", "Birth control pills", "IUD", "Condoms", "Implant", "Injection", "Other method"] },
            { id: 8, type: 'multiple', question: "Are you currently trying to conceive?", options: ["Yes", "No", "Not sexually active", "Uncertain"] },
            { id: 9, type: 'number', question: "How many pregnancies have you had?", placeholder: "Include current if pregnant" },
            { id: 10, type: 'number', question: "How many live births have you had?", placeholder: "Number of children delivered" },
            { id: 11, type: 'checkbox', question: "Have you experienced any pregnancy complications?", options: ["None", "Miscarriage", "Gestational diabetes", "High blood pressure", "Preterm birth", "C-section", "Postpartum depression"] },
            { id: 12, type: 'multiple', question: "When was your last mammogram?", options: ["Never had one", "Within 1 year", "1-2 years ago", "2-3 years ago", "More than 3 years ago"] },
            { id: 13, type: 'multiple', question: "When was your last Pap smear?", options: ["Never had one", "Within 1 year", "1-3 years ago", "3-5 years ago", "More than 5 years ago"] },
            { id: 14, type: 'checkbox', question: "Do you perform regular breast self-exams?", options: ["Yes, monthly", "Yes, occasionally", "Rarely", "Never", "Don't know how"] },
            { id: 15, type: 'checkbox', question: "What menopausal symptoms are you experiencing?", options: ["None/Not applicable", "Hot flashes", "Night sweats", "Mood changes", "Sleep problems", "Vaginal dryness", "Weight gain", "Memory issues"] },
            { id: 16, type: 'multiple', question: "Are you taking hormone replacement therapy?", options: ["No", "Yes, estrogen only", "Yes, combination therapy", "Yes, bioidentical hormones", "Considering it"] },
            { id: 17, type: 'scale', question: "Rate your energy levels (1-10)", min: 1, max: 10, labels: ["Very low", "Very high"] },
            { id: 18, type: 'scale', question: "Rate your mood stability (1-10)", min: 1, max: 10, labels: ["Very unstable", "Very stable"] },
            { id: 19, type: 'multiple', question: "How often do you experience stress?", options: ["Rarely", "Sometimes", "Often", "Daily", "Constantly"] },
            { id: 20, type: 'checkbox', question: "What health concerns worry you most?", options: ["None", "Breast cancer", "Cervical cancer", "Osteoporosis", "Heart disease", "Weight management", "Fertility", "Aging"] },
            { id: 21, type: 'multiple', question: "How often do you exercise?", options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never"] },
            { id: 22, type: 'multiple', question: "Do you take any supplements?", options: ["None", "Multivitamin", "Calcium", "Vitamin D", "Iron", "Folic acid", "Other vitamins"] },
            { id: 23, type: 'scale', question: "Rate your sleep quality (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 24, type: 'multiple', question: "Do you smoke or use tobacco?", options: ["Never", "Former smoker", "Occasionally", "Daily"] },
            { id: 25, type: 'multiple', question: "How much alcohol do you consume weekly?", options: ["None", "1-2 drinks", "3-7 drinks", "8-14 drinks", "More than 14"] },
            { id: 26, type: 'checkbox', question: "What sexual health concerns do you have?", options: ["None", "Low libido", "Pain during intercourse", "Vaginal dryness", "Infections", "Contraception questions", "STD concerns"] },
            { id: 27, type: 'scale', question: "Rate your overall relationship satisfaction (1-10)", min: 1, max: 10, labels: ["Very unsatisfied", "Very satisfied"] },
            { id: 28, type: 'checkbox', question: "What family history concerns you?", options: ["None", "Breast cancer", "Ovarian cancer", "Heart disease", "Diabetes", "Osteoporosis", "Mental health conditions"] },
            { id: 29, type: 'multiple', question: "How often do you see a gynecologist?", options: ["Annually", "Every 2-3 years", "Only when problems", "Rarely", "Never"] },
            { id: 30, type: 'text', question: "What specific women's health topics would you like guidance on?", placeholder: "Share any concerns, questions, or goals related to your reproductive and overall health..." }
        ];
    }

    generateSessionId() {
        return 'womens-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

let womensHealth = new WomensHealth30Q(); 