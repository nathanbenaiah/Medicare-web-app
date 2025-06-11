-- Quick fix for column reference issues
-- This handles the patient_id column problem step by step

-- Enable extensions first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Add basic columns to user_profiles safely
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS height_cm NUMERIC,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
ADD COLUMN IF NOT EXISTS blood_type TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT DEFAULT 'clinic',
    address JSONB,
    contact_info JSONB,
    specialties TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create medications table if it doesn't exist
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    generic_name TEXT,
    drug_class TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create patient_medications table with proper structure
CREATE TABLE IF NOT EXISTS patient_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id),
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create appointments table with proper structure
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'scheduled',
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create vital_signs table
CREATE TABLE IF NOT EXISTS vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    weight NUMERIC(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create ai_insights table
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Enable RLS
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 11: Create simple policies using user_id instead of patient_id
CREATE POLICY "Users can access own medications" ON patient_medications
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own appointments" ON appointments
FOR ALL USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can access own vitals" ON vital_signs
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own insights" ON ai_insights
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own messages" ON messages
FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can access own notifications" ON notifications
FOR ALL USING (auth.uid() = user_id);

-- Step 12: Insert sample data
INSERT INTO organizations (name, type, address, contact_info, specialties) 
VALUES (
    'Medicare+ Clinic', 
    'clinic',
    '{"street": "123 Health St", "city": "Medical City", "state": "CA"}'::jsonb,
    '{"phone": "555-0123", "email": "info@medicareplus.com"}'::jsonb,
    ARRAY['General Medicine']
) ON CONFLICT DO NOTHING;

INSERT INTO medications (name, generic_name, drug_class, description)
VALUES 
('Aspirin', 'aspirin', 'NSAID', 'Pain relief and heart protection'),
('Lisinopril', 'lisinopril', 'ACE Inhibitor', 'Blood pressure medication'),
('Metformin', 'metformin', 'Biguanide', 'Diabetes medication')
ON CONFLICT DO NOTHING;

SELECT 'Quick schema fix completed! Tables created with user_id instead of patient_id.' AS result; 