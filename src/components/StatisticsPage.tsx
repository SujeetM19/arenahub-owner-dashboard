import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './StatisticsPage.css';

const StatisticsPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for statistics
  const revenueData = {
    month: [45000, 52000, 48000, 61000, 55000, 67000, 72000],
    week: [12000, 15000, 11000, 18000, 16000, 19000, 21000],
    year: [450000, 520000, 480000, 610000, 550000, 670000, 720000, 680000, 750000, 800000, 820000, 850000]
  };

  const memberGrowthData = {
    month: [120, 135, 142, 158, 165, 172, 180],
    week: [30, 35, 32, 38, 40, 42, 45],
    year: [1200, 1350, 1420, 1580, 1650, 1720, 1800, 1850, 1920, 2000, 2050, 2100]
  };

  const equipmentUsageData = [
    { name: 'Treadmills', usage: 85, capacity: 100 },
    { name: 'Weight Machines', usage: 72, capacity: 100 },
    { name: 'Free Weights', usage: 90, capacity: 100 },
    { name: 'Cardio Equipment', usage: 78, capacity: 100 },
    { name: 'Yoga Studio', usage: 65, capacity: 100 },
  ];

  const membershipDistribution = [
    { type: 'VIP', count: 45, percentage: 15, color: '#8b5cf6' },
    { type: 'Premium', count: 120, percentage: 40, color: '#3b82f6' },
    { type: 'Basic', count: 135, percentage: 45, color: '#10b981' },
  ];

  const peakHours = [
    { hour: '6:00 AM', members: 25 },
    { hour: '7:00 AM', members: 45 },
    { hour: '8:00 AM', members: 35 },
    { hour: '12:00 PM', members: 60 },
    { hour: '5:00 PM', members: 80 },
    { hour: '6:00 PM', members: 95 },
    { hour: '7:00 PM', members: 75 },
    { hour: '8:00 PM', members: 40 },
  ];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'week': return { revenue: revenueData.week, members: memberGrowthData.week };
      case 'year': return { revenue: revenueData.year, members: memberGrowthData.year };
      default: return { revenue: revenueData.month, members: memberGrowthData.month };
    }
  };

  const currentData = getCurrentData();
  const maxRevenue = Math.max(...currentData.revenue);
  const maxMembers = Math.max(...currentData.members);

  return (
    <div className={`statistics-page ${theme}`}>
      <div className="statistics-header">
        <div className="statistics-title">
          <h1>Analytics & Statistics</h1>
          <p>Comprehensive insights into your gym's performance</p>
        </div>
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

      <div className="statistics-grid">
        {/* Revenue Chart */}
        <div className="chart-section">
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
              {currentData.revenue.map((value, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(value / maxRevenue) * 100}%`,
                      backgroundColor: '#667eea'
                    }}
                  />
                  <div className="chart-value">${(value / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
            <div className="chart-labels">
              {selectedPeriod === 'week' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              {selectedPeriod === 'month' && ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']}
              {selectedPeriod === 'year' && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            </div>
          </div>
        </div>

        {/* Member Growth Chart */}
        <div className="chart-section">
          <div className="chart-header">
            <h3>Member Growth</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
                New Members
              </span>
            </div>
          </div>
          <div className="chart-container">
            <div className="line-chart">
              <svg viewBox="0 0 400 200" className="line-svg">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={currentData.members.map((value, index) => 
                    `${(index / (currentData.members.length - 1)) * 380 + 10},${200 - (value / maxMembers) * 180}`
                  ).join(' ')}
                />
                {currentData.members.map((value, index) => (
                  <circle
                    key={index}
                    cx={(index / (currentData.members.length - 1)) * 380 + 10}
                    cy={200 - (value / maxMembers) * 180}
                    r="4"
                    fill="#10b981"
                  />
                ))}
              </svg>
            </div>
            <div className="chart-labels">
              {selectedPeriod === 'week' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              {selectedPeriod === 'month' && ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']}
              {selectedPeriod === 'year' && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            </div>
          </div>
        </div>

        {/* Equipment Usage */}
        <div className="chart-section">
          <div className="chart-header">
            <h3>Equipment Usage</h3>
          </div>
          <div className="equipment-list">
            {equipmentUsageData.map((equipment, index) => (
              <div key={index} className="equipment-item">
                <div className="equipment-info">
                  <span className="equipment-name">{equipment.name}</span>
                  <span className="equipment-usage">{equipment.usage}%</span>
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

        {/* Membership Distribution */}
        <div className="chart-section">
          <div className="chart-header">
            <h3>Membership Distribution</h3>
          </div>
          <div className="membership-chart">
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" className="pie-svg">
                {membershipDistribution.map((item, index) => {
                  const startAngle = membershipDistribution.slice(0, index).reduce((sum, prev) => sum + (prev.percentage * 3.6), 0);
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
              {membershipDistribution.map((item, index) => (
                <div key={index} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="legend-text">
                    {item.type}: {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="chart-section">
          <div className="chart-header">
            <h3>Peak Hours</h3>
          </div>
          <div className="peak-hours">
            {peakHours.map((hour, index) => (
              <div key={index} className="peak-hour-item">
                <span className="hour-time">{hour.hour}</span>
                <div className="hour-bar">
                  <div 
                    className="hour-fill"
                    style={{ 
                      width: `${(hour.members / 100) * 100}%`,
                      backgroundColor: '#667eea'
                    }}
                  />
                </div>
                <span className="hour-count">{hour.members}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="chart-section">
          <div className="chart-header">
            <h3>Key Metrics</h3>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value">92%</div>
              <div className="metric-label">Member Retention</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">4.8</div>
              <div className="metric-label">Avg Rating</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">156</div>
              <div className="metric-label">Avg Monthly Visits</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">$2,450</div>
              <div className="metric-label">Avg Revenue/Member</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
