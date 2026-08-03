import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session (optional)
        const savedUser = localStorage.getItem('cafeteria_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('cafeteria_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cafeteria_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Application...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
