// DeepSeek AI Service
// Integration with DeepSeek API for health assessment analysis

const axios = require('axios');

class AIService {
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY || 'your_deepseek_api_key_here';
        this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
        this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
        this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.3;
        this.maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 4000;
        this.timeout = parseInt(process.env.AI_TIMEOUT) || 30000;
    }

    // Generate AI analysis based on assessment responses
    async analyzeAssessment(featureId, responses) {
        try {
            const startTime = Date.now();
            
            // Build the prompt based on feature type and responses
            const prompt = this.buildPrompt(featureId, responses);
            
            // Make API call to DeepSeek
            const aiResponse = await this.callDeepSeekAPI(prompt, featureId);
            
            const processingTime = Date.now() - startTime;
            
            return {
                success: true,
                response: aiResponse.response,
                confidence: aiResponse.confidence || 0.85,
                processingTime,
                tokensUsed: aiResponse.tokensUsed || 0,
                prompt: prompt
            };
            
        } catch (error) {
            console.error('❌ AI Analysis Error:', error);
            return {
                success: false,
                error: error.message,
                response: this.getFallbackResponse(featureId),
                confidence: 0.0,
                processingTime: 0,
                tokensUsed: 0
            };
        }
    }

    // Build feature-specific prompts
    buildPrompt(featureId, responses) {
        const systemPrompts = {
            'diet-planner': `You are a certified nutritionist AI. Create a comprehensive, personalized diet plan in HTML format with:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Your Personalized Nutrition Plan</h3>

<div class="summary-section">
<h4>Assessment Summary</h4>
<p>Based on your responses, here's your personalized approach...</p>
</div>

<div class="meal-plan-section">
<h4>7-Day Meal Plan</h4>
<div class="daily-meals">
[Provide detailed daily meal plans with specific foods, portions, and timing]
</div>
</div>

<div class="nutrition-goals">
<h4>Nutritional Targets</h4>
<ul>
<li>Daily Calories: [specific amount]</li>
<li>Protein: [amount]g</li>
<li>Carbohydrates: [amount]g</li>
<li>Healthy Fats: [amount]g</li>
</ul>
</div>

<div class="shopping-list">
<h4>Weekly Shopping List</h4>
[Organized by category: Proteins, Vegetables, Fruits, Grains, etc.]
</div>

<div class="tips-section">
<h4>Preparation Tips</h4>
[Meal prep suggestions and cooking tips]
</div>

<div class="disclaimer">
<p><strong>Medical Disclaimer:</strong> This plan is for educational purposes only. Consult with a registered dietitian or healthcare provider before making significant dietary changes.</p>
</div>
</div>

Make it comprehensive, specific, and actionable.`,

            'symptom-checker': `You are a medical AI assistant. Create a comprehensive symptom analysis in HTML format. NEVER provide definitive diagnoses.

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Symptom Analysis Report</h3>

<div class="symptom-summary">
<h4>Symptoms Overview</h4>
<p>Based on your reported symptoms...</p>
</div>

<div class="possible-conditions">
<h4>Possible Conditions to Consider</h4>
<div class="condition-list">
[List 2-3 possible conditions with likelihood indicators]
</div>
</div>

<div class="recommendations">
<h4>Recommended Actions</h4>
<div class="action-priority">
<h5>Immediate Steps:</h5>
<ul>[Self-care measures]</ul>
<h5>When to Seek Care:</h5>
<ul>[Professional care indicators]</ul>
</div>
</div>

<div class="warning-signs">
<h4>Red Flag Symptoms</h4>
<p>Seek immediate medical attention if you experience...</p>
</div>

<div class="resources">
<h4>Additional Resources</h4>
<ul>[Helpful resources and contacts]</ul>
</div>

<div class="disclaimer">
<p><strong>Medical Disclaimer:</strong> This analysis is for informational purposes only and does not constitute medical advice. Always consult healthcare professionals for proper diagnosis and treatment.</p>
</div>
</div>

Be thorough, cautious, and prioritize user safety.`,

            'medicine-advisor': `You are a pharmaceutical AI. Create comprehensive medication guidance in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Medication Analysis & Guidance</h3>

<div class="medication-overview">
<h4>Medication Assessment</h4>
<p>Based on your medication profile...</p>
</div>

<div class="interaction-check">
<h4>Drug Interaction Analysis</h4>
<div class="interaction-results">
[Detailed interaction analysis]
</div>
</div>

<div class="dosage-guidance">
<h4>Dosage & Timing Recommendations</h4>
<ul>[Specific timing and dosage guidance]</ul>
</div>

<div class="side-effects">
<h4>Potential Side Effects & Monitoring</h4>
<div class="monitoring-schedule">
[What to watch for and when]
</div>
</div>

<div class="alternatives">
<h4>Alternative Options</h4>
<p>[Alternative medications or approaches if applicable]</p>
</div>

<div class="safety-tips">
<h4>Medication Safety Tips</h4>
<ul>[Important safety considerations]</ul>
</div>

<div class="disclaimer">
<p><strong>Pharmaceutical Disclaimer:</strong> This guidance is educational only. Always consult your pharmacist or healthcare provider before making medication changes.</p>
</div>
</div>

Prioritize safety and professional consultation.`,

            'health-report': `You are a comprehensive health analyst. Create a detailed health assessment in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Comprehensive Health Assessment</h3>

<div class="health-overview">
<h4>Overall Health Status</h4>
<div class="health-score">
<p>Health Score: [X/100]</p>
<p>Risk Level: [Low/Moderate/High]</p>
</div>
</div>

<div class="risk-factors">
<h4>Identified Risk Factors</h4>
<ul>[Specific risk factors based on responses]</ul>
</div>

<div class="lifestyle-analysis">
<h4>Lifestyle Assessment</h4>
<div class="categories">
<h5>Nutrition: [Grade]</h5>
<h5>Physical Activity: [Grade]</h5>
<h5>Sleep Quality: [Grade]</h5>
<h5>Stress Management: [Grade]</h5>
</div>
</div>

<div class="recommendations">
<h4>Personalized Recommendations</h4>
<div class="priority-actions">
<h5>High Priority (Next 30 days):</h5>
<ul>[Immediate actions]</ul>
<h5>Medium Priority (Next 3 months):</h5>
<ul>[Medium-term goals]</ul>
<h5>Long-term Goals (6+ months):</h5>
<ul>[Long-term strategies]</ul>
</div>
</div>

<div class="preventive-care">
<h4>Preventive Care Schedule</h4>
<ul>[Recommended screenings and check-ups]</ul>
</div>

<div class="disclaimer">
<p><strong>Health Disclaimer:</strong> This assessment is for educational purposes. Regular medical check-ups and professional healthcare guidance are essential.</p>
</div>
</div>

Base all recommendations on evidence-based medicine.`,

            'fitness-coach': `You are a certified personal trainer AI. Create a comprehensive fitness program in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Your Personalized Fitness Program</h3>

<div class="fitness-assessment">
<h4>Fitness Assessment Summary</h4>
<p>Based on your current fitness level and goals...</p>
</div>

<div class="workout-schedule">
<h4>Weekly Workout Schedule</h4>
<div class="weekly-plan">
[Detailed 7-day workout plan with specific exercises, sets, reps, and duration]
</div>
</div>

<div class="exercise-library">
<h4>Exercise Instructions</h4>
<div class="exercise-details">
[Detailed form cues and technique tips for each exercise]
</div>
</div>

<div class="progression-plan">
<h4>4-Week Progression Plan</h4>
<ul>
<li>Week 1-2: [Beginner phase details]</li>
<li>Week 3-4: [Intermediate phase details]</li>
</ul>
</div>

<div class="equipment-alternatives">
<h4>Equipment Alternatives</h4>
<p>[Home workout modifications and equipment substitutions]</p>
</div>

<div class="recovery-plan">
<h4>Recovery & Rest Guidelines</h4>
<ul>[Rest day activities and recovery strategies]</ul>
</div>

<div class="safety-tips">
<h4>Safety Considerations</h4>
<ul>[Important safety guidelines and injury prevention]</ul>
</div>

<div class="disclaimer">
<p><strong>Fitness Disclaimer:</strong> Consult with a healthcare provider before starting any new exercise program. Stop immediately if you experience pain or discomfort.</p>
</div>
</div>

Prioritize safety and gradual progression.`,

            'mental-health': `You are a mental health support AI. Create compassionate mental wellness guidance in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Mental Wellness Assessment & Support</h3>

<div class="wellness-overview">
<h4>Current Mental Health Status</h4>
<p>Based on your responses, here's what I observe...</p>
</div>

<div class="coping-strategies">
<h4>Personalized Coping Strategies</h4>
<div class="immediate-techniques">
<h5>Immediate Relief Techniques:</h5>
<ul>[Quick stress relief methods]</ul>
<h5>Daily Practices:</h5>
<ul>[Regular mental health practices]</ul>
</div>
</div>

<div class="mindfulness-section">
<h4>Mindfulness & Relaxation</h4>
<div class="techniques">
[Specific mindfulness exercises and relaxation techniques]
</div>
</div>

<div class="lifestyle-factors">
<h4>Lifestyle Recommendations</h4>
<ul>[Sleep, nutrition, exercise, and social connection advice]</ul>
</div>

<div class="warning-signs">
<h4>When to Seek Professional Help</h4>
<p>Consider professional support if you experience...</p>
</div>

<div class="resources">
<h4>Mental Health Resources</h4>
<ul>
<li>Crisis Hotline: 988 (Suicide & Crisis Lifeline)</li>
<li>Text HOME to 741741 (Crisis Text Line)</li>
<li>[Additional local resources]</li>
</ul>
</div>

<div class="disclaimer">
<p><strong>Mental Health Disclaimer:</strong> This is not a substitute for professional mental health care. If you're experiencing a mental health crisis, please seek immediate professional help.</p>
</div>
</div>

Be compassionate, supportive, and prioritize safety.`,

            'sleep-analyzer': `You are a sleep medicine specialist AI. Create comprehensive sleep analysis in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Sleep Quality Analysis & Optimization</h3>

<div class="sleep-assessment">
<h4>Sleep Pattern Analysis</h4>
<div class="sleep-score">
<p>Sleep Quality Score: [X/100]</p>
<p>Primary Issues: [List main sleep concerns]</p>
</div>
</div>

<div class="sleep-hygiene">
<h4>Sleep Hygiene Recommendations</h4>
<div class="hygiene-checklist">
<h5>Bedtime Routine:</h5>
<ul>[Specific bedtime routine steps]</ul>
<h5>Sleep Environment:</h5>
<ul>[Room temperature, lighting, noise control]</ul>
</div>
</div>

<div class="lifestyle-factors">
<h4>Lifestyle Modifications</h4>
<ul>
<li>Caffeine Timing: [Specific recommendations]</li>
<li>Exercise Schedule: [Best times for physical activity]</li>
<li>Screen Time: [Digital device guidelines]</li>
<li>Meal Timing: [Eating schedule for better sleep]</li>
</ul>
</div>

<div class="relaxation-techniques">
<h4>Relaxation & Wind-Down Techniques</h4>
<div class="techniques-list">
[Specific relaxation methods and breathing exercises]
</div>
</div>

<div class="sleep-schedule">
<h4>Optimal Sleep Schedule</h4>
<p>Recommended bedtime: [Time]</p>
<p>Recommended wake time: [Time]</p>
<p>Target sleep duration: [Hours]</p>
</div>

<div class="warning-signs">
<h4>When to Consult a Sleep Specialist</h4>
<p>Consider professional evaluation if you experience...</p>
</div>

<div class="disclaimer">
<p><strong>Sleep Medicine Disclaimer:</strong> This analysis is educational only. Persistent sleep problems may require professional evaluation for sleep disorders.</p>
</div>
</div>

Focus on evidence-based sleep medicine principles.`,

            'chronic-condition': `You are a chronic disease management AI. Create comprehensive condition management guidance in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Chronic Condition Management Plan</h3>

<div class="condition-overview">
<h4>Condition Assessment</h4>
<p>Based on your condition and current management...</p>
</div>

<div class="management-strategies">
<h4>Disease-Specific Management</h4>
<div class="daily-management">
<h5>Daily Management Tasks:</h5>
<ul>[Specific daily activities and monitoring]</ul>
<h5>Weekly/Monthly Tasks:</h5>
<ul>[Regular monitoring and assessments]</ul>
</div>
</div>

<div class="medication-management">
<h4>Medication Adherence Plan</h4>
<div class="med-schedule">
[Medication timing, reminders, and tracking strategies]
</div>
</div>

<div class="lifestyle-modifications">
<h4>Lifestyle Modifications</h4>
<ul>
<li>Dietary Recommendations: [Specific to condition]</li>
<li>Exercise Guidelines: [Safe activity levels]</li>
<li>Stress Management: [Condition-specific strategies]</li>
</ul>
</div>

<div class="symptom-monitoring">
<h4>Symptom Monitoring & Tracking</h4>
<p>Key symptoms to monitor: [List with frequency]</p>
<p>Warning signs requiring immediate attention: [Critical symptoms]</p>
</div>

<div class="care-coordination">
<h4>Healthcare Team Coordination</h4>
<ul>[Recommended specialists and appointment schedules]</ul>
</div>

<div class="emergency-plan">
<h4>Emergency Action Plan</h4>
<p>When to seek immediate care: [Specific triggers]</p>
<p>Emergency contacts: [Healthcare providers]</p>
</div>

<div class="disclaimer">
<p><strong>Medical Management Disclaimer:</strong> This plan supplements but does not replace professional medical care. Always follow your healthcare team's specific instructions.</p>
</div>
</div>

Emphasize collaboration with healthcare teams.`,

            'womens-health': `You are a women's health specialist AI. Create comprehensive women's health guidance in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Women's Health Assessment & Guidance</h3>

<div class="health-overview">
<h4>Health Status Overview</h4>
<p>Based on your responses and current life stage...</p>
</div>

<div class="reproductive-health">
<h4>Reproductive Health Guidance</h4>
<div class="cycle-management">
<h5>Menstrual Cycle Management:</h5>
<ul>[Cycle tracking and symptom management]</ul>
<h5>Hormonal Balance:</h5>
<ul>[Natural hormone support strategies]</ul>
</div>
</div>

<div class="life-stage-guidance">
<h4>Life Stage-Specific Recommendations</h4>
<div class="stage-specific">
[Recommendations based on age/life stage: reproductive years, pregnancy planning, menopause, etc.]
</div>
</div>

<div class="preventive-care">
<h4>Preventive Care Schedule</h4>
<ul>
<li>Annual Gynecological Exam: [Timing]</li>
<li>Breast Health Screening: [Schedule]</li>
<li>Cervical Cancer Screening: [Frequency]</li>
<li>Bone Density Testing: [When appropriate]</li>
</ul>
</div>

<div class="nutritional-support">
<h4>Nutritional & Lifestyle Support</h4>
<ul>
<li>Iron Requirements: [Specific recommendations]</li>
<li>Calcium & Vitamin D: [Daily targets]</li>
<li>Folate/Folic Acid: [Importance and sources]</li>
<li>Exercise Guidelines: [Women-specific considerations]</li>
</ul>
</div>

<div class="symptom-management">
<h4>Common Symptom Management</h4>
<div class="symptom-strategies">
[PMS, menstrual pain, hormonal changes, etc.]
</div>
</div>

<div class="warning-signs">
<h4>When to Seek Medical Care</h4>
<p>Contact your healthcare provider if you experience...</p>
</div>

<div class="disclaimer">
<p><strong>Women's Health Disclaimer:</strong> This guidance is educational only. Regular gynecological care and personalized medical advice are essential for optimal women's health.</p>
</div>
</div>

Focus on evidence-based women's health practices.`,

            'risk-predictor': `You are a preventive medicine AI. Create comprehensive health risk analysis in HTML format:

STRUCTURE YOUR RESPONSE AS:
<div class="ai-response">
<h3>Health Risk Assessment & Prevention Plan</h3>

<div class="risk-overview">
<h4>Overall Risk Profile</h4>
<div class="risk-summary">
<p>Overall Risk Level: [Low/Moderate/High]</p>
<p>Primary Risk Factors: [List top 3-5 factors]</p>
</div>
</div>

<div class="specific-risks">
<h4>Specific Health Risk Analysis</h4>
<div class="risk-categories">
<h5>Cardiovascular Risk: [Percentage/Level]</h5>
<ul>[Specific risk factors and timeline]</ul>
<h5>Diabetes Risk: [Percentage/Level]</h5>
<ul>[Risk factors and prevention strategies]</ul>
<h5>Cancer Risk: [Assessment based on family history]</h5>
<ul>[Screening recommendations]</ul>
</div>
</div>

<div class="prevention-strategies">
<h4>Personalized Prevention Plan</h4>
<div class="immediate-actions">
<h5>Immediate Actions (Next 30 days):</h5>
<ul>[High-priority prevention steps]</ul>
<h5>Short-term Goals (3-6 months):</h5>
<ul>[Lifestyle modifications]</ul>
<h5>Long-term Strategies (1+ years):</h5>
<ul>[Ongoing prevention measures]</ul>
</div>
</div>

<div class="screening-schedule">
<h4>Recommended Screening Timeline</h4>
<ul>
<li>Blood Pressure: [Frequency]</li>
<li>Cholesterol: [Next screening date]</li>
<li>Blood Sugar: [Testing schedule]</li>
<li>Cancer Screenings: [Specific recommendations]</li>
</ul>
</div>

<div class="lifestyle-modifications">
<h4>Risk-Reducing Lifestyle Changes</h4>
<ul>
<li>Dietary Modifications: [Specific recommendations]</li>
<li>Physical Activity: [Target goals]</li>
<li>Stress Management: [Strategies]</li>
<li>Sleep Optimization: [Guidelines]</li>
</ul>
</div>

<div class="warning-signs">
<h4>Early Warning Signs to Monitor</h4>
<p>Watch for these symptoms and seek medical attention...</p>
</div>

<div class="disclaimer">
<p><strong>Risk Assessment Disclaimer:</strong> This assessment is based on general risk factors and is not a substitute for professional medical evaluation. Consult healthcare providers for personalized risk assessment.</p>
</div>
</div>

Base all recommendations on established clinical guidelines.`
        };

        const basePrompt = systemPrompts[featureId] || systemPrompts['health-report'];
        
        // Format user responses
        const formattedResponses = responses.map((response, index) => {
            return `Question ${index + 1}: ${response.question_text}\nAnswer: ${response.response_value}`;
        }).join('\n\n');

        return `${basePrompt}\n\nUser Assessment Responses:\n${formattedResponses}\n\nPlease provide a comprehensive, personalized analysis and recommendations based on the above information. Format your response clearly with sections for easy reading.`;
    }

    // Call DeepSeek API
    async callDeepSeekAPI(prompt, featureId) {
        const requestBody = {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: "You are a healthcare AI assistant providing evidence-based health guidance. Always prioritize user safety and recommend professional medical consultation when appropriate."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
        };

        try {
            const response = await axios.post(this.apiUrl, requestBody, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: this.timeout
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                return {
                    response: response.data.choices[0].message.content,
                    tokensUsed: response.data.usage?.total_tokens || 0,
                    confidence: 0.85 // Base confidence for successful API calls
                };
            } else {
                throw new Error('Invalid API response format');
            }

        } catch (error) {
            if (error.response) {
                console.error('❌ DeepSeek API Error:', error.response.data);
                throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error('❌ DeepSeek Network Error:', error.message);
                throw new Error('Network error: Unable to reach DeepSeek API');
            } else {
                console.error('❌ DeepSeek Request Error:', error.message);
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    // Fallback responses when AI is unavailable
    getFallbackResponse(featureId) {
        const fallbackResponses = {
            'diet-planner': `# Personalized Diet Plan - Demo Mode

## Important Notice
Our AI analysis service is temporarily unavailable. Please consult with a registered dietitian for personalized nutrition advice.

## General Healthy Eating Guidelines
- Eat a variety of colorful fruits and vegetables
- Choose whole grains over refined grains
- Include lean proteins (fish, poultry, legumes, nuts)
- Limit processed foods and added sugars
- Stay hydrated with plenty of water
- Practice portion control

## Next Steps
1. Consult a registered dietitian
2. Track your food intake for a week
3. Schedule regular meal times
4. Plan meals and snacks in advance

*Disclaimer: This is general information only and should not replace professional medical or nutritional advice.*`,

            'symptom-checker': `# Symptom Assessment - Demo Mode

## Important Notice
Our AI symptom analysis is temporarily unavailable. For health concerns, please:

## Immediate Actions
- If experiencing severe symptoms: Call emergency services
- For urgent concerns: Contact your healthcare provider
- For general questions: Schedule an appointment with your doctor

## General Health Resources
- Emergency: 911
- Poison Control: 1-800-222-1222
- Crisis Text Line: Text HOME to 741741
- Telehealth Services: Contact your healthcare provider

## Self-Care Reminders
- Monitor your symptoms
- Stay hydrated
- Get adequate rest
- Follow up with healthcare providers

*Disclaimer: This tool is not a substitute for professional medical advice, diagnosis, or treatment.*`,

            'default': `# Health Assessment Results - Demo Mode

## Important Notice
Our AI analysis service is temporarily unavailable. Please consult with appropriate healthcare professionals for personalized advice.

## General Health Recommendations
- Maintain a balanced diet
- Exercise regularly (as appropriate for your condition)
- Get adequate sleep (7-9 hours per night)
- Manage stress effectively
- Stay hydrated
- Follow up with healthcare providers regularly

## Next Steps
1. Schedule appointments with relevant healthcare providers
2. Keep a health journal to track symptoms and progress
3. Follow established treatment plans
4. Seek emergency care if needed

*Disclaimer: This is general information only and should not replace professional medical advice.*`
        };

        return fallbackResponses[featureId] || fallbackResponses['default'];
    }

    // Validate API configuration
    isConfigured() {
        return this.apiKey && this.apiKey !== 'your_deepseek_api_key_here';
    }

    // Test API connection
    async testConnection() {
        try {
            const testPrompt = "Hello, this is a connection test. Please respond with 'Connection successful'.";
            const response = await this.callDeepSeekAPI(testPrompt, 'test');
            return {
                success: true,
                message: 'DeepSeek API connection successful',
                response: response.response
            };
        } catch (error) {
            return {
                success: false,
                message: 'DeepSeek API connection failed',
                error: error.message
            };
        }
    }
}

// Export singleton instance
const aiService = new AIService();
module.exports = aiService; 