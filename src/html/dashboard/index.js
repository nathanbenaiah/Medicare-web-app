// =====================================================
// 🏥 MEDICARE+ DASHBOARD INDEX
// =====================================================
// Main entry point for all dashboard components and functions

// Import React Components
import SymptomChecker from './components/SymptomChecker.jsx';
import AppointmentScheduler from './components/AppointmentScheduler.jsx';
import VitalSignsRecorder from './components/VitalSignsRecorder.jsx';

// Import Dashboard Functions
import { ModernDashboard } from './js/modern-dashboard-functions.js';
import { ModernProviderDashboard } from './js/modern-provider-functions.js';

// Import Healthcare Backend API
import './js/healthcare-backend-api.js';
import './js/dashboard-integration.js';

// Import Styles
import './css/dashboard-components.css';
import './css/user-dashboard.css';
import './css/provider-dashboard.css';
import './css/dashboard.css';

// Dashboard Configuration
export const DashboardConfig = {
    supabase: {
        url: 'https://gcggnrwqilylyykppizb.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzI4NzEsImV4cCI6MjA0OTU0ODg3MX0.VoPOoOhJbXKJNmu_3HE_bqKdKNqQNhKJOEJzKEHNEJE'
    },
    deepseek: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat'
    },
    features: {
        realTimeUpdates: true,
        aiIntegration: true,
        chartAnalytics: true,
        mobileResponsive: true
    }
};

// Export React Components
export {
    SymptomChecker,
    AppointmentScheduler,
    VitalSignsRecorder
};

// Export Dashboard Classes
export {
    ModernDashboard,
    ModernProviderDashboard
};

// Dashboard Utilities
export const DashboardUtils = {
    // Format date for display
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format time for display
    formatTime: (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    // Calculate BMI
    calculateBMI: (weight, height) => {
        if (!weight || !height) return null;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    },

    // Get BMI category
    getBMICategory: (bmi) => {
        if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
        if (bmi < 25) return { category: 'Normal', color: '#27ae60' };
        if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
        return { category: 'Obese', color: '#e74c3c' };
    },

    // Show toast notification
    showToast: (message, type = 'success') => {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    },

    // Validate vital signs input
    validateVitalSigns: (vitals) => {
        const errors = [];
        
        if (vitals.systolic && (vitals.systolic < 70 || vitals.systolic > 200)) {
            errors.push('Systolic blood pressure should be between 70-200 mmHg');
        }
        
        if (vitals.diastolic && (vitals.diastolic < 40 || vitals.diastolic > 120)) {
            errors.push('Diastolic blood pressure should be between 40-120 mmHg');
        }
        
        if (vitals.heartRate && (vitals.heartRate < 40 || vitals.heartRate > 200)) {
            errors.push('Heart rate should be between 40-200 bpm');
        }
        
        if (vitals.temperature && (vitals.temperature < 95 || vitals.temperature > 110)) {
            errors.push('Temperature should be between 95-110°F');
        }
        
        return errors;
    },

    // Generate health insights
    generateHealthInsights: (vitalSigns, medications) => {
        const insights = [];
        
        // Blood pressure insights
        if (vitalSigns.some(v => v.blood_pressure_systolic > 140)) {
            insights.push({
                type: 'warning',
                title: 'Elevated Blood Pressure',
                message: 'Your recent blood pressure readings are elevated. Consider consulting your healthcare provider.',
                recommendation: 'Monitor blood pressure regularly and maintain a healthy lifestyle.'
            });
        }
        
        // Heart rate insights
        const avgHeartRate = vitalSigns.reduce((sum, v) => sum + (v.heart_rate || 0), 0) / vitalSigns.length;
        if (avgHeartRate > 100) {
            insights.push({
                type: 'info',
                title: 'Elevated Heart Rate',
                message: 'Your average heart rate is above normal range.',
                recommendation: 'Consider stress management techniques and regular exercise.'
            });
        }
        
        // Medication adherence
        if (medications.length > 0) {
            insights.push({
                type: 'success',
                title: 'Medication Management',
                message: `You have ${medications.length} active prescriptions.`,
                recommendation: 'Continue taking medications as prescribed and set up reminders.'
            });
        }
        
        return insights;
    }
};

// Dashboard Event Handlers
export const DashboardEvents = {
    // Initialize dashboard
    init: () => {
        console.log('🏥 MediCare+ Dashboard System Initialized');
        
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        }
        
        // Setup global error handling
        window.addEventListener('error', (event) => {
            console.error('Dashboard Error:', event.error);
            DashboardUtils.showToast('An error occurred. Please try again.', 'error');
        });
        
        // Setup unhandled promise rejection handling
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            DashboardUtils.showToast('A system error occurred. Please refresh the page.', 'error');
        });
    },

    // Handle navigation
    navigate: (page) => {
        const routes = {
            'user-dashboard': '/dashboard/html/user-dashboard-modern.html',
            'provider-dashboard': '/dashboard/html/provider-dashboard-modern.html',
            'appointments': '/html/appointments.html',
            'schedule': '/html/schedule.html',
            'home': '/html/index.html'
        };
        
        if (routes[page]) {
            window.location.href = routes[page];
        }
    },

    // Handle real-time updates
    onDataUpdate: (table, payload) => {
        console.log(`Real-time update for ${table}:`, payload);
        DashboardUtils.showToast(`${table} updated`, 'info');
        
        // Trigger dashboard refresh
        if (window.modernDashboard) {
            window.modernDashboard.loadDashboardData();
        }
        
        if (window.providerDashboard) {
            window.providerDashboard.loadDashboardData();
        }
    }
};

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', DashboardEvents.init);
}

// Export default configuration
export default {
    config: DashboardConfig,
    utils: DashboardUtils,
    events: DashboardEvents,
    components: {
        SymptomChecker,
        AppointmentScheduler,
        VitalSignsRecorder
    }
};

console.log('✅ MediCare+ Dashboard Module Loaded Successfully'); 