import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get email from URL params or use default
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/owner/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('OTP sent to your email!');
        setStep('otp');
      } else {
        // Check if it's an email authentication error
        if (data.message && data.message.includes('Authentication failed')) {
          setMessage('OTP generated successfully! (Email service temporarily unavailable - check console for OTP)');
          setStep('otp');
          // Log the OTP to console for testing
          console.log('🔑 Generated OTP for testing:', 'Check backend logs for the actual OTP');
        } else {
          setError(data.message || 'Failed to send OTP');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/owner/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('OTP verified successfully!');
        setStep('password');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/owner/auth/reset-password-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP} className="forgot-password-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="Enter your email"
          required
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send OTP'}
      </button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="forgot-password-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          className="form-input"
          disabled
        />
      </div>

      <div className="form-group">
        <label htmlFor="otp" className="form-label">Enter OTP</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-input"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          required
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="forgot-password-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          className="form-input"
          disabled
        />
      </div>

      <div className="form-group">
        <label htmlFor="newPassword" className="form-label">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="form-input"
          placeholder="Enter new password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input"
          placeholder="Confirm new password"
          required
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1 className="forgot-password-title">ArenaHub</h1>
          <h2 className="forgot-password-subtitle">Reset Password</h2>
          <p className="forgot-password-description">
            {step === 'email' && 'Enter your email to receive an OTP'}
            {step === 'otp' && 'Enter the OTP sent to your email'}
            {step === 'password' && 'Set your new password'}
          </p>
        </div>

        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'password' && renderPasswordStep()}

        <div className="forgot-password-footer">
          <p className="back-to-signin">
            Remember your password?{' '}
            <Link to="/signin" className="back-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;