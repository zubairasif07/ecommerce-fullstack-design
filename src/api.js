const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getAuthToken = () => localStorage.getItem('auth_token');

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('auth_token', token);
    } else {
        localStorage.removeItem('auth_token');
    }
};

const defaultHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const apiCall = async (endpoint, method = 'GET', body = null) => {
    const options = {
        method,
        headers: defaultHeaders(),
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || 'API Request Failed');
    }

    return data;
};

// API Methods
export const api = {
    login: (email, password) => apiCall('/login', 'POST', { email, password }),
    register: (name, email, password) => apiCall('/register', 'POST', { name, email, password }),
    logout: () => apiCall('/logout', 'POST'),
    getUser: () => apiCall('/user', 'GET'),
    
    getProducts: (category, search, maxPrice) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        if (maxPrice) params.append('max_price', maxPrice);
        return apiCall(`/products?${params.toString()}`);
    },
    
    createOrder: (items, promo_code = null, customer = null, payment_method = 'cod') => apiCall('/orders', 'POST', { items, promo_code, customer, payment_method }),
    getOrders: () => apiCall('/orders', 'GET'),
    
    // Admin Endpoints
    getAdminStats: () => apiCall('/admin/stats', 'GET'),
    getAdminOrders: () => apiCall('/admin/orders', 'GET'),
    updateOrderStatus: (id, status) => apiCall(`/admin/orders/${id}/status`, 'PUT', { status }),
    addAdminProduct: (product) => apiCall('/admin/products', 'POST', product),
    updateAdminProduct: (id, product) => apiCall(`/admin/products/${id}`, 'PUT', product),
    deleteAdminProduct: (id) => apiCall(`/admin/products/${id}`, 'DELETE'),
    
    // Advanced Admin Features
    getAdminUsers: () => apiCall('/admin/users', 'GET'),
    exportAdminOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/export`, {
            method: 'GET',
            headers: defaultHeaders(),
        });
        if (!response.ok) throw new Error('Failed to export orders');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filenameMatch = response.headers.get('Content-Disposition')?.match(/filename="?([^"]+)"?/);
        a.download = filenameMatch ? filenameMatch[1] : `orders_export_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },
    getPromotions: () => apiCall('/admin/promotions', 'GET'),
    createPromotion: (promo) => apiCall('/admin/promotions', 'POST', promo),
    deletePromotion: (id) => apiCall(`/admin/promotions/${id}`, 'DELETE'),
    validatePromoCode: (code) => apiCall('/promotions/validate', 'POST', { code }),

    // Settings
    getSettings: () => apiCall('/settings', 'GET'),
    updateSettings: (settings) => apiCall('/admin/settings', 'POST', { settings }),

    // Categories
    getCategories: () => apiCall('/categories', 'GET'),
    createCategory: (name) => apiCall('/admin/categories', 'POST', { name }),
    updateCategory: (id, name) => apiCall(`/admin/categories/${id}`, 'PUT', { name }),
    deleteCategory: (id) => apiCall(`/admin/categories/${id}`, 'DELETE')
};
