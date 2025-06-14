// Enhanced Authentication Manager with Profile System
class AuthManager {
    constructor() {
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Initialize Supabase client
        if (typeof supabase !== 'undefined') {
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        }
        
        await this.checkSession();
        this.updateUI();
    }

    async checkSession() {
        try {
            if (this.supabase) {
                const { data: { session } } = await this.supabase.auth.getSession();
                if (session) {
                    this.currentUser = session.user;
                    // Don't auto-redirect here, let the user navigate manually
                    return;
                }
            }
            
            // Check for stored user (demo mode)
            const storedUser = localStorage.getItem('medicare_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Session check failed:', error);
        }
    }

    updateUI() {
        const authNavText = document.getElementById('auth-nav-text');
        const mobileAuthText = document.getElementById('mobile-auth-text');
        const authNavLink = document.getElementById('auth-nav-link');
        const mobileAuthLink = document.getElementById('mobile-auth-link');

        if (this.currentUser) {
            // User is signed in
            if (authNavText) authNavText.textContent = `Hello, ${this.currentUser.name || this.currentUser.email}`;
            if (mobileAuthText) mobileAuthText.textContent = `Hello, ${this.currentUser.name || this.currentUser.email}`;
            
            if (authNavLink) authNavLink.onclick = () => this.goToProfile();
            if (mobileAuthLink) mobileAuthLink.onclick = () => this.goToProfile();
        } else {
            // User is not signed in
            if (authNavText) authNavText.textContent = 'Sign In';
            if (mobileAuthText) mobileAuthText.textContent = 'Sign In';
            
            if (authNavLink) authNavLink.onclick = () => showSignInModal();
            if (mobileAuthLink) mobileAuthLink.onclick = () => showSignInModal();
        }
    }

    async signInWithGoogle() {
        try {
            if (this.supabase) {
                const { data, error } = await this.supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + '/auth-callback'
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
                window.location.href = '/html/user-dashboard-improved.html';
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
                window.location.href = '/html/user-dashboard-improved.html';
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
                window.location.href = '/html/user-dashboard-improved.html';
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
                    window.location.href = '/html/user-dashboard-improved.html';
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
            window.location.href = '/html/index.html';
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    }

    goToProfile() {
        if (this.currentUser) {
            window.location.href = '/html/profile.html';
        }
    }

    // Notification methods
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
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 350px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
        `;

        // Set background color based on type
        switch(type) {
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#3b82f6';
                break;
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);

        // Add CSS animations if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isSignedIn() {
        return !!this.currentUser;
    }
}

// Initialize AuthManager
window.authManager = new AuthManager();

function showSignInModal() {
    // Implementation for showing sign-in modal
    console.log('Show sign-in modal');
}

function closeSignInModal() {
    // Implementation for closing sign-in modal
    console.log('Close sign-in modal');
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