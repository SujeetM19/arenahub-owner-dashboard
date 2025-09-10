import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/owner/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-message">
            {error}
          </div>
          <div className="form-footer">
            <Link to="/forgot-password" className="link">
              Request a new password reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1 className="reset-password-title">Set New Password</h1>
          <p className="reset-password-subtitle">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
              <br />
              <small>Redirecting to sign in page...</small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your new password"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm your new password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="form-footer">
            <p>
              Remember your password?{' '}
              <Link to="/signin" className="link">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
