import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Phone, Mail, Clock, Users, Star } from 'lucide-react';
import GymInfoNavbar from './GymInfoNavbar';
import api from '../services/api';
import './FundamentalsPage.css';

interface GymInfo {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  capacity: number;
  description: string;
  establishedYear: number;
  totalArea: number;
  createdAt?: string;
  updatedAt?: string;
}

const FundamentalsPage: React.FC = () => {
  const { theme } = useTheme();
  
  console.log('FundamentalsPage rendered');
  const [gymInfo, setGymInfo] = useState<GymInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<GymInfo | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGym, setNewGym] = useState<Partial<GymInfo>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    capacity: 0,
    description: '',
    establishedYear: new Date().getFullYear(),
    totalArea: 0
  });

  // Load gym info from API
  useEffect(() => {
    loadGymInfo();
  }, []);

  const loadGymInfo = async () => {
    try {
      setLoading(true);
      const response = await api.getCenters();
      if (response && response.length > 0) {
        setGymInfo(response[0]); // Use first center for now
      } else {
        setGymInfo(null);
      }
    } catch (err) {
      setError('Failed to load gym information');
      console.error('Error loading gym info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (gymInfo) {
      setIsEditing(true);
      setEditedInfo({ ...gymInfo });
    }
  };

  const handleSave = async () => {
    if (editedInfo) {
      try {
        const response = await api.updateCenter(editedInfo.id, editedInfo);
        setGymInfo(response);
        setIsEditing(false);
        setError(null);
      } catch (err) {
        setError('Failed to update gym information');
        console.error('Error updating gym info:', err);
      }
    }
  };

  const handleCancel = () => {
    setEditedInfo(gymInfo);
    setIsEditing(false);
  };

  const handleCreate = async () => {
    try {
      const response = await api.createCenter(newGym);
      setGymInfo(response);
      setShowCreateForm(false);
      setNewGym({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        capacity: 0,
        description: '',
        establishedYear: new Date().getFullYear(),
        totalArea: 0
      });
      setError(null);
    } catch (err) {
      setError('Failed to create gym');
      console.error('Error creating gym:', err);
    }
  };

  const handleDelete = async () => {
    if (gymInfo && window.confirm('Are you sure you want to delete this gym?')) {
      try {
        await api.deleteCenter(gymInfo.id);
        setGymInfo(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete gym');
        console.error('Error deleting gym:', err);
      }
    }
  };

  const handleInputChange = (field: keyof GymInfo, value: string | number) => {
    if (isEditing && editedInfo) {
      setEditedInfo(prev => ({ ...prev, [field]: value }));
    } else if (showCreateForm) {
      setNewGym(prev => ({ ...prev, [field]: value }));
    }
  };


  return (
    <div className={`fundamentals-page ${theme}`}>
      <GymInfoNavbar />
      <div className="fundamentals-header">
        <h1 className="page-title">Fundamentals</h1>
        <p className="page-subtitle">Manage your gym's basic information and details</p>
        {!gymInfo && !showCreateForm && (
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>
            Create New Gym
          </button>
        )}
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading gym information...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadGymInfo}>Retry</button>
        </div>
      ) : showCreateForm ? (
        <div className="create-form-container">
          <div className="gym-info-card">
            <div className="card-header">
              <h2 className="card-title">Create New Gym</h2>
              <button className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
            <div className="card-content">
              <div className="create-form">
                <div className="form-group">
                  <label>Gym Name *</label>
                  <input
                    type="text"
                    value={newGym.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter gym name"
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    value={newGym.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={newGym.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={newGym.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      value={newGym.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="text"
                      value={newGym.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={newGym.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={newGym.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="Enter website URL"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity *</label>
                    <input
                      type="number"
                      value={newGym.capacity || 0}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                      placeholder="Enter capacity"
                    />
                  </div>
                  <div className="form-group">
                    <label>Established Year *</label>
                    <input
                      type="number"
                      value={newGym.establishedYear || new Date().getFullYear()}
                      onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value) || new Date().getFullYear())}
                      placeholder="Enter year"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Area (sq ft) *</label>
                    <input
                      type="number"
                      value={newGym.totalArea || 0}
                      onChange={(e) => handleInputChange('totalArea', parseInt(e.target.value) || 0)}
                      placeholder="Enter area"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={newGym.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter gym description"
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button className="create-btn" onClick={handleCreate}>
                    Create Gym
                  </button>
                  <button className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : gymInfo ? (
        <div className="gym-info-content">
        <div className="gym-info-card">
          <div className="card-header">
            <h2 className="card-title">Basic Information</h2>
            {!isEditing && (
              <div className="card-actions">
                <button className="edit-btn" onClick={handleEdit}>
                  Edit Information
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete Gym
                </button>
              </div>
            )}
          </div>

          <div className="card-content">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Gym Name *</label>
                  <input
                    type="text"
                    value={editedInfo?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    value={editedInfo?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={editedInfo?.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={editedInfo?.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      value={editedInfo?.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="text"
                      value={editedInfo?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={editedInfo?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={editedInfo?.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity *</label>
                    <input
                      type="number"
                      value={editedInfo?.capacity || 0}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Established Year *</label>
                    <input
                      type="number"
                      value={editedInfo?.establishedYear || new Date().getFullYear()}
                      onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value) || new Date().getFullYear())}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Area (sq ft) *</label>
                    <input
                      type="number"
                      value={editedInfo?.totalArea || 0}
                      onChange={(e) => handleInputChange('totalArea', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editedInfo?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-section">
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <div className="info-content">
                      <h3>Address</h3>
                      <p>{gymInfo.address}, {gymInfo.city}, {gymInfo.state} {gymInfo.zipCode}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div className="info-content">
                      <h3>Phone</h3>
                      <p>{gymInfo.phone}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Mail className="info-icon" />
                    <div className="info-content">
                      <h3>Email</h3>
                      <p>{gymInfo.email}</p>
                    </div>
                  </div>

                  {gymInfo.website && (
                    <div className="info-item">
                      <Star className="info-icon" />
                      <div className="info-content">
                        <h3>Website</h3>
                        <p><a href={gymInfo.website} target="_blank" rel="noopener noreferrer">{gymInfo.website}</a></p>
                      </div>
                    </div>
                  )}

                  <div className="info-item">
                    <Users className="info-icon" />
                    <div className="info-content">
                      <h3>Capacity</h3>
                      <p>{gymInfo.capacity} members</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Clock className="info-icon" />
                    <div className="info-content">
                      <h3>Established</h3>
                      <p>{gymInfo.establishedYear}</p>
                    </div>
                  </div>

                    <div className="info-item">
                      <MapPin className="info-icon" />
                      <div className="info-content">
                        <h3>Total Area</h3>
                        <p>{gymInfo.totalArea} sq ft</p>
                      </div>
                    </div>
                </div>

                <div className="description-section">
                  <h3>Description</h3>
                  <p>{gymInfo.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <h3>No Gym Found</h3>
              <p>You haven't created a gym yet. Create your first gym to get started!</p>
              <button className="create-btn" onClick={() => setShowCreateForm(true)}>
                Create Your First Gym
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default FundamentalsPage;
