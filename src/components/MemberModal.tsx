import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './MemberModal.css';

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
    membershipType: member?.membershipType || 'BASIC',
    status: member?.status || 'ACTIVE',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        status: member.status,
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const memberData: Member = {
      id: member?.id || 0,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      membershipType: formData.membershipType,
      status: formData.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
      lastVisit: member?.lastVisit || null,
      totalVisits: member?.totalVisits || 0,
    };
    onSave(memberData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={`modal-overlay ${theme}`} onClick={onClose}>
      <div className={`modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="membershipType">Membership Type</label>
            <select
              id="membershipType"
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
            >
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              {member ? 'Update' : 'Create'} Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
