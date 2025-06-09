// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initializeTheme();
    initializeReminders();
    setupEventListeners();
    loadFamilyMembers();
});

// Theme handling
function initializeTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');
    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
        feather.replace();
    }
}

// Data structure for reminders
const sampleReminders = [
    {
        id: "r1",
        type: "medication",
        title: "Take Vitamin C",
        time: "08:00",
        date: "2024-03-20",
        description: "Take with breakfast",
        memberId: "m1",
        memberName: "Grandma",
        status: "upcoming"
    },
    {
        id: "r2",
        type: "appointment",
        title: "Dental Checkup",
        time: "14:30",
        date: "2024-03-21",
        description: "Regular cleaning",
        memberId: "m2",
        memberName: "Dad",
        status: "upcoming"
    }
];

// Initialize reminders
function initializeReminders() {
    const reminders = getReminders();
    renderReminders(reminders);
    updateEmptyState(reminders);
    renderTodayReminders();
}

// Get reminders from localStorage or Firebase
function getReminders() {
    const stored = localStorage.getItem('reminders');
    return stored ? JSON.parse(stored) : sampleReminders;
}

// Save reminders
function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    showToast('Reminder saved successfully!');
}

// Render reminders
function renderReminders(reminders, animate = true) {
    const grid = document.getElementById('remindersGrid');
    grid.innerHTML = '';

    // Sort reminders
    reminders = sortReminders(reminders);

    // Filter based on view (upcoming/completed)
    const view = document.querySelector('.toggle-btn.active').dataset.view;
    reminders = reminders.filter(r => {
        if (view === 'upcoming') return r.status === 'upcoming';
        return r.status === 'completed';
    });

    reminders.forEach((reminder, index) => {
        const card = createReminderCard(reminder);
        grid.appendChild(card);

        if (animate) {
            // Stagger animation
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        }
    });

    updateEmptyState(reminders);
}

// Sort reminders based on selected option
function sortReminders(reminders) {
    const sortBy = document.getElementById('sortBy').value;
    
    return reminders.sort((a, b) => {
        switch (sortBy) {
            case 'date-asc':
                return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
            case 'date-desc':
                return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
            case 'time':
                return a.time.localeCompare(b.time);
            case 'type':
                return a.type.localeCompare(b.type);
            default:
                return 0;
        }
    });
}

// Create a reminder card
function createReminderCard(reminder) {
    const card = document.createElement('div');
    card.className = 'reminder-card glass-effect';
    card.dataset.id = reminder.id;

    const icon = reminder.type === 'medication' ? 'pill' : 'calendar';
    const typeClass = reminder.type === 'medication' ? 'medication' : 'appointment';
    const status = isOverdue(reminder) ? 'overdue' : reminder.status;

    card.innerHTML = `
        <div class="reminder-status status-${status}"></div>
        <div class="reminder-type ${typeClass}">
            <i data-feather="${icon}"></i>
            ${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
        </div>
        <h3 class="reminder-title">${reminder.title}</h3>
        <div class="reminder-info">
            <div class="info-item">
                <i data-feather="clock"></i>
                ${formatTime(reminder.time)}
            </div>
            <div class="info-item">
                <i data-feather="calendar"></i>
                ${formatDate(reminder.date)}
            </div>
            <div class="info-item">
                <i data-feather="user"></i>
                ${reminder.memberName}
            </div>
        </div>
        ${reminder.description ? `
            <div class="reminder-notes">
                <i data-feather="file-text"></i>
                ${reminder.description}
            </div>
        ` : ''}
        <div class="card-actions">
            <button class="action-btn complete" aria-label="Mark as ${reminder.status === 'completed' ? 'incomplete' : 'complete'}">
                <i data-feather="${reminder.status === 'completed' ? 'rotate-ccw' : 'check'}"></i>
            </button>
            <button class="action-btn edit" aria-label="Edit reminder">
                <i data-feather="edit-2"></i>
            </button>
            <button class="action-btn delete" aria-label="Delete reminder">
                <i data-feather="trash-2"></i>
            </button>
        </div>
    `;

    // Initialize Feather icons for the new card
    feather.replace();

    return card;
}

// Check if reminder is overdue
function isOverdue(reminder) {
    if (reminder.status === 'completed') return false;
    const now = new Date();
    const reminderDate = new Date(`${reminder.date} ${reminder.time}`);
    return reminderDate < now;
}

// Format time to 12-hour format
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Format date to readable format
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Setup event listeners
function setupEventListeners() {
    setupFilterListeners();
    setupModalListeners();
    setupCardActionListeners();
    setupFABListeners();
    setupThemeToggle();
}

// Filter listeners
function setupFilterListeners() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const familyFilter = document.getElementById('familyFilter');
    const sortBy = document.getElementById('sortBy');
    const viewToggle = document.querySelector('.view-toggle');

    const filterReminders = () => {
        let reminders = getReminders();
        const searchTerm = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        const date = dateFilter.value;
        const family = familyFilter.value;

        reminders = reminders.filter(reminder => {
            const matchesSearch = reminder.title.toLowerCase().includes(searchTerm) ||
                                reminder.description?.toLowerCase().includes(searchTerm);
            const matchesType = type === 'all' || reminder.type === type;
            const matchesDate = matchesDateFilter(reminder, date);
            const matchesFamily = family === 'all' || reminder.memberId === family;

            return matchesSearch && matchesType && matchesDate && matchesFamily;
        });

        renderReminders(reminders);
        updateFilterTags();
    };

    searchInput.addEventListener('input', filterReminders);
    typeFilter.addEventListener('change', filterReminders);
    dateFilter.addEventListener('change', handleDateFilterChange);
    familyFilter.addEventListener('change', filterReminders);
    sortBy.addEventListener('change', filterReminders);

    viewToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;

        viewToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterReminders();
    });
}

// Handle date filter change
function handleDateFilterChange() {
    const dateFilter = document.getElementById('dateFilter');
    const customRange = document.getElementById('customDateRange');
    
    if (dateFilter.value === 'custom') {
        customRange.style.display = 'block';
    } else {
        customRange.style.display = 'none';
    }
    
    filterReminders();
}

// Match date filter
function matchesDateFilter(reminder, filterValue) {
    if (filterValue === 'all') return true;
    
    const reminderDate = new Date(reminder.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    switch (filterValue) {
        case 'today':
            return reminderDate.getTime() === today.getTime();
        case 'tomorrow':
            return reminderDate.getTime() === tomorrow.getTime();
        case 'week':
            return reminderDate >= today && reminderDate <= weekEnd;
        case 'custom':
            const start = new Date(document.getElementById('dateStart').value);
            const end = new Date(document.getElementById('dateEnd').value);
            return reminderDate >= start && reminderDate <= end;
        default:
            return true;
    }
}

// Update filter tags
function updateFilterTags() {
    const container = document.getElementById('filterTags');
    container.innerHTML = '';
    
    const filters = {
        type: document.getElementById('typeFilter'),
        date: document.getElementById('dateFilter'),
        family: document.getElementById('familyFilter')
    };

    Object.entries(filters).forEach(([key, select]) => {
        if (select.value !== 'all') {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `
                ${select.options[select.selectedIndex].text}
                <i data-feather="x"></i>
            `;
            tag.addEventListener('click', () => {
                select.value = 'all';
                select.dispatchEvent(new Event('change'));
            });
            container.appendChild(tag);
        }
    });

    feather.replace();
}

// Modal listeners
function setupModalListeners() {
    const modal = document.getElementById('reminderModal');
    const deleteModal = document.getElementById('deleteModal');
    const form = document.getElementById('reminderForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', () => closeModal(modal));
    cancelDelete.addEventListener('click', () => closeModal(deleteModal));
    confirmDelete.addEventListener('click', handleDelete);
}

// Card action listeners
function setupCardActionListeners() {
    document.getElementById('remindersGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.reminder-card');
        if (!card) return;

        if (e.target.closest('.edit')) {
            openReminderModal(card.dataset.id);
        } else if (e.target.closest('.delete')) {
            openDeleteModal(card.dataset.id);
        } else if (e.target.closest('.complete')) {
            toggleReminderStatus(card.dataset.id);
        }
    });
}

// FAB listeners
function setupFABListeners() {
    const fabMain = document.getElementById('fabMain');
    const fabOptions = document.querySelector('.fab-options');
    
    fabMain.addEventListener('click', () => {
        fabMain.classList.toggle('active');
        fabOptions.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fab-container')) {
            fabMain.classList.remove('active');
            fabOptions.classList.remove('active');
        }
    });

    fabOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.fab-option');
        if (option) {
            openReminderModal(null, option.dataset.type);
        }
    });
}

// Theme toggle listener
function setupThemeToggle() {
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
}

// Modal handlers
function openReminderModal(reminderId = null, type = null) {
    const modal = document.getElementById('reminderModal');
    const form = document.getElementById('reminderForm');
    const title = document.getElementById('modalTitle');
    
    title.textContent = reminderId ? 'Edit Reminder' : 'Add Reminder';
    
    if (reminderId) {
        const reminder = getReminders().find(r => r.id === reminderId);
        if (reminder) {
            form.elements.reminderId.value = reminder.id;
            form.querySelector(`input[value="${reminder.type}"]`).checked = true;
            form.elements.title.value = reminder.title;
            form.elements.time.value = reminder.time;
            form.elements.date.value = reminder.date;
            form.elements.description.value = reminder.description || '';
            form.elements.member.value = reminder.memberId;
        }
    } else {
        form.reset();
        form.elements.reminderId.value = '';
        if (type) {
            form.querySelector(`input[value="${type}"]`).checked = true;
        }
    }

    modal.classList.add('active');
}

function openDeleteModal(reminderId) {
    const modal = document.getElementById('deleteModal');
    modal.dataset.reminderId = reminderId;
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Form handlers
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const reminderId = form.elements.reminderId.value;
    const memberId = form.elements.member.value;
    const memberName = form.elements.member.options[form.elements.member.selectedIndex].text;

    const reminderData = {
        id: reminderId || `r${Date.now()}`,
        type: form.querySelector('input[name="type"]:checked').value,
        title: form.elements.title.value,
        time: form.elements.time.value,
        date: form.elements.date.value,
        description: form.elements.description.value,
        memberId,
        memberName,
        status: 'upcoming'
    };

    const reminders = getReminders();
    const index = reminders.findIndex(r => r.id === reminderId);

    if (index !== -1) {
        reminders[index] = {...reminders[index], ...reminderData};
    } else {
        reminders.push(reminderData);
    }

    saveReminders(reminders);
    renderReminders(reminders);
    closeModal(document.getElementById('reminderModal'));
}

function handleDelete() {
    const modal = document.getElementById('deleteModal');
    const reminderId = modal.dataset.reminderId;
    const reminders = getReminders().filter(r => r.id !== reminderId);
    
    saveReminders(reminders);
    renderReminders(reminders);
    closeModal(modal);
    showToast('Reminder deleted successfully!');
}

// Toggle reminder status
function toggleReminderStatus(reminderId) {
    const reminders = getReminders();
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
        reminder.status = reminder.status === 'completed' ? 'upcoming' : 'completed';
        saveReminders(reminders);
        renderReminders(reminders);
        showToast(`Reminder marked as ${reminder.status}!`);
    }
}

// Render today's reminders
function renderTodayReminders() {
    const today = new Date().toISOString().split('T')[0];
    const reminders = getReminders().filter(r => r.date === today && r.status === 'upcoming');
    
    const todaySection = document.getElementById('todaySection');
    const todayGrid = document.getElementById('todayGrid');
    
    if (reminders.length === 0) {
        todaySection.style.display = 'none';
        return;
    }

    todaySection.style.display = 'block';
    todayGrid.innerHTML = '';

    reminders.sort((a, b) => a.time.localeCompare(b.time))
            .forEach((reminder, index) => {
                const card = createReminderCard(reminder);
                todayGrid.appendChild(card);
                setTimeout(() => card.classList.add('visible'), index * 100);
            });
}

// Load family members
function loadFamilyMembers() {
    const familyMembers = JSON.parse(localStorage.getItem('familyMembers')) || [
        { id: 'm1', name: 'Grandma' },
        { id: 'm2', name: 'Dad' },
        { id: 'm3', name: 'Mom' }
    ];

    const familyFilter = document.getElementById('familyFilter');
    const memberSelect = document.getElementById('member');

    [familyFilter, memberSelect].forEach(select => {
        select.innerHTML = '<option value="all">All Members</option>';
        familyMembers.forEach(member => {
            select.add(new Option(member.name, member.id));
        });
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('successToast');
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update empty state
function updateEmptyState(reminders) {
    const emptyState = document.getElementById('emptyState');
    const remindersGrid = document.getElementById('remindersGrid');
    
    if (reminders.length === 0) {
        emptyState.style.display = 'block';
        remindersGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        remindersGrid.style.display = 'grid';
    }
}

// Reminders Management
class RemindersManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentUser = null
        this.reminders = []
        this.init()
    }

    async init() {
        // Wait for auth to be ready
        const user = await window.supabaseUtils.getCurrentUser()
        if (user) {
            this.currentUser = user
            await this.loadReminders()
        }
    }

    // Load all reminders for the current user
    async loadReminders() {
        try {
            if (!this.currentUser) {
                console.log('No user logged in')
                return []
            }

            const { data, error } = await this.supabase
                .from('reminders')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('time', { ascending: true })

            if (error) {
                console.error('Error loading reminders:', error)
                this.showError('Failed to load reminders')
                return []
            }

            this.reminders = data || []
            this.renderReminders()
            return this.reminders
        } catch (error) {
            console.error('Error loading reminders:', error)
            this.showError('An unexpected error occurred while loading reminders')
            return []
        }
    }

    // Add new reminder
    async addReminder(reminderData) {
        try {
            if (!this.currentUser) {
                this.showError('Please sign in to add reminders')
                return false
            }

            const { data, error } = await this.supabase
                .from('reminders')
                .insert([{
                    user_id: this.currentUser.id,
                    medicine_name: reminderData.medicineName,
                    dosage: reminderData.dosage,
                    time: reminderData.time,
                    frequency: reminderData.frequency,
                    notes: reminderData.notes || '',
                    is_active: true,
                    created_at: new Date().toISOString()
                }])
                .select()

            if (error) {
                console.error('Error adding reminder:', error)
                this.showError('Failed to add reminder')
                return false
            }

            // Add to local array
            this.reminders.push(data[0])
            this.renderReminders()
            this.showSuccess('Reminder added successfully!')
            return true
        } catch (error) {
            console.error('Error adding reminder:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Update reminder
    async updateReminder(id, updates) {
        try {
            const { data, error } = await this.supabase
                .from('reminders')
                .update(updates)
                .eq('id', id)
                .eq('user_id', this.currentUser.id)
                .select()

            if (error) {
                console.error('Error updating reminder:', error)
                this.showError('Failed to update reminder')
                return false
            }

            // Update local array
            const index = this.reminders.findIndex(r => r.id === id)
            if (index !== -1) {
                this.reminders[index] = { ...this.reminders[index], ...updates }
                this.renderReminders()
            }

            this.showSuccess('Reminder updated successfully!')
            return true
        } catch (error) {
            console.error('Error updating reminder:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Delete reminder
    async deleteReminder(id) {
        try {
            const { error } = await this.supabase
                .from('reminders')
                .delete()
                .eq('id', id)
                .eq('user_id', this.currentUser.id)

            if (error) {
                console.error('Error deleting reminder:', error)
                this.showError('Failed to delete reminder')
                return false
            }

            // Remove from local array
            this.reminders = this.reminders.filter(r => r.id !== id)
            this.renderReminders()
            this.showSuccess('Reminder deleted successfully!')
            return true
        } catch (error) {
            console.error('Error deleting reminder:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Toggle reminder active status
    async toggleReminder(id, isActive) {
        return await this.updateReminder(id, { is_active: isActive })
    }

    // Mark reminder as taken
    async markAsTaken(reminderId) {
        try {
            const { data, error } = await this.supabase
                .from('reminder_logs')
                .insert([{
                    reminder_id: reminderId,
                    user_id: this.currentUser.id,
                    taken_at: new Date().toISOString(),
                    status: 'taken'
                }])

            if (error) {
                console.error('Error marking as taken:', error)
                this.showError('Failed to mark as taken')
                return false
            }

            this.showSuccess('Marked as taken!')
            return true
        } catch (error) {
            console.error('Error marking as taken:', error)
            this.showError('An unexpected error occurred')
            return false
        }
    }

    // Get today's reminders
    getTodaysReminders() {
        const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD format
        return this.reminders.filter(reminder => {
            if (!reminder.is_active) return false
            
            // Check if reminder should show today based on frequency
            switch (reminder.frequency?.toLowerCase()) {
                case 'daily':
                    return true
                case 'weekly':
                    // This would need more complex logic based on start date
                    return true
                case 'as needed':
                    return true
                default:
                    return true
            }
        })
    }

    // Render reminders to UI
    renderReminders() {
        const container = document.getElementById('reminders-container')
        if (!container) return

        if (this.reminders.length === 0) {
            container.innerHTML = `
                <div class="no-reminders">
                    <i class="bx bx-bell-off"></i>
                    <h3>No Reminders Yet</h3>
                    <p>Add your first medication reminder to get started!</p>
                    <button class="btn-primary" onclick="showAddReminderModal()">
                        <i class="bx bx-plus"></i> Add Reminder
                    </button>
                </div>
            `
            return
        }

        const remindersHTML = this.reminders.map(reminder => `
            <div class="reminder-card ${reminder.is_active ? 'active' : 'inactive'}" data-id="${reminder.id}">
                <div class="reminder-header">
                    <div class="reminder-info">
                        <h4>${reminder.medicine_name}</h4>
                        <span class="dosage">${reminder.dosage}</span>
                    </div>
                    <div class="reminder-time">
                        <i class="bx bx-time"></i>
                        ${this.formatTime(reminder.time)}
                    </div>
                </div>
                
                <div class="reminder-details">
                    <span class="frequency">
                        <i class="bx bx-repeat"></i>
                        ${reminder.frequency}
                    </span>
                    ${reminder.notes ? `<p class="notes">${reminder.notes}</p>` : ''}
                </div>
                
                <div class="reminder-actions">
                    <button class="btn-taken" onclick="remindersManager.markAsTaken(${reminder.id})">
                        <i class="bx bx-check"></i> Taken
                    </button>
                    <button class="btn-toggle ${reminder.is_active ? 'active' : ''}" 
                            onclick="remindersManager.toggleReminder(${reminder.id}, ${!reminder.is_active})">
                        <i class="bx ${reminder.is_active ? 'bx-pause' : 'bx-play'}"></i>
                        ${reminder.is_active ? 'Pause' : 'Resume'}
                    </button>
                    <button class="btn-edit" onclick="editReminder(${reminder.id})">
                        <i class="bx bx-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="remindersManager.deleteReminder(${reminder.id})">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
            </div>
        `).join('')

        container.innerHTML = remindersHTML
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
        // Use the same notification system as auth
        if (window.authManager) {
            window.authManager.showNotification(message, type)
        } else {
            console.log(`${type.toUpperCase()}: ${message}`)
        }
    }
}

// Initialize reminders manager
const remindersManager = new RemindersManager()

// Global functions for HTML
window.remindersManager = remindersManager

// Form submission handler
window.handleReminderForm = async (event) => {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const reminderData = {
        medicineName: formData.get('medicineName'),
        dosage: formData.get('dosage'),
        time: formData.get('time'),
        frequency: formData.get('frequency'),
        notes: formData.get('notes')
    }
    
    const success = await remindersManager.addReminder(reminderData)
    if (success) {
        event.target.reset()
        // Close modal if exists
        const modal = document.getElementById('addReminderModal')
        if (modal) modal.style.display = 'none'
    }
} 