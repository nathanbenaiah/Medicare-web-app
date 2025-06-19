-- =================================================
-- MediCare+ Database Schema Fix
-- Run this in Supabase SQL Editor to fix all issues
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

-- Enable RLS for assessment_responses
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for assessment_responses
CREATE POLICY "Users can manage their own assessment responses" 
ON public.assessment_responses
FOR ALL USING (auth.uid() = user_id);

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

-- Enable RLS for ai_results
ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;

-- Create policy for ai_results
CREATE POLICY "Users can manage their own AI results" 
ON public.ai_results
FOR ALL USING (auth.uid() = user_id);

-- 3. Update user_profiles table with missing columns
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

-- 4. Update chat_messages table with missing columns
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS ai_response TEXT,
ADD COLUMN IF NOT EXISTS user_message TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'health_consultation',
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS model_used TEXT DEFAULT 'deepseek-chat';

-- 5. Update appointments table with missing columns
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

-- 6. Update reminders table with missing columns
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS scheduled_date DATE,
ADD COLUMN IF NOT EXISTS scheduled_time TIME,
ADD COLUMN IF NOT EXISTS reminder_type TEXT DEFAULT 'medication',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS frequency TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 7. Create indexes for better performance
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

-- 8. Enable RLS on all tables if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;

-- 9. Create policies for existing tables
-- User profiles policy
CREATE POLICY IF NOT EXISTS "Users can manage their own profile" 
ON public.user_profiles
FOR ALL USING (auth.uid() = user_id);

-- Chat messages policy
CREATE POLICY IF NOT EXISTS "Users can manage their own chat messages" 
ON public.chat_messages
FOR ALL USING (auth.uid() = user_id);

-- Appointments policy
CREATE POLICY IF NOT EXISTS "Users can manage their own appointments" 
ON public.appointments
FOR ALL USING (auth.uid() = user_id);

-- Reminders policy
CREATE POLICY IF NOT EXISTS "Users can manage their own reminders" 
ON public.reminders
FOR ALL USING (auth.uid() = user_id);

-- Medications policy
CREATE POLICY IF NOT EXISTS "Users can manage their own medications" 
ON public.medications
FOR ALL USING (auth.uid() = user_id);

-- Vital signs policy
CREATE POLICY IF NOT EXISTS "Users can manage their own vital signs" 
ON public.vital_signs
FOR ALL USING (auth.uid() = user_id);

-- Success message
SELECT 'Database schema updated successfully!' as message; 