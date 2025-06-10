// React Authentication System for MediCare+ (Embedded in existing HTML)

// Import React and ReactDOM from CDN (will be loaded in HTML)
const { React, ReactDOM } = window;
const { useState, useEffect, useContext, createContext } = React;

// Supabase configuration
const SUPABASE_URL = 'https://gcggnrwqilylyykppizb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2ducndxaWx5bHl5a3BwaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODA1NjAsImV4cCI6MjA2NTA1NjU2MH0.9ayDDoyjUiYA3Hmir_A92U2i7QNkIuER-94kDNVVgoE';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect to dashboard on successful login
        if (event === 'SIGNED_IN' && session?.user) {
          window.location.href = '/html/dashboard.html';
        }
        
        // Redirect to auth on logout
        if (event === 'SIGNED_OUT') {
          window.location.href = '/html/auth.html';
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Authentication methods
  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithOTP = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyOTP = async (email, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/html/dashboard.html`,
        },
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/html/auth.html`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      loading,
      signUp,
      signIn,
      signInWithOTP,
      verifyOTP,
      signInWithGoogle,
      signOut,
      resetPassword,
    }
  }, children);
};

// Hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Sign In Form Component
const SignInForm = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await signIn(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error || 'Sign in failed');
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || 'Google sign in failed');
    }
    setLoading(false);
  };

  return React.createElement('form', { onSubmit: handleSubmit, className: 'auth-form active' },
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Email Address'),
      React.createElement('input', {
        type: 'email',
        className: 'form-input',
        value: formData.email,
        onChange: (e) => {
          setFormData({ ...formData, email: e.target.value });
          setError('');
        },
        placeholder: 'Enter your email',
        required: true
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Password'),
      React.createElement('div', { className: 'password-input-container' },
        React.createElement('input', {
          type: showPassword ? 'text' : 'password',
          className: 'form-input',
          value: formData.password,
          onChange: (e) => {
            setFormData({ ...formData, password: e.target.value });
            setError('');
          },
          placeholder: 'Enter your password',
          required: true
        }),
        React.createElement('i', {
          className: `bx ${showPassword ? 'bx-hide' : 'bx-show'} password-toggle`,
          onClick: () => setShowPassword(!showPassword)
        })
      )
    ),
    error && React.createElement('div', { className: 'error-message', style: { background: '#fee', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '16px' } }, error),
    React.createElement('button', {
      type: 'submit',
      className: 'auth-button',
      disabled: loading
    }, loading ? 'Signing In...' : 'Sign In'),
    React.createElement('div', { className: 'divider' }, React.createElement('span', null, 'Or continue with')),
    React.createElement('button', {
      type: 'button',
      className: 'google-auth-button',
      onClick: handleGoogleSignIn,
      disabled: loading,
      style: {
        width: '100%',
        padding: '15px',
        background: 'white',
        border: '2px solid #e1e5e9',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: 'pointer',
        marginBottom: '20px'
      }
    },
      React.createElement('i', { className: 'bx bxl-google', style: { fontSize: '20px' } }),
      'Sign in with Google'
    )
  );
};

// Sign Up Form Component
const SignUpForm = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signUp(formData.email, formData.password, formData.fullName);
    
    if (result.success) {
      setSuccess('Account created successfully! Please check your email to verify your account.');
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError(result.error || 'Sign up failed');
    }
    
    setLoading(false);
  };

  return React.createElement('form', { onSubmit: handleSubmit, className: 'auth-form' },
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Full Name'),
      React.createElement('input', {
        type: 'text',
        className: 'form-input',
        value: formData.fullName,
        onChange: (e) => setFormData({ ...formData, fullName: e.target.value }),
        placeholder: 'Enter your full name',
        required: true
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Email Address'),
      React.createElement('input', {
        type: 'email',
        className: 'form-input',
        value: formData.email,
        onChange: (e) => setFormData({ ...formData, email: e.target.value }),
        placeholder: 'Enter your email',
        required: true
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Password'),
      React.createElement('div', { className: 'password-input-container' },
        React.createElement('input', {
          type: showPassword ? 'text' : 'password',
          className: 'form-input',
          value: formData.password,
          onChange: (e) => setFormData({ ...formData, password: e.target.value }),
          placeholder: 'Create a password',
          required: true
        }),
        React.createElement('i', {
          className: `bx ${showPassword ? 'bx-hide' : 'bx-show'} password-toggle`,
          onClick: () => setShowPassword(!showPassword)
        })
      )
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Confirm Password'),
      React.createElement('input', {
        type: showPassword ? 'text' : 'password',
        className: 'form-input',
        value: formData.confirmPassword,
        onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
        placeholder: 'Confirm your password',
        required: true
      })
    ),
    error && React.createElement('div', { className: 'error-message', style: { background: '#fee', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '16px' } }, error),
    success && React.createElement('div', { className: 'success-message', style: { background: '#efe', color: '#363', padding: '12px', borderRadius: '8px', marginBottom: '16px' } }, success),
    React.createElement('button', {
      type: 'submit',
      className: 'auth-button',
      disabled: loading
    }, loading ? 'Creating Account...' : 'Create Account')
  );
};

// OTP Form Component
const OTPForm = ({ onOTPSent }) => {
  const { signInWithOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    const result = await signInWithOTP(email);
    
    if (result.success) {
      onOTPSent(email);
    } else {
      setError(result.error || 'Failed to send verification code');
    }
    
    setLoading(false);
  };

  return React.createElement('form', { onSubmit: handleSubmit, className: 'auth-form' },
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '30px' } },
      React.createElement('h3', { style: { color: '#333', marginBottom: '10px' } }, '📧 Email Verification'),
      React.createElement('p', { style: { color: '#666', fontSize: '14px' } }, 'Enter your email address and we\'ll send you a 6-digit verification code.')
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Email Address'),
      React.createElement('input', {
        type: 'email',
        className: 'form-input',
        value: email,
        onChange: (e) => {
          setEmail(e.target.value);
          setError('');
        },
        placeholder: 'Enter your email',
        required: true
      })
    ),
    error && React.createElement('div', { className: 'error-message', style: { background: '#fee', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '16px' } }, error),
    React.createElement('button', {
      type: 'submit',
      className: 'auth-button',
      disabled: loading
    }, loading ? 'Sending Code...' : '📤 Send Verification Code')
  );
};

// Main Auth App Component
const AuthApp = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const handleOTPSent = (email) => {
    setOtpEmail(email);
    setShowOTPVerification(true);
  };

  if (showOTPVerification) {
    window.location.href = `/html/auth-otp.html?email=${encodeURIComponent(otpEmail)}`;
    return null;
  }

  return React.createElement(AuthProvider, null,
    React.createElement('div', { className: 'auth-tabs' },
      React.createElement('div', {
        className: `auth-tab ${activeTab === 'signin' ? 'active' : ''}`,
        onClick: () => setActiveTab('signin')
      }, 'Sign In'),
      React.createElement('div', {
        className: `auth-tab ${activeTab === 'signup' ? 'active' : ''}`,
        onClick: () => setActiveTab('signup')
      }, 'Sign Up'),
      React.createElement('div', {
        className: `auth-tab ${activeTab === 'otp' ? 'active' : ''}`,
        onClick: () => setActiveTab('otp')
      }, 'Email OTP')
    ),
    React.createElement('div', { className: 'auth-content' },
      activeTab === 'signin' && React.createElement(SignInForm),
      activeTab === 'signup' && React.createElement(SignUpForm),
      activeTab === 'otp' && React.createElement(OTPForm, { onOTPSent: handleOTPSent })
    )
  );
};

// Initialize the React app when DOM is loaded
window.initReactAuth = function() {
  const authContainer = document.getElementById('react-auth-container');
  if (authContainer) {
    const root = ReactDOM.createRoot(authContainer);
    root.render(React.createElement(AuthApp));
  }
};

// Export for global use
window.ReactAuth = {
  AuthApp,
  AuthProvider,
  useAuth,
  supabase
}; 