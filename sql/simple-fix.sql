-- Simple fix that avoids constraint issues
-- This creates the essential tables without touching existing problematic ones

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Enhance user_profiles safely
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

-- Step 3: Don't modify medications table - use it as is
-- We'll work with whatever structure exists

-- Step 4: Create patient_medications table
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

-- Step 5: Create appointments table
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

-- Step 10: Enable RLS on new tables
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 11: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can access own medications" ON patient_medications;
DROP POLICY IF EXISTS "Users can access own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can access own vitals" ON vital_signs;
DROP POLICY IF EXISTS "Users can access own insights" ON ai_insights;
DROP POLICY IF EXISTS "Users can access own messages" ON messages;
DROP POLICY IF EXISTS "Users can access own notifications" ON notifications;

-- Step 12: Create RLS policies
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

-- Step 13: Insert sample data (avoid medications table)
INSERT INTO organizations (name, type, address, contact_info, specialties) 
VALUES (
    'Medicare+ Clinic', 
    'clinic',
    '{"street": "123 Health St", "city": "Medical City", "state": "CA"}'::jsonb,
    '{"phone": "555-0123", "email": "info@medicareplus.com"}'::jsonb,
    ARRAY['General Medicine']
) ON CONFLICT DO NOTHING;

-- Don't insert into medications table - it has complex constraints
-- The dashboards will work with whatever medications already exist

SELECT 'Simple schema fix completed! All essential tables created without constraint conflicts.' AS result; 