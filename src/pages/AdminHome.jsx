import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { getOrders, updateOrderStatus, getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
// import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, ChefHat, AlertTriangle, Plus } from 'lucide-react';

const AdminHome = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuLoading, setMenuLoading] = useState(false);
    const [menuError, setMenuError] = useState('');
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isSavingMenu, setIsSavingMenu] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [menuForm, setMenuForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        available: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await fetchOrders();
            await fetchMenu();
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        const allOrders = await getOrders();
        const sorted = [...allOrders].sort((a, b) => {
            const bTime = new Date(b.created_at || b.timestamp || 0).getTime();
            const aTime = new Date(a.created_at || a.timestamp || 0).getTime();
            return bTime - aTime;
        });
        setOrders(sorted);
    };

    const fetchMenu = async () => {
        setMenuLoading(true);
        setMenuError('');
        try {
            const menu = await getMenu();
            setMenuItems(menu);
        } catch (error) {
            setMenuError(error.message || 'Failed to load menu');
        } finally {
            setMenuLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const openAddMenuModal = () => {
        setEditingItem(null);
        setMenuForm({ name: '', description: '', price: '', image: '', available: true });
        setImageFile(null);
        setImagePreview(null);
        setMenuError('');
        setIsMenuModalOpen(true);
    };

    const openEditMenuModal = (item) => {
        setEditingItem(item);
        setMenuForm({
            name: item.name || '',
            description: item.description || '',
            price: item.price ?? '',
            image: item.image || '',
            available: item.available === 1 || item.available === true,
        });
        setImageFile(null);
        if (item.image) {
            setImagePreview(`http://localhost/canteen-management-system/${item.image}`);
        } else {
            setImagePreview(null);
        }
        setMenuError('');
        setIsMenuModalOpen(true);
    };

    const closeMenuModal = () => {
        if (isSavingMenu) return;
        setIsMenuModalOpen(false);
    };

    const handleMenuFormChange = (field, value) => {
        setMenuForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setMenuError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMenuError('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setMenuError('');
        }
    };

    const handleSaveMenuItem = async () => {
        if (!menuForm.name.trim()) {
            setMenuError('Item name is required');
            return;
        }
        const priceValue = parseFloat(menuForm.price);
        if (Number.isNaN(priceValue) || priceValue <= 0) {
            setMenuError('Valid price is required');
            return;
        }

        setIsSavingMenu(true);
        setMenuError('');
        try {
            let imagePath = menuForm.image || null;

            // Upload image if a new file was selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadResponse = await fetch('http://localhost/canteen-management-system/api/upload.php', {
                    method: 'POST',
                    body: formData,
                });

                const uploadResult = await uploadResponse.json();
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || 'Failed to upload image');
                }
                imagePath = uploadResult.data.path;
            }

            const payload = {
                name: menuForm.name.trim(),
                description: menuForm.description?.trim() || '',
                price: priceValue,
                image: imagePath,
                available: menuForm.available ? 1 : 0,
            };

            if (editingItem) {
                await updateMenuItem(editingItem.id, payload);
            } else {
                await addMenuItem(payload);
            }
            await fetchMenu();
            setIsMenuModalOpen(false);
        } catch (error) {
            setMenuError(error.message || 'Failed to save menu item');
        } finally {
            setIsSavingMenu(false);
        }
    };

    const handleDeleteMenuItem = async (item) => {
        const confirmed = window.confirm(`Delete "${item.name}"?`);
        if (!confirmed) return;
        try {
            await deleteMenuItem(item.id);
            await fetchMenu();
        } catch (error) {
            alert(error.message || 'Failed to delete menu item');
        }
    };

    const handleToggleAvailability = async (item) => {
        try {
            const newAvailability = item.available === 1 || item.available === true ? 0 : 1;
            await updateMenuItem(item.id, { available: newAvailability });
            await fetchMenu();
        } catch (error) {
            alert(error.message || 'Failed to update availability');
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <Navbar title="Admin Dashboard" />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Stats Row */}
                <div style={styles.statsRow}>
                    <div className="card" style={styles.statCard}>
                        <h3>Pending</h3>
                        <p style={{ ...styles.statValue, color: '#e67e22' }}>{pendingOrders.length}</p>
                    </div>
                    <div className="card" style={styles.statCard}>
                        <h3>Preparing</h3>
                        <p style={{ ...styles.statValue, color: '#3498db' }}>{preparingOrders.length}</p>
                    </div>
                    <div className="card" style={styles.statCard}>
                        <h3>Ready</h3>
                        <p style={{ ...styles.statValue, color: '#2ecc71' }}>{readyOrders.length}</p>
                    </div>
                    <div className="card" style={styles.statCard}>
                        <h3>Total Orders</h3>
                        <p style={styles.statValue}>{orders.length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={{ ...styles.tab, borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : 'none', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)' }}
                        onClick={() => setActiveTab('orders')}
                    >
                        Order Management
                    </button>
                    <button
                        style={{ ...styles.tab, borderBottom: activeTab === 'menu' ? '3px solid var(--primary)' : 'none', color: activeTab === 'menu' ? 'var(--primary)' : 'var(--text-muted)' }}
                        onClick={() => setActiveTab('menu')}
                    >
                        Menu Management
                    </button>
                </div>

                {activeTab === 'orders' ? (
                    <div style={styles.kanbanBoard}>
                        {/* Pending Column */}
                        <div style={styles.kanbanColumn}>
                            <h3 style={styles.columnHeader}>Pending <Clock size={16} /></h3>
                            {pendingOrders.map(order => (
                                <OrderCard key={order.id} order={order} onAction={() => handleStatusUpdate(order.id, 'preparing')} actionLabel="Accept & Cook" />
                            ))}
                        </div>

                        {/* Preparing Column */}
                        <div style={styles.kanbanColumn}>
                            <h3 style={styles.columnHeader}>Preparing <ChefHat size={16} /></h3>
                            {preparingOrders.map(order => (
                                <OrderCard key={order.id} order={order} onAction={() => handleStatusUpdate(order.id, 'ready')} actionLabel="Mark Ready" />
                            ))}
                        </div>

                        {/* Ready Column */}
                        <div style={styles.kanbanColumn}>
                            <h3 style={styles.columnHeader}>Ready for Pickup <CheckCircle size={16} /></h3>
                            {readyOrders.map(order => (
                                <OrderCard key={order.id} order={order} onAction={() => handleStatusUpdate(order.id, 'completed')} actionLabel="Completed" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--text-muted)' }}>
                                {menuLoading ? 'Loading menu...' : `${menuItems.length} items`}
                            </div>
                            <button style={styles.addBtn} onClick={openAddMenuModal}><Plus size={16} /> Add New Item</button>
                        </div>
                        {menuError && (
                            <div className="card" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', color: '#c0392b' }}>
                                {menuError}
                            </div>
                        )}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem' }}>Image</th>
                                        <th style={{ padding: '1rem' }}>Item Name</th>
                                        <th style={{ padding: '1rem' }}>Description</th>
                                        <th style={{ padding: '1rem' }}>Price</th>
                                        <th style={{ padding: '1rem' }}>Available</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem' }}>
                                                {item.image ? (
                                                    <img src={`http://localhost/canteen-management-system/${item.image}`} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                                ) : (
                                                    <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>📷</div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>{item.name}</td>
                                            <td style={{ padding: '1rem' }}>{item.description || '-'}</td>
                                            <td style={{ padding: '1rem' }}>Rs. {item.price}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleToggleAvailability(item)}
                                                    style={{
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        border: 'none',
                                                        background: item.available ? '#10b981' : '#ef4444',
                                                        color: 'white',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                                                >
                                                    {item.available ? '✓ Available' : '✕ Unavailable'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button style={{ color: 'blue', marginRight: '1rem' }} onClick={() => openEditMenuModal(item)}>Edit</button>
                                                <button style={{ color: 'red' }} onClick={() => handleDeleteMenuItem(item)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {menuItems.length === 0 && !menuLoading && (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                No menu items found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {isMenuModalOpen && (
                            <div style={styles.modalOverlay}>
                                <div className="card" style={styles.modalCard}>
                                    <h3 style={{ marginBottom: '1rem' }}>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>Item Name</label>
                                        <input
                                            style={styles.formInput}
                                            value={menuForm.name}
                                            onChange={(e) => handleMenuFormChange('name', e.target.value)}
                                            placeholder="e.g., Chicken Rice"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>Description</label>
                                        <textarea
                                            style={{ ...styles.formInput, minHeight: '80px' }}
                                            value={menuForm.description}
                                            onChange={(e) => handleMenuFormChange('description', e.target.value)}
                                            placeholder="Short description"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>Price (Rs.)</label>
                                        <input
                                            style={styles.formInput}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={menuForm.price}
                                            onChange={(e) => handleMenuFormChange('price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>Food Image (Optional)</label>
                                        <input
                                            style={styles.formInput}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={handleImageChange}
                                        />
                                        <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Max 5MB • JPG, PNG, GIF, or WebP</small>
                                        {imagePreview && (
                                            <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-color)' }}
                                                />
                                                <button
                                                    type="button"
                                                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#c0392b' }}
                                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={menuForm.available}
                                            onChange={(e) => handleMenuFormChange('available', e.target.checked)}
                                        />
                                        <span>Available</span>
                                    </div>
                                    {menuError && <div style={{ color: '#c0392b', marginBottom: '0.75rem' }}>{menuError}</div>}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                        <button style={styles.secondaryBtn} onClick={closeMenuModal} disabled={isSavingMenu}>Cancel</button>
                                        <button style={styles.primaryBtn} onClick={handleSaveMenuItem} disabled={isSavingMenu}>
                                            {isSavingMenu ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderCard = ({ order, onAction, actionLabel }) => (
    <div className="card" style={styles.orderCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>#{order.queue_number}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {(() => {
                    const created = new Date(order.created_at || order.timestamp || 0).getTime();
                    if (!created) return 'just now';
                    const diff = Math.max(0, Date.now() - created);
                    return `${Math.floor(diff / 60000)}m ago`;
                })()}
            </span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
            {order.items.map((item, i) => (
                <div key={i} style={{ fontSize: '0.9rem' }}>
                    {item.quantity ?? item.qty}x {item.item_name ?? item.name}
                </div>
            ))}
        </div>
        <button onClick={onAction} style={styles.actionBtn}>
            {actionLabel}
        </button>
    </div>
);

const styles = {
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    statCard: {
        padding: '1.5rem',
        textAlign: 'center',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginTop: '0.5rem',
    },
    tabs: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
    },
    tab: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: 600,
        background: 'none',
    },
    kanbanBoard: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    kanbanColumn: {
        background: '#f1f3f5',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        minHeight: '500px',
    },
    columnHeader: {
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    orderCard: {
        marginBottom: '1rem',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    actionBtn: {
        width: '100%',
        padding: '0.5rem',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.9rem',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--secondary)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
    },
    modalCard: {
        width: '100%',
        maxWidth: '520px',
        padding: '1.5rem',
    },
    formGroup: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
    },
    formLabel: {
        fontWeight: 600,
        fontSize: '0.9rem',
    },
    formInput: {
        padding: '0.6rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        fontSize: '0.95rem',
    },
    primaryBtn: {
        padding: '0.6rem 1.25rem',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
    },
    secondaryBtn: {
        padding: '0.6rem 1.25rem',
        backgroundColor: '#e9ecef',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
    }
};

export default AdminHome;
