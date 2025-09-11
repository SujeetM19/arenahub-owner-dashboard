import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit, Trash2, Check, Star, Users, Clock, Zap } from 'lucide-react';
import './MembershipPlansPage.css';

interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular: boolean;
  description: string;
  maxMembers?: number;
  accessHours: string;
}

const MembershipPlansPage: React.FC = () => {
  const { theme } = useTheme();
  
  console.log('MembershipPlansPage rendered');
  const [plans, setPlans] = useState<MembershipPlan[]>([
    {
      id: 1,
      name: 'Basic',
      price: 29.99,
      duration: 'monthly',
      features: ['Gym Access', 'Locker Room', 'Basic Equipment', 'Free WiFi'],
      isPopular: false,
      description: 'Perfect for beginners who want to start their fitness journey.',
      maxMembers: 1,
      accessHours: '5:00 AM - 10:00 PM'
    },
    {
      id: 2,
      name: 'Premium',
      price: 49.99,
      duration: 'monthly',
      features: ['All Basic Features', 'Personal Training (2 sessions)', 'Group Classes', 'Nutrition Consultation', 'Sauna Access'],
      isPopular: true,
      description: 'Our most popular plan with premium features and personal attention.',
      maxMembers: 2,
      accessHours: '24/7 Access'
    },
    {
      id: 3,
      name: 'VIP',
      price: 79.99,
      duration: 'monthly',
      features: ['All Premium Features', 'Unlimited Personal Training', 'Priority Booking', 'Guest Passes (2/month)', 'Towel Service', 'Spa Access'],
      isPopular: false,
      description: 'The ultimate fitness experience with exclusive benefits and luxury amenities.',
      maxMembers: 4,
      accessHours: '24/7 Access'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [newPlan, setNewPlan] = useState<Omit<MembershipPlan, 'id'>>({
    name: '',
    price: 0,
    duration: 'monthly',
    features: [],
    isPopular: false,
    description: '',
    maxMembers: 1,
    accessHours: '5:00 AM - 10:00 PM'
  });

  const handleAddPlan = () => {
    const plan: MembershipPlan = {
      ...newPlan,
      id: Math.max(...plans.map(p => p.id)) + 1
    };
    setPlans([...plans, plan]);
    setNewPlan({
      name: '',
      price: 0,
      duration: 'monthly',
      features: [],
      isPopular: false,
      description: '',
      maxMembers: 1,
      accessHours: '5:00 AM - 10:00 PM'
    });
    setShowAddModal(false);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
      setEditingPlan(null);
    }
  };

  const handleDeletePlan = (id: number) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const addFeature = (planId: number, feature: string) => {
    if (feature.trim()) {
      setPlans(plans.map(plan => 
        plan.id === planId 
          ? { ...plan, features: [...plan.features, feature.trim()] }
          : plan
      ));
    }
  };

  const removeFeature = (planId: number, featureIndex: number) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, features: plan.features.filter((_, index) => index !== featureIndex) }
        : plan
    ));
  };

  const getDurationIcon = (duration: string) => {
    switch (duration) {
      case 'monthly': return <Clock size={16} />;
      case 'yearly': return <Star size={16} />;
      case 'lifetime': return <Zap size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className={`membership-plans-page ${theme}`}>
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
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && (
              <div className="popular-badge">
                <Star size={16} />
                Most Popular
              </div>
            )}
            
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-amount">${plan.price}</span>
                <span className="price-duration">/{plan.duration}</span>
              </div>
            </div>

            <div className="plan-description">
              <p>{plan.description}</p>
            </div>

            <div className="plan-details">
              <div className="detail-item">
                <Users size={16} />
                <span>Max {plan.maxMembers} member{plan.maxMembers !== 1 ? 's' : ''}</span>
              </div>
              <div className="detail-item">
                <Clock size={16} />
                <span>{plan.accessHours}</span>
              </div>
            </div>

            <div className="plan-features">
              <h4>Features</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
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
        ))}
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
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="e.g., Basic, Premium, VIP"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPlan.description}
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
                    value={newPlan.maxMembers}
                    onChange={(e) => setNewPlan({...newPlan, maxMembers: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Access Hours</label>
                  <input
                    type="text"
                    value={newPlan.accessHours}
                    onChange={(e) => setNewPlan({...newPlan, accessHours: e.target.value})}
                    placeholder="e.g., 5:00 AM - 10:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newPlan.isPopular}
                    onChange={(e) => setNewPlan({...newPlan, isPopular: e.target.checked})}
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
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    value={editingPlan.duration}
                    onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Members</label>
                  <input
                    type="number"
                    value={editingPlan.maxMembers}
                    onChange={(e) => setEditingPlan({...editingPlan, maxMembers: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Access Hours</label>
                  <input
                    type="text"
                    value={editingPlan.accessHours}
                    onChange={(e) => setEditingPlan({...editingPlan, accessHours: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular}
                    onChange={(e) => setEditingPlan({...editingPlan, isPopular: e.target.checked})}
                  />
                  Mark as Popular Plan
                </label>
              </div>

              <div className="form-group">
                <label>Features</label>
                <div className="features-list">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span>{feature}</span>
                      <button 
                        className="remove-feature-btn"
                        onClick={() => removeFeature(editingPlan.id, index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="add-feature">
                    <input
                      type="text"
                      placeholder="Add new feature"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addFeature(editingPlan.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
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
