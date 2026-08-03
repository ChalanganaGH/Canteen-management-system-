import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { getMenu, placeOrder, getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Clock, Utensils, AlertCircle } from 'lucide-react';

const StudentHome = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderPlacing, setOrderPlacing] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchOrders, 5000); // Poll for order updates
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const menu = await getMenu();
            setMenuItems(menu);
            await fetchOrders();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const orders = await getOrders({ student_id: user.id });
            // Sort by created_at descending
            const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setMyOrders(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const addToCart = (item) => {
        if (!item.available) {
            alert('This item is currently unavailable');
            return;
        }
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQty = (itemId, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === itemId) {
                return { ...i, qty: Math.max(1, i.qty + delta) };
            }
            return i;
        }));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setOrderPlacing(true);
        try {
            const order = await placeOrder(user.id, cart);
            setCart([]);
            setActiveTab('orders');
            fetchOrders();
            alert(`Order placed successfully! Your queue number is: ${order.queue_number}`);
        } catch (error) {
            alert('Failed to place order: ' + error.message);
        } finally {
            setOrderPlacing(false);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <Navbar title="Student Portal" />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Quick Stats / Queue Status */}
                <div style={styles.queueBanner}>
                    <div style={styles.queueInfo}>
                        <Clock size={24} color="var(--primary)" />
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Average Wait Time</h3>
                            <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>~15 mins</p>
                        </div>
                    </div>
                    <div style={styles.queueInfo}>
                        <Utensils size={24} color="var(--primary)" />
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Active Choice</h3>
                            <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Lunch Menu</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={{ ...styles.tab, borderBottom: activeTab === 'menu' ? '3px solid var(--primary)' : 'none', color: activeTab === 'menu' ? 'var(--primary)' : 'var(--text-muted)' }}
                        onClick={() => setActiveTab('menu')}
                    >
                        Food Menu
                    </button>
                    <button
                        style={{ ...styles.tab, borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : 'none', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)' }}
                        onClick={() => setActiveTab('orders')}
                    >
                        My Orders
                        {myOrders.some(o => o.status !== 'completed' && o.status !== 'cancelled') && <span style={styles.badge} />}
                    </button>
                </div>

                {activeTab === 'menu' ? (
                    <div style={styles.menuLayout}>
                        <div style={styles.menuGrid}>
                            {menuItems.map(item => {
                                const isAvailable = item.available === 1 || item.available === true;
                                return (
                                    <div key={item.id} className="card" style={{
                                        ...styles.menuCard,
                                        opacity: isAvailable ? 1 : 0.6,
                                        position: 'relative'
                                    }}>
                                        {!isAvailable && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#ef4444',
                                                color: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                zIndex: 10,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                Sold Out
                                            </div>
                                        )}
                                        {item.image ? (
                                            <img src={`http://localhost/canteen-management-system/${item.image}`} alt={item.name} style={styles.foodImage} />
                                        ) : (
                                            <div style={{ ...styles.foodImage, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                <Utensils size={48} color="white" />
                                            </div>
                                        )}
                                        <div style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', color: isAvailable ? 'inherit' : '#999' }}>{item.name}</h3>
                                                <span style={{ fontWeight: 'bold', color: isAvailable ? 'var(--primary)' : '#999' }}>Rs. {item.price}</span>
                                            </div>
                                            {item.description && (
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{item.description}</p>
                                            )}
                                            <button
                                                onClick={() => addToCart(item)}
                                                style={{
                                                    ...styles.addButton,
                                                    backgroundColor: isAvailable ? 'var(--primary)' : '#d1d5db',
                                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                    color: isAvailable ? '#fff' : '#6b7280'
                                                }}
                                                disabled={!isAvailable}
                                            >
                                                {isAvailable ? 'Add to Cart' : 'Not Available'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cart Sidebar */}
                        <div className="card" style={styles.cartPanel}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                                <ShoppingCart size={20} />
                                <h3 style={{ fontSize: '1.2rem' }}>Your Cart</h3>
                            </div>

                            {cart.length === 0 ? (
                                <div style={styles.emptyCart}>
                                    <p>Cart is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div style={styles.cartItems}>
                                        {cart.map(item => (
                                            <div key={item.id} style={styles.cartItem}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rs. {item.price} x {item.qty}</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>-</button>
                                                    <span>{item.qty}</span>
                                                    <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                                                    <button onClick={() => removeFromCart(item.id)} style={{ ...styles.qtyBtn, color: 'red', marginLeft: '0.5rem' }}>x</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={styles.cartFooter}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            <span>Total:</span>
                                            <span>Rs. {cartTotal}</span>
                                        </div>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={orderPlacing}
                                            style={styles.checkoutBtn}
                                        >
                                            {orderPlacing ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={styles.ordersList}>
                        {myOrders.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No orders found.</p>
                        ) : (
                            myOrders.map(order => (
                                <div key={order.id} className="card" style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem' }}>Order #{order.queue_number}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleString()}</p>
                                        </div>
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: order.status === 'ready' ? '#d4edda' : order.status === 'preparing' ? '#cfe2ff' : order.status === 'pending' ? '#fff3cd' : order.status === 'completed' ? '#d1e7dd' : '#e2e3e5',
                                            color: order.status === 'ready' ? '#155724' : order.status === 'preparing' ? '#084298' : order.status === 'pending' ? '#856404' : order.status === 'completed' ? '#0a3622' : '#383d41'
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={styles.orderItems}>
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                                <span>{item.item_name || item.name} x{item.quantity}</span>
                                                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                            <span>Total</span>
                                            <span>Rs. {order.total_price}</span>
                                        </div>
                                    </div>
                                    {order.status === 'ready' && (
                                        <div style={styles.readyAlert}>
                                            <AlertCircle size={16} />
                                            Order is Ready for Pickup!
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    queueBanner: {
        display: 'flex',
        gap: '2rem',
        marginBottom: '2rem',
        background: '#fff',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap'
    },
    queueInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
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
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
    },
    menuLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '2rem',
        '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
        }
    },
    menuGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
    },
    menuCard: {
        overflow: 'hidden',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    foodImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
    },

    addButton: {
        width: '100%',
        padding: '0.5rem',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 500,
        marginTop: 'auto',
    },
    cartPanel: {
        height: 'fit-content',
        position: 'sticky',
        top: '100px',
    },
    emptyCart: {
        textAlign: 'center',
        padding: '2rem 0',
        color: 'var(--text-muted)',
    },
    cartItems: {
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '1rem',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '0.5rem',
    },
    qtyBtn: {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: '4px',
    },
    checkoutBtn: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: 'var(--secondary)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 'bold',
    },
    ordersList: {
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto',
    },
    orderCard: {
        padding: '1.5rem',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    statusBadge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
    orderItems: {
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: 'var(--radius-sm)',
    },
    readyAlert: {
        marginTop: '1rem',
        color: '#155724',
        backgroundColor: '#d4edda',
        padding: '0.75rem',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 600,
    }
};

export default StudentHome;
