import React from 'react';
import { Settings } from 'lucide-react';
import './OwnerWelcome.css';

interface OwnerWelcomeProps {
  ownerName: string;
  businessName: string;
  onSignOut: () => void;
}

const OwnerWelcome: React.FC<OwnerWelcomeProps> = ({ ownerName, businessName, onSignOut }) => {
  return (
    <div className="owner-welcome-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="welcome-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L19.5 18L22 18.5L19.5 19L19 22L18.5 19L16 18.5L18.5 18L19 15Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="welcome-title">Welcome back, {ownerName}!</h1>
          <p className="welcome-subtitle">Managing {businessName}</p>
        </div>

        <div className="welcome-content">
          <div className="welcome-message">
            <h2>🎉 Successfully Authenticated!</h2>
            <p>You are now logged into your ArenaHub Owner Dashboard. Here you can manage your fitness business, track members, and monitor your gym's performance.</p>
          </div>

          <div className="welcome-features">
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <div className="feature-text">
                <h3>Member Management</h3>
                <p>Track and manage your gym members</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <h3>Analytics Dashboard</h3>
                <p>Monitor your business performance</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Settings size={24} />
              </div>
              <div className="feature-text">
                <h3>Settings & Configuration</h3>
                <p>Customize your gym settings</p>
              </div>
            </div>
          </div>

          <div className="welcome-actions">
            <button className="dashboard-button">
              Go to Dashboard
            </button>
            <button className="signout-button" onClick={onSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerWelcome;

