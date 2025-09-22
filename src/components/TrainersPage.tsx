import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Filter, Edit, Trash2, User, Star, Calendar, Clock, Award, Users, DollarSign } from 'lucide-react';
import api from '../services/api';
import './TrainersPage.css';

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  certifications: string[];
  experienceYears: number; // years
  rating: number;
  hourlyRate: number;
  availability: string; // JSON string for weekly availability
  bio: string;
  profileImageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  joinDate: string;
  totalClients: number;
  totalSessions: number;
  notes?: string;
  centerId?: number;
  centerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TrainersPage: React.FC = () => {
  const { theme } = useTheme();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [newTrainer, setNewTrainer] = useState<Omit<Trainer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    specialties: [],
    certifications: [],
    experienceYears: 0,
    rating: 0,
    hourlyRate: 0,
    availability: '{}',
    bio: '',
    status: 'ACTIVE',
    joinDate: new Date().toISOString().split('T')[0],
    totalClients: 0,
    totalSessions: 0,
    notes: ''
  });

  const specialties = ['All', 'Strength Training', 'Weight Loss', 'Bodybuilding', 'Yoga', 'Pilates', 'HIIT', 'Cardio', 'Functional Training', 'Rehabilitation', 'Senior Fitness'];
  const statuses = ['All', 'ACTIVE', 'INACTIVE', 'ON_LEAVE'];

  // Helper functions for managing specialties and certifications
  const addSpecialty = (specialty: string) => {
    if (specialty && !newTrainer.specialties.includes(specialty)) {
      setNewTrainer(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setNewTrainer(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addCertification = (certification: string) => {
    if (certification && !newTrainer.certifications.includes(certification)) {
      setNewTrainer(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification]
      }));
    }
  };

  const removeCertification = (certification: string) => {
    setNewTrainer(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
        setNewTrainer(prev => ({
          ...prev,
          profileImageUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Load trainers from API
  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const response = await api.getTrainers();
      // Handle both paginated and non-paginated responses
      const trainersData = response.content || response;
      setTrainers(Array.isArray(trainersData) ? trainersData : []);
    } catch (err) {
      setError('Failed to load trainers');
      console.error('Error loading trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrainer = async () => {
    try {
      // Get the user's gyms to get the gymId
      const gyms = await api.getGyms();
      if (!gyms || gyms.length === 0) {
        setError('No gym found. Please create a gym first.');
        return;
      }
      
      // Use the first gym (most recent)
      const gymId = gyms[0].id;
      
      const response = await api.createTrainer({
        ...newTrainer,
        centerId: gymId
      });
      setTrainers(prev => [response, ...prev]);
      setShowAddModal(false);
      setNewTrainer({
        name: '',
        email: '',
        phone: '',
        specialties: [],
        certifications: [],
        experienceYears: 0,
        rating: 0,
        hourlyRate: 0,
        availability: '{}',
        bio: '',
        status: 'ACTIVE',
        joinDate: new Date().toISOString().split('T')[0],
        totalClients: 0,
        totalSessions: 0,
        notes: ''
      });
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setNewSpecialty('');
      setNewCertification('');
    } catch (err) {
      setError('Failed to add trainer');
      console.error('Error adding trainer:', err);
    }
  };

  const handleEditTrainer = async (trainer: Trainer) => {
    try {
      // Get the user's gyms to get the gymId
      const gyms = await api.getGyms();
      if (!gyms || gyms.length === 0) {
        setError('No gym found. Please create a gym first.');
        return;
      }
      
      // Use the first gym (most recent)
      const gymId = gyms[0].id;
      
      const response = await api.updateTrainer(trainer.id, {
        ...trainer,
        centerId: gymId
      });
      setTrainers(prev => prev.map(t => t.id === trainer.id ? response : t));
      setEditingTrainer(null);
    } catch (err) {
      setError('Failed to update trainer');
      console.error('Error updating trainer:', err);
    }
  };

  const handleDeleteTrainer = async (id: number) => {
    try {
      await api.deleteTrainer(id);
      setTrainers(prev => prev.filter(trainer => trainer.id !== id));
    } catch (err) {
      setError('Failed to delete trainer');
      console.error('Error deleting trainer:', err);
    }
  };

  const openEditModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setProfileImagePreview(trainer.profileImageUrl || null);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditingTrainer(null);
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setNewSpecialty('');
    setNewCertification('');
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainer.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'All' || trainer.specialties.includes(selectedSpecialty);
    const matchesStatus = selectedStatus === 'All' || trainer.status === selectedStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

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

  const getActiveTrainersCount = () => {
    return trainers.filter(trainer => trainer.status === 'ACTIVE').length;
  };

  const getAverageRating = () => {
    const activeTrainers = trainers.filter(trainer => trainer.status === 'ACTIVE');
    return activeTrainers.length > 0 
      ? activeTrainers.reduce((sum, trainer) => sum + trainer.rating, 0) / activeTrainers.length 
      : 0;
  };

  const getTotalSessions = () => {
    return trainers.reduce((total, trainer) => total + trainer.totalSessions, 0);
  };

  const getTotalClients = () => {
    return trainers.reduce((total, trainer) => total + trainer.totalClients, 0);
  };

  return (
    <div className={`trainers-page ${theme}`}>
      <div className="trainers-header">
        <div className="header-content">
          <h1 className="page-title">Trainers</h1>
          <p className="page-subtitle">Manage your gym's personal trainers and fitness instructors</p>
        </div>
        <button 
          className="add-trainer-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Add Trainer
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading trainers...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadTrainers}>Retry</button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{trainers.length}</h3>
            <p>Total Trainers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <h3>{getActiveTrainersCount()}</h3>
            <p>Active Trainers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>{getAverageRating().toFixed(1)}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{getTotalSessions()}</h3>
            <p>Total Sessions</p>
          </div>
        </div>
      </div>

      <div className="trainers-controls">
        <div className="search-section">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
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

      <div className="trainers-content">
        <div className="trainers-grid">
          {filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <div className="card-header">
                <div className="trainer-avatar">
                  {trainer.profileImageUrl ? (
                    <img src={trainer.profileImageUrl} alt={trainer.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="trainer-info">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <p className="trainer-experience">{trainer.experienceYears} years experience</p>
                </div>
                <div className="trainer-rating">
                  <Star size={16} className="star-icon" />
                  <span>{trainer.rating}</span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="trainer-details">
                  <div className="detail-item">
                    <strong>Specialties:</strong>
                    <div className="specialty-tags">
                      {trainer.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <strong>Certifications:</strong>
                    <div className="certification-tags">
                      {trainer.certifications.map((cert, index) => (
                        <span key={index} className="certification-tag">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <strong>Hourly Rate:</strong> ${trainer.hourlyRate}
                  </div>
                  
                  <div className="detail-item">
                    <strong>Status:</strong>
                    <span 
                      className="status-badge"
                      style={{ color: getStatusColor(trainer.status) }}
                    >
                      {getStatusText(trainer.status)}
                    </span>
                  </div>
                  
                  <div className="stats-row">
                    <div className="stat-item">
                      <Users size={16} />
                      <span>{trainer.totalClients} clients</span>
                    </div>
                    <div className="stat-item">
                      <Calendar size={16} />
                      <span>{trainer.totalSessions} sessions</span>
                    </div>
                  </div>
                  
                  {trainer.bio && (
                    <div className="trainer-bio">
                      <strong>Bio:</strong>
                      <p>{trainer.bio}</p>
                    </div>
                  )}
                  
                  {trainer.notes && (
                    <div className="trainer-notes">
                      <strong>Notes:</strong>
                      <p>{trainer.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => openEditModal(trainer)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteTrainer(trainer.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Trainer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Trainer</h2>
              <button 
                className="close-btn"
                onClick={closeModals}
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
                    value={newTrainer.name}
                    onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newTrainer.email}
                    onChange={(e) => setNewTrainer({...newTrainer, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newTrainer.phone}
                    onChange={(e) => setNewTrainer({...newTrainer, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    value={newTrainer.experienceYears}
                    onChange={(e) => setNewTrainer({...newTrainer, experienceYears: parseInt(e.target.value) || 0})}
                    placeholder="Enter years of experience"
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newTrainer.rating}
                    onChange={(e) => setNewTrainer({...newTrainer, rating: parseFloat(e.target.value) || 0})}
                    placeholder="Enter rating (0-5)"
                  />
                </div>
                <div className="form-group">
                  <label>Hourly Rate</label>
                  <input
                    type="number"
                    value={newTrainer.hourlyRate}
                    onChange={(e) => setNewTrainer({...newTrainer, hourlyRate: parseFloat(e.target.value) || 0})}
                    placeholder="Enter hourly rate"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newTrainer.status}
                    onChange={(e) => setNewTrainer({...newTrainer, status: e.target.value as any})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input
                    type="date"
                    value={newTrainer.joinDate}
                    onChange={(e) => setNewTrainer({...newTrainer, joinDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                      id="profile-image-upload"
                    />
                    <label htmlFor="profile-image-upload" className="image-upload-label">
                      {profileImagePreview ? (
                        <img src={profileImagePreview} alt="Profile preview" className="image-preview" />
                      ) : (
                        <div className="image-upload-placeholder">
                          <User size={24} />
                          <span>Upload Image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Specialties</label>
                  <div className="tag-input-container">
                    <div className="tag-input">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="Add specialty"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSpecialty(newSpecialty);
                            setNewSpecialty('');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addSpecialty(newSpecialty);
                          setNewSpecialty('');
                        }}
                        className="add-tag-btn"
                      >
                        Add
                      </button>
                    </div>
                    <div className="tag-list">
                      {newTrainer.specialties.map((specialty, index) => (
                        <span key={index} className="tag">
                          {specialty}
                          <button
                            type="button"
                            onClick={() => removeSpecialty(specialty)}
                            className="remove-tag"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Certifications</label>
                  <div className="tag-input-container">
                    <div className="tag-input">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add certification"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCertification(newCertification);
                            setNewCertification('');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addCertification(newCertification);
                          setNewCertification('');
                        }}
                        className="add-tag-btn"
                      >
                        Add
                      </button>
                    </div>
                    <div className="tag-list">
                      {newTrainer.certifications.map((certification, index) => (
                        <span key={index} className="tag">
                          {certification}
                          <button
                            type="button"
                            onClick={() => removeCertification(certification)}
                            className="remove-tag"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    value={newTrainer.bio}
                    onChange={(e) => setNewTrainer({...newTrainer, bio: e.target.value})}
                    placeholder="Enter trainer bio"
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={newTrainer.notes}
                    onChange={(e) => setNewTrainer({...newTrainer, notes: e.target.value})}
                    placeholder="Enter any additional notes"
                    rows={2}
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
                onClick={handleAddTrainer}
              >
                Add Trainer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trainer Modal */}
      {editingTrainer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Trainer</h2>
              <button 
                className="close-btn"
                onClick={closeModals}
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
                    value={editingTrainer.name}
                    onChange={(e) => setEditingTrainer({...editingTrainer, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingTrainer.email}
                    onChange={(e) => setEditingTrainer({...editingTrainer, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editingTrainer.phone}
                    onChange={(e) => setEditingTrainer({...editingTrainer, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    value={editingTrainer.experienceYears}
                    onChange={(e) => setEditingTrainer({...editingTrainer, experienceYears: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingTrainer.rating}
                    onChange={(e) => setEditingTrainer({...editingTrainer, rating: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Hourly Rate</label>
                  <input
                    type="number"
                    value={editingTrainer.hourlyRate}
                    onChange={(e) => setEditingTrainer({...editingTrainer, hourlyRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingTrainer.status}
                    onChange={(e) => setEditingTrainer({...editingTrainer, status: e.target.value as any})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input
                    type="date"
                    value={editingTrainer.joinDate}
                    onChange={(e) => setEditingTrainer({...editingTrainer, joinDate: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    value={editingTrainer.bio}
                    onChange={(e) => setEditingTrainer({...editingTrainer, bio: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={editingTrainer.notes}
                    onChange={(e) => setEditingTrainer({...editingTrainer, notes: e.target.value})}
                    rows={2}
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
                onClick={() => handleEditTrainer(editingTrainer)}
              >
                Update Trainer
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

export default TrainersPage;
