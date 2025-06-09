// Form Validation System
const ValidationSystem = {
    // Validation rules
    rules: {
        required: {
            test: value => value.trim().length > 0,
            message: 'This field is required'
        },
        email: {
            test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        phone: {
            test: value => /^\+?[\d\s-]{10,}$/.test(value),
            message: 'Please enter a valid phone number'
        },
        password: {
            test: value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
            message: 'Password must be at least 8 characters with letters and numbers'
        },
        date: {
            test: value => !isNaN(Date.parse(value)),
            message: 'Please enter a valid date'
        },
        time: {
            test: value => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            message: 'Please enter a valid time (HH:MM)'
        }
    },

    // Initialize validation
    init() {
        this.setupForms();
        this.setupLiveValidation();
    },

    // Setup form validation
    setupForms() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm(form)) {
                    // If validation passes, check if form has custom handler
                    const handler = form.dataset.handler;
                    if (handler && window.app && window.app[handler]) {
                        window.app[handler](form);
                    } else {
                        // Default form submission
                        form.submit();
                    }
                }
            });
        });
    },

    // Setup live validation
    setupLiveValidation() {
        document.querySelectorAll('[data-validate]').forEach(input => {
            ['input', 'blur'].forEach(event => {
                input.addEventListener(event, () => {
                    this.validateField(input);
                });
            });
        });
    },

    // Validate entire form
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    // Validate single field
    validateField(field) {
        const rules = field.dataset.validate.split(' ');
        const value = field.value;
        let isValid = true;
        let errorMessage = '';
        
        // Check each validation rule
        for (const rule of rules) {
            if (this.rules[rule]) {
                if (!this.rules[rule].test(value)) {
                    isValid = false;
                    errorMessage = this.rules[rule].message;
                    break;
                }
            }
        }
        
        // Update UI
        this.updateFieldUI(field, isValid, errorMessage);
        
        return isValid;
    },

    // Update field UI based on validation
    updateFieldUI(field, isValid, errorMessage) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Update field classes
        field.classList.toggle('is-invalid', !isValid);
        field.classList.toggle('is-valid', isValid);
        
        // Add error message if invalid
        if (!isValid) {
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-error text-danger text-sm mt-1';
            errorElement.textContent = errorMessage;
            field.parentNode.appendChild(errorElement);
        }
    },

    // Custom validation rules
    addRule(name, rule) {
        this.rules[name] = rule;
    },

    // Reset form validation
    resetForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        fields.forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
            const error = field.parentNode.querySelector('.validation-error');
            if (error) {
                error.remove();
            }
        });
    },

    // Get form data as object
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
};

// Initialize validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ValidationSystem.init();
    
    // Add custom validation rules if needed
    ValidationSystem.addRule('age', {
        test: value => parseInt(value) >= 0 && parseInt(value) <= 120,
        message: 'Please enter a valid age (0-120)'
    });
}); 