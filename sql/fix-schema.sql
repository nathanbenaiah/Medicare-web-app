-- Fix for existing user_profiles table
-- This script safely adds the missing tables without conflicts

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to user_profiles if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS height_cm NUMERIC,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
ADD COLUMN IF NOT EXISTS blood_type TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS emergency_contact JSONB,
ADD COLUMN IF NOT EXISTS insurance_info JSONB,
ADD COLUMN IF NOT EXISTS medical_history JSONB,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'clinic',
    address JSONB NOT NULL,
    contact_info JSONB NOT NULL,
    specialties TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to medications table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medications') THEN
        ALTER TABLE medications 
        ADD COLUMN IF NOT EXISTS brand_names TEXT[],
        ADD COLUMN IF NOT EXISTS dosage_forms TEXT[],
        ADD COLUMN IF NOT EXISTS strength_options TEXT[],
        ADD COLUMN IF NOT EXISTS side_effects TEXT[],
        ADD COLUMN IF NOT EXISTS contraindications TEXT[],
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        CREATE TABLE medications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            generic_name TEXT,
            brand_names TEXT[],
            drug_class TEXT,
            dosage_forms TEXT[],
            strength_options TEXT[],
            description TEXT,
            side_effects TEXT[],
            contraindications TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Add missing columns to patient_medications table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_medications') THEN
        ALTER TABLE patient_medications 
        ADD COLUMN IF NOT EXISTS prescribed_by UUID REFERENCES auth.users(id),
        ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id),
        ADD COLUMN IF NOT EXISTS route TEXT DEFAULT 'oral',
        ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS end_date DATE,
        ADD COLUMN IF NOT EXISTS refills_remaining INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS instructions TEXT,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
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

-- Create medication_logs table
CREATE TABLE IF NOT EXISTS medication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_medication_id UUID REFERENCES patient_medications(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'scheduled',
    method TEXT DEFAULT 'manual',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to appointments table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        ALTER TABLE appointments 
        ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id),
        ADD COLUMN IF NOT EXISTS appointment_type TEXT DEFAULT 'consultation',
        ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
        ADD COLUMN IF NOT EXISTS location TEXT,
        ADD COLUMN IF NOT EXISTS telehealth_link TEXT,
        ADD COLUMN IF NOT EXISTS reason TEXT,
        ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
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

-- Create remaining tables
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    confidence_score NUMERIC(3,2) DEFAULT 0.8,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    calculation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_medications_patient_id ON patient_medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_patient_id ON medication_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_id ON vital_signs(patient_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users own data" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own medications" ON patient_medications FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Users own med logs" ON medication_logs FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Users own appointments" ON appointments FOR ALL USING (auth.uid() = patient_id OR auth.uid() = provider_id);
CREATE POLICY "Users own vitals" ON vital_signs FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Users own insights" ON ai_insights FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Users own messages" ON messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO organizations (name, type, address, contact_info, specialties) 
VALUES ('Medicare+ Hospital', 'hospital', 
 '{"street": "123 Health St", "city": "Medical City", "state": "CA", "zip": "90210"}'::jsonb,
 '{"phone": "+1-555-0123", "email": "info@medicareplus.com"}'::jsonb,
 ARRAY['Cardiology', 'Internal Medicine'])
ON CONFLICT DO NOTHING;

INSERT INTO medications (name, generic_name, drug_class, description)
VALUES 
('Lisinopril', 'lisinopril', 'ACE Inhibitor', 'Blood pressure medication'),
('Metformin', 'metformin', 'Biguanide', 'Diabetes medication'),
('Atorvastatin', 'atorvastatin', 'Statin', 'Cholesterol medication')
ON CONFLICT DO NOTHING;

-- Success
SELECT 'Schema fixed successfully! All tables are ready for the dual dashboard.' AS message; 