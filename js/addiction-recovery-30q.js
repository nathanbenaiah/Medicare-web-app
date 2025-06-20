// Addiction Recovery Support 30-Question Assessment
class AddictionRecovery30Q {
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
            { id: 2, type: 'multiple', question: "What is your current relationship with substances?", options: ["Never used", "Occasional social use", "Regular use", "Problematic use", "In recovery", "Seeking help"] },
            { id: 3, type: 'checkbox', question: "Which substances have you used or struggled with?", options: ["None", "Alcohol", "Marijuana", "Prescription medications", "Cocaine", "Heroin/Opioids", "Methamphetamine", "Other"] },
            { id: 4, type: 'multiple', question: "What is your primary substance of concern?", options: ["None", "Alcohol", "Prescription opioids", "Illegal opioids", "Stimulants", "Marijuana", "Other"] },
            { id: 5, type: 'number', question: "How long have you been struggling with substance use?", placeholder: "Years" },
            { id: 6, type: 'multiple', question: "Have you tried to quit or reduce use before?", options: ["Never tried", "Once", "2-3 times", "4-5 times", "Many times"] },
            { id: 7, type: 'multiple', question: "What is your current recovery status?", options: ["Not in recovery", "Thinking about change", "Actively trying to quit", "Early recovery (0-90 days)", "Sustained recovery (90+ days)", "Long-term recovery (1+ years)"] },
            { id: 8, type: 'scale', question: "Rate your motivation to change (1-10)", min: 1, max: 10, labels: ["Not motivated", "Very motivated"] },
            { id: 9, type: 'checkbox', question: "What withdrawal symptoms have you experienced?", options: ["None", "Anxiety", "Depression", "Nausea", "Sweating", "Tremors", "Sleep problems", "Cravings", "Other"] },
            { id: 10, type: 'scale', question: "Rate the severity of your cravings (1-10)", min: 1, max: 10, labels: ["No cravings", "Intense cravings"] },
            { id: 11, type: 'checkbox', question: "What triggers your substance use?", options: ["None", "Stress", "Social situations", "Boredom", "Emotions", "Physical pain", "Certain people", "Specific locations"] },
            { id: 12, type: 'multiple', question: "Have you received treatment before?", options: ["Never", "Outpatient counseling", "Inpatient rehab", "Support groups", "Medication-assisted treatment", "Multiple types"] },
            { id: 13, type: 'scale', question: "Rate your current support system (1-10)", min: 1, max: 10, labels: ["No support", "Strong support"] },
            { id: 14, type: 'checkbox', question: "Who is part of your support system?", options: ["No one", "Family", "Friends", "Sponsor", "Therapist", "Support group", "Religious community", "Medical team"] },
            { id: 15, type: 'multiple', question: "Are you currently in any treatment program?", options: ["No", "Outpatient therapy", "Intensive outpatient", "Inpatient treatment", "Sober living", "Support groups only"] },
            { id: 16, type: 'checkbox', question: "What barriers prevent you from getting help?", options: ["None", "Cost", "Shame/stigma", "Time", "Transportation", "Childcare", "Work obligations", "Don't know where to start"] },
            { id: 17, type: 'scale', question: "Rate your mental health (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 18, type: 'checkbox', question: "What mental health concerns do you have?", options: ["None", "Depression", "Anxiety", "PTSD", "Bipolar disorder", "Personality disorder", "Eating disorder", "Other"] },
            { id: 19, type: 'multiple', question: "How has substance use affected your relationships?", options: ["No impact", "Minor problems", "Moderate problems", "Severe problems", "Lost important relationships"] },
            { id: 20, type: 'multiple', question: "How has substance use affected your work/school?", options: ["No impact", "Minor problems", "Moderate problems", "Lost job/dropped out", "Multiple job losses"] },
            { id: 21, type: 'multiple', question: "Have you had legal problems related to substance use?", options: ["None", "DUI/DWI", "Possession charges", "Other drug-related charges", "Multiple legal issues"] },
            { id: 22, type: 'scale', question: "Rate your physical health (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 23, type: 'checkbox', question: "What health problems are related to your substance use?", options: ["None", "Liver problems", "Heart issues", "Lung problems", "Infections", "Mental health", "Injuries", "Nutritional deficiencies"] },
            { id: 24, type: 'multiple', question: "Do you have stable housing?", options: ["Yes, stable", "Mostly stable", "Somewhat unstable", "Very unstable", "Homeless"] },
            { id: 25, type: 'scale', question: "Rate your confidence in staying sober (1-10)", min: 1, max: 10, labels: ["Not confident", "Very confident"] },
            { id: 26, type: 'checkbox', question: "What recovery tools do you use?", options: ["None", "12-step programs", "Therapy", "Medication", "Meditation", "Exercise", "Hobbies", "Spiritual practices"] },
            { id: 27, type: 'checkbox', question: "What type of support would be most helpful?", options: ["Individual therapy", "Group therapy", "Peer support", "Family therapy", "Medical care", "Life skills training", "Job training", "Housing assistance"] },
            { id: 28, type: 'scale', question: "Rate your hope for recovery (1-10)", min: 1, max: 10, labels: ["No hope", "Very hopeful"] },
            { id: 29, type: 'multiple', question: "What is your biggest concern about recovery?", options: ["Cravings", "Losing friends", "Stress management", "Boredom", "Past trauma", "Relapse", "Starting over", "Finding purpose"] },
            { id: 30, type: 'text', question: "What are your goals for recovery and what support do you need most?", placeholder: "Share your recovery goals, concerns, or what type of support would be most helpful..." }
        ];
    }

    generateSessionId() {
        return 'addiction-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

let addictionRecovery = new AddictionRecovery30Q(); 