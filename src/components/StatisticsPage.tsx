import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock, 
  Eye, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../services/api';
import './StatisticsPage.css';

const StatisticsPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: BarChart3 },
    { id: 'revenue', name: 'Revenue', icon: DollarSign },
    { id: 'attendance', name: 'Attendance', icon: Users },
    { id: 'members', name: 'Members', icon: Target },
    { id: 'general', name: 'General', icon: Activity }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data from backend
      try {
        const data = await api.getAnalytics(1, selectedPeriod);
        setAnalyticsData(data);
        return;
      } catch (apiError) {
        console.log('Backend analytics not available, using mock data:', apiError);
      }
      
      // Fallback to mock data
      const mockData = {
        revenue: {
          revenueTrend: generateMockRevenueTrend(),
          subscriptionBreakdown: [
            { type: 'Basic', revenue: 15000, color: '#667eea', count: 45, percentage: 30.0 },
            { type: 'Premium', revenue: 20000, color: '#10b981', count: 60, percentage: 40.0 },
            { type: 'VIP', revenue: 10000, color: '#f59e0b', count: 30, percentage: 20.0 },
            { type: 'Corporate', revenue: 5000, color: '#ef4444', count: 15, percentage: 10.0 }
          ],
          totalRevenue: 50000,
          revenueGrowth: 12.5
        },
        attendance: {
          attendanceTrend: generateMockAttendanceTrend(),
          crowdTrends: [
            { time: '6:00 AM', crowd: 25, capacity: 100, percentage: 25.0 },
            { time: '8:00 AM', crowd: 45, capacity: 100, percentage: 45.0 },
            { time: '10:00 AM', crowd: 20, capacity: 100, percentage: 20.0 },
            { time: '12:00 PM', crowd: 60, capacity: 100, percentage: 60.0 },
            { time: '2:00 PM', crowd: 30, capacity: 100, percentage: 30.0 },
            { time: '4:00 PM', crowd: 40, capacity: 100, percentage: 40.0 },
            { time: '6:00 PM', crowd: 85, capacity: 100, percentage: 85.0 },
            { time: '8:00 PM', crowd: 50, capacity: 100, percentage: 50.0 },
            { time: '10:00 PM', crowd: 15, capacity: 100, percentage: 15.0 }
          ],
          averageAttendance: 85.5,
          attendanceGrowth: 8.3
        },
        members: {
          memberGrowth: generateMockMemberGrowth(),
          newMembers: generateMockNewMembers(),
          subscriptionTypes: [
            { type: 'Basic', count: 45, percentage: 30.0, color: '#667eea' },
            { type: 'Premium', count: 60, percentage: 40.0, color: '#10b981' },
            { type: 'VIP', count: 30, percentage: 20.0, color: '#f59e0b' },
            { type: 'Corporate', count: 15, percentage: 10.0, color: '#ef4444' }
          ],
          totalMembers: 150,
          memberGrowthRate: 15.2
        },
        general: {
          visibilityTrend: generateMockVisibilityTrend(),
          equipmentUsage: [
            { name: 'Treadmills', usage: 85.0, trend: 'up', status: 'high' },
            { name: 'Weight Machines', usage: 72.0, trend: 'stable', status: 'medium' },
            { name: 'Free Weights', usage: 68.0, trend: 'down', status: 'medium' },
            { name: 'Cardio Equipment', usage: 90.0, trend: 'up', status: 'high' },
            { name: 'Yoga Mats', usage: 55.0, trend: 'stable', status: 'low' }
          ],
          averageVisibility: 75.5,
          visibilityGrowth: 12.5
        },
        keyMetrics: {
          averageRating: 4.8,
          memberRetention: 92.0,
          averageMonthlyVisits: 156,
          averageRevenuePerMember: 2450.0
        }
      };
      setAnalyticsData(mockData);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockRevenueTrend = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        label: `Day ${i + 1}`,
        value: 1000 + Math.random() * 2000,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    return data;
  };

  const generateMockAttendanceTrend = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        label: `Day ${i + 1}`,
        value: 80 + Math.random() * 20,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    return data;
  };

  const generateMockMemberGrowth = () => {
    const data = [];
    let baseCount = 120;
    for (let i = 0; i < 30; i++) {
      baseCount += Math.floor(Math.random() * 3);
      data.push({
        label: `Day ${i + 1}`,
        value: baseCount,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    return data;
  };

  const generateMockNewMembers = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        label: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 5),
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    return data;
  };

  const generateMockVisibilityTrend = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        label: `Day ${i + 1}`,
        value: 70 + Math.random() * 20,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    return data;
  };

  const shouldShowCategory = (category: string) => {
    return selectedCategory === 'all' || selectedCategory === category;
  };

  if (loading) {
    return (
      <div className={`analytics-page ${theme}`}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading analytics...</div>
            <div style={{ color: 'var(--text-secondary)' }}>Please wait while we fetch your data</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`analytics-page ${theme}`}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>Error</div>
            <div style={{ color: 'var(--text-secondary)' }}>{error}</div>
            <button 
              onClick={loadAnalyticsData}
              style={{ 
                marginTop: '1rem', 
                padding: '0.5rem 1rem', 
                background: 'var(--accent-color)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className={`analytics-page ${theme}`}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No data available</div>
            <div style={{ color: 'var(--text-secondary)' }}>Unable to load analytics data</div>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const revenueData = analyticsData.revenue?.revenueTrend || [];
  const attendanceData = analyticsData.attendance?.attendanceTrend || [];
  const memberData = analyticsData.members?.memberGrowth || [];
  const visibilityData = analyticsData.general?.visibilityTrend || [];
  const newMemberData = analyticsData.members?.newMembers || [];
  const subscriptionTypes = analyticsData.members?.subscriptionTypes || [];
  const crowdTrends = analyticsData.attendance?.crowdTrends || [];
  const equipmentUsage = analyticsData.general?.equipmentUsage || [];
  const keyMetrics = analyticsData.keyMetrics || {};

  // Calculate max values for charts
  const maxRevenue = Math.max(...revenueData.map((d: any) => d.value), 1);
  const maxAttendance = Math.max(...attendanceData.map((d: any) => d.value), 1);
  const maxMembers = Math.max(...memberData.map((d: any) => d.value), 1);
  const maxVisibility = Math.max(...visibilityData.map((d: any) => d.value), 1);
  const maxNewMembers = Math.max(...newMemberData.map((d: any) => d.value), 1);

  // Calculate totals and averages
  const totalRevenue = analyticsData.revenue?.totalRevenue || 0;
  const avgAttendance = analyticsData.attendance?.averageAttendance || 0;
  const totalMembers = analyticsData.members?.totalMembers || 0;
  const avgVisibility = analyticsData.general?.averageVisibility || 0;

  const revenueTrend = analyticsData.revenue?.revenueGrowth || 0;
  const attendanceTrend = analyticsData.attendance?.attendanceGrowth || 0;
  const memberTrend = analyticsData.members?.memberGrowthRate || 0;

  return (
    <div className={`analytics-page ${theme}`}>
      {/* Header Section */}
      <div className="analytics-header">
        <div className="header-content">
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Comprehensive insights into your gym's performance and trends</p>
        </div>
        <div className="header-controls">
          <div className="period-selector">
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'year' ? 'active' : ''}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="category-nav">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <IconComponent size={20} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Key Metrics Overview */}
      <div className="metrics-overview">
        <div className="metric-card revenue">
          <div className="metric-icon">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">${(totalRevenue / 1000).toFixed(0)}k</div>
            <div className="metric-label">Total Revenue</div>
            <div className={`metric-trend ${revenueTrend >= 0 ? 'positive' : 'negative'}`}>
              {revenueTrend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(revenueTrend).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="metric-card attendance">
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{avgAttendance.toFixed(1)}%</div>
            <div className="metric-label">Avg Attendance</div>
            <div className={`metric-trend ${attendanceTrend >= 0 ? 'positive' : 'negative'}`}>
              {attendanceTrend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(attendanceTrend).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="metric-card members">
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{totalMembers}</div>
            <div className="metric-label">Total Members</div>
            <div className={`metric-trend ${memberTrend >= 0 ? 'positive' : 'negative'}`}>
              {memberTrend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(memberTrend).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="metric-card visibility">
          <div className="metric-icon">
            <Eye size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{avgVisibility.toFixed(1)}%</div>
            <div className="metric-label">Avg Visibility</div>
            <div className="metric-trend positive">
              <ArrowUpRight size={16} />
              {analyticsData.general?.visibilityGrowth?.toFixed(1) || 12.5}%
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="analytics-content">
        
        {/* Revenue Section */}
        {shouldShowCategory('revenue') && (
          <div className="analytics-section">
            <div className="section-header">
              <h2 className="section-title">
                <DollarSign size={24} />
                Revenue Analytics
              </h2>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Revenue Trend</h3>
                  <div className="chart-legend">
                    <span className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: '#667eea' }}></span>
                      Revenue
                    </span>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="chart-bars">
                    {revenueData.map((point: any, index: number) => (
                      <div key={index} className="chart-bar-container">
                        <div 
                          className="chart-bar"
                          style={{ 
                            height: `${(point.value / maxRevenue) * 100}%`,
                            backgroundColor: '#667eea'
                          }}
                        />
                        <div className="chart-value">${(point.value / 1000).toFixed(0)}k</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    {revenueData.map((point: any, index: number) => (
                      <span key={index}>{point.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Revenue by Subscription Type</h3>
                </div>
                <div className="revenue-breakdown">
                  {analyticsData.revenue?.subscriptionBreakdown?.map((type: any, index: number) => (
                    <div key={index} className="revenue-item">
                      <div className="revenue-info">
                        <span className="revenue-type">{type.type}</span>
                        <span className="revenue-amount">${(type.revenue / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="revenue-bar">
                        <div 
                          className="revenue-fill"
                          style={{ 
                            width: `${type.percentage}%`,
                            backgroundColor: type.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Section */}
        {shouldShowCategory('attendance') && (
          <div className="analytics-section">
            <div className="section-header">
              <h2 className="section-title">
                <Users size={24} />
                Attendance Analytics
              </h2>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Attendance Trend</h3>
                </div>
                <div className="chart-container">
                  <div className="line-chart">
                    <svg viewBox="0 0 400 200" className="line-svg">
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        points={attendanceData.map((point: any, index: number) => 
                          `${(index / (attendanceData.length - 1)) * 380 + 10},${200 - (point.value / maxAttendance) * 180}`
                        ).join(' ')}
                      />
                      {attendanceData.map((point: any, index: number) => (
                        <circle
                          key={index}
                          cx={(index / (attendanceData.length - 1)) * 380 + 10}
                          cy={200 - (point.value / maxAttendance) * 180}
                          r="4"
                          fill="#10b981"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="chart-labels">
                    {attendanceData.map((point: any, index: number) => (
                      <span key={index}>{point.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Crowd Trends by Time</h3>
                </div>
                <div className="crowd-trends">
                  {crowdTrends.map((trend: any, index: number) => (
                    <div key={index} className="crowd-item">
                      <span className="crowd-time">{trend.time}</span>
                      <div className="crowd-bar">
                        <div 
                          className="crowd-fill"
                          style={{ 
                            width: `${trend.percentage}%`,
                            backgroundColor: trend.percentage > 80 ? '#ef4444' : trend.percentage > 60 ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                      <span className="crowd-count">{trend.crowd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Section */}
        {shouldShowCategory('members') && (
          <div className="analytics-section">
            <div className="section-header">
              <h2 className="section-title">
                <Target size={24} />
                Member Analytics
              </h2>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Member Growth</h3>
                </div>
                <div className="chart-container">
                  <div className="line-chart">
                    <svg viewBox="0 0 400 200" className="line-svg">
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        points={memberData.map((point: any, index: number) => 
                          `${(index / (memberData.length - 1)) * 380 + 10},${200 - (point.value / maxMembers) * 180}`
                        ).join(' ')}
                      />
                      {memberData.map((point: any, index: number) => (
                        <circle
                          key={index}
                          cx={(index / (memberData.length - 1)) * 380 + 10}
                          cy={200 - (point.value / maxMembers) * 180}
                          r="4"
                          fill="#3b82f6"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="chart-labels">
                    {memberData.map((point: any, index: number) => (
                      <span key={index}>{point.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>New Members Joining</h3>
                </div>
                <div className="chart-container">
                  <div className="chart-bars">
                    {newMemberData.map((point: any, index: number) => (
                      <div key={index} className="chart-bar-container">
                        <div 
                          className="chart-bar"
                          style={{ 
                            height: `${(point.value / maxNewMembers) * 100}%`,
                            backgroundColor: '#8b5cf6'
                          }}
                        />
                        <div className="chart-value">{point.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    {newMemberData.map((point: any, index: number) => (
                      <span key={index}>{point.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Subscription Types Distribution</h3>
                </div>
                <div className="membership-chart">
                  <div className="pie-chart">
                    <svg viewBox="0 0 200 200" className="pie-svg">
                      {subscriptionTypes.map((item: any, index: number) => {
                        const startAngle = subscriptionTypes.slice(0, index).reduce((sum: number, prev: any) => sum + (prev.percentage * 3.6), 0);
                        const endAngle = startAngle + (item.percentage * 3.6);
                        const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                        const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                        const largeArcFlag = item.percentage > 50 ? 1 : 0;
                        
                        const x1 = 100 + 60 * Math.cos(startAngleRad);
                        const y1 = 100 + 60 * Math.sin(startAngleRad);
                        const x2 = 100 + 60 * Math.cos(endAngleRad);
                        const y2 = 100 + 60 * Math.sin(endAngleRad);
                        
                        const pathData = [
                          `M 100 100`,
                          `L ${x1} ${y1}`,
                          `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `Z`
                        ].join(' ');
                        
                        return (
                          <path
                            key={index}
                            d={pathData}
                            fill={item.color}
                            stroke="var(--bg-secondary)"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="membership-legend">
                    {subscriptionTypes.map((item: any, index: number) => (
                      <div key={index} className="legend-item">
                        <span 
                          className="legend-color" 
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="legend-text">
                          {item.type}: {item.count} ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Section */}
        {shouldShowCategory('general') && (
          <div className="analytics-section">
            <div className="section-header">
              <h2 className="section-title">
                <Activity size={24} />
                General Analytics
              </h2>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Visibility Trends</h3>
                </div>
                <div className="chart-container">
                  <div className="line-chart">
                    <svg viewBox="0 0 400 200" className="line-svg">
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        points={visibilityData.map((point: any, index: number) => 
                          `${(index / (visibilityData.length - 1)) * 380 + 10},${200 - (point.value / maxVisibility) * 180}`
                        ).join(' ')}
                      />
                      {visibilityData.map((point: any, index: number) => (
                        <circle
                          key={index}
                          cx={(index / (visibilityData.length - 1)) * 380 + 10}
                          cy={200 - (point.value / maxVisibility) * 180}
                          r="4"
                          fill="#f59e0b"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="chart-labels">
                    {visibilityData.map((point: any, index: number) => (
                      <span key={index}>{point.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Equipment Usage</h3>
                </div>
                <div className="equipment-list">
                  {equipmentUsage.map((equipment: any, index: number) => (
                    <div key={index} className="equipment-item">
                      <div className="equipment-info">
                        <span className="equipment-name">{equipment.name}</span>
                        <div className="equipment-stats">
                          <span className="equipment-usage">{equipment.usage.toFixed(1)}%</span>
                          <div className={`equipment-trend ${equipment.trend}`}>
                            {equipment.trend === 'up' && <ArrowUpRight size={14} />}
                            {equipment.trend === 'down' && <ArrowDownRight size={14} />}
                            {equipment.trend === 'stable' && <span>—</span>}
                          </div>
                        </div>
                      </div>
                      <div className="usage-bar">
                        <div 
                          className="usage-fill"
                          style={{ 
                            width: `${equipment.usage}%`,
                            backgroundColor: equipment.usage > 80 ? '#10b981' : equipment.usage > 60 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Key Performance Indicators</h3>
                </div>
                <div className="kpi-grid">
                  <div className="kpi-item">
                    <div className="kpi-icon">
                      <Star size={20} />
                    </div>
                    <div className="kpi-content">
                      <div className="kpi-value">{keyMetrics.averageRating?.toFixed(1) || '4.8'}</div>
                      <div className="kpi-label">Avg Rating</div>
                    </div>
                  </div>
                  <div className="kpi-item">
                    <div className="kpi-icon">
                      <Zap size={20} />
                    </div>
                    <div className="kpi-content">
                      <div className="kpi-value">{keyMetrics.memberRetention?.toFixed(0) || '92'}%</div>
                      <div className="kpi-label">Member Retention</div>
                    </div>
                  </div>
                  <div className="kpi-item">
                    <div className="kpi-icon">
                      <Calendar size={20} />
                    </div>
                    <div className="kpi-content">
                      <div className="kpi-value">{keyMetrics.averageMonthlyVisits || '156'}</div>
                      <div className="kpi-label">Avg Monthly Visits</div>
                    </div>
                  </div>
                  <div className="kpi-item">
                    <div className="kpi-icon">
                      <DollarSign size={20} />
                    </div>
                    <div className="kpi-content">
                      <div className="kpi-value">${keyMetrics.averageRevenuePerMember?.toFixed(0) || '2,450'}</div>
                      <div className="kpi-label">Avg Revenue/Member</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;