import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { Users, Activity, DollarSign, Dumbbell, CheckCircle, Calendar, RotateCcw, Zap, UserPlus } from 'lucide-react';
import './DashboardContent.css';

const DashboardContent: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, membersData, notificationsData] = await Promise.all([
          api.getStatistics().catch(() => null),
          api.getMembers().catch(() => []),
          api.getNotifications().catch(() => [])
        ]);
        
        setStats(statsData);
        setMembers(Array.isArray(membersData) ? membersData : []);
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(null);
        setMembers([]);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  // Use real data or fallback to placeholder
  const statsData = stats ? [
    { title: 'Total Members', value: stats.memberStats?.totalMembers || '0', change: `+${stats.memberStats?.memberGrowth || 0}%`, trend: 'up', icon: Users, color: 'blue' },
    { title: 'Active Members', value: stats.memberStats?.activeMembers || '0', change: `+${stats.memberStats?.newMembersThisMonth || 0}`, trend: 'up', icon: Activity, color: 'green' },
    { title: 'Monthly Revenue', value: `$${stats.revenueStats?.monthlyRevenue || 0}`, change: `+${stats.revenueStats?.revenueGrowth || 0}%`, trend: 'up', icon: DollarSign, color: 'purple' },
    { title: 'Equipment Usage', value: `${stats.equipmentStats?.utilizationRate || 0}%`, change: `${stats.equipmentStats?.maintenanceRequired || 0} maintenance`, trend: 'up', icon: Dumbbell, color: 'orange' },
  ] : [
    { title: 'Total Members', value: '0', change: '+0%', trend: 'up', icon: Users, color: 'blue' },
    { title: 'Active Members', value: '0', change: '+0', trend: 'up', icon: Activity, color: 'green' },
    { title: 'Monthly Revenue', value: '$0', change: '+0%', trend: 'up', icon: DollarSign, color: 'purple' },
    { title: 'Equipment Usage', value: '0%', change: '0 maintenance', trend: 'up', icon: Dumbbell, color: 'orange' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Checked in', time: '2 minutes ago', type: 'checkin', icon: CheckCircle },
    { id: 2, user: 'Sarah Wilson', action: 'Booked a class', time: '5 minutes ago', type: 'booking', icon: Calendar },
    { id: 3, user: 'Mike Johnson', action: 'Renewed membership', time: '10 minutes ago', type: 'renewal', icon: RotateCcw },
    { id: 4, user: 'Emily Davis', action: 'Completed workout', time: '15 minutes ago', type: 'workout', icon: Zap },
    { id: 5, user: 'Alex Brown', action: 'Joined gym', time: '20 minutes ago', type: 'join', icon: UserPlus },
  ];

  const upcomingClasses = [
    { id: 1, name: 'Morning Yoga', time: '6:00 AM', instructor: 'Lisa Chen', capacity: '12/15' },
    { id: 2, name: 'HIIT Training', time: '7:30 AM', instructor: 'Mark Smith', capacity: '8/12' },
    { id: 3, name: 'Pilates', time: '9:00 AM', instructor: 'Anna Lee', capacity: '6/10' },
    { id: 4, name: 'CrossFit', time: '10:30 AM', instructor: 'Tom Wilson', capacity: '15/20' },
  ];

  return (
    <div className={`dashboard-content ${theme}`}>
      <div className="dashboard-welcome">
        <h1 className="welcome-title">Welcome back!</h1>
        <p className="welcome-subtitle">Here's what's happening at your gym today</p>
      </div>
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <h2 className="section-title">Overview</h2>
        <div className="stats-grid">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`stat-card ${theme} stat-card-${stat.color}`}>
                <div className="stat-header">
                  <div className={`stat-icon stat-icon-${stat.color}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className={`stat-trend ${stat.trend}`}>
                    {stat.trend === 'up' ? '↗️' : '↘️'} {stat.change}
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              </div>
            );
          })}
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
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="activity-item">
                  <div className="activity-avatar">
                    <IconComponent size={18} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>{activity.user}</strong> {activity.action}
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              );
            })}
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
