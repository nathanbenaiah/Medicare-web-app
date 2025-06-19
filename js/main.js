// Main JavaScript - Combined functionality for Medicare Web App

// Global variables
let currentUser = null;
let isAuthenticated = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize application
function initializeApp() {
    console.log('🚀 Medicare Web App Initializing...');
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize forms
    initializeForms();
    
    // Initialize animations
    initializeAnimations();
    
    console.log('✅ Medicare Web App Initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
    
    // Button clicks
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

// Handle navigation
function handleNavigation(event) {
    const href = event.target.getAttribute('href');
    
    // Handle external links
    if (href && href.startsWith('http')) {
        return; // Let default behavior handle external links
    }
    
    // Handle internal navigation
    if (href && href.startsWith('#')) {
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Handle form submissions
function handleFormSubmission(event) {
    const form = event.target;
    const formType = form.getAttribute('data-form-type');
    
    switch (formType) {
        case 'auth':
            handleAuthForm(event);
            break;
        case 'appointment':
            handleAppointmentForm(event);
            break;
        case 'contact':
            handleContactForm(event);
            break;
        default:
            // Default form handling
            break;
    }
}

// Handle button clicks
function handleButtonClick(event) {
    const button = event.target;
    const action = button.getAttribute('data-action');
    
    switch (action) {
        case 'start-assessment':
            startAssessment(button.getAttribute('data-assessment-type'));
            break;
        case 'book-appointment':
            openAppointmentModal();
            break;
        case 'toggle-menu':
            toggleMobileMenu();
            break;
        default:
            // Default button handling
            break;
    }
}

// Authentication functions
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            isAuthenticated = true;
            updateUIForAuthenticatedUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            logout();
        }
    }
}

function updateUIForAuthenticatedUser() {
    // Update navigation
    const authLinks = document.querySelectorAll('.auth-required');
    authLinks.forEach(link => {
        link.style.display = 'block';
    });
    
    const guestLinks = document.querySelectorAll('.guest-only');
    guestLinks.forEach(link => {
        link.style.display = 'none';
    });
    
    // Update user info
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = currentUser.name || currentUser.email;
    });
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    isAuthenticated = false;
    window.location.href = '/';
}

// Assessment functions
function startAssessment(assessmentType) {
    if (!isAuthenticated) {
        showAuthModal();
        return;
    }
    
    const assessmentUrls = {
        'diet-planner': '/assessment/diet-planner',
        'symptom-checker': '/assessment/symptom-checker',
        'mental-health': '/assessment/mental-health',
        'womens-health': '/assessment/womens-health',
        'health-report': '/assessment/health-report',
        'medicine-advisor': '/assessment/medicine-advisor',
        'fitness-coach': '/assessment/fitness-coach',
        'sleep-analyzer': '/assessment/sleep-analyzer',
        'chronic-condition': '/assessment/chronic-condition',
        'risk-predictor': '/assessment/risk-predictor'
    };
    
    const url = assessmentUrls[assessmentType];
    if (url) {
        window.location.href = url;
    } else {
        console.error('Unknown assessment type:', assessmentType);
    }
}

// Mobile menu functions
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Form handling functions
function initializeForms() {
    // Add form validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError({ target: field });
    
    // Required field validation
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Animation functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Export functions for use in other scripts
window.MedicareApp = {
    showNotification,
    showModal,
    hideModal,
    startAssessment,
    logout,
    currentUser,
    isAuthenticated
}; 