// Provider Reminders JavaScript
// Supabase Configuration
const SUPABASE_URL = 'https://gcggnrwqilylyykppizb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzE4NzEsImV4cCI6MjA1MDEwNzg3MX0.4_8nOLLaLdtaUNJhJNhWJhJhJNhWJhJhJNhWJhJhJNhW';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentProvider = null;
let clinicalReminders = [];
let patientFollowups = [];
let patientNotifications = [];

// Initialize the provider reminders page
async function initializeProviderReminders() {
    try {
        showLoading(true);
        
        // Get current provider (demo provider for now)
        currentProvider = {
            id: 'provider-001',
            name: 'Dr. Sarah Johnson',
            specialty: 'Internal Medicine',
            email: 'dr.johnson@medicare.com'
        };
        
        // Load all reminder data
        await loadClinicalReminders();
        await loadPatientFollowups();
        await loadPatientNotifications();
        
        // Update statistics
        updateReminderStats();
        
        // Load reminder statistics
        loadReminderStatistics();
        
        // Set up real-time subscriptions
        setupRealtimeSubscriptions();
        
        showLoading(false);
    } catch (error) {
        console.error('Error initializing provider reminders:', error);
        showToast('Error loading reminders', 'error');
        showLoading(false);
    }
}

// Load clinical reminders
async function loadClinicalReminders() {
    try {
        // For demo purposes, we'll use mock data
        // In production, this would fetch from Supabase
        clinicalReminders = [
            {
                id: 1,
                title: 'Review Lab Results',
                description: 'Blood work results for John Doe need review',
                priority: 'high',
                due_date: '2024-01-15',
                patient_name: 'John Doe',
                category: 'lab-review',
                status: 'pending'
            },
            {
                id: 2,
                title: 'Prescription Renewal',
                description: 'Lisinopril prescription expires for Jane Smith',
                priority: 'medium',
                due_date: '2024-01-16',
                patient_name: 'Jane Smith',
                category: 'prescription',
                status: 'pending'
            },
            {
                id: 3,
                title: 'Follow-up Required',
                description: 'Post-surgery check for Robert Johnson',
                priority: 'high',
                due_date: '2024-01-15',
                patient_name: 'Robert Johnson',
                category: 'follow-up',
                status: 'pending'
            },
            {
                id: 4,
                title: 'Vaccination Due',
                description: 'Annual flu shot reminder for Emily Davis',
                priority: 'low',
                due_date: '2024-01-18',
                patient_name: 'Emily Davis',
                category: 'vaccination',
                status: 'pending'
            },
            {
                id: 5,
                title: 'Referral Follow-up',
                description: 'Check cardiology referral status for Michael Brown',
                priority: 'medium',
                due_date: '2024-01-17',
                patient_name: 'Michael Brown',
                category: 'referral',
                status: 'pending'
            }
        ];
        
        renderClinicalReminders();
    } catch (error) {
        console.error('Error loading clinical reminders:', error);
    }
}

// Load patient follow-ups
async function loadPatientFollowups() {
    try {
        patientFollowups = [
            {
                id: 1,
                patient_name: 'John Doe',
                patient_id: 'patient-001',
                follow_up_type: 'Post-Treatment',
                last_visit: '2024-01-10',
                next_due: '2024-01-17',
                condition: 'Hypertension',
                priority: 'medium',
                status: 'scheduled'
            },
            {
                id: 2,
                patient_name: 'Jane Smith',
                patient_id: 'patient-002',
                follow_up_type: 'Chronic Care',
                last_visit: '2024-01-08',
                next_due: '2024-01-15',
                condition: 'Diabetes Type 2',
                priority: 'high',
                status: 'overdue'
            },
            {
                id: 3,
                patient_name: 'Robert Johnson',
                patient_id: 'patient-003',
                follow_up_type: 'Surgical Follow-up',
                last_visit: '2024-01-12',
                next_due: '2024-01-19',
                condition: 'Post-Appendectomy',
                priority: 'high',
                status: 'scheduled'
            }
        ];
        
        renderPatientFollowups();
    } catch (error) {
        console.error('Error loading patient follow-ups:', error);
    }
}

// Load patient notifications
async function loadPatientNotifications() {
    try {
        patientNotifications = [
            {
                id: 1,
                patient_name: 'John Doe',
                patient_avatar: 'JD',
                notification_type: 'Appointment Reminder',
                message: 'Upcoming appointment tomorrow at 10:00 AM',
                status: 'sent',
                sent_time: '2024-01-14T09:00:00'
            },
            {
                id: 2,
                patient_name: 'Jane Smith',
                patient_avatar: 'JS',
                notification_type: 'Medication Reminder',
                message: 'Time to take your morning medication',
                status: 'acknowledged',
                sent_time: '2024-01-14T08:00:00'
            },
            {
                id: 3,
                patient_name: 'Emily Davis',
                patient_avatar: 'ED',
                notification_type: 'Lab Results',
                message: 'Your lab results are ready for review',
                status: 'pending',
                sent_time: '2024-01-14T14:30:00'
            },
            {
                id: 4,
                patient_name: 'Michael Brown',
                patient_avatar: 'MB',
                notification_type: 'Follow-up Reminder',
                message: 'Please schedule your follow-up appointment',
                status: 'sent',
                sent_time: '2024-01-14T11:15:00'
            }
        ];
        
        renderPatientNotifications();
    } catch (error) {
        console.error('Error loading patient notifications:', error);
    }
}

// Render clinical reminders
function renderClinicalReminders() {
    const container = document.getElementById('clinical-reminders');
    
    // Group reminders by category
    const categories = {
        'lab-review': { name: 'Lab Reviews', icon: 'fas fa-flask', color: '#dc3545' },
        'prescription': { name: 'Prescriptions', icon: 'fas fa-pills', color: '#28a745' },
        'follow-up': { name: 'Follow-ups', icon: 'fas fa-user-check', color: '#007bff' },
        'vaccination': { name: 'Vaccinations', icon: 'fas fa-syringe', color: '#ffc107' },
        'referral': { name: 'Referrals', icon: 'fas fa-share-square', color: '#6f42c1' }
    };
    
    container.innerHTML = Object.keys(categories).map(categoryKey => {
        const category = categories[categoryKey];
        const categoryReminders = clinicalReminders.filter(r => r.category === categoryKey);
        
        if (categoryReminders.length === 0) return '';
        
        return `
            <div class="category-section">
                <div class="category-header">
                    <div class="category-icon" style="background: ${category.color};">
                        <i class="${category.icon}"></i>
                    </div>
                    <div>
                        <h3 class="category-title">${category.name}</h3>
                        <p class="category-count">${categoryReminders.length} reminders</p>
                    </div>
                </div>
                
                ${categoryReminders.map(reminder => `
                    <div class="reminder-item ${reminder.priority}-priority">
                        <div class="reminder-priority priority-${reminder.priority}"></div>
                        <div class="reminder-details">
                            <div class="reminder-title">${reminder.title}</div>
                            <div class="reminder-description">${reminder.description}</div>
                            <div class="reminder-time">Patient: ${reminder.patient_name} • Due: ${formatDate(reminder.due_date)}</div>
                        </div>
                        <div class="reminder-actions">
                            <button class="reminder-btn btn-complete" onclick="completeReminder(${reminder.id}, 'clinical')" title="Mark as completed">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="reminder-btn btn-snooze" onclick="snoozeReminder(${reminder.id}, 'clinical')" title="Snooze reminder">
                                <i class="fas fa-clock"></i>
                            </button>
                            <button class="reminder-btn btn-dismiss" onclick="dismissReminder(${reminder.id}, 'clinical')" title="Dismiss reminder">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

// Render patient follow-ups
function renderPatientFollowups() {
    const container = document.getElementById('patient-followups');
    
    if (patientFollowups.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-check"></i>
                <p>No patient follow-ups scheduled</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = patientFollowups.map(followup => `
        <div class="patient-reminder ${followup.status === 'overdue' ? 'high-priority' : ''}">
            <div class="patient-avatar">${followup.patient_name.split(' ').map(n => n[0]).join('')}</div>
            <div class="patient-info">
                <div class="patient-name">${followup.patient_name}</div>
                <div class="patient-reminder-text">${followup.follow_up_type} - ${followup.condition}</div>
                <div class="patient-reminder-text">Last visit: ${formatDate(followup.last_visit)} • Next due: ${formatDate(followup.next_due)}</div>
            </div>
            <div class="reminder-status status-${followup.status}">${followup.status}</div>
        </div>
    `).join('');
}

// Render patient notifications
function renderPatientNotifications() {
    const container = document.getElementById('patient-notifications');
    
    if (patientNotifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell"></i>
                <p>No patient notifications</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = patientNotifications.map(notification => `
        <div class="patient-reminder">
            <div class="patient-avatar">${notification.patient_avatar}</div>
            <div class="patient-info">
                <div class="patient-name">${notification.patient_name}</div>
                <div class="patient-reminder-text">${notification.notification_type}</div>
                <div class="patient-reminder-text">${notification.message}</div>
            </div>
            <div class="reminder-status status-${notification.status}">${notification.status}</div>
        </div>
    `).join('');
}

// Load reminder statistics
function loadReminderStatistics() {
    const container = document.getElementById('reminder-stats');
    
    const stats = [
        { label: 'Completion Rate', value: '94%', color: '#28a745' },
        { label: 'Avg Response Time', value: '2.3h', color: '#007bff' },
        { label: 'Overdue Items', value: '3', color: '#dc3545' },
        { label: 'This Week', value: '28', color: '#6f42c1' }
    ];
    
    container.innerHTML = stats.map(stat => `
        <div style="padding: 1rem; background: white; border-radius: 10px; text-align: center; border: 1px solid #e9ecef;">
            <div style="font-size: 1.5rem; font-weight: 700; color: ${stat.color}; margin-bottom: 0.25rem;">${stat.value}</div>
            <div style="font-size: 0.8rem; color: var(--text-gray);">${stat.label}</div>
        </div>
    `).join('');
}

// Update reminder statistics
function updateReminderStats() {
    const activeReminders = clinicalReminders.length;
    const highPriority = clinicalReminders.filter(r => r.priority === 'high').length;
    const patientNotificationCount = patientNotifications.length;
    const completionRate = 94; // Mock data
    
    document.getElementById('active-reminders').textContent = activeReminders;
    document.getElementById('high-priority').textContent = highPriority;
    document.getElementById('patient-notifications').textContent = patientNotificationCount;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
}

// Reminder actions
function completeReminder(reminderId, category) {
    if (category === 'clinical') {
        const reminder = clinicalReminders.find(r => r.id === reminderId);
        if (reminder) {
            reminder.status = 'completed';
            showToast(`${reminder.title} marked as completed!`, 'success');
            renderClinicalReminders();
            updateReminderStats();
        }
    }
}

function snoozeReminder(reminderId, category) {
    if (category === 'clinical') {
        const reminder = clinicalReminders.find(r => r.id === reminderId);
        if (reminder) {
            showToast(`${reminder.title} snoozed for 1 hour`, 'info');
            // In production, this would reschedule the reminder
        }
    }
}

function dismissReminder(reminderId, category) {
    if (confirm('Are you sure you want to dismiss this reminder?')) {
        if (category === 'clinical') {
            const reminderIndex = clinicalReminders.findIndex(r => r.id === reminderId);
            if (reminderIndex !== -1) {
                const reminder = clinicalReminders[reminderIndex];
                clinicalReminders.splice(reminderIndex, 1);
                showToast(`${reminder.title} dismissed`, 'success');
                renderClinicalReminders();
                updateReminderStats();
            }
        }
    }
}

// Quick actions
function addClinicalReminder() {
    showToast('Opening clinical reminder form...', 'info');
    // In production, this would open a comprehensive form modal
}

function sendBulkReminders() {
    showToast('Sending bulk reminders to patients...', 'info');
    setTimeout(() => {
        showToast('Bulk reminders sent successfully!', 'success');
    }, 2000);
}

function scheduleReminder() {
    showToast('Opening reminder scheduler...', 'info');
    // In production, this would open the scheduler interface
}

function viewReminderTemplates() {
    showToast('Loading reminder templates...', 'info');
    // In production, this would open the templates manager
}

function reminderSettings() {
    showToast('Opening reminder settings...', 'info');
    // In production, this would open the settings page
}

// Setup real-time subscriptions
function setupRealtimeSubscriptions() {
    // In production, this would set up real-time subscriptions to Supabase
    console.log('Setting up real-time subscriptions for provider reminders...');
    
    // Simulate real-time updates
    setInterval(() => {
        checkDueReminders();
    }, 60000); // Check every minute
}

// Check for due reminders
function checkDueReminders() {
    const now = new Date();
    
    clinicalReminders.forEach(reminder => {
        const dueDate = new Date(reminder.due_date);
        if (now >= dueDate && reminder.status === 'pending') {
            showReminderNotification(reminder);
        }
    });
}

// Show reminder notification
function showReminderNotification(reminder) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Clinical Reminder: ${reminder.title}`, {
            body: `${reminder.description} - Patient: ${reminder.patient_name}`,
            icon: '/assets/icons/clinical-reminder-icon.png'
        });
    }
    
    showToast(`🔔 Clinical Reminder: ${reminder.title}`, 'warning');
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
window.initializeProviderReminders = initializeProviderReminders;
window.completeReminder = completeReminder;
window.snoozeReminder = snoozeReminder;
window.dismissReminder = dismissReminder;
window.addClinicalReminder = addClinicalReminder;
window.sendBulkReminders = sendBulkReminders;
window.scheduleReminder = scheduleReminder;
window.viewReminderTemplates = viewReminderTemplates;
window.reminderSettings = reminderSettings; 