import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import AttendancePage from './AttendancePage';
import FundamentalsPage from './FundamentalsPage';
import MembershipPlansPage from './MembershipPlansPage';
import GalleryPage from './GalleryPage';
import InventoryPage from './InventoryPage';
import StaffPage from './StaffPage';
import TrainersPage from './TrainersPage';
import ErrorBoundary from './ErrorBoundary';
import './Dashboard.css';

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

interface DashboardProps {
  ownerName: string;
  businessName: string;
  gyms: Gym[];
  gymNames: string[];
  owner?: {
    name: string;
    profilePicture?: string;
  };
  onSignOut: () => void;
  onProfileUpdate?: (updatedOwner: { name: string; profilePicture?: string }) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ownerName, businessName, gyms, gymNames, owner, onSignOut, onProfileUpdate }) => {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  console.log('Dashboard rendered with current path:', window.location.pathname);
  
  // If no gyms, redirect to add first gym
  if (gymNames.length === 0) {
    return <Navigate to="/add-first-gym" replace />;
  }

  return (
    <div className={`dashboard ${theme}`}>
      <Sidebar 
        gyms={gyms}
        gymNames={gymNames}
        owner={owner}
        onCollapseChange={setSidebarCollapsed}
        onSignOut={onSignOut}
        onProfileUpdate={onProfileUpdate}
      />
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={
            <>
              <Header 
                title="Dashboard" 
                subtitle={`Welcome back, ${ownerName}! Here's what's happening at ${businessName}.`} 
              />
              <main className="dashboard-body">
                <ErrorBoundary><DashboardContent /></ErrorBoundary>
              </main>
            </>
          } />
          
          <Route path="/members" element={
            <>
              <MembersPage />
            </>
          } />
          
          <Route path="/analytics" element={
            <>
              <Header 
                title="Analytics" 
                subtitle="View detailed analytics and performance metrics" 
              />
              <main className="dashboard-body">
                <ErrorBoundary><StatisticsPage /></ErrorBoundary>
              </main>
            </>
          } />
          
          <Route path="/notifications" element={
            <>
              <Header 
                title="Notifications" 
                subtitle="Manage notifications and alerts for your members" 
              />
              <main className="dashboard-body">
                <ErrorBoundary><NotificationsPage /></ErrorBoundary>
              </main>
            </>
          } />
          
          <Route path="/alerts" element={
            <>
              <Header 
                title="Send Alerts" 
                subtitle="Send important alerts and announcements to your members" 
              />
              <main className="dashboard-body">
                <ErrorBoundary><SendAlertsPage /></ErrorBoundary>
              </main>
            </>
          } />
          
          {gymNames.length > 1 && (
            <Route path="/compare" element={
              <>
                <Header 
                  title="Compare Centers" 
                  subtitle="Compare performance across different gym locations" 
                />
                <main className="dashboard-body">
                  <ErrorBoundary><CompareCentersPage /></ErrorBoundary>
                </main>
              </>
            } />
          )}
          
          <Route path="/attendance" element={
            <>
              <Header 
                title="Attendance" 
                subtitle="Manage member attendance and QR code check-ins" 
              />
              <main className="dashboard-body">
                <ErrorBoundary><AttendancePage /></ErrorBoundary>
              </main>
            </>
          } />
          
          <Route path="/preferences" element={
            <>
              <Header 
                title="Preferences" 
                subtitle="Configure your account and system preferences" 
              />
              <main className="dashboard-body">
                <ErrorBoundary><PreferencesPage /></ErrorBoundary>
              </main>
            </>
          } />
          
          <Route path="/fundamentals" element={
            <>
              <ErrorBoundary><FundamentalsPage /></ErrorBoundary>
            </>
          } />
          
          <Route path="/membership-plans" element={
            <>
              <ErrorBoundary><MembershipPlansPage /></ErrorBoundary>
            </>
          } />
          
          <Route path="/gallery" element={
            <>
              <ErrorBoundary><GalleryPage /></ErrorBoundary>
            </>
          } />
          
          <Route path="/inventory" element={
            <>
              <ErrorBoundary><InventoryPage /></ErrorBoundary>
            </>
          } />
          
          <Route path="/trainers" element={
            <>
              <ErrorBoundary><TrainersPage /></ErrorBoundary>
            </>
          } />
          
          <Route path="/staff" element={
            <>
              <ErrorBoundary><StaffPage /></ErrorBoundary>
            </>
          } />
          
          {/* Default redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
