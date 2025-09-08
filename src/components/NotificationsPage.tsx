import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './NotificationsPage.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'member' | 'payment' | 'equipment' | 'maintenance';
}

const NotificationsPage: React.FC = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Member Registration',
      message: 'Sarah Wilson has joined your gym with a Premium membership.',
      type: 'success',
      timestamp: '2024-09-08T10:30:00Z',
      isRead: false,
      priority: 'medium',
      category: 'member'
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Monthly payment of $89.99 received from John Doe.',
      type: 'success',
      timestamp: '2024-09-08T09:15:00Z',
      isRead: false,
      priority: 'high',
      category: 'payment'
    },
    {
      id: '3',
      title: 'Equipment Maintenance Required',
      message: 'Treadmill #3 requires maintenance. Last service was 3 months ago.',
      type: 'warning',
      timestamp: '2024-09-07T16:45:00Z',
      isRead: true,
      priority: 'medium',
      category: 'equipment'
    },
    {
      id: '4',
      title: 'System Update Available',
      message: 'A new version of the gym management system is available.',
      type: 'info',
      timestamp: '2024-09-07T14:20:00Z',
      isRead: true,
      priority: 'low',
      category: 'system'
    },
    {
      id: '5',
      title: 'Membership Expiring Soon',
      message: 'Mike Johnson\'s membership expires in 3 days. Consider sending a renewal reminder.',
      type: 'warning',
      timestamp: '2024-09-07T11:30:00Z',
      isRead: false,
      priority: 'high',
      category: 'member'
    },
    {
      id: '6',
      title: 'Maintenance Scheduled',
      message: 'Pool maintenance is scheduled for tomorrow from 6 AM to 10 AM.',
      type: 'info',
      timestamp: '2024-09-06T18:00:00Z',
      isRead: true,
      priority: 'medium',
      category: 'maintenance'
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);
    
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    
    return matchesFilter && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'member': return '👥';
      case 'payment': return '💰';
      case 'equipment': return '🏋️';
      case 'maintenance': return '🔧';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className={`notifications-page ${theme}`}>
      <div className="notifications-header">
        <div className="notifications-title">
          <h1>Notifications</h1>
          <p>Stay updated with your gym's activities and alerts</p>
        </div>
        <div className="notifications-actions">
          <button 
            className="mark-all-read-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-number">{notifications.length}</div>
          <div className="stat-label">Total Notifications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{unreadCount}</div>
          <div className="stat-label">Unread</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{notifications.filter(n => n.priority === 'high').length}</div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{notifications.filter(n => n.category === 'member').length}</div>
          <div className="stat-label">Member Related</div>
        </div>
      </div>

      <div className="notifications-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="member">Member</option>
            <option value="payment">Payment</option>
            <option value="equipment">Equipment</option>
            <option value="maintenance">Maintenance</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notifications found</h3>
            <p>No notifications match your current filters.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${theme}`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="notification-icon">
                <span className="type-icon">{getTypeIcon(notification.type)}</span>
                <span className="category-icon">{getCategoryIcon(notification.category)}</span>
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <div className="notification-meta">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(notification.priority) }}
                    >
                      {notification.priority}
                    </span>
                    <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-footer">
                  <span className="category-badge">{notification.category}</span>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button 
                        className="action-btn mark-read"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
