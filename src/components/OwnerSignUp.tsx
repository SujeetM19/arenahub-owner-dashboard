import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OwnerSignUp.css';

interface OwnerSignUpProps {
  onSignUp: (name: string, email: string, password: string, businessName: string, profilePicture?: string) => void;
  isLoading: boolean;
  error: string | null;
}

const OwnerSignUp: React.FC<OwnerSignUpProps> = ({ 
  onSignUp, 
  isLoading, 
  error 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    onSignUp(name, email, password, businessName, profilePicture || undefined);
  };

  return (
    <div className="owner-signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">ArenaHub</h1>
          <h2 className="signup-subtitle">Owner Registration</h2>
          <p className="signup-description">Create your owner account to start managing</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

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
            <label htmlFor="businessName" className="form-label">Business Name</label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="form-input"
              placeholder="Enter your business name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture" className="form-label">Profile Picture (Optional)</label>
            <div className="profile-picture-upload">
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="profilePicture" className="file-label">
                {profilePicture ? (
                  <div className="profile-preview">
                    <img src={profilePicture} alt="Profile preview" className="preview-image" />
                    <span className="change-text">Change Picture</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Choose Profile Picture</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Create a password"
              required
              minLength={6}
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
              placeholder="Confirm your password"
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <div className="password-error">Passwords do not match</div>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading || (password && confirmPassword && password !== confirmPassword)}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p className="switch-text">
            Already have an account?{' '}
            <Link to="/signin" className="switch-button">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignUp;
