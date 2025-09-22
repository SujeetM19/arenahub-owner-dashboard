import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Upload, Image as ImageIcon, Trash2, Edit, Eye, Download, Search, Filter, X, Save, ImagePlus } from 'lucide-react';
import GymInfoNavbar from './GymInfoNavbar';
import api from '../services/api';
import './GalleryPage.css';

interface GalleryItem {
  id: number;
  name: string;
  fileUrl: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  fileSize: number;
  description?: string;
  fileType?: string;
  uploadedBy?: string;
  gymId?: number;
  gymName?: string;
}

const GalleryPage: React.FC = () => {
  const { theme } = useTheme();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadCategory, setUploadCategory] = useState('GYM_FACILITIES');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadName, setUploadName] = useState('');

  const categories = [
    'All', 
    'GYM_FACILITIES', 
    'EQUIPMENT', 
    'TRAINING_AREA', 
    'LOCKER_ROOM', 
    'RECEPTION', 
    'PARKING', 
    'OUTDOOR_AREA', 
    'CLASSES', 
    'EVENTS', 
    'MEMBERS', 
    'STAFF', 
    'OTHER'
  ];

  // Load gallery items from API
  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await api.getGalleryItems();
      // Handle paginated response - extract content array
      const items = response.content || response || [];
      setGalleryItems(Array.isArray(items) ? items : []);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error('Error loading gallery items:', err);
      setGalleryItems([]); // Ensure galleryItems is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await api.deleteGalleryItem(id);
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  const handleDeleteItems = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      try {
        await api.deleteGalleryItems(selectedItems);
        setGalleryItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      } catch (err) {
        setError('Failed to delete items');
        console.error('Error deleting items:', err);
      }
    }
  };

  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    try {
      setUploadProgress({});
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', uploadName || file.name);
        formData.append('category', uploadCategory);
        formData.append('description', uploadDescription);

        // Simulate progress
        const progressKey = file.name;
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
        
        const interval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [progressKey]: Math.min(prev[progressKey] + 10, 90)
          }));
        }, 200);

        try {
          const response = await api.createGalleryItem(formData);
          clearInterval(interval);
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
          return response;
        } catch (error) {
          clearInterval(interval);
          throw error;
        }
      });

      await Promise.all(uploadPromises);
      await loadGalleryItems();
      setShowUploadModal(false);
      setUploadFiles(null);
      setUploadProgress({});
      setUploadName('');
      setUploadDescription('');
      setUploadCategory('GYM_FACILITIES');
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files');
    }
  };

  const handleEditItem = async (item: GalleryItem) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      await api.updateGalleryItem(editingItem.id, {
        name: editingItem.name,
        category: editingItem.category,
        description: editingItem.description || ''
      });
      
      setGalleryItems(prev => 
        prev.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
      setShowEditModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    }
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredItems.length 
        ? [] 
        : filteredItems.map(item => item.id)
    );
  };


  const handleViewItem = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`gallery-page ${theme}`}>
      <GymInfoNavbar />
      <div className="gallery-header">
        <div className="header-content">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">Manage your gym's photos and media</p>
        </div>
        <div className="header-actions">
          <button 
            className="upload-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={20} />
            Upload Images
          </button>
        </div>
      </div>

      <div className="gallery-controls">
        <div className="search-section">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="view-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedItems.length} selected</span>
              <button 
                className="delete-btn"
                onClick={handleDeleteItems}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="gallery-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading gallery items...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadGalleryItems}>Retry</button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={64} />
            <h3>No images found</h3>
            <p>Upload some images to get started</p>
            <button 
              className="upload-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload size={20} />
              Upload Images
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="gallery-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="gallery-item">
                    <div className="item-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </div>
                    <div className="item-image" onClick={() => handleViewItem(item)}>
                      <img src={item.imageUrl || item.fileUrl} alt={item.name} />
                      <div className="image-overlay">
                        <button className="view-btn">
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <p className="item-date">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="item-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="gallery-list">
                <div className="list-header">
                  <div className="select-all">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                    />
                    <span>Select All</span>
                  </div>
                  <div className="list-columns">
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Date</span>
                    <span>Size</span>
                    <span>Actions</span>
                  </div>
                </div>
                {filteredItems.map((item) => (
                  <div key={item.id} className="list-item">
                    <div className="item-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </div>
                    <div className="item-image">
                      <img src={item.fileUrl} alt={item.name} />
                    </div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-category">{item.category}</div>
                    <div className="item-date">{new Date(item.createdAt).toLocaleDateString()}</div>
                    <div className="item-size">{(item.fileSize / 1024 / 1024).toFixed(1)} MB</div>
                    <div className="item-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewItem(item)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteItems()}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal upload-modal">
            <div className="modal-header">
              <h2>Upload Images</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFiles(null);
                  setUploadProgress({});
                  setUploadName('');
                  setUploadDescription('');
                  setUploadCategory('GYM_FACILITIES');
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setUploadFiles(e.target.files);
                  }}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <ImagePlus size={48} />
                  <h3>Drop images here or click to browse</h3>
                  <p>Supports JPG, PNG, GIF up to 10MB each</p>
                </label>
              </div>

              {uploadFiles && uploadFiles.length > 0 && (
                <div className="upload-preview">
                  <h4>Selected Files ({uploadFiles.length})</h4>
                  <div className="file-list">
                    {Array.from(uploadFiles).map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-info">
                          <ImageIcon size={20} />
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{formatFileSize(file.size)}</span>
                        </div>
                        {uploadProgress[file.name] !== undefined && (
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="upload-form">
                    <div className="form-group">
                      <label htmlFor="upload-name">Image Name</label>
                      <input
                        type="text"
                        id="upload-name"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="Enter a name for these images..."
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="upload-category">Category</label>
                      <select
                        id="upload-category"
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="form-select"
                      >
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <option key={category} value={category}>
                            {category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="upload-description">Description (Optional)</label>
                      <textarea
                        id="upload-description"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="Add a description for these images..."
                        className="form-textarea"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="upload-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles(null);
                    setUploadProgress({});
                    setUploadName('');
                    setUploadDescription('');
                    setUploadCategory('GYM_FACILITIES');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="upload-btn"
                  onClick={() => uploadFiles && handleUpload(uploadFiles)}
                  disabled={!uploadFiles || uploadFiles.length === 0 || !uploadName.trim()}
                >
                  <Upload size={16} />
                  Upload {uploadFiles ? `(${uploadFiles.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedItem && (
        <div className="modal-overlay image-viewer">
          <div className="modal image-modal">
            <div className="modal-header">
              <h2>{selectedItem.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="image-container">
                <img src={selectedItem.imageUrl || selectedItem.fileUrl} alt={selectedItem.name} />
              </div>
              <div className="image-details">
                <h3>{selectedItem.name}</h3>
                <p><strong>Category:</strong> {selectedItem.category}</p>
                <p><strong>Upload Date:</strong> {new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                <p><strong>Size:</strong> {(selectedItem.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                {selectedItem.description && (
                  <p><strong>Description:</strong> {selectedItem.description}</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="download-btn"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedItem.imageUrl || selectedItem.fileUrl;
                  link.download = selectedItem.name;
                  link.click();
                }}
              >
                <Download size={16} />
                Download
              </button>
              <button 
                className="edit-btn"
                onClick={() => handleEditItem(selectedItem)}
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <div className="modal-header">
              <h2>Edit Image</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="edit-form">
                <div className="form-group">
                  <label>Image Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    placeholder="Enter image name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  >
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>

                <div className="image-preview">
                  <img src={editingItem.imageUrl || editingItem.fileUrl} alt={editingItem.name} />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSaveEdit}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
