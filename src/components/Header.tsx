import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Settings, Plus } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { theme } = useTheme();

  return (
    <header className={`header ${theme}`}>
      <div className="header-content">
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        <div className="header-actions">
          <button className="header-button">
            <Search size={16} className="button-icon" />
            Search
          </button>
          <button className="header-button">
            <Settings size={16} className="button-icon" />
            Settings
          </button>
          <button className="header-button primary">
            <Plus size={16} className="button-icon" />
            Add New
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
