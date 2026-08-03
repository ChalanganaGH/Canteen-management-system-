import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent, registerAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChefHat, GraduationCap, Mail, User, Lock, Shield } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('student'); // 'student' | 'admin'

    // Form Data States
    const [studentData, setStudentData] = useState({ name: '', regno: '', email: '' });
    const [adminData, setAdminData] = useState({ name: '', username: '', password: '' });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let user;
            if (role === 'student') {
                user = await registerStudent(studentData);
                navigate('/student');
            } else {
                user = await registerAdmin(adminData);
                navigate('/admin');
            }
            login(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logo}>
                        {role === 'student' ? (
                            <ChefHat size={40} color="var(--primary)" />
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <ChefHat size={40} color="var(--primary)" />
                                <Shield size={20} color="var(--secondary)" style={{ position: 'absolute', bottom: -5, right: -10 }} />
                            </div>
                        )}
                    </div>
                    <h1 style={{ color: 'var(--primary)' }}>Register - Canteen System</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {role === 'student' ? 'Create your student account' : 'Create canteen account'}
                    </p>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={{ ...styles.tab, borderBottom: role === 'student' ? '2px solid var(--primary)' : 'none', color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)' }}
                        onClick={() => { setRole('student'); setError(''); }}
                    >
                        Student
                    </button>
                    <button
                        style={{ ...styles.tab, borderBottom: role === 'admin' ? '2px solid var(--primary)' : 'none', color: role === 'admin' ? 'var(--primary)' : 'var(--text-muted)' }}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        Canteen
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {role === 'student' ? (
                        <>
                            <div style={styles.inputGroup}>
                                <label>Full Name</label>
                                <div style={styles.inputWrapper}>
                                    <User size={18} color="var(--text-muted)" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={studentData.name}
                                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label>Registration Number</label>
                                <div style={styles.inputWrapper}>
                                    <GraduationCap size={18} color="var(--text-muted)" />
                                    <input
                                        type="text"
                                        placeholder="ST001"
                                        value={studentData.regno}
                                        onChange={(e) => setStudentData({ ...studentData, regno: e.target.value })}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label>Email Address</label>
                                <div style={styles.inputWrapper}>
                                    <Mail size={18} color="var(--text-muted)" />
                                    <input
                                        type="email"
                                        placeholder="john@uni.edu"
                                        value={studentData.email}
                                        onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={styles.inputGroup}>
                                <label>Full Name</label>
                                <div style={styles.inputWrapper}>
                                    <User size={18} color="var(--text-muted)" />
                                    <input
                                        type="text"
                                        placeholder="Manager Name"
                                        value={adminData.name}
                                        onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label>Username</label>
                                <div style={styles.inputWrapper}>
                                    <User size={18} color="var(--text-muted)" />
                                    <input
                                        type="text"
                                        placeholder="admin_user"
                                        value={adminData.username}
                                        onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label>Password</label>
                                <div style={styles.inputWrapper}>
                                    <Lock size={18} color="var(--text-muted)" />
                                    <input
                                        type="password"
                                        placeholder="Secure password"
                                        value={adminData.password}
                                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" disabled={loading} style={styles.button} className="bg-primary">
                        {loading ? 'Creating Account...' : (role === 'student' ? 'Register Student' : 'Register Admin')}
                    </button>

                    <div style={styles.loginLink}>
                        Already have an account? <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-body)',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logo: {
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center'
    },
    tabs: {
        display: 'flex',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
    },
    tab: {
        flex: 1,
        padding: '0.75rem',
        background: 'none',
        fontSize: '1rem',
        fontWeight: 500,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 0.75rem',
        backgroundColor: '#fff',
    },
    input: {
        border: 'none',
        outline: 'none',
        flex: 1,
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        borderRadius: 'var(--radius-sm)',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
    },
    error: {
        color: 'var(--accent)',
        fontSize: '0.875rem',
        textAlign: 'center',
    },
    loginLink: {
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginTop: '0.5rem',
    }
};

export default Register;
