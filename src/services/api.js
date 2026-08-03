import axios from 'axios';

// Base URL for PHP backend (XAMPP)
const API_BASE_URL = 'http://localhost/canteen-management-system/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== AUTH SERVICES ====================

export const loginStudent = async (email, password) => {
    const response = await api.post('/auth.php', {
        action: 'login',
        role: 'student',
        email,
        password
    });
    if (response.data.success) {
        return response.data.user;
    }
    throw new Error(response.data.error || 'Login failed');
};

export const loginAdmin = async (username, password) => {
    const response = await api.post('/auth.php', {
        action: 'login',
        role: 'admin',
        username,
        password
    });
    if (response.data.success) {
        return response.data.user;
    }
    throw new Error(response.data.error || 'Login failed');
};

export const registerStudent = async (studentData) => {
    const response = await api.post('/auth.php', {
        action: 'register',
        role: 'student',
        ...studentData
    });
    if (response.data.success) {
        return response.data.user;
    }
    throw new Error(response.data.error || 'Registration failed');
};

export const registerAdmin = async (adminData) => {
    const response = await api.post('/auth.php', {
        action: 'register',
        role: 'admin',
        ...adminData
    });
    if (response.data.success) {
        return response.data.user;
    }
    throw new Error(response.data.error || 'Registration failed');
};

// ==================== MENU SERVICES ====================

export const getMenu = async () => {
    const response = await api.get('/menu.php');
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch menu');
};

export const addMenuItem = async (itemData) => {
    const response = await api.post('/menu.php', itemData);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to add menu item');
};

export const updateMenuItem = async (id, itemData) => {
    const response = await api.put('/menu.php', { id, ...itemData });
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update menu item');
};

export const deleteMenuItem = async (id) => {
    const response = await api.delete('/menu.php', { data: { id } });
    if (response.data.success) {
        return true;
    }
    throw new Error(response.data.error || 'Failed to delete menu item');
};

// ==================== ORDER SERVICES ====================

export const getOrders = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.student_id) params.append('student_id', filters.student_id);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`/orders.php?${params.toString()}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch orders');
};

export const placeOrder = async (studentId, items) => {
    const response = await api.post('/orders.php', {
        student_id: studentId,
        items: items.map(item => ({
            menu_item_id: item.id || item.menu_item_id,
            quantity: item.quantity || item.qty
        }))
    });
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to place order');
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.put('/orders.php', {
        id: orderId,
        status
    });
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update order status');
};

// ==================== QUEUE SERVICES ====================

export const getQueueStatus = async (studentId = null) => {
    const params = studentId ? `?student_id=${studentId}` : '';
    const response = await api.get(`/queue.php${params}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch queue status');
};

// Export default api instance for custom requests
export default api;
