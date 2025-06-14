// Enhanced Authentication System with Role-Based Routing
class EnhancedAuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.supabase = null;
        this.users = [
            {
                id: 1,
                email: 'patient@example.com',
                password: 'password123',
                role: 'patient',
                name: 'John Williams',
                phone: '+1 (555) 111-2222'
            },
            {
                id: 2,
                email: 'doctor@example.com',
                password: 'doctor123',
                role: 'provider',
                name: 'Dr. Sarah Johnson',
                specialization: 'Cardiology',
                hospital: 'City General Hospital'
            }
        ];
        this.init();
    }

    async init() {
        try {
            if (typeof supabase !== 'undefined') {
                this.supabase = supabase.createClient(
                    'https://your-project.supabase.co',
                    'your-anon-key'
                );
            }
            
            this.checkExistingSession();
            console.log('Enhanced Auth System initialized');
        } catch (error) {
            console.warn('Auth initialization failed, using local auth:', error);
        }
    }

    checkExistingSession() {
        const userData = localStorage.getItem('medicareplus_user');
        const authToken = localStorage.getItem('medicareplus_token');
        
        if (userData && authToken) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
                console.log('Session restored for:', this.currentUser.name);
                
                if (window.location.pathname.includes('auth.html')) {
                    this.redirectToDashboard();
                }
            } catch (error) {
                console.error('Invalid session data:', error);
                this.logout();
            }
        }
    }

    async login(email, password, rememberMe = false) {
        try {
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                await this.handleSuccessfulLogin(user, rememberMe);
                return { success: true, user: user };
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async handleSuccessfulLogin(user, rememberMe) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        if (rememberMe) {
            localStorage.setItem('medicareplus_user', JSON.stringify(this.currentUser));
            localStorage.setItem('medicareplus_token', this.generateToken());
        } else {
            sessionStorage.setItem('medicareplus_user', JSON.stringify(this.currentUser));
            sessionStorage.setItem('medicareplus_token', this.generateToken());
        }
        
        this.showAuthMessage('Welcome back, ' + this.currentUser.name + '! 🎉', 'success');
        
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1500);
    }

    redirectToDashboard() {
        const role = this.currentUser?.role || 'patient';
        const redirectPaths = {
            'patient': '/src/dashboard/html/user-dashboard.html',
            'provider': '/src/dashboard/html/provider-dashboard.html'
        };
        
        const targetPath = redirectPaths[role] || redirectPaths['patient'];
        window.location.href = targetPath;
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('medicareplus_user');
        localStorage.removeItem('medicareplus_token');
        sessionStorage.removeItem('medicareplus_user');
        sessionStorage.removeItem('medicareplus_token');
        
        window.location.href = '/src/dashboard/html/auth.html';
    }

    generateToken() {
        return 'mcp_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    showAuthMessage(message, type = 'info') {
        let messageEl = document.getElementById('auth-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'auth-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                transition: all 0.3s ease;
                transform: translateX(400px);
                max-width: 300px;
                border-left: 4px solid #007BFF;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.borderLeftColor = type === 'success' ? '#28a745' : 
                                          type === 'error' ? '#dc3545' : '#007BFF';
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 4000);
    }

    isLoggedIn() {
        return this.isAuthenticated && this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/src/dashboard/html/auth.html';
            return false;
        }
        return true;
    }
}

const enhancedAuth = new EnhancedAuthSystem();

async function performLogin(email, password, rememberMe) {
    const result = await enhancedAuth.login(email, password, rememberMe);
    
    if (!result.success) {
        enhancedAuth.showAuthMessage(result.error || 'Login failed', 'error');
    }
    
    return result;
}

function performLogout() {
    enhancedAuth.logout();
}

window.enhancedAuth = enhancedAuth;
window.performLogin = performLogin;
window.performLogout = performLogout; 