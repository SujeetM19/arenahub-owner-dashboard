import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './SendAlertsPage.css';

interface AlertTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  category: string;
}

interface Alert {
  id: string;
  subject: string;
  message: string;
  recipients: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
}

const SendAlertsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'compose' | 'templates' | 'history'>('compose');
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: [] as string[],
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high',
    scheduledTime: '',
    sendImmediately: true
  });

  // Templates
  const templates: AlertTemplate[] = [
    {
      id: '1',
      name: 'Welcome New Members',
      subject: 'Welcome to ArenaHub!',
      message: 'Welcome to ArenaHub! We\'re excited to have you join our fitness community. Your membership includes access to all our facilities, classes, and equipment. If you have any questions, please don\'t hesitate to reach out to our staff.',
      category: 'welcome'
    },
    {
      id: '2',
      name: 'Membership Renewal Reminder',
      subject: 'Your membership expires soon',
      message: 'Your ArenaHub membership will expire in 7 days. To continue enjoying all our facilities and services, please renew your membership. You can do this online or visit our front desk.',
      category: 'renewal'
    },
    {
      id: '3',
      name: 'Class Cancellation',
      subject: 'Class Cancellation Notice',
      message: 'We regret to inform you that the scheduled class has been cancelled due to unforeseen circumstances. We apologize for any inconvenience. Please check our updated schedule for alternative classes.',
      category: 'cancellation'
    },
    {
      id: '4',
      name: 'Equipment Maintenance',
      subject: 'Equipment Maintenance Notice',
      message: 'Please be advised that some equipment will be under maintenance from [DATE] to [DATE]. We apologize for any inconvenience and appreciate your understanding.',
      category: 'maintenance'
    }
  ];

  // Alert history
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      subject: 'Welcome to ArenaHub!',
      message: 'Welcome to our fitness community...',
      recipients: ['all_members'],
      category: 'welcome',
      priority: 'medium',
      status: 'sent',
      createdAt: '2024-09-08T10:30:00Z'
    },
    {
      id: '2',
      subject: 'Pool Maintenance Notice',
      message: 'Pool will be closed for maintenance...',
      recipients: ['premium_members'],
      category: 'maintenance',
      priority: 'high',
      status: 'sent',
      createdAt: '2024-09-07T14:20:00Z'
    }
  ]);

  const recipientGroups = [
    { id: 'all_members', name: 'All Members', count: 300 },
    { id: 'premium_members', name: 'Premium Members', count: 120 },
    { id: 'vip_members', name: 'VIP Members', count: 45 },
    { id: 'basic_members', name: 'Basic Members', count: 135 },
    { id: 'inactive_members', name: 'Inactive Members', count: 25 }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecipientToggle = (recipientId: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(recipientId)
        ? prev.recipients.filter(id => id !== recipientId)
        : [...prev.recipients, recipientId]
    }));
  };

  const handleTemplateSelect = (template: AlertTemplate) => {
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message,
      category: template.category
    }));
  };

  const handleSendAlert = () => {
    if (!formData.subject || !formData.message || formData.recipients.length === 0) {
      alert('Please fill in all required fields and select at least one recipient group.');
      return;
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      subject: formData.subject,
      message: formData.message,
      recipients: formData.recipients,
      category: formData.category,
      priority: formData.priority,
      scheduledTime: formData.sendImmediately ? undefined : formData.scheduledTime,
      status: formData.sendImmediately ? 'sent' : 'scheduled',
      createdAt: new Date().toISOString()
    };

    setAlerts(prev => [newAlert, ...prev]);
    
    // Reset form
    setFormData({
      subject: '',
      message: '',
      recipients: [],
      category: 'general',
      priority: 'medium',
      scheduledTime: '',
      sendImmediately: true
    });

    alert('Alert sent successfully!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#10b981';
      case 'scheduled': return '#f59e0b';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`send-alerts-page ${theme}`}>
      <div className="alerts-header">
        <div className="alerts-title">
          <h1>Send Alerts</h1>
          <p>Communicate with your members through targeted alerts and notifications</p>
        </div>
      </div>

      <div className="alerts-tabs">
        <button 
          className={`tab-button ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          Compose Alert
        </button>
        <button 
          className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Alert History
        </button>
      </div>

      <div className="alerts-content">
        {activeTab === 'compose' && (
          <div className="compose-section">
            <div className="compose-form">
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Enter alert subject..."
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="general">General</option>
                    <option value="welcome">Welcome</option>
                    <option value="renewal">Renewal</option>
                    <option value="cancellation">Cancellation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Recipients *</label>
                <div className="recipients-grid">
                  {recipientGroups.map((group) => (
                    <div 
                      key={group.id}
                      className={`recipient-card ${formData.recipients.includes(group.id) ? 'selected' : ''}`}
                      onClick={() => handleRecipientToggle(group.id)}
                    >
                      <div className="recipient-info">
                        <div className="recipient-name">{group.name}</div>
                        <div className="recipient-count">{group.count} members</div>
                      </div>
                      <div className="recipient-checkbox">
                        {formData.recipients.includes(group.id) && '✓'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Send Options</label>
                <div className="send-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.sendImmediately}
                      onChange={(e) => handleInputChange('sendImmediately', e.target.checked)}
                    />
                    Send immediately
                  </label>
                  
                  {!formData.sendImmediately && (
                    <div className="scheduled-time">
                      <label>Scheduled Time</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledTime}
                        onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="preview-btn"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Preview'}
                </button>
                <button 
                  className="send-btn"
                  onClick={handleSendAlert}
                >
                  {formData.sendImmediately ? 'Send Alert' : 'Schedule Alert'}
                </button>
              </div>
            </div>

            {showPreview && (
              <div className="preview-section">
                <h3>Preview</h3>
                <div className="preview-card">
                  <div className="preview-header">
                    <div className="preview-subject">{formData.subject || 'No subject'}</div>
                    <div className="preview-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(formData.priority) }}
                      >
                        {formData.priority}
                      </span>
                      <span className="category-badge">{formData.category}</span>
                    </div>
                  </div>
                  <div className="preview-message">
                    {formData.message || 'No message content'}
                  </div>
                  <div className="preview-recipients">
                    <strong>Recipients:</strong> {formData.recipients.length > 0 
                      ? recipientGroups.filter(g => formData.recipients.includes(g.id)).map(g => g.name).join(', ')
                      : 'None selected'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-section">
            <div className="templates-grid">
              {templates.map((template) => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h3>{template.name}</h3>
                    <span className="template-category">{template.category}</span>
                  </div>
                  <div className="template-content">
                    <div className="template-subject">{template.subject}</div>
                    <div className="template-message">{template.message}</div>
                  </div>
                  <button 
                    className="use-template-btn"
                    onClick={() => {
                      handleTemplateSelect(template);
                      setActiveTab('compose');
                    }}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-list">
              {alerts.map((alert) => (
                <div key={alert.id} className="history-item">
                  <div className="history-header">
                    <div className="history-subject">{alert.subject}</div>
                    <div className="history-meta">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(alert.status) }}
                      >
                        {alert.status}
                      </span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(alert.priority) }}
                      >
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-message">{alert.message}</div>
                    <div className="history-details">
                      <span><strong>Recipients:</strong> {alert.recipients.length} groups</span>
                      <span><strong>Sent:</strong> {formatDate(alert.createdAt)}</span>
                      {alert.scheduledTime && (
                        <span><strong>Scheduled:</strong> {formatDate(alert.scheduledTime)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendAlertsPage;














