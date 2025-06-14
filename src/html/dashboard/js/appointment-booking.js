// Appointment Booking System
class AppointmentBookingSystem {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.selectedProvider = null;
        this.selectedTimeSlot = null;
        this.currentTab = 'hospitals';
        this.init();
    }

    async init() {
        await this.initSupabase();
        await this.loadCurrentUser();
        this.setupEventListeners();
        await this.loadProviders();
        await this.loadUserAppointments();
    }

    async initSupabase() {
        const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4NzEsImV4cCI6MjA1MDU0ODg3MX0.wJJnhKBBtEWzKpOsIGCNJOGXNgKJSdyJzlJQhJJhJJQ';
        this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    }

    async loadCurrentUser() {
        // Mock user for demo - in production, get from auth
        this.currentUser = {
            id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com'
        };
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.performSearch.bind(this), 300));
        }

        // Filter changes
        const filters = ['location-filter', 'specialty-filter', 'availability-filter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', this.performSearch.bind(this));
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab UI
        document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
        
        // Load appropriate content
        this.loadProviders();
    }

    async loadProviders() {
        const container = document.getElementById('providers-container');
        if (!container) return;

        try {
            let providers = [];
            
            if (this.currentTab === 'hospitals') {
                providers = await this.getHospitals();
            } else if (this.currentTab === 'doctors') {
                providers = await this.getDoctors();
            } else if (this.currentTab === 'specialties') {
                providers = await this.getSpecialties();
            }

            this.renderProviders(providers);
        } catch (error) {
            console.error('Error loading providers:', error);
            container.innerHTML = '<div class="error-message">Failed to load providers. Please try again.</div>';
        }
    }

    async getHospitals() {
        // Mock hospital data - in production, fetch from Supabase
        return [
            {
                id: 'hospital-1',
                type: 'hospital',
                name: 'City General Hospital',
                specialty: 'Multi-specialty Hospital',
                image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop&crop=face',
                rating: 4.8,
                reviews: 1250,
                location: 'Downtown',
                address: '123 Medical Center Dr, Downtown',
                phone: '+1 (555) 123-4567',
                departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency'],
                availability: {
                    today: ['09:00', '10:30', '14:00', '15:30'],
                    tomorrow: ['08:00', '09:30', '11:00', '13:30', '16:00']
                }
            },
            {
                id: 'hospital-2',
                type: 'hospital',
                name: 'Metro Heart Institute',
                specialty: 'Cardiac Specialty Center',
                image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=200&h=200&fit=crop',
                rating: 4.9,
                reviews: 890,
                location: 'Uptown',
                address: '456 Heart Ave, Uptown',
                phone: '+1 (555) 234-5678',
                departments: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology'],
                availability: {
                    today: ['10:00', '11:30', '15:00'],
                    tomorrow: ['09:00', '10:30', '12:00', '14:30']
                }
            }
        ];
    }

    async getDoctors() {
        // Mock doctor data - in production, fetch from Supabase
        return [
            {
                id: 'doctor-1',
                type: 'doctor',
                name: 'Dr. Sarah Johnson',
                specialty: 'Cardiologist',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
                rating: 4.9,
                reviews: 324,
                experience: '15 years',
                hospital: 'City General Hospital',
                location: 'Downtown',
                education: 'MD from Harvard Medical School',
                languages: ['English', 'Spanish'],
                consultationFee: '$150',
                availability: {
                    today: ['09:00', '10:30', '14:00', '15:30'],
                    tomorrow: ['08:00', '09:30', '11:00', '13:30']
                }
            },
            {
                id: 'doctor-2',
                type: 'doctor',
                name: 'Dr. Michael Chen',
                specialty: 'Neurologist',
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
                rating: 4.8,
                reviews: 267,
                experience: '12 years',
                hospital: 'Metro Neuro Center',
                location: 'Uptown',
                education: 'MD from Johns Hopkins',
                languages: ['English', 'Mandarin'],
                consultationFee: '$180',
                availability: {
                    today: ['10:00', '11:30', '15:00'],
                    tomorrow: ['09:00', '10:30', '12:00', '14:30']
                }
            }
        ];
    }

    async getSpecialties() {
        // Mock specialty data
        return [
            {
                id: 'specialty-1',
                type: 'specialty',
                name: 'Cardiology',
                description: 'Heart and cardiovascular system care',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
                doctorCount: 15,
                hospitalCount: 8,
                avgRating: 4.7,
                commonConditions: ['Heart Disease', 'Hypertension', 'Arrhythmia']
            },
            {
                id: 'specialty-2',
                type: 'specialty',
                name: 'Neurology',
                description: 'Brain and nervous system disorders',
                image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop',
                doctorCount: 12,
                hospitalCount: 6,
                avgRating: 4.6,
                commonConditions: ['Migraine', 'Epilepsy', 'Stroke']
            }
        ];
    }

    renderProviders(providers) {
        const container = document.getElementById('providers-container');
        if (!container) return;

        if (providers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No providers found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = providers.map(provider => {
            if (provider.type === 'hospital') {
                return this.renderHospitalCard(provider);
            } else if (provider.type === 'doctor') {
                return this.renderDoctorCard(provider);
            } else if (provider.type === 'specialty') {
                return this.renderSpecialtyCard(provider);
            }
        }).join('');
    }

    renderHospitalCard(hospital) {
        return `
            <div class="provider-card" data-provider-id="${hospital.id}">
                <div class="provider-header">
                    <img src="${hospital.image}" alt="${hospital.name}" class="provider-image">
                    <div class="provider-info">
                        <h3>${hospital.name}</h3>
                        <div class="provider-specialty">${hospital.specialty}</div>
                        <div class="provider-rating">
                            <div class="rating-stars">
                                ${'★'.repeat(Math.floor(hospital.rating))}${'☆'.repeat(5 - Math.floor(hospital.rating))}
                            </div>
                            <span>${hospital.rating} (${hospital.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                
                <div class="provider-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${hospital.address}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${hospital.phone}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-hospital"></i>
                        <span>${hospital.departments.join(', ')}</span>
                    </div>
                </div>
                
                <div class="provider-availability">
                    <div class="availability-title">
                        <i class="fas fa-clock"></i>
                        Available Time Slots
                    </div>
                    <div class="time-slots">
                        ${hospital.availability.today.map(time => 
                            `<div class="time-slot" onclick="selectTimeSlot('${hospital.id}', '${time}', 'today')">${time}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <button class="book-appointment-btn" onclick="bookAppointment('${hospital.id}')">
                    <i class="fas fa-calendar-plus"></i>
                    Book Appointment
                </button>
            </div>
        `;
    }

    renderDoctorCard(doctor) {
        return `
            <div class="provider-card" data-provider-id="${doctor.id}">
                <div class="provider-header">
                    <img src="${doctor.image}" alt="${doctor.name}" class="provider-image">
                    <div class="provider-info">
                        <h3>${doctor.name}</h3>
                        <div class="provider-specialty">${doctor.specialty}</div>
                        <div class="provider-rating">
                            <div class="rating-stars">
                                ${'★'.repeat(Math.floor(doctor.rating))}${'☆'.repeat(5 - Math.floor(doctor.rating))}
                            </div>
                            <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                
                <div class="provider-details">
                    <div class="detail-item">
                        <i class="fas fa-hospital"></i>
                        <span>${doctor.hospital}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${doctor.education}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${doctor.experience} experience</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Consultation: ${doctor.consultationFee}</span>
                    </div>
                </div>
                
                <div class="provider-availability">
                    <div class="availability-title">
                        <i class="fas fa-clock"></i>
                        Available Time Slots
                    </div>
                    <div class="time-slots">
                        ${doctor.availability.today.map(time => 
                            `<div class="time-slot" onclick="selectTimeSlot('${doctor.id}', '${time}', 'today')">${time}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <button class="book-appointment-btn" onclick="bookAppointment('${doctor.id}')">
                    <i class="fas fa-calendar-plus"></i>
                    Book Appointment
                </button>
            </div>
        `;
    }

    renderSpecialtyCard(specialty) {
        return `
            <div class="provider-card" data-provider-id="${specialty.id}">
                <div class="provider-header">
                    <img src="${specialty.image}" alt="${specialty.name}" class="provider-image">
                    <div class="provider-info">
                        <h3>${specialty.name}</h3>
                        <div class="provider-specialty">${specialty.description}</div>
                        <div class="provider-rating">
                            <div class="rating-stars">
                                ${'★'.repeat(Math.floor(specialty.avgRating))}${'☆'.repeat(5 - Math.floor(specialty.avgRating))}
                            </div>
                            <span>${specialty.avgRating} average rating</span>
                        </div>
                    </div>
                </div>
                
                <div class="provider-details">
                    <div class="detail-item">
                        <i class="fas fa-user-md"></i>
                        <span>${specialty.doctorCount} doctors available</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-hospital"></i>
                        <span>${specialty.hospitalCount} hospitals</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-list"></i>
                        <span>Treats: ${specialty.commonConditions.join(', ')}</span>
                    </div>
                </div>
                
                <button class="book-appointment-btn" onclick="findSpecialtyProviders('${specialty.id}')">
                    <i class="fas fa-search"></i>
                    Find ${specialty.name} Doctors
                </button>
            </div>
        `;
    }

    selectTimeSlot(providerId, time, day) {
        // Remove previous selections
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        
        // Select current slot
        event.target.classList.add('selected');
        
        this.selectedProvider = providerId;
        this.selectedTimeSlot = { time, day };
    }

    async bookAppointment(providerId) {
        if (!this.selectedTimeSlot) {
            this.showToast('Please select a time slot first', 'warning');
            return;
        }

        try {
            // Show booking modal
            this.showBookingModal(providerId);
        } catch (error) {
            console.error('Error booking appointment:', error);
            this.showToast('Failed to book appointment. Please try again.', 'error');
        }
    }

    showBookingModal(providerId) {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Confirm Appointment</h2>
                    <button class="close-btn" onclick="this.closest('.booking-modal').remove()">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="appointment-summary">
                        <h3>Appointment Details</h3>
                        <p><strong>Provider:</strong> ${providerId}</p>
                        <p><strong>Date:</strong> ${this.selectedTimeSlot.day === 'today' ? 'Today' : 'Tomorrow'}</p>
                        <p><strong>Time:</strong> ${this.selectedTimeSlot.time}</p>
                    </div>
                    
                    <form id="booking-form">
                        <div class="form-group">
                            <label>Reason for Visit</label>
                            <textarea name="reason" placeholder="Describe your symptoms or reason for visit..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Contact Number</label>
                            <input type="tel" name="phone" placeholder="Your phone number" required>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="terms" required>
                                I agree to the terms and conditions
                            </label>
                        </div>
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.booking-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="confirmBooking()">Confirm Booking</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async confirmBooking() {
        const form = document.getElementById('booking-form');
        const formData = new FormData(form);
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            // In production, save to Supabase
            const appointmentData = {
                user_id: this.currentUser.id,
                provider_id: this.selectedProvider,
                appointment_date: this.selectedTimeSlot.day === 'today' ? new Date() : new Date(Date.now() + 86400000),
                appointment_time: this.selectedTimeSlot.time,
                reason: formData.get('reason'),
                phone: formData.get('phone'),
                status: 'pending'
            };

            // Mock booking success
            await this.saveAppointment(appointmentData);
            
            this.showToast('Appointment booked successfully!', 'success');
            document.querySelector('.booking-modal').remove();
            
            // Refresh appointments list
            await this.loadUserAppointments();
            
        } catch (error) {
            console.error('Error confirming booking:', error);
            this.showToast('Failed to confirm booking. Please try again.', 'error');
        }
    }

    async saveAppointment(appointmentData) {
        // Mock save - in production, use Supabase
        console.log('Saving appointment:', appointmentData);
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async loadUserAppointments() {
        const container = document.getElementById('appointments-list');
        if (!container) return;

        try {
            // Mock appointments data - in production, fetch from Supabase
            const appointments = [
                {
                    id: 'apt-1',
                    provider_name: 'Dr. Sarah Johnson',
                    provider_specialty: 'Cardiologist',
                    date: '2024-01-15',
                    time: '10:30',
                    status: 'confirmed',
                    reason: 'Regular checkup'
                },
                {
                    id: 'apt-2',
                    provider_name: 'City General Hospital',
                    provider_specialty: 'Emergency Department',
                    date: '2024-01-20',
                    time: '14:00',
                    status: 'pending',
                    reason: 'Follow-up consultation'
                }
            ];

            this.renderAppointments(appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }

    renderAppointments(appointments) {
        const container = document.getElementById('appointments-list');
        if (!container) return;

        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No appointments found</h3>
                    <p>Book your first appointment to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = appointments.map(appointment => `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-info">
                        <h4>${appointment.provider_name}</h4>
                        <div class="appointment-datetime">
                            <span><i class="fas fa-calendar"></i> ${appointment.date}</span>
                            <span><i class="fas fa-clock"></i> ${appointment.time}</span>
                        </div>
                    </div>
                    <div class="appointment-status status-${appointment.status}">
                        ${appointment.status}
                    </div>
                </div>
                
                <p><strong>Specialty:</strong> ${appointment.provider_specialty}</p>
                <p><strong>Reason:</strong> ${appointment.reason}</p>
                
                <div class="appointment-actions">
                    <button class="action-btn btn-primary" onclick="viewAppointmentDetails('${appointment.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="action-btn btn-secondary" onclick="rescheduleAppointment('${appointment.id}')">
                        <i class="fas fa-calendar-alt"></i> Reschedule
                    </button>
                    <button class="action-btn btn-danger" onclick="cancelAppointment('${appointment.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `).join('');
    }

    performSearch() {
        const searchTerm = document.getElementById('search-input')?.value || '';
        const location = document.getElementById('location-filter')?.value || '';
        const specialty = document.getElementById('specialty-filter')?.value || '';
        const availability = document.getElementById('availability-filter')?.value || '';

        // Apply filters and reload providers
        this.loadProviders();
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Global functions for onclick handlers
window.switchTab = (tab) => bookingSystem.switchTab(tab);
window.selectTimeSlot = (providerId, time, day) => bookingSystem.selectTimeSlot(providerId, time, day);
window.bookAppointment = (providerId) => bookingSystem.bookAppointment(providerId);
window.confirmBooking = () => bookingSystem.confirmBooking();
window.performSearch = () => bookingSystem.performSearch();

// Initialize the booking system
let bookingSystem;
document.addEventListener('DOMContentLoaded', () => {
    bookingSystem = new AppointmentBookingSystem();
});

// Additional modal styles
const modalStyles = `
<style>
.booking-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    color: var(--text-dark);
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--text-gray);
}

.modal-body {
    padding: 2rem;
}

.appointment-summary {
    background: var(--bg-light);
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-dark);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--accent-light-gray);
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-blue);
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1rem 2rem 2rem;
    justify-content: flex-end;
}

.toast {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10001;
}

.toast.show {
    transform: translateX(0);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.toast-success {
    border-left: 4px solid var(--success-green);
}

.toast-error {
    border-left: 4px solid var(--soft-red);
}

.toast-warning {
    border-left: 4px solid #ffc107;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles); 