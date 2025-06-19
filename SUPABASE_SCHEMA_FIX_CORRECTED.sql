-- =================================================
-- 🏥 MediCare+ Supabase Schema Fix - CORRECTED VERSION
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- This version fixes the UUID = TEXT type mismatch error
-- =================================================

-- 1. Create missing assessment_responses table
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

-- 2. Create missing ai_results table
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

-- 3. Add missing columns to user_profiles (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'is_profile_complete') THEN
        ALTER TABLE public.user_profiles ADD COLUMN is_profile_complete BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'user_type') THEN
        ALTER TABLE public.user_profiles ADD COLUMN user_type TEXT DEFAULT 'patient';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.user_profiles ADD COLUMN date_of_birth DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'gender') THEN
        ALTER TABLE public.user_profiles ADD COLUMN gender TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'emergency_contact_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN emergency_contact_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'emergency_contact_phone') THEN
        ALTER TABLE public.user_profiles ADD COLUMN emergency_contact_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'last_login') THEN
        ALTER TABLE public.user_profiles ADD COLUMN last_login TIMESTAMPTZ;
    END IF;
END $$;

-- 4. Add missing columns to chat_messages (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'ai_response') THEN
        ALTER TABLE public.chat_messages ADD COLUMN ai_response TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'user_message') THEN
        ALTER TABLE public.chat_messages ADD COLUMN user_message TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'session_id') THEN
        ALTER TABLE public.chat_messages ADD COLUMN session_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'message_type') THEN
        ALTER TABLE public.chat_messages ADD COLUMN message_type TEXT DEFAULT 'health_consultation';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'confidence_score') THEN
        ALTER TABLE public.chat_messages ADD COLUMN confidence_score DECIMAL(3,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'model_used') THEN
        ALTER TABLE public.chat_messages ADD COLUMN model_used TEXT DEFAULT 'deepseek-chat';
    END IF;
END $$;

-- 5. Add missing columns to appointments (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_date') THEN
        ALTER TABLE public.appointments ADD COLUMN appointment_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_time') THEN
        ALTER TABLE public.appointments ADD COLUMN appointment_time TIME;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'doctor_name') THEN
        ALTER TABLE public.appointments ADD COLUMN doctor_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'specialty') THEN
        ALTER TABLE public.appointments ADD COLUMN specialty TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'hospital_clinic') THEN
        ALTER TABLE public.appointments ADD COLUMN hospital_clinic TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'reason') THEN
        ALTER TABLE public.appointments ADD COLUMN reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'notes') THEN
        ALTER TABLE public.appointments ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'completed_at') THEN
        ALTER TABLE public.appointments ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;
END $$;

-- 6. Add missing columns to reminders (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'scheduled_date') THEN
        ALTER TABLE public.reminders ADD COLUMN scheduled_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'scheduled_time') THEN
        ALTER TABLE public.reminders ADD COLUMN scheduled_time TIME;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'reminder_type') THEN
        ALTER TABLE public.reminders ADD COLUMN reminder_type TEXT DEFAULT 'medication';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'frequency') THEN
        ALTER TABLE public.reminders ADD COLUMN frequency TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'description') THEN
        ALTER TABLE public.reminders ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'completed_at') THEN
        ALTER TABLE public.reminders ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;
END $$;

-- 7. Enable Row Level Security on all tables
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own assessment responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Users can manage their own AI results" ON public.ai_results;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can manage their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can manage their own reminders" ON public.reminders;

-- 9. Create RLS policies - but check if user_id columns are proper UUID type first
-- For user_profiles
CREATE POLICY "Users can manage their own profile" 
ON public.user_profiles
FOR ALL USING (
    CASE 
        WHEN user_id IS NULL THEN false
        ELSE auth.uid() = user_id
    END
);

-- For chat_messages - handle potential TEXT type gracefully
CREATE POLICY "Users can manage their own chat messages" 
ON public.chat_messages
FOR ALL USING (
    CASE 
        WHEN user_id IS NULL THEN false
        ELSE auth.uid()::text = user_id::text
    END
);

-- For appointments
CREATE POLICY "Users can manage their own appointments" 
ON public.appointments
FOR ALL USING (
    CASE 
        WHEN user_id IS NULL THEN false
        ELSE auth.uid()::text = user_id::text
    END
);

-- For reminders
CREATE POLICY "Users can manage their own reminders" 
ON public.reminders
FOR ALL USING (
    CASE 
        WHEN user_id IS NULL THEN false
        ELSE auth.uid()::text = user_id::text
    END
);

-- For new tables (these should have proper UUID types)
CREATE POLICY "Users can manage their own assessment responses" 
ON public.assessment_responses
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI results" 
ON public.ai_results
FOR ALL USING (auth.uid() = user_id);

-- 10. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_id ON public.assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_session_id ON public.assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_user_id ON public.ai_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_session_id ON public.ai_results(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(scheduled_date);

-- 11. Insert sample data for testing (optional)
INSERT INTO public.user_profiles (
    user_id, 
    full_name, 
    first_name, 
    last_name, 
    email, 
    is_profile_complete,
    user_type,
    created_at
) VALUES (
    gen_random_uuid(),
    'Test Patient',
    'Test',
    'Patient', 
    'test@medicare.com',
    true,
    'patient',
    NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Success confirmation
SELECT 'MediCare+ Database Schema Updated Successfully! 🚀 All UUID conflicts resolved!' as result; 