// User Reminders JavaScript
// Supabase Configuration
const SUPABASE_URL = 'https://gcggnrwqilylyykppizb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzE4NzEsImV4cCI6MjA1MDEwNzg3MX0.4_8nOLLaLdtaUNJhJNhWJhJhJNhWJhJhJNhWJhJhJNhW';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let reminders = {
    medication: [],
    appointment: [],
    checkup: []
};

// Initialize the reminders page
async function initializeRemindersPage() {
    try {
        showLoading(true);
        
        // Get current user (demo user for now)
        currentUser = {
            id: 'demo-user-001',
            name: 'John Doe',
            email: 'john.doe@example.com'
        };
        
        // Load reminders
        await loadReminders();
        
        // Update statistics
        updateReminderStats();
        
        // Set up real-time subscriptions
        setupRealtimeSubscriptions();
        
        showLoading(false);
    } catch (error) {
        console.error('Error initializing reminders page:', error);
        showToast('Error loading reminders', 'error');
        showLoading(false);
    }
}

// Load reminders from database
async function loadReminders() {
    try {
        // For demo purposes, we'll use mock data
        // In production, this would fetch from Supabase
        reminders = {
            medication: [
                {
                    id: 1,
                    title: 'Take Lisinopril',
                    description: '10mg tablet for blood pressure',
                    time: '08:00',
                    frequency: 'Daily',
                    status: 'active',
                    nextDue: '2024-01-15T08:00:00'
                },
                {
                    id: 2,
                    title: 'Take Metformin',
                    description: '500mg tablet with breakfast',
                    time: '08:30',
                    frequency: 'Daily',
                    status: 'active',
                    nextDue: '2024-01-15T08:30:00'
                },
                {
                    id: 3,
                    title: 'Take Vitamin D',
                    description: '1000 IU supplement',
                    time: '20:00',
                    frequency: 'Daily',
                    status: 'active',
                    nextDue: '2024-01-15T20:00:00'
                },
                {
                    id: 4,
                    title: 'Apply Topical Cream',
                    description: 'Hydrocortisone cream for eczema',
                    time: '12:00',
                    frequency: 'Twice daily',
                    status: 'active',
                    nextDue: '2024-01-15T12:00:00'
                },
                {
                    id: 5,
                    title: 'Take Omega-3',
                    description: 'Fish oil supplement with dinner',
                    time: '19:00',
                    frequency: 'Daily',
                    status: 'active',
                    nextDue: '2024-01-15T19:00:00'
                }
            ],
            appointment: [
                {
                    id: 6,
                    title: 'Cardiology Appointment',
                    description: 'Follow-up with Dr. Michael Chen',
                    time: '14:30',
                    date: '2024-01-18',
                    status: 'scheduled',
                    reminderTime: '1 hour before'
                },
                {
                    id: 7,
                    title: 'Annual Physical',
                    description: 'General checkup with Dr. Sarah Johnson',
                    time: '10:00',
                    date: '2024-01-15',
                    status: 'confirmed',
                    reminderTime: '24 hours before'
                }
            ],
            checkup: [
                {
                    id: 8,
                    title: 'Blood Pressure Check',
                    description: 'Weekly blood pressure monitoring',
                    frequency: 'Weekly',
                    nextDue: '2024-01-16',
                    status: 'due'
                }
            ]
        };
        
        renderReminders();
    } catch (error) {
        console.error('Error loading reminders:', error);
        showToast('Error loading reminders', 'error');
    }
}

// Render all reminder categories
function renderReminders() {
    renderMedicationReminders();
    renderAppointmentReminders();
    renderCheckupReminders();
}

// Render medication reminders
function renderMedicationReminders() {
    const container = document.getElementById('medication-reminders');
    const medicationReminders = reminders.medication;
    
    if (medicationReminders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-pills"></i>
                <p>No medication reminders set</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = medicationReminders.map(reminder => `
        <div class="reminder-item medication">
            <div class="reminder-time">${reminder.time}</div>
            <div class="reminder-details">
                <div class="reminder-title">${reminder.title}</div>
                <div class="reminder-description">${reminder.description}</div>
            </div>
            <div class="reminder-actions">
                <button class="reminder-btn btn-complete" onclick="completeReminder(${reminder.id}, 'medication')" title="Mark as taken">
                    <i class="fas fa-check"></i>
                </button>
                <button class="reminder-btn btn-snooze" onclick="snoozeReminder(${reminder.id}, 'medication')" title="Snooze for 15 minutes">
                    <i class="fas fa-clock"></i>
                </button>
                <button class="reminder-btn btn-dismiss" onclick="dismissReminder(${reminder.id}, 'medication')" title="Dismiss">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update count
    document.getElementById('medication-count').textContent = `${medicationReminders.length} active reminders`;
}

// Render appointment reminders
function renderAppointmentReminders() {
    const container = document.getElementById('appointment-reminders');
    const appointmentReminders = reminders.appointment;
    
    if (appointmentReminders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>No appointment reminders</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appointmentReminders.map(reminder => `
        <div class="reminder-item appointment">
            <div class="reminder-time">${reminder.time}</div>
            <div class="reminder-details">
                <div class="reminder-title">${reminder.title}</div>
                <div class="reminder-description">${reminder.description}</div>
                <div class="reminder-description">📅 ${formatDate(reminder.date)}</div>
            </div>
            <div class="reminder-actions">
                <button class="reminder-btn btn-complete" onclick="completeReminder(${reminder.id}, 'appointment')" title="Mark as acknowledged">
                    <i class="fas fa-check"></i>
                </button>
                <button class="reminder-btn btn-snooze" onclick="snoozeReminder(${reminder.id}, 'appointment')" title="Remind me later">
                    <i class="fas fa-clock"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update count
    document.getElementById('appointment-count').textContent = `${appointmentReminders.length} upcoming appointments`;
}

// Render checkup reminders
function renderCheckupReminders() {
    const container = document.getElementById('checkup-reminders');
    const checkupReminders = reminders.checkup;
    
    if (checkupReminders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heartbeat"></i>
                <p>No health checkup reminders</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = checkupReminders.map(reminder => `
        <div class="reminder-item checkup ${reminder.status === 'due' ? 'urgent' : ''}">
            <div class="reminder-time">Due</div>
            <div class="reminder-details">
                <div class="reminder-title">${reminder.title}</div>
                <div class="reminder-description">${reminder.description}</div>
                <div class="reminder-description">📅 ${formatDate(reminder.nextDue)}</div>
            </div>
            <div class="reminder-actions">
                <button class="reminder-btn btn-complete" onclick="completeReminder(${reminder.id}, 'checkup')" title="Mark as completed">
                    <i class="fas fa-check"></i>
                </button>
                <button class="reminder-btn btn-snooze" onclick="snoozeReminder(${reminder.id}, 'checkup')" title="Postpone">
                    <i class="fas fa-clock"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update count
    document.getElementById('checkup-count').textContent = `${checkupReminders.length} due this week`;
}

// Update reminder statistics
function updateReminderStats() {
    const totalActive = reminders.medication.length + reminders.appointment.length + reminders.checkup.length;
    const todayReminders = getTodayReminders();
    const completedToday = 5; // Mock data
    const adherenceRate = 92; // Mock data
    
    document.getElementById('active-reminders').textContent = totalActive;
    document.getElementById('today-reminders').textContent = todayReminders;
    document.getElementById('completed-today').textContent = completedToday;
    document.getElementById('adherence-rate').textContent = `${adherenceRate}%`;
}

// Get today's reminders count
function getTodayReminders() {
    const today = new Date().toDateString();
    let count = 0;
    
    // Count medication reminders (daily)
    count += reminders.medication.length;
    
    // Count appointment reminders for today
    count += reminders.appointment.filter(reminder => 
        new Date(reminder.date).toDateString() === today
    ).length;
    
    // Count checkup reminders due today
    count += reminders.checkup.filter(reminder => 
        new Date(reminder.nextDue).toDateString() === today
    ).length;
    
    return count;
}

// Reminder actions
function completeReminder(reminderId, category) {
    const reminder = reminders[category].find(r => r.id === reminderId);
    if (reminder) {
        reminder.status = 'completed';
        showToast(`${reminder.title} marked as completed!`, 'success');
        
        // Update UI
        renderReminders();
        updateReminderStats();
        
        // In production, this would update the database
    }
}

function snoozeReminder(reminderId, category) {
    const reminder = reminders[category].find(r => r.id === reminderId);
    if (reminder) {
        showToast(`${reminder.title} snoozed for 15 minutes`, 'info');
        
        // In production, this would reschedule the reminder
    }
}

function dismissReminder(reminderId, category) {
    if (confirm('Are you sure you want to dismiss this reminder?')) {
        const reminderIndex = reminders[category].findIndex(r => r.id === reminderId);
        if (reminderIndex !== -1) {
            const reminder = reminders[category][reminderIndex];
            reminders[category].splice(reminderIndex, 1);
            showToast(`${reminder.title} dismissed`, 'success');
            
            // Update UI
            renderReminders();
            updateReminderStats();
        }
    }
}

// Quick action functions
function addMedicationReminder() {
    showToast('Opening medication reminder form...', 'info');
    // In production, this would open a comprehensive form modal
}

function addAppointmentReminder() {
    showToast('Opening appointment reminder form...', 'info');
    // In production, this would open a comprehensive form modal
}

function addCheckupReminder() {
    showToast('Opening checkup reminder form...', 'info');
    // In production, this would open a comprehensive form modal
}

function viewReminderSettings() {
    showToast('Opening reminder settings...', 'info');
    // In production, this would open settings page
}

// Modal functions
function closeReminderModal() {
    const modal = document.getElementById('reminder-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Setup real-time subscriptions
function setupRealtimeSubscriptions() {
    // In production, this would set up real-time subscriptions to Supabase
    console.log('Setting up real-time subscriptions for reminders...');
    
    // Simulate real-time updates
    setInterval(() => {
        checkDueReminders();
    }, 60000); // Check every minute
}

// Check for due reminders
function checkDueReminders() {
    const now = new Date();
    
    // Check medication reminders
    reminders.medication.forEach(reminder => {
        const reminderTime = new Date(reminder.nextDue);
        if (now >= reminderTime && reminder.status === 'active') {
            showReminderNotification(reminder);
        }
    });
}

// Show reminder notification
function showReminderNotification(reminder) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`MediCare+ Reminder: ${reminder.title}`, {
            body: reminder.description,
            icon: '/assets/icons/reminder-icon.png'
        });
    }
    
    showToast(`⏰ Reminder: ${reminder.title}`, 'warning');
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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

// Initialize notification permission on page load
document.addEventListener('DOMContentLoaded', function() {
    requestNotificationPermission();
});

// Export functions for global access
window.initializeRemindersPage = initializeRemindersPage;
window.completeReminder = completeReminder;
window.snoozeReminder = snoozeReminder;
window.dismissReminder = dismissReminder;
window.addMedicationReminder = addMedicationReminder;
window.addAppointmentReminder = addAppointmentReminder;
window.addCheckupReminder = addCheckupReminder;
window.viewReminderSettings = viewReminderSettings;
window.closeReminderModal = closeReminderModal; 