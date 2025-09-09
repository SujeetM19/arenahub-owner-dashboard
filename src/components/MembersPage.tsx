import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import SkeletonLoader from './SkeletonLoader';
import MemberModal from './MemberModal';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Only fetch members if we have a valid token
    const token = localStorage.getItem('ownerToken');
    if (token) {
      fetchMembers();
    }
  }, []);

  const fetchMembers = async (page = 1, search = '', status = 'all', membership = 'all') => {
    try {
      setIsLoading(true);
      
      // Convert to 0-based pagination for backend (page 1 -> 0, page 2 -> 1, etc.)
      const backendPage = Math.max(0, page - 1);
      
      // Build query parameters for backend filtering
      const params = new URLSearchParams({
        page: backendPage.toString(),
        size: '10',
        search: search,
        status: status === 'all' ? '' : status,
        membershipType: membership === 'all' ? '' : membership
      });
      
      const data = await api.getMembers(params.toString());
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMembers(data);
        setFilteredMembers(data);
        setCurrentPage(page);
        setHasMore(data.length === 10); // Assuming 10 items per page
      } else {
        console.error('Invalid data format received:', data);
        setMembers([]);
        setFilteredMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle search with debouncing
  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    if (!token) return;

    const timeoutId = setTimeout(() => {
      if (searchTerm !== '' || statusFilter !== 'all' || membershipFilter !== 'all') {
        fetchMembers(1, searchTerm, statusFilter, membershipFilter);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, membershipFilter]);

  // Handle infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
      fetchMembers(currentPage + 1, searchTerm, statusFilter, membershipFilter);
    }
  };

  useEffect(() => {
    let filtered = members;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter.toUpperCase());
    }

    // Membership filter
    if (membershipFilter !== 'all') {
      filtered = filtered.filter(member => member.membershipType === membershipFilter);
    }

    setFilteredMembers(filtered);
  }, [members, searchTerm, statusFilter, membershipFilter]);

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
      <div className="members-header">
        <div className="members-title">
          <h1>Members Management</h1>
          <p>Manage your gym members and their information</p>
        </div>
        <button 
          className="add-member-btn"
          onClick={() => setShowAddModal(true)}
        >
          <span className="btn-icon">➕</span>
          Add New Member
        </button>
      </div>

      <div className="members-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          
          <select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
          >
            <option value="all">All Memberships</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
            <option value="Basic">Basic</option>
          </select>
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
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      🗑️
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
