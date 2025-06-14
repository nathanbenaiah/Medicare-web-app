// Provider Appointment Management System
class ProviderAppointmentSystem {
    constructor() {
        this.supabase = null;
        this.currentProvider = null;
        this.appointments = [];
        this.availability = {};
        this.init();
    }

    async init() {
        await this.initSupabase();
        await this.loadCurrentProvider();
        this.setupEventListeners();
        await this.loadAppointments();
        await this.loadAvailability();
        this.updateStats();
        this.startRealTimeUpdates();
    }

    async initSupabase() {
        const supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4NzEsImV4cCI6MjA1MDU0ODg3MX0.wJJnhKBBtEWzKpOsIGCNJOGXNgKJSdyJzlJQhJJhJJQ';
        this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    }

    async loadCurrentProvider() {
        // Mock provider data - in production, get from auth
        this.currentProvider = {
            id: 'provider-123',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            hospital: 'City General Hospital',
            consultationFee: 150
        };
    }

    setupEventListeners() {
        // Real-time updates
        setInterval(() => {
            this.loadAppointments();
            this.updateStats();
        }, 30000); // Update every 30 seconds
    }

    async loadAppointments() {
        try {
            // Mock appointment data - in production, fetch from Supabase
            this.appointments = [
                {
                    id: 'apt-1',
                    patient_name: 'John Doe',
                    patient_email: 'john@example.com',
                    patient_phone: '+1 (555) 123-4567',
                    appointment_date: '2024-01-15',
                    appointment_time: '09:00',
                    status: 'confirmed',
                    reason: 'Regular checkup',
                    created_at: '2024-01-14T10:30:00Z',
                    patient_age: 35,
                    patient_gender: 'Male'
                },
                {
                    id: 'apt-2',
                    patient_name: 'Jane Smith',
                    patient_email: 'jane@example.com',
                    patient_phone: '+1 (555) 234-5678',
                    appointment_date: '2024-01-15',
                    appointment_time: '10:30',
                    status: 'pending',
                    reason: 'Chest pain consultation',
                    created_at: '2024-01-14T14:20:00Z',
                    patient_age: 42,
                    patient_gender: 'Female'
                },
                {
                    id: 'apt-3',
                    patient_name: 'Mike Johnson',
                    patient_email: 'mike@example.com',
                    patient_phone: '+1 (555) 345-6789',
                    appointment_date: '2024-01-15',
                    appointment_time: '14:00',
                    status: 'confirmed',
                    reason: 'Follow-up after surgery',
                    created_at: '2024-01-14T16:45:00Z',
                    patient_age: 58,
                    patient_gender: 'Male'
                }
            ];

            this.renderSchedule();
            this.renderBookings();
            this.renderPatientQueue();
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }

    renderSchedule() {
        const container = document.getElementById('schedule-container');
        if (!container) return;

        const todayAppointments = this.appointments.filter(apt => 
            apt.appointment_date === new Date().toISOString().split('T')[0]
        );

        if (todayAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-schedule">
                    <i class="fas fa-calendar-day"></i>
                    <h3>No appointments today</h3>
                    <p>Your schedule is clear for today</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="schedule-timeline">
                ${this.generateTimeSlots().map(timeSlot => {
                    const appointment = todayAppointments.find(apt => apt.appointment_time === timeSlot);
                    return `
                        <div class="time-slot ${appointment ? 'booked' : 'available'}" data-time="${timeSlot}">
                            <div class="time-label">${timeSlot}</div>
                            <div class="slot-content">
                                ${appointment ? this.renderAppointmentSlot(appointment) : this.renderAvailableSlot(timeSlot)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 17) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        return slots;
    }

    renderAppointmentSlot(appointment) {
        return `
            <div class="appointment-slot" onclick="viewAppointmentDetails('${appointment.id}')">
                <div class="patient-info">
                    <h4>${appointment.patient_name}</h4>
                    <p>${appointment.reason}</p>
                </div>
                <div class="appointment-status status-${appointment.status}">
                    ${appointment.status}
                </div>
            </div>
        `;
    }

    renderAvailableSlot(timeSlot) {
        return `
            <div class="available-slot" onclick="blockTimeSlot('${timeSlot}')">
                <i class="fas fa-plus"></i>
                <span>Available</span>
            </div>
        `;
    }

    renderBookings() {
        const container = document.getElementById('bookings-list');
        if (!container) return;

        const sortedBookings = [...this.appointments].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );

        container.innerHTML = sortedBookings.map(booking => `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div class="booking-header">
                    <div class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="booking-info">
                        <h4>${booking.patient_name}</h4>
                        <p class="booking-time">
                            <i class="fas fa-calendar"></i> ${booking.appointment_date}
                            <i class="fas fa-clock"></i> ${booking.appointment_time}
                        </p>
                    </div>
                    <div class="booking-status status-${booking.status}">
                        ${booking.status}
                    </div>
                </div>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <span class="detail-label">Reason:</span>
                        <span class="detail-value">${booking.reason}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Contact:</span>
                        <span class="detail-value">${booking.patient_phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Age/Gender:</span>
                        <span class="detail-value">${booking.patient_age} years, ${booking.patient_gender}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Booked:</span>
                        <span class="detail-value">${this.formatDateTime(booking.created_at)}</span>
                    </div>
                </div>
                
                <div class="booking-actions">
                    ${booking.status === 'pending' ? `
                        <button class="action-btn btn-success" onclick="confirmAppointment('${booking.id}')">
                            <i class="fas fa-check"></i> Confirm
                        </button>
                        <button class="action-btn btn-warning" onclick="rescheduleAppointment('${booking.id}')">
                            <i class="fas fa-calendar-alt"></i> Reschedule
                        </button>
                    ` : ''}
                    <button class="action-btn btn-primary" onclick="viewPatientDetails('${booking.id}')">
                        <i class="fas fa-user"></i> Patient Details
                    </button>
                    <button class="action-btn btn-secondary" onclick="sendMessage('${booking.id}')">
                        <i class="fas fa-message"></i> Message
                    </button>
                    <button class="action-btn btn-danger" onclick="cancelAppointment('${booking.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPatientQueue() {
        const container = document.getElementById('patient-queue');
        if (!container) return;

        const todayAppointments = this.appointments.filter(apt => 
            apt.appointment_date === new Date().toISOString().split('T')[0] &&
            apt.status === 'confirmed'
        ).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

        if (todayAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-queue">
                    <i class="fas fa-users"></i>
                    <p>No patients in queue</p>
                </div>
            `;
            return;
        }

        container.innerHTML = todayAppointments.map((appointment, index) => `
            <div class="queue-item" data-appointment-id="${appointment.id}">
                <div class="queue-number">${index + 1}</div>
                <div class="queue-info">
                    <h5>${appointment.patient_name}</h5>
                    <p>${appointment.appointment_time}</p>
                </div>
                <div class="queue-actions">
                    <button class="queue-btn" onclick="callPatient('${appointment.id}')">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="queue-btn" onclick="markAsArrived('${appointment.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadAvailability() {
        const container = document.getElementById('availability-manager');
        if (!container) return;

        // Mock availability data
        this.availability = {
            monday: { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
            tuesday: { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
            wednesday: { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
            thursday: { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
            friday: { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
            saturday: { start: '10:00', end: '14:00', breaks: [] },
            sunday: { start: 'closed', end: 'closed', breaks: [] }
        };

        container.innerHTML = `
            <div class="availability-settings">
                ${Object.entries(this.availability).map(([day, schedule]) => `
                    <div class="day-schedule">
                        <div class="day-label">${day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        <div class="schedule-inputs">
                            ${schedule.start === 'closed' ? `
                                <span class="closed-day">Closed</span>
                                <button class="btn-small" onclick="openDay('${day}')">Open</button>
                            ` : `
                                <input type="time" value="${schedule.start}" onchange="updateSchedule('${day}', 'start', this.value)">
                                <span>to</span>
                                <input type="time" value="${schedule.end}" onchange="updateSchedule('${day}', 'end', this.value)">
                                <button class="btn-small" onclick="closeDay('${day}')">Close</button>
                            `}
                        </div>
                    </div>
                `).join('')}
                
                <div class="availability-actions">
                    <button class="btn-primary" onclick="saveAvailability()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button class="btn-secondary" onclick="setEmergencyAvailability()">
                        <i class="fas fa-exclamation-triangle"></i> Emergency Hours
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(apt => apt.appointment_date === today);
        
        const totalAppointments = todayAppointments.length;
        const completedAppointments = todayAppointments.filter(apt => apt.status === 'completed').length;
        const pendingAppointments = todayAppointments.filter(apt => apt.status === 'pending').length;
        const revenue = completedAppointments * this.currentProvider.consultationFee;

        document.getElementById('total-appointments').textContent = totalAppointments;
        document.getElementById('completed-appointments').textContent = completedAppointments;
        document.getElementById('pending-appointments').textContent = pendingAppointments;
        document.getElementById('revenue-today').textContent = `$${revenue}`;

        // Update hero stats
        document.getElementById('today-appointments').textContent = totalAppointments;
        document.getElementById('waiting-patients').textContent = todayAppointments.filter(apt => apt.status === 'confirmed').length;
        document.getElementById('completed-today').textContent = completedAppointments;
        document.getElementById('revenue-today').textContent = `$${revenue}`;
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.simulateNewBooking();
        }, 60000); // Every minute for demo
    }

    simulateNewBooking() {
        // Simulate a new booking notification
        const newBooking = {
            id: `apt-${Date.now()}`,
            patient_name: 'New Patient',
            patient_email: 'newpatient@example.com',
            patient_phone: '+1 (555) 999-0000',
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: '16:00',
            status: 'pending',
            reason: 'New consultation',
            created_at: new Date().toISOString(),
            patient_age: 30,
            patient_gender: 'Unknown'
        };

        this.showNotification('New appointment booking received!', 'info');
        // In production, this would come from Supabase real-time subscriptions
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Appointment management methods
    async confirmAppointment(appointmentId) {
        try {
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'confirmed';
                this.renderBookings();
                this.renderSchedule();
                this.updateStats();
                this.showNotification('Appointment confirmed successfully!', 'success');
            }
        } catch (error) {
            console.error('Error confirming appointment:', error);
            this.showNotification('Failed to confirm appointment', 'error');
        }
    }

    async cancelAppointment(appointmentId) {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'cancelled';
                this.renderBookings();
                this.renderSchedule();
                this.updateStats();
                this.showNotification('Appointment cancelled', 'info');
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            this.showNotification('Failed to cancel appointment', 'error');
        }
    }

    filterBookings() {
        const filter = document.getElementById('booking-status-filter').value;
        const bookingCards = document.querySelectorAll('.booking-card');
        
        bookingCards.forEach(card => {
            const bookingId = card.dataset.bookingId;
            const appointment = this.appointments.find(apt => apt.id === bookingId);
            
            if (filter === 'all' || appointment.status === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Global functions for onclick handlers
window.confirmAppointment = (id) => providerSystem.confirmAppointment(id);
window.cancelAppointment = (id) => providerSystem.cancelAppointment(id);
window.filterBookings = () => providerSystem.filterBookings();
window.viewAppointmentDetails = (id) => console.log('View appointment:', id);
window.viewPatientDetails = (id) => console.log('View patient:', id);
window.sendMessage = (id) => console.log('Send message to:', id);
window.rescheduleAppointment = (id) => console.log('Reschedule:', id);
window.callPatient = (id) => console.log('Call patient:', id);
window.markAsArrived = (id) => console.log('Mark as arrived:', id);
window.blockTimeSlot = (time) => console.log('Block time slot:', time);
window.manageAvailability = () => console.log('Manage availability');
window.addAppointment = () => console.log('Add appointment');

// Initialize the provider system
let providerSystem;
document.addEventListener('DOMContentLoaded', () => {
    providerSystem = new ProviderAppointmentSystem();
});

// Additional styles for provider interface
const providerStyles = `
<style>
.schedule-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.time-slot {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 10px;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.time-slot.booked {
    border-color: var(--primary-blue);
    background: rgba(0, 123, 255, 0.05);
}

.time-slot.available {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.05);
}

.time-label {
    width: 80px;
    font-weight: 600;
    color: var(--text-gray);
}

.slot-content {
    flex: 1;
}

.appointment-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.appointment-slot:hover {
    background: rgba(0, 123, 255, 0.1);
}

.patient-info h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
}

.patient-info p {
    margin: 0;
    color: var(--text-gray);
    font-size: 0.9rem;
}

.available-slot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #28a745;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.available-slot:hover {
    background: rgba(40, 167, 69, 0.1);
}

.booking-card {
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.booking-card:hover {
    transform: translateY(-2px);
}

.booking-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.patient-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.booking-info {
    flex: 1;
}

.booking-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.booking-time {
    margin: 0;
    color: var(--text-gray);
    font-size: 0.9rem;
}

.booking-time i {
    margin-right: 0.5rem;
}

.booking-details {
    margin-bottom: 1rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.detail-label {
    font-weight: 600;
    color: var(--text-gray);
}

.detail-value {
    color: var(--text-dark);
}

.booking-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.btn-success {
    background: #28a745;
    color: white;
}

.btn-warning {
    background: #ffc107;
    color: #212529;
}

.queue-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 10px;
    background: white;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.queue-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--primary-blue);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.queue-info {
    flex: 1;
}

.queue-info h5 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
}

.queue-info p {
    margin: 0;
    color: var(--text-gray);
    font-size: 0.8rem;
}

.queue-actions {
    display: flex;
    gap: 0.5rem;
}

.queue-btn {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 50%;
    background: var(--accent-light-gray);
    color: var(--text-gray);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.queue-btn:hover {
    background: var(--primary-blue);
    color: white;
}

.stats-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    background: var(--bg-light);
    border-radius: 10px;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.8rem;
    color: var(--text-gray);
    font-weight: 600;
}

.availability-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.day-schedule {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--bg-light);
    border-radius: 10px;
}

.day-label {
    font-weight: 600;
    min-width: 80px;
}

.schedule-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.schedule-inputs input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9rem;
}

.btn-small {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    border: none;
    border-radius: 5px;
    background: var(--primary-blue);
    color: white;
    cursor: pointer;
}

.closed-day {
    color: var(--text-gray);
    font-style: italic;
}

.notification {
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
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.notification-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-gray);
}

.empty-schedule,
.empty-queue {
    text-align: center;
    padding: 2rem;
    color: var(--text-gray);
}

.empty-schedule i,
.empty-queue i {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', providerStyles); 