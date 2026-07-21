import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard({ onNavigate, user, cartCount, searchQuery, onSearchChange, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, revenueHistory: [], categorySales: [] });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ hero_title: '', hero_subtitle: '', hero_image: '' });
  const [loading, setLoading] = useState(true);

  // Form states for adding/editing a product
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', old_price: '', category_id: '', image: '', stock: '' });
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) return;
    loadData(activeTab);
  }, [activeTab, user]);

  const loadData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const data = await api.getAdminStats();
        setStats(data);
        const prodData = await api.getProducts();
        setProducts(prodData);
      } else if (tab === 'orders') {
        const data = await api.getAdminOrders();
        setOrders(data);
      } else if (tab === 'products') {
        const data = await api.getProducts();
        setProducts(data);
      } else if (tab === 'users') {
        const data = await api.getAdminUsers();
        setUsers(data);
      } else if (tab === 'promotions') {
        const data = await api.getPromotions();
        setPromotions(data);
      } else if (tab === 'categories') {
        const data = await api.getCategories();
        setCategories(data);
      } else if (tab === 'settings') {
        const data = await api.getSettings();
        setSettings({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_image: data.hero_image || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!user || !user.is_admin) {
    return (
      <>
        <Navbar onNavigate={onNavigate} cartCount={cartCount} searchQuery={searchQuery} onSearchChange={onSearchChange} user={user} />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center', minHeight: '60vh' }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    );
  }

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      loadData('orders'); // reload
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteAdminProduct(id);
      loadData('products');
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateAdminProduct(editingProduct.id, productForm);
      } else {
        await api.addAdminProduct(productForm);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      loadData('products');
    } catch (e) {
      alert(e.message);
    }
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      old_price: product.old_price || '',
      category_id: product.category_id || '',
      image: product.image,
      stock: product.stock,
    });
    setShowProductForm(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', old_price: '', category_id: categories.length ? categories[0].id : '', image: '', stock: 10 });
    setShowProductForm(true);
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' };

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Bar */}
      <header style={{ background: '#1a1a1a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          ShopSphere Admin
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: '#ccc' }}>Logged in as <strong>{user.name}</strong></span>
          <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#333'} onMouseOut={e => e.target.style.background = 'transparent'}>
            Sign Out
          </button>
        </div>
      </header>
      
      <div style={{ padding: '40px', display: 'flex', gap: '30px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Admin Panel</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('overview')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'overview' ? '#e0f7fa' : 'transparent', color: activeTab === 'overview' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'overview' ? '600' : 'normal' }}
                >
                  Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('products')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'products' ? '#e0f7fa' : 'transparent', color: activeTab === 'products' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'products' ? '600' : 'normal' }}
                >
                  Products Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('orders')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'orders' ? '#e0f7fa' : 'transparent', color: activeTab === 'orders' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'orders' ? '600' : 'normal' }}
                >
                  Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('users')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'users' ? '#e0f7fa' : 'transparent', color: activeTab === 'users' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'users' ? '600' : 'normal' }}
                >
                  Customers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('promotions')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'promotions' ? '#e0f7fa' : 'transparent', color: activeTab === 'promotions' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'promotions' ? '600' : 'normal' }}
                >
                  Promotions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('categories')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'categories' ? '#e0f7fa' : 'transparent', color: activeTab === 'categories' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'categories' ? '600' : 'normal' }}
                >
                  Categories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('settings')}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 15px', background: activeTab === 'settings' ? '#e0f7fa' : 'transparent', color: activeTab === 'settings' ? '#0056b3' : '#4a4a4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: activeTab === 'settings' ? '600' : 'normal' }}
                >
                  Site Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '30px', border: '1px solid #e0e0e0' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div>
                  <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Dashboard Overview</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Total Revenue</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0056b3' }}>${parseFloat(stats.revenue).toFixed(2)}</div>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Total Orders</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.orders}</div>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>Total Users</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.users}</div>
                    </div>
                  </div>

                  {products.filter(p => p.stock < 5).length > 0 && (
                    <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeeba', marginBottom: '30px' }}>
                      <h3 style={{ color: '#856404', margin: '0 0 10px 0' }}>⚠️ Low Stock Alerts</h3>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                        {products.filter(p => p.stock < 5).map(p => (
                          <li key={p.id}><strong>{p.name}</strong> has only {p.stock} left in stock!</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h3 style={{ marginBottom: '20px' }}>Revenue (Last 7 Days)</h3>
                      <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.revenueHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#0056b3" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h3 style={{ marginBottom: '20px' }}>Sales by Category</h3>
                      <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.categorySales} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                              {stats.categorySales?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Products Management</h2>
                    <button className="btn-primary" onClick={openAddForm}>Add New Product</button>
                  </div>

                  {showProductForm ? (
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #eee' }}>
                      <h3 style={{ marginBottom: '15px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <form onSubmit={handleSaveProduct}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                            <input required style={inputStyle} value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                            <select required style={inputStyle} value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: e.target.value})}>
                              <option value="" disabled>Select a category</option>
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Price</label>
                            <input required type="number" step="0.01" style={inputStyle} value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Old Price (Optional)</label>
                            <input type="number" step="0.01" style={inputStyle} value={productForm.old_price} onChange={e => setProductForm({...productForm, old_price: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Stock</label>
                            <input required type="number" style={inputStyle} value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Image URL</label>
                            <input required style={inputStyle} value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                            <textarea style={{ ...inputStyle, height: '100px' }} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn-primary">Save Product</button>
                          <button type="button" onClick={() => setShowProductForm(false)} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Product</th>
                            <th style={{ padding: '12px' }}>Price</th>
                            <th style={{ padding: '12px' }}>Stock</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '12px' }}>#{product.id}</td>
                              <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div>
                                  <div style={{ fontWeight: '500' }}>{product.name}</div>
                                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{product.category?.name}</div>
                                </div>
                              </td>
                              <td style={{ padding: '12px' }}>${parseFloat(product.price).toFixed(2)}</td>
                              <td style={{ padding: '12px' }}>{product.stock}</td>
                              <td style={{ padding: '12px' }}>
                                <button onClick={() => openEditForm(product)} style={{ marginRight: '10px', background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Orders Management</h2>
                    <button className="btn-primary" onClick={() => api.exportAdminOrders()}>Export CSV</button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                          <th style={{ padding: '12px' }}>Order ID</th>
                          <th style={{ padding: '12px' }}>Customer</th>
                          <th style={{ padding: '12px' }}>Date</th>
                          <th style={{ padding: '12px' }}>Total</th>
                          <th style={{ padding: '12px' }}>Status</th>
                          <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                            <td style={{ padding: '12px' }}>#{order.id}</td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: '500' }}>{order.user?.name}</div>
                              <div style={{ fontSize: '12px', color: '#6c757d' }}>{order.user?.email}</div>
                            </td>
                            <td style={{ padding: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>${parseFloat(order.total).toFixed(2)}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ 
                                padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize',
                                background: order.status === 'completed' ? '#d4edda' : order.status === 'pending' ? '#fff3cd' : '#f8d7da',
                                color: order.status === 'completed' ? '#155724' : order.status === 'pending' ? '#856404' : '#721c24'
                              }}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }} onClick={e => e.stopPropagation()}>
                              <select 
                                value={order.status} 
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {selectedOrder && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                      <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>
                        <h2 style={{ marginBottom: '20px', fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Order Details #{selectedOrder.id}</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                          <div>
                            <h4 style={{ color: '#666', marginBottom: '10px' }}>Customer Info</h4>
                            <div style={{ fontWeight: '500' }}>{selectedOrder.shipping_details?.first_name || selectedOrder.user?.name} {selectedOrder.shipping_details?.last_name || ''}</div>
                            <div>{selectedOrder.user?.email}</div>
                            {selectedOrder.shipping_details?.phone && <div>📞 {selectedOrder.shipping_details.phone}</div>}
                          </div>
                          <div>
                            <h4 style={{ color: '#666', marginBottom: '10px' }}>Shipping Address</h4>
                            {selectedOrder.shipping_details ? (
                              <>
                                <div>{selectedOrder.shipping_details.street}</div>
                                <div>{selectedOrder.shipping_details.city}, {selectedOrder.shipping_details.state} {selectedOrder.shipping_details.zip}</div>
                              </>
                            ) : (
                              <div style={{ color: '#999', fontStyle: 'italic' }}>No shipping details provided</div>
                            )}
                          </div>
                        </div>

                        <h4 style={{ color: '#666', marginBottom: '10px' }}>Order Items</h4>
                        <div style={{ border: '1px solid #eee', borderRadius: '4px', padding: '10px', marginBottom: '20px' }}>
                          {selectedOrder.items?.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <img src={item.product?.image} alt={item.product?.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div>
                                  <div style={{ fontWeight: '500' }}>{item.product?.name}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</div>
                                </div>
                              </div>
                              <div style={{ fontWeight: '500' }}>${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '18px' }}>
                          <span>Total Amount</span>
                          <span style={{ color: '#0056b3' }}>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
              {activeTab === 'users' && (
                <div>
                  <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Customers Management</h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                          <th style={{ padding: '12px' }}>User ID</th>
                          <th style={{ padding: '12px' }}>Name</th>
                          <th style={{ padding: '12px' }}>Email</th>
                          <th style={{ padding: '12px' }}>Joined Date</th>
                          <th style={{ padding: '12px' }}>Total Orders</th>
                          <th style={{ padding: '12px' }}>Total Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>#{u.id}</td>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{u.name} {u.is_admin ? <span style={{fontSize: '10px', background: '#0056b3', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px'}}>ADMIN</span> : ''}</td>
                            <td style={{ padding: '12px', color: '#6c757d' }}>{u.email}</td>
                            <td style={{ padding: '12px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '12px' }}>{u.orders_count || 0}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>${parseFloat(u.orders_sum_total || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {activeTab === 'promotions' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Promotions & Discounts</h2>
                    <button className="btn-primary" onClick={() => {
                      const code = prompt('Enter Promo Code (e.g. SUMMER20):');
                      if (!code) return;
                      const pct = prompt('Enter Discount Percentage (e.g. 20):');
                      if (!pct) return;
                      api.createPromotion({ code, discount_percent: parseInt(pct) }).then(() => loadData('promotions')).catch(e => alert(e.message));
                    }}>Create Promo Code</button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                          <th style={{ padding: '12px' }}>Code</th>
                          <th style={{ padding: '12px' }}>Discount</th>
                          <th style={{ padding: '12px' }}>Times Used</th>
                          <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.map(promo => (
                          <tr key={promo.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '18px', color: '#0056b3' }}>{promo.code}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{promo.discount_percent}% OFF</td>
                            <td style={{ padding: '12px' }}>{promo.times_used} {promo.usage_limit ? `/ ${promo.usage_limit}` : ''}</td>
                            <td style={{ padding: '12px' }}>
                              <button onClick={async () => {
                                if (window.confirm('Delete this promotion?')) {
                                  await api.deletePromotion(promo.id);
                                  loadData('promotions');
                                }
                              }} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                        {promotions.length === 0 && <tr><td colSpan="4" style={{padding: '20px', textAlign: 'center'}}>No promotions active.</td></tr>}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {activeTab === 'categories' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Categories Management</h2>
                    <button className="btn-primary" onClick={async () => {
                      const name = prompt('Enter Category Name:');
                      if (!name) return;
                      try {
                        await api.createCategory(name);
                        loadData('categories');
                      } catch (e) {
                        alert(e.message);
                      }
                    }}>Add Category</button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                          <th style={{ padding: '12px' }}>ID</th>
                          <th style={{ padding: '12px' }}>Name</th>
                          <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(cat => (
                          <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>#{cat.id}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{cat.name}</td>
                            <td style={{ padding: '12px' }}>
                              <button onClick={async () => {
                                const newName = prompt('Enter new name:', cat.name);
                                if (!newName || newName === cat.name) return;
                                try {
                                  await api.updateCategory(cat.id, newName);
                                  loadData('categories');
                                } catch (e) {
                                  alert(e.message);
                                }
                              }} style={{ marginRight: '10px', background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer' }}>Edit</button>
                              <button onClick={async () => {
                                if (window.confirm('Delete this category?')) {
                                  try {
                                    await api.deleteCategory(cat.id);
                                    loadData('categories');
                                  } catch (e) {
                                    alert(e.message);
                                  }
                                }
                              }} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                        {categories.length === 0 && <tr><td colSpan="3" style={{padding: '20px', textAlign: 'center'}}>No categories added.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Site Settings</h2>
                  <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', border: '1px solid #eee', maxWidth: '800px' }}>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await api.updateSettings(settings);
                        alert('Settings updated successfully!');
                      } catch (err) {
                        alert(err.message);
                      }
                    }}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Banner Title</label>
                        <input 
                          type="text" 
                          style={inputStyle} 
                          value={settings.hero_title} 
                          onChange={e => setSettings({...settings, hero_title: e.target.value})} 
                          placeholder="e.g. Engineered for Performance"
                        />
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Banner Subtitle</label>
                        <textarea 
                          style={{ ...inputStyle, height: '80px' }} 
                          value={settings.hero_subtitle} 
                          onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} 
                          placeholder="e.g. Discover our latest collection..."
                        />
                      </div>
                      <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Banner Image URL</label>
                        <input 
                          type="text" 
                          style={inputStyle} 
                          value={settings.hero_image} 
                          onChange={e => setSettings({...settings, hero_image: e.target.value})} 
                          placeholder="https://example.com/image.jpg"
                        />
                        {settings.hero_image && (
                          <div style={{ marginTop: '15px' }}>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Image Preview:</p>
                            <img src={settings.hero_image} alt="Hero Preview" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '12px 30px', fontSize: '16px' }}>
                        Save Settings
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
