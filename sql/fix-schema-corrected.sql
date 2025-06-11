-- Corrected Schema Fix for Supabase
-- This handles the proper user ID references

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, let's check what columns exist in user_profiles
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

-- Handle medications table
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

-- Handle patient_medications table with proper user ID reference
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_medications') THEN
        -- Check if patient_id column exists, if not add it
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'patient_id') THEN
            ALTER TABLE patient_medications ADD COLUMN patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
        
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

-- Handle appointments table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        -- Check if patient_id column exists, if not add it
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'patient_id') THEN
            ALTER TABLE appointments ADD COLUMN patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
        
        -- Check if provider_id column exists, if not add it
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'provider_id') THEN
            ALTER TABLE appointments ADD COLUMN provider_id UUID REFERENCES auth.users(id);
        END IF;
        
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

-- Create vital_signs table
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

-- Create ai_insights table
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

-- Create messages table
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

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    calculation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes (only if tables exist and have the columns)
DO $$
BEGIN
    -- Check if patient_medications table and patient_id column exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_medications') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'patient_id') THEN
        CREATE INDEX IF NOT EXISTS idx_patient_medications_patient_id ON patient_medications(patient_id);
    END IF;
    
    -- Same for other indexes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medication_logs') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medication_logs' AND column_name = 'patient_id') THEN
        CREATE INDEX IF NOT EXISTS idx_medication_logs_patient_id ON medication_logs(patient_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'patient_id') THEN
        CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'provider_id') THEN
        CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vital_signs') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vital_signs' AND column_name = 'patient_id') THEN
        CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_id ON vital_signs(patient_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_medications') THEN
        ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medication_logs') THEN
        ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users own data" ON user_profiles;
DROP POLICY IF EXISTS "Users own medications" ON patient_medications;
DROP POLICY IF EXISTS "Users own med logs" ON medication_logs;
DROP POLICY IF EXISTS "Users own appointments" ON appointments;
DROP POLICY IF EXISTS "Users own vitals" ON vital_signs;
DROP POLICY IF EXISTS "Users own insights" ON ai_insights;
DROP POLICY IF EXISTS "Users own messages" ON messages;
DROP POLICY IF EXISTS "Users own notifications" ON notifications;

-- Create RLS Policies (only if tables exist with required columns)
CREATE POLICY "Users own data" ON user_profiles FOR ALL USING (auth.uid() = id);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_medications') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_medications' AND column_name = 'patient_id') THEN
        EXECUTE 'CREATE POLICY "Users own medications" ON patient_medications FOR ALL USING (auth.uid() = patient_id)';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medication_logs') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medication_logs' AND column_name = 'patient_id') THEN
        EXECUTE 'CREATE POLICY "Users own med logs" ON medication_logs FOR ALL USING (auth.uid() = patient_id)';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'patient_id')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'provider_id') THEN
        EXECUTE 'CREATE POLICY "Users own appointments" ON appointments FOR ALL USING (auth.uid() = patient_id OR auth.uid() = provider_id)';
    END IF;
END $$;

CREATE POLICY "Users own vitals" ON vital_signs FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Users own insights" ON ai_insights FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Users own messages" ON messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Insert sample data with error handling
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

SELECT 'Schema corrected successfully! All column references are now properly handled.' AS message; 