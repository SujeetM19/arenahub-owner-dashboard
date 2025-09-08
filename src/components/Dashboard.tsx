import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './DashboardContent';
import MembersPage from './MembersPage';
import StatisticsPage from './StatisticsPage';
import NotificationsPage from './NotificationsPage';
import SendAlertsPage from './SendAlertsPage';
import CompareCentersPage from './CompareCentersPage';
import PreferencesPage from './PreferencesPage';
import './Dashboard.css';

interface DashboardProps {
  ownerName: string;
  businessName: string;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ownerName, businessName, onSignOut }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'members': return 'Members';
      case 'statistics': return 'Statistics';
      case 'notifications': return 'Notifications';
      case 'alerts': return 'Send Alerts';
      case 'compare': return 'Compare Centers';
      case 'preferences': return 'Preferences';
      default: return 'Dashboard';
    }
  };

  const getTabSubtitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return `Welcome back, ${ownerName}! Here's what's happening at ${businessName}.`;
      case 'members': return 'Manage your gym members and their information.';
      case 'statistics': return 'View detailed analytics and performance metrics.';
      case 'notifications': return 'Manage notifications and alerts for your members.';
      case 'alerts': return 'Send important alerts and announcements to your members.';
      case 'compare': return 'Compare performance across different gym locations.';
      case 'preferences': return 'Configure your account and system preferences.';
      default: return '';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'members':
        return <MembersPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'alerts':
        return <SendAlertsPage />;
      case 'compare':
        return <CompareCentersPage />;
      case 'preferences':
        return <PreferencesPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className={`dashboard ${theme}`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="dashboard-main">
        <Header 
          title={getTabTitle(activeTab)} 
          subtitle={getTabSubtitle(activeTab)} 
        />
        <main className="dashboard-body">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
