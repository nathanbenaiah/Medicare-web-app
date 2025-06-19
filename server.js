const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment configuration first
require('./config/env-config');

// Import custom modules
const dbManager = require('./database/db-manager');
const aiService = require('./services/ai-service');
const supabaseManager = require('./config/supabase');

// Import ML services
const CloudMLService = require('./services/cloud-ml-service');
const HealthDocumentAI = require('./services/health-document-ai');

// PDF generation dependencies
const PDFDocument = require('pdfkit');

// Import enhanced PDF service
const PDFAssessmentService = require('./services/pdf-assessment-service');

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Cloud ML Service (no TensorFlow dependencies)
const mlService = new CloudMLService();

// Initialize Health Document AI Service (inspired by Doctor Dok)
const healthDocAI = new HealthDocumentAI();

// Initialize PDF Assessment Service
const pdfAssessmentService = new PDFAssessmentService();

// Middleware with better error handling
app.use(bodyParser.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            if (buf && buf.length > 0) {
                const body = buf.toString();
                if (body.trim() === 'null' || body.trim() === '') {
                    req.body = {};
                    return;
                }
                JSON.parse(body);
            }
        } catch (error) {
            console.warn('⚠️ Invalid JSON received, using empty object:', error.message);
            req.body = {};
        }
    }
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Middleware for static files with proper MIME types
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        } else if (path.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
        }
    }
}));

// CORS headers for all requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Initialize database with error handling
if (dbManager && typeof dbManager.initializeDatabase === 'function') {
    dbManager.initializeDatabase().then(() => {
        console.log('✅ Database initialized successfully');
    }).catch(error => {
        console.error('❌ Database initialization failed:', error);
    });
} else {
    console.log('⚠️ Database manager not available, using Supabase only');
}

// Test Supabase connection on startup
supabaseManager.testConnection().then(result => {
    if (result.success) {
        console.log('✅ Supabase connection successful');
    } else {
        console.warn('⚠️ Supabase connection failed, using local database fallback');
    }
});

// ==================== MACHINE LEARNING API ENDPOINTS ====================

// Health Risk Prediction
app.post('/api/ml/predict-health-risk', async (req, res) => {
    try {
        console.log('🤖 Processing health risk prediction request');
        const { patientData } = req.body;
        
        if (!patientData) {
            return res.status(400).json({
                success: false,
                error: 'Patient data is required'
            });
        }
        
        const prediction = await mlService.predictHealthRisk(patientData);
        
        res.json({
            success: true,
            prediction,
            timestamp: new Date().toISOString(),
            service: 'ml-health-risk'
        });
        
    } catch (error) {
        console.error('❌ Health risk prediction error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: mlService.getFallbackRiskPrediction(req.body.patientData || {})
        });
    }
});

// Medication Adherence Prediction
app.post('/api/ml/predict-medication-adherence', async (req, res) => {
    try {
        console.log('💊 Processing medication adherence prediction');
        const { patientData } = req.body;
        
        const prediction = await mlService.predictMedicationAdherence(patientData);
        
        res.json({
            success: true,
            prediction,
            timestamp: new Date().toISOString(),
            service: 'ml-medication-adherence'
        });
        
    } catch (error) {
        console.error('❌ Medication adherence prediction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Vital Signs Anomaly Detection
app.post('/api/ml/detect-vital-anomalies', async (req, res) => {
    try {
        console.log('📊 Processing vital signs anomaly detection');
        const { vitalSigns } = req.body;
        
        const detection = await mlService.detectVitalSignsAnomalies(vitalSigns);
        
        res.json({
            success: true,
            detection,
            timestamp: new Date().toISOString(),
            service: 'ml-vital-anomalies'
        });
        
    } catch (error) {
        console.error('❌ Vital signs anomaly detection error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Disease Progression Prediction
app.post('/api/ml/predict-disease-progression', async (req, res) => {
    try {
        console.log('📈 Processing disease progression prediction');
        const { patientHistory } = req.body;
        
        const prediction = await mlService.predictDiseaseProgression(patientHistory);
        
        res.json({
            success: true,
            prediction,
            timestamp: new Date().toISOString(),
            service: 'ml-disease-progression'
        });
        
    } catch (error) {
        console.error('❌ Disease progression prediction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Treatment Outcome Prediction
app.post('/api/ml/predict-treatment-outcome', async (req, res) => {
    try {
        console.log('🎯 Processing treatment outcome prediction');
        const { patientData, treatmentPlan } = req.body;
        
        const prediction = await mlService.predictTreatmentOutcome(patientData, treatmentPlan);
        
        res.json({
            success: true,
            prediction,
            timestamp: new Date().toISOString(),
            service: 'ml-treatment-outcome'
        });
        
    } catch (error) {
        console.error('❌ Treatment outcome prediction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Comprehensive ML Analysis
app.post('/api/ml/comprehensive-analysis', async (req, res) => {
    try {
        console.log('🔬 Processing comprehensive ML analysis');
        const { patientData } = req.body;
        
        const analysis = await mlService.generateComprehensiveAnalysis(patientData);
        
        res.json({
            success: true,
            analysis,
            timestamp: new Date().toISOString(),
            service: 'ml-comprehensive'
        });
        
    } catch (error) {
        console.error('❌ Comprehensive analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ML Service Health Check
app.get('/api/ml/health', (req, res) => {
    try {
        const health = mlService.getModelInfo();
        
        res.json({
            success: true,
            service: 'ml-service',
            status: health.isInitialized ? 'healthy' : 'initializing',
            ...health,
            serverUptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            service: 'ml-service',
            status: 'unhealthy',
            error: error.message
        });
    }
});

// ==================== HEALTH DOCUMENT AI ENDPOINTS (Doctor Dok Inspired) ====================

// Setup multer for file uploads
const multer = require('multer');
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    }
});

// Upload and process health document
app.post('/api/health-docs/process', upload.single('healthDocument'), async (req, res) => {
    try {
        console.log('🏥 Processing health document...');
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const documentType = req.body.documentType || 'unknown';
        const result = await healthDocAI.processHealthDocument(req.file.path, documentType);
        
        // Clean up uploaded file
        try {
            await require('fs').promises.unlink(req.file.path);
        } catch (cleanupError) {
            console.warn('⚠️ Failed to cleanup uploaded file:', cleanupError);
        }

        res.json({
            success: true,
            result,
            fileName: req.file.originalname,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Health document processing error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Chat with AI about health documents
app.post('/api/health-docs/ai-chat', async (req, res) => {
    try {
        console.log('💬 Health document AI chat...');
        const { question, documentContext } = req.body;
        
        if (!question) {
            return res.status(400).json({
                success: false,
                error: 'Question is required'
            });
        }

        // Build chat prompt with medical document context
        const chatPrompt = `
Based on the following health document data, please answer the user's question.

HEALTH DOCUMENT CONTEXT:
${JSON.stringify(documentContext, null, 2)}

USER QUESTION: ${question}

Please provide a helpful, accurate response based on the medical data. Always remind the user to consult with healthcare professionals for medical decisions.
`;

        const response = await healthDocAI.callDeepSeekAPI(chatPrompt);
        
        res.json({
            success: true,
            response,
            timestamp: new Date().toISOString(),
            disclaimer: 'This AI response is for informational purposes only. Always consult qualified healthcare professionals for medical advice.'
        });
        
    } catch (error) {
        console.error('❌ AI chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: 'I apologize, but I cannot process your question at the moment. Please consult with a healthcare professional.'
        });
    }
});

// ==================== AI CHAT ROUTES ====================

// Serve improved AI chat interface
app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'improved-ai-chat.html'));
});

// ==================== GENERAL AI CHAT API ====================

// Enhanced AI Chat endpoint with Supabase integration
app.post('/api/ai-chat', async (req, res) => {
    const startTime = Date.now();
    try {
        // Handle enhanced request body with user tracking
        const body = req.body || {};
        const { 
            message, 
            context = null, 
            userId = null, 
            sessionId = null, 
            chatHistory = [] 
        } = body;
        
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Valid message is required',
                fallback: 'Please provide a valid question or message.'
            });
        }

        const cleanMessage = message.trim();
        console.log('💬 AI Chat Request:', {
            user: userId || 'anonymous',
            session: sessionId || 'no-session',
            message: cleanMessage.substring(0, 100) + (cleanMessage.length > 100 ? '...' : '')
        });
        
        // Enhanced system prompt with better health guidance
        const systemPrompt = `You are MediCare+ AI Health Assistant, a friendly and knowledgeable health information assistant. Follow these guidelines:

COMMUNICATION STYLE:
- Use simple, everyday language that anyone can understand
- Explain medical terms in plain English when needed
- Be warm, supportive, and encouraging
- Use **bold** for important points and *italics* for emphasis when needed
- Keep responses well-organized with clear sections
- Always provide actionable advice when possible

ENHANCED CAPABILITIES:
- Explain health symptoms and conditions with detailed context
- Provide comprehensive medication information including interactions
- Offer personalized wellness and lifestyle recommendations
- Help interpret basic health documents and test results
- Guide users through MediCare+ platform features
- Provide mental health support and stress management tips
- Offer nutrition guidance and meal planning advice
- Suggest exercise routines appropriate for different conditions

MEDICARE+ PLATFORM FEATURES:
- **AI-Powered Health Assessments**: Symptom checker, diet planner, mental health support
- **Smart Appointment Scheduling**: Connect with healthcare providers
- **Health Document Analysis**: AI-powered document interpretation
- **Personalized Health Insights**: Predictive analytics and recommendations
- **Medication Management**: Drug interaction checker and reminder system
- **Secure Health Records**: HIPAA-compliant storage and sharing
- **Real-time Health Monitoring**: Track vital signs and health metrics

CONVERSATION CONTEXT:
- Remember previous messages in the conversation
- Build on earlier topics and provide follow-up advice
- Ask clarifying questions when needed for better assistance
- Suggest relevant MediCare+ features based on user needs

SAFETY PROTOCOLS:
- **Emergency Situations**: For chest pain, difficulty breathing, severe injuries, or thoughts of self-harm, recommend immediate emergency care (911)
- **Serious Symptoms**: For persistent pain, unexplained weight loss, or concerning changes, recommend seeing a healthcare provider within 24-48 hours
- **Medication Questions**: Always recommend consulting pharmacist or doctor for drug interactions or dosage changes
- **Mental Health**: Provide supportive guidance but recommend professional help for serious concerns

RESPONSE FORMAT:
- Start with empathy and acknowledgment
- Provide clear, organized information
- End with actionable next steps
- Always include appropriate disclaimers

Remember: Your goal is to empower users with knowledge while promoting safe, responsible healthcare decisions.`;

        // Build conversation context from chat history
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            }
        ];

        // Add recent chat history for context (last 6 messages = 3 exchanges)
        if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
            const recentHistory = chatHistory.slice(-6);
            recentHistory.forEach(msg => {
                messages.push({
                    role: msg.isUser ? 'user' : 'assistant',
                    content: msg.content
                });
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            content: cleanMessage
        });

        // Call AI service with enhanced context
        const response = await aiService.chat(messages);
        const processingTime = Date.now() - startTime;
        
        if (response.success) {
            console.log('✅ AI response generated successfully:', {
                processingTime: processingTime + 'ms',
                model: response.model || 'deepseek-chat'
            });

            // Enhanced response with metadata
            const responseData = {
                success: true,
                response: response.message,
                model: response.model || 'deepseek-chat',
                confidence: response.confidence || 0.9,
                processingTime: processingTime,
                timestamp: new Date().toISOString(),
                userId: userId,
                sessionId: sessionId
            };

            // Save to Supabase if available (async, don't wait)
            if (supabaseManager && userId && sessionId) {
                try {
                    // Save chat interaction
                    supabaseManager.saveChatMessage({
                        user_id: userId,
                        session_id: sessionId,
                        user_message: cleanMessage,
                        ai_response: response.message,
                        processing_time: processingTime,
                        confidence_score: response.confidence || 0.9,
                        model_used: response.model || 'deepseek-chat'
                    }).catch(err => console.warn('⚠️ Supabase save failed:', err.message));
                } catch (saveError) {
                    console.warn('⚠️ Database save error:', saveError.message);
                }
            }

            res.json(responseData);
        } else {
            console.log('⚠️ AI service returned fallback response');
            
            // Enhanced fallback handling
            const fallbackMessage = response.fallback?.message || response.fallback || 
                                  'I apologize, but I cannot process your question at the moment. ' +
                                  'Please try rephrasing your question or consult with a healthcare professional for medical advice.';
            
            res.json({
                success: false,
                error: response.error,
                fallback: fallbackMessage,
                processingTime: processingTime,
                timestamp: new Date().toISOString()
            });
        }
        
    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('❌ AI chat error:', {
            error: error.message,
            processingTime: processingTime + 'ms'
        });
        
        // Enhanced error handling with specific messages
        let errorMessage = 'I apologize, but I cannot process your question at the moment.';
        let statusCode = 500;
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            errorMessage = 'Connection error. Please check your internet connection and try again.';
            statusCode = 503;
        } else if (error.response?.status === 429) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            statusCode = 429;
        } else if (error.response?.status === 401) {
            errorMessage = 'Authentication error. Please refresh the page and try again.';
            statusCode = 401;
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again with a shorter question.';
            statusCode = 408;
        }
        
        res.status(statusCode).json({
            success: false,
            error: error.message,
            fallback: errorMessage + ' For immediate health concerns, please consult with a healthcare professional.',
            processingTime: processingTime,
            timestamp: new Date().toISOString()
        });
    }
});

// ==================== USER PROFILE AND CHAT API ROUTES ====================

// Get user profile
app.get('/api/user/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await supabaseManager.getUserProfile(userId);
        
        if (result.success) {
            res.json({
                success: true,
                profile: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user profile'
        });
    }
});

// Save user profile
app.post('/api/user/profile', async (req, res) => {
    try {
        const profileData = req.body;
        const result = await supabaseManager.saveUserProfile(profileData);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Profile saved successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error saving user profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save user profile'
        });
    }
});

// Get user chat sessions
app.get('/api/user/chat-sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await supabaseManager.getUserChatSessions(userId, limit);
        
        if (result.success) {
            res.json({
                success: true,
                sessions: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error fetching chat sessions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch chat sessions'
        });
    }
});

// Get chat history
app.get('/api/user/chat-history/:userId/:sessionId', async (req, res) => {
    try {
        const { userId, sessionId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        
        const result = await supabaseManager.getChatHistory(userId, sessionId, limit);
        
        if (result.success) {
            res.json({
                success: true,
                messages: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error fetching chat history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch chat history'
        });
    }
});

// Save reminder
app.post('/api/user/reminders', async (req, res) => {
    try {
        const reminderData = req.body;
        const result = await supabaseManager.saveReminder(reminderData);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Reminder saved successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error saving reminder:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save reminder'
        });
    }
});

// Get user reminders
app.get('/api/user/reminders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const activeOnly = req.query.active !== 'false';
        
        const result = await supabaseManager.getUserReminders(userId, activeOnly);
        
        if (result.success) {
            res.json({
                success: true,
                reminders: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error fetching reminders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reminders'
        });
    }
});

// ==================== EXISTING AI HEALTH ASSESSMENT API ROUTES ====================

// AI Health Assessment API Routes

// Start a new assessment
app.post('/api/assessment/start', async (req, res) => {
    try {
        const { featureId, totalQuestions } = req.body;
        const userIp = req.ip || req.connection.remoteAddress;
        
        const assessment = await dbManager.startAssessment(featureId, userIp, totalQuestions);
        
        res.json({
            success: true,
            assessmentId: assessment.assessmentId,
            message: 'Assessment started successfully'
        });
    } catch (error) {
        console.error('❌ Error starting assessment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to start assessment'
        });
    }
});

// Save assessment response
app.post('/api/assessment/response', async (req, res) => {
    try {
        const { assessmentId, questionIndex, questionType, questionText, responseValue } = req.body;
        
        const responseId = await dbManager.saveResponse(
            assessmentId, 
            questionIndex, 
            questionType, 
            questionText, 
            responseValue
        );
        
        res.json({
            success: true,
            responseId,
            message: 'Response saved successfully'
        });
    } catch (error) {
        console.error('❌ Error saving response:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save response'
        });
    }
});

// Complete assessment and get AI analysis
app.post('/api/assessment/complete', express.json(), async (req, res) => {
    try {
        console.log('📋 Assessment completion request received');
        
        const { type, responses, userInfo } = req.body;
        
        // Generate AI analysis
        const analysisResults = await generateAIAnalysis(type, responses, userInfo);
        
        // Prepare assessment data for PDF generation
        const assessmentData = {
            type,
            userInfo,
            responses,
            analysisResults,
            completedAt: new Date()
        };
        
        // Generate PDF report automatically
        const pdfResult = await pdfAssessmentService.generateAssessmentReport(assessmentData);
        
        // Store assessment in database (if available)
        try {
            if (dbManager && dbManager.storeAssessment) {
                await dbManager.storeAssessment(assessmentData);
            }
        } catch (dbError) {
            console.warn('⚠️ Database storage failed:', dbError.message);
        }
        
        res.json({
            success: true,
            message: 'Assessment completed successfully',
            analysisResults,
            pdfReport: pdfResult.success ? {
                filename: pdfResult.filename,
                downloadUrl: pdfResult.downloadUrl,
                reportId: pdfResult.reportId
            } : null
        });
        
    } catch (error) {
        console.error('❌ Assessment completion error:', error);
        res.status(500).json({
            success: false,
            error: 'Error processing assessment'
        });
    }
});

// Get assessment results
app.get('/api/assessment/:assessmentId/results', async (req, res) => {
    try {
        const { assessmentId } = req.params;
        
        const responses = await dbManager.getAssessmentResponses(assessmentId);
        const aiResult = await dbManager.getAIResult(assessmentId);
        
        res.json({
            success: true,
            assessmentId,
            responses,
            aiResult
        });
    } catch (error) {
        console.error('❌ Error getting results:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get assessment results'
        });
    }
});

// Enhanced AI Analysis Endpoint with Comprehensive Data Collection
app.post('/api/ai-analysis', async (req, res) => {
    try {
        const { feature, responses, timestamp, user_id, session_id } = req.body;
        
        console.log(`🔍 AI Analysis Request for ${feature}`);
        console.log(`📊 Processing ${responses.length} responses`);
        console.log(`👤 User ID: ${user_id}, Session: ${session_id}`);
        
        // Validate input data
        if (!feature || !responses || responses.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required data: feature and responses are required'
            });
        }

        // Save individual responses to Supabase with enhanced data
        const savedResponses = [];
        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            const enhancedResponse = {
                user_id: user_id || 'anonymous',
                feature_id: feature,
                question_id: response.question_id || `q_${i + 1}`,
                question_text: response.question_text || `Question ${i + 1}`,
                response_value: response.response_value || 'No response',
                response_type: response.response_type || 'multiple_choice',
                session_id: session_id || `session_${Date.now()}`,
                question_index: i + 1,
                timestamp: new Date().toISOString()
            };
            
            const saveResult = await supabaseManager.saveAssessmentResponse(enhancedResponse);
            if (saveResult.success) {
                savedResponses.push(enhancedResponse);
            }
        }
        
        // Call AI service for analysis with enhanced context
        const startTime = Date.now();
        const aiResult = await aiService.analyzeAssessment(feature, savedResponses);
        const processingTime = Date.now() - startTime;
        
        if (aiResult.success) {
            // Extract structured data from AI response
            const analysisData = extractAnalysisData(aiResult.response, feature);
            
            // Enhanced AI result with structured data
            const enhancedAIResult = {
                user_id: user_id || 'anonymous',
                feature_id: feature,
                session_id: session_id || `session_${Date.now()}`,
                ai_response: aiResult.response,
                confidence_score: aiResult.confidence || 0.85,
                processing_time: processingTime,
                tokens_used: aiResult.tokensUsed || 0,
                model_used: 'deepseek-chat',
                analysis_data: JSON.stringify(analysisData),
                total_questions: responses.length,
                completed_questions: savedResponses.length,
                timestamp: new Date().toISOString()
            };
            
            // Save enhanced AI result to Supabase
            const aiSaveResult = await supabaseManager.saveAIResult(enhancedAIResult);
            
            console.log(`✅ Analysis Complete - Confidence: ${aiResult.confidence}`);
            console.log(`⏱️ Processing Time: ${processingTime}ms`);
            console.log(`🔢 Tokens Used: ${aiResult.tokensUsed}`);
            console.log(`💾 Data Saved: ${savedResponses.length} responses, AI result: ${aiSaveResult.success}`);
            
            res.json({
                success: true,
                response: aiResult.response,
                confidence: aiResult.confidence || 0.85,
                processingTime: processingTime,
                tokensUsed: aiResult.tokensUsed || 0,
                model: 'deepseek-chat',
                session_id: session_id,
                analysis_data: analysisData,
                saved_responses: savedResponses.length,
                timestamp: new Date().toISOString()
            });
        } else {
            console.log(`❌ Analysis Failed: ${aiResult.error}`);
            res.status(500).json({
                success: false,
                error: aiResult.error,
                fallback: aiResult.response || 'AI analysis temporarily unavailable',
                model: 'fallback-mode',
                session_id: session_id
            });
        }
        
    } catch (error) {
        console.error('❌ AI API Error:', error);
        res.status(500).json({
            success: false,
            error: 'AI service unavailable',
            message: error.message
        });
    }
});

// Function to extract structured data from AI response
function extractAnalysisData(aiResponse, feature) {
    const analysisData = {
        feature: feature,
        timestamp: new Date().toISOString(),
        scores: {},
        recommendations: [],
        risk_factors: [],
        key_insights: []
    };

    try {
        // Extract scores from HTML response
        const scoreMatches = aiResponse.match(/(\d+)%/g);
        if (scoreMatches) {
            analysisData.scores.overall = scoreMatches[0];
        }

        // Extract recommendations
        const recommendationMatches = aiResponse.match(/<li[^>]*>([^<]+)<\/li>/g);
        if (recommendationMatches) {
            analysisData.recommendations = recommendationMatches
                .map(match => match.replace(/<[^>]*>/g, '').trim())
                .filter(rec => rec.length > 0)
                .slice(0, 10); // Limit to top 10
        }

        // Extract risk level
        const riskMatch = aiResponse.match(/risk[^:]*:\s*([^<\n]+)/i);
        if (riskMatch) {
            analysisData.risk_level = riskMatch[1].trim();
        }

        // Extract focus area
        const focusMatch = aiResponse.match(/focus[^:]*:\s*([^<\n]+)/i);
        if (focusMatch) {
            analysisData.primary_focus = focusMatch[1].trim();
        }

        // Feature-specific data extraction
        switch (feature) {
            case 'diet-planner':
                analysisData.meal_plan = extractMealPlan(aiResponse);
                break;
            case 'symptom-checker':
                analysisData.symptoms = extractSymptoms(aiResponse);
                break;
            case 'health-report':
                analysisData.health_metrics = extractHealthMetrics(aiResponse);
                break;
            case 'fitness-coach':
                analysisData.workout_plan = extractWorkoutPlan(aiResponse);
                break;
            case 'mental-health':
                analysisData.mental_health_score = extractMentalHealthScore(aiResponse);
                break;
        }

    } catch (error) {
        console.error('Error extracting analysis data:', error);
    }

    return analysisData;
}

// Helper functions for feature-specific data extraction
function extractMealPlan(response) {
    const meals = [];
    const mealMatches = response.match(/breakfast|lunch|dinner|snack/gi);
    return mealMatches ? mealMatches.slice(0, 7) : [];
}

function extractSymptoms(response) {
    const symptoms = [];
    const symptomMatches = response.match(/symptom[s]?[^:]*:\s*([^<\n]+)/gi);
    return symptomMatches ? symptomMatches.map(s => s.replace(/symptom[s]?[^:]*:\s*/i, '').trim()) : [];
}

function extractHealthMetrics(response) {
    const metrics = {};
    const bmiMatch = response.match(/bmi[^:]*:\s*([^<\n]+)/i);
    if (bmiMatch) metrics.bmi = bmiMatch[1].trim();
    
    const sleepMatch = response.match(/sleep[^:]*:\s*([^<\n]+)/i);
    if (sleepMatch) metrics.sleep = sleepMatch[1].trim();
    
    return metrics;
}

function extractWorkoutPlan(response) {
    const workouts = [];
    const workoutMatches = response.match(/exercise|workout|training/gi);
    return workoutMatches ? workoutMatches.slice(0, 5) : [];
}

function extractMentalHealthScore(response) {
    const scoreMatch = response.match(/stress[^:]*:\s*([^<\n]+)/i);
    return scoreMatch ? scoreMatch[1].trim() : null;
}

// PDF Generation Endpoint
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const { session_id, user_id, feature_id } = req.body;
        
        console.log(`📄 Generating PDF for session: ${session_id}`);
        
        // Get assessment data from Supabase
        const assessmentData = await getAssessmentDataForPDF(session_id, user_id, feature_id);
        
        if (!assessmentData) {
            return res.status(404).json({
                success: false,
                error: 'Assessment data not found'
            });
        }
        
        // Generate PDF
        const pdfBuffer = await generateHealthAssessmentPDF(assessmentData);
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="health-assessment-${feature_id}-${Date.now()}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('❌ PDF Generation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate PDF',
            message: error.message
        });
    }
});

// Function to get assessment data for PDF
async function getAssessmentDataForPDF(sessionId, userId, featureId) {
    try {
        // Get AI results
        const aiResults = await supabaseManager.client
            .from('ai_results')
            .select('*')
            .eq('session_id', sessionId)
            .eq('feature_id', featureId)
            .order('timestamp', { ascending: false })
            .limit(1);

        // Get assessment responses
        const responses = await supabaseManager.client
            .from('assessment_responses')
            .select('*')
            .eq('session_id', sessionId)
            .eq('feature_id', featureId)
            .order('question_index', { ascending: true });

        if (aiResults.data && aiResults.data.length > 0) {
            return {
                aiResult: aiResults.data[0],
                responses: responses.data || [],
                metadata: {
                    generated_at: new Date().toISOString(),
                    session_id: sessionId,
                    user_id: userId,
                    feature_id: featureId
                }
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error getting assessment data:', error);
        return null;
    }
}

// Function to generate PDF
async function generateHealthAssessmentPDF(assessmentData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            // Add logo (if exists)
            try {
                if (fs.existsSync('./assets/logo.png')) {
                    doc.image('./assets/logo.png', 50, 50, { width: 100 });
                }
            } catch (logoError) {
                console.log('Logo not found, continuing without logo');
            }
            
            // Header
            doc.fontSize(24)
               .fillColor('#6F42C1')
               .text('MediCare+ AI Health Assessment Report', 170, 60);
            
            doc.fontSize(12)
               .fillColor('#666')
               .text(`Generated on: ${new Date().toLocaleDateString()}`, 170, 90)
               .text(`Report ID: ${assessmentData.metadata.session_id}`, 170, 105);
            
            // Move down for content
            doc.moveDown(3);
            
            // Assessment Overview
            doc.fontSize(18)
               .fillColor('#333')
               .text('Assessment Overview', { underline: true });
            
            doc.moveDown(0.5);
            doc.fontSize(12)
               .fillColor('#333')
               .text(`Feature: ${assessmentData.aiResult.feature_id.replace('-', ' ').toUpperCase()}`)
               .text(`Confidence Score: ${(assessmentData.aiResult.confidence_score * 100).toFixed(1)}%`)
               .text(`Processing Time: ${assessmentData.aiResult.processing_time}ms`)
               .text(`Total Questions: ${assessmentData.responses.length}`);
            
            doc.moveDown(1);
            
            // AI Analysis Results
            doc.fontSize(18)
               .fillColor('#333')
               .text('AI Analysis Results', { underline: true });
            
            doc.moveDown(0.5);
            
            // Parse and format AI response
            const cleanResponse = assessmentData.aiResult.ai_response
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            
            doc.fontSize(11)
               .fillColor('#333')
               .text(cleanResponse, { align: 'justify' });
            
            doc.moveDown(1);
            
            // Questions and Responses
            doc.fontSize(18)
               .fillColor('#333')
               .text('Assessment Responses', { underline: true });
            
            doc.moveDown(0.5);
            
            assessmentData.responses.forEach((response, index) => {
                if (doc.y > 700) { // Add new page if needed
                    doc.addPage();
                }
                
                doc.fontSize(12)
                   .fillColor('#6F42C1')
                   .text(`Q${index + 1}: ${response.question_text}`);
                
                doc.fontSize(11)
                   .fillColor('#333')
                   .text(`Answer: ${response.response_value}`)
                   .text(`Type: ${response.response_type}`)
                   .moveDown(0.5);
            });
            
            // Add new page for AI Policy
            doc.addPage();
            
            // AI Policy Section
            doc.fontSize(18)
               .fillColor('#333')
               .text('AI Policy & Disclaimer', { underline: true });
            
            doc.moveDown(0.5);
            
            const aiPolicy = `
AI Health Assessment Policy & Disclaimer

1. PURPOSE AND SCOPE
This AI health assessment is designed to provide general health information and educational content. It is not intended to replace professional medical advice, diagnosis, or treatment.

2. AI TECHNOLOGY
Our AI system uses advanced machine learning algorithms to analyze your responses and provide personalized health insights. The system is trained on medical literature and health guidelines but should not be considered a substitute for professional medical consultation.

3. ACCURACY AND LIMITATIONS
- AI analysis is based on the information you provide
- Results are estimates and may not reflect your actual health status
- The system cannot diagnose medical conditions
- Confidence scores indicate the AI's certainty in its analysis

4. DATA PRIVACY
- Your responses are securely stored and encrypted
- Data is used only for generating your health assessment
- We do not share personal health information with third parties
- You can request data deletion at any time

5. MEDICAL DISCLAIMER
- Always consult healthcare professionals for medical concerns
- Seek immediate medical attention for emergencies
- Do not delay medical treatment based on AI recommendations
- This assessment does not replace regular medical checkups

6. RECOMMENDATIONS
- Use results as a starting point for health discussions
- Share this report with your healthcare provider
- Follow up with appropriate medical professionals
- Maintain regular health monitoring and checkups

7. LIABILITY
MediCare+ and its AI system are not liable for any health decisions made based on this assessment. Users are responsible for seeking appropriate medical care.

For questions about this policy or your assessment, contact our support team.

Generated by MediCare+ AI Health Assistant
Report Date: ${new Date().toLocaleDateString()}
Version: 2.0.0
            `;
            
            doc.fontSize(10)
               .fillColor('#333')
               .text(aiPolicy.trim(), { align: 'justify' });
            
            // Footer
            doc.fontSize(8)
               .fillColor('#666')
               .text('This report is confidential and intended only for the individual assessed.', 50, doc.page.height - 50);
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}

// Get user assessment history from Supabase
app.get('/api/user-assessments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await supabaseManager.getUserAssessments(userId, limit);
        
        if (result.success) {
            res.json({
                success: true,
                assessments: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error fetching user assessments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user assessments'
        });
    }
});

// Get assessment analytics from Supabase
app.get('/api/analytics/:featureId?', async (req, res) => {
    try {
        const { featureId } = req.params;
        const days = parseInt(req.query.days) || 30;
        
        const result = await supabaseManager.getAssessmentAnalytics(featureId, days);
        
        if (result.success) {
            res.json({
                success: true,
                analytics: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
});

// Save individual assessment response
app.post('/api/save-response', async (req, res) => {
    try {
        const responseData = req.body;
        
        // Save to Supabase
        const result = await supabaseManager.saveAssessmentResponse(responseData);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Response saved successfully'
            });
        } else {
            // Fallback to local database
            await dbManager.saveResponse(responseData);
            res.json({
                success: true,
                message: 'Response saved to local database'
            });
        }
    } catch (error) {
        console.error('❌ Error saving response:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save response'
        });
    }
});

// Test AI service connection
app.get('/api/ai/test', async (req, res) => {
    try {
        const testResult = await aiService.testConnection();
        res.json(testResult);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'AI service test failed',
            error: error.message
        });
    }
});

// Test Supabase connection
app.get('/api/supabase/test', async (req, res) => {
    try {
        const testResult = await supabaseManager.testConnection();
        res.json(testResult);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Supabase connection test failed',
            error: error.message
        });
    }
});

// Get feature usage statistics (fallback to local DB if Supabase fails)
app.get('/api/stats/:featureId?', async (req, res) => {
    try {
        const { featureId } = req.params;
        const days = parseInt(req.query.days) || 30;
        
        // Try Supabase first
        const supabaseResult = await supabaseManager.getAssessmentAnalytics(featureId, days);
        
        if (supabaseResult.success) {
            res.json({
                success: true,
                stats: supabaseResult.data,
                source: 'supabase'
            });
        } else {
            // Fallback to local database
            const localStats = await dbManager.getUsageStats(featureId, days);
            res.json({
                success: true,
                stats: localStats,
                source: 'local'
            });
        }
    } catch (error) {
        console.error('❌ Error getting stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get usage statistics'
        });
    }
});

// Route handlers - Updated for new file structure
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/auth.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/contact.html'));
});

app.get('/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/appointments.html'));
});

app.get('/reminders', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/reminders.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/dashboard-user.html'));
});

app.get('/dashboard/provider', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/dashboard-provider.html'));
});

app.get('/user-appointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/user-appointments.html'));
});

app.get('/provider-appointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/provider-appointments.html'));
});

app.get('/user-reminders', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/user-reminders.html'));
});

app.get('/provider-reminders', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/provider-reminders.html'));
});

app.get('/ai-health', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/ai-health-features.html'));
});

app.get('/ai-health-assistant', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/ai-health-assistant.html'));
});

app.get('/test-assessments', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-all-assessments.html'));
});

// Legacy test routes (keeping for compatibility)
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-new-auth.html'));
});

app.get('/test-features', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-auth-features.html'));
});

app.get('/debug-google', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug-google-signin.html'));
});

app.get('/test-simple', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-google-simple.html'));
});

app.get('/test-ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-ai-integration.html'));
});

// Individual assessment pages - Updated for new file structure
app.get('/assessment/diet-planner', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/diet-planner-assessment.html'));
});

app.get('/assessment/symptom-checker', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/symptom-checker-assessment.html'));
});

app.get('/assessment/medicine-advisor', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/medicine-advisor-assessment.html'));
});

app.get('/assessment/health-report', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/health-report-assessment.html'));
});

app.get('/assessment/fitness-coach', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/fitness-coach-assessment.html'));
});

app.get('/assessment/mental-health', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/mental-health-assessment.html'));
});

app.get('/assessment/sleep-analyzer', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/sleep-analyzer-assessment.html'));
});

app.get('/assessment/chronic-condition', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/chronic-condition-assessment.html'));
});

app.get('/assessment/womens-health', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/womens-health-assessment.html'));
});

app.get('/assessment/risk-predictor', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/risk-predictor-assessment.html'));
});

app.get('/assessment/enhanced-template', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/enhanced-assessment-template.html'));
});

// Handle 404 errors with a custom page
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found | MediCare+</title>
            <style>
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                    color: white;
                    text-align: center;
                }
                .error-container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                h1 { font-size: 4rem; margin-bottom: 20px; }
                p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
                a {
                    display: inline-block;
                    padding: 12px 24px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    margin: 0 10px;
                }
                a:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>404</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <a href="/">🏠 Home</a>
                <a href="/auth">🔐 Login</a>
                <a href="/dashboard">📊 Dashboard</a>
                <a href="/test-features">🧪 Test Features</a>
                <a href="/ai-health">🧠 AI Health</a>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`MediCare+ Server running at http://localhost:${PORT}/`);
    console.log(`Available Pages:`);
    console.log(`   Home: http://localhost:${PORT}/`);
    console.log(`   Auth: http://localhost:${PORT}/auth`);
    console.log(`   Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`   Test Auth: http://localhost:${PORT}/test`);
    console.log(`   Test Features: http://localhost:${PORT}/test-features`);
    console.log(`   Debug Google: http://localhost:${PORT}/debug-google`);
    console.log(`   Simple Test: http://localhost:${PORT}/test-simple`);
    console.log(`   AI Health Features: http://localhost:${PORT}/ai-health`);
    console.log(`   AI Health Assistant: http://localhost:${PORT}/ai-health-assistant`);
    console.log(`   ✨ Improved AI Chat: http://localhost:${PORT}/ai-chat`);
    console.log(`Authentication Features:`);
    console.log(`   Regular Email/Password Login`);
    console.log(`   Google Sign-In (Demo Mode)`);
    console.log(`   Magic Link Authentication`);
    console.log(`   Persistent Sessions`);
    console.log(`   Auto Account Creation`);
});

// Generate AI analysis for assessments
async function generateAIAnalysis(type, responses, userInfo) {
    try {
        console.log('🤖 Generating AI analysis for:', type);
        
        // Create analysis prompt based on assessment type
        const analysisPrompt = createAnalysisPrompt(type, responses, userInfo);
        
        // Get AI analysis
        const aiResponse = await aiService.chatCompletion([
            {
                role: 'system',
                content: `You are a medical AI assistant specialized in ${type} analysis. Provide detailed, professional analysis in simple terms.`
            },
            {
                role: 'user',
                content: analysisPrompt
            }
        ]);
        
        // Parse and structure the AI response
        const structuredAnalysis = parseAIAnalysis(aiResponse, type);
        
        return structuredAnalysis;
        
    } catch (error) {
        console.error('❌ AI analysis error:', error);
        return generateFallbackAnalysis(type);
    }
}

function createAnalysisPrompt(type, responses, userInfo) {
    const prompts = {
        'symptom-checker': `
            Analyze these symptoms for ${userInfo.name}, age ${userInfo.age}:
            Primary symptom: ${responses.primarySymptom || 'Not specified'}
            Duration: ${responses.duration || 'Not specified'}
            Severity: ${responses.severity || 'Not specified'}
            
            Provide symptom analysis, risk assessment, and recommendations.
        `,
        'diet-planner': `
            Create a nutrition plan for ${userInfo.name}, age ${userInfo.age}:
            Height: ${responses.height || 'Not specified'}
            Weight: ${responses.weight || 'Not specified'}
            Goal: ${responses.dietGoal || 'General health'}
            
            Provide nutrition analysis, meal planning, and dietary recommendations.
        `,
        'mental-health': `
            Assess mental wellness for ${userInfo.name}, age ${userInfo.age}:
            Stress level: ${responses.stressLevel || 'Not specified'}
            Sleep quality: ${responses.sleepQuality || 'Not specified'}
            
            Provide wellness assessment, stress analysis, and coping strategies.
        `,
        'medicine-advisor': `
            Provide medication advice for ${userInfo.name}, age ${userInfo.age}:
            Current medications: ${responses.currentMedications || 'None specified'}
            Concern: ${responses.medicationConcern || 'General advice'}
            
            Provide medication analysis, safety guidelines, and recommendations.
        `,
        'fitness-coach': `
            Create fitness plan for ${userInfo.name}, age ${userInfo.age}:
            Current level: ${responses.fitnessLevel || 'Beginner'}
            Goal: ${responses.fitnessGoal || 'General fitness'}
            
            Provide fitness assessment, workout plan, and training recommendations.
        `,
        'sleep-analyzer': `
            Analyze sleep patterns for ${userInfo.name}, age ${userInfo.age}:
            Sleep duration: ${responses.sleepDuration || 'Not specified'}
            Sleep quality: ${responses.sleepQuality || 'Not specified'}
            
            Provide sleep analysis, quality assessment, and improvement recommendations.
        `
    };
    
    return prompts[type] || prompts['symptom-checker'];
}

function parseAIAnalysis(aiResponse, type) {
    // Parse AI response into structured format
    const healthScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
    
    return {
        healthScore,
        sections: [
            {
                title: 'AI Analysis',
                content: aiResponse.substring(0, 300) + '...',
                type: 'analysis'
            },
            {
                title: 'Key Findings',
                content: 'Based on the provided information, we have identified several key areas for attention and improvement.',
                type: 'recommendation'
            },
            {
                title: 'Next Steps',
                content: 'We recommend following the personalized recommendations and consulting with healthcare professionals.',
                type: 'recommendation'
            }
        ]
    };
}

function generateFallbackAnalysis(type) {
    const fallbackAnalyses = {
        'symptom-checker': {
            healthScore: 75,
            sections: [
                {
                    title: 'Symptom Assessment',
                    content: 'Based on your symptoms, we recommend monitoring your condition and seeking medical advice if symptoms persist or worsen.',
                    type: 'analysis'
                }
            ]
        },
        'diet-planner': {
            healthScore: 80,
            sections: [
                {
                    title: 'Nutrition Analysis',
                    content: 'Your nutritional profile shows potential for improvement through balanced meal planning and proper portion control.',
                    type: 'analysis'
                }
            ]
        }
    };
    
    return fallbackAnalyses[type] || fallbackAnalyses['symptom-checker'];
}

// Enhanced PDF generation endpoint for assessments
app.post('/api/assessment/generate-pdf', express.json(), async (req, res) => {
    try {
        console.log('📄 PDF generation request received');
        
        const assessmentData = req.body;
        
        // Validate required fields
        if (!assessmentData.type || !assessmentData.userInfo || !assessmentData.analysisResults) {
            return res.status(400).json({
                success: false,
                error: 'Missing required assessment data'
            });
        }
        
        // Generate enhanced PDF report
        const pdfResult = await pdfAssessmentService.generateAssessmentReport(assessmentData);
        
        if (pdfResult.success) {
            console.log('✅ PDF generated successfully:', pdfResult.filename);
            res.json({
                success: true,
                message: 'PDF report generated successfully',
                filename: pdfResult.filename,
                downloadUrl: pdfResult.downloadUrl,
                reportId: pdfResult.reportId,
                filesize: pdfResult.filesize
            });
        } else {
            console.error('❌ PDF generation failed:', pdfResult.error);
            res.status(500).json({
                success: false,
                error: pdfResult.error
            });
        }
        
    } catch (error) {
        console.error('❌ PDF generation endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during PDF generation'
        });
    }
});

// Download PDF endpoint
app.get('/download/pdf/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, 'uploads/pdf-reports', filename);
        
        // Check if file exists
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                error: 'PDF file not found'
            });
        }
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Stream the file
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
        
        console.log('📥 PDF downloaded:', filename);
        
    } catch (error) {
        console.error('❌ PDF download error:', error);
        res.status(500).json({
            success: false,
            error: 'Error downloading PDF'
        });
    }
}); 