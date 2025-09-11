import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import SkeletonLoader from './SkeletonLoader';
import MemberModal from './MemberModal';
import Header from './Header';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import './MembersPage.css';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastVisit: string | null;
  totalVisits: number;
  profileImageUrl?: string;
}


const MembersPage: React.FC = () => {
  const { theme } = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Only fetch members if we have a valid token
    const token = localStorage.getItem('ownerToken');
    if (token) {
      fetchMembers();
    }
  }, []);

  const fetchMembers = async (page = 0, search = '', status = 'all', membership = 'all', append = false) => {
    try {
      setIsLoading(true);
      
      // Use 0-based pagination for backend (page 0 -> 0, page 1 -> 1, etc.)
      const backendPage = Math.max(0, page);
      
      // Build query parameters for backend filtering
      const params = new URLSearchParams({
        page: backendPage.toString(),
        size: '10',
        search: search,
        status: status === 'all' ? '' : status,
        membershipType: membership === 'all' ? '' : membership
      });
      
      const response = await fetch(`http://localhost:8080/api/members?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ownerToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      let membersData = [];
      let totalElements = 0;
      
      if (data.content && Array.isArray(data.content)) {
        // Spring Boot Page format
        membersData = data.content;
        totalElements = data.totalElements || 0;
      } else if (Array.isArray(data)) {
        // Direct array format
        membersData = data;
        totalElements = data.length;
      } else {
        console.error('Unexpected data format:', data);
        membersData = [];
      }
      
      if (append && page > 0) {
        // Append to existing members for infinite scroll
        setMembers(prev => [...prev, ...membersData]);
        setFilteredMembers(prev => [...prev, ...membersData]);
      } else {
        // Replace members for new search/filter
        setMembers(membersData);
        setFilteredMembers(membersData);
      }
      
      setCurrentPage(page);
      setHasMore(membersData.length === 10 && ((page + 1) * 10) < totalElements);
      
    } catch (error) {
      console.error('Error fetching members:', error);
      if (!append) {
        setMembers([]);
        setFilteredMembers([]);
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Handle search with debouncing
  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    if (!token) return;

    const timeoutId = setTimeout(() => {
      // Always fetch from backend with current filters
      fetchMembers(0, searchTerm, statusFilter, membershipFilter, false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, membershipFilter]);

  // Handle infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
      fetchMembers(currentPage + 1, searchTerm, statusFilter, membershipFilter, true);
    }
  };

  const handleAddMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const newMember = await api.createMember(memberData);
      setMembers([...members, newMember]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating member:', error);
    }
  };

  const handleEditMember = async (memberData: Member) => {
    try {
      if (editingMember) {
        // Update existing member
        const updatedMember = await api.updateMember(editingMember.id, memberData);
        setMembers(members.map(member => 
          member.id === memberData.id ? { ...member, ...updatedMember } : member
        ));
      }
      setEditingMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.deleteMember(id);
        setMembers(members.filter(member => member.id !== id));
        setFilteredMembers(filteredMembers.filter(member => member.id !== id));
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#10b981';
      case 'INACTIVE': return '#f59e0b';
      case 'SUSPENDED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'VIP': return '#8b5cf6';
      case 'Premium': return '#3b82f6';
      case 'Basic': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`members-page ${theme}`}>
      <div className="members-header-section">
        <Header 
          title="Members" 
          subtitle="Manage your gym members and their information"
        />
      </div>

      <div className="members-content">
        <div className="members-controls" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="members-controls-left" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', flex: 1 }}>
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group" style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  height: '40px',
                  minWidth: '140px',
                  backgroundColor: '#ffffff',
                  color: '#333333',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              
              <select
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  height: '40px',
                  minWidth: '140px',
                  backgroundColor: '#ffffff',
                  color: '#333333',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              >
                <option value="all">All Memberships</option>
                <option value="VIP">VIP</option>
                <option value="Premium">Premium</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
          </div>

          <div className="members-controls-right" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button 
              className="add-member-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="btn-icon" />
              Add New Member
            </button>
          </div>
        </div>

        <div className="members-stats">
        <div className="stat-card">
          <div className="stat-number">{members.length}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{members.filter(m => m.status === 'ACTIVE').length}</div>
          <div className="stat-label">Active Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{members.filter(m => m.membershipType === 'Premium' || m.membershipType === 'VIP').length}</div>
          <div className="stat-label">Premium Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{members.filter(m => {
            if (!m.lastVisit) return false;
            const lastVisit = new Date(m.lastVisit);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastVisit > weekAgo;
          }).length}</div>
          <div className="stat-label">Recent Visits</div>
        </div>
      </div>

      <div className="members-table-container">
        <div className="table-responsive" onScroll={handleScroll}>
          <table className="members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Visit</th>
                <th>Visits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <SkeletonLoader type="table" />
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">{member.name}</div>
                      <div className="member-id">ID: {member.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div className="contact-email">{member.email}</div>
                    <div className="contact-phone">{member.phone}</div>
                  </div>
                </td>
                <td>
                  <span 
                    className="membership-badge"
                    style={{ backgroundColor: getMembershipColor(member.membershipType) }}
                  >
                    {member.membershipType}
                  </span>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(member.status) }}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </td>
                <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                <td>{member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}</td>
                <td>{member.totalVisits}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit"
                      onClick={() => setEditingMember(member)}
                      title="Edit member"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteMember(member.id)}
                      title="Delete member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
                ))
              )}
            </tbody>
          </table>
          {isLoading && filteredMembers.length > 0 && (
            <div className="loading-more">
              <SkeletonLoader type="list" count={3} />
            </div>
          )}
        </div>
      </div>
      </div>

      {showAddModal && (
        <MemberModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMember}
          title="Add New Member"
        />
      )}

      {editingMember && (
        <MemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleEditMember}
          title="Edit Member"
        />
      )}
    </div>
  );
};


export default MembersPage;
