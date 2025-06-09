-- MediCare+ Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- =============================================
-- 1. REMINDERS TABLE
-- =============================================
CREATE TABLE reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time TIME NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. APPOINTMENTS TABLE
-- =============================================
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    hospital_clinic TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. REMINDER LOGS TABLE (Track when reminders are taken)
-- =============================================
CREATE TABLE reminder_logs (
    id BIGSERIAL PRIMARY KEY,
    reminder_id BIGINT REFERENCES reminders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    taken_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'taken' CHECK (status IN ('taken', 'skipped', 'delayed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. FAMILY MEMBERS TABLE (Optional - for managing family)
-- =============================================
CREATE TABLE family_members (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    date_of_birth DATE,
    emergency_contact TEXT,
    medical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. PHARMACIES TABLE (Optional - for pharmacy finder)
-- =============================================
CREATE TABLE pharmacies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT,
    hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. USER PREFERENCES TABLE
-- =============================================
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    notification_enabled BOOLEAN DEFAULT true,
    reminder_advance_time INTEGER DEFAULT 15, -- minutes before reminder
    timezone TEXT DEFAULT 'Asia/Colombo',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_time ON reminders(time);
CREATE INDEX idx_reminders_active ON reminders(is_active);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_reminder_logs_user_id ON reminder_logs(user_id);
CREATE INDEX idx_reminder_logs_reminder_id ON reminder_logs(reminder_id);
CREATE INDEX idx_reminder_logs_taken_at ON reminder_logs(taken_at);

-- =============================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all user tables
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Reminders policies
CREATE POLICY "Users can only access their own reminders" ON reminders
    FOR ALL USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can only access their own appointments" ON appointments
    FOR ALL USING (auth.uid() = user_id);

-- Reminder logs policies
CREATE POLICY "Users can only access their own reminder logs" ON reminder_logs
    FOR ALL USING (auth.uid() = user_id);

-- Family members policies
CREATE POLICY "Users can only access their own family members" ON family_members
    FOR ALL USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can only access their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Pharmacies are public (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read pharmacies" ON pharmacies
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- 9. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 10. SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert some sample pharmacies (for Sri Lanka)
INSERT INTO pharmacies (name, address, city, phone, hours, latitude, longitude) VALUES
('Osu Sala Pharmacy', 'No. 123, Galle Road', 'Colombo', '+94 11 234 5678', '8:00 AM - 10:00 PM', 6.9271, 79.8612),
('Green Cross Pharmacy', 'No. 456, Kandy Road', 'Kandy', '+94 81 234 5678', '7:00 AM - 9:00 PM', 7.2906, 80.6337),
('State Pharmaceuticals', 'No. 789, Main Street', 'Galle', '+94 91 234 5678', '8:00 AM - 8:00 PM', 6.0535, 80.2210),
('Life Pharmacy', 'No. 321, Negombo Road', 'Negombo', '+94 31 234 5678', '24 Hours', 7.2084, 79.8380),
('Medicare Pharmacy', 'No. 654, Jaffna Road', 'Jaffna', '+94 21 234 5678', '8:00 AM - 9:00 PM', 9.6615, 80.0255);

-- =============================================
-- SETUP COMPLETE!
-- =============================================

-- After running this schema:
-- 1. Go to Authentication > Providers in Supabase
-- 2. Enable Google OAuth
-- 3. Set Site URL and Redirect URLs
-- 4. Copy your Supabase URL and anon key
-- 5. Update your JavaScript files with the credentials 

-- Enhanced Database Schema for Medication & Appointment Reminder App
-- =================================================================

-- Enable RLS (Row Level Security) for all tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Create User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    provider VARCHAR(50) DEFAULT 'email',
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_of_birth DATE,
    phone_number VARCHAR(20),
    emergency_contact VARCHAR(255),
    medical_conditions TEXT[],
    allergies TEXT[],
    last_sign_in TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    notification_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    reminder_advance_time INTEGER DEFAULT 15, -- minutes
    snooze_duration INTEGER DEFAULT 5, -- minutes
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(20) DEFAULT 'light',
    sound_enabled BOOLEAN DEFAULT true,
    vibration_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create User Analytics Table
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    page_url TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX idx_user_analytics_timestamp ON user_analytics(timestamp);

-- Enhanced Reminders Table
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency INTEGER NOT NULL, -- times per day
    times TIME[] NOT NULL, -- array of times [08:00, 14:00, 20:00]
    duration_days INTEGER, -- null for ongoing
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    instructions TEXT,
    side_effects TEXT[],
    prescriber_name VARCHAR(100),
    pharmacy_name VARCHAR(100),
    refill_reminder BOOLEAN DEFAULT true,
    refill_date DATE,
    pills_remaining INTEGER,
    is_active BOOLEAN DEFAULT true,
    color VARCHAR(7) DEFAULT '#3B82F6', -- hex color
    icon VARCHAR(50) DEFAULT 'pill',
    priority INTEGER DEFAULT 1, -- 1=normal, 2=important, 3=critical
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes
    location TEXT,
    address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    preparation_instructions TEXT,
    reminder_times INTEGER[] DEFAULT ARRAY[1440, 60], -- minutes before [1 day, 1 hour]
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
    is_virtual BOOLEAN DEFAULT false,
    meeting_link TEXT,
    cost DECIMAL(10,2),
    insurance_covered BOOLEAN,
    follow_up_needed BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Reminder Logs Table
CREATE TABLE reminder_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP NOT NULL,
    taken_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- pending, taken, missed, snoozed, skipped
    snooze_count INTEGER DEFAULT 0,
    notes TEXT,
    side_effects_reported TEXT[],
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    location TEXT, -- where medication was taken
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointment Logs Table
CREATE TABLE appointment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- attended, missed, cancelled, rescheduled
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    doctor_notes TEXT,
    patient_notes TEXT,
    next_appointment_needed BOOLEAN,
    next_appointment_date DATE,
    prescriptions_updated BOOLEAN DEFAULT false,
    tests_ordered TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- reminder, appointment, refill, system
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    expires_at TIMESTAMP,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Medication Database (Reference Data)
CREATE TABLE medications_db (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_names TEXT[],
    category VARCHAR(100),
    description TEXT,
    common_dosages VARCHAR[],
    side_effects TEXT[],
    interactions TEXT[],
    warnings TEXT[],
    storage_instructions TEXT,
    is_prescription BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_active ON reminders(is_active) WHERE is_active = true;
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_reminder_logs_user_id ON reminder_logs(user_id);
CREATE INDEX idx_reminder_logs_status ON reminder_logs(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(is_read) WHERE is_read = false;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminder_logs_updated_at BEFORE UPDATE ON reminder_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Preferences Policies
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- User Analytics Policies
CREATE POLICY "Users can insert own analytics" ON user_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (auth.uid() = user_id);

-- Reminders Policies
CREATE POLICY "Users can manage own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);

-- Appointments Policies
CREATE POLICY "Users can manage own appointments" ON appointments FOR ALL USING (auth.uid() = user_id);

-- Reminder Logs Policies
CREATE POLICY "Users can manage own reminder logs" ON reminder_logs FOR ALL USING (auth.uid() = user_id);

-- Appointment Logs Policies
CREATE POLICY "Users can manage own appointment logs" ON appointment_logs FOR ALL USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Functions for Analytics and Statistics

-- Function to get user adherence rate
CREATE OR REPLACE FUNCTION get_user_adherence_rate(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS DECIMAL AS $$
DECLARE
    total_count INTEGER;
    taken_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count
    FROM reminder_logs
    WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
    
    SELECT COUNT(*) INTO taken_count
    FROM reminder_logs
    WHERE user_id = user_uuid
    AND status = 'taken'
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
    
    IF total_count = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((taken_count::DECIMAL / total_count * 100), 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'active_reminders', (SELECT COUNT(*) FROM reminders WHERE user_id = user_uuid AND is_active = true),
        'upcoming_appointments', (SELECT COUNT(*) FROM appointments WHERE user_id = user_uuid AND appointment_date >= CURRENT_DATE),
        'medications_taken_today', (SELECT COUNT(*) FROM reminder_logs WHERE user_id = user_uuid AND status = 'taken' AND DATE(taken_at) = CURRENT_DATE),
        'adherence_rate_30_days', get_user_adherence_rate(user_uuid, 30),
        'total_medications', (SELECT COUNT(DISTINCT medication_name) FROM reminders WHERE user_id = user_uuid),
        'missed_medications_today', (SELECT COUNT(*) FROM reminder_logs WHERE user_id = user_uuid AND status = 'missed' AND DATE(scheduled_time) = CURRENT_DATE)
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Delete old analytics data (older than 1 year)
    DELETE FROM user_analytics WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Delete old reminder logs (older than 6 months)
    DELETE FROM reminder_logs WHERE created_at < NOW() - INTERVAL '6 months';
    
    -- Delete old notifications (older than 3 months)
    DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '3 months';
    
    -- Delete expired notifications
    DELETE FROM notifications WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Sample Data for Testing (Optional)
-- Uncomment to add sample medications

/*
INSERT INTO medications_db (name, generic_name, category, common_dosages, side_effects) VALUES
('Lisinopril', 'Lisinopril', 'ACE Inhibitor', ARRAY['5mg', '10mg', '20mg'], ARRAY['Dry cough', 'Dizziness', 'Headache']),
('Metformin', 'Metformin HCl', 'Diabetes', ARRAY['500mg', '850mg', '1000mg'], ARRAY['Nausea', 'Diarrhea', 'Stomach upset']),
('Atorvastatin', 'Atorvastatin Calcium', 'Statin', ARRAY['10mg', '20mg', '40mg', '80mg'], ARRAY['Muscle pain', 'Liver problems', 'Memory issues']),
('Omeprazole', 'Omeprazole', 'PPI', ARRAY['20mg', '40mg'], ARRAY['Headache', 'Stomach pain', 'Nausea']),
('Amlodipine', 'Amlodipine Besylate', 'Calcium Channel Blocker', ARRAY['2.5mg', '5mg', '10mg'], ARRAY['Swelling', 'Dizziness', 'Flushing']);
*/

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated; 