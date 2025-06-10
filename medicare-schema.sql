-- =============================================
-- MEDICARE+ DATABASE SCHEMA (CONFLICT-FREE)
-- =============================================

-- Create Medicare schema
CREATE SCHEMA IF NOT EXISTS medicare;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TABLES IN MEDICARE SCHEMA
-- =============================================

-- User Profiles Table
CREATE TABLE medicare.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    bio TEXT,
    address TEXT,
    occupation TEXT,
    skills TEXT[],
    profile_picture TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'google',
    is_profile_complete BOOLEAN DEFAULT false,
    last_sign_in TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings Table (renamed to avoid conflict)
CREATE TABLE medicare.user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    notification_enabled BOOLEAN DEFAULT true,
    reminder_advance_time INTEGER DEFAULT 15,
    timezone TEXT DEFAULT 'Asia/Colombo',
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'light',
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Analytics Table
CREATE TABLE medicare.user_analytics (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Reminders Table
CREATE TABLE medicare.medication_reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time TIME NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7],
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical Appointments Table
CREATE TABLE medicare.medical_appointments (
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
    reminder_sent BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Logs Table
CREATE TABLE medicare.medication_logs (
    id BIGSERIAL PRIMARY KEY,
    reminder_id BIGINT REFERENCES medicare.medication_reminders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    taken_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'taken' CHECK (status IN ('taken', 'skipped', 'delayed', 'missed')),
    notes TEXT,
    reaction TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Notifications Table
CREATE TABLE medicare.system_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('reminder', 'appointment', 'system', 'health_tip', 'refill')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority INTEGER DEFAULT 1 CHECK (priority IN (1, 2, 3)),
    is_read BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications Database Table
CREATE TABLE medicare.medications_db (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    common_dosages TEXT[] DEFAULT '{}',
    side_effects TEXT[] DEFAULT '{}',
    interactions TEXT[] DEFAULT '{}',
    warnings TEXT[] DEFAULT '{}',
    storage_instructions TEXT,
    requires_prescription BOOLEAN DEFAULT true,
    manufacturer TEXT,
    active_ingredients TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pharmacies Network Table  
CREATE TABLE medicare.pharmacies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    province TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_24_hours BOOLEAN DEFAULT false,
    has_delivery BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_medicare_user_profiles_email ON medicare.user_profiles(email);
CREATE INDEX idx_medicare_user_profiles_complete ON medicare.user_profiles(is_profile_complete);
CREATE INDEX idx_medicare_user_settings_user_id ON medicare.user_settings(user_id);
CREATE INDEX idx_medicare_user_analytics_user_id ON medicare.user_analytics(user_id);
CREATE INDEX idx_medicare_user_analytics_event_type ON medicare.user_analytics(event_type);
CREATE INDEX idx_medicare_user_analytics_timestamp ON medicare.user_analytics(timestamp);
CREATE INDEX idx_medicare_medication_reminders_user_id ON medicare.medication_reminders(user_id);
CREATE INDEX idx_medicare_medication_reminders_active ON medicare.medication_reminders(is_active) WHERE is_active = true;
CREATE INDEX idx_medicare_medical_appointments_user_id ON medicare.medical_appointments(user_id);
CREATE INDEX idx_medicare_medical_appointments_date ON medicare.medical_appointments(appointment_date);
CREATE INDEX idx_medicare_medication_logs_user_id ON medicare.medication_logs(user_id);
CREATE INDEX idx_medicare_system_notifications_user_id ON medicare.system_notifications(user_id);
CREATE INDEX idx_medicare_medications_db_name ON medicare.medications_db(name);
CREATE INDEX idx_medicare_medications_db_category ON medicare.medications_db(category);
CREATE INDEX idx_medicare_pharmacies_city ON medicare.pharmacies(city);
CREATE INDEX idx_medicare_pharmacies_active ON medicare.pharmacies(is_active) WHERE is_active = true;

-- =============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================

CREATE OR REPLACE FUNCTION medicare.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON medicare.user_profiles FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON medicare.user_settings FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();
CREATE TRIGGER update_medication_reminders_updated_at BEFORE UPDATE ON medicare.medication_reminders FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();
CREATE TRIGGER update_medical_appointments_updated_at BEFORE UPDATE ON medicare.medical_appointments FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();
CREATE TRIGGER update_medications_db_updated_at BEFORE UPDATE ON medicare.medications_db FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

ALTER TABLE medicare.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.medical_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.system_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own profile" ON medicare.user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can only access their own settings" ON medicare.user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert analytics" ON medicare.user_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read their own analytics" ON medicare.user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own medication reminders" ON medicare.medication_reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own appointments" ON medicare.medical_appointments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own medication logs" ON medicare.medication_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own notifications" ON medicare.system_notifications FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Authenticated users can read medications database" ON medicare.medications_db FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read pharmacies" ON medicare.pharmacies FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- ENHANCED DATABASE FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION medicare.is_user_profile_complete(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    profile_complete BOOLEAN;
BEGIN
    SELECT is_profile_complete INTO profile_complete
    FROM medicare.user_profiles
    WHERE id = user_uuid;
    
    RETURN COALESCE(profile_complete, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION medicare.create_user_profile(
    p_id UUID,
    p_email TEXT,
    p_full_name TEXT DEFAULT NULL,
    p_phone_number TEXT DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_occupation TEXT DEFAULT NULL,
    p_skills TEXT[] DEFAULT NULL,
    p_profile_picture TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_provider TEXT DEFAULT 'google'
)
RETURNS medicare.user_profiles AS $$
DECLARE
    result medicare.user_profiles;
    is_complete BOOLEAN;
BEGIN
    is_complete := (
        p_full_name IS NOT NULL AND trim(p_full_name) != '' AND
        p_phone_number IS NOT NULL AND trim(p_phone_number) != '' AND
        p_bio IS NOT NULL AND trim(p_bio) != '' AND
        p_address IS NOT NULL AND trim(p_address) != '' AND
        p_occupation IS NOT NULL AND trim(p_occupation) != '' AND
        p_skills IS NOT NULL AND array_length(p_skills, 1) > 0
    );
    
    INSERT INTO medicare.user_profiles (
        id, email, full_name, phone_number, bio, address, occupation, 
        skills, profile_picture, avatar_url, provider, is_profile_complete, last_sign_in
    )
    VALUES (
        p_id, p_email, p_full_name, p_phone_number, p_bio, p_address, 
        p_occupation, p_skills, p_profile_picture, p_avatar_url, p_provider, is_complete, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        bio = EXCLUDED.bio,
        address = EXCLUDED.address,
        occupation = EXCLUDED.occupation,
        skills = EXCLUDED.skills,
        profile_picture = EXCLUDED.profile_picture,
        avatar_url = EXCLUDED.avatar_url,
        is_profile_complete = EXCLUDED.is_profile_complete,
        last_sign_in = NOW(),
        updated_at = NOW()
    RETURNING * INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION medicare.update_user_profile(
    p_user_id UUID,
    p_full_name TEXT DEFAULT NULL,
    p_phone_number TEXT DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_occupation TEXT DEFAULT NULL,
    p_skills TEXT[] DEFAULT NULL,
    p_profile_picture TEXT DEFAULT NULL
)
RETURNS medicare.user_profiles AS $$
DECLARE
    result medicare.user_profiles;
    is_complete BOOLEAN;
BEGIN
    SELECT (
        COALESCE(p_full_name, full_name) IS NOT NULL AND trim(COALESCE(p_full_name, full_name)) != '' AND
        COALESCE(p_phone_number, phone_number) IS NOT NULL AND trim(COALESCE(p_phone_number, phone_number)) != '' AND
        COALESCE(p_bio, bio) IS NOT NULL AND trim(COALESCE(p_bio, bio)) != '' AND
        COALESCE(p_address, address) IS NOT NULL AND trim(COALESCE(p_address, address)) != '' AND
        COALESCE(p_occupation, occupation) IS NOT NULL AND trim(COALESCE(p_occupation, occupation)) != '' AND
        COALESCE(p_skills, skills) IS NOT NULL AND array_length(COALESCE(p_skills, skills), 1) > 0
    ) INTO is_complete
    FROM medicare.user_profiles
    WHERE id = p_user_id;
    
    UPDATE medicare.user_profiles SET
        full_name = COALESCE(p_full_name, full_name),
        phone_number = COALESCE(p_phone_number, phone_number),
        bio = COALESCE(p_bio, bio),
        address = COALESCE(p_address, address),
        occupation = COALESCE(p_occupation, occupation),
        skills = COALESCE(p_skills, skills),
        profile_picture = COALESCE(p_profile_picture, profile_picture),
        is_profile_complete = is_complete,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING * INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION medicare.get_user_profile(user_uuid UUID)
RETURNS medicare.user_profiles AS $$
DECLARE
    result medicare.user_profiles;
BEGIN
    SELECT * INTO result
    FROM medicare.user_profiles
    WHERE id = user_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION medicare.validate_profile_data(profile_data JSONB)
RETURNS JSONB AS $$
DECLARE
    errors TEXT[] := '{}';
    result JSONB;
BEGIN
    IF NOT (profile_data ? 'full_name') OR trim(profile_data->>'full_name') = '' THEN
        errors := array_append(errors, 'Full name is required');
    END IF;
    
    IF NOT (profile_data ? 'phone_number') OR trim(profile_data->>'phone_number') = '' THEN
        errors := array_append(errors, 'Phone number is required');
    END IF;
    
    IF (profile_data ? 'phone_number') AND NOT (profile_data->>'phone_number' ~ '^\+?[0-9\s\-\(\)]{7,15}$') THEN
        errors := array_append(errors, 'Invalid phone number format');
    END IF;
    
    IF (profile_data ? 'email') AND NOT (profile_data->>'email' ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') THEN
        errors := array_append(errors, 'Invalid email format');
    END IF;
    
    IF array_length(errors, 1) > 0 THEN
        result := jsonb_build_object('valid', false, 'errors', to_jsonb(errors));
    ELSE
        result := jsonb_build_object('valid', true, 'errors', '[]'::jsonb);
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SAMPLE DATA
-- =============================================

INSERT INTO medicare.medications_db (name, generic_name, category, common_dosages, side_effects, description, interactions, warnings, storage_instructions) VALUES
('Lisinopril', 'Lisinopril', 'ACE Inhibitor', 
 ARRAY['5mg', '10mg', '20mg'], 
 ARRAY['Dry cough', 'Dizziness', 'Headache', 'Fatigue'],
 'Used to treat high blood pressure and heart failure',
 ARRAY['NSAIDs may reduce effectiveness', 'Potassium supplements may cause hyperkalemia'],
 ARRAY['May cause severe drop in blood pressure', 'Not suitable during pregnancy'],
 'Store at room temperature, away from moisture and heat'),

('Metformin', 'Metformin HCl', 'Diabetes', 
 ARRAY['500mg', '850mg', '1000mg'], 
 ARRAY['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
 'Used to control blood sugar levels in type 2 diabetes',
 ARRAY['Alcohol may increase risk of lactic acidosis', 'Contrast dyes may affect kidney function'],
 ARRAY['May cause lactic acidosis in rare cases', 'Monitor kidney function regularly'],
 'Store in original container at room temperature'),

('Atorvastatin', 'Atorvastatin Calcium', 'Statin', 
 ARRAY['10mg', '20mg', '40mg', '80mg'], 
 ARRAY['Muscle pain', 'Liver problems', 'Memory issues', 'Digestive problems'],
 'Used to lower cholesterol and reduce risk of heart disease',
 ARRAY['Grapefruit juice increases risk of side effects', 'Some antibiotics may increase concentration'],
 ARRAY['May cause serious muscle problems', 'Regular liver function tests required'],
 'Store at room temperature, protect from light'),

('Omeprazole', 'Omeprazole', 'PPI', 
 ARRAY['20mg', '40mg'], 
 ARRAY['Headache', 'Stomach pain', 'Nausea', 'Diarrhea', 'Vitamin B12 deficiency'],
 'Used to treat acid reflux, heartburn, and stomach ulcers',
 ARRAY['May reduce effectiveness of clopidogrel', 'May increase digoxin levels'],
 ARRAY['Long-term use may increase fracture risk', 'May mask symptoms of stomach cancer'],
 'Store in original container, protect from moisture'),

('Amlodipine', 'Amlodipine Besylate', 'Calcium Channel Blocker', 
 ARRAY['2.5mg', '5mg', '10mg'], 
 ARRAY['Swelling', 'Dizziness', 'Flushing', 'Fatigue', 'Palpitations'],
 'Used to treat high blood pressure and chest pain (angina)',
 ARRAY['May interact with simvastatin', 'Grapefruit juice may increase concentration'],
 ARRAY['May cause severe hypotension', 'Use with caution in liver disease'],
 'Store at room temperature, away from light and moisture'),

('Aspirin', 'Acetylsalicylic Acid', 'NSAID/Antiplatelet', 
 ARRAY['81mg', '325mg', '500mg'], 
 ARRAY['Stomach irritation', 'Bleeding risk', 'Ringing in ears', 'Allergic reactions'],
 'Used for pain relief, fever reduction, and blood clot prevention',
 ARRAY['Increases bleeding risk with warfarin', 'May reduce effectiveness of ACE inhibitors'],
 ARRAY['Reye syndrome risk in children', 'Contraindicated in severe liver disease'],
 'Store in tight container at room temperature'),

('Levothyroxine', 'Levothyroxine Sodium', 'Thyroid Hormone', 
 ARRAY['25mcg', '50mcg', '75mcg', '100mcg', '125mcg'], 
 ARRAY['Heart palpitations', 'Insomnia', 'Tremors', 'Weight loss'],
 'Used to treat hypothyroidism and thyroid hormone deficiency',
 ARRAY['Coffee may reduce absorption', 'Calcium supplements may interfere'],
 ARRAY['May cause irregular heartbeat', 'Requires regular blood monitoring'],
 'Store at room temperature, protect from light and moisture'),

('Warfarin', 'Warfarin Sodium', 'Anticoagulant', 
 ARRAY['1mg', '2mg', '5mg', '10mg'], 
 ARRAY['Bleeding', 'Bruising', 'Hair loss', 'Skin necrosis'],
 'Used to prevent blood clots in various conditions',
 ARRAY['Many drug interactions', 'Vitamin K foods affect dosing', 'Alcohol increases bleeding risk'],
 ARRAY['Requires regular INR monitoring', 'High bleeding risk', 'Pregnancy category X'],
 'Store at room temperature, protect from light');

INSERT INTO medicare.pharmacies (name, address, city, district, province, phone, hours, latitude, longitude, is_24_hours, has_delivery) VALUES
('Osu Sala Pharmacy', 'No. 123, Galle Road', 'Colombo', 'Colombo', 'Western', '+94 11 234 5678', '8:00 AM - 10:00 PM', 6.9271, 79.8612, false, true),
('Green Cross Pharmacy', 'No. 456, Kandy Road', 'Kandy', 'Kandy', 'Central', '+94 81 234 5678', '7:00 AM - 9:00 PM', 7.2906, 80.6337, false, true),
('State Pharmaceuticals Corporation', 'No. 789, Main Street', 'Galle', 'Galle', 'Southern', '+94 91 234 5678', '8:00 AM - 8:00 PM', 6.0535, 80.2210, false, false),
('Life Pharmacy', 'No. 321, Negombo Road', 'Negombo', 'Gampaha', 'Western', '+94 31 234 5678', '24 Hours', 7.2084, 79.8380, true, true),
('Medicare Pharmacy', 'No. 654, Jaffna Road', 'Jaffna', 'Jaffna', 'Northern', '+94 21 234 5678', '8:00 AM - 9:00 PM', 9.6615, 80.0255, false, false),
('Keells Super Pharmacy', 'No. 12, Independence Square', 'Colombo 07', 'Colombo', 'Western', '+94 11 345 6789', '9:00 AM - 10:00 PM', 6.9080, 79.8700, false, true),
('Healthguard Pharmacy', 'No. 45, Peradeniya Road', 'Kandy', 'Kandy', 'Central', '+94 81 345 6789', '8:00 AM - 8:00 PM', 7.2960, 80.6350, false, true),
('New Pharmacy', 'No. 78, Station Road', 'Matara', 'Matara', 'Southern', '+94 41 234 5678', '8:00 AM - 9:00 PM', 5.9549, 80.5550, false, false),
('Central Dispensary', 'No. 56, Hospital Street', 'Anuradhapura', 'Anuradhapura', 'North Central', '+94 25 234 5678', '7:00 AM - 7:00 PM', 8.3114, 80.4037, false, false),
('Wellness Pharmacy', 'No. 90, Sea Street', 'Batticaloa', 'Batticaloa', 'Eastern', '+94 65 234 5678', '8:00 AM - 8:00 PM', 7.7102, 81.6924, false, true);

INSERT INTO medicare.system_notifications (type, title, message, priority, user_id, scheduled_for, expires_at) VALUES
('system', 'Welcome to Medicare+', 'Thank you for joining our health management platform!', 1, NULL, NOW(), NOW() + INTERVAL '7 days'),
('health_tip', 'Daily Health Tip', 'Remember to drink 8 glasses of water daily for better health!', 1, NULL, NOW() + INTERVAL '1 day', NOW() + INTERVAL '3 days'),
('system', 'New Feature Available', 'Check out our new medication search feature in your profile!', 2, NULL, NOW(), NOW() + INTERVAL '5 days'),
('health_tip', 'Exercise Reminder', 'Try to get at least 30 minutes of physical activity today!', 1, NULL, NOW() + INTERVAL '2 days', NOW() + INTERVAL '4 days'),
('system', 'Maintenance Notice', 'Scheduled maintenance tonight from 2:00 AM - 4:00 AM', 3, NULL, NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days');

INSERT INTO medicare.user_analytics (event_type, event_data, timestamp) VALUES
('page_view', '{"page": "index", "referrer": "google.com"}', NOW() - INTERVAL '2 days'),
('sign_in_attempt', '{"provider": "google", "success": true}', NOW() - INTERVAL '2 days'),
('profile_created', '{"fields_completed": 8, "upload_profile_pic": true}', NOW() - INTERVAL '2 days'),
('medication_search', '{"query": "aspirin", "results_count": 3}', NOW() - INTERVAL '1 day'),
('pharmacy_search', '{"location": "Colombo", "results_count": 5}', NOW() - INTERVAL '1 day'),
('feature_usage', '{"feature": "medication_reminder", "action": "create"}', NOW() - INTERVAL '4 hours'),
('page_view', '{"page": "profile", "session_duration": 180}', NOW() - INTERVAL '1 hour'); 