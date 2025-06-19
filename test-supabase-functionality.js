/**
 * Comprehensive Supabase MCP Functionality Test
 * Tests all core functions: Auth, AI Assessments, Chat, Appointments, Reminders
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from the actual project files
const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE';

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseFunctionalityTest {
    constructor() {
        this.testResults = {
            connection: false,
            tables: {},
            authentication: {},
            aiAssessments: {},
            chatSystem: {},
            appointments: {},
            reminders: {},
            userProfiles: {}
        };
        this.testUserId = 'test-user-' + Date.now();
        this.testEmail = `test${Date.now()}@example.com`;
    }

    async runAllTests() {
        console.log('🚀 Starting Comprehensive Supabase MCP Functionality Test...\n');
        
        try {
            // 1. Test Connection
            await this.testConnection();
            
            // 2. Test Database Schema
            await this.testDatabaseSchema();
            
            // 3. Test User Profiles
            await this.testUserProfiles();
            
            // 4. Test AI Assessments Storage
            await this.testAIAssessments();
            
            // 5. Test Chat System
            await this.testChatSystem();
            
            // 6. Test Appointments
            await this.testAppointments();
            
            // 7. Test Reminders
            await this.testReminders();
            
            // 8. Test Data Analytics
            await this.testDataAnalytics();
            
            // 9. Generate Report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Test failed with error:', error);
        }
    }

    async testConnection() {
        console.log('🔌 Testing Supabase Connection...');
        
        try {
            // Test basic connection by checking if we can query any table
            const { data, error } = await supabase.rpc('get_schema_version');
            
            if (error && error.code === '42883') {
                // Function doesn't exist, but connection works - try alternative
                const { data: healthData, error: healthError } = await supabase
                    .from('user_profiles')
                    .select('count', { count: 'exact', head: true });
                
                if (healthError) {
                    console.log('⚠️  Connection test result:', healthError.message);
                    this.testResults.connection = false;
                } else {
                    console.log('✅ Supabase connection successful');
                    this.testResults.connection = true;
                }
            } else if (error) {
                console.log('⚠️  Connection test result:', error.message);
                this.testResults.connection = false;
            } else {
                console.log('✅ Supabase connection successful');
                this.testResults.connection = true;
            }
        } catch (error) {
            console.log('❌ Connection failed:', error.message);
            this.testResults.connection = false;
        }
    }

    async testDatabaseSchema() {
        console.log('\n📋 Testing Database Schema...');
        
        const tables = [
            'user_profiles',
            'assessment_responses', 
            'ai_results',
            'chat_messages',
            'appointments',
            'reminders',
            'medications',
            'vital_signs'
        ];

        for (const table of tables) {
            try {
                const { data, error } = await supabase.from(table).select('*').limit(1);
                
                if (error) {
                    console.log(`❌ Table ${table}: ${error.message}`);
                    this.testResults.tables[table] = false;
                } else {
                    console.log(`✅ Table ${table}: Available`);
                    this.testResults.tables[table] = true;
                }
            } catch (error) {
                console.log(`❌ Table ${table}: ${error.message}`);
                this.testResults.tables[table] = false;
            }
        }
    }

    async testUserProfiles() {
        console.log('\n👤 Testing User Profiles...');
        
        try {
            // Test creating user profile
            const userData = {
                id: this.testUserId,
                email: this.testEmail,
                full_name: 'Test User',
                user_type: 'patient',
                is_profile_complete: true,
                created_at: new Date().toISOString()
            };

            const { data: createData, error: createError } = await supabase
                .from('user_profiles')
                .insert([userData])
                .select();

            if (createError) {
                console.log('❌ User profile creation failed:', createError.message);
                this.testResults.userProfiles.create = false;
            } else {
                console.log('✅ User profile created successfully');
                this.testResults.userProfiles.create = true;
            }

            // Test reading user profile
            const { data: readData, error: readError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.testUserId)
                .single();

            if (readError) {
                console.log('❌ User profile read failed:', readError.message);
                this.testResults.userProfiles.read = false;
            } else {
                console.log('✅ User profile read successfully');
                this.testResults.userProfiles.read = true;
            }

        } catch (error) {
            console.log('❌ User profiles test failed:', error.message);
            this.testResults.userProfiles.error = error.message;
        }
    }

    async testAIAssessments() {
        console.log('\n🧠 Testing AI Assessments Storage...');
        
        try {
            // Test saving assessment response
            const responseData = {
                user_id: this.testUserId,
                feature_id: 'symptom-checker',
                question_id: 'test-question-1',
                question_text: 'How are you feeling today?',
                response_value: 'Good',
                response_type: 'multiple_choice',
                session_id: 'test-session-' + Date.now(),
                created_at: new Date().toISOString()
            };

            const { data: responseInsert, error: responseError } = await supabase
                .from('assessment_responses')
                .insert([responseData])
                .select();

            if (responseError) {
                console.log('❌ Assessment response save failed:', responseError.message);
                this.testResults.aiAssessments.saveResponse = false;
            } else {
                console.log('✅ Assessment response saved successfully');
                this.testResults.aiAssessments.saveResponse = true;
            }

            // Test saving AI result
            const aiResultData = {
                user_id: this.testUserId,
                feature_id: 'symptom-checker',
                session_id: responseData.session_id,
                ai_response: 'Based on your symptoms, you appear to be in good health.',
                confidence_score: 0.85,
                model_used: 'deepseek-chat',
                created_at: new Date().toISOString()
            };

            const { data: aiResultInsert, error: aiResultError } = await supabase
                .from('ai_results')
                .insert([aiResultData])
                .select();

            if (aiResultError) {
                console.log('❌ AI result save failed:', aiResultError.message);
                this.testResults.aiAssessments.saveResult = false;
            } else {
                console.log('✅ AI result saved successfully');
                this.testResults.aiAssessments.saveResult = true;
            }

        } catch (error) {
            console.log('❌ AI assessments test failed:', error.message);
            this.testResults.aiAssessments.error = error.message;
        }
    }

    async testChatSystem() {
        console.log('\n💬 Testing Chat System...');
        
        try {
            // Test saving chat message
            const chatData = {
                user_id: this.testUserId,
                session_id: 'chat-session-' + Date.now(),
                user_message: 'Hello, I need help with my health',
                ai_response: 'Hello! I\'m here to help you with your health concerns.',
                message_type: 'health_consultation',
                created_at: new Date().toISOString()
            };

            const { data: chatInsert, error: chatError } = await supabase
                .from('chat_messages')
                .insert([chatData])
                .select();

            if (chatError) {
                console.log('❌ Chat message save failed:', chatError.message);
                this.testResults.chatSystem.saveMessage = false;
            } else {
                console.log('✅ Chat message saved successfully');
                this.testResults.chatSystem.saveMessage = true;
            }

            // Test retrieving chat history
            const { data: chatHistory, error: historyError } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', this.testUserId)
                .order('created_at', { ascending: false })
                .limit(10);

            if (historyError) {
                console.log('❌ Chat history retrieval failed:', historyError.message);
                this.testResults.chatSystem.getHistory = false;
            } else {
                console.log('✅ Chat history retrieved successfully');
                this.testResults.chatSystem.getHistory = true;
            }

        } catch (error) {
            console.log('❌ Chat system test failed:', error.message);
            this.testResults.chatSystem.error = error.message;
        }
    }

    async testAppointments() {
        console.log('\n📅 Testing Appointments System...');
        
        try {
            // Test saving appointment
            const appointmentData = {
                user_id: this.testUserId,
                doctor_name: 'Dr. Test Doctor',
                specialty: 'General Medicine',
                appointment_date: '2024-04-01',
                appointment_time: '10:00',
                status: 'scheduled',
                reason: 'Regular checkup',
                created_at: new Date().toISOString()
            };

            const { data: appointmentInsert, error: appointmentError } = await supabase
                .from('appointments')
                .insert([appointmentData])
                .select();

            if (appointmentError) {
                console.log('❌ Appointment save failed:', appointmentError.message);
                this.testResults.appointments.save = false;
            } else {
                console.log('✅ Appointment saved successfully');
                this.testResults.appointments.save = true;
            }

            // Test retrieving appointments
            const { data: appointmentsList, error: listError } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', this.testUserId);

            if (listError) {
                console.log('❌ Appointments retrieval failed:', listError.message);
                this.testResults.appointments.retrieve = false;
            } else {
                console.log('✅ Appointments retrieved successfully');
                this.testResults.appointments.retrieve = true;
            }

        } catch (error) {
            console.log('❌ Appointments test failed:', error.message);
            this.testResults.appointments.error = error.message;
        }
    }

    async testReminders() {
        console.log('\n⏰ Testing Reminders System...');
        
        try {
            // Test saving reminder
            const reminderData = {
                user_id: this.testUserId,
                title: 'Take morning medication',
                reminder_type: 'medication',
                scheduled_time: '08:00',
                scheduled_date: '2024-04-01',
                status: 'active',
                created_at: new Date().toISOString()
            };

            const { data: reminderInsert, error: reminderError } = await supabase
                .from('reminders')
                .insert([reminderData])
                .select();

            if (reminderError) {
                console.log('❌ Reminder save failed:', reminderError.message);
                this.testResults.reminders.save = false;
            } else {
                console.log('✅ Reminder saved successfully');
                this.testResults.reminders.save = true;
            }

            // Test retrieving reminders
            const { data: remindersList, error: listError } = await supabase
                .from('reminders')
                .select('*')
                .eq('user_id', this.testUserId);

            if (listError) {
                console.log('❌ Reminders retrieval failed:', listError.message);
                this.testResults.reminders.retrieve = false;
            } else {
                console.log('✅ Reminders retrieved successfully');
                this.testResults.reminders.retrieve = true;
            }

        } catch (error) {
            console.log('❌ Reminders test failed:', error.message);
            this.testResults.reminders.error = error.message;
        }
    }

    async testDataAnalytics() {
        console.log('\n📊 Testing Data Analytics...');
        
        try {
            // Test getting user analytics
            const { data: assessmentCount, error: countError } = await supabase
                .from('ai_results')
                .select('*', { count: 'exact' })
                .eq('user_id', this.testUserId);

            if (countError) {
                console.log('❌ Analytics data retrieval failed:', countError.message);
                this.testResults.analytics = false;
            } else {
                console.log('✅ Analytics data retrieved successfully');
                this.testResults.analytics = true;
            }

        } catch (error) {
            console.log('❌ Analytics test failed:', error.message);
            this.testResults.analytics = false;
        }
    }

    generateReport() {
        console.log('\n📈 SUPABASE MCP FUNCTIONALITY TEST REPORT');
        console.log('='.repeat(50));
        
        console.log('\n🔌 Connection Status:');
        console.log(`   Supabase Connection: ${this.testResults.connection ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n📋 Database Tables:');
        for (const [table, status] of Object.entries(this.testResults.tables)) {
            console.log(`   ${table}: ${status ? '✅ AVAILABLE' : '❌ MISSING'}`);
        }
        
        console.log('\n👤 User Profiles:');
        console.log(`   Create Profile: ${this.testResults.userProfiles.create ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Read Profile: ${this.testResults.userProfiles.read ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n🧠 AI Assessments:');
        console.log(`   Save Response: ${this.testResults.aiAssessments.saveResponse ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Save AI Result: ${this.testResults.aiAssessments.saveResult ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n💬 Chat System:');
        console.log(`   Save Message: ${this.testResults.chatSystem.saveMessage ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Get History: ${this.testResults.chatSystem.getHistory ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n📅 Appointments:');
        console.log(`   Save Appointment: ${this.testResults.appointments.save ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Retrieve Appointments: ${this.testResults.appointments.retrieve ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n⏰ Reminders:');
        console.log(`   Save Reminder: ${this.testResults.reminders.save ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Retrieve Reminders: ${this.testResults.reminders.retrieve ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n📊 Data Analytics:');
        console.log(`   Analytics Queries: ${this.testResults.analytics ? '✅ PASS' : '❌ FAIL'}`);
        
        // Overall assessment
        const allTests = [
            this.testResults.connection,
            Object.values(this.testResults.tables).every(t => t),
            this.testResults.userProfiles.create && this.testResults.userProfiles.read,
            this.testResults.aiAssessments.saveResponse && this.testResults.aiAssessments.saveResult,
            this.testResults.chatSystem.saveMessage && this.testResults.chatSystem.getHistory,
            this.testResults.appointments.save && this.testResults.appointments.retrieve,
            this.testResults.reminders.save && this.testResults.reminders.retrieve,
            this.testResults.analytics
        ];
        
        const passedTests = allTests.filter(test => test).length;
        const totalTests = allTests.length;
        const successRate = Math.round((passedTests / totalTests) * 100);
        
        console.log('\n🎯 OVERALL ASSESSMENT:');
        console.log(`   Success Rate: ${successRate}% (${passedTests}/${totalTests} tests passed)`);
        
        if (successRate >= 90) {
            console.log('   Status: 🟢 EXCELLENT - All core functionality working');
        } else if (successRate >= 70) {
            console.log('   Status: 🟡 GOOD - Most functionality working, minor issues');
        } else if (successRate >= 50) {
            console.log('   Status: 🟠 FAIR - Core functionality working, some issues');
        } else {
            console.log('   Status: 🔴 CRITICAL - Major functionality issues detected');
        }
        
        console.log('\n📝 RECOMMENDATIONS:');
        if (!this.testResults.connection) {
            console.log('   • Check Supabase URL and API keys');
        }
        
        const missingTables = Object.entries(this.testResults.tables)
            .filter(([table, status]) => !status)
            .map(([table]) => table);
        
        if (missingTables.length > 0) {
            console.log(`   • Create missing tables: ${missingTables.join(', ')}`);
        }
        
        if (successRate < 100) {
            console.log('   • Review failed tests and check database permissions');
            console.log('   • Ensure all required tables and columns exist');
            console.log('   • Verify Supabase RLS policies are properly configured');
        }
        
        console.log('\n✨ Test completed successfully!');
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up test data...');
        
        try {
            // Delete test data in reverse order of dependencies
            await supabase.from('reminders').delete().eq('user_id', this.testUserId);
            await supabase.from('appointments').delete().eq('user_id', this.testUserId);
            await supabase.from('chat_messages').delete().eq('user_id', this.testUserId);
            await supabase.from('ai_results').delete().eq('user_id', this.testUserId);
            await supabase.from('assessment_responses').delete().eq('user_id', this.testUserId);
            await supabase.from('user_profiles').delete().eq('id', this.testUserId);
            
            console.log('✅ Test data cleaned up successfully');
        } catch (error) {
            console.log('⚠️  Some test data may not have been cleaned up:', error.message);
        }
    }
}

// Run the test
async function main() {
    const tester = new SupabaseFunctionalityTest();
    
    try {
        await tester.runAllTests();
    } finally {
        await tester.cleanup();
    }
}

// Export for use in other files
module.exports = SupabaseFunctionalityTest;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
} 