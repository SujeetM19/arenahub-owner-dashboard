import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import websocket from '../services/websocket';
import './AttendancePage.css';

interface AttendanceRecord {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  checkInTime: string;
  checkOutTime?: string;
  status: string;
  durationMinutes?: number;
  notes?: string;
  qrCode: string;
  createdAt: string;
}

interface AttendanceStats {
  totalCheckIns: number;
  todayCheckIns: number;
  weeklyCheckIns: number;
  monthlyCheckIns: number;
  averageDailyAttendance: number;
  peakHours: Array<{ hour: number; count: number }>;
  dailyAttendance: Array<{ date: string; count: number }>;
  memberAttendanceRanking: Array<{ memberId: number; memberName: string; totalVisits: number }>;
  statusDistribution: { [key: string]: number };
}

const AttendancePage: React.FC = () => {
  const { theme } = useTheme();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAttendanceData();
    setupWebSocket();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const [history, statsData] = await Promise.all([
        api.getAttendanceHistory().catch(() => []),
        api.getAttendanceStats().catch(() => null)
      ]);
      setAttendanceRecords(Array.isArray(history) ? history : []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceRecords([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const token = localStorage.getItem('ownerToken');
    if (token) {
      try {
        websocket.connect(token);
        
        websocket.subscribeToAttendance((message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.type === 'attendance_marked') {
              fetchAttendanceData(); // Refresh data
            }
          } catch (error) {
            console.error('Error parsing attendance message:', error);
          }
        });

        websocket.subscribeToDashboard((message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.type === 'dashboard_stats') {
              setStats(data.data.attendanceStats);
            }
          } catch (error) {
            console.error('Error parsing dashboard message:', error);
          }
        });
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRCodeSubmit = async () => {
    if (!qrCode || !selectedMember) return;

    try {
      await api.markAttendance(selectedMember, qrCode);
      setQrCode('');
      setSelectedMember(null);
      setNotes('');
      setShowQRScanner(false);
      fetchAttendanceData();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleCheckOut = async (attendanceId: number) => {
    try {
      // This would need to be implemented in the API
      await fetch(`http://localhost:8080/api/attendance/checkout/${attendanceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ownerToken')}`,
        },
      });
      fetchAttendanceData();
    } catch (error) {
      console.error('Error checking out member:', error);
    }
  };

  if (loading) {
    return (
      <div className={`attendance-page ${theme}`}>
        <div className="loading-container">
          <div className="loading-spinner">Loading attendance data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`attendance-page ${theme}`}>
      <div className="attendance-header">
        <h2>Attendance Management</h2>
        <div className="attendance-actions">
          <button 
            className="btn btn-primary"
            onClick={handleQRScan}
          >
            📱 Scan QR Code
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Check-ins</h3>
          <div className="stat-value">{stats?.todayCheckIns || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Weekly Check-ins</h3>
          <div className="stat-value">{stats?.weeklyCheckIns || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Monthly Check-ins</h3>
          <div className="stat-value">{stats?.monthlyCheckIns || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Avg Daily Attendance</h3>
          <div className="stat-value">{stats?.averageDailyAttendance ? stats.averageDailyAttendance.toFixed(1) : '0.0'}</div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Mark Attendance</h3>
            <div className="form-group">
              <label>Member ID:</label>
              <input
                type="number"
                value={selectedMember || ''}
                onChange={(e) => setSelectedMember(parseInt(e.target.value))}
                placeholder="Enter member ID"
              />
            </div>
            <div className="form-group">
              <label>QR Code:</label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Enter or scan QR code"
              />
            </div>
            <div className="form-group">
              <label>Notes (optional):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes..."
              />
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowQRScanner(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleQRCodeSubmit}
                disabled={!qrCode || !selectedMember}
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="attendance-table-container">
        <h3>Recent Attendance</h3>
        <div className="table-responsive">
          {attendanceRecords.length > 0 ? (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Check-in Time</th>
                  <th>Check-out Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="member-info">
                        <div className="member-name">{record.memberName}</div>
                        <div className="member-email">{record.memberEmail}</div>
                      </div>
                    </td>
                    <td>{new Date(record.checkInTime).toLocaleString()}</td>
                    <td>
                      {record.checkOutTime 
                        ? new Date(record.checkOutTime).toLocaleString()
                        : '-'
                      }
                    </td>
                    <td>
                      {record.durationMinutes 
                        ? `${Math.floor(record.durationMinutes / 60)}h ${record.durationMinutes % 60}m`
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      {record.status === 'CHECKED_IN' && (
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleCheckOut(record.id)}
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h4>No attendance records found</h4>
              <p>Attendance data will appear here once members start checking in.</p>
            </div>
          )}
        </div>
      </div>

      {/* Member Ranking */}
      {stats && stats.memberAttendanceRanking.length > 0 && (
        <div className="member-ranking">
          <h3>Top Members by Attendance</h3>
          <div className="ranking-list">
            {stats.memberAttendanceRanking.slice(0, 10).map((member, index) => (
              <div key={member.memberId} className="ranking-item">
                <div className="rank">#{index + 1}</div>
                <div className="member-info">
                  <div className="member-name">{member.memberName}</div>
                  <div className="visit-count">{member.totalVisits} visits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
