import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './MemberModal.css';

interface Member {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  membershipPlan: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED';
  lastVisit: string | null;
  totalVisits: number;
  profilePic?: string;
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
    contactNumber: member?.contactNumber || '',
    membershipPlan: member?.membershipPlan || '',
    status: member?.status || 'ACTIVE',
    profileImageUrl: member?.profilePic || '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        contactNumber: member.contactNumber,
        membershipPlan: member.membershipPlan,
        status: member.status,
        profileImageUrl: member.profilePic || '',
      });
      // Set image preview if member has existing profile image
      if (member.profilePic) {
        setImagePreview(member.profilePic);
      }
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
    
    // Handle image upload if a new image is selected
    let profileImageUrl = formData.profileImageUrl;
    if (profileImage) {
      // For now, we'll convert the image to a data URL
      // In a real application, you'd upload to a cloud service or server
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        profileImageUrl = dataUrl;
        
        const memberData: Member = {
          id: member?.id || 0,
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          membershipPlan: formData.membershipPlan,
          status: formData.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED',
          joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
          lastVisit: member?.lastVisit || null,
          totalVisits: member?.totalVisits || 0,
          endDate: member?.endDate,
          profilePic: profileImageUrl,
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
      reader.readAsDataURL(profileImage);
    } else {
      // No new image, use existing or empty
      const memberData: Member = {
        id: member?.id || 0,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        membershipPlan: formData.membershipPlan,
        status: formData.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED',
        joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
        lastVisit: member?.lastVisit || null,
        totalVisits: member?.totalVisits || 0,
        endDate: member?.endDate,
        profilePic: profileImageUrl,
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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="profileImage">Profile Picture</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Profile preview" />
                    <div className="image-actions">
                      <button
                        type="button"
                        onClick={() => document.getElementById('profileImage')?.click()}
                        className="change-image-btn"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="remove-image-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="upload-placeholder"
                    onClick={() => document.getElementById('profileImage')?.click()}
                  >
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">Click to upload profile picture</div>
                    <div className="upload-hint">Max 5MB, JPG/PNG/GIF</div>
                  </div>
                )}
              </div>
            </div>
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

