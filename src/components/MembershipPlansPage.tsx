import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit, Trash2, Check, Star, Users, Clock, Zap, Calendar, DollarSign } from 'lucide-react';
import GymInfoNavbar from './GymInfoNavbar';
import api from '../services/api';
import './MembershipPlansPage.css';

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
  description?: string;
  maxMembers?: number;
  accessHours?: string;
}

interface Facility {
  id: number;
  facilityName: string;
  facilityType: string;
  description: string;
  isAvailable: boolean;
}

const MembershipPlansPage: React.FC = () => {
  const { theme } = useTheme();
  
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [availableFacilities, setAvailableFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [newPlan, setNewPlan] = useState<Omit<MembershipPlan, 'id'>>({
    planName: '',
    planCurrentPrice: 0,
    planNormalPrice: 0,
    planMaxPrice: 0,
    durationMonths: 1,
    facilities: '',
    isTrainerIncluded: false,
    isDietPlanIncluded: false,
    isLowestActive: false,
    dateFrom: new Date().toISOString().split('T')[0],
    dateUpto: '',
    description: '',
    maxMembers: 1,
    accessHours: '5:00 AM - 10:00 PM'
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansData, facilitiesData] = await Promise.all([
        api.getMembershipPlans(),
        api.getFacilities()
      ]);
      setPlans(plansData);
      setFacilities(facilitiesData);
      setAvailableFacilities(facilitiesData.filter(f => f.isAvailable));
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async () => {
    try {
      const planData = {
        planName: newPlan.planName,
        planMaxPrice: newPlan.planMaxPrice,
        planNormalPrice: newPlan.planNormalPrice,
        planCurrentPrice: newPlan.planCurrentPrice,
        durationMonths: newPlan.durationMonths,
        dateFrom: newPlan.dateFrom,
        dateUpto: newPlan.dateUpto || null,
        facilities: newPlan.facilities,
        isTrainerIncluded: newPlan.isTrainerIncluded,
        isDietPlanIncluded: newPlan.isDietPlanIncluded,
        isLowestActive: newPlan.isLowestActive
      };
      
      await api.createMembershipPlan(planData);
      await fetchData(); // Refresh the list
      setNewPlan({
        planName: '',
        planCurrentPrice: 0,
        planNormalPrice: 0,
        planMaxPrice: 0,
        durationMonths: 1,
        facilities: '',
        isTrainerIncluded: false,
        isDietPlanIncluded: false,
        isLowestActive: false,
        dateFrom: new Date().toISOString().split('T')[0],
        dateUpto: '',
        description: '',
        maxMembers: 1,
        accessHours: '5:00 AM - 10:00 PM'
      });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating plan:', err);
      setError('Failed to create plan');
    }
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = async () => {
    if (editingPlan) {
      try {
        const planData = {
          planName: editingPlan.planName,
          planMaxPrice: editingPlan.planMaxPrice,
          planNormalPrice: editingPlan.planNormalPrice,
          planCurrentPrice: editingPlan.planCurrentPrice,
          durationMonths: editingPlan.durationMonths,
          dateFrom: editingPlan.dateFrom,
          dateUpto: editingPlan.dateUpto || null,
          facilities: editingPlan.facilities,
          isTrainerIncluded: editingPlan.isTrainerIncluded,
          isDietPlanIncluded: editingPlan.isDietPlanIncluded,
          isLowestActive: editingPlan.isLowestActive
        };
        
        await api.updateMembershipPlan(editingPlan.id, planData);
        await fetchData(); // Refresh the list
        setEditingPlan(null);
      } catch (err) {
        console.error('Error updating plan:', err);
        setError('Failed to update plan');
      }
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      try {
        await api.deleteMembershipPlan(id);
        await fetchData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting plan:', err);
        setError('Failed to delete plan');
      }
    }
  };

  const getDurationText = (months: number) => {
    if (months === 1) return 'Monthly';
    if (months === 12) return 'Yearly';
    if (months < 12) return `${months} Months`;
    return `${Math.floor(months / 12)} Year${Math.floor(months / 12) > 1 ? 's' : ''}`;
  };

  const getDurationIcon = (months: number) => {
    if (months === 1) return <Clock size={16} />;
    if (months === 12) return <Star size={16} />;
    if (months > 12) return <Zap size={16} />;
    return <Calendar size={16} />;
  };

  const isOfferActive = (plan: MembershipPlan) => {
    if (!plan.dateUpto) return false;
    const offerEndDate = new Date(plan.dateUpto);
    const today = new Date();
    return offerEndDate > today;
  };

  const getFacilityList = (facilitiesString: string) => {
    if (!facilitiesString) return [];
    return facilitiesString.split(',').map(f => f.trim()).filter(f => f.length > 0);
  };

  if (loading) {
    return (
      <div className={`membership-plans-page ${theme}`}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading membership plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`membership-plans-page ${theme}`}>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`membership-plans-page ${theme}`}>
      <GymInfoNavbar />
      <div className="plans-header">
        <div className="header-content">
          <h1 className="page-title">Membership Plans</h1>
          <p className="page-subtitle">Manage your gym's membership plans and pricing</p>
        </div>
        <button 
          className="add-plan-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Add New Plan
        </button>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => {
          const offerActive = isOfferActive(plan);
          const facilityList = getFacilityList(plan.facilities);
          
          return (
            <div key={plan.id} className={`plan-card ${plan.isLowestActive ? 'popular' : ''}`}>
              {plan.isLowestActive && (
                <div className="popular-badge">
                  <Star size={16} />
                  Most Popular
                </div>
              )}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.planName}</h3>
                <div className="plan-price">
                  {offerActive ? (
                    <div className="offer-price">
                      <span className="current-price">${plan.planCurrentPrice}</span>
                      <span className="original-price">${plan.planMaxPrice}</span>
                      <span className="price-duration">/{getDurationText(plan.durationMonths)}</span>
                    </div>
                  ) : (
                    <div className="normal-price">
                      <span className="price-amount">${plan.planCurrentPrice}</span>
                      <span className="price-duration">/{getDurationText(plan.durationMonths)}</span>
                    </div>
                  )}
                </div>
              </div>

              {plan.description && (
                <div className="plan-description">
                  <p>{plan.description}</p>
                </div>
              )}

              <div className="plan-details">
                <div className="detail-item">
                  <Users size={16} />
                  <span>Max {plan.maxMembers || 1} member{(plan.maxMembers || 1) !== 1 ? 's' : ''}</span>
                </div>
                <div className="detail-item">
                  {getDurationIcon(plan.durationMonths)}
                  <span>{getDurationText(plan.durationMonths)}</span>
                </div>
                {plan.accessHours && (
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{plan.accessHours}</span>
                  </div>
                )}
                {offerActive && plan.dateUpto && (
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Offer until {new Date(plan.dateUpto).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="plan-features">
                <h4>Features</h4>
                <ul>
                  {facilityList.map((facility, index) => (
                    <li key={index}>
                      <Check size={16} />
                      <span>{facility}</span>
                    </li>
                  ))}
                  {plan.isTrainerIncluded && (
                    <li>
                      <Check size={16} />
                      <span>Personal Training Included</span>
                    </li>
                  )}
                  {plan.isDietPlanIncluded && (
                    <li>
                      <Check size={16} />
                      <span>Diet Plan Included</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="plan-actions">
                <button 
                  className="edit-plan-btn"
                  onClick={() => handleEditPlan(plan)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  className="delete-plan-btn"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Membership Plan</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  value={newPlan.planName}
                  onChange={(e) => setNewPlan({...newPlan, planName: e.target.value})}
                  placeholder="e.g., Basic, Premium, VIP"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Maximum Price (Crossed out)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPlan.planMaxPrice}
                    onChange={(e) => setNewPlan({...newPlan, planMaxPrice: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 99.99"
                  />
                </div>
                <div className="form-group">
                  <label>Standard Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPlan.planNormalPrice}
                    onChange={(e) => setNewPlan({...newPlan, planNormalPrice: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 79.99"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Price (Offer Price)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPlan.planCurrentPrice}
                    onChange={(e) => setNewPlan({...newPlan, planCurrentPrice: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 59.99"
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Months)</label>
                  <input
                    type="number"
                    value={newPlan.durationMonths}
                    onChange={(e) => setNewPlan({...newPlan, durationMonths: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newPlan.dateFrom}
                    onChange={(e) => setNewPlan({...newPlan, dateFrom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Offer End Date (Optional)</label>
                  <input
                    type="date"
                    value={newPlan.dateUpto || ''}
                    onChange={(e) => setNewPlan({...newPlan, dateUpto: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Select Facilities</label>
                <div className="facilities-selection">
                  {availableFacilities.map(facility => (
                    <label key={facility.id} className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={getFacilityList(newPlan.facilities).includes(facility.facilityName)}
                        onChange={(e) => {
                          const currentFacilities = getFacilityList(newPlan.facilities);
                          let newFacilities;
                          if (e.target.checked) {
                            newFacilities = [...currentFacilities, facility.facilityName];
                          } else {
                            newFacilities = currentFacilities.filter(f => f !== facility.facilityName);
                          }
                          setNewPlan({...newPlan, facilities: newFacilities.join(', ')});
                        }}
                      />
                      <span className="facility-name">{facility.facilityName}</span>
                      <span className="facility-type">({facility.facilityType})</span>
                    </label>
                  ))}
                  {availableFacilities.length === 0 && (
                    <p className="no-facilities">No facilities available. <a href="/facilities">Add facilities first</a></p>
                  )}
                </div>
                <div className="facilities-textarea">
                  <label>Or enter custom facilities (comma-separated):</label>
                  <textarea
                    value={newPlan.facilities}
                    onChange={(e) => setNewPlan({...newPlan, facilities: e.target.value})}
                    rows={2}
                    placeholder="e.g., Gym Access, Locker Room, Free WiFi, Sauna"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPlan.description || ''}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  rows={3}
                  placeholder="Describe this membership plan..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Members</label>
                  <input
                    type="number"
                    value={newPlan.maxMembers || 1}
                    onChange={(e) => setNewPlan({...newPlan, maxMembers: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Access Hours</label>
                  <input
                    type="text"
                    value={newPlan.accessHours || ''}
                    onChange={(e) => setNewPlan({...newPlan, accessHours: e.target.value})}
                    placeholder="e.g., 5:00 AM - 10:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newPlan.isTrainerIncluded}
                    onChange={(e) => setNewPlan({...newPlan, isTrainerIncluded: e.target.checked})}
                  />
                  Include Personal Training
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newPlan.isDietPlanIncluded}
                    onChange={(e) => setNewPlan({...newPlan, isDietPlanIncluded: e.target.checked})}
                  />
                  Include Diet Plan
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newPlan.isLowestActive}
                    onChange={(e) => setNewPlan({...newPlan, isLowestActive: e.target.checked})}
                  />
                  Mark as Popular Plan
                </label>
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
                onClick={handleAddPlan}
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Membership Plan</h2>
              <button 
                className="close-btn"
                onClick={() => setEditingPlan(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.planName}
                  onChange={(e) => setEditingPlan({...editingPlan, planName: e.target.value})}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Maximum Price (Crossed out)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.planMaxPrice}
                    onChange={(e) => setEditingPlan({...editingPlan, planMaxPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Standard Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.planNormalPrice}
                    onChange={(e) => setEditingPlan({...editingPlan, planNormalPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Price (Offer Price)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.planCurrentPrice}
                    onChange={(e) => setEditingPlan({...editingPlan, planCurrentPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Months)</label>
                  <input
                    type="number"
                    value={editingPlan.durationMonths}
                    onChange={(e) => setEditingPlan({...editingPlan, durationMonths: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editingPlan.dateFrom}
                    onChange={(e) => setEditingPlan({...editingPlan, dateFrom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Offer End Date (Optional)</label>
                  <input
                    type="date"
                    value={editingPlan.dateUpto || ''}
                    onChange={(e) => setEditingPlan({...editingPlan, dateUpto: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Select Facilities</label>
                <div className="facilities-selection">
                  {availableFacilities.map(facility => (
                    <label key={facility.id} className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={getFacilityList(editingPlan.facilities).includes(facility.facilityName)}
                        onChange={(e) => {
                          const currentFacilities = getFacilityList(editingPlan.facilities);
                          let newFacilities;
                          if (e.target.checked) {
                            newFacilities = [...currentFacilities, facility.facilityName];
                          } else {
                            newFacilities = currentFacilities.filter(f => f !== facility.facilityName);
                          }
                          setEditingPlan({...editingPlan, facilities: newFacilities.join(', ')});
                        }}
                      />
                      <span className="facility-name">{facility.facilityName}</span>
                      <span className="facility-type">({facility.facilityType})</span>
                    </label>
                  ))}
                  {availableFacilities.length === 0 && (
                    <p className="no-facilities">No facilities available. <a href="/facilities">Add facilities first</a></p>
                  )}
                </div>
                <div className="facilities-textarea">
                  <label>Or enter custom facilities (comma-separated):</label>
                  <textarea
                    value={editingPlan.facilities}
                    onChange={(e) => setEditingPlan({...editingPlan, facilities: e.target.value})}
                    rows={2}
                    placeholder="e.g., Gym Access, Locker Room, Free WiFi, Sauna"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingPlan.description || ''}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Members</label>
                  <input
                    type="number"
                    value={editingPlan.maxMembers || 1}
                    onChange={(e) => setEditingPlan({...editingPlan, maxMembers: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Access Hours</label>
                  <input
                    type="text"
                    value={editingPlan.accessHours || ''}
                    onChange={(e) => setEditingPlan({...editingPlan, accessHours: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPlan.isTrainerIncluded}
                    onChange={(e) => setEditingPlan({...editingPlan, isTrainerIncluded: e.target.checked})}
                  />
                  Include Personal Training
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPlan.isDietPlanIncluded}
                    onChange={(e) => setEditingPlan({...editingPlan, isDietPlanIncluded: e.target.checked})}
                  />
                  Include Diet Plan
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPlan.isLowestActive}
                    onChange={(e) => setEditingPlan({...editingPlan, isLowestActive: e.target.checked})}
                  />
                  Mark as Popular Plan
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setEditingPlan(null)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleUpdatePlan}
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPlansPage;
