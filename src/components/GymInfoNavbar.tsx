import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Info, CreditCard, Package, Image } from 'lucide-react';
import './GymInfoNavbar.css';

interface GymInfoNavbarProps {
  className?: string;
}

const GymInfoNavbar: React.FC<GymInfoNavbarProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'fundamentals', label: 'Fundamentals', icon: Info, path: '/fundamentals' },
    { id: 'membership-plans', label: 'Membership Plans', icon: CreditCard, path: '/membership-plans' },
    { id: 'facilities', label: 'Facilities', icon: Package, path: '/facilities' },
    { id: 'gallery', label: 'Gallery', icon: Image, path: '/gallery' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={`gym-info-navbar ${className}`}>
      <div className="navbar-container">
        <div className="navbar-items">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`navbar-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <IconComponent size={18} className="navbar-icon" />
                <span className="navbar-label">{item.label}</span>
                {isActive(item.path) && <div className="navbar-indicator"></div>}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default GymInfoNavbar;






