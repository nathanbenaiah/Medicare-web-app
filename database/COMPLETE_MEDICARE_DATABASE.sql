-- =====================================================
-- 🏥 MEDICARE+ COMPLETE DATABASE - BUILD FROM SCRATCH
-- =====================================================
-- Project: gcggnrwqilylyykppizb
-- URL: https://gcggnrwqilylyykppizb.supabase.co
-- 
-- This ONE file builds EVERYTHING from scratch with ALL columns
-- NO ERRORS - COMPLETE HEALTHCARE DATABASE
-- Uses gen_random_uuid() which is built into Supabase
-- =====================================================

-- =====================================================
-- 🏗️ CREATE MEDICARE SCHEMA
-- =====================================================

-- Create medicare schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS medicare;

-- Set search path to include medicare schema
SET search_path TO medicare, public;

-- =====================================================
-- 🗑️ DROP ALL EXISTING TABLES (CLEAN START)
-- =====================================================

DROP TABLE IF EXISTS medicare.messages CASCADE;
DROP TABLE IF EXISTS medicare.notifications CASCADE;
DROP TABLE IF EXISTS medicare.ai_insights CASCADE;
DROP TABLE IF EXISTS medicare.vital_signs CASCADE;
DROP TABLE IF EXISTS medicare.prescriptions CASCADE;
DROP TABLE IF EXISTS medicare.medications CASCADE;
DROP TABLE IF EXISTS medicare.appointments CASCADE;
DROP TABLE IF EXISTS medicare.user_profiles CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS medicare.appointment_number_seq CASCADE;
DROP SEQUENCE IF EXISTS medicare.prescription_number_seq CASCADE;

-- =====================================================
-- 🏗️ CREATE ALL TABLES FROM SCRATCH
-- =====================================================

-- 👤 USER PROFILES TABLE - COMPLETE
CREATE TABLE medicare.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    phone_primary TEXT,
    phone_secondary TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    national_id TEXT UNIQUE,
    address JSONB,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Sri Lanka',
    occupation TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    bio TEXT,
    profile_image_url TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    allergies TEXT[],
    medical_conditions TEXT[],
    medications TEXT[],
    insurance_provider TEXT,
    insurance_number TEXT,
    preferred_language TEXT DEFAULT 'English',
    user_type TEXT DEFAULT 'patient' CHECK (user_type IN ('patient', 'provider', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 💊 MEDICATIONS TABLE - COMPLETE
CREATE TABLE medicare.medications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    medication_name TEXT NOT NULL,
    generic_name TEXT,
    brand_names TEXT[],
    strength TEXT,
    dosage_form TEXT DEFAULT 'tablet' CHECK (dosage_form IN ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'patch')),
    route_of_administration TEXT DEFAULT 'oral' CHECK (route_of_administration IN ('oral', 'topical', 'injection', 'inhalation', 'sublingual', 'rectal')),
    therapeutic_class TEXT,
    drug_category TEXT,
    indication TEXT,
    contraindications TEXT[],
    side_effects TEXT[],
    drug_interactions TEXT[],
    pregnancy_category TEXT CHECK (pregnancy_category IN ('A', 'B', 'C', 'D', 'X')),
    prescription_required BOOLEAN DEFAULT true,
    controlled_substance BOOLEAN DEFAULT false,
    storage_conditions TEXT,
    manufacturer TEXT,
    price_per_unit NUMERIC(10,2),
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'out_of_stock', 'discontinued')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📅 APPOINTMENTS TABLE - COMPLETE
CREATE TABLE medicare.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_number TEXT UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')),
    appointment_type TEXT DEFAULT 'consultation' CHECK (appointment_type IN ('consultation', 'follow_up', 'emergency', 'routine_checkup', 'specialist', 'telemedicine')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'emergency')),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    chief_complaint TEXT,
    symptoms TEXT[],
    notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    consultation_fee NUMERIC(10,2),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'cancelled')),
    payment_method TEXT,
    insurance_claim_number TEXT,
    prescription_given BOOLEAN DEFAULT false,
    lab_tests_ordered BOOLEAN DEFAULT false,
    referral_given BOOLEAN DEFAULT false,
    patient_satisfaction_rating INTEGER CHECK (patient_satisfaction_rating BETWEEN 1 AND 5),
    provider_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📋 PRESCRIPTIONS TABLE - COMPLETE
CREATE TABLE medicare.prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prescription_number TEXT UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES medicare.appointments(id) ON DELETE SET NULL,
    medication_id UUID REFERENCES medicare.medications(id) ON DELETE SET NULL,
    medication_name TEXT NOT NULL,
    generic_name TEXT,
    strength TEXT,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    route TEXT DEFAULT 'oral',
    duration TEXT,
    quantity INTEGER NOT NULL,
    refills_allowed INTEGER DEFAULT 0,
    refills_remaining INTEGER DEFAULT 0,
    instructions TEXT,
    indication TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired', 'on_hold')),
    prescribed_date DATE DEFAULT CURRENT_DATE,
    start_date DATE,
    end_date DATE,
    pharmacy_name TEXT,
    pharmacy_address TEXT,
    pharmacy_phone TEXT,
    dispensed_date DATE,
    dispensed_by TEXT,
    dispensed_quantity INTEGER,
    cost NUMERIC(10,2),
    insurance_covered BOOLEAN DEFAULT false,
    insurance_copay NUMERIC(10,2),
    patient_instructions TEXT,
    provider_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📊 VITAL SIGNS TABLE - COMPLETE
CREATE TABLE medicare.vital_signs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES medicare.appointments(id) ON DELETE SET NULL,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature NUMERIC(4,1),
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER,
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    bmi NUMERIC(4,1),
    glucose_level NUMERIC(5,1),
    cholesterol_total NUMERIC(5,1),
    cholesterol_hdl NUMERIC(5,1),
    cholesterol_ldl NUMERIC(5,1),
    pain_scale INTEGER CHECK (pain_scale BETWEEN 0 AND 10),
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    recorded_by UUID REFERENCES auth.users(id),
    measurement_method TEXT,
    device_used TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🤖 AI INSIGHTS TABLE - COMPLETE
CREATE TABLE medicare.ai_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT DEFAULT 'general' CHECK (insight_type IN ('general', 'medication', 'lifestyle', 'risk_assessment', 'symptom_analysis', 'preventive_care')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    confidence_score NUMERIC(3,2) CHECK (confidence_score BETWEEN 0.00 AND 1.00),
    data_sources TEXT[],
    related_conditions TEXT[],
    action_required BOOLEAN DEFAULT false,
    action_deadline DATE,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'acknowledged', 'acted_upon', 'dismissed')),
    user_feedback TEXT,
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    ai_model_version TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    viewed_at TIMESTAMPTZ,
    acted_upon_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🔔 NOTIFICATIONS TABLE - COMPLETE
CREATE TABLE medicare.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('appointment', 'medication', 'lab_result', 'ai_insight', 'system', 'emergency', 'reminder', 'message')),
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'medical', 'administrative', 'emergency', 'promotional')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'emergency')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    delivery_method TEXT[] DEFAULT ARRAY['in_app'],
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    action_url TEXT,
    action_required BOOLEAN DEFAULT false,
    related_entity_type TEXT,
    related_entity_id UUID,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 💬 MESSAGES TABLE - COMPLETE
CREATE TABLE medicare.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id UUID,
    subject TEXT,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'general' CHECK (message_type IN ('general', 'medical_inquiry', 'appointment_related', 'prescription_related', 'emergency', 'system')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'archived', 'deleted')),
    is_encrypted BOOLEAN DEFAULT true,
    attachments JSONB,
    parent_message_id UUID REFERENCES medicare.messages(id) ON DELETE SET NULL,
    thread_id UUID,
    read_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 🔧 CREATE SEQUENCES AND FUNCTIONS
-- =====================================================

-- Create sequences for auto-generated numbers
CREATE SEQUENCE medicare.appointment_number_seq START 1;
CREATE SEQUENCE medicare.prescription_number_seq START 1;

-- Function to generate appointment numbers (APT000001)
CREATE OR REPLACE FUNCTION medicare.generate_appointment_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.appointment_number IS NULL THEN
        NEW.appointment_number := 'APT' || LPAD(nextval('medicare.appointment_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate prescription numbers (RX000001)
CREATE OR REPLACE FUNCTION medicare.generate_prescription_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.prescription_number IS NULL THEN
        NEW.prescription_number := 'RX' || LPAD(nextval('medicare.prescription_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION medicare.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION medicare.calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL AND NEW.height > 0 THEN
        NEW.bmi := ROUND((NEW.weight / ((NEW.height / 100) * (NEW.height / 100)))::numeric, 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 🎯 CREATE ALL TRIGGERS
-- =====================================================

-- Auto-generate appointment numbers
CREATE TRIGGER generate_appointment_number_trigger 
    BEFORE INSERT ON medicare.appointments
    FOR EACH ROW EXECUTE FUNCTION medicare.generate_appointment_number();

-- Auto-generate prescription numbers
CREATE TRIGGER generate_prescription_number_trigger 
    BEFORE INSERT ON medicare.prescriptions
    FOR EACH ROW EXECUTE FUNCTION medicare.generate_prescription_number();

-- Auto-update timestamps
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON medicare.user_profiles
    FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON medicare.appointments
    FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at 
    BEFORE UPDATE ON medicare.prescriptions
    FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at 
    BEFORE UPDATE ON medicare.ai_insights
    FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON medicare.notifications
    FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON medicare.messages
    FOR EACH ROW EXECUTE FUNCTION medicare.update_updated_at_column();

-- Auto-calculate BMI
CREATE TRIGGER calculate_bmi_trigger 
    BEFORE INSERT OR UPDATE ON medicare.vital_signs
    FOR EACH ROW EXECUTE FUNCTION medicare.calculate_bmi();

-- =====================================================
-- 🚀 CREATE ALL PERFORMANCE INDEXES
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON medicare.user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON medicare.user_profiles(email);
CREATE INDEX idx_user_profiles_national_id ON medicare.user_profiles(national_id);
CREATE INDEX idx_user_profiles_name ON medicare.user_profiles(first_name, last_name);
CREATE INDEX idx_user_profiles_type ON medicare.user_profiles(user_type);

-- Medications indexes
CREATE INDEX idx_medications_name ON medicare.medications(medication_name);
CREATE INDEX idx_medications_generic ON medicare.medications(generic_name);
CREATE INDEX idx_medications_class ON medicare.medications(therapeutic_class);

-- Appointments indexes
CREATE INDEX idx_appointments_user_id ON medicare.appointments(user_id);
CREATE INDEX idx_appointments_provider_id ON medicare.appointments(provider_id);
CREATE INDEX idx_appointments_date ON medicare.appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON medicare.appointments(status);
CREATE INDEX idx_appointments_number ON medicare.appointments(appointment_number);
CREATE INDEX idx_appointments_datetime ON medicare.appointments(scheduled_date, scheduled_time);

-- Prescriptions indexes
CREATE INDEX idx_prescriptions_user_id ON medicare.prescriptions(user_id);
CREATE INDEX idx_prescriptions_provider_id ON medicare.prescriptions(provider_id);
CREATE INDEX idx_prescriptions_number ON medicare.prescriptions(prescription_number);
CREATE INDEX idx_prescriptions_medication ON medicare.prescriptions(medication_name);
CREATE INDEX idx_prescriptions_status ON medicare.prescriptions(status);
CREATE INDEX idx_prescriptions_date ON medicare.prescriptions(prescribed_date);

-- Vital signs indexes
CREATE INDEX idx_vital_signs_user_id ON medicare.vital_signs(user_id);
CREATE INDEX idx_vital_signs_recorded_at ON medicare.vital_signs(recorded_at);

-- AI insights indexes
CREATE INDEX idx_ai_insights_user_id ON medicare.ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON medicare.ai_insights(insight_type);
CREATE INDEX idx_ai_insights_priority ON medicare.ai_insights(priority);
CREATE INDEX idx_ai_insights_status ON medicare.ai_insights(status);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON medicare.notifications(user_id);
CREATE INDEX idx_notifications_type ON medicare.notifications(type);
CREATE INDEX idx_notifications_status ON medicare.notifications(status);
CREATE INDEX idx_notifications_scheduled ON medicare.notifications(scheduled_for);

-- Messages indexes
CREATE INDEX idx_messages_sender_id ON medicare.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON medicare.messages(recipient_id);
CREATE INDEX idx_messages_conversation_id ON medicare.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON medicare.messages(created_at);

-- =====================================================
-- 🔐 ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE medicare.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicare.messages ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON medicare.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON medicare.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON medicare.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Medications Policies (public read for reference data)
CREATE POLICY "Anyone can view medications" ON medicare.medications
    FOR SELECT USING (true);

-- Appointments Policies
CREATE POLICY "Users can view own appointments" ON medicare.appointments
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create appointments" ON medicare.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can manage appointments" ON medicare.appointments
    FOR UPDATE USING (auth.uid() = provider_id);

-- Prescriptions Policies
CREATE POLICY "Users can view own prescriptions" ON medicare.prescriptions
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Providers can create prescriptions" ON medicare.prescriptions
    FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Vital Signs Policies
CREATE POLICY "Users can manage own vital signs" ON medicare.vital_signs
    FOR ALL USING (auth.uid() = user_id OR auth.uid() = recorded_by);

-- AI Insights Policies
CREATE POLICY "Users can view own insights" ON medicare.ai_insights
    FOR ALL USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can manage own notifications" ON medicare.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view own messages" ON medicare.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON medicare.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- =====================================================
-- 📊 INSERT SAMPLE DATA
-- =====================================================

-- Insert sample medications with ALL columns
INSERT INTO medicare.medications (
    medication_name, 
    generic_name, 
    strength, 
    dosage_form, 
    therapeutic_class, 
    indication,
    contraindications,
    side_effects,
    drug_interactions,
    prescription_required,
    manufacturer
) VALUES
('Paracetamol', 'Acetaminophen', '500mg', 'tablet', 'Analgesic', 'Pain relief and fever reduction', ARRAY['Liver disease'], ARRAY['Nausea', 'Rash'], ARRAY['Warfarin'], true, 'Generic Pharma'),
('Ibuprofen', 'Ibuprofen', '400mg', 'tablet', 'NSAID', 'Pain, inflammation, and fever', ARRAY['Stomach ulcers', 'Kidney disease'], ARRAY['Stomach upset', 'Dizziness'], ARRAY['Aspirin', 'Warfarin'], true, 'Pain Relief Inc'),
('Amoxicillin', 'Amoxicillin', '250mg', 'capsule', 'Antibiotic', 'Bacterial infections', ARRAY['Penicillin allergy'], ARRAY['Diarrhea', 'Nausea'], ARRAY['Methotrexate'], true, 'Antibiotic Labs'),
('Metformin', 'Metformin', '500mg', 'tablet', 'Antidiabetic', 'Type 2 diabetes management', ARRAY['Kidney disease', 'Heart failure'], ARRAY['Nausea', 'Diarrhea'], ARRAY['Alcohol'], true, 'Diabetes Care'),
('Lisinopril', 'Lisinopril', '10mg', 'tablet', 'ACE Inhibitor', 'High blood pressure', ARRAY['Pregnancy', 'Kidney disease'], ARRAY['Dry cough', 'Dizziness'], ARRAY['Potassium supplements'], true, 'Heart Health Co'),
('Aspirin', 'Acetylsalicylic Acid', '81mg', 'tablet', 'Antiplatelet', 'Heart attack prevention', ARRAY['Bleeding disorders'], ARRAY['Stomach irritation'], ARRAY['Warfarin'], false, 'Cardio Pharma'),
('Omeprazole', 'Omeprazole', '20mg', 'capsule', 'Proton Pump Inhibitor', 'Acid reflux and ulcers', ARRAY['Liver disease'], ARRAY['Headache', 'Nausea'], ARRAY['Clopidogrel'], true, 'Gastro Med'),
('Atorvastatin', 'Atorvastatin', '20mg', 'tablet', 'Statin', 'High cholesterol', ARRAY['Liver disease', 'Pregnancy'], ARRAY['Muscle pain', 'Liver problems'], ARRAY['Cyclosporine'], true, 'Cholesterol Control'),
('Amlodipine', 'Amlodipine', '5mg', 'tablet', 'Calcium Channel Blocker', 'High blood pressure', ARRAY['Severe aortic stenosis'], ARRAY['Swelling', 'Dizziness'], ARRAY['Simvastatin'], true, 'BP Solutions'),
('Cetirizine', 'Cetirizine', '10mg', 'tablet', 'Antihistamine', 'Allergies and hay fever', ARRAY['Severe kidney disease'], ARRAY['Drowsiness', 'Dry mouth'], ARRAY['Alcohol'], false, 'Allergy Relief Co');

-- =====================================================
-- 🎉 SUCCESS MESSAGE
-- =====================================================

SELECT 'SUCCESS: Complete Medicare+ database created with MEDICARE SCHEMA and ALL tables and columns!' as result; 