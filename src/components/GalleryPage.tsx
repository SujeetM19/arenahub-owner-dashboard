import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Upload, Image as ImageIcon, Trash2, Edit, Eye, Download, Search, Filter } from 'lucide-react';
import './GalleryPage.css';

interface GalleryItem {
  id: string;
  name: string;
  url: string;
  category: string;
  uploadDate: string;
  size: string;
  description?: string;
}

const GalleryPage: React.FC = () => {
  const { theme } = useTheme();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      name: 'Gym Entrance',
      url: '/api/placeholder/400/300',
      category: 'Facility',
      uploadDate: '2024-01-15',
      size: '2.3 MB',
      description: 'Main entrance of the gym'
    },
    {
      id: '2',
      name: 'Weight Room',
      url: '/api/placeholder/400/300',
      category: 'Equipment',
      uploadDate: '2024-01-14',
      size: '1.8 MB',
      description: 'Main weight training area'
    },
    {
      id: '3',
      name: 'Cardio Section',
      url: '/api/placeholder/400/300',
      category: 'Equipment',
      uploadDate: '2024-01-13',
      size: '2.1 MB',
      description: 'Cardio equipment area'
    },
    {
      id: '4',
      name: 'Group Class',
      url: '/api/placeholder/400/300',
      category: 'Classes',
      uploadDate: '2024-01-12',
      size: '3.2 MB',
      description: 'Yoga class in progress'
    },
    {
      id: '5',
      name: 'Locker Room',
      url: '/api/placeholder/400/300',
      category: 'Facility',
      uploadDate: '2024-01-11',
      size: '1.9 MB',
      description: 'Clean and modern locker room'
    },
    {
      id: '6',
      name: 'Personal Training',
      url: '/api/placeholder/400/300',
      category: 'Services',
      uploadDate: '2024-01-10',
      size: '2.5 MB',
      description: 'One-on-one training session'
    }
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Facility', 'Equipment', 'Classes', 'Services', 'Events'];

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectItem = (itemId: string) => {
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

  const handleDeleteItems = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      setGalleryItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const handleUpload = (files: FileList) => {
    // Simulate file upload
    Array.from(files).forEach((file, index) => {
      const newItem: GalleryItem = {
        id: Date.now().toString() + index,
        name: file.name.split('.')[0],
        url: URL.createObjectURL(file),
        category: 'Facility',
        uploadDate: new Date().toISOString().split('T')[0],
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        description: ''
      };
      setGalleryItems(prev => [newItem, ...prev]);
    });
    setShowUploadModal(false);
  };

  const handleViewItem = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const handleEditItem = (item: GalleryItem) => {
    // Implement edit functionality
    console.log('Edit item:', item);
  };

  return (
    <div className={`gallery-page ${theme}`}>
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
        {filteredItems.length === 0 ? (
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
                      <img src={item.url} alt={item.name} />
                      <div className="image-overlay">
                        <button className="view-btn">
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <p className="item-date">{item.uploadDate}</p>
                    </div>
                    <div className="item-actions">
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
                      <img src={item.url} alt={item.name} />
                    </div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-category">{item.category}</div>
                    <div className="item-date">{item.uploadDate}</div>
                    <div className="item-size">{item.size}</div>
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
          <div className="modal">
            <div className="modal-header">
              <h2>Upload Images</h2>
              <button 
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <Upload size={48} />
                  <h3>Drop images here or click to browse</h3>
                  <p>Supports JPG, PNG, GIF up to 10MB each</p>
                </label>
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
                <img src={selectedItem.url} alt={selectedItem.name} />
              </div>
              <div className="image-details">
                <h3>{selectedItem.name}</h3>
                <p><strong>Category:</strong> {selectedItem.category}</p>
                <p><strong>Upload Date:</strong> {selectedItem.uploadDate}</p>
                <p><strong>Size:</strong> {selectedItem.size}</p>
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
                  link.href = selectedItem.url;
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
    </div>
  );
};

export default GalleryPage;
