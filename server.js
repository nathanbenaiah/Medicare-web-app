const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// AI Chat Configuration
const AI_CONFIG = {
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-placeholder', // Set your actual API key
    model: 'deepseek-chat',
    maxTokens: 1000,
    temperature: 0.7
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'MediCare+ AI Chat Server'
    });
});

// AI Chat Endpoint
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message is required',
                fallback: 'Please provide a message to get AI assistance.'
            });
        }

        console.log(`📨 Received chat message: ${message.substring(0, 50)}...`);

        // Build conversation history
        const messages = [
            {
                role: 'system',
                content: `You are MediCare+, an AI health assistant for a Sri Lankan healthcare platform. You provide helpful, accurate health information in simple, easy-to-understand language. 

Key guidelines:
- Always speak in plain English, avoid medical jargon
- Provide general health information and wellness tips
- Encourage users to consult healthcare professionals for medical decisions
- Be empathetic and supportive
- Focus on prevention and healthy lifestyle advice
- Mention MediCare+ features when relevant (appointments, assessments, reminders)
- Always add medical disclaimers for health advice

Important: Never provide specific medical diagnoses or replace professional medical advice.`
            }
        ];

        // Add conversation history if provided
        if (context && context.previousMessages) {
            messages.push(...context.previousMessages.slice(-4));
        }

        // Add current user message
        messages.push({
            role: 'user',
            content: message
        });

        // Check if API key is configured
        if (!AI_CONFIG.apiKey || AI_CONFIG.apiKey === 'sk-placeholder' || AI_CONFIG.apiKey === 'sk-your-deepseek-api-key') {
            console.log('🔄 DeepSeek API key not configured, using fallback response...');
            
            // Provide intelligent demo responses based on message content
            const demoResponses = {
                default: "Hello! I'm MediCare+ AI assistant. I'm currently running in demo mode. I can help you with general health questions, schedule appointments, and navigate our platform. Please note that for full AI capabilities, an API key needs to be configured.",
                health: "Based on your health question, I'd recommend consulting with a healthcare professional for personalized advice. In the meantime, you can use our symptom checker or book an appointment through the dashboard.",
                appointment: "I can help you schedule appointments! You can use the 'Book Appointment' feature in your dashboard to schedule with our healthcare providers.",
                symptoms: "For symptom analysis, please try our comprehensive symptom checker available in the assessments section. It provides detailed analysis and recommendations.",
                medication: "For medication-related questions, please consult with your pharmacist or doctor. You can also use our medication reminder feature to stay on track with your prescriptions."
            };
            
            const lowerMessage = message.toLowerCase();
            let response = demoResponses.default;
            
            if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('fever')) {
                response = demoResponses.symptoms;
            } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
                response = demoResponses.appointment;
            } else if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('drug')) {
                response = demoResponses.medication;
            } else if (lowerMessage.includes('health') || lowerMessage.includes('wellness')) {
                response = demoResponses.health;
            }
            
            return res.json({
                success: true,
                response: response + "\n\n📝 *Note: This is a demo response. For full AI capabilities, please configure the DeepSeek API key.*",
                timestamp: new Date().toISOString(),
                model: 'demo-mode',
                demo: true
            });
        }

        // Call DeepSeek API
        const response = await fetch(AI_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                messages: messages,
                max_tokens: AI_CONFIG.maxTokens,
                temperature: AI_CONFIG.temperature,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const aiResponse = data.choices[0].message.content.trim();
            
            console.log(`🤖 AI Response generated successfully`);
            
            res.json({
                success: true,
                response: aiResponse,
                timestamp: new Date().toISOString(),
                model: AI_CONFIG.model,
                usage: data.usage || null
            });
        } else {
            throw new Error('Invalid response format from DeepSeek API');
        }

    } catch (error) {
        console.error('❌ AI Chat Error:', error.message);
        
        // Provide intelligent fallback responses
        const fallbackResponses = [
            "I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to explore MediCare+ features like health assessments and appointment booking.",
            "I'm currently unable to process your request. In the meantime, you can use our symptom checker or browse our health resources.",
            "There seems to be a temporary issue with my AI service. Please try again later, or contact our support team for immediate assistance."
        ];
        
        const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        res.status(200).json({
            success: false,
            error: error.message,
            fallback: fallback,
            timestamp: new Date().toISOString()
        });
    }
});

// Test Endpoint for Development
app.post('/api/test-chat', (req, res) => {
    res.json({
        success: true,
        response: "Hello! This is a test response from MediCare+ AI. The chat system is working correctly. How can I help you with your health today?",
        timestamp: new Date().toISOString(),
        model: 'test-model'
    });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'user-dashboard.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'improved-ai-chat.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        fallback: 'Sorry, something went wrong. Please try again later.'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 MediCare+ AI Chat Server Started
🌐 Server running on: http://localhost:${PORT}
🤖 AI Chat API: http://localhost:${PORT}/api/ai-chat
💚 Health Check: http://localhost:${PORT}/api/health
📱 Dashboard: http://localhost:${PORT}/dashboard
💬 Chat Interface: http://localhost:${PORT}/chat

📝 Note: Make sure to set DEEPSEEK_API_KEY in your .env file
    `);
});

module.exports = app; 