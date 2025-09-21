import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './MemberModal.css';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipPlan: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED';
  lastVisit: string | null;
  totalVisits: number;
  profileImageUrl?: string;
  endDate?: string;
}

interface MembershipPlan {
  id: number;
  planName: string;
  planCurrentPrice: number;
  planNormalPrice: number;
  planMaxPrice: number;
  durationMonths: number;
  facilities: string;
  isTrainerIncluded: boolean;
  isDietPlanIncluded: boolean;
  isLowestActive: boolean;
  dateFrom: string;
  dateUpto?: string;
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
    membershipPlan: member?.membershipPlan || '',
    status: member?.status || 'ACTIVE',
  });
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipPlan: member.membershipPlan,
        status: member.status,
      });
    }
  }, [member]);

  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const plans = await api.getMembershipPlans();
      // Ensure plans is an array before setting it
      if (Array.isArray(plans)) {
        setMembershipPlans(plans);
      } else {
        console.error('Invalid membership plans response:', plans);
        setMembershipPlans([]);
      }
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      // Set empty array on error - user will see the help message
      setMembershipPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const memberData: Member = {
      id: member?.id || 0,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      membershipPlan: formData.membershipPlan,
      status: formData.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED',
      joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
      lastVisit: member?.lastVisit || null,
      totalVisits: member?.totalVisits || 0,
      endDate: member?.endDate,
    };
    
    try {
      await onSave(memberData);
    } catch (error: any) {
      if (error.message && error.message.includes('No gym found')) {
        alert('Please create a gym first before adding members. Go to the Gym Settings page to create your gym.');
      } else {
        alert('Error creating member: ' + (error.message || 'Unknown error'));
      }
    }
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
            <label htmlFor="membershipPlan">Membership Plan *</label>
            <select
              id="membershipPlan"
              name="membershipPlan"
              value={formData.membershipPlan}
              onChange={handleChange}
              disabled={isLoadingPlans}
            >
              <option value="">{isLoadingPlans ? 'Loading plans...' : 'Select a membership plan'}</option>
              {Array.isArray(membershipPlans) && membershipPlans.length > 0 ? (
                membershipPlans.map((plan) => (
                  <option key={plan.id} value={plan.planName}>
                    {plan.planName} - ${plan.planCurrentPrice} ({plan.durationMonths} months)
                  </option>
                ))
              ) : (
                !isLoadingPlans && (
                  <>
                    <option value="Basic">Basic Plan</option>
                    <option value="Premium">Premium Plan</option>
                    <option value="VIP">VIP Plan</option>
                  </>
                )
              )}
            </select>
            {!isLoadingPlans && (!Array.isArray(membershipPlans) || membershipPlans.length === 0) && (
              <div className="form-help">
                No membership plans available. Please create membership plans first or contact support if this persists.
              </div>
            )}
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
              <option value="EXPIRED">Expired</option>
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
