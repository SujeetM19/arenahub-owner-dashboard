import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Settings, Plus } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  filterOptions?: {
    status?: {
      value: string;
      onChange: (value: string) => void;
      options: { value: string; label: string }[];
    };
    membership?: {
      value: string;
      onChange: (value: string) => void;
      options: { value: string; label: string }[];
    };
  };
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showFilters = false,
  filterOptions,
  showAddButton = false,
  onAddClick,
  addButtonText = 'Add New'
}) => {
  const { theme } = useTheme();

  return (
    <header className={`header ${theme}`}>
      <div className="header-content">
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        
        {(showSearch || showFilters) && (
          <div className="header-controls">
            {showSearch && (
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
            
            {showFilters && filterOptions && (
              <div className="filter-group">
                {filterOptions.status && (
                  <select
                    value={filterOptions.status.value}
                    onChange={(e) => filterOptions.status?.onChange(e.target.value)}
                    className="filter-select"
                  >
                    {filterOptions.status.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {filterOptions.membership && (
                  <select
                    value={filterOptions.membership.value}
                    onChange={(e) => filterOptions.membership?.onChange(e.target.value)}
                    className="filter-select"
                  >
                    {filterOptions.membership.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="header-actions">
          <button className="header-button">
            <Settings size={16} className="button-icon" />
            Settings
          </button>
          {showAddButton && (
            <button className="header-button primary" onClick={onAddClick}>
              <Plus size={16} className="button-icon" />
              {addButtonText}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
