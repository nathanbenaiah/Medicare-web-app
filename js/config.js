// AI Health Assistant Configuration
// This file contains your DeepSeek API configuration

const AI_CONFIG = {
    // Your DeepSeek API Keys (Primary and Backup for failover)
    DEEPSEEK_API_KEYS: [
        'sk-b8184eae23dc4da58b48abf95892d4c0', // Primary key
        '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' // Backup key
    ],
    
    // Current active key (will rotate on failures)
    CURRENT_KEY_INDEX: 0,
    
    // DeepSeek Settings
    API_BASE_URL: 'https://api.deepseek.com/v1',
    MODEL: 'deepseek-chat',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.2, // Lower for medical accuracy
    
    // Feature Flags
    ENABLE_REAL_AI: true,
    ENABLE_CHARTS: true,
    ENABLE_PDF_ENHANCED: true,
    ENABLE_API_FAILOVER: true, // New: Enable automatic failover
    
    // Cost Control (DeepSeek is much cheaper!)
    MAX_MONTHLY_SPEND: 20, // USD limit (DeepSeek is ~10x cheaper)
    WARN_AT_SPEND: 15, // USD warning threshold
    
    // Medical Settings
    MEDICAL_DISCLAIMER: true,
    REQUIRE_PROFESSIONAL_CONSULTATION: true,
    EMERGENCY_CONTACT_ENABLED: true,
    
    // Helper function to get current API key
    getCurrentApiKey() {
        return this.DEEPSEEK_API_KEYS[this.CURRENT_KEY_INDEX];
    },
    
    // Helper function to rotate to next API key on failure
    rotateApiKey() {
        this.CURRENT_KEY_INDEX = (this.CURRENT_KEY_INDEX + 1) % this.DEEPSEEK_API_KEYS.length;
        console.log(`🔄 Switched to backup API key (Index: ${this.CURRENT_KEY_INDEX})`);
        return this.getCurrentApiKey();
    }
};

// Auto-configure the system
if (typeof window !== 'undefined') {
    // Store in localStorage for browser access
    localStorage.setItem('deepseek_api_keys', JSON.stringify(AI_CONFIG.DEEPSEEK_API_KEYS));
    localStorage.setItem('deepseek_current_key', AI_CONFIG.getCurrentApiKey());
    localStorage.setItem('ai_config', JSON.stringify(AI_CONFIG));
    
    console.log('✅ DeepSeek API Keys configured successfully!');
    console.log(`🔑 Primary Key: ${AI_CONFIG.DEEPSEEK_API_KEYS[0].substring(0, 20)}...`);
    console.log(`🔑 Backup Key: ${AI_CONFIG.DEEPSEEK_API_KEYS[1].substring(0, 20)}...`);
    console.log('🤖 Real AI analysis enabled with DeepSeek');
    console.log('📊 Advanced charts enabled');
    console.log('🔄 API failover system enabled');
    console.log('💰 Cost-effective AI solution activated');
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
} 