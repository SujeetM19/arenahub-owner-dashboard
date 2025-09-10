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
  ChevronRight,
  Info,
  PieChart,
  CreditCard,
  Image,
  Package,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  Search,
  Filter
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
  gymNames: string[];
  onCollapseChange?: (collapsed: boolean) => void;
  onSignOut?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ gyms, gymNames, onCollapseChange, onSignOut }) => {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [selectedGyms, setSelectedGyms] = useState<string[]>([]);
  const [currentGym, setCurrentGym] = useState<string | null>(gymNames.length > 0 ? gymNames[0] : null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredGyms, setFilteredGyms] = useState<string[]>(gymNames);
  const [showFilters, setShowFilters] = useState<boolean>(false);
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

  const handleGymSelect = (gymName: string) => {
    if (selectedGyms.includes(gymName)) {
      setSelectedGyms(selectedGyms.filter(name => name !== gymName));
    } else {
      setSelectedGyms([...selectedGyms, gymName]);
    }
  };

  const handleGymClick = (gymName: string) => {
    setCurrentGym(gymName);
    navigate('/dashboard');
  };

  const handleCompareGyms = () => {
    if (selectedGyms.length >= 2) {
      navigate('/dashboard/compare');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGyms(gymNames);
    } else {
      const filtered = gymNames.filter(gymName => 
        gymName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredGyms(filtered);
    }
  };

  const handleOverviewClick = () => {
    navigate('/dashboard/all-gyms');
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
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

  // Update filtered gyms when gymNames changes
  useEffect(() => {
    setFilteredGyms(gymNames);
  }, [gymNames]);

  // Management section items (same for all owners)
  const managementItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'members', label: 'Members', icon: Users, path: '/dashboard/members' },
    { id: 'information', label: 'Information', icon: Info, path: '/dashboard/information' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, path: '/dashboard/analytics' },
    { id: 'membership-plans', label: 'Membership Plans', icon: CreditCard, path: '/dashboard/membership-plans' },
    { id: 'gallery', label: 'Gallery', icon: Image, path: '/dashboard/gallery' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/dashboard/inventory' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/dashboard/alerts' },
    { id: 'staff', label: 'Staff', icon: UserCheck, path: '/dashboard/staff' },
  ];

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
        {/* All Gyms Section - Only show if more than 1 gym */}
        {gymNames.length > 1 && (
          <div className="nav-section">
            <button
              className={`nav-item overview-button ${isActive('/dashboard/all-gyms') ? 'active' : ''}`}
              onClick={handleOverviewClick}
            >
              <div className="nav-item-icon">
                <Building2 size={18} className="icon" />
              </div>
              {!isCollapsed && (
                <div className="nav-item-content">
                  <span className="nav-item-label">Overview</span>
                </div>
              )}
              {isActive('/dashboard/all-gyms') && !isCollapsed && <CheckCircle size={16} className="active-indicator" />}
            </button>
            {!isCollapsed && <div className="overview-divider"></div>}
            {!isCollapsed && (
              <>
                <div className="gym-section-header">
                  <h5 className="select-gym-text">Select a Gym</h5>
                </div>
                <div className="gym-search-container">
                  <input
                    type="text"
                    placeholder="Search gyms..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="gym-search-input"
                  />
                  <button className="gym-filter-button" onClick={handleFilterToggle}>
                    <Filter size={14} />
                  </button>
                </div>
                <div className="gym-list">
                  {filteredGyms.map((gymName, index) => (
                    <div key={index} className={`gym-item ${selectedGyms.includes(gymName) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        className="gym-item-checkbox"
                        checked={selectedGyms.includes(gymName)}
                        onChange={() => handleGymSelect(gymName)}
                      />
                      <span className="gym-item-name" onClick={() => handleGymClick(gymName)}>
                        {gymName}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedGyms.length >= 2 && (
                  <button className="compare-button" onClick={handleCompareGyms}>
                    Compare Selected ({selectedGyms.length})
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Management Section */}
        <div className="nav-section">
          {(!isCollapsed && gymNames.length > 1) && <h4 className="nav-section-title">Management</h4>}
          {managementItems.map((item) => {
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