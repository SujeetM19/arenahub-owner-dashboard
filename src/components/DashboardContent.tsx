import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { Users, Activity, DollarSign, Dumbbell, CheckCircle, Calendar, RotateCcw, Zap, UserPlus, Clock, Bell, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Users2, Timer, AlertCircle } from 'lucide-react';
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

  const gymCrowdTrend = [
    { time: '6:00 AM', crowdLevel: 25, status: 'Low' },
    { time: '7:00 AM', crowdLevel: 45, status: 'Medium' },
    { time: '8:00 AM', crowdLevel: 35, status: 'Low' },
    { time: '12:00 PM', crowdLevel: 60, status: 'High' },
    { time: '5:00 PM', crowdLevel: 80, status: 'Peak' },
    { time: '6:00 PM', crowdLevel: 95, status: 'Peak' },
    { time: '7:00 PM', crowdLevel: 75, status: 'High' },
    { time: '8:00 PM', crowdLevel: 40, status: 'Medium' },
  ];

  const recentExpiry = [
    { id: 1, name: 'John Doe', email: 'john@example.com', expiryDate: '2024-01-15', daysLeft: 3 },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', expiryDate: '2024-01-18', daysLeft: 6 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', expiryDate: '2024-01-20', daysLeft: 8 },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', expiryDate: '2024-01-22', daysLeft: 10 },
  ];

  const getCrowdStatusColor = (status: string) => {
    switch (status) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#f97316';
      case 'Peak': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getExpiryStatusColor = (daysLeft: number) => {
    if (daysLeft <= 3) return '#ef4444';
    if (daysLeft <= 7) return '#f59e0b';
    return '#10b981';
  };

  const handleSendNotification = async (memberId: number, memberName: string) => {
    try {
      // This would call the API to send a notification
      console.log(`Sending notification to ${memberName} (ID: ${memberId})`);
      // await api.createNotification({ memberId, message: 'Your membership is expiring soon!' });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className={`dashboard-content ${theme}`}>
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
                    {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {stat.change}
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
          <div className="section-header">
            <TrendingUp size={20} className="section-icon" />
            <h2 className="section-title">Revenue Trend</h2>
          </div>
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
          <div className="section-header">
            <Activity size={20} className="section-icon" />
            <h2 className="section-title">Recent Activities</h2>
          </div>
          <div className={`activities-container ${theme}`}>
            <div className="activities-content-box">
              <div className="activities-list">
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
                        <div className="activity-time">
                          <Clock size={12} />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Gym Crowd Trend */}
        <div className="crowd-trend-section">
          <div className="section-header">
            <BarChart3 size={20} className="section-icon" />
            <h2 className="section-title">Gym Crowd Trend</h2>
          </div>
          <div className={`crowd-trend-container ${theme}`}>
            <div className="crowd-content-box">
              <div className="crowd-chart">
                {gymCrowdTrend.map((trend, index) => (
                  <div key={index} className="crowd-item">
                    <div className="crowd-bar-container">
                      <div 
                        className="crowd-bar"
                        style={{ 
                          height: `${trend.crowdLevel}%`,
                          backgroundColor: getCrowdStatusColor(trend.status)
                        }}
                      />
                    </div>
                    <div className="crowd-time">
                      <Clock size={12} />
                      {trend.time}
                    </div>
                    <div 
                      className="crowd-status"
                      style={{ color: getCrowdStatusColor(trend.status) }}
                    >
                      {trend.status === 'Peak' && <AlertCircle size={10} />}
                      {trend.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Expiry */}
        <div className="expiry-section">
          <div className="section-header">
            <AlertTriangle size={20} className="section-icon" />
            <h2 className="section-title">Recent Expiry</h2>
          </div>
          <div className={`expiry-container ${theme}`}>
            <div className="expiry-content-box">
              <div className="expiry-list">
                {recentExpiry.map((member) => (
                  <div key={member.id} className="expiry-item">
                    <div className="expiry-info">
                      <div className="expiry-member">
                        <Users2 size={16} className="member-icon" />
                        <div>
                          <div className="expiry-name">{member.name}</div>
                          <div className="expiry-email">{member.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="expiry-details">
                      <div 
                        className="expiry-days"
                        style={{ color: getExpiryStatusColor(member.daysLeft) }}
                      >
                        <Timer size={14} />
                        {member.daysLeft} days left
                      </div>
                      <button 
                        className="notification-btn"
                        onClick={() => handleSendNotification(member.id, member.name)}
                        title="Send notification"
                      >
                        <Bell size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
