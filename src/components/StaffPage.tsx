import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Filter, Edit, Trash2, User, Mail, Phone, Calendar, Shield, Clock, DollarSign } from 'lucide-react';
import api from '../services/api';
import './StaffPage.css';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  permissions?: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  address: string;
  notes?: string;
  profileImageUrl?: string;
  gymId?: number;
  gymName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const StaffPage: React.FC = () => {
  const { theme } = useTheme();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [newMember, setNewMember] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    email: '',
    contactNumber: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'ACTIVE',
    permissions: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    address: '',
    notes: '',
    profileImageUrl: ''
  });

  // Image upload states
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const departments = ['All', 'OPERATIONS', 'TRAINING', 'FRONT_DESK', 'MAINTENANCE', 'MANAGEMENT', 'CLEANING', 'SECURITY'];
  const statuses = ['All', 'ACTIVE', 'INACTIVE', 'ON_LEAVE'];
  const positions = ['Manager', 'Personal Trainer', 'Group Fitness Instructor', 'Receptionist', 'Maintenance', 'Cleaner', 'Security'];

  // Load staff members from API
  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await api.getStaff();
      
      // Handle both paginated and non-paginated responses
      if (response && typeof response === 'object') {
        if (response.content && Array.isArray(response.content)) {
          setStaffMembers(response.content);
          setError(null); // Clear error on successful data load
        } else if (Array.isArray(response)) {
          setStaffMembers(response);
          setError(null); // Clear error on successful data load
        } else {
          setStaffMembers([]);
        }
      } else {
        setStaffMembers([]);
      }
    } catch (err: any) {
      console.error('Error loading staff members:', err);
      
      // Handle specific error cases
      if (err.status === 401 || err.status === 403) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to load staff members. Please try again.');
      }
      
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        setNewMember({ ...newMember, profileImageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset image states
  const resetImageStates = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  // Open edit modal with proper state setup
  const openEditModal = (member: StaffMember) => {
    setEditingMember(member);
    if (member.profileImageUrl) {
      setProfileImagePreview(member.profileImageUrl);
    } else {
      setProfileImagePreview(null);
    }
  };

  // Close modals and reset states
  const closeModals = () => {
    setShowAddModal(false);
    setEditingMember(null);
    resetImageStates();
  };

  const handleAddMember = async () => {
    try {
      // Get gym ID dynamically
      const gyms = await api.getGyms();
      const gymId = gyms.length > 0 ? gyms[0].id : 1;
      
      const response = await api.createStaff({
        ...newMember,
        gymId: gymId
      });
      setStaffMembers(prev => [response, ...prev]);
      setShowAddModal(false);
      setNewMember({
        name: '',
        email: '',
        contactNumber: '',
        position: '',
        department: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: 'ACTIVE',
        permissions: [],
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        address: '',
        notes: '',
        profileImageUrl: ''
      });
      resetImageStates();
    } catch (err) {
      setError('Failed to add staff member');
      console.error('Error adding staff member:', err);
    }
  };

  const handleEditMember = async (member: StaffMember) => {
    try {
      // Get gym ID dynamically
      const gyms = await api.getGyms();
      const gymId = gyms.length > 0 ? gyms[0].id : 1;
      
      const response = await api.updateStaff(member.id, {
        ...member,
        gymId: gymId
      });
      setStaffMembers(prev => prev.map(m => m.id === member.id ? response : m));
      setEditingMember(null);
    } catch (err) {
      setError('Failed to update staff member');
      console.error('Error updating staff member:', err);
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      await api.deleteStaff(id);
      setStaffMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      setError('Failed to delete staff member');
      console.error('Error deleting staff member:', err);
    }
  };

  const filteredMembers = Array.isArray(staffMembers) ? staffMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  }) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#22c55e';
      case 'INACTIVE': return '#6b7280';
      case 'ON_LEAVE': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'ON_LEAVE': return 'On Leave';
      default: return status;
    }
  };


  const getActiveStaffCount = () => {
    return Array.isArray(staffMembers) ? staffMembers.filter(member => member.status === 'ACTIVE').length : 0;
  };

  const getTotalSalary = () => {
    return Array.isArray(staffMembers) ? staffMembers.reduce((total, member) => total + (member.salary || 0), 0) : 0;
  };

  const getAverageSalary = () => {
    return Array.isArray(staffMembers) && staffMembers.length > 0 ? getTotalSalary() / staffMembers.length : 0;
  };

  return (
    <div className={`staff-page ${theme}`}>
      <div className="staff-header">
        <div className="header-content">
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Manage your gym's staff members and their information</p>
        </div>
        <button 
          className="add-member-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Add Staff Member
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading staff members...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={loadStaffMembers}>Retry</button>
            {error.includes('Authentication') && (
              <button 
                onClick={() => {
                  localStorage.removeItem('ownerToken');
                  localStorage.removeItem('ownerData');
                  localStorage.removeItem('gymNamesData');
                  window.location.reload();
                }}
                style={{ backgroundColor: '#ef4444', color: 'white' }}
              >
                Log In Again
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{Array.isArray(staffMembers) ? staffMembers.length : 0}</h3>
            <p>Total Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3>{getActiveStaffCount()}</h3>
            <p>Active Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>${getTotalSalary().toLocaleString()}</h3>
            <p>Total Salary</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>${getAverageSalary().toLocaleString()}</h3>
            <p>Average Salary</p>
          </div>
        </div>
      </div>

      <div className="staff-controls">
        <div className="search-section">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="staff-content">
        <div className="staff-grid">
          {filteredMembers.map((member) => (
            <div key={member.id} className="staff-card">
              <div className="card-header">
                <div className="member-avatar">
                  {member.profileImageUrl ? (
                    <img 
                      src={member.profileImageUrl} 
                      alt={member.name}
                      className="profile-image"
                    />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-position">{member.position}</p>
                </div>
                <div className="member-status">
                  <span 
                    className="status-badge"
                    style={{ color: getStatusColor(member.status) }}
                  >
                    {getStatusText(member.status)}
                  </span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{member.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{member.contactNumber || 'N/A'}</span>
                  </div>
                  <div className="contact-item">
                    <Calendar size={16} />
                    <span>Hired: {member.hireDate}</span>
                  </div>
                </div>
                
                <div className="member-details">
                  <div className="detail-item">
                    <strong>Department:</strong> {member.department}
                  </div>
                  <div className="detail-item">
                    <strong>Salary:</strong> ${(member.salary || 0).toLocaleString()}
                  </div>
                  <div className="detail-item">
                    <strong>Address:</strong> {member.address || 'N/A'}
                  </div>
                  {member.notes && (
                    <div className="detail-item">
                      <strong>Notes:</strong> {member.notes}
                    </div>
                  )}
                </div>
                
                <div className="permissions">
                  <strong>Permissions:</strong>
                  <div className="permission-tags">
                    {member.permissions && Array.isArray(member.permissions) ? member.permissions.map((permission, index) => (
                      <span key={index} className="permission-tag">
                        {permission}
                      </span>
                    )) : (
                      <span className="permission-tag">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => openEditModal(member)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Staff Member</h2>
              <button 
                className="close-btn"
                onClick={closeModals}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Profile Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                    <label htmlFor="profile-image-upload" className="image-upload-label">
                      {profileImagePreview ? (
                        <img 
                          src={profileImagePreview} 
                          alt="Profile preview" 
                          className="image-preview"
                        />
                      ) : (
                        <div className="image-upload-placeholder">
                          <User size={24} />
                          <span>Upload Profile Image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newMember.contactNumber}
                    onChange={(e) => setNewMember({...newMember, contactNumber: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <select
                    value={newMember.position}
                    onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                  >
                    <option value="">Select position</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                  >
                    <option value="">Select department</option>
                    {departments.filter(dept => dept !== 'All').map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    value={newMember.hireDate}
                    onChange={(e) => setNewMember({...newMember, hireDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    value={newMember.salary}
                    onChange={(e) => setNewMember({...newMember, salary: parseFloat(e.target.value) || 0})}
                    placeholder="Enter annual salary"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({...newMember, status: e.target.value as any})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={newMember.address}
                    onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    value={newMember.emergencyContactName}
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      emergencyContactName: e.target.value
                    })}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={newMember.emergencyContactPhone}
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      emergencyContactPhone: e.target.value
                    })}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={newMember.emergencyContactRelationship}
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      emergencyContactRelationship: e.target.value
                    })}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={newMember.notes}
                    onChange={(e) => setNewMember({...newMember, notes: e.target.value})}
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={closeModals}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleAddMember}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Staff Member</h2>
              <button 
                className="close-btn"
                onClick={closeModals}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Profile Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="edit-profile-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                    <label htmlFor="edit-profile-image-upload" className="image-upload-label">
                      {profileImagePreview ? (
                        <img 
                          src={profileImagePreview} 
                          alt="Profile preview" 
                          className="image-preview"
                        />
                      ) : (
                        <div className="image-upload-placeholder">
                          <User size={24} />
                          <span>Upload Profile Image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editingMember.contactNumber}
                    onChange={(e) => setEditingMember({...editingMember, contactNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <select
                    value={editingMember.position}
                    onChange={(e) => setEditingMember({...editingMember, position: e.target.value})}
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={editingMember.department}
                    onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                  >
                    {departments.filter(dept => dept !== 'All').map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    value={editingMember.hireDate}
                    onChange={(e) => setEditingMember({...editingMember, hireDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    value={editingMember.salary}
                    onChange={(e) => setEditingMember({...editingMember, salary: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({...editingMember, status: e.target.value as any})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editingMember.address}
                    onChange={(e) => setEditingMember({...editingMember, address: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    value={editingMember.emergencyContactName}
                    onChange={(e) => setEditingMember({
                      ...editingMember, 
                      emergencyContactName: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editingMember.emergencyContactPhone}
                    onChange={(e) => setEditingMember({
                      ...editingMember, 
                      emergencyContactPhone: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={editingMember.emergencyContactRelationship}
                    onChange={(e) => setEditingMember({
                      ...editingMember, 
                      emergencyContactRelationship: e.target.value
                    })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={editingMember.notes}
                    onChange={(e) => setEditingMember({...editingMember, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={closeModals}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={() => handleEditMember(editingMember)}
              >
                Update Member
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default StaffPage;
