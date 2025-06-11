-- Enhanced Medicare+ Dual Dashboard Database Schema
-- This schema supports both patient and provider dashboards with real-time synchronization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types and enums
CREATE TYPE user_role_enum AS ENUM ('patient', 'provider', 'nurse', 'pharmacist', 'admin', 'super_admin');
CREATE TYPE account_status_enum AS ENUM ('active', 'suspended', 'pending', 'inactive');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE org_type_enum AS ENUM ('hospital', 'clinic', 'pharmacy', 'lab', 'insurance');
CREATE TYPE org_status_enum AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE provider_role_enum AS ENUM ('doctor', 'nurse', 'pharmacist', 'admin', 'staff', 'specialist');
CREATE TYPE relationship_type_enum AS ENUM ('primary_care', 'specialist', 'consulting', 'emergency');
CREATE TYPE relationship_status_enum AS ENUM ('active', 'inactive', 'pending', 'terminated');
CREATE TYPE medication_route_enum AS ENUM ('oral', 'injection', 'topical', 'inhaled', 'sublingual', 'rectal');
CREATE TYPE medication_status_enum AS ENUM ('active', 'discontinued', 'completed', 'on_hold', 'cancelled');
CREATE TYPE adherence_status_enum AS ENUM ('taken', 'missed', 'delayed', 'partial', 'skipped');
CREATE TYPE log_method_enum AS ENUM ('manual', 'reminder', 'provider_confirmed', 'auto_detected');
CREATE TYPE appointment_type_enum AS ENUM ('consultation', 'follow_up', 'procedure', 'screening', 'telehealth', 'emergency');
CREATE TYPE appointment_status_enum AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled');
CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high', 'urgent', 'critical');
CREATE TYPE record_type_enum AS ENUM ('consultation', 'diagnosis', 'treatment', 'lab_result', 'imaging', 'procedure');
CREATE TYPE vital_source_enum AS ENUM ('manual', 'device', 'provider_exam', 'lab_result');
CREATE TYPE insight_type_enum AS ENUM ('medication_optimization', 'risk_assessment', 'lifestyle_recommendation', 'care_gap', 'preventive_care');
CREATE TYPE insight_status_enum AS ENUM ('new', 'reviewed', 'accepted', 'dismissed', 'implemented');
CREATE TYPE message_type_enum AS ENUM ('text', 'voice', 'image', 'document', 'video');
CREATE TYPE message_status_enum AS ENUM ('sent', 'delivered', 'read', 'archived', 'deleted');
CREATE TYPE notification_type_enum AS ENUM ('medication_reminder', 'appointment_reminder', 'message', 'alert', 'system', 'billing');
CREATE TYPE notification_status_enum AS ENUM ('pending', 'sent', 'read', 'dismissed', 'failed');
CREATE TYPE delivery_method_enum AS ENUM ('in_app', 'email', 'sms', 'push', 'phone_call');
CREATE TYPE metric_type_enum AS ENUM ('adherence_rate', 'health_score', 'risk_score', 'quality_score', 'satisfaction_score');
CREATE TYPE trend_enum AS ENUM ('improving', 'stable', 'declining', 'critical');
CREATE TYPE care_plan_status_enum AS ENUM ('active', 'completed', 'suspended', 'cancelled', 'on_hold');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');
CREATE TYPE insurance_status_enum AS ENUM ('active', 'inactive', 'pending', 'expired');

-- Enhanced Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    status account_status_enum DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

-- Detailed User Profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender gender_enum,
    phone TEXT,
    address JSONB,
    emergency_contact JSONB,
    insurance_info JSONB,
    medical_history JSONB,
    allergies TEXT[],
    preferred_language TEXT DEFAULT 'en',
    profile_image_url TEXT,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    blood_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Healthcare Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type org_type_enum NOT NULL,
    license_number TEXT,
    address JSONB NOT NULL,
    contact_info JSONB NOT NULL,
    certifications JSONB,
    specialties TEXT[],
    operating_hours JSONB,
    website TEXT,
    description TEXT,
    status org_status_enum DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider Profiles
CREATE TABLE provider_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    license_number TEXT,
    specialties TEXT[],
    qualifications JSONB,
    department TEXT,
    role provider_role_enum DEFAULT 'doctor',
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

-- Patient-Provider Relationships
CREATE TABLE patient_provider_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    relationship_type relationship_type_enum DEFAULT 'primary_care',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status relationship_status_enum DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id, provider_id, relationship_type)
);

-- Enhanced Medications
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    generic_name TEXT,
    brand_names TEXT[],
    drug_class TEXT,
    dosage_forms TEXT[],
    strength_options TEXT[],
    manufacturer TEXT,
    ndc_code TEXT,
    description TEXT,
    side_effects TEXT[],
    contraindications TEXT[],
    interactions TEXT[],
    pregnancy_category TEXT,
    controlled_substance BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Medications with Rich Data
CREATE TABLE patient_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id),
    prescribed_by UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    route medication_route_enum DEFAULT 'oral',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    quantity_prescribed INTEGER,
    refills_remaining INTEGER DEFAULT 0,
    total_refills INTEGER DEFAULT 0,
    pharmacy_id UUID REFERENCES organizations(id),
    prescription_number TEXT,
    status medication_status_enum DEFAULT 'active',
    instructions TEXT,
    notes TEXT,
    cost_per_dose NUMERIC(10,2),
    insurance_covered BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medication Adherence Tracking
CREATE TABLE medication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_medication_id UUID REFERENCES patient_medications(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_time TIMESTAMP WITH TIME ZONE,
    status adherence_status_enum NOT NULL,
    method log_method_enum DEFAULT 'manual',
    notes TEXT,
    side_effects_reported TEXT[],
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    appointment_type appointment_type_enum DEFAULT 'consultation',
    status appointment_status_enum DEFAULT 'scheduled',
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    location TEXT,
    room_number TEXT,
    telehealth_link TEXT,
    reason TEXT,
    notes TEXT,
    preparation_instructions TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    priority priority_enum DEFAULT 'medium',
    cost NUMERIC(10,2),
    insurance_claim_id TEXT,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    rescheduled_from UUID REFERENCES appointments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detailed Health Records
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    record_type record_type_enum NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    findings JSONB,
    diagnoses TEXT[],
    treatments TEXT[],
    recommendations TEXT[],
    attachments JSONB,
    is_critical BOOLEAN DEFAULT FALSE,
    is_chronic BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    shared_with_patient BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vital Signs Tracking
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature NUMERIC(4,1),
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    oxygen_saturation INTEGER,
    blood_glucose NUMERIC(5,1),
    respiratory_rate INTEGER,
    bmi NUMERIC(4,1),
    notes TEXT,
    source vital_source_enum DEFAULT 'manual',
    device_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Insights and Recommendations
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    generated_by TEXT DEFAULT 'medicare_ai',
    insight_type insight_type_enum NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    supporting_data JSONB,
    impact_level priority_enum DEFAULT 'medium',
    status insight_status_enum DEFAULT 'new',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    implemented_at TIMESTAMP WITH TIME ZONE,
    outcome_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Communication System
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    thread_id UUID,
    subject TEXT,
    content TEXT NOT NULL,
    message_type message_type_enum DEFAULT 'text',
    priority priority_enum DEFAULT 'medium',
    status message_status_enum DEFAULT 'sent',
    attachments JSONB,
    is_encrypted BOOLEAN DEFAULT TRUE,
    appointment_id UUID REFERENCES appointments(id),
    requires_response BOOLEAN DEFAULT FALSE,
    response_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Notification System
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    action_url TEXT,
    action_data JSONB,
    priority priority_enum DEFAULT 'medium',
    status notification_status_enum DEFAULT 'pending',
    delivery_method delivery_method_enum[] DEFAULT ARRAY['in_app'],
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and Metrics
CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id),
    metric_type metric_type_enum NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT,
    calculation_date DATE DEFAULT CURRENT_DATE,
    calculation_method TEXT,
    contributing_factors JSONB,
    trend_direction trend_enum,
    previous_value NUMERIC,
    target_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care Plans
CREATE TABLE care_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    assigned_providers UUID[],
    title TEXT NOT NULL,
    description TEXT,
    goals JSONB,
    interventions JSONB,
    timeline JSONB,
    status care_plan_status_enum DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_reviewed_date DATE,
    next_review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing and Payments
CREATE TABLE billing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    appointment_id UUID REFERENCES appointments(id),
    service_description TEXT NOT NULL,
    service_codes TEXT[],
    amount NUMERIC(10,2) NOT NULL,
    insurance_amount NUMERIC(10,2) DEFAULT 0,
    patient_amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status_enum DEFAULT 'pending',
    due_date DATE,
    paid_date DATE,
    payment_method TEXT,
    transaction_id TEXT,
    invoice_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Information
CREATE TABLE insurance_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    insurance_company TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    policy_number TEXT NOT NULL,
    group_number TEXT,
    member_id TEXT NOT NULL,
    status insurance_status_enum DEFAULT 'active',
    effective_date DATE,
    expiration_date DATE,
    copay_amount NUMERIC(10,2),
    deductible_amount NUMERIC(10,2),
    out_of_pocket_max NUMERIC(10,2),
    coverage_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab Results
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ordered_by UUID REFERENCES users(id),
    lab_organization_id UUID REFERENCES organizations(id),
    test_name TEXT NOT NULL,
    test_code TEXT,
    result_value TEXT,
    result_unit TEXT,
    reference_range TEXT,
    status TEXT DEFAULT 'completed',
    is_abnormal BOOLEAN DEFAULT FALSE,
    critical_flag BOOLEAN DEFAULT FALSE,
    notes TEXT,
    ordered_date DATE,
    collected_date DATE,
    resulted_date DATE,
    reviewed_date DATE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy Integration
CREATE TABLE prescription_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_medication_id UUID REFERENCES patient_medications(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES organizations(id),
    prescription_number TEXT,
    status TEXT DEFAULT 'sent',
    quantity_dispensed INTEGER,
    days_supply INTEGER,
    filled_date DATE,
    pickup_date DATE,
    cost NUMERIC(10,2),
    insurance_copay NUMERIC(10,2),
    pharmacist_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider Business Analytics
CREATE TABLE provider_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    metric_date DATE DEFAULT CURRENT_DATE,
    total_patients INTEGER DEFAULT 0,
    new_patients INTEGER DEFAULT 0,
    appointments_scheduled INTEGER DEFAULT 0,
    appointments_completed INTEGER DEFAULT 0,
    appointments_cancelled INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    revenue NUMERIC(12,2) DEFAULT 0,
    average_visit_duration INTEGER DEFAULT 0,
    patient_satisfaction_score NUMERIC(3,2),
    medication_adherence_rate NUMERIC(5,2),
    readmission_rate NUMERIC(5,2),
    quality_measures JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patient_medications_patient_id ON patient_medications(patient_id);
CREATE INDEX idx_patient_medications_status ON patient_medications(status);
CREATE INDEX idx_medication_logs_patient_id ON medication_logs(patient_id);
CREATE INDEX idx_medication_logs_scheduled_time ON medication_logs(scheduled_time);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_health_records_patient_id ON health_records(patient_id);
CREATE INDEX idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX idx_vital_signs_recorded_at ON vital_signs(recorded_at);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_provider_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Patients
CREATE POLICY "Patients can view own profile" ON user_profiles
FOR ALL USING (auth.uid() = id);

CREATE POLICY "Patients can view own medications" ON patient_medications
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can log own medications" ON medication_logs
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can view own appointments" ON appointments
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can view own health records" ON health_records
FOR SELECT USING (auth.uid() = patient_id AND shared_with_patient = true);

CREATE POLICY "Patients can view own vital signs" ON vital_signs
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can view own AI insights" ON ai_insights
FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can view own messages" ON messages
FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Patients can view own notifications" ON notifications
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Providers
CREATE POLICY "Providers can view assigned patient data" ON patient_medications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM patient_provider_relationships ppr
    WHERE ppr.patient_id = patient_medications.patient_id
    AND ppr.provider_id = auth.uid()
    AND ppr.status = 'active'
  )
);

CREATE POLICY "Providers can view assigned patient appointments" ON appointments
FOR ALL USING (
  auth.uid() = provider_id OR
  EXISTS (
    SELECT 1 FROM patient_provider_relationships ppr
    WHERE ppr.patient_id = appointments.patient_id
    AND ppr.provider_id = auth.uid()
    AND ppr.status = 'active'
  )
);

CREATE POLICY "Providers can manage health records" ON health_records
FOR ALL USING (
  auth.uid() = provider_id OR
  EXISTS (
    SELECT 1 FROM patient_provider_relationships ppr
    WHERE ppr.patient_id = health_records.patient_id
    AND ppr.provider_id = auth.uid()
    AND ppr.status = 'active'
  )
);

-- Organization-level access for providers
CREATE POLICY "Organization providers can view organization data" ON provider_analytics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM provider_profiles pp
    WHERE pp.id = auth.uid()
    AND pp.organization_id = provider_analytics.organization_id
  )
);

-- Public access to medications database
CREATE POLICY "Public can view medications" ON medications
FOR SELECT USING (true);

-- Functions for business logic
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_medications_updated_at BEFORE UPDATE ON patient_medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
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
        adherence_rate := 0;
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
            ELSE (COUNT(*) FILTER (WHERE status IN ('completed', 'in_progress'))::NUMERIC / COUNT(*)::NUMERIC) * 30
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

-- Insert sample data for testing
INSERT INTO organizations (name, type, address, contact_info, specialties) VALUES
('Medicare+ General Hospital', 'hospital', 
 '{"street": "123 Healthcare Ave", "city": "Medical City", "state": "CA", "zip": "90210"}',
 '{"phone": "+1-555-0123", "email": "info@medicareplus.com", "website": "https://medicareplus.com"}',
 ARRAY['Cardiology', 'Internal Medicine', 'Emergency Medicine']
),
('Wellness Clinic', 'clinic',
 '{"street": "456 Wellness Blvd", "city": "Health Town", "state": "CA", "zip": "90211"}',
 '{"phone": "+1-555-0124", "email": "contact@wellnessclinic.com"}',
 ARRAY['Family Medicine', 'Pediatrics']
),
('MediCare Pharmacy', 'pharmacy',
 '{"street": "789 Pharmacy St", "city": "Medical City", "state": "CA", "zip": "90212"}',
 '{"phone": "+1-555-0125", "email": "prescriptions@medicare-pharmacy.com"}',
 ARRAY['Prescription Fulfillment', 'Medication Counseling']
);

-- Insert sample medications
INSERT INTO medications (name, generic_name, drug_class, dosage_forms, strength_options, description, side_effects, contraindications) VALUES
('Lisinopril', 'lisinopril', 'ACE Inhibitor', ARRAY['tablet'], ARRAY['5mg', '10mg', '20mg'], 
 'Used to treat high blood pressure and heart failure',
 ARRAY['Dry cough', 'Dizziness', 'Headache'], 
 ARRAY['Pregnancy', 'Angioedema history']
),
('Metformin', 'metformin', 'Biguanide', ARRAY['tablet', 'extended-release tablet'], ARRAY['500mg', '850mg', '1000mg'],
 'Used to treat type 2 diabetes',
 ARRAY['Nausea', 'Diarrhea', 'Metallic taste'],
 ARRAY['Kidney disease', 'Liver disease']
),
('Atorvastatin', 'atorvastatin', 'Statin', ARRAY['tablet'], ARRAY['10mg', '20mg', '40mg', '80mg'],
 'Used to lower cholesterol and reduce risk of heart disease',
 ARRAY['Muscle pain', 'Liver problems', 'Memory issues'],
 ARRAY['Active liver disease', 'Pregnancy']
),
('Aspirin', 'aspirin', 'NSAID', ARRAY['tablet', 'chewable tablet'], ARRAY['81mg', '325mg'],
 'Used for pain relief and cardiovascular protection',
 ARRAY['Stomach upset', 'Bleeding risk', 'Tinnitus'],
 ARRAY['Bleeding disorders', 'Severe asthma']
);

COMMENT ON TABLE users IS 'Core user authentication and role management';
COMMENT ON TABLE user_profiles IS 'Detailed user profile information for both patients and providers';
COMMENT ON TABLE organizations IS 'Healthcare organizations including hospitals, clinics, pharmacies';
COMMENT ON TABLE provider_profiles IS 'Extended profile information for healthcare providers';
COMMENT ON TABLE patient_provider_relationships IS 'Manages relationships between patients and providers';
COMMENT ON TABLE medications IS 'Master medication database with drug information';
COMMENT ON TABLE patient_medications IS 'Patient-specific medication prescriptions and management';
COMMENT ON TABLE medication_logs IS 'Medication adherence tracking and logging';
COMMENT ON TABLE appointments IS 'Comprehensive appointment management system';
COMMENT ON TABLE health_records IS 'Patient health records and clinical documentation';
COMMENT ON TABLE vital_signs IS 'Patient vital signs tracking and monitoring';
COMMENT ON TABLE ai_insights IS 'AI-generated health insights and recommendations';
COMMENT ON TABLE messages IS 'Secure messaging system between patients and providers';
COMMENT ON TABLE notifications IS 'Multi-channel notification system';
COMMENT ON TABLE health_metrics IS 'Health analytics and performance metrics';
COMMENT ON TABLE care_plans IS 'Comprehensive care plan management';
COMMENT ON TABLE billing_records IS 'Billing and payment tracking';
COMMENT ON TABLE insurance_plans IS 'Patient insurance information';
COMMENT ON TABLE lab_results IS 'Laboratory test results and tracking';
COMMENT ON TABLE prescription_orders IS 'Pharmacy integration and prescription tracking';
COMMENT ON TABLE provider_analytics IS 'Provider business analytics and performance metrics'; 