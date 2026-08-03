import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/StudentHome';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student/*" element={
            <ProtectedRoute role="student">
              <StudentHome />
            </ProtectedRoute>
          } />

          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <AdminHome />
            </ProtectedRoute>
          } />

          {/* Catch all redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
