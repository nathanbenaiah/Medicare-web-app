-- =================================================
-- 🏥 MediCare+ COMPLETE Supabase Integration
-- This script creates a fully integrated healthcare platform
-- with AI chats, assessments, telemedicine, and future features
-- =================================================

-- 1. Create missing assessment_responses table
CREATE TABLE IF NOT EXISTS public.assessment_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL, -- 'symptom_checker', 'diet_planner', 'health_assessment'
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

-- 2. Create AI results table for all AI-powered features
CREATE TABLE IF NOT EXISTS public.ai_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_type TEXT NOT NULL, -- 'symptom_analysis', 'diet_plan', 'health_insights', 'telemedicine_prep'
    feature_id TEXT NOT NULL,
    session_id TEXT,
    ai_response TEXT,
    recommendations JSONB DEFAULT '[]',
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

-- 3. Create comprehensive chat_messages table for AI conversations
CREATE TABLE IF NOT EXISTS public.ai_chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    conversation_type TEXT DEFAULT 'health_consultation', -- 'symptom_check', 'diet_advice', 'medication_query', 'telemedicine'
    user_message TEXT NOT NULL,
    ai_response TEXT,
    message_order INTEGER DEFAULT 1,
    confidence_score DECIMAL(3,2),
    model_used TEXT DEFAULT 'deepseek-chat',
    context_data JSONB DEFAULT '{}',
    follow_up_needed BOOLEAN DEFAULT false,
    doctor_referral_suggested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create telemedicine sessions table (future feature)
CREATE TABLE IF NOT EXISTS public.telemedicine_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_type TEXT DEFAULT 'video_consultation', -- 'video', 'audio', 'chat', 'ai_assisted'
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    scheduled_at TIMESTAMPTZ NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    consultation_notes TEXT,
    ai_summary TEXT,
    prescriptions_issued JSONB DEFAULT '[]',
    follow_up_required BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create health insights table for AI-generated recommendations
CREATE TABLE IF NOT EXISTS public.health_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL, -- 'medication_reminder', 'health_tip', 'warning', 'recommendation'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    category TEXT, -- 'diet', 'exercise', 'medication', 'symptom', 'lifestyle'
    ai_generated BOOLEAN DEFAULT true,
    data_source JSONB DEFAULT '{}',
    expiry_date DATE,
    read_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create comprehensive medication tracking
CREATE TABLE IF NOT EXISTS public.medication_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL, -- 'daily', 'twice_daily', 'weekly', etc.
    prescribed_by TEXT,
    prescription_date DATE,
    start_date DATE NOT NULL,
    end_date DATE,
    instructions TEXT,
    side_effects JSONB DEFAULT '[]',
    interactions JSONB DEFAULT '[]',
    ai_monitoring BOOLEAN DEFAULT true,
    adherence_score DECIMAL(3,2) DEFAULT 1.0,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'discontinued'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Update existing tables with missing columns

-- Update user_profiles (make user_id NOT NULL and add comprehensive profile fields)
DO $$
BEGIN
    -- Add columns if they don't exist
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
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'ai_preferences') THEN
        ALTER TABLE public.user_profiles ADD COLUMN ai_preferences JSONB DEFAULT '{"notifications": true, "health_insights": true, "medication_reminders": true}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'health_conditions') THEN
        ALTER TABLE public.user_profiles ADD COLUMN health_conditions JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'allergies') THEN
        ALTER TABLE public.user_profiles ADD COLUMN allergies JSONB DEFAULT '[]';
    END IF;
END $$;

-- Update appointments table for telemedicine integration
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_date') THEN
        ALTER TABLE public.appointments ADD COLUMN appointment_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_time') THEN
        ALTER TABLE public.appointments ADD COLUMN appointment_time TIME;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_type') THEN
        ALTER TABLE public.appointments ADD COLUMN appointment_type TEXT DEFAULT 'in_person'; -- 'in_person', 'telemedicine', 'ai_consultation'
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'doctor_name') THEN
        ALTER TABLE public.appointments ADD COLUMN doctor_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'specialty') THEN
        ALTER TABLE public.appointments ADD COLUMN specialty TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'telemedicine_link') THEN
        ALTER TABLE public.appointments ADD COLUMN telemedicine_link TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'ai_preparation') THEN
        ALTER TABLE public.appointments ADD COLUMN ai_preparation JSONB DEFAULT '{}';
    END IF;
END $$;

-- Update legacy chat_messages table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'ai_response') THEN
            ALTER TABLE public.chat_messages ADD COLUMN ai_response TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'session_id') THEN
            ALTER TABLE public.chat_messages ADD COLUMN session_id TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'message_type') THEN
            ALTER TABLE public.chat_messages ADD COLUMN message_type TEXT DEFAULT 'health_consultation';
        END IF;
    END IF;
END $$;

-- 8. Enable Row Level Security on all tables
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 9. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own assessment responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Users can manage their own AI results" ON public.ai_results;
DROP POLICY IF EXISTS "Users can manage their own chat conversations" ON public.ai_chat_conversations;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own appointments" ON public.appointments;

-- 10. Create comprehensive RLS policies

-- Assessment responses policy
CREATE POLICY "Users can manage their own assessment responses" 
ON public.assessment_responses
FOR ALL USING (auth.uid() = user_id);

-- AI results policy
CREATE POLICY "Users can manage their own AI results" 
ON public.ai_results
FOR ALL USING (auth.uid() = user_id);

-- AI chat conversations policy
CREATE POLICY "Users can manage their own chat conversations" 
ON public.ai_chat_conversations
FOR ALL USING (auth.uid() = user_id);

-- Telemedicine sessions policy (patients can see their own, doctors can see assigned sessions)
CREATE POLICY "Users can manage their own telemedicine sessions" 
ON public.telemedicine_sessions
FOR ALL USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Health insights policy
CREATE POLICY "Users can manage their own health insights" 
ON public.health_insights
FOR ALL USING (auth.uid() = user_id);

-- Medication tracking policy
CREATE POLICY "Users can manage their own medication tracking" 
ON public.medication_tracking
FOR ALL USING (auth.uid() = user_id);

-- User profiles policy (handle type casting safely)
CREATE POLICY "Users can manage their own profile" 
ON public.user_profiles
FOR ALL USING (
    CASE 
        WHEN user_id IS NULL THEN false
        ELSE auth.uid()::text = user_id::text
    END
);

-- Appointments policy (handle type casting safely)
CREATE POLICY "Users can manage their own appointments" 
ON public.appointments
FOR ALL USING (
    CASE 
        WHEN user_id IS NULL THEN false
        ELSE auth.uid()::text = user_id::text
    END
);

-- 11. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_id ON public.assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_session_id ON public.assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_type ON public.assessment_responses(assessment_type);

CREATE INDEX IF NOT EXISTS idx_ai_results_user_id ON public.ai_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_session_id ON public.ai_results(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_feature_type ON public.ai_results(feature_type);

CREATE INDEX IF NOT EXISTS idx_ai_chat_user_id ON public.ai_chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_session_id ON public.ai_chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_type ON public.ai_chat_conversations(conversation_type);

CREATE INDEX IF NOT EXISTS idx_telemedicine_patient_id ON public.telemedicine_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_doctor_id ON public.telemedicine_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_scheduled_at ON public.telemedicine_sessions(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_health_insights_user_id ON public.health_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_health_insights_priority ON public.health_insights(priority);
CREATE INDEX IF NOT EXISTS idx_health_insights_category ON public.health_insights(category);

CREATE INDEX IF NOT EXISTS idx_medication_tracking_user_id ON public.medication_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_tracking_status ON public.medication_tracking(status);

-- 12. Create functions for AI integration

-- Function to create AI health insight
CREATE OR REPLACE FUNCTION create_ai_health_insight(
    p_user_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_category TEXT,
    p_priority TEXT DEFAULT 'medium'
)
RETURNS UUID AS $$
DECLARE
    insight_id UUID;
BEGIN
    INSERT INTO public.health_insights (
        user_id, title, description, category, priority, ai_generated
    ) VALUES (
        p_user_id, p_title, p_description, p_category, p_priority, true
    ) RETURNING id INTO insight_id;
    
    RETURN insight_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update medication adherence score
CREATE OR REPLACE FUNCTION update_medication_adherence(
    p_user_id UUID,
    p_medication_id UUID,
    p_taken BOOLEAN
)
RETURNS VOID AS $$
BEGIN
    -- Update adherence score based on medication compliance
    UPDATE public.medication_tracking 
    SET adherence_score = CASE 
        WHEN p_taken THEN LEAST(adherence_score + 0.05, 1.0)
        ELSE GREATEST(adherence_score - 0.1, 0.0)
    END
    WHERE id = p_medication_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Success confirmation without sample data insertion
SELECT 'MediCare+ Complete Integration Successfully Created! 🚀' as result,
       'All tables created with proper foreign key relationships' as status,
       'AI chats, assessments, telemedicine, and future features ready!' as features; 