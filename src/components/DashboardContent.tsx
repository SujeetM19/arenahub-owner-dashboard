import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './DashboardContent.css';

const DashboardContent: React.FC = () => {
  const { theme } = useTheme();

  // Placeholder data
  const stats = [
    { title: 'Total Members', value: '1,234', change: '+12%', trend: 'up', icon: '👥' },
    { title: 'Active Sessions', value: '89', change: '+5%', trend: 'up', icon: '🏃' },
    { title: 'Monthly Revenue', value: '$45,678', change: '+8%', trend: 'up', icon: '💰' },
    { title: 'Equipment Usage', value: '92%', change: '-2%', trend: 'down', icon: '🏋️' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Checked in', time: '2 minutes ago', type: 'checkin' },
    { id: 2, user: 'Sarah Wilson', action: 'Booked a class', time: '5 minutes ago', type: 'booking' },
    { id: 3, user: 'Mike Johnson', action: 'Renewed membership', time: '10 minutes ago', type: 'renewal' },
    { id: 4, user: 'Emily Davis', action: 'Completed workout', time: '15 minutes ago', type: 'workout' },
    { id: 5, user: 'Alex Brown', action: 'Joined gym', time: '20 minutes ago', type: 'join' },
  ];

  const upcomingClasses = [
    { id: 1, name: 'Morning Yoga', time: '6:00 AM', instructor: 'Lisa Chen', capacity: '12/15' },
    { id: 2, name: 'HIIT Training', time: '7:30 AM', instructor: 'Mark Smith', capacity: '8/12' },
    { id: 3, name: 'Pilates', time: '9:00 AM', instructor: 'Anna Lee', capacity: '6/10' },
    { id: 4, name: 'CrossFit', time: '10:30 AM', instructor: 'Tom Wilson', capacity: '15/20' },
  ];

  return (
    <div className={`dashboard-content ${theme}`}>
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card ${theme}`}>
                <div className="stat-header">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className={`stat-trend ${stat.trend}`}>
                    {stat.trend === 'up' ? '↗️' : '↘️'} {stat.change}
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <h2 className="section-title">Revenue Trend</h2>
          <div className={`chart-container ${theme}`}>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[65, 80, 45, 90, 75, 85, 95].map((height, index) => (
                  <div
                    key={index}
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="activities-section">
          <h2 className="section-title">Recent Activities</h2>
          <div className={`activities-container ${theme}`}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">
                  {activity.type === 'checkin' && '✅'}
                  {activity.type === 'booking' && '📅'}
                  {activity.type === 'renewal' && '🔄'}
                  {activity.type === 'workout' && '💪'}
                  {activity.type === 'join' && '🎉'}
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.user}</strong> {activity.action}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="classes-section">
          <h2 className="section-title">Upcoming Classes</h2>
          <div className={`classes-container ${theme}`}>
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="class-item">
                <div className="class-info">
                  <div className="class-name">{classItem.name}</div>
                  <div className="class-instructor">{classItem.instructor}</div>
                </div>
                <div className="class-details">
                  <div className="class-time">{classItem.time}</div>
                  <div className="class-capacity">{classItem.capacity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
