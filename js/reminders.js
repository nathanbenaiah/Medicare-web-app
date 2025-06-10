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

// Reminders Management System
class RemindersManager {
    constructor() {
        this.reminders = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadReminders();
        this.setupEventListeners();
        this.render();
    }

    loadReminders() {
        // Load from localStorage or Supabase
        const saved = localStorage.getItem('medicare_reminders');
        if (saved) {
            this.reminders = JSON.parse(saved);
        } else {
            // Demo data
            this.reminders = [
                {
                    id: 1,
                    title: 'Blood Pressure Medication',
                    type: 'medication',
                    time: '08:00',
                    frequency: 'daily',
                    status: 'active',
                    nextDue: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                    created: new Date()
                },
                {
                    id: 2,
                    title: 'Doctor Appointment - Dr. Silva',
                    type: 'appointment',
                    time: '14:30',
                    frequency: 'once',
                    status: 'upcoming',
                    nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                    created: new Date()
                },
                {
                    id: 3,
                    title: 'Vitamin D Supplement',
                    type: 'medication',
                    time: '20:00',
                    frequency: 'daily',
                    status: 'completed',
                    nextDue: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                    created: new Date()
                }
            ];
        }
    }

    saveReminders() {
        localStorage.setItem('medicare_reminders', JSON.stringify(this.reminders));
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Add reminder button
        const addBtn = document.querySelector('.add-reminder-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddReminderModal());
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
        
        this.render();
    }

    getFilteredReminders() {
        const now = new Date();
        
        switch (this.currentFilter) {
            case 'overdue':
                return this.reminders.filter(r => 
                    r.status === 'active' && new Date(r.nextDue) < now
                );
            case 'today':
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                return this.reminders.filter(r => {
                    const due = new Date(r.nextDue);
                    return due >= today && due < tomorrow;
                });
            case 'upcoming':
                return this.reminders.filter(r => 
                    r.status === 'active' && new Date(r.nextDue) > now
                );
            case 'completed':
                return this.reminders.filter(r => r.status === 'completed');
            default:
                return this.reminders;
        }
    }

    render() {
        const container = document.querySelector('.reminders-grid');
        if (!container) return;

        const filtered = this.getFilteredReminders();
        
        if (filtered.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }

        container.innerHTML = filtered.map(reminder => this.renderReminderCard(reminder)).join('');
    }

    renderReminderCard(reminder) {
        const now = new Date();
        const dueDate = new Date(reminder.nextDue);
        const isOverdue = reminder.status === 'active' && dueDate < now;
        const isUpcoming = reminder.status === 'active' && dueDate > now;
        
        let statusClass = '';
        if (isOverdue) statusClass = 'overdue';
        else if (isUpcoming) statusClass = 'upcoming';
        else if (reminder.status === 'completed') statusClass = 'completed';

        const timeUntil = this.getTimeUntilDue(dueDate);
        
        return `
            <div class="reminder-card ${statusClass}" data-id="${reminder.id}">
                <div class="reminder-status ${statusClass}"></div>
                
                <div class="reminder-header">
                    <div>
                        <h3 class="reminder-title">${reminder.title}</h3>
                        <span class="reminder-type">${this.getTypeLabel(reminder.type)}</span>
                    </div>
                </div>
                
                <div class="reminder-details">
                    <div class="reminder-time">
                        <i class="bx bx-time"></i>
                        <span>${reminder.time} - ${timeUntil}</span>
                    </div>
                    <div class="reminder-frequency">
                        <i class="bx bx-repeat"></i>
                        <span>${this.getFrequencyLabel(reminder.frequency)}</span>
                    </div>
                </div>
                
                <div class="reminder-actions">
                    ${reminder.status !== 'completed' ? `
                        <button class="action-btn complete" onclick="remindersManager.completeReminder(${reminder.id})" title="Mark as completed">
                            <i class="bx bx-check"></i>
                        </button>
                        <button class="action-btn snooze" onclick="remindersManager.snoozeReminder(${reminder.id})" title="Snooze">
                            <i class="bx bx-time"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn delete" onclick="remindersManager.deleteReminder(${reminder.id})" title="Delete">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <i class="bx bx-bell-off"></i>
                <h3>No reminders found</h3>
                <p>Create your first reminder to get started</p>
            </div>
        `;
    }

    getTypeLabel(type) {
        const labels = {
            medication: 'Medicine',
            appointment: 'Appointment',
            exercise: 'Exercise',
            checkup: 'Check-up',
            other: 'Other'
        };
        return labels[type] || 'Reminder';
    }

    getFrequencyLabel(frequency) {
        const labels = {
            daily: 'Every day',
            weekly: 'Weekly',
            monthly: 'Monthly',
            once: 'One time',
            custom: 'Custom'
        };
        return labels[frequency] || frequency;
    }

    getTimeUntilDue(dueDate) {
        const now = new Date();
        const diff = dueDate - now;
        
        if (diff < 0) {
            const overdue = Math.abs(diff);
            const hours = Math.floor(overdue / (1000 * 60 * 60));
            const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 0) {
                return `${hours}h ${minutes}m overdue`;
            } else {
                return `${minutes}m overdue`;
            }
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const days = Math.floor(hours / 24);
            
            if (days > 0) {
                return `in ${days} day${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                return `in ${hours}h ${minutes}m`;
            } else {
                return `in ${minutes}m`;
            }
        }
    }

    completeReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.status = 'completed';
            reminder.completedAt = new Date();
            
            // If it's a recurring reminder, create the next occurrence
            if (reminder.frequency !== 'once') {
                this.createNextOccurrence(reminder);
            }
            
            this.saveReminders();
            this.render();
            this.showNotification('Reminder marked as completed!', 'success');
        }
    }

    createNextOccurrence(reminder) {
        const nextReminder = { ...reminder };
        nextReminder.id = Date.now();
        nextReminder.status = 'active';
        delete nextReminder.completedAt;
        
        // Calculate next due date based on frequency
        const currentDue = new Date(reminder.nextDue);
        
        switch (reminder.frequency) {
            case 'daily':
                currentDue.setDate(currentDue.getDate() + 1);
                break;
            case 'weekly':
                currentDue.setDate(currentDue.getDate() + 7);
                break;
            case 'monthly':
                currentDue.setMonth(currentDue.getMonth() + 1);
                break;
        }
        
        nextReminder.nextDue = currentDue;
        this.reminders.push(nextReminder);
    }

    snoozeReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            // Snooze for 30 minutes
            const newDue = new Date(reminder.nextDue);
            newDue.setMinutes(newDue.getMinutes() + 30);
            reminder.nextDue = newDue;
            
            this.saveReminders();
            this.render();
            this.showNotification('Reminder snoozed for 30 minutes', 'info');
        }
    }

    deleteReminder(id) {
        if (confirm('Are you sure you want to delete this reminder?')) {
            this.reminders = this.reminders.filter(r => r.id !== id);
            this.saveReminders();
            this.render();
            this.showNotification('Reminder deleted', 'info');
        }
    }

    showAddReminderModal() {
        // Create and show modal for adding new reminder
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Reminder</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="bx bx-x"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <form id="reminderForm">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="reminderTitle" required placeholder="Enter reminder title">
                        </div>
                        
                        <div class="form-group">
                            <label>Type</label>
                            <select id="reminderType" required>
                                <option value="medication">Medication</option>
                                <option value="appointment">Appointment</option>
                                <option value="exercise">Exercise</option>
                                <option value="checkup">Check-up</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Time</label>
                            <input type="time" id="reminderTime" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" id="reminderDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Frequency</label>
                            <select id="reminderFrequency" required>
                                <option value="once">One time only</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                            <button type="submit">Create Reminder</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        const form = document.getElementById('reminderForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createReminder();
            modal.remove();
        });
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reminderDate').value = today;
    }

    createReminder() {
        const title = document.getElementById('reminderTitle').value;
        const type = document.getElementById('reminderType').value;
        const time = document.getElementById('reminderTime').value;
        const date = document.getElementById('reminderDate').value;
        const frequency = document.getElementById('reminderFrequency').value;
        
        const nextDue = new Date(`${date}T${time}`);
        
        const newReminder = {
            id: Date.now(),
            title,
            type,
            time,
            frequency,
            status: 'active',
            nextDue,
            created: new Date()
        };
        
        this.reminders.push(newReminder);
        this.saveReminders();
        this.render();
        this.showNotification('Reminder created successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bx ${type === 'error' ? 'bx-error' : type === 'success' ? 'bx-check' : 'bx-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Check for due reminders and show notifications
    checkDueReminders() {
        const now = new Date();
        const dueReminders = this.reminders.filter(r => {
            if (r.status !== 'active') return false;
            const due = new Date(r.nextDue);
            const diff = due - now;
            return diff <= 5 * 60 * 1000 && diff > 0; // Due within 5 minutes
        });
        
        dueReminders.forEach(reminder => {
            this.showReminderNotification(reminder);
        });
    }

    showReminderNotification(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`MediCare+ Reminder: ${reminder.title}`, {
                body: `Time: ${reminder.time}`,
                icon: '/images/logo.png'
            });
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.remindersManager = new RemindersManager();
    
    // Request notification permission
    remindersManager.requestNotificationPermission();
    
    // Check for due reminders every minute
    setInterval(() => {
        remindersManager.checkDueReminders();
    }, 60000);
}); 