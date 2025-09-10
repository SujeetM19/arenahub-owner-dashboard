import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OwnerSignIn.css';

interface OwnerSignInProps {
  onSignIn: (email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

const OwnerSignIn: React.FC<OwnerSignInProps> = ({ 
  onSignIn, 
  isLoading, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="owner-signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1 className="signin-title">ArenaHub</h1>
          <h2 className="signin-subtitle">Owner Dashboard</h2>
          <p className="signin-description">Sign in to manage your fitness business</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
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

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="forgot-password-container">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>

        <div className="signin-footer">
          <p className="switch-text">
            Don't have an account?{' '}
            <Link to="/signup" className="switch-button">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignIn;
