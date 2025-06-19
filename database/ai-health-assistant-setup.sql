-- AI Health Assistant Database Schema
-- Run this in Supabase SQL Editor

-- 1. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI Chat Results Table
CREATE TABLE IF NOT EXISTS ai_chat_results (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    processing_time INTEGER DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    model_used TEXT DEFAULT 'chat-ai',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Assessment Starts Table (for tracking)
CREATE TABLE IF NOT EXISTS assessment_starts (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    assessment_type TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    status TEXT DEFAULT 'started'
);

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    date_of_birth DATE,
    gender TEXT,
    phone TEXT,
    emergency_contact JSONB,
    medical_conditions JSONB DEFAULT '[]',
    medications JSONB DEFAULT '[]',
    allergies JSONB DEFAULT '[]',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    record_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    data JSONB DEFAULT '{}',
    date_recorded TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    reminder_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    reminder_data JSONB DEFAULT '{}',
    frequency TEXT NOT NULL,
    reminder_times TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_session ON chat_messages(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_results_user_id ON ai_chat_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_starts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow anonymous access to chat_messages" ON chat_messages FOR ALL TO anon USING (true);
CREATE POLICY "Allow anonymous access to ai_chat_results" ON ai_chat_results FOR ALL TO anon USING (true);
CREATE POLICY "Allow anonymous access to assessment_starts" ON assessment_starts FOR ALL TO anon USING (true);
CREATE POLICY "Allow anonymous access to user_profiles" ON user_profiles FOR ALL TO anon USING (true);
CREATE POLICY "Allow anonymous access to health_records" ON health_records FOR ALL TO anon USING (true);
CREATE POLICY "Allow anonymous access to reminders" ON reminders FOR ALL TO anon USING (true); 