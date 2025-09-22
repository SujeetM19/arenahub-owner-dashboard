import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import GymInfoNavbar from './GymInfoNavbar';
import api from '../services/api';
import './FacilitiesPage.css';

interface Facility {
  id: number;
  facilityName: string;
  facilityType: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailable, setFilterAvailable] = useState('all');

  const [formData, setFormData] = useState({
    facilityName: '',
    facilityType: '',
    description: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFacilities();
      setFacilities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch facilities');
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = () => {
    setEditingFacility(null);
    setFormData({
      facilityName: '',
      facilityType: '',
      description: '',
      isAvailable: true
    });
    setShowModal(true);
  };

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      facilityName: facility.facilityName,
      facilityType: facility.facilityType,
      description: facility.description || '',
      isAvailable: facility.isAvailable
    });
    setShowModal(true);
  };

  const handleDeleteFacility = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await api.deleteFacility(id);
        await fetchFacilities();
      } catch (err: any) {
        alert('Failed to delete facility: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFacility) {
        await api.updateFacility(editingFacility.id, formData);
      } else {
        await api.createFacility(formData);
      }
      setShowModal(false);
      await fetchFacilities();
    } catch (err: any) {
      alert('Failed to save facility: ' + (err.message || 'Unknown error'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.facilityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || facility.facilityType === filterType;
    const matchesAvailable = filterAvailable === 'all' || 
                           (filterAvailable === 'available' && facility.isAvailable) ||
                           (filterAvailable === 'unavailable' && !facility.isAvailable);
    
    return matchesSearch && matchesType && matchesAvailable;
  });

  const facilityTypes = [...new Set(facilities.map(f => f.facilityType))];

  if (loading) {
    return (
      <div className="facilities-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="facilities-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchFacilities}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="facilities-page">
      <GymInfoNavbar />
      <div className="facilities-header">
        <div className="header-content">
          <h1 className="page-title">Manage Gym Facilities</h1>
          <p className="page-subtitle">Add and manage facilities available at your gym</p>
        </div>
        <button className="add-facility-btn" onClick={handleAddFacility}>
          <Plus size={20} />
          Add New Facility
        </button>
      </div>

      <div className="facilities-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {facilityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      <div className="facilities-grid">
        {filteredFacilities.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-icon" />
            <h3>No facilities found</h3>
            <p>Start by adding your first facility to get started.</p>
            <button className="add-facility-btn" onClick={handleAddFacility}>
              <Plus size={20} />
              Add New Facility
            </button>
          </div>
        ) : (
          filteredFacilities.map(facility => (
            <div key={facility.id} className="facility-card">
              <div className="facility-header">
                <div className="facility-icon">
                  <Package size={24} />
                </div>
                <div className="facility-status">
                  {facility.isAvailable ? (
                    <CheckCircle size={20} className="status-available" />
                  ) : (
                    <XCircle size={20} className="status-unavailable" />
                  )}
                </div>
              </div>
              
              <div className="facility-content">
                <h3 className="facility-name">{facility.facilityName}</h3>
                <p className="facility-type">{facility.facilityType}</p>
                {facility.description && (
                  <p className="facility-description">{facility.description}</p>
                )}
              </div>
              
              <div className="facility-actions">
                <button
                  className="edit-facility-btn"
                  onClick={() => handleEditFacility(facility)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className="delete-facility-btn"
                  onClick={() => handleDeleteFacility(facility.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="form-group">
                <label>Facility Name</label>
                <input
                  type="text"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleInputChange}
                  placeholder="e.g., Swimming Pool, Sauna, Cardio Room"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Facility Type</label>
                <select
                  name="facilityType"
                  value={formData.facilityType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Amenity">Amenity</option>
                  <option value="Service">Service</option>
                  <option value="Space">Space</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this facility..."
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-text">Available for use</span>
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingFacility ? 'Update Facility' : 'Add Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
