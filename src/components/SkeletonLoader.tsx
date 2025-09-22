import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list' | 'chart' | 'text';
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  count = 1, 
  height, 
  width, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`} style={{ height, width }}>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        );
      
      case 'table':
        return (
          <div className={`skeleton-table ${className}`} style={{ height, width }}>
            <div className="skeleton-table-header">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton-table-row">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            ))}
          </div>
        );
      
      case 'list':
        return (
          <div className={`skeleton-list ${className}`} style={{ height, width }}>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-list-item">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'chart':
        return (
          <div className={`skeleton-chart ${className}`} style={{ height, width }}>
            <div className="skeleton-chart-bars">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="skeleton-bar" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
              ))}
            </div>
            <div className="skeleton-chart-labels">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`skeleton-text ${className}`} style={{ height, width }}>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-line" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
            ))}
          </div>
        );
      
      default:
        return <div className={`skeleton-default ${className}`} style={{ height, width }}></div>;
    }
  };

  if (count > 1 && type !== 'list') {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default SkeletonLoader;














