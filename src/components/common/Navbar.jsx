import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, LogOut, User } from 'lucide-react';

const Navbar = ({ title }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <div style={styles.brand}>
                    <ChefHat color="#fff" size={24} />
                    <span style={styles.title}>{title || 'Canteen Management'}</span>
                </div>

                <div style={styles.userSection}>
                    <div style={styles.userInfo}>
                        <span style={styles.userName}>{user?.name}</span>
                        <span style={styles.userRole}>{user?.role === 'admin' ? 'Canteen' : 'Student'}</span>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'var(--primary)',
        color: '#fff',
        padding: '1rem 0',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: 'bold',
        fontSize: '1.25rem',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        lineHeight: 1.2,
    },
    userName: {
        fontWeight: 600,
        fontSize: '0.9rem',
    },
    userRole: {
        fontSize: '0.75rem',
        opacity: 0.8,
        textTransform: 'capitalize',
    },
    logoutBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: '#fff',
        padding: '0.5rem',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
    },
};

export default Navbar;
