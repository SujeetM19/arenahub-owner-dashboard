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
  owner?: {
    name: string;
    profilePicture?: string;
  };
  onCollapseChange?: (collapsed: boolean) => void;
  onSignOut?: () => void;
  onProfileUpdate?: (updatedOwner: { name: string; profilePicture?: string }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ gyms, gymNames, owner, onCollapseChange, onSignOut, onProfileUpdate }) => {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [selectedGyms, setSelectedGyms] = useState<string[]>([]);
  const [currentGym, setCurrentGym] = useState<string | null>(gymNames.length > 0 ? gymNames[0] : null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredGyms, setFilteredGyms] = useState<string[]>(gymNames);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(owner?.name || '');
  const [editedProfilePicture, setEditedProfilePicture] = useState<string | null>(owner?.profilePicture || null);
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

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedName(owner?.name || '');
    setEditedProfilePicture(owner?.profilePicture || null);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedName(owner?.name || '');
    setEditedProfilePicture(owner?.profilePicture || null);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('ownerToken');
      console.log('Retrieved token:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token found');
      console.log('Token length:', token ? token.length : 0);
      console.log('Full token:', token);
      
      if (!token) {
        console.error('No authentication token found');
        alert('Please sign in again. Your session has expired.');
        return;
      }

      console.log('Sending request to:', 'http://localhost:8080/api/owner/profile/update');
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.substring(0, 20)}...`
      });
      console.log('Request body:', {
        name: editedName,
        profilePicture: editedProfilePicture ? 'Base64 image data' : null
      });

      const response = await fetch('http://localhost:8080/api/owner/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editedName,
          profilePicture: editedProfilePicture
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const updatedOwner = await response.json();
        setIsEditingProfile(false);
        
        // Update local state
        if (owner) {
          owner.name = updatedOwner.name;
          owner.profilePicture = updatedOwner.profilePicture;
        }
        
        // Notify parent component
        if (onProfileUpdate) {
          onProfileUpdate({
            name: updatedOwner.name,
            profilePicture: updatedOwner.profilePicture
          });
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        alert('Failed to update profile: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Network error while updating profile');
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        {!isCollapsed && (
          <div className="logo-container">
            <h3 className="user-name" style={{display: 'block'}}>
              ArenaHub
            </h3>
            <img 
              src="/logo.png" 
              alt="ArenaHub Logo" 
              className="logo-image"
              style={{display: 'none'}}
              onLoad={(e) => {
                console.log('Logo loaded successfully');
                e.currentTarget.style.display = 'block';
                const fallback = e.currentTarget.previousElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'none';
              }}
              onError={(e) => {
                console.log('Logo failed to load, keeping fallback text');
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.previousElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
          </div>
        )}
        <div className="user-profile">
          <div className="user-avatar-container">
            <div className="user-avatar" onClick={!isCollapsed ? handleEditProfile : undefined}>
              {isEditingProfile ? (
                <div className="profile-edit-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="profile-picture-input"
                    id="profile-picture-edit"
                  />
                  <label htmlFor="profile-picture-edit" className="profile-picture-label">
                    {editedProfilePicture ? (
                      <img 
                        src={editedProfilePicture} 
                        alt="Profile" 
                        className="profile-image"
                      />
                    ) : (
                      <span className="avatar-text">{editedName?.charAt(0)?.toUpperCase() || 'O'}</span>
                    )}
                    <div className="edit-overlay">
                      <span className="edit-icon">📷</span>
                    </div>
                  </label>
                </div>
              ) : (
                <>
                  {owner?.profilePicture ? (
                    <img 
                      src={owner.profilePicture} 
                      alt="Profile" 
                      className="profile-image"
                    />
                  ) : (
                    <span className="avatar-text">{owner?.name?.charAt(0)?.toUpperCase() || 'O'}</span>
                  )}
                  {!isCollapsed && (
                    <div className="edit-hint">
                      <span className="edit-hint-text">Click to edit</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              {isEditingProfile ? (
                <div className="profile-edit-form">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="profile-name-input"
                    placeholder="Enter name"
                  />
                  <div className="profile-edit-actions">
                    <button 
                      className="save-btn" 
                      onClick={handleSaveProfile}
                      title="Save changes"
                    >
                      ✓
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={handleCancelEdit}
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <p className="user-owner-name">{owner?.name || 'Owner'}</p>
              )}
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
              {filteredGyms.slice(0, 5).map((gymName, index) => (
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
              {filteredGyms.length > 5 && (
                <div className="gym-list-overflow">
                  <span className="gym-overflow-text">+{filteredGyms.length - 5} more gyms</span>
                </div>
              )}
            </div>
            {selectedGyms.length >= 2 && (
              <button className="compare-button" onClick={handleCompareGyms}>
                Compare Selected ({selectedGyms.length})
              </button>
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

        {/* Overview Button - Only show if more than 1 gym */}
        {gymNames.length > 1 && (
          <div className="nav-section">
            {!isCollapsed && <div className="overview-divider"></div>}
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
          </div>
        )}
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