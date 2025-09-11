import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Filter, Edit, Trash2, User, Star, Calendar, Clock, Award, Users, DollarSign } from 'lucide-react';
import './TrainersPage.css';

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  certifications: string[];
  experience: number; // years
  rating: number;
  hourlyRate: number;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  bio: string;
  profileImage?: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  joinDate: string;
  totalClients: number;
  totalSessions: number;
  notes?: string;
}

const TrainersPage: React.FC = () => {
  const { theme } = useTheme();
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gym.com',
      phone: '+1 (555) 234-5678',
      specialties: ['Strength Training', 'Weight Loss', 'Bodybuilding'],
      certifications: ['NASM-CPT', 'CSCS', 'Precision Nutrition'],
      experience: 8,
      rating: 4.9,
      hourlyRate: 75,
      availability: {
        monday: ['9:00 AM', '2:00 PM', '6:00 PM'],
        tuesday: ['10:00 AM', '3:00 PM', '7:00 PM'],
        wednesday: ['9:00 AM', '2:00 PM', '6:00 PM'],
        thursday: ['10:00 AM', '3:00 PM', '7:00 PM'],
        friday: ['9:00 AM', '2:00 PM', '5:00 PM'],
        saturday: ['10:00 AM', '2:00 PM'],
        sunday: []
      },
      bio: 'Certified personal trainer with 8+ years of experience helping clients achieve their fitness goals through strength training and nutrition coaching.',
      status: 'Active',
      joinDate: '2023-03-20',
      totalClients: 25,
      totalSessions: 1200,
      notes: 'Specializes in powerlifting and Olympic weightlifting'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@gym.com',
      phone: '+1 (555) 345-6789',
      specialties: ['Yoga', 'Pilates', 'Flexibility'],
      certifications: ['RYT-500', 'Pilates Instructor', 'Yin Yoga'],
      experience: 6,
      rating: 4.8,
      hourlyRate: 65,
      availability: {
        monday: ['7:00 AM', '12:00 PM', '5:00 PM'],
        tuesday: ['8:00 AM', '1:00 PM', '6:00 PM'],
        wednesday: ['7:00 AM', '12:00 PM', '5:00 PM'],
        thursday: ['8:00 AM', '1:00 PM', '6:00 PM'],
        friday: ['7:00 AM', '12:00 PM', '4:00 PM'],
        saturday: ['9:00 AM', '1:00 PM'],
        sunday: ['10:00 AM', '2:00 PM']
      },
      bio: 'Experienced yoga and pilates instructor focused on improving flexibility, balance, and mental well-being through mindful movement.',
      status: 'Active',
      joinDate: '2023-06-15',
      totalClients: 18,
      totalSessions: 850,
      notes: 'Great with beginners and rehabilitation'
    },
    {
      id: '3',
      name: 'Emily Chen',
      email: 'emily.chen@gym.com',
      phone: '+1 (555) 456-7890',
      specialties: ['HIIT', 'Cardio', 'Group Fitness'],
      certifications: ['ACSM-CPT', 'HIIT Specialist', 'Group Fitness'],
      experience: 5,
      rating: 4.7,
      hourlyRate: 60,
      availability: {
        monday: ['6:00 AM', '11:00 AM', '4:00 PM'],
        tuesday: ['7:00 AM', '12:00 PM', '5:00 PM'],
        wednesday: ['6:00 AM', '11:00 AM', '4:00 PM'],
        thursday: ['7:00 AM', '12:00 PM', '5:00 PM'],
        friday: ['6:00 AM', '11:00 AM', '3:00 PM'],
        saturday: ['8:00 AM', '12:00 PM'],
        sunday: []
      },
      bio: 'High-energy trainer specializing in HIIT and cardio workouts. Passionate about helping clients build endurance and burn fat effectively.',
      status: 'On Leave',
      joinDate: '2023-08-05',
      totalClients: 22,
      totalSessions: 950,
      notes: 'Currently on maternity leave until April 2024'
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david.thompson@gym.com',
      phone: '+1 (555) 567-8901',
      specialties: ['Functional Training', 'Rehabilitation', 'Senior Fitness'],
      certifications: ['NASM-CES', 'FMS', 'Senior Fitness Specialist'],
      experience: 10,
      rating: 4.9,
      hourlyRate: 80,
      availability: {
        monday: ['8:00 AM', '1:00 PM', '6:00 PM'],
        tuesday: ['9:00 AM', '2:00 PM', '7:00 PM'],
        wednesday: ['8:00 AM', '1:00 PM', '6:00 PM'],
        thursday: ['9:00 AM', '2:00 PM', '7:00 PM'],
        friday: ['8:00 AM', '1:00 PM', '5:00 PM'],
        saturday: ['9:00 AM', '1:00 PM'],
        sunday: ['10:00 AM']
      },
      bio: 'Senior trainer with extensive experience in functional movement and rehabilitation. Expert in working with clients recovering from injuries.',
      status: 'Active',
      joinDate: '2023-01-10',
      totalClients: 30,
      totalSessions: 1500,
      notes: 'Highly recommended for post-injury recovery'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [newTrainer, setNewTrainer] = useState<Omit<Trainer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    specialties: [],
    certifications: [],
    experience: 0,
    rating: 0,
    hourlyRate: 0,
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    bio: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    totalClients: 0,
    totalSessions: 0,
    notes: ''
  });

  const specialties = ['All', 'Strength Training', 'Weight Loss', 'Bodybuilding', 'Yoga', 'Pilates', 'HIIT', 'Cardio', 'Functional Training', 'Rehabilitation', 'Senior Fitness'];
  const statuses = ['All', 'Active', 'Inactive', 'On Leave'];

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
      case 'Active': return '#22c55e';
      case 'Inactive': return '#6b7280';
      case 'On Leave': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleAddTrainer = () => {
    const trainer: Trainer = {
      ...newTrainer,
      id: Date.now().toString()
    };
    setTrainers([...trainers, trainer]);
    setNewTrainer({
      name: '',
      email: '',
      phone: '',
      specialties: [],
      certifications: [],
      experience: 0,
      rating: 0,
      hourlyRate: 0,
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      bio: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      totalClients: 0,
      totalSessions: 0,
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleEditTrainer = (trainer: Trainer) => {
    setEditingTrainer(trainer);
  };

  const handleUpdateTrainer = () => {
    if (editingTrainer) {
      setTrainers(trainers.map(trainer => 
        trainer.id === editingTrainer.id ? editingTrainer : trainer
      ));
      setEditingTrainer(null);
    }
  };

  const handleDeleteTrainer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      setTrainers(trainers.filter(trainer => trainer.id !== id));
    }
  };

  const getActiveTrainersCount = () => {
    return trainers.filter(trainer => trainer.status === 'Active').length;
  };

  const getAverageRating = () => {
    const activeTrainers = trainers.filter(trainer => trainer.status === 'Active');
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
                  {trainer.profileImage ? (
                    <img src={trainer.profileImage} alt={trainer.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="trainer-info">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <p className="trainer-experience">{trainer.experience} years experience</p>
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
                      {trainer.status}
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
                  onClick={() => handleEditTrainer(trainer)}
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
                    value={newTrainer.experience}
                    onChange={(e) => setNewTrainer({...newTrainer, experience: parseInt(e.target.value) || 0})}
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
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
                onClick={() => setShowAddModal(false)}
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
                onClick={() => setEditingTrainer(null)}
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
                    value={editingTrainer.experience}
                    onChange={(e) => setEditingTrainer({...editingTrainer, experience: parseInt(e.target.value) || 0})}
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
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
                onClick={() => setEditingTrainer(null)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleUpdateTrainer}
              >
                Update Trainer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainersPage;
