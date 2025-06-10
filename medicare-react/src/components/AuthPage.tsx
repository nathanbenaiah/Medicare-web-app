import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import OTPForm from './OTPForm';
import OTPVerification from './OTPVerification';
import './AuthPage.css';

type AuthTab = 'signin' | 'signup' | 'otp';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const handleOTPSent = (email: string) => {
    setOtpEmail(email);
    setShowOTPVerification(true);
  };

  const handleBackToOTP = () => {
    setShowOTPVerification(false);
    setOtpEmail('');
  };

  if (showOTPVerification) {
    return <OTPVerification email={otpEmail} onBack={handleBackToOTP} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <h1>MediCare+</h1>
          </div>
          <p className="subtitle">Your trusted healthcare companion</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`auth-tab ${activeTab === 'otp' ? 'active' : ''}`}
            onClick={() => setActiveTab('otp')}
          >
            Email OTP
          </button>
        </div>

        <div className="auth-content">
          {activeTab === 'signin' && <SignInForm />}
          {activeTab === 'signup' && <SignUpForm />}
          {activeTab === 'otp' && <OTPForm onOTPSent={handleOTPSent} />}
        </div>

        <div className="auth-footer">
          <p>Secure healthcare management platform</p>
          <div className="security-badges">
            <span>🔒 SSL Encrypted</span>
            <span>🛡️ HIPAA Compliant</span>
            <span>✅ SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 