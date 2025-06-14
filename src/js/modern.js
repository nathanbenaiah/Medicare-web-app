// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements with data-animate attribute
    const animateElements = document.querySelectorAll('[data-animate]');
    animateElements.forEach(el => observer.observe(el));

    // Active nav link
    const navLinkElements = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navDropdowns = document.querySelectorAll('.nav-dropdown');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            // Toggle menu icon
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.toggle('bx-menu');
            menuIcon.classList.toggle('bx-x');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks?.classList.remove('show');
            mobileMenuBtn?.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.classList.add('bx-menu');
                icon.classList.remove('bx-x');
            }
        }
    });

    // Handle dropdowns on mobile
    navDropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        const content = dropdown.querySelector('.nav-dropdown-content');

        if (window.innerWidth <= 768) {
            btn?.addEventListener('click', (e) => {
                e.preventDefault();
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            });
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('show');
            }
        });
    });

    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Hero section parallax effect
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // Menu Animation
    const menuItems = document.querySelectorAll('.menu-item');
    const indicator = document.querySelector('.menu-indicator');
    
    // Set initial position of indicator
    const activeItem = document.querySelector('.menu-item.active');
    if (activeItem && indicator) {
        indicator.style.width = `${activeItem.offsetWidth}px`;
        indicator.style.left = `${activeItem.offsetLeft}px`;
    }

    // Handle menu item hover
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (indicator) {
                indicator.style.width = `${item.offsetWidth}px`;
                indicator.style.left = `${item.offsetLeft}px`;
            }
        });

        item.addEventListener('click', (e) => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Reset indicator to active item when mouse leaves menu
    const menuContent = document.querySelector('.menu-content');
    if (menuContent) {
        menuContent.addEventListener('mouseleave', () => {
            const activeItem = document.querySelector('.menu-item.active');
            if (activeItem && indicator) {
                indicator.style.width = `${activeItem.offsetWidth}px`;
                indicator.style.left = `${activeItem.offsetLeft}px`;
            }
        });
    }
});

// Add loading animation for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navDropdowns = document.querySelectorAll('.nav-dropdown');
const navLinkElements = document.querySelectorAll('.nav-link');

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        // Toggle menu icon
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.toggle('bx-menu');
        menuIcon.classList.toggle('bx-x');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navLinks?.classList.remove('show');
        mobileMenuBtn?.classList.remove('active');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.classList.add('bx-menu');
            icon.classList.remove('bx-x');
        }
    }
});

// Handle dropdowns on mobile
navDropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-dropdown-btn');
    const content = dropdown.querySelector('.nav-dropdown-content');

    if (window.innerWidth <= 768) {
        btn?.addEventListener('click', (e) => {
            e.preventDefault();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    }
});

// Active link highlighting
const currentPath = window.location.pathname;
navLinkElements.forEach(link => {
    if (link.getAttribute('href') === currentPath.split('/').pop()) {
        link.classList.add('active');
    }
});

// Calendar Functionality
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        this.init();
    }

    init() {
        // Initialize calendar elements
        this.calendarDays = document.querySelector('.calendar-days');
        this.currentMonthElement = document.querySelector('.current-month');
        const prevMonthBtn = document.querySelector('.date-navigation .btn-icon:first-child');
        const nextMonthBtn = document.querySelector('.date-navigation .btn-icon:last-child');
        const viewControls = document.querySelectorAll('.view-controls .btn-secondary');

        if (!this.calendarDays) return; // Not on schedule page

        // Add event listeners
        prevMonthBtn?.addEventListener('click', () => this.changeMonth(-1));
        nextMonthBtn?.addEventListener('click', () => this.changeMonth(1));
        viewControls?.forEach(btn => {
            btn.addEventListener('click', () => {
                viewControls.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // TODO: Implement view change functionality
            });
        });

        this.renderCalendar();
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    renderCalendar() {
        if (!this.calendarDays || !this.currentMonthElement) return;

        // Update month display
        this.currentMonthElement.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;

        // Clear existing calendar
        this.calendarDays.innerHTML = '';

        // Get first day of month and total days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();

        // Add previous month's days
        const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(prevMonthDays - i, 'other-month');
            this.calendarDays.appendChild(dayElement);
        }

        // Add current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() && 
                           this.currentMonth === today.getMonth() && 
                           this.currentYear === today.getFullYear();
            const dayElement = this.createDayElement(i, isToday ? 'today' : '');
            this.calendarDays.appendChild(dayElement);
        }

        // Add next month's days
        const totalDays = this.calendarDays.children.length;
        const remainingDays = 42 - totalDays; // 6 rows × 7 days
        for (let i = 1; i <= remainingDays; i++) {
            const dayElement = this.createDayElement(i, 'other-month');
            this.calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(day, className = '') {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${className}`;
        dayElement.innerHTML = `<span class="day-number">${day}</span>`;
        
        // Add click event
        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayElement.classList.add('selected');
            // TODO: Show appointments for selected day
        });

        return dayElement;
    }
}

// Reminders Functionality
class Reminders {
    constructor() {
        this.init();
    }

    init() {
        const filterButtons = document.querySelectorAll('.filter-controls .btn-secondary');
        const reminderCards = document.querySelectorAll('.reminder-card');
        const addReminderBtn = document.querySelector('.reminders-controls .btn-primary');

        if (!filterButtons.length) return; // Not on reminders page

        // Add event listeners for filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterReminders(btn.textContent.toLowerCase());
            });
        });

        // Add event listeners for reminder actions
        reminderCards.forEach(card => {
            const actionButtons = card.querySelectorAll('.reminder-actions .btn-icon');
            actionButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('title').toLowerCase();
                    this.handleReminderAction(action, card);
                });
            });
        });

        // Add reminder button
        addReminderBtn?.addEventListener('click', () => {
            // TODO: Implement add reminder functionality
            console.log('Add reminder clicked');
        });
    }

    filterReminders(filter) {
        const reminderCards = document.querySelectorAll('.reminder-card');
        reminderCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'flex';
                return;
            }
            
            const type = card.querySelector('.reminder-type').classList.contains('medication') ? 
                'medications' : 'appointments';
            card.style.display = type === filter ? 'flex' : 'none';
        });
    }

    handleReminderAction(action, card) {
        switch (action) {
            case 'take now':
            case 'confirm':
                this.completeReminder(card);
                break;
            case 'skip':
            case 'cancel':
                this.skipReminder(card);
                break;
            case 'edit':
                this.editReminder(card);
                break;
            case 'reschedule':
                this.rescheduleReminder(card);
                break;
        }
    }

    completeReminder(card) {
        card.classList.add('completed');
        setTimeout(() => {
            card.style.height = card.offsetHeight + 'px';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        }, 1000);
    }

    skipReminder(card) {
        card.style.height = card.offsetHeight + 'px';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 300);
    }

    editReminder(card) {
        // TODO: Implement edit functionality
        console.log('Edit reminder:', card);
    }

    rescheduleReminder(card) {
        // TODO: Implement reschedule functionality
        console.log('Reschedule reminder:', card);
    }
}

// Dashboard Functionality
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.initQuickActions();
        this.initStatCards();
        this.startCountdown();
    }

    initQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.textContent.trim();
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'New Appointment':
                this.showModal('new-appointment');
                break;
            case 'Add Medication':
                this.showModal('add-medication');
                break;
            case 'Share Schedule':
                this.shareSchedule();
                break;
            case 'Export Report':
                this.exportReport();
                break;
        }
    }

    showModal(type) {
        // Create modal HTML
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${type === 'new-appointment' ? 'New Appointment' : 'Add Medication'}</h2>
                    <button class="close-btn"><i class="bx bx-x"></i></button>
                </div>
                <div class="modal-body">
                    ${this.getModalContent(type)}
                </div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => modal.remove());

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Animation
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        });
    }

    getModalContent(type) {
        if (type === 'new-appointment') {
            return `
                <form class="form">
                    <div class="form-group">
                        <label>Appointment Type</label>
                        <select required>
                            <option value="">Select type...</option>
                            <option value="medical">Medical Checkup</option>
                            <option value="dental">Dental</option>
                            <option value="specialist">Specialist</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" required>
                    </div>
                    <div class="form-group">
                        <label>Doctor/Provider</label>
                        <input type="text" placeholder="Enter name">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" placeholder="Enter location">
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea placeholder="Add any notes..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Appointment</button>
                </form>
            `;
        } else {
            return `
                <form class="form">
                    <div class="form-group">
                        <label>Medication Name</label>
                        <input type="text" required placeholder="Enter medication name">
                    </div>
                    <div class="form-group">
                        <label>Dosage</label>
                        <input type="text" required placeholder="e.g., 10mg">
                    </div>
                    <div class="form-group">
                        <label>Frequency</label>
                        <select required>
                            <option value="">Select frequency...</option>
                            <option value="daily">Once Daily</option>
                            <option value="twice">Twice Daily</option>
                            <option value="thrice">Three Times Daily</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Time(s)</label>
                        <input type="time" required>
                    </div>
                    <div class="form-group">
                        <label>Duration</label>
                        <div class="duration-inputs">
                            <input type="number" placeholder="Duration">
                            <select>
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea placeholder="Add any instructions or notes..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Medication</button>
                </form>
            `;
        }
    }

    shareSchedule() {
        // Implementation for sharing schedule
        const shareData = {
            title: 'My Medical Schedule',
            text: 'Check out my medical schedule',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch(console.error);
        } else {
            // Fallback
            this.showModal('share');
        }
    }

    exportReport() {
        // Implementation for exporting report
        const today = new Date().toISOString().split('T')[0];
        const filename = `medical-report-${today}.pdf`;
        
        // Show export progress
        const notification = this.showNotification('Generating report...', 'loading');
        
        // Simulate export process
        setTimeout(() => {
            notification.remove();
            this.showNotification('Report exported successfully!', 'success');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="bx ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        // Auto remove after 3 seconds
        if (type !== 'loading') {
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        return notification;
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'bx-check-circle';
            case 'error': return 'bx-x-circle';
            case 'loading': return 'bx-loader-alt bx-spin';
            default: return 'bx-info-circle';
        }
    }

    initStatCards() {
        // Add hover effect to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    startCountdown() {
        const nextReminderElement = document.querySelector('.stat-card .stat-number');
        if (!nextReminderElement) return;

        let timeLeft = this.parseTimeString(nextReminderElement.textContent);
        
        setInterval(() => {
            timeLeft -= 60000; // Subtract one minute
            if (timeLeft <= 0) {
                nextReminderElement.textContent = 'Now';
                return;
            }
            nextReminderElement.textContent = this.formatTimeLeft(timeLeft);
        }, 60000);
    }

    parseTimeString(timeStr) {
        const [hours, minutes] = timeStr.split('h ')[0].split(' ')[0].split(':');
        return (parseInt(hours) * 60 + parseInt(minutes)) * 60000;
    }

    formatTimeLeft(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
    new Reminders();
    new Dashboard();

    // Add animation to elements
    document.querySelectorAll('[data-animate]').forEach(element => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    });
});

// Appointment Management
document.addEventListener('DOMContentLoaded', function() {
    // Modal handling
    const modal = document.getElementById('addAppointmentModal');
    const addAppointmentBtn = document.querySelector('.action-btn');
    const closeBtn = document.querySelector('.close-btn');

    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle appointment form submission
    const appointmentForm = document.querySelector('.modal form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const type = document.getElementById('appointmentType').value;
            const doctor = document.getElementById('doctorName').value;
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            const location = document.getElementById('location').value;
            const notes = document.getElementById('notes').value;
            const reminder = document.getElementById('reminder').value;

            // Create new appointment card
            createAppointmentCard({
                type,
                doctor,
                date,
                time,
                location,
                notes,
                reminder
            });

            // Clear form and close modal
            appointmentForm.reset();
            modal.style.display = 'none';

            // Show success notification
            showNotification('Appointment added successfully!', 'success');
        });
    }

    // Handle appointment actions
    document.querySelector('.appointment-list').addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const card = button.closest('.appointment-card');
        
        if (button.title.includes('Delete')) {
            if (confirm('Are you sure you want to delete this appointment?')) {
                card.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    card.remove();
                    showNotification('Appointment deleted successfully!', 'success');
                }, 300);
            }
        } else if (button.title.includes('Edit')) {
            // Populate form with current values
            const title = card.querySelector('h4').textContent;
            const date = card.querySelector('.bx-calendar').parentNode.textContent.trim();
            const time = card.querySelector('.bx-time').parentNode.textContent.trim();
            const location = card.querySelector('.bx-map').parentNode.textContent.trim();
            const notes = card.querySelector('.bx-note')?.parentNode.textContent.trim() || '';

            // Show modal with populated values
            document.getElementById('doctorName').value = title.split(' - ')[1] || '';
            document.getElementById('location').value = location;
            document.getElementById('notes').value = notes;

            modal.style.display = 'flex';
        } else if (button.title.includes('Reminder')) {
            showNotification('Reminder set for this appointment!', 'success');
        }
    });
});

// Helper function to create new appointment card
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.style.animation = 'cardEnter 0.3s ease forwards';

    card.innerHTML = `
        <div class="appointment-type ${appointment.type}">
            <i class='bx bx-${appointment.type === 'medical' ? 'plus-medical' : 'capsule'}'></i>
        </div>
        <div class="appointment-details">
            <h4>${appointment.doctor} - ${appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</h4>
            <p><i class='bx bx-calendar'></i> ${formatDate(appointment.date)}</p>
            <p><i class='bx bx-time'></i> ${formatTime(appointment.time)}</p>
            <p><i class='bx bx-map'></i> ${appointment.location}</p>
            ${appointment.notes ? `<p><i class='bx bx-note'></i> ${appointment.notes}</p>` : ''}
        </div>
        <div class="appointment-actions">
            <button title="Edit Appointment"><i class='bx bx-edit-alt'></i></button>
            <button title="Delete Appointment"><i class='bx bx-trash'></i></button>
            <button title="Set Reminder"><i class='bx bx-bell'></i></button>
        </div>
        <span class="appointment-status status-upcoming">Upcoming</span>
    `;

    document.querySelector('.appointment-list').prepend(card);
}

// Helper function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class='bx ${type === 'success' ? 'bx-check' : 'bx-x'}'></i>
        ${message}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Helper function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Helper function to format time
function formatTime(time) {
    return new Date(`2000/01/01 ${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes cardEnter {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Schedule Page Management
class ScheduleManager {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.events = this.loadEvents();
        this.initializeCalendar();
    }

    initializeCalendar() {
        this.updateCalendarHeader();
        this.renderCalendar();
        this.updateStats();
    }

    loadEvents() {
        const savedEvents = localStorage.getItem('events');
        return savedEvents ? JSON.parse(savedEvents) : [];
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
        this.updateStats();
    }

    updateCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.querySelector('.current-month').textContent = 
            `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderCalendar() {
        const daysContainer = document.querySelector('.calendar-days');
        if (!daysContainer) return;

        daysContainer.innerHTML = '';
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Previous month days
        for (let i = 0; i < startingDay; i++) {
            const prevDate = new Date(firstDay);
            prevDate.setDate(prevDate.getDate() - (startingDay - i));
            this.createDayElement(daysContainer, prevDate, true);
        }

        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            const currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
            this.createDayElement(daysContainer, currentDate, false);
        }

        // Next month days
        const remainingDays = 42 - (startingDay + totalDays); // 42 = 6 rows × 7 days
        for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(lastDay);
            nextDate.setDate(nextDate.getDate() + i);
            this.createDayElement(daysContainer, nextDate, true);
        }
    }

    createDayElement(container, date, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day' + (isOtherMonth ? ' other-month' : '');
        
        // Add current day highlight
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('current-day');
        }

        // Add date number
        const dateNumber = document.createElement('span');
        dateNumber.className = 'date-number';
        dateNumber.textContent = date.getDate();
        dayElement.appendChild(dateNumber);

        // Add events for this day
        const dayEvents = this.getEventsForDate(date);
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            dayEvents.forEach(event => {
                const eventDot = document.createElement('span');
                eventDot.className = `event-dot ${event.type}`;
                eventDot.title = event.title;
                eventsContainer.appendChild(eventDot);
            });

            dayElement.appendChild(eventsContainer);
        }

        // Add click event
        dayElement.addEventListener('click', () => this.handleDayClick(date));
        
        container.appendChild(dayElement);
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    handleDayClick(date) {
        const events = this.getEventsForDate(date);
        if (events.length > 0) {
            this.showEventDetailsModal(date, events);
        } else {
            this.showAddEventModal(date);
        }
    }

    showEventDetailsModal(date, events) {
        const modal = document.getElementById('eventDetailsModal');
        if (!modal) return;

        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h3>${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <div class="events-list">
                ${events.map(event => `
                    <div class="event-item ${event.type}">
                        <div class="event-time">${event.time}</div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-location">${event.location}</div>
                        ${event.notes ? `<div class="event-notes">${event.notes}</div>` : ''}
                        <div class="event-actions">
                            <button class="btn btn-icon" onclick="scheduleManager.editEvent('${event.id}')">
                                <i class='bx bx-edit-alt'></i>
                            </button>
                            <button class="btn btn-icon" onclick="scheduleManager.deleteEvent('${event.id}')">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" onclick="scheduleManager.showAddEventModal('${date.toISOString()}')">
                <i class='bx bx-plus'></i> Add Event
            </button>
        `;

        modal.style.display = 'flex';
    }

    showAddEventModal(date, eventData = null) {
        const modal = document.getElementById('addAppointmentModal');
        if (!modal) return;

        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            if (date) {
                form.elements.appointmentDate.value = date.split('T')[0];
            }
            if (eventData) {
                form.elements.appointmentType.value = eventData.type;
                form.elements.doctorName.value = eventData.title.split(' - ')[0];
                form.elements.appointmentDate.value = eventData.date;
                form.elements.appointmentTime.value = eventData.time;
                form.elements.location.value = eventData.location;
                form.elements.notes.value = eventData.notes || '';
            }
        }

        modal.style.display = 'flex';
    }

    handleFormSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const eventData = {
            id: formData.get('id') || Date.now().toString(),
            type: formData.get('appointmentType'),
            title: `${formData.get('doctorName')} - ${formData.get('appointmentType')}`,
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            location: formData.get('location'),
            notes: formData.get('notes'),
        };

        const existingEventIndex = this.events.findIndex(e => e.id === eventData.id);
        if (existingEventIndex !== -1) {
            this.events[existingEventIndex] = eventData;
        } else {
            this.events.push(eventData);
        }

        this.saveEvents();
        this.renderCalendar();
        this.updateUpcomingAppointments();

        const modal = form.closest('.modal');
        if (modal) modal.style.display = 'none';

        buttonManager.showNotification('Event saved successfully', 'success');
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showAddEventModal(null, event);
        }
    }

    deleteEvent(eventId) {
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            this.events.splice(eventIndex, 1);
            this.saveEvents();
            this.renderCalendar();
            this.updateUpcomingAppointments();
            buttonManager.showNotification('Event deleted successfully', 'success');
        }
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.updateCalendarHeader();
        this.renderCalendar();
    }

    changeView(view) {
        this.currentView = view;
        this.renderCalendar();
    }

    updateStats() {
        // Update today's events count
        const todayEvents = this.getEventsForDate(new Date());
        const todayMedications = todayEvents.filter(e => e.type === 'medication').length;
        const todayAppointments = todayEvents.filter(e => e.type === 'medical').length;
        
        const todayEventsElement = document.querySelector('.stat-card:first-child .stat-number');
        const todayEventsText = document.querySelector('.stat-card:first-child .stat-text');
        
        if (todayEventsElement && todayEventsText) {
            todayEventsElement.textContent = todayEvents.length;
            todayEventsText.textContent = `${todayMedications} medications, ${todayAppointments} appointment${todayAppointments !== 1 ? 's' : ''}`;
        }

        // Update next reminder
        const upcomingEvents = this.events
            .filter(e => new Date(e.date + ' ' + e.time) > new Date())
            .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

        const nextReminderTime = document.querySelector('.stat-card:nth-child(3) .stat-number');
        const nextReminderText = document.querySelector('.stat-card:nth-child(3) .stat-text');
        
        if (nextReminderTime && nextReminderText && upcomingEvents.length > 0) {
            const nextEvent = upcomingEvents[0];
            const eventTime = new Date(nextEvent.date + ' ' + nextEvent.time);
            const timeUntil = this.getTimeUntil(eventTime);
            
            nextReminderTime.textContent = timeUntil;
            nextReminderText.textContent = nextEvent.title;
        }
    }

    getTimeUntil(date) {
        const now = new Date();
        const diff = date - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return `${hours}h ${minutes}m`;
    }

    updateUpcomingAppointments() {
        const appointmentList = document.querySelector('.appointment-list');
        if (!appointmentList) return;

        const upcomingEvents = this.events
            .filter(e => new Date(e.date + ' ' + e.time) > new Date())
            .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
            .slice(0, 3);

        appointmentList.innerHTML = upcomingEvents.map(event => `
            <div class="appointment-card" data-id="${event.id}">
                <div class="appointment-type ${event.type}">
                    <i class='bx bx-${event.type === 'medical' ? 'plus-medical' : 'capsule'}'></i>
                </div>
                <div class="appointment-details">
                    <h4>${event.title}</h4>
                    <p><i class='bx bx-calendar'></i> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><i class='bx bx-time'></i> ${event.time}</p>
                    <p><i class='bx bx-map'></i> ${event.location}</p>
                    ${event.notes ? `<p><i class='bx bx-note'></i> ${event.notes}</p>` : ''}
                </div>
                <div class="appointment-actions">
                    <button title="Edit Appointment"><i class='bx bx-edit-alt'></i></button>
                    <button title="Delete Appointment"><i class='bx bx-trash'></i></button>
                    <button title="Set Reminder"><i class='bx bx-bell'></i></button>
                </div>
                <span class="appointment-status status-upcoming">Upcoming</span>
            </div>
        `).join('');
    }

    getAllEvents() {
        return this.events;
    }
}

// Initialize Schedule Manager
const scheduleManager = new ScheduleManager();

// Button Management
class ButtonManager {
    constructor() {
        this.initializeQuickActions();
        this.initializeScheduleControls();
        this.initializeAppointmentActions();
        this.initializeModals();
    }

    initializeQuickActions() {
        const quickActions = document.querySelectorAll('.quick-actions .action-btn');
        quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.textContent.trim();
                switch (action) {
                    case 'New Appointment':
                        this.showModal('addAppointment');
                        break;
                    case 'Add Medication':
                        this.showModal('addMedication');
                        break;
                    case 'Share Schedule':
                        this.shareSchedule();
                        break;
                    case 'Export Report':
                        this.exportReport();
                        break;
                }
            });
        });
    }

    initializeScheduleControls() {
        // Month navigation
        const prevMonthBtn = document.querySelector('.date-navigation .bx-chevron-left').parentElement;
        const nextMonthBtn = document.querySelector('.date-navigation .bx-chevron-right').parentElement;
        
        prevMonthBtn?.addEventListener('click', () => scheduleManager.changeMonth(-1));
        nextMonthBtn?.addEventListener('click', () => scheduleManager.changeMonth(1));

        // View controls
        const viewButtons = document.querySelectorAll('.view-controls .btn-secondary');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                scheduleManager.changeView(btn.textContent.toLowerCase());
            });
        });

        // Add Appointment button in schedule controls
        const addAppointmentBtn = document.querySelector('.schedule-controls .btn-primary');
        addAppointmentBtn?.addEventListener('click', () => this.showModal('addAppointment'));
    }

    initializeAppointmentActions() {
        document.querySelector('.appointment-list')?.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const card = button.closest('.appointment-card');
            if (!card) return;

            const action = button.title.toLowerCase();
            const appointmentId = card.dataset.id;

            switch (action) {
                case 'edit appointment':
                    this.editAppointment(card);
                    break;
                case 'delete appointment':
                    this.deleteAppointment(card);
                    break;
                case 'set reminder':
                    this.setReminder(card);
                    break;
            }
        });
    }

    initializeModals() {
        // Close buttons for all modals
        document.querySelectorAll('.modal .close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Form submissions
        document.querySelectorAll('.modal form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formType = form.dataset.type;
                this.handleFormSubmission(e, formType);
            });
        });
    }

    showModal(type) {
        const modal = document.getElementById(`${type}Modal`);
        if (!modal) return;

        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();

        modal.style.display = 'flex';
    }

    editAppointment(card) {
        const appointmentData = {
            id: card.dataset.id,
            title: card.querySelector('h4').textContent,
            date: card.querySelector('.bx-calendar').parentNode.textContent.trim(),
            time: card.querySelector('.bx-time').parentNode.textContent.trim(),
            location: card.querySelector('.bx-map').parentNode.textContent.trim(),
            notes: card.querySelector('.bx-note')?.parentNode.textContent.trim() || '',
            type: card.querySelector('.appointment-type').classList.contains('medical') ? 'medical' : 'medication'
        };

        scheduleManager.showAddEventModal(null, appointmentData);
    }

    deleteAppointment(card) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            card.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                card.remove();
                scheduleManager.deleteEvent(card.dataset.id);
                this.showNotification('Appointment deleted successfully', 'success');
            }, 300);
        }
    }

    setReminder(card) {
        const title = card.querySelector('h4').textContent;
        const date = card.querySelector('.bx-calendar').parentNode.textContent.trim();
        const time = card.querySelector('.bx-time').parentNode.textContent.trim();

        const reminderModal = document.getElementById('setReminderModal');
        if (reminderModal) {
            const form = reminderModal.querySelector('form');
            if (form) {
                form.elements.eventTitle.value = title;
                form.elements.eventDate.value = this.formatDateForInput(date);
                form.elements.eventTime.value = this.formatTimeForInput(time);
            }
            reminderModal.style.display = 'flex';
        } else {
            this.showNotification('Reminder set for ' + title, 'success');
        }
    }

    shareSchedule() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.style.display = 'flex';
        } else {
            // Fallback to simple share
            if (navigator.share) {
                navigator.share({
                    title: 'My Medical Schedule',
                    text: 'Check out my medical schedule',
                    url: window.location.href
                }).catch(() => {
                    this.showNotification('Schedule copied to clipboard', 'success');
                });
            } else {
                // Copy to clipboard
                const dummy = document.createElement('textarea');
                document.body.appendChild(dummy);
                dummy.value = window.location.href;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                this.showNotification('Schedule copied to clipboard', 'success');
            }
        }
    }

    exportReport() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.style.display = 'flex';
        } else {
            // Fallback to direct download
            this.generateAndDownloadReport();
        }
    }

    generateAndDownloadReport() {
        const events = scheduleManager.getAllEvents();
        let report = 'Medical Schedule Report\n\n';
        
        events.forEach(event => {
            report += `${event.type.toUpperCase()}: ${event.title}\n`;
            report += `Date: ${event.date}\n`;
            report += `Time: ${event.time}\n`;
            report += `Location: ${event.location}\n`;
            if (event.notes) report += `Notes: ${event.notes}\n`;
            report += '\n';
        });

        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'medical-schedule-report.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.showNotification('Report downloaded successfully', 'success');
    }

    handleFormSubmission(e, formType) {
        e.preventDefault();
        const form = e.target;
        
        switch (formType) {
            case 'appointment':
            case 'medication':
                scheduleManager.handleFormSubmission(e);
                break;
            case 'reminder':
                this.handleReminderSubmission(form);
                break;
            case 'share':
                this.handleShareSubmission(form);
                break;
            case 'export':
                this.handleExportSubmission(form);
                break;
        }

        // Close modal
        const modal = form.closest('.modal');
        if (modal) modal.style.display = 'none';
    }

    formatDateForInput(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    }

    formatTimeForInput(timeStr) {
        return timeStr.replace(/\s/g, '').toLowerCase();
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class='bx ${type === 'success' ? 'bx-check' : 'bx-x'}'></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize Button Manager
const buttonManager = new ButtonManager();

// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.floating-sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    // Toggle sidebar when clicking the menu button
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Handle active state of navigation links
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}); 