import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFirstGym.css';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  description: string;
}

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  bio: string;
  photo: string;
  certifications: string[];
}

interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
}

interface GymTiming {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface GymData {
  // Basic Information
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  capacity: number;
  description: string;
  
  // Additional Details
  website?: string;
  establishedYear: number;
  totalArea: number;
  
  // Images
  mainImage: string;
  gallery: string[];
  
  // Timings
  timings: GymTiming[];
  
  // Membership Plans
  membershipPlans: MembershipPlan[];
  
  // Trainers
  trainers: Trainer[];
  
  // Facilities
  facilities: Facility[];
  
  // Additional Info
  amenities: string[];
  rules: string[];
  contactInfo: {
    managerName: string;
    managerPhone: string;
    emergencyContact: string;
  };
}

interface AddFirstGymProps {
  onGymAdded: (gymData: GymData) => void;
}

const AddFirstGym: React.FC<AddFirstGymProps> = ({ onGymAdded }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GymData>({
    // Basic Information
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    capacity: 0,
    description: '',
    
    // Additional Details
    website: '',
    establishedYear: new Date().getFullYear(),
    totalArea: 1,
    
    // Images
    mainImage: '',
    gallery: [],
    
    // Timings
    timings: [
      { day: 'Monday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Tuesday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Wednesday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Thursday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Friday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Saturday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Sunday', openTime: '08:00', closeTime: '20:00', isOpen: true },
    ],
    
    // Membership Plans
    membershipPlans: [],
    
    // Trainers
    trainers: [],
    
    // Facilities
    facilities: [],
    
    // Additional Info
    amenities: [],
    rules: [],
    contactInfo: {
      managerName: '',
      managerPhone: '',
      emergencyContact: ''
    }
  });

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Gym details and contact info' },
    { number: 2, title: 'Images & Gallery', description: 'Upload gym photos' },
    { number: 3, title: 'Operating Hours', description: 'Set gym timings' },
    { number: 4, title: 'Membership Plans', description: 'Create pricing plans' },
    { number: 5, title: 'Trainers', description: 'Add trainer profiles' },
    { number: 6, title: 'Facilities', description: 'List gym facilities' },
    { number: 7, title: 'Final Details', description: 'Amenities and rules' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof GymData] as object || {}),
          [child]: type === 'number' ? parseInt(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleArrayInputChange = (field: keyof GymData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const addMembershipPlan = () => {
    const newPlan: MembershipPlan = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      duration: 'monthly',
      features: [],
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      membershipPlans: [...prev.membershipPlans, newPlan]
    }));
  };

  const updateMembershipPlan = (index: number, field: keyof MembershipPlan, value: any) => {
    setFormData(prev => ({
      ...prev,
      membershipPlans: prev.membershipPlans.map((plan, i) => 
        i === index ? { ...plan, [field]: value } : plan
      )
    }));
  };

  const removeMembershipPlan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      membershipPlans: prev.membershipPlans.filter((_, i) => i !== index)
    }));
  };

  const addTrainer = () => {
    const newTrainer: Trainer = {
      id: Date.now().toString(),
      name: '',
      specialty: '',
      experience: '',
      bio: '',
      photo: '',
      certifications: []
    };
    setFormData(prev => ({
      ...prev,
      trainers: [...prev.trainers, newTrainer]
    }));
  };

  const updateTrainer = (index: number, field: keyof Trainer, value: any) => {
    setFormData(prev => ({
      ...prev,
      trainers: prev.trainers.map((trainer, i) => 
        i === index ? { ...trainer, [field]: value } : trainer
      )
    }));
  };

  const removeTrainer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trainers: prev.trainers.filter((_, i) => i !== index)
    }));
  };

  const addFacility = () => {
    const newFacility: Facility = {
      id: Date.now().toString(),
      name: '',
      description: '',
      image: '',
      available: true
    };
    setFormData(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility]
    }));
  };

  const updateFacility = (index: number, field: keyof Facility, value: any) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) => 
        i === index ? { ...facility, [field]: value } : facility
      )
    }));
  };

  const removeFacility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (type === 'main') {
          setFormData(prev => ({ ...prev, mainImage: imageUrl }));
        } else {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, imageUrl] }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('ownerToken');
      
      if (!token) {
        setError('No authentication token found. Please sign in again.');
        setIsLoading(false);
        return;
      }

      console.log('Submitting gym data with token:', token.substring(0, 20) + '...');
      console.log('Form data:', formData);

      const response = await fetch('http://localhost:8080/api/owner/auth/gym/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Update localStorage with the new gym data
        const existingGyms = JSON.parse(localStorage.getItem('gymsData') || '[]');
        const updatedGyms = [...existingGyms, data];
        localStorage.setItem('gymsData', JSON.stringify(updatedGyms));
        
        console.log('Gym created successfully');
        onGymAdded(data);
      } else {
        if (response.status === 401) {
          setError('Authentication failed. Please sign in again.');
          // Clear invalid token
          localStorage.removeItem('ownerToken');
          localStorage.removeItem('ownerData');
          localStorage.removeItem('gymsData');
        } else {
          setError(data.message || data.error || 'Failed to add gym');
        }
      }
    } catch (error) {
      console.error('Error submitting gym:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Gym Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter gym name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity" className="form-label">Capacity *</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter capacity"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter street address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state" className="form-label">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter state"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website" className="form-label">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://yourgym.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="establishedYear" className="form-label">Established Year *</label>
                <input
                  type="number"
                  id="establishedYear"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="totalArea" className="form-label">Total Area (sq ft) *</label>
                <input
                  type="number"
                  id="totalArea"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter area in square feet"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe your gym, its unique features, and what makes it special. Include details about your equipment, atmosphere, community, and any special programs or services you offer. This description will help potential members understand what makes your gym unique and why they should choose you over competitors."
                rows={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Any additional information about your gym that you'd like to share with potential members..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Images & Gallery</h3>
            <div className="form-group">
              <label className="form-label">Main Gym Image *</label>
              <div className="image-upload-section">
                {formData.mainImage ? (
                  <div className="image-preview">
                    <img src={formData.mainImage} alt="Main gym" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      className="file-input"
                      id="mainImage"
                    />
                    <label htmlFor="mainImage" className="upload-button">
                      📷 Upload Main Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Gallery Images</label>
              <div className="gallery-section">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={image} alt={`Gallery ${index + 1}`} />
                    <button type="button" onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      gallery: prev.gallery.filter((_, i) => i !== index) 
                    }))}>
                      Remove
                    </button>
                  </div>
                ))}
                <div className="gallery-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    className="file-input"
                    id="galleryImage"
                  />
                  <label htmlFor="galleryImage" className="upload-button">
                    📷 Add to Gallery
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Operating Hours</h3>
            <div className="timings-section">
              {formData.timings.map((timing, index) => (
                <div key={timing.day} className="timing-row">
                  <div className="day-checkbox">
                    <input
                      type="checkbox"
                      id={`timing-${index}`}
                      checked={timing.isOpen}
                      onChange={(e) => {
                        const newTimings = [...formData.timings];
                        newTimings[index].isOpen = e.target.checked;
                        setFormData(prev => ({ ...prev, timings: newTimings }));
                      }}
                    />
                    <label htmlFor={`timing-${index}`}>{timing.day}</label>
                  </div>
                  {timing.isOpen && (
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={timing.openTime}
                        onChange={(e) => {
                          const newTimings = [...formData.timings];
                          newTimings[index].openTime = e.target.value;
                          setFormData(prev => ({ ...prev, timings: newTimings }));
                        }}
                        className="time-input"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={timing.closeTime}
                        onChange={(e) => {
                          const newTimings = [...formData.timings];
                          newTimings[index].closeTime = e.target.value;
                          setFormData(prev => ({ ...prev, timings: newTimings }));
                        }}
                        className="time-input"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Membership Plans</h3>
            <div className="plans-section">
              {formData.membershipPlans.map((plan, index) => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-header">
                    <h4>Plan {index + 1}</h4>
                    <button type="button" onClick={() => removeMembershipPlan(index)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Plan Name *</label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => updateMembershipPlan(index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="e.g., Basic, Premium, VIP"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => updateMembershipPlan(index, 'price', parseInt(e.target.value) || 0)}
                        className="form-input"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration *</label>
                      <select
                        value={plan.duration}
                        onChange={(e) => updateMembershipPlan(index, 'duration', e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      value={plan.description}
                      onChange={(e) => updateMembershipPlan(index, 'description', e.target.value)}
                      className="form-textarea"
                      placeholder="Describe what's included in this plan"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={plan.features.join(', ')}
                      onChange={(e) => updateMembershipPlan(index, 'features', e.target.value.split(',').map(f => f.trim()).filter(f => f))}
                      className="form-input"
                      placeholder="e.g., 24/7 access, personal trainer, nutrition consultation"
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addMembershipPlan} className="add-item-btn">
                + Add Membership Plan
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Trainers</h3>
            <div className="trainers-section">
              {formData.trainers.map((trainer, index) => (
                <div key={trainer.id} className="trainer-card">
                  <div className="trainer-header">
                    <h4>Trainer {index + 1}</h4>
                    <button type="button" onClick={() => removeTrainer(index)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        value={trainer.name}
                        onChange={(e) => updateTrainer(index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="Trainer's full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Specialty *</label>
                      <input
                        type="text"
                        value={trainer.specialty}
                        onChange={(e) => updateTrainer(index, 'specialty', e.target.value)}
                        className="form-input"
                        placeholder="e.g., Weight Training, Yoga, Cardio"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience *</label>
                      <input
                        type="text"
                        value={trainer.experience}
                        onChange={(e) => updateTrainer(index, 'experience', e.target.value)}
                        className="form-input"
                        placeholder="e.g., 5 years, 10+ years"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      value={trainer.bio}
                      onChange={(e) => updateTrainer(index, 'bio', e.target.value)}
                      className="form-textarea"
                      placeholder="Tell us about the trainer's background and expertise"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Certifications (comma-separated)</label>
                    <input
                      type="text"
                      value={trainer.certifications.join(', ')}
                      onChange={(e) => updateTrainer(index, 'certifications', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                      className="form-input"
                      placeholder="e.g., NASM, ACE, CrossFit Level 1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Photo</label>
                    <div className="image-upload-section">
                      {trainer.photo ? (
                        <div className="image-preview">
                          <img src={trainer.photo} alt="Trainer" />
                          <button type="button" onClick={() => updateTrainer(index, 'photo', '')}>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="image-upload-placeholder">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  updateTrainer(index, 'photo', event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="file-input"
                            id={`trainer-photo-${index}`}
                          />
                          <label htmlFor={`trainer-photo-${index}`} className="upload-button">
                            📷 Upload Photo
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTrainer} className="add-item-btn">
                + Add Trainer
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h3>Facilities</h3>
            <div className="facilities-section">
              {formData.facilities.map((facility, index) => (
                <div key={facility.id} className="facility-card">
                  <div className="facility-header">
                    <h4>Facility {index + 1}</h4>
                    <button type="button" onClick={() => removeFacility(index)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Facility Name *</label>
                      <input
                        type="text"
                        value={facility.name}
                        onChange={(e) => updateFacility(index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="e.g., Cardio Zone, Weight Room, Pool"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Available</label>
                      <select
                        value={facility.available.toString()}
                        onChange={(e) => updateFacility(index, 'available', e.target.value === 'true')}
                        className="form-input"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      value={facility.description}
                      onChange={(e) => updateFacility(index, 'description', e.target.value)}
                      className="form-textarea"
                      placeholder="Describe the facility and its equipment"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Photo</label>
                    <div className="image-upload-section">
                      {facility.image ? (
                        <div className="image-preview">
                          <img src={facility.image} alt="Facility" />
                          <button type="button" onClick={() => updateFacility(index, 'image', '')}>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="image-upload-placeholder">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  updateFacility(index, 'image', event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="file-input"
                            id={`facility-image-${index}`}
                          />
                          <label htmlFor={`facility-image-${index}`} className="upload-button">
                            📷 Upload Photo
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addFacility} className="add-item-btn">
                + Add Facility
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="step-content">
            <h3>Final Details</h3>
            
            <div className="form-group">
              <label className="form-label">Amenities (comma-separated)</label>
              <input
                type="text"
                value={formData.amenities.join(', ')}
                onChange={(e) => handleArrayInputChange('amenities', e.target.value)}
                className="form-input"
                placeholder="e.g., WiFi, Parking, Locker Room, Shower, Towel Service"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gym Rules (comma-separated)</label>
              <input
                type="text"
                value={formData.rules.join(', ')}
                onChange={(e) => handleArrayInputChange('rules', e.target.value)}
                className="form-input"
                placeholder="e.g., No outside food, Proper gym attire required, Equipment must be wiped down"
              />
            </div>

            <h4>Contact Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Manager Name *</label>
                <input
                  type="text"
                  name="contactInfo.managerName"
                  value={formData.contactInfo.managerName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Manager's full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Manager Phone *</label>
                <input
                  type="tel"
                  name="contactInfo.managerPhone"
                  value={formData.contactInfo.managerPhone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Manager's phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact *</label>
                <input
                  type="tel"
                  name="contactInfo.emergencyContact"
                  value={formData.contactInfo.emergencyContact}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Emergency contact number"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-first-gym-container">
      <div className="add-first-gym-card">
        <div className="add-first-gym-header">
          <h1 className="add-first-gym-title">Add Your First Gym</h1>
          <p className="add-first-gym-subtitle">
            Create a comprehensive profile for your gym that users will see in the app
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''}`}>
              <div className="step-number">{step.number}</div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="add-first-gym-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {renderStepContent()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Gym...' : 'Create Gym & Continue'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirstGym;
