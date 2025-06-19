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
    status TEXT DEFAULT 'started' -- started, completed, abandoned
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

-- 5. Health Assessments Table (enhanced)
CREATE TABLE IF NOT EXISTS health_assessments (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    assessment_type TEXT NOT NULL,
    questions_data JSONB DEFAULT '{}',
    responses_data JSONB DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress', -- in_progress, completed, abandoned
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    record_type TEXT NOT NULL, -- assessment, chat, vital_signs, medication, etc.
    title TEXT NOT NULL,
    description TEXT,
    data JSONB DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    date_recorded TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    reminder_type TEXT NOT NULL, -- medication, appointment, health_goal, diet
    title TEXT NOT NULL,
    description TEXT,
    reminder_data JSONB DEFAULT '{}',
    frequency TEXT NOT NULL, -- daily, weekly, monthly, custom
    reminder_times TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    next_reminder TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    goal_type TEXT NOT NULL, -- weight_loss, blood_pressure, exercise, etc.
    title TEXT NOT NULL,
    description TEXT,
    target_value DECIMAL,
    current_value DECIMAL DEFAULT 0,
    unit TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active', -- active, completed, paused, cancelled
    progress_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. System Analytics Table
CREATE TABLE IF NOT EXISTS system_analytics (
    id BIGSERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL DEFAULT 0,
    additional_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_session ON chat_messages(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

CREATE INDEX IF NOT EXISTS idx_ai_chat_results_user_id ON ai_chat_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_results_session_id ON ai_chat_results(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_results_timestamp ON ai_chat_results(timestamp);

CREATE INDEX IF NOT EXISTS idx_assessment_starts_user_id ON assessment_starts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_starts_type ON assessment_starts(assessment_type);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_health_assessments_user_id ON health_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_health_assessments_type ON health_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_health_assessments_status ON health_assessments(status);

CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_type ON health_records(record_type);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(date_recorded);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(is_active);
CREATE INDEX IF NOT EXISTS idx_reminders_next ON reminders(next_reminder);

CREATE INDEX IF NOT EXISTS idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_health_goals_status ON health_goals(status);

CREATE INDEX IF NOT EXISTS idx_system_analytics_date ON system_analytics(date);
CREATE INDEX IF NOT EXISTS idx_system_analytics_type ON system_analytics(metric_type);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_starts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for anonymous access (adjust as needed for production)
-- Chat Messages Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to chat_messages" 
ON chat_messages FOR ALL 
TO anon 
USING (true);

-- AI Chat Results Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to ai_chat_results" 
ON ai_chat_results FOR ALL 
TO anon 
USING (true);

-- Assessment Starts Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to assessment_starts" 
ON assessment_starts FOR ALL 
TO anon 
USING (true);

-- User Profiles Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to user_profiles" 
ON user_profiles FOR ALL 
TO anon 
USING (true);

-- Health Assessments Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to health_assessments" 
ON health_assessments FOR ALL 
TO anon 
USING (true);

-- Health Records Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to health_records" 
ON health_records FOR ALL 
TO anon 
USING (true);

-- Reminders Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to reminders" 
ON reminders FOR ALL 
TO anon 
USING (true);

-- Health Goals Policies
CREATE POLICY IF NOT EXISTS "Allow anonymous access to health_goals" 
ON health_goals FOR ALL 
TO anon 
USING (true);

-- System Analytics Policies (read-only for anonymous)
CREATE POLICY IF NOT EXISTS "Allow anonymous read access to system_analytics" 
ON system_analytics FOR SELECT 
TO anon 
USING (true);

-- Create Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply Updated At Triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON health_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Sample Data (Optional)
-- Sample user profile
INSERT INTO user_profiles (user_id, full_name, email, preferences) VALUES 
('demo_user', 'Demo User', 'demo@medicare.com', '{"theme": "light", "notifications": true}')
ON CONFLICT (user_id) DO NOTHING;

-- Sample health goals
INSERT INTO health_goals (user_id, goal_type, title, description, target_value, unit, target_date) VALUES 
('demo_user', 'weight_loss', 'Lose Weight', 'Reach target weight for better health', 180, 'lbs', '2025-06-01'),
('demo_user', 'blood_pressure', 'Control Blood Pressure', 'Maintain healthy blood pressure levels', 120, 'mmHg', '2025-12-31')
ON CONFLICT DO NOTHING;

-- Sample reminders
INSERT INTO reminders (user_id, reminder_type, title, description, frequency, reminder_times) VALUES 
('demo_user', 'medication', 'Lisinopril', 'Take blood pressure medication', 'daily', '["08:00"]'),
('demo_user', 'medication', 'Metformin', 'Take diabetes medication', 'daily', '["08:00", "20:00"]')
ON CONFLICT DO NOTHING;

-- Create Views for Analytics
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    user_id,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(*) as total_messages,
    MAX(timestamp) as last_activity,
    DATE_TRUNC('day', MIN(timestamp)) as first_activity
FROM chat_messages 
GROUP BY user_id;

CREATE OR REPLACE VIEW assessment_analytics AS
SELECT 
    assessment_type,
    COUNT(*) as total_started,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completed,
    ROUND(
        (COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / COUNT(*)::decimal) * 100, 
        2
    ) as completion_rate,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/60) as avg_completion_time_minutes
FROM assessment_starts 
GROUP BY assessment_type;

CREATE OR REPLACE VIEW daily_usage_stats AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(*) as total_messages
FROM chat_messages 
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY date DESC;

-- Grant permissions to views
GRANT SELECT ON user_activity_summary TO anon;
GRANT SELECT ON assessment_analytics TO anon;
GRANT SELECT ON daily_usage_stats TO anon;

COMMENT ON TABLE chat_messages IS 'Stores all chat messages between users and AI';
COMMENT ON TABLE ai_chat_results IS 'Stores AI responses with metadata for analytics';
COMMENT ON TABLE assessment_starts IS 'Tracks when users start different types of assessments';
COMMENT ON TABLE user_profiles IS 'User profile information and preferences';
COMMENT ON TABLE health_assessments IS 'Detailed health assessment data';
COMMENT ON TABLE health_records IS 'General health records and documents';
COMMENT ON TABLE reminders IS 'User reminders for medications, appointments, etc.';
COMMENT ON TABLE health_goals IS 'User health goals and progress tracking';
COMMENT ON TABLE system_analytics IS 'System-wide analytics and metrics'; 