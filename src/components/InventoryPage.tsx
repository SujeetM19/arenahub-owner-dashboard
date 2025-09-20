import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../services/api';
import './InventoryPage.css';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  location: string;
  description?: string;
  centerId?: number;
  centerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const InventoryPage: React.FC = () => {
  const { theme } = useTheme();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: '',
    quantity: 0,
    minQuantity: 0,
    maxQuantity: 0,
    unit: '',
    costPerUnit: 0,
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0],
    status: 'IN_STOCK',
    location: '',
    description: ''
  });

  const categories = ['All', 'EQUIPMENT', 'SUPPLEMENTS', 'AMENITIES', 'MAINTENANCE', 'SAFETY', 'CLEANING'];
  const statuses = ['All', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'];

  // Load inventory items from API
  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await api.getInventoryItems();
      setInventoryItems(response.content || response);
    } catch (err) {
      setError('Failed to load inventory items');
      console.error('Error loading inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await api.createInventoryItem({
        ...newItem,
        centerId: 1 // Default center ID, should be dynamic
      });
      setInventoryItems(prev => [response, ...prev]);
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: '',
        quantity: 0,
        minQuantity: 0,
        maxQuantity: 0,
        unit: '',
        costPerUnit: 0,
        supplier: '',
        lastRestocked: new Date().toISOString().split('T')[0],
        status: 'IN_STOCK',
        location: '',
        description: ''
      });
    } catch (err) {
      setError('Failed to add inventory item');
      console.error('Error adding inventory item:', err);
    }
  };

  const handleEditItem = async (item: InventoryItem) => {
    try {
      const response = await api.updateInventoryItem(item.id, {
        ...item,
        centerId: 1 // Default center ID, should be dynamic
      });
      setInventoryItems(prev => prev.map(i => i.id === item.id ? response : i));
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory item:', err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await api.deleteInventoryItem(id);
      setInventoryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete inventory item');
      console.error('Error deleting inventory item:', err);
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return '#22c55e';
      case 'LOW_STOCK': return '#f59e0b';
      case 'OUT_OF_STOCK': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return <CheckCircle size={16} />;
      case 'LOW_STOCK': return <AlertTriangle size={16} />;
      case 'OUT_OF_STOCK': return <AlertTriangle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'In Stock';
      case 'LOW_STOCK': return 'Low Stock';
      case 'OUT_OF_STOCK': return 'Out of Stock';
      default: return status;
    }
  };


  const getLowStockItems = () => {
    return inventoryItems.filter(item => item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK');
  };

  const getTotalValue = () => {
    return inventoryItems.reduce((total, item) => total + (item.quantity * item.costPerUnit), 0);
  };

  const getTotalItems = () => {
    return inventoryItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className={`inventory-page ${theme}`}>
      <div className="inventory-header">
        <div className="header-content">
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Track and manage your gym's inventory</p>
        </div>
        <button 
          className="add-item-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading inventory items...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadInventoryItems}>Retry</button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{getTotalItems()}</h3>
            <p>Total Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>${getTotalValue().toFixed(2)}</h3>
            <p>Total Value</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{getLowStockItems().length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{inventoryItems.filter(item => item.status === 'IN_STOCK').length}</h3>
            <p>In Stock Items</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <div className="low-stock-alert">
          <AlertTriangle size={20} />
          <div className="alert-content">
            <h4>Low Stock Alert</h4>
            <p>{getLowStockItems().length} item(s) need restocking</p>
          </div>
        </div>
      )}

      <div className="inventory-controls">
        <div className="search-section">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory..."
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

      <div className="inventory-content">
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Supplier</th>
                <th>Location</th>
                <th>Last Restocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td>
                    <div className="quantity-info">
                      <span className="current-quantity">{item.quantity}</span>
                      <span className="unit">{item.unit}</span>
                      <div className="quantity-range">
                        Min: {item.minQuantity} | Max: {item.maxQuantity}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div 
                      className="status-badge"
                      style={{ color: getStatusColor(item.status) }}
                    >
                      {getStatusIcon(item.status)}
                      <span>{getStatusText(item.status)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="cost">${item.costPerUnit.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="supplier">{item.supplier}</span>
                  </td>
                  <td>
                    <span className="location">{item.location}</span>
                  </td>
                  <td>
                    <span className="date">{item.lastRestocked}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Inventory Item</h2>
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
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Current Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="e.g., kg, pieces, sets"
                  />
                </div>
                <div className="form-group">
                  <label>Min Quantity</label>
                  <input
                    type="number"
                    value={newItem.minQuantity}
                    onChange={(e) => setNewItem({...newItem, minQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Quantity</label>
                  <input
                    type="number"
                    value={newItem.maxQuantity}
                    onChange={(e) => setNewItem({...newItem, maxQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Cost per Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.costPerUnit}
                    onChange={(e) => setNewItem({...newItem, costPerUnit: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    placeholder="Enter storage location"
                  />
                </div>
                <div className="form-group">
                  <label>Last Restocked</label>
                  <input
                    type="date"
                    value={newItem.lastRestocked}
                    onChange={(e) => setNewItem({...newItem, lastRestocked: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Enter item description"
                    rows={3}
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
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Inventory Item</h2>
              <button 
                className="close-btn"
                onClick={() => setEditingItem(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
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
                  <label>Current Quantity</label>
                  <input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Min Quantity</label>
                  <input
                    type="number"
                    value={editingItem.minQuantity}
                    onChange={(e) => setEditingItem({...editingItem, minQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Quantity</label>
                  <input
                    type="number"
                    value={editingItem.maxQuantity}
                    onChange={(e) => setEditingItem({...editingItem, maxQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Cost per Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.costPerUnit}
                    onChange={(e) => setEditingItem({...editingItem, costPerUnit: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    value={editingItem.supplier}
                    onChange={(e) => setEditingItem({...editingItem, supplier: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Restocked</label>
                  <input
                    type="date"
                    value={editingItem.lastRestocked}
                    onChange={(e) => setEditingItem({...editingItem, lastRestocked: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value as any})}
                  >
                    <option value="IN_STOCK">In Stock</option>
                    <option value="LOW_STOCK">Low Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={() => handleEditItem(editingItem)}
              >
                Update Item
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

export default InventoryPage;
