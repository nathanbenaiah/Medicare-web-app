// AI Health Features Configuration
// DeepSeek API and Database Settings

const config = {
    // DeepSeek AI Configuration
    deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY || 'your_deepseek_api_key_here',
        apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
        maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 4000,
        timeout: parseInt(process.env.AI_TIMEOUT) || 30000
    },

    // Database Configuration
    database: {
        path: process.env.DB_PATH || './database/health_assessments.db',
        backupPath: process.env.DB_BACKUP_PATH || './database/backups/',
        enableLogging: process.env.ENABLE_DATABASE_LOGGING === 'true'
    },

    // Server Configuration
    server: {
        port: parseInt(process.env.PORT) || 8000,
        environment: process.env.NODE_ENV || 'development'
    },

    // Feature Flags
    features: {
        enableAI: process.env.ENABLE_AI_FEATURES !== 'false',
        enableResponseCaching: process.env.ENABLE_RESPONSE_CACHING === 'true'
    },

    // Rate Limiting
    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000 // 15 minutes
    },

    // AI System Prompts for Different Features
    systemPrompts: {
        medical: `You are a medical AI assistant providing health guidance. Always prioritize safety and recommend professional medical consultation when appropriate. 
                 Use evidence-based medicine and current medical guidelines. Never provide definitive diagnoses - only suggest possibilities and appropriate next steps.
                 Include appropriate medical disclaimers in all responses.`,
        
        wellness: `You are a wellness coach providing lifestyle and health optimization advice based on evidence-based practices. 
                  Focus on sustainable, realistic recommendations that improve overall health and wellbeing.
                  Always encourage professional consultation for medical concerns.`,
        
        nutrition: `You are a certified nutritionist AI providing personalized meal planning and dietary guidance. 
                   Consider individual health conditions, preferences, and cultural backgrounds in your recommendations.
                   Include portion sizes, nutritional information, and cooking instructions where appropriate.`,

        fitness: `You are a certified fitness trainer AI providing personalized workout plans and exercise guidance.
                 Consider individual fitness levels, limitations, and goals. Always emphasize safety and proper form.
                 Recommend gradual progression and injury prevention strategies.`,

        mental: `You are a mental health support AI providing compassionate guidance and coping strategies.
                Always prioritize user safety. If signs of crisis or severe mental health issues are detected,
                immediately provide crisis resources and recommend professional help. Be supportive and non-judgmental.`
    }
};

module.exports = config; 