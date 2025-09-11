import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Filter, Edit, Trash2, User, Mail, Phone, Calendar, Shield, Clock, DollarSign } from 'lucide-react';
import './StaffPage.css';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  permissions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: string;
  notes?: string;
}

const StaffPage: React.FC = () => {
  const { theme } = useTheme();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@gym.com',
      phone: '+1 (555) 123-4567',
      position: 'Manager',
      department: 'Operations',
      hireDate: '2023-01-15',
      salary: 55000,
      status: 'Active',
      permissions: ['Full Access', 'Member Management', 'Financial Reports'],
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 123-4568',
        relationship: 'Spouse'
      },
      address: '123 Main St, City, State 12345',
      notes: 'Experienced fitness professional with 5+ years in management'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gym.com',
      phone: '+1 (555) 234-5678',
      position: 'Personal Trainer',
      department: 'Training',
      hireDate: '2023-03-20',
      salary: 45000,
      status: 'Active',
      permissions: ['Member Management', 'Training Schedules'],
      emergencyContact: {
        name: 'Mike Johnson',
        phone: '+1 (555) 234-5679',
        relationship: 'Brother'
      },
      address: '456 Oak Ave, City, State 12345',
      notes: 'Certified personal trainer specializing in strength training'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@gym.com',
      phone: '+1 (555) 345-6789',
      position: 'Receptionist',
      department: 'Front Desk',
      hireDate: '2023-06-10',
      salary: 35000,
      status: 'On Leave',
      permissions: ['Member Check-in', 'Basic Reports'],
      emergencyContact: {
        name: 'Lisa Davis',
        phone: '+1 (555) 345-6790',
        relationship: 'Mother'
      },
      address: '789 Pine St, City, State 12345',
      notes: 'Currently on maternity leave until March 2024'
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.wilson@gym.com',
      phone: '+1 (555) 456-7890',
      position: 'Group Fitness Instructor',
      department: 'Training',
      hireDate: '2023-08-05',
      salary: 40000,
      status: 'Active',
      permissions: ['Class Scheduling', 'Member Management'],
      emergencyContact: {
        name: 'Tom Wilson',
        phone: '+1 (555) 456-7891',
        relationship: 'Father'
      },
      address: '321 Elm St, City, State 12345',
      notes: 'Specializes in yoga and pilates classes'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [newMember, setNewMember] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'Active',
    permissions: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    address: '',
    notes: ''
  });

  const departments = ['All', 'Operations', 'Training', 'Front Desk', 'Maintenance', 'Management'];
  const statuses = ['All', 'Active', 'Inactive', 'On Leave'];
  const positions = ['Manager', 'Personal Trainer', 'Group Fitness Instructor', 'Receptionist', 'Maintenance', 'Cleaner', 'Security'];

  const filteredMembers = staffMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#22c55e';
      case 'Inactive': return '#6b7280';
      case 'On Leave': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleAddMember = () => {
    const member: StaffMember = {
      ...newMember,
      id: Date.now().toString()
    };
    setStaffMembers([...staffMembers, member]);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0,
      status: 'Active',
      permissions: [],
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      address: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleEditMember = (member: StaffMember) => {
    setEditingMember(member);
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      setStaffMembers(staffMembers.map(member => 
        member.id === editingMember.id ? editingMember : member
      ));
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(staffMembers.filter(member => member.id !== id));
    }
  };

  const getActiveStaffCount = () => {
    return staffMembers.filter(member => member.status === 'Active').length;
  };

  const getTotalSalary = () => {
    return staffMembers.reduce((total, member) => total + member.salary, 0);
  };

  const getAverageSalary = () => {
    return staffMembers.length > 0 ? getTotalSalary() / staffMembers.length : 0;
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

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{staffMembers.length}</h3>
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
                  <User size={24} />
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
                    {member.status}
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
                    <span>{member.phone}</span>
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
                    <strong>Salary:</strong> ${member.salary.toLocaleString()}
                  </div>
                  <div className="detail-item">
                    <strong>Address:</strong> {member.address}
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
                    {member.permissions.map((permission, index) => (
                      <span key={index} className="permission-tag">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEditMember(member)}
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
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
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
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
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
                    value={newMember.emergencyContact.name}
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      emergencyContact: {...newMember.emergencyContact, name: e.target.value}
                    })}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={newMember.emergencyContact.phone}
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      emergencyContact: {...newMember.emergencyContact, phone: e.target.value}
                    })}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={newMember.emergencyContact.relationship}
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      emergencyContact: {...newMember.emergencyContact, relationship: e.target.value}
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
                onClick={() => setShowAddModal(false)}
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
                onClick={() => setEditingMember(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
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
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
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
                    value={editingMember.emergencyContact.name}
                    onChange={(e) => setEditingMember({
                      ...editingMember, 
                      emergencyContact: {...editingMember.emergencyContact, name: e.target.value}
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editingMember.emergencyContact.phone}
                    onChange={(e) => setEditingMember({
                      ...editingMember, 
                      emergencyContact: {...editingMember.emergencyContact, phone: e.target.value}
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={editingMember.emergencyContact.relationship}
                    onChange={(e) => setEditingMember({
                      ...editingMember, 
                      emergencyContact: {...editingMember.emergencyContact, relationship: e.target.value}
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
                onClick={() => setEditingMember(null)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleUpdateMember}
              >
                Update Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
