// Dashboard Database Connector for MediCare+
// Connects all dashboard buttons with Supabase backend operations

class DashboardDBConnector {
    constructor() {
        this.supabaseUrl = 'https://gcggnrwqilylyykppizb.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE';
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Initialize Supabase client
        if (typeof supabase !== 'undefined') {
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            await this.getCurrentUser();
        } else {
            console.warn('Supabase not loaded, using demo mode');
        }
        this.attachEventListeners();
    }

    async getCurrentUser() {
        try {
            if (this.supabase) {
                const { data: { session } } = await this.supabase.auth.getSession();
                if (session) {
                    this.currentUser = session.user;
                    return;
                }
            }
            
            // Fallback to localStorage for demo
            const storedUser = localStorage.getItem('medicare_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            } else {
                // Create demo user if none exists
                this.currentUser = {
                    id: 'demo-user-' + Date.now(),
                    email: 'demo@medicare.com',
                    name: 'Demo User'
                };
                localStorage.setItem('medicare_user', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error getting current user:', error);
        }
    }

    attachEventListeners() {
        // Wait for DOM to be fully loaded
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="book-appointment"]') || e.target.closest('[data-action="book-appointment"]')) {
                this.handleBookAppointment(e);
            }
            
            if (e.target.matches('[data-action="medication-reminder"]') || e.target.closest('[data-action="medication-reminder"]')) {
                this.handleMedicationReminder(e);
            }
            
            if (e.target.matches('[data-action="health-assessment"]') || e.target.closest('[data-action="health-assessment"]')) {
                this.handleHealthAssessment(e);
            }
            
            if (e.target.matches('[data-action="view-reports"]') || e.target.closest('[data-action="view-reports"]')) {
                this.handleViewReports(e);
            }
            
            if (e.target.matches('[data-action="ai-chat"]') || e.target.closest('[data-action="ai-chat"]')) {
                this.handleAIChat(e);
            }
        });
    }

    async handleBookAppointment(e) {
        e.preventDefault();
        this.showSuccess('Opening appointment booking...');
        
        try {
            // For now, redirect to appointments page
            window.location.href = '/html/appointments.html';
        } catch (error) {
            console.error('Error opening appointments:', error);
            this.showError('Failed to open appointments page.');
        }
    }

    async handleMedicationReminder(e) {
        e.preventDefault();
        this.showSuccess('Opening medication reminders...');
        
        try {
            // Redirect to reminders page
            window.location.href = '/html/reminders.html';
        } catch (error) {
            console.error('Error opening reminders:', error);
            this.showError('Failed to open reminders page.');
        }
    }

    async handleHealthAssessment(e) {
        e.preventDefault();
        this.showSuccess('Opening health assessment...');
        
        try {
            // Redirect to health assessment page
            window.location.href = '/html/ai-health-assistant.html';
        } catch (error) {
            console.error('Error opening health assessment:', error);
            this.showError('Failed to open health assessment.');
        }
    }

    async handleViewReports(e) {
        e.preventDefault();
        this.showSuccess('Loading your health reports...');
        
        try {
            // Redirect to health documents page
            window.location.href = '/html/health-documents.html';
        } catch (error) {
            console.error('Error opening reports:', error);
            this.showError('Failed to load reports.');
        }
    }

    async handleAIChat(e) {
        e.preventDefault();
        this.showSuccess('Opening AI health assistant...');
        
        try {
            // Open AI chat in new window or redirect
            window.location.href = '/html/improved-ai-chat.html';
        } catch (error) {
            console.error('Error opening AI chat:', error);
            this.showError('Failed to open AI chat.');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove();" aria-label="Close notification">×</button>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Initialize the dashboard connector when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboardDB = new DashboardDBConnector();
    });
} else {
    window.dashboardDB = new DashboardDBConnector();
}

// Add notification animations
if (!document.getElementById('dashboard-animations')) {
    const style = document.createElement('style');
    style.id = 'dashboard-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .dashboard-notification {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .dashboard-notification i {
            color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        }
        
        .dashboard-notification button {
            background: none;
            border: none;
            cursor: pointer;
            margin-left: auto;
            font-size: 18px;
            color: #64748b;
        }
        
        .dashboard-notification button:hover {
            color: #374151;
        }
    `;
    document.head.appendChild(style);
} 