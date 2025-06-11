-- Medicare+ Dual Dashboard Schema Update
-- This script safely adds new tables and columns without conflicts

-- Enable necessary extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums for the new system (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('patient', 'provider', 'nurse', 'pharmacist', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_enum AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE medication_status_enum AS ENUM ('active', 'discontinued', 'completed', 'on_hold', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE adherence_status_enum AS ENUM ('taken', 'missed', 'delayed', 'partial', 'skipped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high', 'urgent', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing users table (add missing columns if they don't exist)
DO $$ 
BEGIN
    -- Check if role column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role' AND table_schema = 'auth') THEN
        ALTER TABLE auth.users ADD COLUMN role user_role_enum DEFAULT 'patient';
    END IF;
    
    -- Add other missing columns if needed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login' AND table_schema = 'auth') THEN
        ALTER TABLE auth.users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If auth.users doesn't exist or we can't modify it, that's okay
        NULL;
END $$;

-- Enhance user_profiles table (add missing columns if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'height_cm') THEN
        ALTER TABLE user_profiles ADD COLUMN height_cm NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'weight_kg') THEN
        ALTER TABLE user_profiles ADD COLUMN weight_kg NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'blood_type') THEN
        ALTER TABLE user_profiles ADD COLUMN blood_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE user_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'emergency_contact') THEN
        ALTER TABLE user_profiles ADD COLUMN emergency_contact JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'insurance_info') THEN
        ALTER TABLE user_profiles ADD COLUMN insurance_info JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'medical_history') THEN
        ALTER TABLE user_profiles ADD COLUMN medical_history JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'preferred_language') THEN
        ALTER TABLE user_profiles ADD COLUMN preferred_language TEXT DEFAULT 'en';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'profile_image_url') THEN
        ALTER TABLE user_profiles ADD COLUMN profile_image_url TEXT;
    END IF;
END $$;

-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'clinic',
    license_number TEXT,
    address JSONB NOT NULL,
    contact_info JSONB NOT NULL,
    specialties TEXT[],
    operating_hours JSONB,
    website TEXT,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create provider_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS provider_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    license_number TEXT,
    specialties TEXT[],
    qualifications JSONB,
    department TEXT,
    role TEXT DEFAULT 'doctor',
    is_primary_care BOOLEAN DEFAULT FALSE,
    consultation_fee NUMERIC(10,2),
    availability_schedule JSONB,
    bio TEXT,
    years_experience INTEGER,
    languages_spoken TEXT[],
    accepts_new_patients BOOLEAN DEFAULT TRUE,
    telehealth_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_provider_relationships table if it doesn't exist
CREATE TABLE IF NOT EXISTS patient_provider_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    relationship_type TEXT DEFAULT 'primary_care',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id, provider_id, relationship_type)
);

-- Enhance medications table if it exists, or create if it doesn't
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medications') THEN
        -- Add missing columns to existing medications table
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'brand_names') THEN
            ALTER TABLE medications ADD COLUMN brand_names TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'dosage_forms') THEN
            ALTER TABLE medications ADD COLUMN dosage_forms TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'strength_options') THEN
            ALTER TABLE medications ADD COLUMN strength_options TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'side_effects') THEN
            ALTER TABLE medications ADD COLUMN side_effects TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'contraindications') THEN
            ALTER TABLE medications ADD COLUMN contraindications TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'updated_at') THEN
            ALTER TABLE medications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    ELSE
        CREATE TABLE medications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            generic_name TEXT,
            brand_names TEXT[],
            drug_class TEXT,
            dosage_forms TEXT[],
            strength_options TEXT[],
            manufacturer TEXT,
            description TEXT,
            side_effects TEXT[],
            contraindications TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Enhance patient_medications table if it exists, or create if it doesn't
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_medications') THEN
        -- Add missing columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'prescribed_by') THEN
            ALTER TABLE patient_medications ADD COLUMN prescribed_by UUID REFERENCES auth.users(id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'organization_id') THEN
            ALTER TABLE patient_medications ADD COLUMN organization_id UUID REFERENCES organizations(id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'route') THEN
            ALTER TABLE patient_medications ADD COLUMN route TEXT DEFAULT 'oral';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'start_date') THEN
            ALTER TABLE patient_medications ADD COLUMN start_date DATE DEFAULT CURRENT_DATE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'end_date') THEN
            ALTER TABLE patient_medications ADD COLUMN end_date DATE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'refills_remaining') THEN
            ALTER TABLE patient_medications ADD COLUMN refills_remaining INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'status') THEN
            ALTER TABLE patient_medications ADD COLUMN status TEXT DEFAULT 'active';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'instructions') THEN
            ALTER TABLE patient_medications ADD COLUMN instructions TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'updated_at') THEN
            ALTER TABLE patient_medications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    ELSE
        CREATE TABLE patient_medications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            medication_id UUID REFERENCES medications(id),
            prescribed_by UUID REFERENCES auth.users(id),
            organization_id UUID REFERENCES organizations(id),
            dosage TEXT NOT NULL,
            frequency TEXT NOT NULL,
            route TEXT DEFAULT 'oral',
            start_date DATE DEFAULT CURRENT_DATE,
            end_date DATE,
            refills_remaining INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            instructions TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create medication_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS medication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_medication_id UUID REFERENCES patient_medications(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'scheduled',
    method TEXT DEFAULT 'manual',
    notes TEXT,
    side_effects_reported TEXT[],
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance appointments table if it exists, or create if it doesn't
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        -- Add missing columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'organization_id') THEN
            ALTER TABLE appointments ADD COLUMN organization_id UUID REFERENCES organizations(id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_type') THEN
            ALTER TABLE appointments ADD COLUMN appointment_type TEXT DEFAULT 'consultation';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'duration_minutes') THEN
            ALTER TABLE appointments ADD COLUMN duration_minutes INTEGER DEFAULT 30;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'location') THEN
            ALTER TABLE appointments ADD COLUMN location TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'telehealth_link') THEN
            ALTER TABLE appointments ADD COLUMN telehealth_link TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'reason') THEN
            ALTER TABLE appointments ADD COLUMN reason TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'priority') THEN
            ALTER TABLE appointments ADD COLUMN priority TEXT DEFAULT 'medium';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'updated_at') THEN
            ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    ELSE
        CREATE TABLE appointments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            provider_id UUID REFERENCES auth.users(id),
            organization_id UUID REFERENCES organizations(id),
            appointment_type TEXT DEFAULT 'consultation',
            status TEXT DEFAULT 'scheduled',
            scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
            duration_minutes INTEGER DEFAULT 30,
            location TEXT,
            telehealth_link TEXT,
            reason TEXT,
            notes TEXT,
            priority TEXT DEFAULT 'medium',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create health_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id),
    appointment_id UUID REFERENCES appointments(id),
    record_type TEXT NOT NULL DEFAULT 'consultation',
    title TEXT NOT NULL,
    description TEXT,
    findings JSONB,
    diagnoses TEXT[],
    treatments TEXT[],
    recommendations TEXT[],
    is_critical BOOLEAN DEFAULT FALSE,
    shared_with_patient BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vital_signs table if it doesn't exist
CREATE TABLE IF NOT EXISTS vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES auth.users(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature NUMERIC(4,1),
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    oxygen_saturation INTEGER,
    blood_glucose NUMERIC(5,1),
    bmi NUMERIC(4,1),
    notes TEXT,
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_insights table if it doesn't exist
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    generated_by TEXT DEFAULT 'medicare_ai',
    insight_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    supporting_data JSONB,
    impact_level TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'sent',
    appointment_id UUID REFERENCES appointments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    action_url TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id),
    metric_type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT,
    calculation_date DATE DEFAULT CURRENT_DATE,
    calculation_method TEXT,
    trend_direction TEXT,
    target_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create provider_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS provider_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    metric_date DATE DEFAULT CURRENT_DATE,
    total_patients INTEGER DEFAULT 0,
    new_patients INTEGER DEFAULT 0,
    appointments_scheduled INTEGER DEFAULT 0,
    appointments_completed INTEGER DEFAULT 0,
    appointments_cancelled INTEGER DEFAULT 0,
    revenue NUMERIC(12,2) DEFAULT 0,
    patient_satisfaction_score NUMERIC(3,2),
    medication_adherence_rate NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_profiles_patient_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_patient_medications_patient_id ON patient_medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_medications_status ON patient_medications(status);
CREATE INDEX IF NOT EXISTS idx_medication_logs_patient_id ON medication_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_scheduled_time ON medication_logs(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_health_records_patient_id ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_recorded_at ON vital_signs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);

-- Enable Row Level Security on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_provider_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_analytics ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own medications" ON patient_medications;
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;

-- Basic RLS Policies
CREATE POLICY "Users can view own data" ON user_profiles
FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own medications" ON patient_medications
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Users can view own appointments" ON appointments
FOR ALL USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Users can view own health records" ON health_records
FOR SELECT USING (auth.uid() = patient_id AND shared_with_patient = true);

CREATE POLICY "Users can view own vital signs" ON vital_signs
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Users can view own AI insights" ON ai_insights
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Users can view own messages" ON messages
FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can view own notifications" ON notifications
FOR ALL USING (auth.uid() = user_id);

-- Allow public access to medications
CREATE POLICY "Public can view medications" ON medications
FOR SELECT USING (true);

-- Allow providers to access their organization data
CREATE POLICY "Providers can view organization data" ON provider_analytics
FOR ALL USING (auth.uid() = provider_id);

-- Functions for business logic
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns (only if they don't exist)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_provider_profiles_updated_at ON provider_profiles;
CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate medication adherence
CREATE OR REPLACE FUNCTION calculate_medication_adherence(patient_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS NUMERIC AS $$
DECLARE
    total_scheduled INTEGER;
    total_taken INTEGER;
    adherence_rate NUMERIC;
BEGIN
    SELECT 
        COUNT(*) INTO total_scheduled
    FROM medication_logs ml
    WHERE ml.patient_id = patient_uuid
    AND ml.scheduled_time >= NOW() - INTERVAL '1 day' * days_back;
    
    SELECT 
        COUNT(*) INTO total_taken
    FROM medication_logs ml
    WHERE ml.patient_id = patient_uuid
    AND ml.status = 'taken'
    AND ml.scheduled_time >= NOW() - INTERVAL '1 day' * days_back;
    
    IF total_scheduled > 0 THEN
        adherence_rate := (total_taken::NUMERIC / total_scheduled::NUMERIC) * 100;
    ELSE
        adherence_rate := 100; -- Default to 100% if no scheduled medications
    END IF;
    
    RETURN ROUND(adherence_rate, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate health score
CREATE OR REPLACE FUNCTION calculate_health_score(patient_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    adherence_score NUMERIC;
    appointment_score NUMERIC;
    vital_score NUMERIC;
    final_score NUMERIC;
BEGIN
    -- Medication adherence score (40% weight)
    adherence_score := calculate_medication_adherence(patient_uuid, 30) * 0.4;
    
    -- Appointment attendance score (30% weight)
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 30
            ELSE (COUNT(*) FILTER (WHERE status IN ('completed'))::NUMERIC / COUNT(*)::NUMERIC) * 30
        END INTO appointment_score
    FROM appointments
    WHERE patient_id = patient_uuid
    AND scheduled_date >= NOW() - INTERVAL '90 days';
    
    -- Vital signs regularity score (30% weight)
    SELECT 
        CASE 
            WHEN COUNT(*) >= 4 THEN 30
            WHEN COUNT(*) >= 2 THEN 20
            WHEN COUNT(*) >= 1 THEN 10
            ELSE 0
        END INTO vital_score
    FROM vital_signs
    WHERE patient_id = patient_uuid
    AND recorded_at >= NOW() - INTERVAL '30 days';
    
    final_score := adherence_score + appointment_score + vital_score;
    
    -- Ensure score is between 0 and 10
    final_score := GREATEST(0, LEAST(10, final_score / 10));
    
    RETURN ROUND(final_score, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data (only if tables are empty)
INSERT INTO organizations (name, type, address, contact_info, specialties) 
SELECT 'Medicare+ General Hospital', 'hospital', 
 '{"street": "123 Healthcare Ave", "city": "Medical City", "state": "CA", "zip": "90210"}'::jsonb,
 '{"phone": "+1-555-0123", "email": "info@medicareplus.com", "website": "https://medicareplus.com"}'::jsonb,
 ARRAY['Cardiology', 'Internal Medicine', 'Emergency Medicine']
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Medicare+ General Hospital');

INSERT INTO organizations (name, type, address, contact_info, specialties)
SELECT 'Wellness Clinic', 'clinic',
 '{"street": "456 Wellness Blvd", "city": "Health Town", "state": "CA", "zip": "90211"}'::jsonb,
 '{"phone": "+1-555-0124", "email": "contact@wellnessclinic.com"}'::jsonb,
 ARRAY['Family Medicine', 'Pediatrics']
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Wellness Clinic');

INSERT INTO organizations (name, type, address, contact_info, specialties)
SELECT 'MediCare Pharmacy', 'pharmacy',
 '{"street": "789 Pharmacy St", "city": "Medical City", "state": "CA", "zip": "90212"}'::jsonb,
 '{"phone": "+1-555-0125", "email": "prescriptions@medicare-pharmacy.com"}'::jsonb,
 ARRAY['Prescription Fulfillment', 'Medication Counseling']
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'MediCare Pharmacy');

-- Insert sample medications
INSERT INTO medications (name, generic_name, drug_class, dosage_forms, strength_options, description, side_effects, contraindications)
SELECT 'Lisinopril', 'lisinopril', 'ACE Inhibitor', ARRAY['tablet'], ARRAY['5mg', '10mg', '20mg'], 
 'Used to treat high blood pressure and heart failure',
 ARRAY['Dry cough', 'Dizziness', 'Headache'], 
 ARRAY['Pregnancy', 'Angioedema history']
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Lisinopril');

INSERT INTO medications (name, generic_name, drug_class, dosage_forms, strength_options, description, side_effects, contraindications)
SELECT 'Metformin', 'metformin', 'Biguanide', ARRAY['tablet', 'extended-release tablet'], ARRAY['500mg', '850mg', '1000mg'],
 'Used to treat type 2 diabetes',
 ARRAY['Nausea', 'Diarrhea', 'Metallic taste'],
 ARRAY['Kidney disease', 'Liver disease']
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Metformin');

INSERT INTO medications (name, generic_name, drug_class, dosage_forms, strength_options, description, side_effects, contraindications)
SELECT 'Atorvastatin', 'atorvastatin', 'Statin', ARRAY['tablet'], ARRAY['10mg', '20mg', '40mg', '80mg'],
 'Used to lower cholesterol and reduce risk of heart disease',
 ARRAY['Muscle pain', 'Liver problems', 'Memory issues'],
 ARRAY['Active liver disease', 'Pregnancy']
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Atorvastatin');

INSERT INTO medications (name, generic_name, drug_class, dosage_forms, strength_options, description, side_effects, contraindications)
SELECT 'Aspirin', 'aspirin', 'NSAID', ARRAY['tablet', 'chewable tablet'], ARRAY['81mg', '325mg'],
 'Used for pain relief and cardiovascular protection',
 ARRAY['Stomach upset', 'Bleeding risk', 'Tinnitus'],
 ARRAY['Bleeding disorders', 'Severe asthma']
WHERE NOT EXISTS (SELECT 1 FROM medications WHERE name = 'Aspirin');

-- Success message
SELECT 'Medicare+ dual dashboard schema update completed successfully!' AS result; 