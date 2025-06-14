// Enhanced Database Configuration and Connection with AI Features
class DatabaseManager {
    constructor() {
        // Supabase configuration
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        this.supabase = null;
        this.useMockData = true; // Use mock data for demo
        this.initializeSupabase();
    }

    initializeSupabase() {
        try {
            if (typeof supabase !== 'undefined') {
                this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
                console.log('Supabase initialized successfully');
            } else {
                console.error('Supabase library not loaded, using mock data');
                this.useMockData = true;
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.useMockData = true;
        }
    }

    // Enhanced Sample Hospitals with comprehensive details
    getSampleHospitals() {
        return [
            {
                id: 1,
                name: 'City General Hospital',
                specialty: 'Multi-Specialty',
                address: '123 Main Street, Downtown',
                phone: '+1 (555) 123-4567',
                email: 'info@citygeneral.com',
                website: 'www.citygeneral.com',
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
                availability: ['09:00', '10:30', '14:00', '15:30', '17:00'],
                departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'Surgery', 'Radiology'],
                services: ['Emergency Care', 'Surgery', 'ICU', 'Maternity', 'Radiology', 'Laboratory', 'Pharmacy'],
                insurance_accepted: ['Blue Cross', 'Aetna', 'Medicare', 'Medicaid', 'Cigna', 'United Healthcare'],
                about: 'Leading multi-specialty hospital with state-of-the-art facilities and experienced medical professionals.',
                established: '1985',
                beds: 350,
                emergency_24x7: true,
                location: {
                    lat: 40.7128,
                    lng: -74.0060,
                    city: 'New York',
                    state: 'NY',
                    zip: '10001'
                },
                total_staff: 450,
                patient_satisfaction: 4.2,
                accreditation: 'Joint Commission',
                parking_available: true,
                wifi_available: true,
                languages_supported: ['English', 'Spanish', 'French', 'Chinese']
            },
            {
                id: 2,
                name: 'Heart Care Center',
                specialty: 'Cardiology',
                address: '456 Oak Avenue, Uptown',
                phone: '+1 (555) 234-5678',
                email: 'contact@heartcare.com',
                website: 'www.heartcare.com',
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400',
                availability: ['08:00', '09:30', '11:00', '13:30', '16:00'],
                departments: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology', 'Electrophysiology'],
                services: ['Cardiac Surgery', 'Catheterization', 'Echocardiography', 'Stress Testing', 'Pacemaker', 'Cardiac Rehabilitation'],
                insurance_accepted: ['Blue Cross', 'United Healthcare', 'Medicare', 'Humana', 'Aetna'],
                about: 'Specialized cardiac care center with advanced heart treatment facilities and nationally recognized cardiac surgeons.',
                established: '1995',
                beds: 120,
                emergency_24x7: true,
                location: {
                    lat: 40.7831,
                    lng: -73.9712,
                    city: 'New York',
                    state: 'NY',
                    zip: '10025'
                },
                total_staff: 180,
                patient_satisfaction: 4.7,
                accreditation: 'American Heart Association',
                parking_available: true,
                wifi_available: true,
                languages_supported: ['English', 'Spanish', 'Korean']
            },
            {
                id: 3,
                name: 'Children\'s Medical Center',
                specialty: 'Pediatrics',
                address: '789 Pine Street, Suburbs',
                phone: '+1 (555) 345-6789',
                email: 'info@childrenmed.com',
                website: 'www.childrenmed.com',
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
                availability: ['09:00', '11:00', '14:00', '16:00'],
                departments: ['Pediatrics', 'Pediatric Surgery', 'NICU', 'Child Psychology', 'Pediatric Cardiology'],
                services: ['Pediatric Emergency', 'NICU', 'Pediatric Surgery', 'Child Psychology', 'Vaccination', 'Developmental Assessment'],
                insurance_accepted: ['Blue Cross', 'Aetna', 'Medicare', 'Medicaid', 'Kaiser', 'Humana'],
                about: 'Dedicated children\'s hospital providing comprehensive pediatric care with child-friendly environment.',
                established: '2000',
                beds: 200,
                emergency_24x7: true,
                location: {
                    lat: 40.7589,
                    lng: -73.9851,
                    city: 'New York',
                    state: 'NY',
                    zip: '10019'
                },
                total_staff: 220,
                patient_satisfaction: 4.6,
                accreditation: 'Pediatric Specialty Care',
                parking_available: true,
                wifi_available: true,
                languages_supported: ['English', 'Spanish', 'French']
            },
            {
                id: 4,
                name: 'Metro Orthopedic Institute',
                specialty: 'Orthopedics',
                address: '321 Elm Street, Westside',
                phone: '+1 (555) 456-7890',
                email: 'info@metroortho.com',
                website: 'www.metroortho.com',
                rating: 4.6,
                image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
                availability: ['08:30', '10:00', '13:30', '15:00'],
                departments: ['Orthopedics', 'Sports Medicine', 'Physical Therapy', 'Spine Surgery'],
                services: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Physical Therapy', 'Trauma Care', 'Arthroscopy'],
                insurance_accepted: ['Blue Cross', 'United Healthcare', 'Cigna', 'Medicare', 'Workers Comp'],
                about: 'Leading orthopedic institute specializing in joint replacement, sports medicine, and spine care.',
                established: '2005',
                beds: 60,
                emergency_24x7: false,
                location: {
                    lat: 40.7505,
                    lng: -74.0087,
                    city: 'New York',
                    state: 'NY',
                    zip: '10014'
                },
                total_staff: 85,
                patient_satisfaction: 4.4,
                accreditation: 'American Academy of Orthopedic Surgeons',
                parking_available: true,
                wifi_available: true,
                languages_supported: ['English', 'Spanish']
            },
            {
                id: 5,
                name: 'Women\'s Health Clinic',
                specialty: 'Women\'s Health',
                address: '654 Maple Avenue, Eastside',
                phone: '+1 (555) 567-8901',
                email: 'care@womenshealth.com',
                website: 'www.womenshealth.com',
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
                availability: ['09:00', '11:30', '14:00', '16:30'],
                departments: ['Obstetrics', 'Gynecology', 'Reproductive Health', 'Prenatal Care'],
                services: ['Obstetrics', 'Gynecology', 'Prenatal Care', 'Family Planning', 'Mammography', 'Ultrasound'],
                insurance_accepted: ['Blue Cross', 'Aetna', 'Medicare', 'Medicaid', 'United Healthcare', 'Cigna'],
                about: 'Comprehensive women\'s health services with focus on maternal and reproductive health.',
                established: '2010',
                beds: 40,
                emergency_24x7: false,
                location: {
                    lat: 40.7282,
                    lng: -73.9942,
                    city: 'New York',
                    state: 'NY',
                    zip: '10002'
                },
                total_staff: 65,
                patient_satisfaction: 4.8,
                accreditation: 'American College of Obstetricians and Gynecologists',
                parking_available: true,
                wifi_available: true,
                languages_supported: ['English', 'Spanish', 'Arabic']
            }
        ];
    }

    // Enhanced Sample Doctors with comprehensive profiles
    getSampleDoctors() {
        return [
            {
                id: 1,
                name: 'Dr. Sarah Johnson',
                specialty: 'Cardiology',
                hospital_id: 1,
                hospital_name: 'City General Hospital',
                experience: '15 years',
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                qualification: 'MD, FACC, Board Certified Cardiologist',
                availability: ['09:00', '10:30', '14:00', '15:30'],
                consultation_fee: 150,
                about: 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention. Published researcher with expertise in minimally invasive cardiac procedures.',
                languages: ['English', 'Spanish', 'French'],
                phone: '+1 (555) 123-4567',
                email: 'dr.johnson@citygeneral.com',
                education: [
                    'MD - Harvard Medical School (2005)',
                    'Residency - Johns Hopkins Hospital (2009)',
                    'Fellowship - Mayo Clinic Cardiology (2011)'
                ],
                certifications: ['American Board of Internal Medicine', 'American Board of Cardiovascular Disease'],
                awards: ['Best Doctor Award 2023', 'Patient Choice Award 2022'],
                research_interests: ['Interventional Cardiology', 'Heart Disease Prevention', 'Cardiac Imaging'],
                patient_reviews: 4.9,
                total_patients: 1250,
                years_at_hospital: 8,
                office_hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
                emergency_available: true
            },
            {
                id: 2,
                name: 'Dr. Michael Chen',
                specialty: 'Neurology',
                hospital_id: 1,
                hospital_name: 'City General Hospital',
                experience: '12 years',
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
                qualification: 'MD, PhD, Board Certified Neurologist',
                availability: ['08:30', '10:00', '13:30', '16:00'],
                consultation_fee: 180,
                about: 'Neurologist with expertise in stroke treatment and neurodegenerative diseases. Research focus on Alzheimer\'s disease and innovative treatment approaches.',
                languages: ['English', 'Mandarin', 'Cantonese'],
                phone: '+1 (555) 234-5678',
                email: 'dr.chen@citygeneral.com',
                education: [
                    'MD - Stanford University School of Medicine (2008)',
                    'PhD Neuroscience - MIT (2012)',
                    'Residency - UCSF Neurology (2012)',
                    'Fellowship - Cleveland Clinic (2014)'
                ],
                certifications: ['American Board of Psychiatry and Neurology', 'Vascular Neurology Certification'],
                awards: ['Excellence in Neurology Award 2023', 'Research Innovation Award 2021'],
                research_interests: ['Stroke Treatment', 'Neurodegenerative Diseases', 'Brain Imaging'],
                patient_reviews: 4.8,
                total_patients: 980,
                years_at_hospital: 6,
                office_hours: 'Mon-Thu: 8:00 AM - 6:00 PM, Fri: 8:00 AM - 4:00 PM',
                emergency_available: true
            },
            {
                id: 3,
                name: 'Dr. Emily Rodriguez',
                specialty: 'Pediatrics',
                hospital_id: 3,
                hospital_name: 'Children\'s Medical Center',
                experience: '10 years',
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1594824694996-a8d3d812e3ca?w=400',
                qualification: 'MD, FAAP, Board Certified Pediatrician',
                availability: ['09:00', '11:00', '14:00', '16:00'],
                consultation_fee: 120,
                about: 'Dedicated pediatrician passionate about child health and development. Specializes in developmental pediatrics and childhood behavioral health.',
                languages: ['English', 'Spanish', 'Portuguese'],
                phone: '+1 (555) 345-6789',
                email: 'dr.rodriguez@childrenmed.com',
                education: [
                    'MD - University of Miami School of Medicine (2010)',
                    'Residency - Children\'s Hospital Boston (2013)',
                    'Fellowship - Developmental Pediatrics UCLA (2014)'
                ],
                certifications: ['American Board of Pediatrics', 'Developmental-Behavioral Pediatrics'],
                awards: ['Outstanding Pediatrician Award 2022', 'Community Service Award 2021'],
                research_interests: ['Child Development', 'Behavioral Health', 'Pediatric Nutrition'],
                patient_reviews: 4.9,
                total_patients: 1150,
                years_at_hospital: 7,
                office_hours: 'Mon-Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM',
                emergency_available: false
            },
            {
                id: 4,
                name: 'Dr. Robert Wilson',
                specialty: 'Orthopedics',
                hospital_id: 4,
                hospital_name: 'Metro Orthopedic Institute',
                experience: '18 years',
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
                qualification: 'MD, FAAOS, Board Certified Orthopedic Surgeon',
                availability: ['08:00', '10:30', '15:00', '17:00'],
                consultation_fee: 200,
                about: 'Leading orthopedic surgeon specializing in joint replacement and sports medicine. Team physician for professional sports teams.',
                languages: ['English', 'German'],
                phone: '+1 (555) 456-7890',
                email: 'dr.wilson@metroortho.com',
                education: [
                    'MD - Johns Hopkins School of Medicine (2002)',
                    'Residency - Hospital for Special Surgery (2007)',
                    'Fellowship - Sports Medicine and Arthroscopy (2008)'
                ],
                certifications: ['American Board of Orthopedic Surgery', 'Certificate of Added Qualification in Sports Medicine'],
                awards: ['Top Orthopedic Surgeon 2023', 'Sports Medicine Excellence Award 2022'],
                research_interests: ['Joint Replacement', 'Sports Medicine', 'Minimally Invasive Surgery'],
                patient_reviews: 4.7,
                total_patients: 890,
                years_at_hospital: 12,
                office_hours: 'Mon-Fri: 7:00 AM - 6:00 PM',
                emergency_available: true
            },
            {
                id: 5,
                name: 'Dr. Lisa Thompson',
                specialty: 'Obstetrics & Gynecology',
                hospital_id: 5,
                hospital_name: 'Women\'s Health Clinic',
                experience: '14 years',
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                qualification: 'MD, FACOG, Board Certified OB/GYN',
                availability: ['09:00', '11:30', '14:00', '16:30'],
                consultation_fee: 160,
                about: 'Experienced OB/GYN specializing in high-risk pregnancies and minimally invasive gynecologic surgery.',
                languages: ['English', 'Spanish', 'Italian'],
                phone: '+1 (555) 567-8901',
                email: 'dr.thompson@womenshealth.com',
                education: [
                    'MD - Yale School of Medicine (2006)',
                    'Residency - Brigham and Women\'s Hospital (2010)',
                    'Fellowship - Maternal-Fetal Medicine (2012)'
                ],
                certifications: ['American Board of Obstetrics and Gynecology', 'Maternal-Fetal Medicine'],
                awards: ['Women\'s Health Excellence Award 2023', 'Patient Safety Award 2022'],
                research_interests: ['High-Risk Pregnancies', 'Minimally Invasive Surgery', 'Reproductive Endocrinology'],
                patient_reviews: 4.8,
                total_patients: 1050,
                years_at_hospital: 9,
                office_hours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM',
                emergency_available: true
            },
            {
                id: 6,
                name: 'Dr. James Martinez',
                specialty: 'Emergency Medicine',
                hospital_id: 1,
                hospital_name: 'City General Hospital',
                experience: '11 years',
                rating: 4.6,
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
                qualification: 'MD, Board Certified Emergency Medicine',
                availability: ['24/7 Emergency Coverage'],
                consultation_fee: 175,
                about: 'Emergency medicine physician with expertise in trauma care and critical care medicine.',
                languages: ['English', 'Spanish'],
                phone: '+1 (555) 123-4567',
                email: 'dr.martinez@citygeneral.com',
                education: [
                    'MD - University of Texas Southwestern (2009)',
                    'Residency - Emergency Medicine UCLA (2012)'
                ],
                certifications: ['American Board of Emergency Medicine', 'Advanced Trauma Life Support'],
                awards: ['Emergency Medicine Excellence Award 2022'],
                research_interests: ['Trauma Care', 'Emergency Cardiology', 'Critical Care'],
                patient_reviews: 4.6,
                total_patients: 750,
                years_at_hospital: 5,
                office_hours: '24/7 Emergency Department',
                emergency_available: true
            }
        ];
    }

    // Enhanced Sample Appointments with comprehensive data
    getSampleAppointments() {
        return [
            {
                id: 1,
                patient_id: 'PAT001',
                patient_name: 'John Doe',
                patient_phone: '+1 (555) 111-2222',
                patient_email: 'john.doe@email.com',
                doctor_id: 1,
                doctor_name: 'Dr. Sarah Johnson',
                hospital_id: 1,
                hospital_name: 'City General Hospital',
                appointment_date: '2024-01-15',
                appointment_time: '10:30',
                status: 'confirmed',
                token_number: 'CG001',
                specialty: 'Cardiology',
                type: 'consultation',
                notes: 'Regular checkup for heart condition - patient reports chest pain',
                created_at: '2024-01-10T09:00:00Z',
                updated_at: '2024-01-10T09:30:00Z',
                estimated_duration: 30,
                patient_age: 45,
                patient_gender: 'Male',
                insurance_provider: 'Blue Cross',
                referral_doctor: 'Dr. Family Medicine',
                symptoms: ['Chest pain', 'Shortness of breath'],
                urgency: 'medium',
                ai_risk_score: 6.5,
                ai_recommendations: ['ECG recommended', 'Monitor blood pressure', 'Stress test consideration']
            },
            {
                id: 2,
                patient_id: 'PAT002',
                patient_name: 'Jane Smith',
                patient_phone: '+1 (555) 222-3333',
                patient_email: 'jane.smith@email.com',
                doctor_id: 2,
                doctor_name: 'Dr. Michael Chen',
                hospital_id: 1,
                hospital_name: 'City General Hospital',
                appointment_date: '2024-01-16',
                appointment_time: '13:30',
                status: 'pending',
                token_number: 'CG002',
                specialty: 'Neurology',
                type: 'follow-up',
                notes: 'Follow-up for migraine treatment - patient reports improvement',
                created_at: '2024-01-12T14:30:00Z',
                updated_at: '2024-01-12T14:30:00Z',
                estimated_duration: 45,
                patient_age: 32,
                patient_gender: 'Female',
                insurance_provider: 'Aetna',
                referral_doctor: null,
                symptoms: ['Migraine', 'Light sensitivity'],
                urgency: 'low',
                ai_risk_score: 3.2,
                ai_recommendations: ['Continue current medication', 'Lifestyle counseling', 'MRI if symptoms worsen']
            },
            {
                id: 3,
                patient_id: 'PAT003',
                patient_name: 'Mike Johnson',
                patient_phone: '+1 (555) 333-4444',
                patient_email: 'mike.johnson@email.com',
                doctor_id: 3,
                doctor_name: 'Dr. Emily Rodriguez',
                hospital_id: 3,
                hospital_name: 'Children\'s Medical Center',
                appointment_date: '2024-01-14',
                appointment_time: '09:00',
                status: 'completed',
                token_number: 'CM001',
                specialty: 'Pediatrics',
                type: 'vaccination',
                notes: 'Annual vaccination schedule for 8-year-old child',
                created_at: '2024-01-08T10:15:00Z',
                updated_at: '2024-01-14T10:00:00Z',
                estimated_duration: 20,
                patient_age: 8,
                patient_gender: 'Male',
                insurance_provider: 'Medicare',
                referral_doctor: null,
                symptoms: ['Routine checkup'],
                urgency: 'low',
                ai_risk_score: 1.0,
                ai_recommendations: ['Vaccination on schedule', 'Growth monitoring normal', 'Next visit in 6 months']
            },
            {
                id: 4,
                patient_id: 'PAT004',
                patient_name: 'Sarah Wilson',
                patient_phone: '+1 (555) 444-5555',
                patient_email: 'sarah.wilson@email.com',
                doctor_id: 4,
                doctor_name: 'Dr. Robert Wilson',
                hospital_id: 4,
                hospital_name: 'Metro Orthopedic Institute',
                appointment_date: '2024-01-20',
                appointment_time: '15:00',
                status: 'pending',
                token_number: 'MO001',
                specialty: 'Orthopedics',
                type: 'consultation',
                notes: 'Knee pain after sports injury - possible ACL tear',
                created_at: '2024-01-15T16:20:00Z',
                updated_at: '2024-01-15T16:20:00Z',
                estimated_duration: 60,
                patient_age: 28,
                patient_gender: 'Female',
                insurance_provider: 'United Healthcare',
                referral_doctor: 'Dr. Sports Medicine',
                symptoms: ['Knee pain', 'Swelling', 'Limited mobility'],
                urgency: 'high',
                ai_risk_score: 8.1,
                ai_recommendations: ['MRI required', 'Possible surgery', 'Physical therapy consultation']
            },
            {
                id: 5,
                patient_id: 'PAT005',
                patient_name: 'Maria Garcia',
                patient_phone: '+1 (555) 555-6666',
                patient_email: 'maria.garcia@email.com',
                doctor_id: 5,
                doctor_name: 'Dr. Lisa Thompson',
                hospital_id: 5,
                hospital_name: 'Women\'s Health Clinic',
                appointment_date: '2024-01-18',
                appointment_time: '11:30',
                status: 'confirmed',
                token_number: 'WH001',
                specialty: 'Obstetrics & Gynecology',
                type: 'prenatal',
                notes: 'Second trimester prenatal checkup - 20 weeks',
                created_at: '2024-01-13T11:45:00Z',
                updated_at: '2024-01-13T12:00:00Z',
                estimated_duration: 45,
                patient_age: 29,
                patient_gender: 'Female',
                insurance_provider: 'Cigna',
                referral_doctor: null,
                symptoms: ['Routine prenatal care'],
                urgency: 'low',
                ai_risk_score: 2.5,
                ai_recommendations: ['Ultrasound scheduled', 'Nutrition counseling', 'Monitor blood pressure']
            },
            {
                id: 6,
                patient_id: 'PAT006',
                patient_name: 'Robert Brown',
                patient_phone: '+1 (555) 666-7777',
                patient_email: 'robert.brown@email.com',
                doctor_id: 6,
                doctor_name: 'Dr. James Martinez',
                hospital_id: 1,
                hospital_name: 'City General Hospital',
                appointment_date: '2024-01-17',
                appointment_time: '22:00',
                status: 'completed',
                token_number: 'ER001',
                specialty: 'Emergency Medicine',
                type: 'emergency',
                notes: 'Emergency visit - severe abdominal pain',
                created_at: '2024-01-17T21:30:00Z',
                updated_at: '2024-01-17T23:30:00Z',
                estimated_duration: 120,
                patient_age: 52,
                patient_gender: 'Male',
                insurance_provider: 'Medicare',
                referral_doctor: null,
                symptoms: ['Severe abdominal pain', 'Nausea', 'Fever'],
                urgency: 'critical',
                ai_risk_score: 9.2,
                ai_recommendations: ['CT scan completed', 'Surgery recommended', 'Admit to hospital']
            }
        ];
    }

    // AI-powered appointment recommendations
    getAIRecommendations(appointmentData) {
        const recommendations = [
            {
                id: 1,
                type: 'scheduling',
                message: 'Optimal time slot based on doctor availability and patient history',
                confidence: 0.85,
                priority: 'medium'
            },
            {
                id: 2,
                type: 'preparation',
                message: 'Patient should bring previous medical records and current medications list',
                confidence: 0.92,
                priority: 'high'
            },
            {
                id: 3,
                type: 'follow-up',
                message: 'Schedule follow-up appointment in 2 weeks based on treatment plan',
                confidence: 0.78,
                priority: 'low'
            }
        ];
        
        return recommendations;
    }

    // Enhanced database operations
    async getHospitals() {
        if (this.useMockData) {
            return this.getSampleHospitals();
        }
        
        try {
            const { data, error } = await this.supabase
                .from('hospitals')
                .select('*')
                .order('rating', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            return this.getSampleHospitals();
        }
    }

    async getDoctors() {
        if (this.useMockData) {
            return this.getSampleDoctors();
        }
        
        try {
            const { data, error } = await this.supabase
                .from('doctors')
                .select('*')
                .order('rating', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return this.getSampleDoctors();
        }
    }

    async getAppointments(userId = null) {
        if (this.useMockData) {
            return this.getSampleAppointments();
        }
        
        try {
            let query = this.supabase
                .from('appointments')
                .select('*')
                .order('appointment_date', { ascending: true });
            
            if (userId) {
                query = query.eq('patient_id', userId);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return this.getSampleAppointments();
        }
    }

    async createAppointment(appointmentData) {
        // Generate token number
        const tokenNumber = this.generateTokenNumber(appointmentData.hospital_id);
        
        // Add AI risk assessment
        const aiRiskScore = this.calculateAIRiskScore(appointmentData);
        const aiRecommendations = this.generateAIRecommendations(appointmentData);
        
        const enhancedData = {
            ...appointmentData,
            token_number: tokenNumber,
            status: 'pending',
            created_at: new Date().toISOString(),
            ai_risk_score: aiRiskScore,
            ai_recommendations: aiRecommendations
        };
        
        if (this.useMockData) {
            const newAppointment = {
                id: Date.now(),
                ...enhancedData
            };
            console.log('Mock appointment created:', newAppointment);
            return newAppointment;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .insert([enhancedData])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(appointmentId, status) {
        const updatedData = {
            status: status,
            updated_at: new Date().toISOString()
        };
        
        if (this.useMockData) {
            console.log(`Mock appointment ${appointmentId} status updated to: ${status}`);
            return { id: appointmentId, ...updatedData };
        }
        
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .update(updatedData)
                .eq('id', appointmentId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    }

    // Enhanced token generation with hospital prefix
    generateTokenNumber(hospitalId) {
        const hospitalPrefixes = {
            1: 'CG',   // City General
            2: 'HC',   // Heart Care
            3: 'CM',   // Children's Medical
            4: 'MO',   // Metro Orthopedic
            5: 'WH'    // Women's Health
        };
        
        const prefix = hospitalPrefixes[hospitalId] || 'GH';
        const timestamp = Date.now().toString().slice(-4);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        
        return `${prefix}${timestamp}${random}`;
    }

    // AI-powered risk assessment
    calculateAIRiskScore(appointmentData) {
        let riskScore = 5; // Base score
        
        // Age factor
        if (appointmentData.patient_age > 65) riskScore += 2;
        if (appointmentData.patient_age < 18) riskScore += 1;
        
        // Urgency factor
        if (appointmentData.urgency === 'critical') riskScore += 3;
        else if (appointmentData.urgency === 'high') riskScore += 2;
        else if (appointmentData.urgency === 'medium') riskScore += 1;
        
        // Specialty factor
        if (appointmentData.specialty === 'Emergency Medicine') riskScore += 2;
        if (appointmentData.specialty === 'Cardiology') riskScore += 1;
        
        return Math.min(riskScore, 10); // Cap at 10
    }

    // Generate AI recommendations for appointments
    generateAIRecommendations(appointmentData) {
        const recommendations = [];
        
        if (appointmentData.specialty === 'Cardiology') {
            recommendations.push('ECG recommended');
            recommendations.push('Monitor blood pressure');
        }
        
        if (appointmentData.patient_age > 65) {
            recommendations.push('Comprehensive medication review');
        }
        
        if (appointmentData.urgency === 'high') {
            recommendations.push('Priority scheduling');
        }
        
        return recommendations;
    }

    // Search functionality
    async searchHospitals(query, filters = {}) {
        const hospitals = await this.getHospitals();
        let results = hospitals;
        
        // Text search
        if (query) {
            results = results.filter(hospital => 
                hospital.name.toLowerCase().includes(query.toLowerCase()) ||
                hospital.specialty.toLowerCase().includes(query.toLowerCase()) ||
                hospital.address.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        // Apply filters
        if (filters.specialty) {
            results = results.filter(hospital => 
                hospital.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
            );
        }
        
        if (filters.location) {
            results = results.filter(hospital => 
                hospital.address.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        if (filters.emergency) {
            results = results.filter(hospital => hospital.emergency_24x7);
        }
        
        return results;
    }

    async searchDoctors(query, filters = {}) {
        const doctors = await this.getDoctors();
        let results = doctors;
        
        // Text search
        if (query) {
            results = results.filter(doctor => 
                doctor.name.toLowerCase().includes(query.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
                doctor.hospital_name.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        // Apply filters
        if (filters.specialty) {
            results = results.filter(doctor => 
                doctor.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
            );
        }
        
        if (filters.hospital) {
            results = results.filter(doctor => 
                doctor.hospital_name.toLowerCase().includes(filters.hospital.toLowerCase())
            );
        }
        
        if (filters.rating) {
            results = results.filter(doctor => doctor.rating >= parseFloat(filters.rating));
        }
        
        return results;
    }

    // Analytics and reporting
    async getHospitalAnalytics(hospitalId) {
        const appointments = await this.getAppointments();
        const hospitalAppointments = appointments.filter(apt => apt.hospital_id === hospitalId);
        
        return {
            totalAppointments: hospitalAppointments.length,
            confirmedAppointments: hospitalAppointments.filter(apt => apt.status === 'confirmed').length,
            pendingAppointments: hospitalAppointments.filter(apt => apt.status === 'pending').length,
            completedAppointments: hospitalAppointments.filter(apt => apt.status === 'completed').length,
            averageRiskScore: hospitalAppointments.reduce((sum, apt) => sum + (apt.ai_risk_score || 0), 0) / hospitalAppointments.length,
            criticalPatients: hospitalAppointments.filter(apt => (apt.ai_risk_score || 0) > 8).length
        };
    }

    async getDoctorAnalytics(doctorId) {
        const appointments = await this.getAppointments();
        const doctorAppointments = appointments.filter(apt => apt.doctor_id === doctorId);
        
        return {
            totalAppointments: doctorAppointments.length,
            averageRiskScore: doctorAppointments.reduce((sum, apt) => sum + (apt.ai_risk_score || 0), 0) / doctorAppointments.length,
            patientSatisfaction: 4.5, // Mock data
            onTimePerformance: 0.85 // Mock data
        };
    }
}

// Initialize global database manager
const dbManager = new DatabaseManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatabaseManager;
} 