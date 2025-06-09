// Appointments Management
class AppointmentsManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentUser = null
        this.appointments = []
        this.init()
    }

    async init() {
        // Wait for auth to be ready
        const user = await window.supabaseUtils.getCurrentUser()
        if (user) {
            this.currentUser = user
            await this.loadAppointments()
        }
    }

    // Load all appointments for the current user
    async loadAppointments() {
        try {
            if (!this.currentUser) {
                console.log('No user logged in')
                return []
            }

            const { data, error } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('appointment_date', { ascending: true })

            if (error) {
                console.error('Error loading appointments:', error)
                this.showError('Failed to load appointments')
                return []
            }

            this.appointments = data || []
            this.renderAppointments()
            return this.appointments
        } catch (error) {
            console.error('Error loading appointments:', error)
            this.showError('An unexpected error occurred while loading appointments')
            return []
        }
    }

    // Book new appointment
    async bookAppointment(appointmentData) {
        try {
            if (!this.currentUser) {
                this.showError('Please sign in to book appointments')
                return false
            }

            const { data, error } = await this.supabase
                .from('appointments')
                .insert([{
                    user_id: this.currentUser.id,
                    doctor_name: appointmentData.doctorName,
                    specialty: appointmentData.specialty,
                    hospital_clinic: appointmentData.hospitalClinic,
                    appointment_date: appointmentData.appointmentDate,
                    appointment_time: appointmentData.appointmentTime,
                    reason: appointmentData.reason,
                    notes: appointmentData.notes || '',
                    status: 'scheduled',
                    created_at: new Date().toISOString()
                }])
                .select()

            if (error) {
                console.error('Error booking appointment:', error)
                this.showError('Failed to book appointment')
                return false
            }

            // Add to local array
            this.appointments.push(data[0])
            this.renderAppointments()
            this.showSuccess('Appointment booked successfully!')
            return true
        } catch (error) {
            console.error('Error booking appointment:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Update appointment
    async updateAppointment(id, updates) {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .update(updates)
                .eq('id', id)
                .eq('user_id', this.currentUser.id)
                .select()

            if (error) {
                console.error('Error updating appointment:', error)
                this.showError('Failed to update appointment')
                return false
            }

            // Update local array
            const index = this.appointments.findIndex(a => a.id === id)
            if (index !== -1) {
                this.appointments[index] = { ...this.appointments[index], ...updates }
                this.renderAppointments()
            }

            this.showSuccess('Appointment updated successfully!')
            return true
        } catch (error) {
            console.error('Error updating appointment:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Cancel appointment
    async cancelAppointment(id) {
        try {
            const { error } = await this.supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', id)
                .eq('user_id', this.currentUser.id)

            if (error) {
                console.error('Error cancelling appointment:', error)
                this.showError('Failed to cancel appointment')
                return false
            }

            // Update local array
            const index = this.appointments.findIndex(a => a.id === id)
            if (index !== -1) {
                this.appointments[index].status = 'cancelled'
                this.renderAppointments()
            }

            this.showSuccess('Appointment cancelled successfully!')
            return true
        } catch (error) {
            console.error('Error cancelling appointment:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Complete appointment
    async completeAppointment(id) {
        try {
            const { error } = await this.supabase
                .from('appointments')
                .update({ 
                    status: 'completed',
                    completed_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', this.currentUser.id)

            if (error) {
                console.error('Error completing appointment:', error)
                this.showError('Failed to mark appointment as completed')
                return false
            }

            // Update local array
            const index = this.appointments.findIndex(a => a.id === id)
            if (index !== -1) {
                this.appointments[index].status = 'completed'
                this.appointments[index].completed_at = new Date().toISOString()
                this.renderAppointments()
            }

            this.showSuccess('Appointment marked as completed!')
            return true
        } catch (error) {
            console.error('Error completing appointment:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Get upcoming appointments
    getUpcomingAppointments() {
        const now = new Date()
        return this.appointments.filter(appointment => {
            if (appointment.status === 'cancelled' || appointment.status === 'completed') {
                return false
            }
            
            const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`)
            return appointmentDateTime >= now
        }).sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`)
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`)
            return dateA - dateB
        })
    }

    // Get today's appointments
    getTodaysAppointments() {
        const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD format
        return this.appointments.filter(appointment => {
            return appointment.appointment_date === today && 
                   appointment.status !== 'cancelled'
        })
    }

    // Render appointments to UI
    renderAppointments() {
        const container = document.getElementById('appointments-container')
        if (!container) return

        if (this.appointments.length === 0) {
            container.innerHTML = `
                <div class="no-appointments">
                    <i class="bx bx-calendar-x"></i>
                    <h3>No Appointments Yet</h3>
                    <p>Book your first appointment to get started!</p>
                    <button class="btn-primary" onclick="showBookAppointmentModal()">
                        <i class="bx bx-plus"></i> Book Appointment
                    </button>
                </div>
            `
            return
        }

        // Group appointments by status
        const upcoming = this.getUpcomingAppointments()
        const completed = this.appointments.filter(a => a.status === 'completed')
        const cancelled = this.appointments.filter(a => a.status === 'cancelled')

        let appointmentsHTML = ''

        // Upcoming appointments
        if (upcoming.length > 0) {
            appointmentsHTML += `
                <div class="appointments-section">
                    <h3><i class="bx bx-calendar-plus"></i> Upcoming Appointments</h3>
                    <div class="appointments-grid">
                        ${upcoming.map(appointment => this.renderAppointmentCard(appointment)).join('')}
                    </div>
                </div>
            `
        }

        // Completed appointments
        if (completed.length > 0) {
            appointmentsHTML += `
                <div class="appointments-section">
                    <h3><i class="bx bx-calendar-check"></i> Completed Appointments</h3>
                    <div class="appointments-grid">
                        ${completed.map(appointment => this.renderAppointmentCard(appointment)).join('')}
                    </div>
                </div>
            `
        }

        // Cancelled appointments
        if (cancelled.length > 0) {
            appointmentsHTML += `
                <div class="appointments-section">
                    <h3><i class="bx bx-calendar-x"></i> Cancelled Appointments</h3>
                    <div class="appointments-grid">
                        ${cancelled.map(appointment => this.renderAppointmentCard(appointment)).join('')}
                    </div>
                </div>
            `
        }

        container.innerHTML = appointmentsHTML
    }

    // Render individual appointment card
    renderAppointmentCard(appointment) {
        const statusClass = `status-${appointment.status}`
        const statusIcon = {
            'scheduled': 'bx-calendar-check',
            'completed': 'bx-check-circle',
            'cancelled': 'bx-x-circle'
        }[appointment.status] || 'bx-calendar'

        return `
            <div class="appointment-card ${statusClass}" data-id="${appointment.id}">
                <div class="appointment-header">
                    <div class="appointment-status">
                        <i class="bx ${statusIcon}"></i>
                        <span class="status-text">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                    </div>
                    <div class="appointment-date">
                        ${this.formatDate(appointment.appointment_date)}
                    </div>
                </div>
                
                <div class="appointment-details">
                    <h4>${appointment.doctor_name}</h4>
                    <p class="specialty">${appointment.specialty}</p>
                    <p class="location">
                        <i class="bx bx-location-plus"></i>
                        ${appointment.hospital_clinic}
                    </p>
                    <p class="time">
                        <i class="bx bx-time"></i>
                        ${this.formatTime(appointment.appointment_time)}
                    </p>
                    <p class="reason">
                        <i class="bx bx-note"></i>
                        ${appointment.reason}
                    </p>
                    ${appointment.notes ? `<p class="notes">${appointment.notes}</p>` : ''}
                </div>
                
                <div class="appointment-actions">
                    ${appointment.status === 'scheduled' ? `
                        <button class="btn-complete" onclick="appointmentsManager.completeAppointment(${appointment.id})">
                            <i class="bx bx-check"></i> Complete
                        </button>
                        <button class="btn-edit" onclick="editAppointment(${appointment.id})">
                            <i class="bx bx-edit"></i> Edit
                        </button>
                        <button class="btn-cancel" onclick="appointmentsManager.cancelAppointment(${appointment.id})">
                            <i class="bx bx-x"></i> Cancel
                        </button>
                    ` : appointment.status === 'cancelled' ? `
                        <button class="btn-rebook" onclick="rebookAppointment(${appointment.id})">
                            <i class="bx bx-refresh"></i> Rebook
                        </button>
                    ` : ''}
                </div>
            </div>
        `
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return 'No date set'
        
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', { 
                weekday: 'short',
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })
        } catch (error) {
            return dateString
        }
    }

    // Format time for display
    formatTime(timeString) {
        if (!timeString) return 'No time set'
        
        try {
            const [hours, minutes] = timeString.split(':')
            const date = new Date()
            date.setHours(parseInt(hours), parseInt(minutes))
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })
        } catch (error) {
            return timeString
        }
    }

    // Show notification
    showError(message) {
        this.showNotification(message, 'error')
    }

    showSuccess(message) {
        this.showNotification(message, 'success')
    }

    showNotification(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showNotification(message, type)
        } else {
            console.log(`${type.toUpperCase()}: ${message}`)
        }
    }
}

// Initialize appointments manager
const appointmentsManager = new AppointmentsManager()

// Global functions for HTML
window.appointmentsManager = appointmentsManager

// Form submission handler
window.handleAppointmentForm = async (event) => {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const appointmentData = {
        doctorName: formData.get('doctorName'),
        specialty: formData.get('specialty'),
        hospitalClinic: formData.get('hospitalClinic'),
        appointmentDate: formData.get('appointmentDate'),
        appointmentTime: formData.get('appointmentTime'),
        reason: formData.get('reason'),
        notes: formData.get('notes')
    }
    
    const success = await appointmentsManager.bookAppointment(appointmentData)
    if (success) {
        event.target.reset()
        // Close modal if exists
        const modal = document.getElementById('bookAppointmentModal')
        if (modal) modal.style.display = 'none'
    }
} 