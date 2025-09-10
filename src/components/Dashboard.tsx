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
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ownerName, businessName, gyms, gymNames, onSignOut }) => {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`dashboard ${theme}`}>
      <Sidebar 
        gyms={gyms}
        gymNames={gymNames}
        onCollapseChange={setSidebarCollapsed}
        onSignOut={onSignOut}
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
              <Header 
                title="Members" 
                subtitle="Manage your gym members and their information." 
              />
              <main className="dashboard-body">
                <ErrorBoundary><MembersPage /></ErrorBoundary>
              </main>
            </>
          } />
          
          <Route path="/statistics" element={
            <>
              <Header 
                title="Statistics" 
                subtitle="View detailed analytics and performance metrics." 
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
                subtitle="Manage notifications and alerts for your members." 
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
                subtitle="Send important alerts and announcements to your members." 
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
                  subtitle="Compare performance across different gym locations." 
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
                subtitle="Manage member attendance and QR code check-ins." 
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
                subtitle="Configure your account and system preferences." 
              />
              <main className="dashboard-body">
                <ErrorBoundary><PreferencesPage /></ErrorBoundary>
              </main>
            </>
          } />
          
          {/* Default redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
