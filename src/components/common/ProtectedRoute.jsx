import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (role && user.role !== role) {
        // If trying to access admin as student, redirect to student home
        return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
    }

    return children;
};

export default ProtectedRoute;
