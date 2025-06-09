// Dashboard initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
});

// Initialize dashboard
async function initializeDashboard() {
    try {
        // Load user data
        const { user } = await API.getCurrentUser();
        updateUserInfo(user);

        // Initialize notifications
        await notificationManager.checkPermission();

        // Load dashboard data
        await Promise.all([
            loadTodayReminders(),
            loadUpcomingAppointments(),
            loadFamilyActivity(),
            updateQuickStats()
        ]);

        // Update current date
        updateCurrentDate();
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        // Handle error (show error message to user)
    }
}

// Update user information
function updateUserInfo(user) {
    document.getElementById('userPhoto').src = user.photoURL || '/images/default-avatar.png';
    document.getElementById('userName').textContent = user.displayName;
    document.getElementById('welcomeName').textContent = user.displayName.split(' ')[0];
}

// Update current date display
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = currentDate;
}

// Load today's reminders
async function loadTodayReminders() {
    try {
        const reminders = await API.getUpcomingReminders(1);
        const container = document.getElementById('todayReminders');
        
        if (reminders.length === 0) {
            container.innerHTML = '<p class="no-data">No reminders for today</p>';
            return;
        }

        container.innerHTML = reminders.map(reminder => `
            <div class="list-item" data-id="${reminder._id}">
                <div class="list-item-icon">
                    <i class="bx ${reminder.type === 'medication' ? 'bx-capsule' : 'bx-calendar'}"></i>
                </div>
                <div class="list-item-content">
                    <div class="list-item-title">${reminder.title}</div>
                    <div class="list-item-subtitle">
                        ${formatTime(reminder.schedule.times[0])}
                        ${reminder.medication ? `- ${reminder.medication.dosage}` : ''}
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon" onclick="markReminderComplete('${reminder._id}')">
                        <i class="bx bx-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load reminders:', error);
    }
}

// Load upcoming appointments
async function loadUpcomingAppointments() {
    try {
        const appointments = await API.getUpcomingAppointments(7);
        const container = document.getElementById('upcomingAppointments');
        
        if (appointments.length === 0) {
            container.innerHTML = '<p class="no-data">No upcoming appointments</p>';
            return;
        }

        container.innerHTML = appointments.map(appointment => `
            <div class="list-item" data-id="${appointment._id}">
                <div class="list-item-icon">
                    <i class="bx bx-calendar-check"></i>
                </div>
                <div class="list-item-content">
                    <div class="list-item-title">${appointment.title}</div>
                    <div class="list-item-subtitle">
                        ${formatDateTime(appointment.dateTime)} with Dr. ${appointment.doctor.name}
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon" onclick="editAppointment('${appointment._id}')">
                        <i class="bx bx-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load appointments:', error);
    }
}

// Load family activity
async function loadFamilyActivity() {
    try {
        const familyMembers = await API.getFamilyMembers();
        const container = document.getElementById('familyActivity');
        
        if (familyMembers.length === 0) {
            container.innerHTML = '<p class="no-data">No family members added yet</p>';
            return;
        }

        container.innerHTML = familyMembers.map(member => `
            <div class="list-item" data-id="${member._id}">
                <div class="list-item-icon">
                    <img src="${member.photoURL || '/images/default-avatar.png'}" alt="${member.displayName}">
                </div>
                <div class="list-item-content">
                    <div class="list-item-title">${member.displayName}</div>
                    <div class="list-item-subtitle">
                        ${member.activeReminders || 0} active reminders
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon" onclick="viewFamilyMember('${member._id}')">
                        <i class="bx bx-chevron-right"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load family activity:', error);
    }
}

// Update quick stats
async function updateQuickStats() {
    try {
        const [reminders, appointments, familyMembers] = await Promise.all([
            API.getReminders(),
            API.getAppointments(),
            API.getFamilyMembers()
        ]);

        const activeMedications = reminders.filter(r => 
            r.type === 'medication' && r.status === 'active'
        ).length;

        const upcomingAppointments = appointments.filter(a => 
            new Date(a.dateTime) > new Date() && a.status === 'scheduled'
        ).length;

        document.getElementById('activeMedications').textContent = activeMedications;
        document.getElementById('upcomingAppointmentsCount').textContent = upcomingAppointments;
        document.getElementById('familyMembersCount').textContent = familyMembers.length;
        document.getElementById('activeRemindersCount').textContent = 
            reminders.filter(r => r.status === 'active').length;
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

// Modal handling
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Action handlers
function showAddReminderModal() {
    // Implement reminder form HTML
    const modal = document.getElementById('addReminderModal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Medication Reminder</h2>
            <form id="reminderForm" onsubmit="handleAddReminder(event)">
                <!-- Form fields will be added here -->
            </form>
        </div>
    `;
    showModal('addReminderModal');
}

function showAddAppointmentModal() {
    // Implement appointment form HTML
    const modal = document.getElementById('addAppointmentModal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Book Appointment</h2>
            <form id="appointmentForm" onsubmit="handleAddAppointment(event)">
                <!-- Form fields will be added here -->
            </form>
        </div>
    `;
    showModal('addAppointmentModal');
}

function showAddFamilyModal() {
    // Implement family member form HTML
    const modal = document.getElementById('addFamilyModal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Family Member</h2>
            <form id="familyForm" onsubmit="handleAddFamilyMember(event)">
                <!-- Form fields will be added here -->
            </form>
        </div>
    `;
    showModal('addFamilyModal');
}

// Event handlers
async function handleAddReminder(event) {
    event.preventDefault();
    // Implement reminder creation logic
}

async function handleAddAppointment(event) {
    event.preventDefault();
    // Implement appointment creation logic
}

async function handleAddFamilyMember(event) {
    event.preventDefault();
    // Implement family member addition logic
}

async function markReminderComplete(reminderId) {
    try {
        await API.updateReminder(reminderId, { status: 'completed' });
        await loadTodayReminders();
        await updateQuickStats();
    } catch (error) {
        console.error('Failed to mark reminder complete:', error);
    }
}

async function handleLogout() {
    try {
        await API.signout();
        window.location.href = '/';
    } catch (error) {
        console.error('Failed to log out:', error);
    }
}

// Utility functions
function formatTime(time) {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Event listeners
function setupEventListeners() {
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Refresh data periodically
    setInterval(() => {
        loadTodayReminders();
        updateQuickStats();
    }, 5 * 60 * 1000); // Refresh every 5 minutes
}

// Initialize dashboard when the page loads
window.addEventListener('load', initializeDashboard); 