import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStudent, loginAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChefHat, GraduationCap, Lock, User } from 'lucide-react';
import '../styles/auth.css';

const Login = () => {
    const [role, setRole] = useState('student'); // 'student' | 'admin'
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let user;
            if (role === 'student') {
                user = await loginStudent(email, password);
                login(user);
                navigate('/student');
            } else {
                user = await loginAdmin(username, password);
                login(user);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <div className="auth-header">
                    <div className="flex justify-center">
                        <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px', borderRadius: '50%' }}>
                            <ChefHat size={48} color="var(--primary)" />
                        </div>
                    </div>
                    <h1 className="auth-brand">Canteen Management System</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your dashboard</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${role === 'student' ? 'active' : ''}`}
                        onClick={() => { setRole('student'); setError(''); }}
                    >
                        Student
                    </button>
                    <button
                        className={`auth-tab ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        Canteen
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    {role === 'student' ? (
                        <>
                            <div className="input-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        className="input-with-icon"
                                        placeholder="your.email@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type="password"
                                        className="input-with-icon"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-group">
                                <label>Username</label>
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        className="input-with-icon"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type="password"
                                        className="input-with-icon"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {error && <div style={{ color: 'var(--accent)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                    <button type="submit" disabled={loading} className="auth-btn bg-primary">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div className="auth-footer">
                        New here? <Link to="/register">Create an Account</Link>
                    </div>

                    <div className="demo-credentials">
                        <small style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Demo Accounts</small>
                        <div>Student: <strong>john@university.edu / password123</strong></div>
                        <div>Canteen: <strong>admin / admin123</strong></div>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default Login;
