// Authentication Handler for Dashboard Pages
class AuthHandler {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.userType = null; // 'patient' or 'provider'
        this.initializeAuth();
    }

    initializeAuth() {
        // Check for existing session
        this.checkExistingSession();
        
        // Set up authentication state listeners
        this.setupAuthListeners();
        
        // Protect dashboard routes
        this.protectRoutes();
    }

    checkExistingSession() {
        // Check localStorage for existing session
        const savedSession = localStorage.getItem('medicare_session');
        const savedUser = localStorage.getItem('medicare_user');
        
        if (savedSession && savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
                this.userType = this.currentUser.type || 'patient';
                console.log('Existing session found for:', this.currentUser.email);
            } catch (error) {
                console.error('Error parsing saved session:', error);
                this.clearSession();
            }
        }
    }

    setupAuthListeners() {
        // Listen for authentication events
        window.addEventListener('medicare_login', (event) => {
            this.handleLogin(event.detail);
        });

        window.addEventListener('medicare_logout', () => {
            this.handleLogout();
        });

        // Check for URL parameters from auth redirect
        this.checkAuthRedirect();
    }

    checkAuthRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('token');
        const userType = urlParams.get('type');
        
        if (authToken) {
            // Handle OAuth redirect or authentication callback
            this.handleAuthCallback(authToken, userType);
            
            // Clean up URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    handleAuthCallback(token, userType) {
        // Mock user data - in real app, this would come from token validation
        const mockUser = {
            id: 'user_' + Date.now(),
            email: userType === 'provider' ? 'doctor@citygeneral.com' : 'patient@email.com',
            name: userType === 'provider' ? 'Dr. Sarah Johnson' : 'John Doe',
            type: userType || 'patient',
            avatar: 'https://via.placeholder.com/100',
            verified: true
        };

        this.handleLogin(mockUser);
        this.showToast(`Welcome ${mockUser.name}! Authentication successful.`, 'success');
    }

    handleLogin(userData) {
        this.currentUser = userData;
        this.isAuthenticated = true;
        this.userType = userData.type || 'patient';
        
        // Save session
        localStorage.setItem('medicare_session', 'authenticated');
        localStorage.setItem('medicare_user', JSON.stringify(userData));
        
        // Update UI
        this.updateAuthUI();
        
        console.log('User logged in:', userData);
    }

    handleLogout() {
        this.clearSession();
        this.redirectToLogin();
    }

    clearSession() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.userType = null;
        
        localStorage.removeItem('medicare_session');
        localStorage.removeItem('medicare_user');
        
        this.updateAuthUI();
    }

    protectRoutes() {
        const currentPath = window.location.pathname;
        const protectedRoutes = [
            '/src/dashboard/html/user-dashboard.html',
            '/src/dashboard/html/user-appointments.html',
            '/src/dashboard/html/user-reminders.html',
            '/src/dashboard/html/ai-health-assistant.html',
            '/src/dashboard/html/provider-dashboard.html',
            '/src/dashboard/html/provider-appointments.html',
            '/src/dashboard/html/provider-reminders.html'
        ];

        const isProtectedRoute = protectedRoutes.some(route => 
            currentPath.includes(route) || currentPath.includes('dashboard')
        );

        if (isProtectedRoute && !this.isAuthenticated) {
            this.showAuthModal();
            return;
        }

        // Check user type access
        if (this.isAuthenticated) {
            this.checkUserTypeAccess();
        }
    }

    checkUserTypeAccess() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('provider') && this.userType !== 'provider') {
            this.showToast('Access denied. Provider account required.', 'error');
            this.redirectToUserDashboard();
        } else if (currentPath.includes('user') && this.userType !== 'patient') {
            this.showToast('Access denied. Patient account required.', 'error');
            this.redirectToProviderDashboard();
        }
    }

    showAuthModal() {
        // Create authentication modal
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2>Authentication Required</h2>
                    <p>Please log in to access your dashboard</p>
                </div>
                <div class="auth-options">
                    <button class="auth-btn patient-login" onclick="authHandler.simulateLogin('patient')">
                        <i class="fas fa-user"></i>
                        Login as Patient
                    </button>
                    <button class="auth-btn provider-login" onclick="authHandler.simulateLogin('provider')">
                        <i class="fas fa-user-md"></i>
                        Login as Provider
                    </button>
                    <button class="auth-btn google-login" onclick="authHandler.simulateGoogleLogin()">
                        <i class="fab fa-google"></i>
                        Continue with Google
                    </button>
                </div>
                <div class="auth-footer">
                    <p>Don't have an account? <a href="../../html/auth.html">Sign up here</a></p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addAuthModalStyles();
    }

    addAuthModalStyles() {
        if (document.getElementById('auth-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'auth-modal-styles';
        styles.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }

            .auth-modal-content {
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease;
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .auth-header h2 {
                color: #007BFF;
                margin-bottom: 0.5rem;
            }

            .auth-header p {
                color: #6c757d;
                margin-bottom: 2rem;
            }

            .auth-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .auth-btn {
                padding: 1rem 2rem;
                border: 2px solid #007BFF;
                border-radius: 12px;
                background: white;
                color: #007BFF;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .auth-btn:hover {
                background: #007BFF;
                color: white;
                transform: translateY(-2px);
            }

            .provider-login {
                border-color: #28a745;
                color: #28a745;
            }

            .provider-login:hover {
                background: #28a745;
                color: white;
            }

            .google-login {
                border-color: #dc3545;
                color: #dc3545;
            }

            .google-login:hover {
                background: #dc3545;
                color: white;
            }

            .auth-footer p {
                color: #6c757d;
                font-size: 0.9rem;
            }

            .auth-footer a {
                color: #007BFF;
                text-decoration: none;
            }

            .auth-footer a:hover {
                text-decoration: underline;
            }
        `;

        document.head.appendChild(styles);
    }

    simulateLogin(userType) {
        const userData = {
            patient: {
                id: 'patient_123',
                email: 'john.doe@email.com',
                name: 'John Doe',
                type: 'patient',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                verified: true
            },
            provider: {
                id: 'provider_456',
                email: 'dr.johnson@citygeneral.com',
                name: 'Dr. Sarah Johnson',
                type: 'provider',
                specialization: 'Cardiology',
                hospital: 'City General Hospital',
                avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100',
                verified: true
            }
        };

        this.handleLogin(userData[userType]);
        this.closeAuthModal();
        
        // Redirect to appropriate dashboard
        if (userType === 'provider') {
            this.redirectToProviderDashboard();
        } else {
            this.redirectToUserDashboard();
        }
    }

    simulateGoogleLogin() {
        // Simulate Google OAuth flow
        this.showToast('Redirecting to Google authentication...', 'info');
        
        setTimeout(() => {
            const userData = {
                id: 'google_789',
                email: 'user@gmail.com',
                name: 'Google User',
                type: 'patient',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
                verified: true,
                provider: 'google'
            };
            
            this.handleLogin(userData);
            this.closeAuthModal();
            this.redirectToUserDashboard();
        }, 2000);
    }

    closeAuthModal() {
        const modal = document.querySelector('.auth-modal');
        if (modal) {
            modal.remove();
        }
    }

    updateAuthUI() {
        // Update user info in navigation
        const userElements = document.querySelectorAll('.user-info');
        userElements.forEach(element => {
            if (this.isAuthenticated) {
                element.innerHTML = `
                    <div class="user-avatar">
                        <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}">
                    </div>
                    <div class="user-details">
                        <span class="user-name">${this.currentUser.name}</span>
                        <span class="user-type">${this.userType}</span>
                    </div>
                    <button class="logout-btn" onclick="authHandler.handleLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                `;
            } else {
                element.innerHTML = `
                    <button class="login-btn" onclick="authHandler.showAuthModal()">
                        <i class="fas fa-sign-in-alt"></i>
                        Login
                    </button>
                `;
            }
        });

        // Update dashboard content based on user
        if (this.isAuthenticated && typeof updateDashboardForUser === 'function') {
            updateDashboardForUser(this.currentUser);
        }
    }

    redirectToLogin() {
        window.location.href = '../../html/auth.html';
    }

    redirectToUserDashboard() {
        window.location.href = 'user-dashboard.html';
    }

    redirectToProviderDashboard() {
        window.location.href = 'provider-dashboard.html';
    }

    showToast(message, type = 'info') {
        // Create toast if it doesn't exist
        let toast = document.getElementById('auth-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'auth-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Public API methods
    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    getUserType() {
        return this.userType;
    }
}

// Initialize authentication handler
const authHandler = new AuthHandler();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthHandler;
} 