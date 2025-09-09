import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Building2, 
  BarChart3, 
  Bell, 
  Users, 
  Megaphone, 
  CheckSquare, 
  Settings, 
  Moon, 
  Sun, 
  LogOut,
  SunIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  capacity: number;
  description: string;
}

interface SidebarProps {
  gyms: Gym[];
  onCollapseChange?: (collapsed: boolean) => void;
  onSignOut?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ gyms, onCollapseChange, onSignOut }) => {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onSignOut?.();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/dashboard/');
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    // Apply brightness filter to the entire app
    document.documentElement.style.filter = `brightness(${value}%)`;
    // Store in localStorage for persistence
    localStorage.setItem('appBrightness', value.toString());
  };

  // Load brightness from localStorage on component mount
  useEffect(() => {
    const savedBrightness = localStorage.getItem('appBrightness');
    if (savedBrightness) {
      const brightnessValue = parseInt(savedBrightness, 10);
      setBrightness(brightnessValue);
      document.documentElement.style.filter = `brightness(${brightnessValue}%)`;
    }
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'facilities', label: 'Facilities', icon: Building2, path: '/dashboard/facilities' },
    { id: 'statistics', label: 'Revenue & Attendance', icon: BarChart3, path: '/dashboard/statistics' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    { id: 'members', label: 'Members', icon: Users, path: '/dashboard/members' },
    { id: 'alerts', label: 'Send Alerts', icon: Megaphone, path: '/dashboard/alerts' },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare, path: '/dashboard/attendance' },
    { id: 'preferences', label: 'Preferences', icon: Settings, path: '/dashboard/preferences' },
  ];

  // Only show compare centers if user has more than 1 gym
  if (gyms.length > 1) {
    navItems.push({ id: 'compare', label: 'Compare Centers', icon: Building2, path: '/dashboard/compare' });
  }

  return (
    <div className={`sidebar ${theme} ${isCollapsed ? 'collapsed' : ''}`}>
      {/* User Profile Section */}
      <div className="user-profile-section">
        <div className="user-profile">
          <div className="user-avatar-container">
            <div className="user-avatar">
              <span className="avatar-text">O</span>
            </div>
            <div className="status-indicator"></div>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <h3 className="user-name">
                <span className="dumbbell-icon">🏋️</span>
                GamePlan Owner
              </h3>
              <p className="user-role">Administrator</p>
              <div className="user-status">
                <span className="status-dot"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={handleCollapseToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="collapse-icon">{isCollapsed ? '>' : '<'}</span>
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Overview</h4>
          {navItems.slice(0, 4).map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="nav-item-icon">
                  <IconComponent size={18} className="icon" />
                </div>
                {!isCollapsed && (
                  <div className="nav-item-content">
                    <span className="nav-item-label">{item.label}</span>
                  </div>
                )}
                {isActive(item.path) && <div className="nav-item-indicator"></div>}
              </button>
            );
          })}
        </div>

        <div className="nav-section">
          <h4 className="nav-section-title">Management</h4>
          {navItems.slice(4).map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="nav-item-icon">
                  <IconComponent size={18} className="icon" />
                </div>
                {!isCollapsed && (
                  <div className="nav-item-content">
                    <span className="nav-item-label">{item.label}</span>
                  </div>
                )}
                {isActive(item.path) && <div className="nav-item-indicator"></div>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <div className="footer-actions">
          {/* Brightness Slider */}
          {!isCollapsed && (
            <div className="brightness-control">
              <div className="brightness-header">
                <SunIcon size={16} className="brightness-icon" />
                <span className="brightness-label">Brightness</span>
                <span className="brightness-value">{brightness}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onChange={(e) => handleBrightnessChange(parseInt(e.target.value, 10))}
                className="brightness-slider"
                title={`Adjust brightness: ${brightness}%`}
              />
            </div>
          )}
          
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={16} className="theme-icon" /> : <Sun size={16} className="theme-icon" />}
            {!isCollapsed && <span className="theme-text">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>}
          </button>
          
          {onSignOut && (
            <button
              className="logout-btn"
              onClick={handleSignOut}
              title={isCollapsed ? 'Sign Out' : ''}
            >
              <LogOut size={16} className="logout-icon" />
              {!isCollapsed && <span className="logout-text">Sign Out</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;