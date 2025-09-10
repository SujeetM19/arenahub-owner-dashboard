import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './PreferencesPage.css';

const PreferencesPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    gymName: 'ArenaHub',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newMemberAlerts: true,
    paymentAlerts: true,
    maintenanceAlerts: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    deviceTracking: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    sidebarCollapsed: false,
    compactMode: false,
    animations: true,
    soundEffects: false
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Saving ${section} settings:`, {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      appearance: appearanceSettings
    });
    
    setIsLoading(false);
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    switch (section) {
      case 'general':
        setGeneralSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'appearance':
        setAppearanceSettings(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' }
  ];

  return (
    <div className={`preferences-page ${theme}`}>
      <div className="preferences-header">
        <div className="preferences-title">
          <h1>Preferences</h1>
          <p>Customize your dashboard settings and preferences</p>
        </div>
      </div>

      <div className="preferences-layout">
        <div className="preferences-sidebar">
          <nav className="preferences-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="preferences-content">
          {activeSection === 'general' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>General Settings</h2>
                <p>Configure basic gym information and system preferences</p>
              </div>
              
              <div className="settings-form">
                <div className="form-group">
                  <label>Gym Name</label>
                  <input
                    type="text"
                    value={generalSettings.gymName}
                    onChange={(e) => handleInputChange('general', 'gymName', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date Format</label>
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Time Format</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="timeFormat"
                        value="12h"
                        checked={generalSettings.timeFormat === '12h'}
                        onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
                      />
                      12-hour (AM/PM)
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="timeFormat"
                        value="24h"
                        checked={generalSettings.timeFormat === '24h'}
                        onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
                      />
                      24-hour
                    </label>
                  </div>
                </div>

                <button 
                  className="save-btn"
                  onClick={() => handleSave('general')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save General Settings'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Notification Settings</h2>
                <p>Configure how and when you receive notifications</p>
              </div>
              
              <div className="settings-form">
                <div className="notification-group">
                  <h3>Notification Channels</h3>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                      />
                      Email Notifications
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                      />
                      SMS Notifications
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                      />
                      Push Notifications
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>Alert Types</h3>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newMemberAlerts}
                        onChange={(e) => handleInputChange('notifications', 'newMemberAlerts', e.target.checked)}
                      />
                      New Member Registration
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.paymentAlerts}
                        onChange={(e) => handleInputChange('notifications', 'paymentAlerts', e.target.checked)}
                      />
                      Payment Notifications
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.maintenanceAlerts}
                        onChange={(e) => handleInputChange('notifications', 'maintenanceAlerts', e.target.checked)}
                      />
                      Maintenance Alerts
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.systemUpdates}
                        onChange={(e) => handleInputChange('notifications', 'systemUpdates', e.target.checked)}
                      />
                      System Updates
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={(e) => handleInputChange('notifications', 'marketingEmails', e.target.checked)}
                      />
                      Marketing Emails
                    </label>
                  </div>
                </div>

                <button 
                  className="save-btn"
                  onClick={() => handleSave('notifications')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Notification Settings'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Security Settings</h2>
                <p>Manage your account security and privacy preferences</p>
              </div>
              
              <div className="settings-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                    />
                    Enable Two-Factor Authentication
                  </label>
                  <p className="setting-description">
                    Add an extra layer of security to your account with 2FA
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Password Expiry (days)</label>
                    <select
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
                    >
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                      <option value={365}>1 year</option>
                    </select>
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.loginNotifications}
                      onChange={(e) => handleInputChange('security', 'loginNotifications', e.target.checked)}
                    />
                    Login Notifications
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.deviceTracking}
                      onChange={(e) => handleInputChange('security', 'deviceTracking', e.target.checked)}
                    />
                    Device Tracking
                  </label>
                </div>

                <button 
                  className="save-btn"
                  onClick={() => handleSave('security')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Security Settings'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Appearance Settings</h2>
                <p>Customize the look and feel of your dashboard</p>
              </div>
              
              <div className="settings-form">
                <div className="form-group">
                  <label>Theme</label>
                  <div className="theme-selector">
                    <button
                      className={`theme-option ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
                      onClick={() => {
                        handleInputChange('appearance', 'theme', 'light');
                        if (theme !== 'light') toggleTheme();
                      }}
                    >
                      <div className="theme-preview light">
                        <div className="preview-header"></div>
                        <div className="preview-content"></div>
                      </div>
                      <span>Light</span>
                    </button>
                    <button
                      className={`theme-option ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => {
                        handleInputChange('appearance', 'theme', 'dark');
                        if (theme !== 'dark') toggleTheme();
                      }}
                    >
                      <div className="theme-preview dark">
                        <div className="preview-header"></div>
                        <div className="preview-content"></div>
                      </div>
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.sidebarCollapsed}
                      onChange={(e) => handleInputChange('appearance', 'sidebarCollapsed', e.target.checked)}
                    />
                    Collapse Sidebar by Default
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.compactMode}
                      onChange={(e) => handleInputChange('appearance', 'compactMode', e.target.checked)}
                    />
                    Compact Mode
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.animations}
                      onChange={(e) => handleInputChange('appearance', 'animations', e.target.checked)}
                    />
                    Enable Animations
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.soundEffects}
                      onChange={(e) => handleInputChange('appearance', 'soundEffects', e.target.checked)}
                    />
                    Sound Effects
                  </label>
                </div>

                <button 
                  className="save-btn"
                  onClick={() => handleSave('appearance')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Appearance Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;

