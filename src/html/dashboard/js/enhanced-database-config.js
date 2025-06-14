// Enhanced Database Configuration with AI Integration
class EnhancedDatabaseManager {
    constructor() {
        this.supabaseUrl = 'https://your-project.supabase.co';
        this.supabaseKey = 'your-anon-key';
        this.supabase = null;
        this.isOnline = navigator.onLine;
        this.localData = {
            hospitals: [],
            doctors: [],
            patients: [],
            appointments: [],
            providers: []
        };
        this.init();
    }

    async init() {
        try {
            // Initialize Supabase client if available
            if (typeof supabase !== 'undefined') {
                this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            }
            
            // Load sample data
            await this.loadSampleData();
            
            // Setup offline monitoring
            this.setupOfflineSync();
            
            console.log('Enhanced Database Manager initialized successfully');
        } catch (error) {
            console.warn('Database initialization failed, using offline mode:', error);
            await this.loadSampleData();
        }
    }

    async loadSampleData() {
        // Comprehensive sample hospitals data
        this.localData.hospitals = [
            {
                id: 1,
                name: "City General Hospital",
                address: "123 Medical Center Dr, Downtown",
                phone: "+1 (555) 123-4567",
                email: "info@citygeneral.com",
                emergency_24x7: true,
                total_beds: 500,
                available_beds: 45,
                specialties: ["Cardiology", "Neurology", "Orthopedics", "Emergency Medicine", "Pediatrics"],
                facilities: ["ICU", "Emergency Room", "Surgery", "Radiology", "Laboratory", "Pharmacy"],
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400",
                availability: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"],
                beds: 500,
                coordinates: { lat: 40.7128, lng: -74.0060 },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 2,
                name: "St. Mary's Medical Center",
                address: "456 Healthcare Ave, Midtown",
                phone: "+1 (555) 234-5678",
                email: "contact@stmarysmed.com",
                emergency_24x7: true,
                total_beds: 350,
                available_beds: 28,
                specialties: ["Oncology", "Cardiology", "Gastroenterology", "Pulmonology"],
                facilities: ["Cancer Center", "Heart Institute", "Surgical Suites", "MRI", "CT Scan"],
                rating: 4.6,
                image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
                availability: ["8:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
                beds: 350,
                coordinates: { lat: 40.7589, lng: -73.9851 },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 3,
                name: "Metro Children's Hospital",
                address: "789 Kids Care Blvd, Suburbs",
                phone: "+1 (555) 345-6789",
                email: "info@metrochildren.com",
                emergency_24x7: true,
                total_beds: 200,
                available_beds: 15,
                specialties: ["Pediatrics", "Neonatology", "Pediatric Surgery", "Child Psychology"],
                facilities: ["NICU", "Pediatric ICU", "Play Therapy", "Family Support"],
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400",
                availability: ["9:30 AM", "11:30 AM", "2:30 PM", "4:30 PM"],
                beds: 200,
                coordinates: { lat: 40.6892, lng: -74.0445 },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        // Comprehensive sample doctors data
        this.localData.doctors = [
            {
                id: 1,
                name: "Dr. Sarah Johnson",
                email: "s.johnson@citygeneral.com",
                specialty: "Cardiology",
                hospital_id: 1,
                hospital_name: "City General Hospital",
                experience: "15 years",
                qualification: "MD, FACC - Harvard Medical School",
                consultation_fee: 200,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
                availability: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"],
                languages: ["English", "Spanish"],
                specializations: ["Interventional Cardiology", "Heart Failure", "Preventive Cardiology"],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 2,
                name: "Dr. Michael Chen",
                email: "m.chen@citygeneral.com",
                specialty: "Neurology",
                hospital_id: 1,
                hospital_name: "City General Hospital",
                experience: "12 years",
                qualification: "MD, PhD - Johns Hopkins University",
                consultation_fee: 250,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300",
                availability: ["8:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
                languages: ["English", "Mandarin"],
                specializations: ["Stroke", "Epilepsy", "Movement Disorders"],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 3,
                name: "Dr. Emily Rodriguez",
                email: "e.rodriguez@stmarysmed.com",
                specialty: "Oncology",
                hospital_id: 2,
                hospital_name: "St. Mary's Medical Center",
                experience: "18 years",
                qualification: "MD, FASCO - Mayo Clinic",
                consultation_fee: 300,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1594824804732-ca8db43bd456?w=300",
                availability: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"],
                languages: ["English", "Spanish", "Portuguese"],
                specializations: ["Breast Cancer", "Lung Cancer", "Immunotherapy"],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 4,
                name: "Dr. David Thompson",
                email: "d.thompson@metrochildren.com",
                specialty: "Pediatrics",
                hospital_id: 3,
                hospital_name: "Metro Children's Hospital",
                experience: "10 years",
                qualification: "MD, FAAP - Stanford Medical School",
                consultation_fee: 150,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300",
                availability: ["8:30 AM", "10:00 AM", "1:30 PM", "3:00 PM"],
                languages: ["English", "French"],
                specializations: ["General Pediatrics", "Developmental Pediatrics", "Adolescent Medicine"],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        // Sample appointments data
        this.localData.appointments = [
            {
                id: 1,
                patient_id: 1,
                patient_name: "John Williams",
                provider_id: 1,
                doctor_name: "Dr. Sarah Johnson",
                hospital_id: 1,
                hospital_name: "City General Hospital",
                appointment_date: this.getTomorrowDate(),
                appointment_time: "10:00 AM",
                token_number: "TK1001",
                status: "pending",
                specialty: "Cardiology",
                type: "Follow-up",
                notes: "Follow-up for hypertension management",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 2,
                patient_id: 2,
                patient_name: "Maria Garcia",
                provider_id: 4,
                doctor_name: "Dr. David Thompson",
                hospital_id: 3,
                hospital_name: "Metro Children's Hospital",
                appointment_date: this.getNextWeekDate(),
                appointment_time: "2:00 PM",
                token_number: "TK1002",
                status: "confirmed",
                specialty: "Pediatrics",
                type: "Consultation",
                notes: "Annual check-up",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }

    // Utility functions
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    getNextWeekDate() {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString().split('T')[0];
    }

    // Database Operations
    async getHospitals() {
        try {
            if (this.supabase && this.isOnline) {
                const { data, error } = await this.supabase
                    .from('hospitals')
                    .select('*')
                    .order('rating', { ascending: false });
                
                if (error) throw error;
                return data && data.length > 0 ? data : this.localData.hospitals;
            }
            return this.localData.hospitals;
        } catch (error) {
            console.warn('Using local hospital data:', error);
            return this.localData.hospitals;
        }
    }

    async getDoctors() {
        try {
            if (this.supabase && this.isOnline) {
                const { data, error } = await this.supabase
                    .from('doctors')
                    .select('*')
                    .order('rating', { ascending: false });
                
                if (error) throw error;
                return data && data.length > 0 ? data : this.localData.doctors;
            }
            return this.localData.doctors;
        } catch (error) {
            console.warn('Using local doctor data:', error);
            return this.localData.doctors;
        }
    }

    async getAppointments() {
        try {
            if (this.supabase && this.isOnline) {
                const { data, error } = await this.supabase
                    .from('appointments')
                    .select('*')
                    .order('appointment_date', { ascending: true });
                
                if (error) throw error;
                return data && data.length > 0 ? data : this.localData.appointments;
            }
            return this.localData.appointments;
        } catch (error) {
            console.warn('Using local appointment data:', error);
            return this.localData.appointments;
        }
    }

    async createAppointment(appointmentData) {
        try {
            const newAppointment = {
                ...appointmentData,
                id: Date.now(),
                token_number: this.generateTokenNumber(),
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (this.supabase && this.isOnline) {
                const { data, error } = await this.supabase
                    .from('appointments')
                    .insert([newAppointment])
                    .select();
                
                if (error) throw error;
                return data[0];
            } else {
                this.localData.appointments.push(newAppointment);
                return newAppointment;
            }
        } catch (error) {
            console.warn('Creating appointment locally:', error);
            const newAppointment = {
                ...appointmentData,
                id: Date.now(),
                token_number: this.generateTokenNumber(),
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            this.localData.appointments.push(newAppointment);
            return newAppointment;
        }
    }

    async updateAppointmentStatus(appointmentId, status, additionalData = {}) {
        try {
            const updateData = {
                status,
                updated_at: new Date().toISOString(),
                ...additionalData
            };

            if (this.supabase && this.isOnline) {
                const { data, error } = await this.supabase
                    .from('appointments')
                    .update(updateData)
                    .eq('id', appointmentId)
                    .select();
                
                if (error) throw error;
                return data[0];
            } else {
                const appointment = this.localData.appointments.find(apt => apt.id === appointmentId);
                if (appointment) {
                    Object.assign(appointment, updateData);
                    return appointment;
                }
            }
        } catch (error) {
            console.warn('Updating appointment locally:', error);
            const appointment = this.localData.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                Object.assign(appointment, {
                    status,
                    updated_at: new Date().toISOString(),
                    ...additionalData
                });
                return appointment;
            }
        }
    }

    generateTokenNumber() {
        const prefix = 'TK';
        const timestamp = Date.now().toString().slice(-4);
        return `${prefix}${timestamp}`;
    }

    setupOfflineSync() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    async syncOfflineData() {
        console.log('Syncing offline data...');
    }
}

// Initialize the enhanced database manager
const enhancedDbManager = new EnhancedDatabaseManager();
window.enhancedDbManager = enhancedDbManager; 