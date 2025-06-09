/**
 * BUTTON MANAGER - Comprehensive button functionality system
 * Handles all button interactions, states, and behaviors
 */

class ButtonManager {
    constructor() {
        this.buttons = new Map();
        this.loadingButtons = new Set();
        this.disabledButtons = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeRippleEffect();
        this.initializeLoadingStates();
        this.initializeFormButtons();
        this.initializeNavigationButtons();
        this.initializeModalButtons();
        this.initializeActionButtons();
    }

    // ============================
    // EVENT LISTENERS SETUP
    // ============================
    
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindAllButtons();
        });

        // Handle dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.bindNewButtons(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    bindAllButtons() {
        // Bind all existing buttons
        document.querySelectorAll('.btn').forEach(btn => {
            this.bindButton(btn);
        });
    }

    bindNewButtons(container) {
        // Bind newly added buttons
        container.querySelectorAll('.btn').forEach(btn => {
            this.bindButton(btn);
        });
    }

    bindButton(button) {
        if (button.dataset.bound) return; // Already bound
        
        button.dataset.bound = 'true';
        
        // Add ripple effect if enabled
        if (button.classList.contains('btn-ripple')) {
            this.addRippleEffect(button);
        }

        // Handle click events
        button.addEventListener('click', (e) => {
            this.handleButtonClick(e, button);
        });

        // Handle keyboard events
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleButtonClick(e, button);
            }
        });

        // Handle focus/blur for accessibility
        button.addEventListener('focus', () => {
            this.handleButtonFocus(button);
        });

        button.addEventListener('blur', () => {
            this.handleButtonBlur(button);
        });
    }

    // ============================
    // BUTTON CLICK HANDLING
    // ============================

    handleButtonClick(event, button) {
        // Don't process if button is disabled or loading
        if (button.disabled || button.classList.contains('loading') || button.classList.contains('disabled')) {
            event.preventDefault();
            return false;
        }

        // Get button action
        const action = button.dataset.action;
        const href = button.getAttribute('href');
        const form = button.closest('form');

        // Handle specific actions
        if (action) {
            event.preventDefault();
            this.executeAction(action, button, event);
        } else if (href && href !== '#') {
            // Handle navigation
            this.handleNavigation(href, button, event);
        } else if (form && button.type === 'submit') {
            // Handle form submission
            this.handleFormSubmission(form, button, event);
        }

        // Add loading state if specified
        if (button.dataset.loading !== 'false') {
            this.setLoading(button, true);
        }
    }

    executeAction(action, button, event) {
        const actions = {
            // Authentication actions
            'login': () => this.handleLogin(button),
            'logout': () => this.handleLogout(button),
            'signup': () => this.handleSignup(button),
            'forgot-password': () => this.handleForgotPassword(button),

            // Modal actions
            'show-modal': () => this.showModal(button.dataset.target),
            'hide-modal': () => this.hideModal(button.dataset.target),
            'close-modal': () => this.closeModal(button),

            // CRUD actions
            'add-reminder': () => this.showAddReminderModal(),
            'add-appointment': () => this.showAddAppointmentModal(),
            'add-family': () => this.showAddFamilyModal(),
            'edit': () => this.editItem(button),
            'delete': () => this.deleteItem(button),
            'save': () => this.saveItem(button),
            'cancel': () => this.cancelAction(button),

            // Reminder actions
            'take-medication': () => this.takeMedication(button),
            'skip-medication': () => this.skipMedication(button),
            'reschedule': () => this.rescheduleReminder(button),

            // Appointment actions
            'confirm-appointment': () => this.confirmAppointment(button),
            'cancel-appointment': () => this.cancelAppointment(button),

            // Navigation actions
            'navigate': () => this.navigate(button.dataset.href),
            'back': () => this.goBack(),
            'refresh': () => this.refreshPage(),

            // Utility actions
            'copy': () => this.copyToClipboard(button),
            'share': () => this.shareContent(button),
            'print': () => this.printContent(button),
            'export': () => this.exportData(button),

            // Filter and search actions
            'filter': () => this.filterContent(button),
            'search': () => this.searchContent(button),
            'clear-filters': () => this.clearFilters(button),

            // Settings actions
            'toggle-notifications': () => this.toggleNotifications(button),
            'change-theme': () => this.changeTheme(button),
            'update-profile': () => this.updateProfile(button)
        };

        if (actions[action]) {
            actions[action]();
        } else {
            console.warn(`Unknown action: ${action}`);
            this.setLoading(button, false);
        }
    }

    // ============================
    // LOADING STATES
    // ============================

    setLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            this.loadingButtons.add(button);
            
            // Store original content
            if (!button.dataset.originalContent) {
                button.dataset.originalContent = button.innerHTML;
            }
            
            // Auto-remove loading after timeout (prevent stuck states)
            setTimeout(() => {
                if (button.classList.contains('loading')) {
                    this.setLoading(button, false);
                }
            }, 30000); // 30 second timeout
            
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            this.loadingButtons.delete(button);
            
            // Restore original content if it was stored
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
                delete button.dataset.originalContent;
            }
        }
    }

    initializeLoadingStates() {
        // Handle form submissions automatically
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('no-loading')) {
                this.setLoading(submitBtn, true);
            }
        });
    }

    // ============================
    // RIPPLE EFFECT
    // ============================

    initializeRippleEffect() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-ripple');
            if (button) {
                this.createRipple(e, button);
            }
        });
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addRippleEffect(button) {
        if (!button.classList.contains('btn-ripple')) {
            button.classList.add('btn-ripple');
        }
    }

    // ============================
    // FORM HANDLING
    // ============================

    initializeFormButtons() {
        // Handle form validation and submission
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (!this.validateForm(form)) {
                e.preventDefault();
                return false;
            }
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        let errorEl = field.parentNode.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    handleFormSubmission(form, button, event) {
        if (!this.validateForm(form)) {
            event.preventDefault();
            this.setLoading(button, false);
            return false;
        }

        // Handle form submission based on form ID or class
        const formId = form.id;
        const formClass = form.className;

        if (formId.includes('reminder') || formClass.includes('reminder')) {
            this.handleReminderForm(form, button);
        } else if (formId.includes('appointment') || formClass.includes('appointment')) {
            this.handleAppointmentForm(form, button);
        } else if (formId.includes('family') || formClass.includes('family')) {
            this.handleFamilyForm(form, button);
        } else if (formId.includes('auth') || formClass.includes('auth')) {
            this.handleAuthForm(form, button);
        }
    }

    // ============================
    // MODAL HANDLING
    // ============================

    initializeModalButtons() {
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.active');
                if (openModal) {
                    this.hideModal(openModal.id);
                }
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    closeModal(button) {
        const modal = button.closest('.modal');
        if (modal) {
            this.hideModal(modal.id);
        }
    }

    // ============================
    // ACTION IMPLEMENTATIONS
    // ============================

    // Authentication actions
    async handleLogin(button) {
        try {
            const form = button.closest('form');
            const formData = new FormData(form);
            
            // Simulate API call
            await this.simulateApiCall(2000);
            
            this.showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
            
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'error');
            this.setLoading(button, false);
        }
    }

    async handleLogout(button) {
        try {
            // Simulate API call
            await this.simulateApiCall(1000);
            
            this.showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
            
        } catch (error) {
            this.showNotification('Logout failed', 'error');
            this.setLoading(button, false);
        }
    }

    async handleSignup(button) {
        try {
            const form = button.closest('form');
            const formData = new FormData(form);
            
            // Validate password confirmation
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            // Simulate API call
            await this.simulateApiCall(3000);
            
            this.showNotification('Account created successfully!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
            
        } catch (error) {
            this.showNotification(error.message || 'Signup failed. Please try again.', 'error');
            this.setLoading(button, false);
        }
    }

    // Modal actions
    showAddReminderModal() {
        this.populateReminderForm();
        this.showModal('addReminderModal');
    }

    showAddAppointmentModal() {
        this.populateAppointmentForm();
        this.showModal('addAppointmentModal');
    }

    showAddFamilyModal() {
        this.populateFamilyForm();
        this.showModal('addFamilyModal');
    }

    // Reminder actions
    async takeMedication(button) {
        try {
            const reminderCard = button.closest('.reminder-card');
            const reminderId = reminderCard.dataset.reminderId;
            
            // Simulate API call
            await this.simulateApiCall(1000);
            
            reminderCard.classList.add('completed');
            this.showNotification('Medication taken successfully', 'success');
            
        } catch (error) {
            this.showNotification('Failed to record medication', 'error');
        } finally {
            this.setLoading(button, false);
        }
    }

    async skipMedication(button) {
        try {
            const reminderCard = button.closest('.reminder-card');
            const reminderId = reminderCard.dataset.reminderId;
            
            // Show confirmation dialog
            if (!confirm('Are you sure you want to skip this medication?')) {
                this.setLoading(button, false);
                return;
            }
            
            // Simulate API call
            await this.simulateApiCall(1000);
            
            reminderCard.classList.add('skipped');
            this.showNotification('Medication skipped', 'warning');
            
        } catch (error) {
            this.showNotification('Failed to skip medication', 'error');
        } finally {
            this.setLoading(button, false);
        }
    }

    // Utility methods
    async simulateApiCall(delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, delay);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="bx ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="btn-close" onclick="this.parentElement.remove()">
                <i class="bx bx-x"></i>
            </button>
        `;

        // Add to container
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'bx-check-circle',
            error: 'bx-error-circle',
            warning: 'bx-error',
            info: 'bx-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Navigation helpers
    navigate(href) {
        if (href) {
            window.location.href = href;
        }
    }

    goBack() {
        window.history.back();
    }

    refreshPage() {
        window.location.reload();
    }

    // Focus and blur handlers
    handleButtonFocus(button) {
        button.classList.add('focused');
    }

    handleButtonBlur(button) {
        button.classList.remove('focused');
    }

    // Form population methods (to be implemented based on your forms)
    populateReminderForm() {
        // Implementation depends on your reminder form structure
        console.log('Populating reminder form...');
    }

    populateAppointmentForm() {
        // Implementation depends on your appointment form structure
        console.log('Populating appointment form...');
    }

    populateFamilyForm() {
        // Implementation depends on your family form structure
        console.log('Populating family form...');
    }

    // Additional action handlers can be added here...
}

// Initialize button manager when DOM is ready
const buttonManager = new ButtonManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButtonManager;
}

// Add global helper functions
window.showModal = (modalId) => buttonManager.showModal(modalId);
window.hideModal = (modalId) => buttonManager.hideModal(modalId);
window.setButtonLoading = (button, isLoading) => buttonManager.setLoading(button, isLoading);
window.showNotification = (message, type) => buttonManager.showNotification(message, type); 