import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Phone, Mail, Clock, Users, Wifi, Car, Dumbbell, Shield, Star } from 'lucide-react';
import './GymInformationPage.css';

interface GymInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  capacity: number;
  amenities: string[];
  description: string;
  rating: number;
}

const GymInformationPage: React.FC = () => {
  const { theme } = useTheme();
  
  console.log('GymInformationPage rendered');
  const [gymInfo, setGymInfo] = useState<GymInfo>({
    name: 'New Gym',
    address: '123 Fitness Street, Health City, HC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@newgym.com',
    hours: 'Monday - Sunday: 5:00 AM - 11:00 PM',
    capacity: 200,
    amenities: ['Free WiFi', 'Parking', 'Locker Rooms', 'Shower Facilities', 'Personal Training', 'Group Classes'],
    description: 'A state-of-the-art fitness facility equipped with modern equipment and professional trainers to help you achieve your fitness goals.',
    rating: 4.8
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<GymInfo>(gymInfo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(gymInfo);
  };

  const handleSave = () => {
    setGymInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(gymInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof GymInfo, value: string | number) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...editedInfo.amenities];
    newAmenities[index] = value;
    setEditedInfo(prev => ({ ...prev, amenities: newAmenities }));
  };

  const addAmenity = () => {
    setEditedInfo(prev => ({ ...prev, amenities: [...prev.amenities, ''] }));
  };

  const removeAmenity = (index: number) => {
    setEditedInfo(prev => ({ 
      ...prev, 
      amenities: prev.amenities.filter((_, i) => i !== index) 
    }));
  };

  return (
    <div className={`gym-information-page ${theme}`}>
      <div className="gym-info-header">
        <h1 className="page-title">Gym Information</h1>
        <p className="page-subtitle">Manage your gym's basic information and details</p>
      </div>

      <div className="gym-info-content">
        <div className="gym-info-card">
          <div className="card-header">
            <h2 className="card-title">Basic Information</h2>
            {!isEditing && (
              <button className="edit-btn" onClick={handleEdit}>
                Edit Information
              </button>
            )}
          </div>

          <div className="card-content">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Gym Name</label>
                  <input
                    type="text"
                    value={editedInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editedInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={editedInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Operating Hours</label>
                  <input
                    type="text"
                    value={editedInfo.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      type="number"
                      value={editedInfo.capacity}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editedInfo.rating}
                      onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editedInfo.description}
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
                      <p>{gymInfo.address}</p>
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

                  <div className="info-item">
                    <Clock className="info-icon" />
                    <div className="info-content">
                      <h3>Hours</h3>
                      <p>{gymInfo.hours}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Users className="info-icon" />
                    <div className="info-content">
                      <h3>Capacity</h3>
                      <p>{gymInfo.capacity} members</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Star className="info-icon" />
                    <div className="info-content">
                      <h3>Rating</h3>
                      <p>{gymInfo.rating}/5.0</p>
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

        <div className="gym-info-card">
          <div className="card-header">
            <h2 className="card-title">Amenities</h2>
            {!isEditing && (
              <button className="edit-btn" onClick={handleEdit}>
                Edit Amenities
              </button>
            )}
          </div>

          <div className="card-content">
            {isEditing ? (
              <div className="amenities-edit">
                {editedInfo.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-input-group">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      placeholder="Enter amenity"
                    />
                    <button 
                      className="remove-amenity-btn"
                      onClick={() => removeAmenity(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button className="add-amenity-btn" onClick={addAmenity}>
                  Add Amenity
                </button>
              </div>
            ) : (
              <div className="amenities-grid">
                {gymInfo.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <div className="amenity-icon">
                      {amenity.includes('WiFi') && <Wifi size={20} />}
                      {amenity.includes('Parking') && <Car size={20} />}
                      {amenity.includes('Training') && <Dumbbell size={20} />}
                      {amenity.includes('Classes') && <Users size={20} />}
                      {amenity.includes('Locker') && <Shield size={20} />}
                      {amenity.includes('Shower') && <Shield size={20} />}
                    </div>
                    <span className="amenity-text">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymInformationPage;
