// Sample data setup for Medicare+ Dashboard
// This script helps populate the database with sample data for testing

class DataSetup {
    constructor(supabase, userId) {
        this.supabase = supabase;
        this.userId = userId;
    }

    async createSampleMedications() {
        const medications = [
            {
                user_id: this.userId,
                medicine_name: 'Aspirin',
                dosage: '81mg',
                time: '08:00',
                frequency: 'daily',
                days_of_week: [1, 2, 3, 4, 5, 6, 7],
                start_date: new Date().toISOString().split('T')[0],
                notes: 'Take with food',
                is_active: true
            },
            {
                user_id: this.userId,
                medicine_name: 'Vitamin D3',
                dosage: '1000 IU',
                time: '08:00',
                frequency: 'daily',
                days_of_week: [1, 2, 3, 4, 5, 6, 7],
                start_date: new Date().toISOString().split('T')[0],
                notes: '',
                is_active: true
            },
            {
                user_id: this.userId,
                medicine_name: 'Metformin',
                dosage: '500mg',
                time: '12:00',
                frequency: 'daily',
                days_of_week: [1, 2, 3, 4, 5, 6, 7],
                start_date: new Date().toISOString().split('T')[0],
                notes: 'Take with lunch',
                is_active: true
            },
            {
                user_id: this.userId,
                medicine_name: 'Lisinopril',
                dosage: '10mg',
                time: '18:00',
                frequency: 'daily',
                days_of_week: [1, 2, 3, 4, 5, 6, 7],
                start_date: new Date().toISOString().split('T')[0],
                notes: 'Monitor blood pressure',
                is_active: true
            }
        ];

        try {
            const { data, error } = await this.supabase
                .from('medicare.medication_reminders')
                .insert(medications)
                .select();

            if (error) throw error;
            console.log('Sample medications created:', data);
            return data;
        } catch (error) {
            console.error('Error creating sample medications:', error);
        }
    }

    async createSampleAppointments() {
        const appointments = [
            {
                user_id: this.userId,
                doctor_name: 'Dr. Emily Smith',
                specialty: 'Cardiology',
                hospital_clinic: 'City Medical Center',
                appointment_date: this.getDateInDays(1),
                appointment_time: '10:30',
                reason: 'Follow-up consultation',
                notes: 'Bring previous test results',
                status: 'scheduled'
            },
            {
                user_id: this.userId,
                doctor_name: 'Dr. Michael Jones',
                specialty: 'Internal Medicine',
                hospital_clinic: 'General Hospital',
                appointment_date: this.getDateInDays(4),
                appointment_time: '14:00',
                reason: 'Annual physical examination',
                notes: 'Fasting required',
                status: 'scheduled'
            },
            {
                user_id: this.userId,
                doctor_name: 'Dr. Lisa Chen',
                specialty: 'Dermatology',
                hospital_clinic: 'Skin Care Clinic',
                appointment_date: this.getDateInDays(8),
                appointment_time: '11:00',
                reason: 'Skin examination',
                notes: '',
                status: 'scheduled'
            }
        ];

        try {
            const { data, error } = await this.supabase
                .from('medicare.medical_appointments')
                .insert(appointments)
                .select();

            if (error) throw error;
            console.log('Sample appointments created:', data);
            return data;
        } catch (error) {
            console.error('Error creating sample appointments:', error);
        }
    }

    async createSampleNotifications() {
        const notifications = [
            {
                user_id: this.userId,
                type: 'reminder',
                title: 'Medication Refill Due',
                message: 'Your Metformin prescription expires in 3 days',
                priority: 3,
                is_read: false,
                scheduled_for: new Date().toISOString(),
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                user_id: this.userId,
                type: 'appointment',
                title: 'Appointment Reminder',
                message: 'Dr. Smith appointment tomorrow at 10:30 AM',
                priority: 2,
                is_read: false,
                scheduled_for: new Date().toISOString(),
                expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                user_id: this.userId,
                type: 'health_tip',
                title: 'Health Tip of the Day',
                message: 'Stay hydrated - aim for 8 glasses of water daily',
                priority: 1,
                is_read: false,
                scheduled_for: new Date().toISOString(),
                expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        try {
            const { data, error } = await this.supabase
                .from('medicare.system_notifications')
                .insert(notifications)
                .select();

            if (error) throw error;
            console.log('Sample notifications created:', data);
            return data;
        } catch (error) {
            console.error('Error creating sample notifications:', error);
        }
    }

    async createMedicationLogs() {
        // Get user's medication reminders first
        const { data: medications, error } = await this.supabase
            .from('medicare.medication_reminders')
            .select('id')
            .eq('user_id', this.userId)
            .limit(2);

        if (error || !medications || medications.length === 0) {
            console.log('No medications found for logging');
            return;
        }

        const logs = medications.map(med => ({
            reminder_id: med.id,
            user_id: this.userId,
            taken_at: new Date().toISOString(),
            status: 'taken',
            notes: 'Taken as prescribed',
            effectiveness_rating: 4
        }));

        try {
            const { data, error } = await this.supabase
                .from('medicare.medication_logs')
                .insert(logs)
                .select();

            if (error) throw error;
            console.log('Sample medication logs created:', data);
            return data;
        } catch (error) {
            console.error('Error creating medication logs:', error);
        }
    }

    getDateInDays(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    async setupAllData() {
        console.log('Setting up sample data for user:', this.userId);
        
        try {
            await this.createSampleMedications();
            await this.createSampleAppointments();
            await this.createSampleNotifications();
            await this.createMedicationLogs();
            
            console.log('All sample data setup complete!');
        } catch (error) {
            console.error('Error setting up sample data:', error);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSetup;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.DataSetup = DataSetup;
} 