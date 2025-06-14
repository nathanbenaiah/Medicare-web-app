// User Appointments JavaScript
// Supabase Configuration
const SUPABASE_URL = 'https://gcggnrwqilylyykppizb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzE4NzEsImV4cCI6MjA1MDEwNzg3MX0.4_8nOLLaLdtaUNJhJNhWJhJhJNhWJhJhJNhWJhJhJNhW';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let appointments = [];
let currentFilter = 'all';

// Initialize the appointments page
async function initializeAppointmentsPage() {
    try {
        showLoading(true);
        
        // Get current user (demo user for now)
        currentUser = {
            id: 'demo-user-001',
            name: 'John Doe',
            email: 'john.doe@example.com'
        };
        
        // Load appointments
        await loadAppointments();
        
        // Set up real-time subscriptions
        setupRealtimeSubscriptions();
        
        showLoading(false);
    } catch (error) {
        console.error('Error initializing appointments page:', error);
        showToast('Error loading appointments', 'error');
        showLoading(false);
    }
}

// Load appointments from database
async function loadAppointments() {
    try {
        // For demo purposes, we'll use mock data
        // In production, this would fetch from Supabase
        appointments = [
            {
                id: 1,
                patient_id: currentUser.id,
                provider_name: 'Dr. Sarah Johnson',
                appointment_type: 'General Checkup',
                appointment_date: '2024-01-15',
                appointment_time: '10:00 AM',
                location: 'MediCare+ Clinic - Room 201',
                status: 'confirmed',
                notes: 'Annual physical examination'
            },
            {
                id: 2,
                patient_id: currentUser.id,
                provider_name: 'Dr. Michael Chen',
                appointment_type: 'Cardiology Consultation',
                appointment_date: '2024-01-18',
                appointment_time: '2:30 PM',
                location: 'Heart Center - Suite 305',
                status: 'scheduled',
                notes: 'Follow-up for blood pressure monitoring'
            },
            {
                id: 3,
                patient_id: currentUser.id,
                provider_name: 'Dr. Emily Rodriguez',
                appointment_type: 'Dermatology',
                appointment_date: '2024-01-12',
                appointment_time: '11:15 AM',
                location: 'Skin Care Center',
                status: 'completed',
                notes: 'Skin cancer screening completed'
            },
            {
                id: 4,
                patient_id: currentUser.id,
                provider_name: 'Dr. James Wilson',
                appointment_type: 'Orthopedic Consultation',
                appointment_date: '2024-01-20',
                appointment_time: '9:00 AM',
                location: 'Orthopedic Center',
                status: 'scheduled',
                notes: 'Knee pain evaluation'
            },
            {
                id: 5,
                patient_id: currentUser.id,
                provider_name: 'Dr. Lisa Thompson',
                appointment_type: 'Dental Cleaning',
                appointment_date: '2024-01-10',
                appointment_time: '3:00 PM',
                location: 'Dental Office',
                status: 'cancelled',
                notes: 'Cancelled due to emergency'
            }
        ];
        
        renderAppointments();
    } catch (error) {
        console.error('Error loading appointments:', error);
        showToast('Error loading appointments', 'error');
    }
}

// Render appointments based on current filter
function renderAppointments() {
    const container = document.getElementById('appointments-container');
    const filteredAppointments = filterAppointments(appointments, currentFilter);
    
    if (filteredAppointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No appointments found</h3>
                <p>You don't have any appointments matching the selected filter.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredAppointments.map(appointment => `
        <div class="appointment-card" data-aos="fade-up">
            <div class="appointment-header">
                <div class="appointment-date">
                    <div class="date-circle">
                        <span class="date-day">${formatDay(appointment.appointment_date)}</span>
                        <span class="date-month">${formatMonth(appointment.appointment_date)}</span>
                    </div>
                    <div>
                        <div class="appointment-time">${appointment.appointment_time}</div>
                        <div class="status-badge status-${appointment.status}">${appointment.status}</div>
                    </div>
                </div>
            </div>
            
            <div class="appointment-details">
                <h3 class="appointment-title">${appointment.appointment_type}</h3>
                <div class="appointment-provider">
                    <i class="fas fa-user-md"></i>
                    ${appointment.provider_name}
                </div>
                <div class="appointment-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${appointment.location}
                </div>
                ${appointment.notes ? `<p style="margin-top: 0.5rem; color: var(--text-gray); font-size: 0.9rem;">${appointment.notes}</p>` : ''}
            </div>
            
            <div class="appointment-actions">
                ${getAppointmentActions(appointment)}
            </div>
        </div>
    `).join('');
}

// Get appointment actions based on status
function getAppointmentActions(appointment) {
    const actions = [];
    
    switch (appointment.status) {
        case 'scheduled':
        case 'confirmed':
            actions.push(`
                <button class="action-btn btn-primary" onclick="joinAppointment(${appointment.id})">
                    <i class="fas fa-video"></i> Join Call
                </button>
                <button class="action-btn btn-secondary" onclick="rescheduleAppointment(${appointment.id})">
                    <i class="fas fa-calendar-alt"></i> Reschedule
                </button>
                <button class="action-btn btn-danger" onclick="cancelAppointment(${appointment.id})">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `);
            break;
        case 'completed':
            actions.push(`
                <button class="action-btn btn-secondary" onclick="viewAppointmentSummary(${appointment.id})">
                    <i class="fas fa-file-alt"></i> View Summary
                </button>
                <button class="action-btn btn-primary" onclick="bookFollowUp(${appointment.id})">
                    <i class="fas fa-plus"></i> Book Follow-up
                </button>
            `);
            break;
        case 'cancelled':
            actions.push(`
                <button class="action-btn btn-primary" onclick="rebookAppointment(${appointment.id})">
                    <i class="fas fa-redo"></i> Rebook
                </button>
            `);
            break;
    }
    
    return actions.join('');
}

// Filter appointments
function filterAppointments(appointments, filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
        case 'upcoming':
            return appointments.filter(apt => {
                const aptDate = new Date(apt.appointment_date);
                return aptDate >= today && apt.status !== 'cancelled' && apt.status !== 'completed';
            });
        case 'today':
            return appointments.filter(apt => {
                const aptDate = new Date(apt.appointment_date);
                return aptDate.toDateString() === today.toDateString();
            });
        case 'past':
            return appointments.filter(apt => {
                const aptDate = new Date(apt.appointment_date);
                return aptDate < today || apt.status === 'completed';
            });
        case 'cancelled':
            return appointments.filter(apt => apt.status === 'cancelled');
        default:
            return appointments;
    }
}

// Filter appointments by category
function filterAppointments(category) {
    currentFilter = category;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderAppointments();
}

// Appointment actions
function joinAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        showToast(`Joining video call with ${appointment.provider_name}...`, 'success');
        // In production, this would open the video call interface
        setTimeout(() => {
            window.open('https://meet.google.com/demo-appointment-call', '_blank');
        }, 1000);
    }
}

function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        showToast(`Opening reschedule options for ${appointment.appointment_type}...`, 'info');
        // In production, this would open a reschedule modal
    }
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'cancelled';
            renderAppointments();
            showToast('Appointment cancelled successfully', 'success');
        }
    }
}

function viewAppointmentSummary(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        showToast(`Loading summary for ${appointment.appointment_type}...`, 'info');
        // In production, this would open the appointment summary
    }
}

function bookFollowUp(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        showToast(`Booking follow-up with ${appointment.provider_name}...`, 'info');
        // In production, this would open the booking interface
    }
}

function rebookAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        appointment.status = 'scheduled';
        renderAppointments();
        showToast('Appointment rebooked successfully', 'success');
    }
}

// Booking modal functions
function openBookingModal() {
    showToast('Opening appointment booking...', 'info');
    // In production, this would open a comprehensive booking modal
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Calendar sync
function syncCalendar() {
    showToast('Syncing with your calendar...', 'info');
    setTimeout(() => {
        showToast('Calendar sync completed!', 'success');
    }, 2000);
}

// Export appointments
function exportAppointments() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Time,Provider,Type,Location,Status\n"
        + appointments.map(apt => 
            `${apt.appointment_date},${apt.appointment_time},${apt.provider_name},${apt.appointment_type},${apt.location},${apt.status}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Appointments exported successfully!', 'success');
}

// Setup real-time subscriptions
function setupRealtimeSubscriptions() {
    // In production, this would set up real-time subscriptions to Supabase
    console.log('Setting up real-time subscriptions for appointments...');
}

// Utility functions
function formatDay(dateString) {
    const date = new Date(dateString);
    return date.getDate().toString().padStart(2, '0');
}

function formatMonth(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast toast-${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Export functions for global access
window.initializeAppointmentsPage = initializeAppointmentsPage;
window.filterAppointments = filterAppointments;
window.joinAppointment = joinAppointment;
window.rescheduleAppointment = rescheduleAppointment;
window.cancelAppointment = cancelAppointment;
window.viewAppointmentSummary = viewAppointmentSummary;
window.bookFollowUp = bookFollowUp;
window.rebookAppointment = rebookAppointment;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.syncCalendar = syncCalendar;
window.exportAppointments = exportAppointments; 