-- Healthcare Providers Table Setup for MediCare+ Platform
-- Run this SQL in your Supabase SQL Editor

-- Create healthcare providers table
CREATE TABLE IF NOT EXISTS healthcare_providers (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    specialty TEXT NOT NULL,
    experience TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    location TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected', 'suspended')),
    verification_date TIMESTAMPTZ,
    verification_notes TEXT,
    profile_image_url TEXT,
    bio TEXT,
    qualifications TEXT[],
    languages TEXT[] DEFAULT ARRAY['English'],
    consultation_fee DECIMAL(10,2),
    available_times JSONB,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    years_practicing INTEGER,
    website_url TEXT,
    social_media JSONB,
    emergency_contact TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    province TEXT,
    country TEXT DEFAULT 'Sri Lanka',
    timezone TEXT DEFAULT 'Asia/Colombo',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    license_verified BOOLEAN DEFAULT false,
    background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'completed', 'failed')),
    onboarding_completed BOOLEAN DEFAULT false,
    subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')),
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    trial_end_date TIMESTAMPTZ,
    features_enabled JSONB DEFAULT '{"ai_tools": true, "analytics": false, "premium_support": false}',
    preferences JSONB DEFAULT '{"notifications": {"email": true, "sms": false, "push": true}, "privacy": {"profile_public": true, "contact_info_public": false}}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_email ON healthcare_providers(email);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_specialty ON healthcare_providers(specialty);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_location ON healthcare_providers(location);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_status ON healthcare_providers(status);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_rating ON healthcare_providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_active ON healthcare_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_verified ON healthcare_providers(email_verified, license_verified);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_city ON healthcare_providers(city);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_province ON healthcare_providers(province);

-- Create full-text search index for provider search
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_search ON healthcare_providers 
USING gin(to_tsvector('english', full_name || ' ' || specialty || ' ' || COALESCE(bio, '') || ' ' || clinic_name));

-- Enable Row Level Security
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;

-- Create policies for healthcare providers
-- Allow anonymous users to insert (for signup)
CREATE POLICY IF NOT EXISTS "Allow anonymous insert on healthcare_providers" 
ON healthcare_providers FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to select verified and active providers (for public directory)
CREATE POLICY IF NOT EXISTS "Allow anonymous select verified providers" 
ON healthcare_providers FOR SELECT 
TO anon 
USING (status = 'verified' AND is_active = true AND email_verified = true);

-- Allow authenticated users to view all providers
CREATE POLICY IF NOT EXISTS "Allow authenticated select on healthcare_providers" 
ON healthcare_providers FOR SELECT 
TO authenticated 
USING (true);

-- Allow providers to update their own records
CREATE POLICY IF NOT EXISTS "Allow providers to update own record" 
ON healthcare_providers FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = id::text OR auth.email() = email);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_healthcare_providers_updated_at ON healthcare_providers;
CREATE TRIGGER update_healthcare_providers_updated_at 
BEFORE UPDATE ON healthcare_providers 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create provider specialties lookup table
CREATE TABLE IF NOT EXISTS provider_specialties (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common medical specialties
INSERT INTO provider_specialties (name, description, category) VALUES
('General Medicine', 'Primary care and general health services', 'Primary Care'),
('Cardiology', 'Heart and cardiovascular system specialists', 'Specialty Care'),
('Dermatology', 'Skin, hair, and nail conditions', 'Specialty Care'),
('Orthopedics', 'Bone, joint, and muscle disorders', 'Specialty Care'),
('Pediatrics', 'Medical care for infants, children, and adolescents', 'Primary Care'),
('Gynecology', 'Women''s reproductive health', 'Specialty Care'),
('Neurology', 'Nervous system disorders', 'Specialty Care'),
('Psychiatry', 'Mental health and behavioral disorders', 'Mental Health'),
('Oncology', 'Cancer diagnosis and treatment', 'Specialty Care'),
('Ophthalmology', 'Eye and vision care', 'Specialty Care'),
('ENT', 'Ear, nose, and throat conditions', 'Specialty Care'),
('Endocrinology', 'Hormone and gland disorders', 'Specialty Care'),
('Gastroenterology', 'Digestive system disorders', 'Specialty Care'),
('Pulmonology', 'Lung and respiratory conditions', 'Specialty Care'),
('Nephrology', 'Kidney disorders', 'Specialty Care'),
('Rheumatology', 'Autoimmune and joint diseases', 'Specialty Care'),
('Anesthesiology', 'Pain management and anesthesia', 'Specialty Care'),
('Emergency Medicine', 'Emergency and urgent care', 'Emergency Care'),
('Family Medicine', 'Comprehensive family health care', 'Primary Care'),
('Internal Medicine', 'Adult internal organ diseases', 'Primary Care')
ON CONFLICT (name) DO NOTHING;

-- Create provider reviews table
CREATE TABLE IF NOT EXISTS provider_reviews (
    id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT REFERENCES healthcare_providers(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    patient_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    appointment_date DATE,
    is_verified BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_provider_reviews_provider_id ON provider_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_reviews_rating ON provider_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_provider_reviews_status ON provider_reviews(status);

-- Enable RLS for reviews
ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved reviews
CREATE POLICY IF NOT EXISTS "Allow read approved reviews" 
ON provider_reviews FOR SELECT 
TO anon 
USING (status = 'approved');

-- Allow authenticated users to insert reviews
CREATE POLICY IF NOT EXISTS "Allow authenticated insert reviews" 
ON provider_reviews FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create function to update provider rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Calculate new average rating and count for the provider
    SELECT 
        ROUND(AVG(rating), 2),
        COUNT(*)
    INTO avg_rating, review_count
    FROM provider_reviews 
    WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id) 
    AND status = 'approved';
    
    -- Update provider record
    UPDATE healthcare_providers 
    SET 
        rating = COALESCE(avg_rating, 0.00),
        total_reviews = review_count,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for rating updates
DROP TRIGGER IF EXISTS update_provider_rating_on_review_insert ON provider_reviews;
CREATE TRIGGER update_provider_rating_on_review_insert
AFTER INSERT ON provider_reviews
FOR EACH ROW EXECUTE PROCEDURE update_provider_rating();

DROP TRIGGER IF EXISTS update_provider_rating_on_review_update ON provider_reviews;
CREATE TRIGGER update_provider_rating_on_review_update
AFTER UPDATE ON provider_reviews
FOR EACH ROW EXECUTE PROCEDURE update_provider_rating();

DROP TRIGGER IF EXISTS update_provider_rating_on_review_delete ON provider_reviews;
CREATE TRIGGER update_provider_rating_on_review_delete
AFTER DELETE ON provider_reviews
FOR EACH ROW EXECUTE PROCEDURE update_provider_rating();

-- Create provider availability table
CREATE TABLE IF NOT EXISTS provider_availability (
    id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT REFERENCES healthcare_providers(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_appointments INTEGER DEFAULT 10,
    appointment_duration INTEGER DEFAULT 30, -- minutes
    break_start_time TIME,
    break_end_time TIME,
    special_date DATE, -- For special schedules or holidays
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for availability
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider_id ON provider_availability(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_day ON provider_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_provider_availability_date ON provider_availability(special_date);

-- Enable RLS for availability
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;

-- Allow reading availability for verified providers
CREATE POLICY IF NOT EXISTS "Allow read provider availability" 
ON provider_availability FOR SELECT 
TO anon 
USING (provider_id IN (
    SELECT id FROM healthcare_providers 
    WHERE status = 'verified' AND is_active = true
));

-- Allow providers to manage their own availability
CREATE POLICY IF NOT EXISTS "Allow providers manage own availability" 
ON provider_availability FOR ALL 
TO authenticated 
USING (provider_id IN (
    SELECT id FROM healthcare_providers 
    WHERE auth.email() = email
));

-- Create audit log table for provider actions
CREATE TABLE IF NOT EXISTS provider_audit_log (
    id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT REFERENCES healthcare_providers(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for audit log
CREATE INDEX IF NOT EXISTS idx_provider_audit_log_provider_id ON provider_audit_log(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_audit_log_created_at ON provider_audit_log(created_at DESC);

-- Enable RLS for audit log
ALTER TABLE provider_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to read their own audit logs
CREATE POLICY IF NOT EXISTS "Allow providers read own audit log" 
ON provider_audit_log FOR SELECT 
TO authenticated 
USING (provider_id IN (
    SELECT id FROM healthcare_providers 
    WHERE auth.email() = email
));

-- Create function to log provider actions
CREATE OR REPLACE FUNCTION log_provider_action(
    p_provider_id BIGINT,
    p_action TEXT,
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO provider_audit_log (provider_id, action, details, ip_address, user_agent)
    VALUES (p_provider_id, p_action, p_details, p_ip_address, p_user_agent);
END;
$$ LANGUAGE 'plpgsql';

-- Create view for public provider directory
CREATE OR REPLACE VIEW public_provider_directory AS
SELECT 
    id,
    full_name,
    specialty,
    clinic_name,
    city,
    province,
    rating,
    total_reviews,
    years_practicing,
    languages,
    consultation_fee,
    profile_image_url,
    bio,
    website_url,
    CASE 
        WHEN preferences->>'privacy'->>'contact_info_public' = 'true' 
        THEN phone 
        ELSE NULL 
    END as public_phone,
    CASE 
        WHEN preferences->>'privacy'->>'contact_info_public' = 'true' 
        THEN email 
        ELSE NULL 
    END as public_email
FROM healthcare_providers 
WHERE status = 'verified' 
  AND is_active = true 
  AND email_verified = true
  AND license_verified = true;

-- Grant access to the view
GRANT SELECT ON public_provider_directory TO anon, authenticated;

-- Create materialized view for provider search (for better performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS provider_search_index AS
SELECT 
    id,
    full_name,
    specialty,
    clinic_name,
    city,
    province,
    rating,
    total_reviews,
    to_tsvector('english', 
        full_name || ' ' || 
        specialty || ' ' || 
        clinic_name || ' ' || 
        COALESCE(bio, '') || ' ' ||
        city || ' ' ||
        province
    ) as search_vector
FROM healthcare_providers 
WHERE status = 'verified' 
  AND is_active = true 
  AND email_verified = true;

-- Create index on the search vector
CREATE INDEX IF NOT EXISTS idx_provider_search_vector 
ON provider_search_index USING gin(search_vector);

-- Create function to refresh the search index
CREATE OR REPLACE FUNCTION refresh_provider_search_index()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY provider_search_index;
END;
$$ LANGUAGE 'plpgsql';

-- Grant access to the materialized view
GRANT SELECT ON provider_search_index TO anon, authenticated;

-- Create sample data for testing (optional - remove in production)
-- INSERT INTO healthcare_providers (full_name, email, phone, specialty, experience, clinic_name, location, license_number, status, email_verified, license_verified) VALUES
-- ('Dr. Priya Perera', 'priya.perera@example.com', '+94771234567', 'Cardiology', '10-15', 'Colombo Heart Center', 'Colombo', 'LIC001', 'verified', true, true),
-- ('Dr. Rohan Silva', 'rohan.silva@example.com', '+94772345678', 'Pediatrics', '5-8', 'Children''s Care Clinic', 'Kandy', 'LIC002', 'verified', true, true),
-- ('Dr. Anjali Fernando', 'anjali.fernando@example.com', '+94773456789', 'Dermatology', '8-12', 'Skin & Beauty Clinic', 'Galle', 'LIC003', 'verified', true, true);

-- Final setup message
DO $$
BEGIN
    RAISE NOTICE 'Healthcare Providers database setup completed successfully!';
    RAISE NOTICE 'Tables created: healthcare_providers, provider_specialties, provider_reviews, provider_availability, provider_audit_log';
    RAISE NOTICE 'Views created: public_provider_directory, provider_search_index';
    RAISE NOTICE 'RLS policies and triggers have been set up.';
    RAISE NOTICE 'You can now start registering healthcare providers through the signup form.';
END $$; 