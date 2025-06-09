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