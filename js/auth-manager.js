// Authentication Manager for MediCare+
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        this.supabase = null;
        this.init();
    }

    async init() {
        // Initialize Supabase client
        if (typeof supabase !== 'undefined') {
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        }
        
        // Check for existing session
        await this.checkSession();
        this.updateUI();
    }

    async checkSession() {
        try {
            if (this.supabase) {
                const { data: { session } } = await this.supabase.auth.getSession();
                if (session) {
                    this.currentUser = session.user;
                }
            } else {
                // Fallback to localStorage for demo
                const userData = localStorage.getItem('medicare_user');
                if (userData) {
                    this.currentUser = JSON.parse(userData);
                }
            }
        } catch (error) {
            console.error('Session check failed:', error);
        }
    }

    updateUI() {
        const authNavText = document.getElementById('auth-nav-text');
        const mobileAuthText = document.getElementById('mobile-auth-text');
        const authNavLink = document.querySelector('.auth-nav-link');
        
        if (this.currentUser) {
            // User is signed in
            if (authNavText) authNavText.textContent = 'Profile';
            if (mobileAuthText) mobileAuthText.textContent = 'Profile';
            if (authNavLink) {
                authNavLink.onclick = () => this.goToProfile();
            }
        } else {
            // User is not signed in
            if (authNavText) authNavText.textContent = 'Sign In';
            if (mobileAuthText) mobileAuthText.textContent = 'Sign In';
            if (authNavLink) {
                authNavLink.onclick = () => showSignInModal();
            }
        }
    }

    async signInWithGoogle() {
        try {
            if (this.supabase) {
                const { data, error } = await this.supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + '/html/dashboard.html'
                    }
                });
                
                if (error) throw error;
            } else {
                // Demo authentication
                this.currentUser = {
                    id: 'demo-' + Date.now(),
                    email: 'demo@medicare.com',
                    name: 'Demo User',
                    avatar_url: null,
                    provider: 'google'
                };
                localStorage.setItem('medicare_user', JSON.stringify(this.currentUser));
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Google sign-in failed:', error);
            this.showError('Google sign-in failed. Please try again.');
        }
    }

    async signInWithEmail() {
        // For now, redirect to a basic email form or show modal
        this.showEmailSignInForm();
    }

    async signInWithPhone() {
        // For now, show a message that phone auth is coming soon
        this.showInfo('Phone authentication will be available soon!');
    }

    showEmailSignInForm() {
        // Create a simple email/password form
        const emailForm = `
            <div class="email-form">
                <h3>Sign in with Email</h3>
                <input type="email" id="email-input" placeholder="Enter your email" />
                <input type="password" id="password-input" placeholder="Enter your password" />
                <button onclick="authManager.processEmailSignIn()">Sign In</button>
                <p><a href="#" onclick="authManager.showCreateAccount()">Don't have an account? Create one</a></p>
            </div>
        `;
        
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = emailForm;
        }
    }

    async processEmailSignIn() {
        const email = document.getElementById('email-input')?.value;
        const password = document.getElementById('password-input')?.value;
        
        if (!email || !password) {
            this.showError('Please enter both email and password');
            return;
        }

        try {
            if (this.supabase) {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) throw error;
                
                this.currentUser = data.user;
                await this.saveUserToDatabase(data.user);
                window.location.href = 'dashboard.html';
            } else {
                // Demo authentication
                this.currentUser = {
                    id: 'demo-' + Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    avatar_url: null,
                    provider: 'email'
                };
                localStorage.setItem('medicare_user', JSON.stringify(this.currentUser));
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Email sign-in failed:', error);
            this.showError('Sign-in failed. Please check your credentials.');
        }
    }

    showCreateAccount() {
        const createForm = `
            <div class="create-form">
                <h3>Create New Account</h3>
                <input type="text" id="name-input" placeholder="Full Name" />
                <input type="email" id="email-create" placeholder="Email" />
                <input type="password" id="password-create" placeholder="Password" />
                <input type="password" id="password-confirm" placeholder="Confirm Password" />
                <button onclick="authManager.processCreateAccount()">Create Account</button>
                <p><a href="#" onclick="authManager.showEmailSignInForm()">Already have an account? Sign in</a></p>
            </div>
        `;
        
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = createForm;
        }
    }

    async processCreateAccount() {
        const name = document.getElementById('name-input')?.value;
        const email = document.getElementById('email-create')?.value;
        const password = document.getElementById('password-create')?.value;
        const confirmPassword = document.getElementById('password-confirm')?.value;
        
        if (!name || !email || !password || !confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        try {
            if (this.supabase) {
                const { data, error } = await this.supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });
                
                if (error) throw error;
                
                this.showSuccess('Account created successfully! Please check your email to verify your account.');
                setTimeout(() => {
                    closeSignInModal();
                }, 2000);
            } else {
                // Demo account creation
                this.currentUser = {
                    id: 'demo-' + Date.now(),
                    email: email,
                    name: name,
                    avatar_url: null,
                    provider: 'email'
                };
                localStorage.setItem('medicare_user', JSON.stringify(this.currentUser));
                this.showSuccess('Account created successfully!');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Account creation failed:', error);
            this.showError('Account creation failed. Please try again.');
        }
    }

    async saveUserToDatabase(user) {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('users')
                .upsert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                    avatar_url: user.user_metadata?.avatar_url,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                
            if (error) throw error;
        } catch (error) {
            console.error('Failed to save user to database:', error);
        }
    }

    async signOut() {
        try {
            if (this.supabase) {
                const { error } = await this.supabase.auth.signOut();
                if (error) throw error;
            }
            
            this.currentUser = null;
            localStorage.removeItem('medicare_user');
            this.updateUI();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    }

    goToProfile() {
        if (this.currentUser) {
            window.location.href = 'profile.html';
        } else {
            showSignInModal();
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
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
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isSignedIn() {
        return this.currentUser !== null;
    }
}

// Global functions for backward compatibility
function showSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function signInWithGoogle() {
    if (window.authManager) {
        window.authManager.signInWithGoogle();
    }
}

function signInWithEmail() {
    if (window.authManager) {
        window.authManager.signInWithEmail();
    }
}

function signInWithPhone() {
    if (window.authManager) {
        window.authManager.signInWithPhone();
    }
}

function createAccount() {
    if (window.authManager) {
        window.authManager.showCreateAccount();
    }
}

// Initialize AuthManager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
}); 