import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './MembersPage.css';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  lastVisit: string;
  totalVisits: number;
  profileImage?: string;
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

  // Placeholder data
  const initialMembers: Member[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      membershipType: 'Premium',
      joinDate: '2024-01-15',
      status: 'active',
      lastVisit: '2024-09-08',
      totalVisits: 45,
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 234-5678',
      membershipType: 'Basic',
      joinDate: '2024-02-20',
      status: 'active',
      lastVisit: '2024-09-07',
      totalVisits: 32,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 345-6789',
      membershipType: 'Premium',
      joinDate: '2024-01-10',
      status: 'inactive',
      lastVisit: '2024-08-15',
      totalVisits: 28,
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      membershipType: 'VIP',
      joinDate: '2023-12-05',
      status: 'active',
      lastVisit: '2024-09-08',
      totalVisits: 67,
    },
    {
      id: '5',
      name: 'Alex Brown',
      email: 'alex.brown@email.com',
      phone: '+1 (555) 567-8901',
      membershipType: 'Basic',
      joinDate: '2024-03-12',
      status: 'suspended',
      lastVisit: '2024-07-20',
      totalVisits: 15,
    },
  ];

  useEffect(() => {
    setMembers(initialMembers);
    setFilteredMembers(initialMembers);
  }, []);

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
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Membership filter
    if (membershipFilter !== 'all') {
      filtered = filtered.filter(member => member.membershipType === membershipFilter);
    }

    setFilteredMembers(filtered);
  }, [members, searchTerm, statusFilter, membershipFilter]);

  const handleAddMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString(),
    };
    setMembers([...members, newMember]);
    setShowAddModal(false);
  };

  const handleEditMember = (memberData: Member) => {
    setMembers(members.map(member => 
      member.id === memberData.id ? memberData : member
    ));
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#f59e0b';
      case 'suspended': return '#ef4444';
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
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
          <div className="stat-number">{members.filter(m => m.status === 'active').length}</div>
          <div className="stat-label">Active Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{members.filter(m => m.membershipType === 'Premium' || m.membershipType === 'VIP').length}</div>
          <div className="stat-label">Premium Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{members.filter(m => {
            const lastVisit = new Date(m.lastVisit);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastVisit > weekAgo;
          }).length}</div>
          <div className="stat-label">Recent Visits</div>
        </div>
      </div>

      <div className="members-table-container">
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
            {filteredMembers.map((member) => (
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
                <td>{new Date(member.lastVisit).toLocaleDateString()}</td>
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
            ))}
          </tbody>
        </table>
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

interface MemberModalProps {
  member?: Member;
  onClose: () => void;
  onSave: (member: Member) => void;
  title: string;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, onClose, onSave, title }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    membershipType: member?.membershipType || 'Basic',
    status: member?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const memberData: Member = {
      id: member?.id || '',
      ...formData,
      joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
      lastVisit: member?.lastVisit || new Date().toISOString().split('T')[0],
      totalVisits: member?.totalVisits || 0,
    };
    onSave(memberData);
  };

  return (
    <div className="modal-overlay">
      <div className={`modal ${theme}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Membership Type</label>
            <select
              value={formData.membershipType}
              onChange={(e) => setFormData({...formData, membershipType: e.target.value})}
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {member ? 'Update' : 'Add'} Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembersPage;
