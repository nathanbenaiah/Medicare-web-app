// Comprehensive 30-Question Symptom Checker Configuration
// This provides all 30 questions for a thorough symptom analysis

window.COMPREHENSIVE_SYMPTOM_CHECKER_30Q = {
    'symptom-checker': [
        // Basic Information (Questions 1-5 are handled by the main system)
        
        // Symptom-Specific Questions (Questions 6-30)
        { id: 6, type: 'multiple', question: 'Q6. What is your primary symptom?', description: 'Select your main health concern', options: [
            { value: 'headache', label: 'Headache' }, { value: 'chest-pain', label: 'Chest pain' }, { value: 'abdominal-pain', label: 'Abdominal pain' },
            { value: 'back-pain', label: 'Back pain' }, { value: 'joint-pain', label: 'Joint pain' }, { value: 'breathing-issues', label: 'Breathing issues' },
            { value: 'fatigue', label: 'Fatigue' }, { value: 'skin-problems', label: 'Skin problems' }, { value: 'digestive-issues', label: 'Digestive issues' }, { value: 'other', label: 'Other' }
        ], required: true },
        
        { id: 7, type: 'multiple', question: 'Q7. Rate your pain level (1-10)', description: 'Scale from 1 (mild) to 10 (severe)', options: [
            { value: '1', label: '1 - Very Mild' }, { value: '2', label: '2 - Mild' }, { value: '3', label: '3 - Mild to Moderate' },
            { value: '4', label: '4 - Moderate' }, { value: '5', label: '5 - Moderate' }, { value: '6', label: '6 - Moderate to Severe' },
            { value: '7', label: '7 - Severe' }, { value: '8', label: '8 - Very Severe' }, { value: '9', label: '9 - Extremely Severe' }, { value: '10', label: '10 - Worst Possible' }
        ], required: true },
        
        { id: 8, type: 'multiple', question: 'Q8. When did symptoms start?', description: 'Timeline of symptom onset', options: [
            { value: 'less-1-hour', label: 'Less than 1 hour' }, { value: '1-6-hours', label: '1-6 hours' }, { value: '6-24-hours', label: '6-24 hours' },
            { value: '1-3-days', label: '1-3 days' }, { value: '4-7-days', label: '4-7 days' }, { value: '1-2-weeks', label: '1-2 weeks' }, { value: 'more-2-weeks', label: 'More than 2 weeks' }
        ], required: true },
        
        { id: 9, type: 'multiple', question: 'Q9. Emergency symptoms present?', description: 'Select any emergency symptoms you have', multiple: true, options: [
            { value: 'fever-chills', label: 'Fever/chills' }, { value: 'nausea-vomiting', label: 'Nausea/vomiting' }, { value: 'dizziness', label: 'Dizziness' },
            { value: 'shortness-breath', label: 'Shortness of breath' }, { value: 'rapid-heartbeat', label: 'Rapid heartbeat' }, { value: 'sweating', label: 'Sweating' },
            { value: 'confusion', label: 'Confusion' }, { value: 'severe-weakness', label: 'Severe weakness' }, { value: 'none', label: 'None' }
        ], required: true },
        
        { id: 10, type: 'multiple', question: 'Q10. Describe your pain type', description: 'What does the pain feel like?', options: [
            { value: 'sharp-stabbing', label: 'Sharp/stabbing' }, { value: 'dull-aching', label: 'Dull/aching' }, { value: 'burning', label: 'Burning' },
            { value: 'cramping', label: 'Cramping' }, { value: 'throbbing', label: 'Throbbing' }, { value: 'pressure-like', label: 'Pressure-like' },
            { value: 'electric-shock', label: 'Electric shock' }, { value: 'no-pain', label: 'No pain' }
        ], required: true },
        
        { id: 11, type: 'multiple', question: 'Q11. What makes symptoms better?', description: 'Select what provides relief', multiple: true, options: [
            { value: 'rest', label: 'Rest' }, { value: 'movement', label: 'Movement' }, { value: 'heat', label: 'Heat' }, { value: 'cold', label: 'Cold' },
            { value: 'otc-medications', label: 'OTC medications' }, { value: 'prescription-meds', label: 'Prescription meds' },
            { value: 'food-water', label: 'Food/water' }, { value: 'nothing-helps', label: 'Nothing helps' }
        ], required: true },
        
        { id: 12, type: 'multiple', question: 'Q12. What makes symptoms worse?', description: 'Select what worsens your symptoms', multiple: true, options: [
            { value: 'physical-activity', label: 'Physical activity' }, { value: 'certain-positions', label: 'Certain positions' }, { value: 'eating-drinking', label: 'Eating/drinking' },
            { value: 'stress', label: 'Stress' }, { value: 'weather-changes', label: 'Weather changes' }, { value: 'touch-pressure', label: 'Touch/pressure' },
            { value: 'deep-breathing', label: 'Deep breathing' }, { value: 'nothing', label: 'Nothing' }
        ], required: true },
        
        { id: 13, type: 'text', question: 'Q13. Current temperature (°F)', description: 'Enter your body temperature if measured', required: false, placeholder: 'e.g., 98.6' },
        
        { id: 14, type: 'multiple', question: 'Q14. Neurological symptoms?', description: 'Any nervous system symptoms', multiple: true, options: [
            { value: 'memory-problems', label: 'Memory problems' }, { value: 'confusion', label: 'Confusion' }, { value: 'difficulty-concentrating', label: 'Difficulty concentrating' },
            { value: 'seizures', label: 'Seizures' }, { value: 'tremors', label: 'Tremors' }, { value: 'muscle-weakness', label: 'Muscle weakness' },
            { value: 'coordination-issues', label: 'Coordination issues' }, { value: 'speech-problems', label: 'Speech problems' },
            { value: 'vision-changes', label: 'Vision changes' }, { value: 'none', label: 'None' }
        ], required: true },
        
        { id: 15, type: 'multiple', question: 'Q15. Recent travel history', description: 'Any recent travel', options: [
            { value: 'no-travel', label: 'No travel' }, { value: 'domestic-travel', label: 'Domestic travel' }, { value: 'international-travel', label: 'International travel' },
            { value: 'high-risk-area', label: 'High-risk area travel' }, { value: 'sick-contact-travel', label: 'Sick contact during travel' }
        ], required: true },
        
        { id: 16, type: 'multiple', question: 'Q16. Known allergies', description: 'Select your known allergies', multiple: true, options: [
            { value: 'food-allergies', label: 'Food allergies' }, { value: 'drug-allergies', label: 'Drug allergies' }, { value: 'environmental-allergies', label: 'Environmental allergies' },
            { value: 'latex-allergy', label: 'Latex allergy' }, { value: 'animal-allergies', label: 'Animal allergies' }, { value: 'insect-allergies', label: 'Insect allergies' }, { value: 'no-allergies', label: 'No allergies' }
        ], required: true },
        
        { id: 17, type: 'multiple', question: 'Q17. Current medications', description: 'Select medications you are taking', multiple: true, options: [
            { value: 'blood-pressure-meds', label: 'Blood pressure meds' }, { value: 'diabetes-meds', label: 'Diabetes meds' }, { value: 'heart-medications', label: 'Heart medications' },
            { value: 'blood-thinners', label: 'Blood thinners' }, { value: 'pain-medications', label: 'Pain medications' }, { value: 'antibiotics', label: 'Antibiotics' },
            { value: 'vitamins', label: 'Vitamins' }, { value: 'birth-control', label: 'Birth control' }, { value: 'antidepressants', label: 'Antidepressants' }, { value: 'none', label: 'None' }
        ], required: true },
        
        { id: 18, type: 'multiple', question: 'Q18. Recent injuries', description: 'Any recent injuries or trauma', options: [
            { value: 'no-injuries', label: 'No injuries' }, { value: 'head-injury', label: 'Head injury' }, { value: 'fall-trauma', label: 'Fall/trauma' },
            { value: 'sports-injury', label: 'Sports injury' }, { value: 'car-accident', label: 'Car accident' }, { value: 'work-injury', label: 'Work injury' }, { value: 'cut-wound', label: 'Cut/wound' }
        ], required: true },
        
        { id: 19, type: 'multiple', question: 'Q19. Appetite changes', description: 'Changes in your eating patterns', options: [
            { value: 'normal-appetite', label: 'Normal appetite' }, { value: 'increased-appetite', label: 'Increased appetite' }, { value: 'decreased-appetite', label: 'Decreased appetite' },
            { value: 'no-appetite', label: 'No appetite' }, { value: 'nausea-eating', label: 'Nausea when eating' }, { value: 'difficulty-swallowing', label: 'Difficulty swallowing' }
        ], required: true },
        
        { id: 20, type: 'multiple', question: 'Q20. Sleep quality', description: 'How has your sleep been?', options: [
            { value: 'normal-sleep', label: 'Normal sleep' }, { value: 'trouble-falling-asleep', label: 'Trouble falling asleep' }, { value: 'frequent-waking', label: 'Frequent waking' },
            { value: 'early-waking', label: 'Early waking' }, { value: 'sleeping-more', label: 'Sleeping more' }, { value: 'pain-disrupts-sleep', label: 'Pain disrupts sleep' }, { value: 'cant-sleep', label: 'Can\'t sleep' }
        ], required: true },
        
        { id: 21, type: 'multiple', question: 'Q21. Chronic conditions', description: 'Select any chronic health conditions', multiple: true, options: [
            { value: 'diabetes', label: 'Diabetes' }, { value: 'high-blood-pressure', label: 'High blood pressure' }, { value: 'heart-disease', label: 'Heart disease' },
            { value: 'asthma', label: 'Asthma' }, { value: 'arthritis', label: 'Arthritis' }, { value: 'cancer', label: 'Cancer' },
            { value: 'kidney-disease', label: 'Kidney disease' }, { value: 'liver-disease', label: 'Liver disease' }, { value: 'mental-health', label: 'Mental health' }, { value: 'none', label: 'None' }
        ], required: true },
        
        { id: 22, type: 'multiple', question: 'Q22. Stress level (1-10)', description: 'Rate your current stress level', options: [
            { value: '1', label: '1 - No stress' }, { value: '2', label: '2 - Very low' }, { value: '3', label: '3 - Low' },
            { value: '4', label: '4 - Mild' }, { value: '5', label: '5 - Moderate' }, { value: '6', label: '6 - Moderate-high' },
            { value: '7', label: '7 - High' }, { value: '8', label: '8 - Very high' }, { value: '9', label: '9 - Extreme' }, { value: '10', label: '10 - Overwhelming' }
        ], required: true },
        
        { id: 23, type: 'multiple', question: 'Q23. Recent illness exposure', description: 'Exposure to sick people recently', options: [
            { value: 'no-exposure', label: 'No exposure' }, { value: 'family-member-sick', label: 'Family member sick' }, { value: 'coworker-sick', label: 'Coworker sick' },
            { value: 'healthcare-exposure', label: 'Healthcare exposure' }, { value: 'public-gathering', label: 'Public gathering' }, { value: 'school-daycare-exposure', label: 'School/daycare exposure' }
        ], required: true },
        
        { id: 24, type: 'multiple', question: 'Q24. Energy level (1-10)', description: 'Rate your current energy level', options: [
            { value: '1', label: '1 - No energy' }, { value: '2', label: '2 - Very low' }, { value: '3', label: '3 - Low' },
            { value: '4', label: '4 - Below average' }, { value: '5', label: '5 - Average' }, { value: '6', label: '6 - Above average' },
            { value: '7', label: '7 - Good' }, { value: '8', label: '8 - Very good' }, { value: '9', label: '9 - High' }, { value: '10', label: '10 - Excellent' }
        ], required: true },
        
        { id: 25, type: 'multiple', question: 'Q25. Bowel movement changes', description: 'Any changes in bowel habits', options: [
            { value: 'normal', label: 'Normal' }, { value: 'constipation', label: 'Constipation' }, { value: 'diarrhea', label: 'Diarrhea' },
            { value: 'blood-in-stool', label: 'Blood in stool' }, { value: 'black-stool', label: 'Black stool' }, { value: 'severe-cramping', label: 'Severe cramping' },
            { value: 'no-bowel-movement-3-days', label: 'No bowel movement 3+ days' }
        ], required: true },
        
        { id: 26, type: 'multiple', question: 'Q26. Urination changes', description: 'Any changes in urination', options: [
            { value: 'normal', label: 'Normal' }, { value: 'frequent-urination', label: 'Frequent urination' }, { value: 'painful-urination', label: 'Painful urination' },
            { value: 'blood-in-urine', label: 'Blood in urine' }, { value: 'difficulty-urinating', label: 'Difficulty urinating' }, { value: 'unable-to-urinate', label: 'Unable to urinate' },
            { value: 'unusual-odor-color', label: 'Unusual odor/color' }
        ], required: true },
        
        { id: 27, type: 'multiple', question: 'Q27. Breathing description', description: 'How is your breathing?', options: [
            { value: 'normal', label: 'Normal' }, { value: 'slightly-short', label: 'Slightly short' }, { value: 'moderately-short', label: 'Moderately short' },
            { value: 'severely-short', label: 'Severely short' }, { value: 'cant-catch-breath', label: 'Can\'t catch breath' }, { value: 'wheezing', label: 'Wheezing' },
            { value: 'cough-with-breathing', label: 'Cough with breathing' }
        ], required: true },
        
        { id: 28, type: 'multiple', question: 'Q28. Skin changes', description: 'Any changes to your skin', multiple: true, options: [
            { value: 'no-changes', label: 'No changes' }, { value: 'rash-redness', label: 'Rash/redness' }, { value: 'cuts-wounds', label: 'Cuts/wounds' },
            { value: 'swelling', label: 'Swelling' }, { value: 'bruising', label: 'Bruising' }, { value: 'itching', label: 'Itching' },
            { value: 'color-changes', label: 'Color changes' }, { value: 'new-moles', label: 'New moles' }
        ], required: true },
        
        { id: 29, type: 'multiple', question: 'Q29. Anxiety about symptoms (1-10)', description: 'How anxious are you about your symptoms?', options: [
            { value: '1', label: '1 - Not anxious' }, { value: '2', label: '2 - Very low' }, { value: '3', label: '3 - Low' },
            { value: '4', label: '4 - Mild' }, { value: '5', label: '5 - Moderate' }, { value: '6', label: '6 - Moderate-high' },
            { value: '7', label: '7 - High' }, { value: '8', label: '8 - Very high' }, { value: '9', label: '9 - Severe' }, { value: '10', label: '10 - Panic' }
        ], required: true },
        
        { id: 30, type: 'text', question: 'Q30. Additional concerns', description: 'Any other symptoms or concerns you want to mention?', required: false, placeholder: 'Describe any other symptoms or concerns...' }
    ]
};

// Function to get comprehensive symptom checker questions
function getComprehensiveSymptomCheckerQuestions() {
    return window.COMPREHENSIVE_SYMPTOM_CHECKER_30Q['symptom-checker'];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_SYMPTOM_CHECKER_30Q };
} 