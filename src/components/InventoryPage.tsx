import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import './InventoryPage.css';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  cost: number;
  supplier: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  location: string;
  description?: string;
}

const InventoryPage: React.FC = () => {
  const { theme } = useTheme();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Protein Powder',
      category: 'Supplements',
      quantity: 25,
      minQuantity: 10,
      maxQuantity: 50,
      unit: 'kg',
      cost: 45.99,
      supplier: 'Nutrition Plus',
      lastRestocked: '2024-01-15',
      status: 'In Stock',
      location: 'Storage Room A',
      description: 'Whey protein isolate'
    },
    {
      id: '2',
      name: 'Towel Set',
      category: 'Amenities',
      quantity: 3,
      minQuantity: 20,
      maxQuantity: 100,
      unit: 'sets',
      cost: 12.50,
      supplier: 'Clean Supplies Co',
      lastRestocked: '2024-01-10',
      status: 'Low Stock',
      location: 'Locker Room',
      description: 'White cotton towels'
    },
    {
      id: '3',
      name: 'Dumbbells 20kg',
      category: 'Equipment',
      quantity: 0,
      minQuantity: 4,
      maxQuantity: 8,
      unit: 'pairs',
      cost: 89.99,
      supplier: 'Fitness Equipment Ltd',
      lastRestocked: '2024-01-05',
      status: 'Out of Stock',
      location: 'Weight Room',
      description: 'Rubber coated dumbbells'
    },
    {
      id: '4',
      name: 'Cleaning Spray',
      category: 'Maintenance',
      quantity: 15,
      minQuantity: 5,
      maxQuantity: 30,
      unit: 'bottles',
      cost: 8.99,
      supplier: 'Clean Supplies Co',
      lastRestocked: '2024-01-12',
      status: 'In Stock',
      location: 'Storage Room B',
      description: 'Antibacterial cleaning spray'
    },
    {
      id: '5',
      name: 'Water Bottles',
      category: 'Amenities',
      quantity: 8,
      minQuantity: 15,
      maxQuantity: 50,
      unit: 'pieces',
      cost: 3.99,
      supplier: 'Hydration Solutions',
      lastRestocked: '2024-01-08',
      status: 'Low Stock',
      location: 'Reception',
      description: 'Reusable water bottles'
    }
  ]);

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
    cost: 0,
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0],
    status: 'In Stock',
    location: '',
    description: ''
  });

  const categories = ['All', 'Equipment', 'Supplements', 'Amenities', 'Maintenance', 'Safety'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

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
      case 'In Stock': return '#22c55e';
      case 'Low Stock': return '#f59e0b';
      case 'Out of Stock': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock': return <CheckCircle size={16} />;
      case 'Low Stock': return <AlertTriangle size={16} />;
      case 'Out of Stock': return <AlertTriangle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const handleAddItem = () => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString()
    };
    setInventoryItems([...inventoryItems, item]);
    setNewItem({
      name: '',
      category: '',
      quantity: 0,
      minQuantity: 0,
      maxQuantity: 0,
      unit: '',
      cost: 0,
      supplier: '',
      lastRestocked: new Date().toISOString().split('T')[0],
      status: 'In Stock',
      location: '',
      description: ''
    });
    setShowAddModal(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setInventoryItems(inventoryItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventoryItems(inventoryItems.filter(item => item.id !== id));
    }
  };

  const getLowStockItems = () => {
    return inventoryItems.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock');
  };

  const getTotalValue = () => {
    return inventoryItems.reduce((total, item) => total + (item.quantity * item.cost), 0);
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
            <h3>{inventoryItems.filter(item => item.status === 'In Stock').length}</h3>
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
                      <span>{item.status}</span>
                    </div>
                  </td>
                  <td>
                    <span className="cost">${item.cost.toFixed(2)}</span>
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
                    value={newItem.cost}
                    onChange={(e) => setNewItem({...newItem, cost: parseFloat(e.target.value) || 0})}
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
                    value={editingItem.cost}
                    onChange={(e) => setEditingItem({...editingItem, cost: parseFloat(e.target.value) || 0})}
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
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
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
                onClick={handleUpdateItem}
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
