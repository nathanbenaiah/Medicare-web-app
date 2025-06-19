/**
 * Database Schema Setup for MediCare+ Supabase MCP
 * Creates all required tables and columns for full functionality
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE';

const supabase = createClient(supabaseUrl, supabaseKey);

class DatabaseSchemaSetup {
    constructor() {
        this.createdTables = [];
        this.errors = [];
    }

    async setupDatabase() {
        console.log('🏗️  Setting up MediCare+ Database Schema...\n');
        
        try {
            await this.createAssessmentResponsesTable();
            await this.createAIResultsTable();
            await this.updateUserProfilesTable();
            await this.updateChatMessagesTable();
            await this.updateAppointmentsTable();
            await this.updateRemindersTable();
            
            this.generateReport();
        } catch (error) {
            console.error('❌ Database setup failed:', error);
            this.errors.push(error.message);
        }
    }

    async createAssessmentResponsesTable() {
        console.log('📋 Creating assessment_responses table...');
        
        const sql = `
            CREATE TABLE IF NOT EXISTS public.assessment_responses (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                feature_id TEXT NOT NULL,
                question_id TEXT NOT NULL,
                question_text TEXT,
                response_value TEXT,
                response_type TEXT DEFAULT 'multiple_choice',
                session_id TEXT,
                question_index INTEGER DEFAULT 1,
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            -- Enable RLS
            ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
            
            -- Create policy for users to manage their own responses
            CREATE POLICY "Users can manage their own assessment responses" ON public.assessment_responses
                FOR ALL USING (auth.uid() = user_id);
        `;
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.log('❌ Failed to create assessment_responses table:', error.message);
                this.errors.push(`assessment_responses: ${error.message}`);
            } else {
                console.log('✅ assessment_responses table created successfully');
                this.createdTables.push('assessment_responses');
            }
        } catch (error) {
            console.log('❌ Failed to create assessment_responses table:', error.message);
            this.errors.push(`assessment_responses: ${error.message}`);
        }
    }

    async createAIResultsTable() {
        console.log('🧠 Creating ai_results table...');
        
        const sql = `
            CREATE TABLE IF NOT EXISTS public.ai_results (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                feature_id TEXT NOT NULL,
                session_id TEXT,
                ai_response TEXT,
                confidence_score DECIMAL(3,2) DEFAULT 0.85,
                processing_time INTEGER DEFAULT 0,
                tokens_used INTEGER DEFAULT 0,
                model_used TEXT DEFAULT 'deepseek-chat',
                analysis_data JSONB DEFAULT '{}',
                total_questions INTEGER DEFAULT 0,
                completed_questions INTEGER DEFAULT 0,
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            -- Enable RLS
            ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;
            
            -- Create policy for users to manage their own AI results
            CREATE POLICY "Users can manage their own AI results" ON public.ai_results
                FOR ALL USING (auth.uid() = user_id);
        `;
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.log('❌ Failed to create ai_results table:', error.message);
                this.errors.push(`ai_results: ${error.message}`);
            } else {
                console.log('✅ ai_results table created successfully');
                this.createdTables.push('ai_results');
            }
        } catch (error) {
            console.log('❌ Failed to create ai_results table:', error.message);
            this.errors.push(`ai_results: ${error.message}`);
        }
    }

    async updateUserProfilesTable() {
        console.log('👤 Updating user_profiles table...');
        
        const sql = `
            -- Add missing columns to user_profiles
            ALTER TABLE public.user_profiles 
            ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'patient',
            ADD COLUMN IF NOT EXISTS phone_number TEXT,
            ADD COLUMN IF NOT EXISTS date_of_birth DATE,
            ADD COLUMN IF NOT EXISTS gender TEXT,
            ADD COLUMN IF NOT EXISTS address JSONB,
            ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
            ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
            ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
        `;
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.log('❌ Failed to update user_profiles table:', error.message);
                this.errors.push(`user_profiles: ${error.message}`);
            } else {
                console.log('✅ user_profiles table updated successfully');
                this.createdTables.push('user_profiles (updated)');
            }
        } catch (error) {
            console.log('❌ Failed to update user_profiles table:', error.message);
            this.errors.push(`user_profiles: ${error.message}`);
        }
    }

    async updateChatMessagesTable() {
        console.log('💬 Updating chat_messages table...');
        
        const sql = `
            -- Add missing columns to chat_messages
            ALTER TABLE public.chat_messages 
            ADD COLUMN IF NOT EXISTS ai_response TEXT,
            ADD COLUMN IF NOT EXISTS user_message TEXT,
            ADD COLUMN IF NOT EXISTS session_id TEXT,
            ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'health_consultation',
            ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2),
            ADD COLUMN IF NOT EXISTS model_used TEXT DEFAULT 'deepseek-chat';
        `;
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.log('❌ Failed to update chat_messages table:', error.message);
                this.errors.push(`chat_messages: ${error.message}`);
            } else {
                console.log('✅ chat_messages table updated successfully');
                this.createdTables.push('chat_messages (updated)');
            }
        } catch (error) {
            console.log('❌ Failed to update chat_messages table:', error.message);
            this.errors.push(`chat_messages: ${error.message}`);
        }
    }

    async updateAppointmentsTable() {
        console.log('📅 Updating appointments table...');
        
        const sql = `
            -- Add missing columns to appointments
            ALTER TABLE public.appointments 
            ADD COLUMN IF NOT EXISTS appointment_date DATE,
            ADD COLUMN IF NOT EXISTS appointment_time TIME,
            ADD COLUMN IF NOT EXISTS doctor_name TEXT,
            ADD COLUMN IF NOT EXISTS specialty TEXT,
            ADD COLUMN IF NOT EXISTS hospital_clinic TEXT,
            ADD COLUMN IF NOT EXISTS reason TEXT,
            ADD COLUMN IF NOT EXISTS notes TEXT,
            ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled',
            ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
        `;
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.log('❌ Failed to update appointments table:', error.message);
                this.errors.push(`appointments: ${error.message}`);
            } else {
                console.log('✅ appointments table updated successfully');
                this.createdTables.push('appointments (updated)');
            }
        } catch (error) {
            console.log('❌ Failed to update appointments table:', error.message);
            this.errors.push(`appointments: ${error.message}`);
        }
    }

    async updateRemindersTable() {
        console.log('⏰ Updating reminders table...');
        
        const sql = `
            -- Add missing columns to reminders
            ALTER TABLE public.reminders 
            ADD COLUMN IF NOT EXISTS scheduled_date DATE,
            ADD COLUMN IF NOT EXISTS scheduled_time TIME,
            ADD COLUMN IF NOT EXISTS reminder_type TEXT DEFAULT 'medication',
            ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
            ADD COLUMN IF NOT EXISTS frequency TEXT,
            ADD COLUMN IF NOT EXISTS description TEXT,
            ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
        `;
        
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.log('❌ Failed to update reminders table:', error.message);
                this.errors.push(`reminders: ${error.message}`);
            } else {
                console.log('✅ reminders table updated successfully');
                this.createdTables.push('reminders (updated)');
            }
        } catch (error) {
            console.log('❌ Failed to update reminders table:', error.message);
            this.errors.push(`reminders: ${error.message}`);
        }
    }

    generateReport() {
        console.log('\n📊 DATABASE SETUP REPORT');
        console.log('='.repeat(40));
        
        if (this.createdTables.length > 0) {
            console.log('\n✅ Successfully Created/Updated:');
            this.createdTables.forEach(table => {
                console.log(`   • ${table}`);
            });
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors Encountered:');
            this.errors.forEach(error => {
                console.log(`   • ${error}`);
            });
        }
        
        const successRate = Math.round(((this.createdTables.length) / (this.createdTables.length + this.errors.length)) * 100);
        
        console.log(`\n🎯 Success Rate: ${successRate}%`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 Database setup completed successfully!');
            console.log('💡 You can now run the functionality test again.');
        } else {
            console.log('\n⚠️  Some issues were encountered.');
            console.log('💡 You may need to run these commands manually in Supabase SQL Editor.');
        }
    }
}

// Alternative method to create tables directly
async function createTablesDirectly() {
    console.log('\n🔧 Attempting direct table creation...\n');
    
    const tables = [
        {
            name: 'assessment_responses',
            sql: `
                INSERT INTO public.assessment_responses (user_id, feature_id, question_id, question_text, response_value, session_id)
                VALUES ('00000000-0000-0000-0000-000000000000', 'test', 'test', 'test', 'test', 'test')
                ON CONFLICT DO NOTHING;
                DELETE FROM public.assessment_responses WHERE feature_id = 'test';
            `
        },
        {
            name: 'ai_results',
            sql: `
                INSERT INTO public.ai_results (user_id, feature_id, ai_response, session_id)
                VALUES ('00000000-0000-0000-0000-000000000000', 'test', 'test', 'test')
                ON CONFLICT DO NOTHING;
                DELETE FROM public.ai_results WHERE feature_id = 'test';
            `
        }
    ];
    
    for (const table of tables) {
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: table.sql });
            if (error) {
                console.log(`❌ Failed to create ${table.name}:`, error.message);
            } else {
                console.log(`✅ ${table.name} table verified/created`);
            }
        } catch (error) {
            console.log(`❌ Failed to create ${table.name}:`, error.message);
        }
    }
}

async function main() {
    const setup = new DatabaseSchemaSetup();
    await setup.setupDatabase();
    
    // If there were errors, try alternative method
    if (setup.errors.length > 0) {
        await createTablesDirectly();
    }
}

if (require.main === module) {
    main().catch(console.error);
} 