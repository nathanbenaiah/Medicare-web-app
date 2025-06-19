// Environment Configuration for MediCare+
// Set environment variables for the application

// Primary DeepSeek API Configuration
process.env.DEEPSEEK_API_KEY = 'sk-b8184eae23dc4da58b48abf95892d4c0';
process.env.DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
process.env.DEEPSEEK_MODEL = 'deepseek-chat';
process.env.AI_TEMPERATURE = '0.3';
process.env.AI_MAX_TOKENS = '4000';
process.env.AI_TIMEOUT = '30000';

// HuggingFace Fallback Configuration
// Uncomment and set your HuggingFace token for additional reliability
// process.env.HF_TOKEN = 'hf_your_token_here';
// process.env.HUGGINGFACE_TOKEN = 'hf_your_token_here'; // Alternative name

process.env.NODE_ENV = 'development';
process.env.PORT = '8000';

// Supabase Configuration (replace with your actual values if you have them)
process.env.SUPABASE_URL = 'https://your-project.supabase.co';
process.env.SUPABASE_ANON_KEY = 'your-anon-key';

console.log('🔧 Environment configuration loaded');
console.log('🔑 DeepSeek API Key configured:', process.env.DEEPSEEK_API_KEY ? 'Yes' : 'No');
console.log('🤗 HuggingFace Token configured:', process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN ? 'Yes' : 'No');

module.exports = {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_API_URL: process.env.DEEPSEEK_API_URL,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
    HF_TOKEN: process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN,
    AI_TEMPERATURE: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
    AI_MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS) || 4000,
    AI_TIMEOUT: parseInt(process.env.AI_TIMEOUT) || 30000,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
}; 