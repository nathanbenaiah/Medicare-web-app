import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack }) => {
  const { verifyOTP, signInWithOTP } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + digits.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-advance to next input
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyOTP(email, code);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid verification code');
      // Clear inputs on error
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
    
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    const result = await signInWithOTP(email);
    
    if (result.success) {
      setResendCountdown(60);
      // Clear current inputs
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } else {
      setError(result.error || 'Failed to resend code');
    }
    
    setResendLoading(false);
  };

  return (
    <div className="otp-verification">
      <div className="otp-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>📧 Check Your Email</h2>
        <p>We sent a 6-digit code to <strong>{email}</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`otp-digit ${digit ? 'filled' : ''}`}
            />
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="auth-button primary"
          disabled={loading || otp.join('').length !== 6}
        >
          {loading ? 'Verifying...' : '✅ Verify Code'}
        </button>

        <div className="resend-section">
          {resendCountdown > 0 ? (
            <p>Resend available in {resendCountdown} seconds</p>
          ) : (
            <button
              type="button"
              className="link-button"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : '🔄 Resend Code'}
            </button>
          )}
        </div>

        <div className="otp-help">
          <p>💡 <strong>Tip:</strong> You can paste the full 6-digit code into any field</p>
          <p>⏰ Code expires in 1 hour</p>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification; 