-- =================================================
-- 🏥 MediCare+ Supabase Schema Fix - MANUAL EXECUTION
-- Copy and paste this ENTIRE script into Supabase SQL Editor
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

-- 3. Add missing columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'patient';

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS gender TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- 4. Add missing columns to chat_messages
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS ai_response TEXT;

ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS user_message TEXT;

ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS session_id TEXT;

ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'health_consultation';

ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2);

ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS model_used TEXT DEFAULT 'deepseek-chat';

-- 5. Add missing columns to appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS appointment_date DATE;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS appointment_time TIME;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS doctor_name TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS specialty TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS hospital_clinic TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS reason TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 6. Add missing columns to reminders
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS scheduled_date DATE;

ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS scheduled_time TIME;

ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS reminder_type TEXT DEFAULT 'medication';

ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS frequency TEXT;

ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 7. Enable Row Level Security on all tables
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for new tables
CREATE POLICY "Users can manage their own assessment responses" 
ON public.assessment_responses
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI results" 
ON public.ai_results
FOR ALL USING (auth.uid() = user_id);

-- Update existing policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can manage their own profile') THEN
        CREATE POLICY "Users can manage their own profile" 
        ON public.user_profiles
        FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can manage their own chat messages') THEN
        CREATE POLICY "Users can manage their own chat messages" 
        ON public.chat_messages
        FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can manage their own appointments') THEN
        CREATE POLICY "Users can manage their own appointments" 
        ON public.appointments
        FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can manage their own reminders') THEN
        CREATE POLICY "Users can manage their own reminders" 
        ON public.reminders
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- 9. Create performance indexes
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

-- 10. Insert sample data for testing (optional)
-- Create a test user profile
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
SELECT 'MediCare+ Database Schema Updated Successfully! 🚀' as result; 