import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface OTPFormProps {
  onOTPSent: (email: string) => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ onOTPSent }) => {
  const { signInWithOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
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

  return (
    <div className="auth-form">
      <div className="otp-info">
        <h3>📧 Email Verification</h3>
        <p>Enter your email address and we'll send you a 6-digit verification code.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="Enter your email"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="auth-button primary"
          disabled={loading}
        >
          {loading ? 'Sending Code...' : '📤 Send Verification Code'}
        </button>

        <div className="otp-benefits">
          <div className="benefit-item">
            <span className="benefit-icon">🔒</span>
            <span>Secure passwordless login</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <span>Quick and easy access</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📱</span>
            <span>Works on any device</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OTPForm; 