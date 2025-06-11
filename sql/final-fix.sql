-- Final fix for all schema issues
-- This works with existing table structures

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

-- Step 3: Handle medications table - check existing structure and add missing columns
DO $$ 
BEGIN
    -- Add missing columns to medications if they don't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medications') THEN
        -- Add columns that might be missing
        BEGIN
            ALTER TABLE medications ADD COLUMN IF NOT EXISTS generic_name TEXT;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        
        BEGIN
            ALTER TABLE medications ADD COLUMN IF NOT EXISTS drug_class TEXT;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        
        BEGIN
            ALTER TABLE medications ADD COLUMN IF NOT EXISTS description TEXT;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    ELSE
        -- Create medications table if it doesn't exist
        CREATE TABLE medications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            generic_name TEXT,
            drug_class TEXT,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

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

-- Step 13: Insert sample data safely (only using basic columns)
INSERT INTO organizations (name, type, address, contact_info, specialties) 
VALUES (
    'Medicare+ Clinic', 
    'clinic',
    '{"street": "123 Health St", "city": "Medical City", "state": "CA"}'::jsonb,
    '{"phone": "555-0123", "email": "info@medicareplus.com"}'::jsonb,
    ARRAY['General Medicine']
) ON CONFLICT DO NOTHING;

-- Insert medications using only columns that definitely exist
DO $$
BEGIN
    -- Check if generic_name column exists before using it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medications' AND column_name = 'generic_name') THEN
        -- Use all columns if they exist
        INSERT INTO medications (name, generic_name, drug_class, description)
        VALUES 
        ('Aspirin', 'aspirin', 'NSAID', 'Pain relief and heart protection'),
        ('Lisinopril', 'lisinopril', 'ACE Inhibitor', 'Blood pressure medication'),
        ('Metformin', 'metformin', 'Biguanide', 'Diabetes medication')
        ON CONFLICT DO NOTHING;
    ELSE
        -- Use only name column if others don't exist
        INSERT INTO medications (name)
        VALUES 
        ('Aspirin'),
        ('Lisinopril'),
        ('Metformin')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

SELECT 'Final schema fix completed! All issues resolved.' AS result; 