// Pediatric Health Care 30-Question Assessment  
class PediatricCare30Q {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.sessionId = this.generateSessionId();
        this.questions = this.getQuestions();
        this.totalQuestions = this.questions.length;
    }

    getQuestions() {
        return [
            { id: 1, type: 'number', question: "What is your child's age?", placeholder: "Age in years (or months if under 2)" },
            { id: 2, type: 'multiple', question: "What is your child's biological sex?", options: ["Male", "Female", "Prefer not to say"] },
            { id: 3, type: 'number', question: "What is your child's current weight?", placeholder: "Weight in kg or lbs" },
            { id: 4, type: 'number', question: "What is your child's current height?", placeholder: "Height in cm or inches" },
            { id: 5, type: 'multiple', question: "How would you rate your child's overall health?", options: ["Excellent", "Very good", "Good", "Fair", "Poor"] },
            { id: 6, type: 'checkbox', question: "What current health concerns do you have?", options: ["None", "Growth/development", "Eating habits", "Sleep issues", "Behavioral concerns", "School performance", "Social skills", "Chronic illness"] },
            { id: 7, type: 'multiple', question: "Is your child up-to-date with vaccinations?", options: ["Yes, completely", "Mostly up-to-date", "Some delays", "Significantly behind", "Not vaccinated by choice"] },
            { id: 8, type: 'checkbox', question: "What developmental milestones concern you?", options: ["None", "Speech/language", "Motor skills", "Social interaction", "Cognitive development", "Emotional regulation", "Learning abilities"] },
            { id: 9, type: 'multiple', question: "How often does your child get sick?", options: ["Rarely", "Occasionally", "Frequently", "Very often", "Constantly"] },
            { id: 10, type: 'checkbox', question: "What chronic conditions does your child have?", options: ["None", "Asthma", "Allergies", "ADHD", "Autism spectrum", "Diabetes", "Heart condition", "Other"] },
            { id: 11, type: 'scale', question: "Rate your child's energy levels (1-10)", min: 1, max: 10, labels: ["Very low", "Very high"] },
            { id: 12, type: 'multiple', question: "How would you describe your child's sleep patterns?", options: ["Excellent", "Good", "Fair", "Poor", "Very problematic"] },
            { id: 13, type: 'number', question: "How many hours does your child sleep per night?", placeholder: "Average hours of sleep" },
            { id: 14, type: 'checkbox', question: "What sleep issues does your child experience?", options: ["None", "Difficulty falling asleep", "Frequent waking", "Nightmares", "Bedwetting", "Early waking", "Resistance to bedtime"] },
            { id: 15, type: 'multiple', question: "How would you describe your child's appetite?", options: ["Excellent", "Good", "Fair", "Poor", "Very picky eater"] },
            { id: 16, type: 'checkbox', question: "What eating concerns do you have?", options: ["None", "Picky eating", "Overeating", "Undereating", "Food allergies", "Weight concerns", "Unhealthy choices"] },
            { id: 17, type: 'multiple', question: "How active is your child?", options: ["Very active", "Moderately active", "Somewhat active", "Not very active", "Sedentary"] },
            { id: 18, type: 'multiple', question: "How much screen time does your child have daily?", options: ["None", "Less than 1 hour", "1-2 hours", "2-4 hours", "More than 4 hours"] },
            { id: 19, type: 'scale', question: "Rate your child's social skills (1-10)", min: 1, max: 10, labels: ["Very poor", "Excellent"] },
            { id: 20, type: 'checkbox', question: "What behavioral concerns do you have?", options: ["None", "Tantrums", "Aggression", "Anxiety", "Depression", "Attention problems", "Defiance", "Social withdrawal"] },
            { id: 21, type: 'multiple', question: "How is your child performing in school?", options: ["Not in school yet", "Excellent", "Good", "Average", "Below average", "Struggling significantly"] },
            { id: 22, type: 'checkbox', question: "What school-related concerns do you have?", options: ["None", "Academic performance", "Social interactions", "Attention/focus", "Behavioral issues", "Learning disabilities", "Bullying"] },
            { id: 23, type: 'multiple', question: "How often does your child see a pediatrician?", options: ["Regular checkups only", "When sick", "For chronic conditions", "Rarely", "Never"] },
            { id: 24, type: 'checkbox', question: "What specialists has your child seen?", options: ["None", "Allergist", "Cardiologist", "Dermatologist", "ENT", "Neurologist", "Psychologist", "Other"] },
            { id: 25, type: 'scale', question: "Rate your stress level as a parent (1-10)", min: 1, max: 10, labels: ["No stress", "Very stressed"] },
            { id: 26, type: 'multiple', question: "Do you have support in caring for your child?", options: ["Strong support system", "Some support", "Limited support", "No support"] },
            { id: 27, type: 'checkbox', question: "What safety concerns do you have?", options: ["None", "Car safety", "Home safety", "Online safety", "Playground safety", "Stranger danger", "Bullying"] },
            { id: 28, type: 'checkbox', question: "What topics would you like guidance on?", options: ["Nutrition", "Development", "Behavior management", "Sleep training", "Safety", "School readiness", "Mental health", "Technology use"] },
            { id: 29, type: 'scale', question: "Rate your confidence in parenting decisions (1-10)", min: 1, max: 10, labels: ["Not confident", "Very confident"] },
            { id: 30, type: 'text', question: "What specific concerns or questions do you have about your child's health and development?", placeholder: "Share any specific concerns, questions, or goals for your child's health and development..." }
        ];
    }

    generateSessionId() {
        return 'pediatric-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

let pediatricCare = new PediatricCare30Q(); 