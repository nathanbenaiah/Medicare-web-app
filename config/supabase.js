// Supabase Configuration for MediCare+ AI Health Assistant
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://gcggnrwqilylyykppizb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseManager {
    constructor() {
        this.client = supabase;
        this.isConnected = false;
        console.log('✅ Supabase Manager initialized');
    }

    // Save user assessment responses with enhanced data
    async saveAssessmentResponse(data) {
        try {
            const responseData = {
                user_id: data.user_id || 'anonymous',
                feature_id: data.feature_id,
                question_id: data.question_id,
                question_text: data.question_text,
                response_value: data.response_value,
                response_type: data.response_type || 'multiple_choice',
                session_id: data.session_id,
                question_index: data.question_index || 1,
                timestamp: data.timestamp || new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            const { data: result, error } = await this.client
                .from('assessment_responses')
                .insert([responseData]);

            if (error) {
                console.error('Supabase insert error:', error);
                throw error;
            }
            
            console.log(`✅ Response saved to Supabase: ${data.question_id}`);
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error saving assessment response:', error);
            return { success: false, error: error.message };
        }
    }

    // Save AI analysis results with enhanced metadata
    async saveAIResult(data) {
        try {
            const resultData = {
                user_id: data.user_id || 'anonymous',
                feature_id: data.feature_id,
                session_id: data.session_id,
                ai_response: data.ai_response,
                confidence_score: data.confidence_score || 0.85,
                processing_time: data.processing_time || 0,
                tokens_used: data.tokens_used || 0,
                model_used: data.model_used || 'deepseek-chat',
                analysis_data: data.analysis_data || '{}',
                total_questions: data.total_questions || 0,
                completed_questions: data.completed_questions || 0,
                timestamp: data.timestamp || new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            const { data: result, error } = await this.client
                .from('ai_results')
                .insert([resultData]);

            if (error) {
                console.error('Supabase AI result insert error:', error);
                throw error;
            }
            
            console.log(`✅ AI result saved to Supabase: ${data.feature_id}`);
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error saving AI result:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user assessment history
    async getUserAssessments(userId, limit = 10) {
        try {
            const { data, error } = await this.client
                .from('ai_results')
                .select(`
                    *,
                    assessment_responses!inner(*)
                `)
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching user assessments:', error);
            return { success: false, error: error.message };
        }
    }

    // Get assessment analytics with detailed metrics
    async getAssessmentAnalytics(featureId = null, days = 30) {
        try {
            let query = this.client
                .from('ai_results')
                .select('feature_id, confidence_score, processing_time, timestamp, total_questions, completed_questions');

            if (featureId) {
                query = query.eq('feature_id', featureId);
            }

            const { data, error } = await query
                .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

            if (error) throw error;

            // Calculate comprehensive analytics
            const analytics = {
                total_assessments: data.length,
                average_confidence: data.length > 0 ? 
                    data.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / data.length : 0,
                average_processing_time: data.length > 0 ? 
                    data.reduce((sum, item) => sum + (item.processing_time || 0), 0) / data.length : 0,
                completion_rate: data.length > 0 ? 
                    data.reduce((sum, item) => sum + (item.completed_questions / Math.max(item.total_questions, 1)), 0) / data.length : 0,
                feature_breakdown: {},
                daily_stats: {},
                confidence_distribution: {
                    high: 0, // >0.8
                    medium: 0, // 0.6-0.8
                    low: 0 // <0.6
                }
            };

            // Feature breakdown and confidence distribution
            data.forEach(item => {
                // Feature breakdown
                if (!analytics.feature_breakdown[item.feature_id]) {
                    analytics.feature_breakdown[item.feature_id] = {
                        count: 0,
                        avg_confidence: 0,
                        avg_processing_time: 0
                    };
                }
                analytics.feature_breakdown[item.feature_id].count++;
                
                // Confidence distribution
                const confidence = item.confidence_score || 0;
                if (confidence > 0.8) analytics.confidence_distribution.high++;
                else if (confidence > 0.6) analytics.confidence_distribution.medium++;
                else analytics.confidence_distribution.low++;
                
                // Daily stats
                const date = new Date(item.timestamp).toDateString();
                if (!analytics.daily_stats[date]) {
                    analytics.daily_stats[date] = 0;
                }
                analytics.daily_stats[date]++;
            });

            // Calculate averages for feature breakdown
            Object.keys(analytics.feature_breakdown).forEach(featureId => {
                const featureData = data.filter(item => item.feature_id === featureId);
                analytics.feature_breakdown[featureId].avg_confidence = 
                    featureData.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / featureData.length;
                analytics.feature_breakdown[featureId].avg_processing_time = 
                    featureData.reduce((sum, item) => sum + (item.processing_time || 0), 0) / featureData.length;
            });

            return { success: true, data: analytics };
        } catch (error) {
            console.error('❌ Error fetching analytics:', error);
            return { success: false, error: error.message };
        }
    }

    // Get assessment data for PDF generation
    async getAssessmentDataForPDF(sessionId, userId, featureId) {
        try {
            // Get AI results
            const { data: aiResults, error: aiError } = await this.client
                .from('ai_results')
                .select('*')
                .eq('session_id', sessionId)
                .eq('feature_id', featureId)
                .order('timestamp', { ascending: false })
                .limit(1);

            if (aiError) throw aiError;

            // Get assessment responses
            const { data: responses, error: responseError } = await this.client
                .from('assessment_responses')
                .select('*')
                .eq('session_id', sessionId)
                .eq('feature_id', featureId)
                .order('question_index', { ascending: true });

            if (responseError) throw responseError;

            if (aiResults && aiResults.length > 0) {
                return {
                    aiResult: aiResults[0],
                    responses: responses || [],
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
            console.error('❌ Error getting assessment data for PDF:', error);
            return null;
        }
    }

    // Initialize database tables (run once)
    async initializeTables() {
        try {
            console.log('📋 Database tables should be created via Supabase dashboard');
            console.log('Required tables:');
            console.log('1. assessment_responses');
            console.log('2. ai_results');
            console.log('3. user_sessions (optional)');
            console.log('4. analytics_summary (optional)');
            return { success: true };
        } catch (error) {
            console.error('❌ Error initializing tables:', error);
            return { success: false, error: error.message };
        }
    }

    // Test connection with enhanced diagnostics
    async testConnection() {
        try {
            // Test basic connection
            const { data, error } = await this.client
                .from('assessment_responses')
                .select('count', { count: 'exact', head: true });

            if (error) {
                console.error('Supabase connection test error:', error);
                throw error;
            }
            
            this.isConnected = true;
            console.log('✅ Supabase connection test successful');
            return { 
                success: true, 
                message: 'Supabase connection successful',
                url: supabaseUrl.replace(/\/.*/, '/***'),
                tables_accessible: true
            };
        } catch (error) {
            this.isConnected = false;
            console.error('❌ Supabase connection failed:', error);
            return { 
                success: false, 
                error: error.message,
                url: supabaseUrl.replace(/\/.*/, '/***'),
                suggestion: 'Check your Supabase URL and API key, ensure tables exist and RLS policies allow access'
            };
        }
    }

    // Health check for monitoring
    async healthCheck() {
        try {
            const startTime = Date.now();
            const result = await this.testConnection();
            const responseTime = Date.now() - startTime;
            
            return {
                ...result,
                response_time: responseTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                response_time: -1,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Save chat message to database
    async saveChatMessage(data) {
        try {
            const messageData = {
                user_id: data.user_id,
                session_id: data.session_id,
                user_message: data.user_message,
                ai_response: data.ai_response,
                processing_time: data.processing_time || 0,
                confidence_score: data.confidence_score || 0.9,
                model_used: data.model_used || 'chat-ai',
                timestamp: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            const { data: result, error } = await this.client
                .from('ai_chat_results')
                .insert([messageData]);

            if (error) {
                console.error('Supabase chat message insert error:', error);
                throw error;
            }

            // Also save individual messages for history
            await this.saveIndividualChatMessages(data.user_id, data.session_id, data.user_message, data.ai_response);
            
            console.log(`✅ Chat interaction saved to Supabase: ${data.session_id}`);
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error saving chat message:', error);
            return { success: false, error: error.message };
        }
    }

    // Save individual chat messages for history
    async saveIndividualChatMessages(userId, sessionId, userMessage, aiResponse) {
        try {
            const messages = [
                {
                    user_id: userId,
                    session_id: sessionId,
                    message: userMessage,
                    is_user: true,
                    timestamp: new Date().toISOString()
                },
                {
                    user_id: userId,
                    session_id: sessionId,
                    message: aiResponse,
                    is_user: false,
                    timestamp: new Date().toISOString()
                }
            ];

            const { error } = await this.client
                .from('chat_messages')
                .insert(messages);

            if (error) {
                console.error('Supabase individual chat messages error:', error);
                throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('❌ Error saving individual chat messages:', error);
            return { success: false, error: error.message };
        }
    }

    // Get chat history for a user session
    async getChatHistory(userId, sessionId, limit = 50) {
        try {
            const { data, error } = await this.client
                .from('chat_messages')
                .select('*')
                .eq('user_id', userId)
                .eq('session_id', sessionId)
                .order('timestamp', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching chat history:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user's recent chat sessions
    async getUserChatSessions(userId, limit = 10) {
        try {
            const { data, error } = await this.client
                .from('ai_chat_results')
                .select('session_id, timestamp, user_message')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Group by session and get most recent message for each
            const sessions = {};
            data.forEach(item => {
                if (!sessions[item.session_id] || new Date(item.timestamp) > new Date(sessions[item.session_id].timestamp)) {
                    sessions[item.session_id] = item;
                }
            });

            return { success: true, data: Object.values(sessions) };
        } catch (error) {
            console.error('❌ Error fetching user chat sessions:', error);
            return { success: false, error: error.message };
        }
    }

    // Save user profile
    async saveUserProfile(data) {
        try {
            const profileData = {
                user_id: data.user_id,
                email: data.email || null,
                full_name: data.full_name || null,
                date_of_birth: data.date_of_birth || null,
                gender: data.gender || null,
                phone: data.phone || null,
                emergency_contact: data.emergency_contact || null,
                medical_conditions: data.medical_conditions || [],
                medications: data.medications || [],
                allergies: data.allergies || [],
                preferences: data.preferences || {},
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await this.client
                .from('user_profiles')
                .upsert([profileData]);

            if (error) throw error;
            
            console.log(`✅ User profile saved: ${data.user_id}`);
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error saving user profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.client
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
            
            return { success: true, data: data || null };
        } catch (error) {
            console.error('❌ Error fetching user profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Save reminder
    async saveReminder(data) {
        try {
            const reminderData = {
                user_id: data.user_id,
                reminder_type: data.reminder_type,
                title: data.title,
                description: data.description || null,
                reminder_data: data.reminder_data || {},
                frequency: data.frequency,
                reminder_times: data.reminder_times || [],
                is_active: data.is_active !== false,
                created_at: new Date().toISOString()
            };

            const { data: result, error } = await this.client
                .from('reminders')
                .insert([reminderData]);

            if (error) throw error;
            
            console.log(`✅ Reminder saved: ${data.title}`);
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error saving reminder:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user reminders
    async getUserReminders(userId, activeOnly = true) {
        try {
            let query = this.client
                .from('reminders')
                .select('*')
                .eq('user_id', userId);

            if (activeOnly) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching user reminders:', error);
            return { success: false, error: error.message };
        }
    }

    // Cleanup old data (optional maintenance function)
    async cleanupOldData(daysToKeep = 90) {
        try {
            const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();
            
            // Delete old assessment responses
            const { error: responseError } = await this.client
                .from('assessment_responses')
                .delete()
                .lt('created_at', cutoffDate);

            if (responseError) throw responseError;

            // Delete old AI results
            const { error: aiError } = await this.client
                .from('ai_results')
                .delete()
                .lt('created_at', cutoffDate);

            if (aiError) throw aiError;

            // Delete old chat messages
            const { error: chatError } = await this.client
                .from('chat_messages')
                .delete()
                .lt('created_at', cutoffDate);

            if (chatError) throw chatError;

            // Delete old chat results
            const { error: chatResultsError } = await this.client
                .from('ai_chat_results')
                .delete()
                .lt('created_at', cutoffDate);

            if (chatResultsError) throw chatResultsError;

            console.log(`✅ Cleaned up data older than ${daysToKeep} days`);
            return { success: true, message: `Data cleanup completed for records older than ${daysToKeep} days` };
        } catch (error) {
            console.error('❌ Error during data cleanup:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create and export singleton instance
const supabaseManager = new SupabaseManager();

module.exports = supabaseManager; 