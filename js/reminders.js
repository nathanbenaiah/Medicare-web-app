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

// Enhanced Reminders Manager with Supabase Integration
class RemindersManager {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentUser = null
        this.reminders = []
        this.isLoading = false

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.init()
        })
    }

    async init() {
        try {
            // Check authentication
            await this.checkAuth()
            
            if (!this.currentUser) {
                this.redirectToLogin()
                return
            }

            // Initialize UI components
            this.initializeTheme()
            this.setupEventListeners()
            
            // Load user reminders
            await this.loadReminders()
            
            // Track page view
            if (window.authManager) {
                await window.authManager.trackUserEvent('reminders_page_viewed')
            }

        } catch (error) {
            console.error('Error initializing reminders:', error)
            this.showError('Failed to initialize reminders. Please refresh the page.')
        }
    }

    async checkAuth() {
        const { data: { session } } = await this.supabase.auth.getSession()
        this.currentUser = session?.user || null
        
        if (this.currentUser) {
            this.updateUserDisplay()
        }
    }

    redirectToLogin() {
        window.location.href = '/html/index.html'
    }

    updateUserDisplay() {
        const userDisplays = document.querySelectorAll('.user-display')
        userDisplays.forEach(display => {
            display.innerHTML = `
                <img src="${this.currentUser.user_metadata?.avatar_url || '/images/default-avatar.png'}" 
                     alt="Profile" class="user-avatar">
                <span>Hello, ${this.currentUser.user_metadata?.full_name || this.currentUser.email}</span>
            `
            display.style.display = 'flex'
        })
    }

    // Load user reminders from Supabase
    async loadReminders() {
        try {
            this.showLoading(true)
            
            const { data, error } = await this.supabase
                .from('reminders')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            if (error) {
                throw error
            }

            this.reminders = data || []
            this.renderReminders()
            this.renderTodayReminders()
            this.updateEmptyState()

            console.log(`Loaded ${this.reminders.length} reminders for user`)

        } catch (error) {
            console.error('Error loading reminders:', error)
            this.showError('Failed to load reminders. Please try again.')
        } finally {
            this.showLoading(false)
        }
    }

    // Add new reminder
    async addReminder(reminderData) {
        try {
            this.showLoading(true, 'Creating reminder...')

            const newReminder = {
                user_id: this.currentUser.id,
                medication_name: reminderData.medicationName,
                dosage: reminderData.dosage,
                frequency: reminderData.frequency || 1,
                times: reminderData.times || ['08:00'],
                start_date: reminderData.startDate || new Date().toISOString().split('T')[0],
                end_date: reminderData.endDate || null,
                instructions: reminderData.instructions || '',
                is_active: true,
                color: reminderData.color || '#3B82F6',
                priority: reminderData.priority || 1
            }

            const { data, error } = await this.supabase
                .from('reminders')
                .insert(newReminder)
                .select()
                .single()

            if (error) {
                throw error
            }

            this.reminders.unshift(data)
            this.renderReminders()
            this.updateEmptyState()
            this.showSuccess('Reminder created successfully!')

            // Track event
            if (window.authManager) {
                await window.authManager.trackUserEvent('reminder_created', {
                    medication_name: reminderData.medicationName,
                    frequency: reminderData.frequency
                })
            }

            return data

        } catch (error) {
            console.error('Error adding reminder:', error)
            this.showError('Failed to create reminder. Please try again.')
            throw error
        } finally {
            this.showLoading(false)
        }
    }

    // Update reminder
    async updateReminder(id, updates) {
        try {
            this.showLoading(true, 'Updating reminder...')

            const { data, error } = await this.supabase
                .from('reminders')
                .update(updates)
                .eq('id', id)
                .eq('user_id', this.currentUser.id)
                .select()
                .single()

            if (error) {
                throw error
            }

            // Update local data
            const index = this.reminders.findIndex(r => r.id === id)
            if (index !== -1) {
                this.reminders[index] = data
                this.renderReminders()
            }

            this.showSuccess('Reminder updated successfully!')

            // Track event
            if (window.authManager) {
                await window.authManager.trackUserEvent('reminder_updated', { reminder_id: id })
            }

            return data

        } catch (error) {
            console.error('Error updating reminder:', error)
            this.showError('Failed to update reminder. Please try again.')
            throw error
        } finally {
            this.showLoading(false)
        }
    }

    // Delete reminder
    async deleteReminder(id) {
        try {
            this.showLoading(true, 'Deleting reminder...')

            const { error } = await this.supabase
                .from('reminders')
                .delete()
                .eq('id', id)
                .eq('user_id', this.currentUser.id)

            if (error) {
                throw error
            }

            // Remove from local data
            this.reminders = this.reminders.filter(r => r.id !== id)
            this.renderReminders()
            this.updateEmptyState()
            this.showSuccess('Reminder deleted successfully!')

            // Track event
            if (window.authManager) {
                await window.authManager.trackUserEvent('reminder_deleted', { reminder_id: id })
            }

        } catch (error) {
            console.error('Error deleting reminder:', error)
            this.showError('Failed to delete reminder. Please try again.')
        } finally {
            this.showLoading(false)
        }
    }

    // Mark medication as taken
    async markAsTaken(reminderId) {
        try {
            const reminder = this.reminders.find(r => r.id === reminderId)
            if (!reminder) return

            // Create log entry
            const logData = {
                user_id: this.currentUser.id,
                reminder_id: reminderId,
                scheduled_time: new Date().toISOString(),
                taken_at: new Date().toISOString(),
                status: 'taken'
            }

            const { error } = await this.supabase
                .from('reminder_logs')
                .insert(logData)

            if (error) {
                throw error
            }

            this.showSuccess(`${reminder.medication_name} marked as taken!`)

            // Track event
            if (window.authManager) {
                await window.authManager.trackUserEvent('medication_taken', {
                    medication_name: reminder.medication_name,
                    reminder_id: reminderId
                })
            }

        } catch (error) {
            console.error('Error marking as taken:', error)
            this.showError('Failed to mark as taken. Please try again.')
        }
    }

    // Render reminders
    renderReminders() {
        const grid = document.getElementById('remindersGrid')
        if (!grid) return

        grid.innerHTML = ''

        if (this.reminders.length === 0) {
            this.updateEmptyState()
            return
        }

        this.reminders.forEach((reminder, index) => {
            const card = this.createReminderCard(reminder)
            grid.appendChild(card)

            // Stagger animation
            setTimeout(() => {
                card.classList.add('visible')
            }, index * 100)
        })
    }

    // Create reminder card
    createReminderCard(reminder) {
        const card = document.createElement('div')
        card.className = 'reminder-card glass-effect'
        card.dataset.id = reminder.id

        const nextTime = reminder.times[0] || '08:00'
        const isOverdue = this.isOverdue(reminder, nextTime)
        const priorityClass = reminder.priority > 1 ? 'high-priority' : ''

        card.innerHTML = `
            <div class="reminder-header">
                <div class="reminder-priority ${priorityClass}">
                    ${reminder.priority > 1 ? '<i class="bx bx-error-circle"></i>' : '<i class="bx bx-pill"></i>'}
                </div>
                <div class="reminder-actions">
                    <button class="action-btn edit" onclick="remindersManager.editReminder('${reminder.id}')">
                        <i class="bx bx-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="remindersManager.confirmDelete('${reminder.id}')">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="reminder-content">
                <h3 class="medication-name">${reminder.medication_name}</h3>
                ${reminder.dosage ? `<p class="dosage">${reminder.dosage}</p>` : ''}
                
                <div class="reminder-schedule">
                    <div class="schedule-item">
                        <i class="bx bx-time"></i>
                        <span>${this.formatTimes(reminder.times)}</span>
                    </div>
                    <div class="schedule-item">
                        <i class="bx bx-calendar"></i>
                        <span>${reminder.frequency}x daily</span>
                    </div>
                </div>
                
                ${reminder.instructions ? `
                    <div class="instructions">
                        <i class="bx bx-info-circle"></i>
                        <span>${reminder.instructions}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="reminder-footer">
                <button class="take-btn" onclick="remindersManager.markAsTaken('${reminder.id}')">
                    <i class="bx bx-check"></i>
                    Mark as Taken
                </button>
                ${isOverdue ? '<span class="overdue-badge">Overdue</span>' : ''}
            </div>
        `

        return card
    }

    // Check if reminder is overdue
    isOverdue(reminder, time) {
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const reminderTime = new Date(`${today} ${time}`)
        return reminderTime < now
    }

    // Format times array
    formatTimes(times) {
        return times.map(time => this.formatTime(time)).join(', ')
    }

    // Format time to 12-hour format
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
    }

    // Render today's reminders for dashboard
    renderTodayReminders() {
        const container = document.getElementById('todayReminders')
        if (!container) return

        const today = new Date().toISOString().split('T')[0]
        const todayReminders = this.reminders.filter(r => {
            return r.start_date <= today && (!r.end_date || r.end_date >= today)
        })

        if (todayReminders.length === 0) {
            container.innerHTML = `
                <div class="no-reminders">
                    <i class="bx bx-check-circle"></i>
                    <p>No reminders for today!</p>
                </div>
            `
            return
        }

        container.innerHTML = todayReminders.map(reminder => `
            <div class="today-reminder-item">
                <div class="reminder-info">
                    <span class="medication-name">${reminder.medication_name}</span>
                    <span class="next-time">${this.formatTimes(reminder.times)}</span>
                </div>
                <button class="quick-take-btn" onclick="remindersManager.markAsTaken('${reminder.id}')">
                    <i class="bx bx-check"></i>
                </button>
            </div>
        `).join('')
    }

    // Update empty state
    updateEmptyState() {
        const grid = document.getElementById('remindersGrid')
        const emptyState = document.getElementById('emptyState')
        
        if (!grid || !emptyState) return

        if (this.reminders.length === 0) {
            grid.style.display = 'none'
            emptyState.style.display = 'flex'
        } else {
            grid.style.display = 'grid'
            emptyState.style.display = 'none'
        }
    }

    // Edit reminder
    editReminder(id) {
        const reminder = this.reminders.find(r => r.id === id)
        if (reminder) {
            this.openReminderModal(reminder)
        }
    }

    // Confirm delete
    confirmDelete(id) {
        const reminder = this.reminders.find(r => r.id === id)
        if (reminder) {
            if (confirm(`Are you sure you want to delete "${reminder.medication_name}"?`)) {
                this.deleteReminder(id)
            }
        }
    }

    // Open reminder modal
    openReminderModal(reminder = null) {
        // Implementation for opening modal would go here
        // For now, we'll redirect to add reminder page
        window.location.href = '/html/add-reminder.html' + (reminder ? `?edit=${reminder.id}` : '')
    }

    // Theme handling
    initializeTheme() {
        const theme = localStorage.getItem('theme') || 'light'
        document.body.classList.toggle('dark-mode', theme === 'dark')
        this.updateThemeIcon()
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode')
        const isDark = document.body.classList.contains('dark-mode')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        this.updateThemeIcon()
    }

    updateThemeIcon() {
        const themeToggle = document.querySelector('.theme-toggle')
        if (themeToggle) {
            const isDark = document.body.classList.contains('dark-mode')
            themeToggle.innerHTML = `<i class="bx ${isDark ? 'bx-sun' : 'bx-moon'}"></i>`
        }
    }

    // Event listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle')
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme())
        }

        // Add reminder button
        const addBtn = document.getElementById('addReminderBtn')
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openReminderModal())
        }

        // Sign out button
        const signOutBtn = document.querySelector('.sign-out-btn')
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                if (window.authManager) {
                    window.authManager.signOut()
                }
            })
        }
    }

    // Loading state
    showLoading(show, message = 'Loading...') {
        this.isLoading = show
        
        if (show) {
            if (window.authManager) {
                window.authManager.showLoadingState(message)
            }
        }
    }

    // Success message
    showSuccess(message) {
        if (window.authManager) {
            window.authManager.showSuccess(message)
        }
    }

    // Error message
    showError(message) {
        if (window.authManager) {
            window.authManager.showError(message)
        }
    }
}

// Initialize reminders manager
const remindersManager = new RemindersManager()

// Make it globally accessible
window.remindersManager = remindersManager 