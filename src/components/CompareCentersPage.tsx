import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './CompareCentersPage.css';

interface Center {
  id: string;
  name: string;
  location: string;
  members: number;
  revenue: number;
  equipment: number;
  staff: number;
  rating: number;
  occupancy: number;
  monthlyGrowth: number;
  image?: string;
}

const CompareCentersPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [comparisonMetric, setComparisonMetric] = useState<string>('revenue');

  const centers: Center[] = [
    {
      id: '1',
      name: 'ArenaHub Downtown',
      location: 'Downtown District',
      members: 450,
      revenue: 125000,
      equipment: 85,
      staff: 12,
      rating: 4.8,
      occupancy: 78,
      monthlyGrowth: 12.5
    },
    {
      id: '2',
      name: 'ArenaHub Westside',
      location: 'Westside Plaza',
      members: 320,
      revenue: 89000,
      equipment: 65,
      staff: 8,
      rating: 4.6,
      occupancy: 65,
      monthlyGrowth: 8.2
    },
    {
      id: '3',
      name: 'ArenaHub Eastgate',
      location: 'Eastgate Mall',
      members: 280,
      revenue: 76000,
      equipment: 55,
      staff: 6,
      rating: 4.4,
      occupancy: 58,
      monthlyGrowth: 5.8
    },
    {
      id: '4',
      name: 'ArenaHub Northpoint',
      location: 'Northpoint Center',
      members: 380,
      revenue: 98000,
      equipment: 72,
      staff: 10,
      rating: 4.7,
      occupancy: 72,
      monthlyGrowth: 9.5
    }
  ];

  const handleCenterToggle = (centerId: string) => {
    setSelectedCenters(prev => 
      prev.includes(centerId)
        ? prev.filter(id => id !== centerId)
        : [...prev, centerId]
    );
  };

  const getSelectedCentersData = () => {
    return centers.filter(center => selectedCenters.includes(center.id));
  };

  const getMetricValue = (center: Center, metric: string) => {
    switch (metric) {
      case 'revenue': return center.revenue;
      case 'members': return center.members;
      case 'equipment': return center.equipment;
      case 'staff': return center.staff;
      case 'rating': return center.rating;
      case 'occupancy': return center.occupancy;
      case 'growth': return center.monthlyGrowth;
      default: return 0;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'revenue': return 'Monthly Revenue';
      case 'members': return 'Total Members';
      case 'equipment': return 'Equipment Count';
      case 'staff': return 'Staff Members';
      case 'rating': return 'Average Rating';
      case 'occupancy': return 'Occupancy Rate';
      case 'growth': return 'Monthly Growth';
      default: return '';
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'revenue': return '$';
      case 'members': return '';
      case 'equipment': return '';
      case 'staff': return '';
      case 'rating': return '/5';
      case 'occupancy': return '%';
      case 'growth': return '%';
      default: return '';
    }
  };

  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case 'revenue': return `$${(value / 1000).toFixed(0)}k`;
      case 'rating': return value.toFixed(1);
      case 'occupancy':
      case 'growth': return `${value.toFixed(1)}%`;
      default: return value.toString();
    }
  };

  const getBestCenter = (metric: string) => {
    const selectedData = getSelectedCentersData();
    if (selectedData.length === 0) return null;
    
    return selectedData.reduce((best, current) => {
      const bestValue = getMetricValue(best, metric);
      const currentValue = getMetricValue(current, metric);
      return currentValue > bestValue ? current : best;
    });
  };

  const getWorstCenter = (metric: string) => {
    const selectedData = getSelectedCentersData();
    if (selectedData.length === 0) return null;
    
    return selectedData.reduce((worst, current) => {
      const worstValue = getMetricValue(worst, metric);
      const currentValue = getMetricValue(current, metric);
      return currentValue < worstValue ? current : worst;
    });
  };

  const selectedCentersData = getSelectedCentersData();
  const bestCenter = getBestCenter(comparisonMetric);
  const worstCenter = getWorstCenter(comparisonMetric);

  return (
    <div className={`compare-centers-page ${theme}`}>
      <div className="compare-header">
        <div className="compare-title">
          <h1>Compare Centers</h1>
          <p>Analyze and compare performance across your gym locations</p>
        </div>
      </div>

      <div className="compare-controls">
        <div className="centers-selection">
          <h3>Select Centers to Compare</h3>
          <div className="centers-grid">
            {centers.map((center) => (
              <div 
                key={center.id}
                className={`center-card ${selectedCenters.includes(center.id) ? 'selected' : ''}`}
                onClick={() => handleCenterToggle(center.id)}
              >
                <div className="center-info">
                  <h4>{center.name}</h4>
                  <p>{center.location}</p>
                  <div className="center-stats">
                    <span>{center.members} members</span>
                    <span>Rating: {center.rating}/5</span>
                  </div>
                </div>
                <div className="center-checkbox">
                  {selectedCenters.includes(center.id) && '✓'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-selection">
          <h3>Comparison Metric</h3>
          <div className="metric-buttons">
            {['revenue', 'members', 'equipment', 'staff', 'rating', 'occupancy', 'growth'].map((metric) => (
              <button
                key={metric}
                className={`metric-btn ${comparisonMetric === metric ? 'active' : ''}`}
                onClick={() => setComparisonMetric(metric)}
              >
                {getMetricLabel(metric)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCentersData.length > 0 && (
        <div className="comparison-results">
          <div className="comparison-summary">
            <div className="summary-card best">
              <div className="summary-icon">🏆</div>
              <div className="summary-content">
                <h4>Best Performer</h4>
                <div className="summary-center">{bestCenter?.name}</div>
                <div className="summary-value">
                  {formatMetricValue(getMetricValue(bestCenter!, comparisonMetric), comparisonMetric)}
                  {getMetricUnit(comparisonMetric)}
                </div>
              </div>
            </div>

            <div className="summary-card worst">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h4>Needs Improvement</h4>
                <div className="summary-center">{worstCenter?.name}</div>
                <div className="summary-value">
                  {formatMetricValue(getMetricValue(worstCenter!, comparisonMetric), comparisonMetric)}
                  {getMetricUnit(comparisonMetric)}
                </div>
              </div>
            </div>

            <div className="summary-card difference">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h4>Performance Gap</h4>
                <div className="summary-center">Difference</div>
                <div className="summary-value">
                  {bestCenter && worstCenter && 
                    `${formatMetricValue(
                      getMetricValue(bestCenter, comparisonMetric) - getMetricValue(worstCenter, comparisonMetric),
                      comparisonMetric
                    )}${getMetricUnit(comparisonMetric)}`
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="comparison-chart">
            <h3>{getMetricLabel(comparisonMetric)} Comparison</h3>
            <div className="chart-container">
              <div className="chart-bars">
                {selectedCentersData.map((center) => {
                  const maxValue = Math.max(...selectedCentersData.map(c => getMetricValue(c, comparisonMetric)));
                  const value = getMetricValue(center, comparisonMetric);
                  const percentage = (value / maxValue) * 100;
                  
                  return (
                    <div key={center.id} className="chart-bar-container">
                      <div className="chart-bar">
                        <div 
                          className="bar-fill"
                          style={{ 
                            height: `${percentage}%`,
                            backgroundColor: center.id === bestCenter?.id ? '#10b981' : 
                                           center.id === worstCenter?.id ? '#ef4444' : '#667eea'
                          }}
                        />
                      </div>
                      <div className="bar-label">{center.name}</div>
                      <div className="bar-value">
                        {formatMetricValue(value, comparisonMetric)}{getMetricUnit(comparisonMetric)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="detailed-comparison">
            <h3>Detailed Comparison</h3>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Center</th>
                    <th>Members</th>
                    <th>Revenue</th>
                    <th>Equipment</th>
                    <th>Staff</th>
                    <th>Rating</th>
                    <th>Occupancy</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCentersData.map((center) => (
                    <tr key={center.id}>
                      <td>
                        <div className="center-cell">
                          <div className="center-name">{center.name}</div>
                          <div className="center-location">{center.location}</div>
                        </div>
                      </td>
                      <td>{center.members}</td>
                      <td>${(center.revenue / 1000).toFixed(0)}k</td>
                      <td>{center.equipment}</td>
                      <td>{center.staff}</td>
                      <td>{center.rating}/5</td>
                      <td>{center.occupancy}%</td>
                      <td>{center.monthlyGrowth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedCentersData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Select Centers to Compare</h3>
          <p>Choose two or more centers from the list above to start comparing their performance.</p>
        </div>
      )}
    </div>
  );
};

export default CompareCentersPage;








