import { mockCategories, mockProducts, mockPromotions, mockSettings, mockUsers } from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';

export const getAuthToken = () => localStorage.getItem('auth_token');

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('auth_token', token);
    } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('mock_current_user');
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

const normalizeProduct = (product) => ({
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    oldPrice: product.old_price ?? product.oldPrice ?? null,
    details: product.details ?? product.description ?? '',
    tags: product.tags ?? [],
    category: typeof product.category === 'object' ? product.category : { name: product.category },
});

const getStoredMockData = (key, fallback) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
};

const setStoredMockData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getMockUsers = () => getStoredMockData('mock_users', mockUsers);
const getMockOrders = () => getStoredMockData('mock_orders', []);
const getMockPromotions = () => getStoredMockData('mock_promotions', mockPromotions);
const getMockSettings = () => getStoredMockData('mock_settings', mockSettings);
const getMockProducts = () => getStoredMockData('mock_products', mockProducts);
const getMockCategories = () => getStoredMockData('mock_categories', mockCategories);

const saveMockUsers = (users) => setStoredMockData('mock_users', users);
const saveMockOrders = (orders) => setStoredMockData('mock_orders', orders);
const saveMockPromotions = (promotions) => setStoredMockData('mock_promotions', promotions);
const saveMockSettings = (settings) => setStoredMockData('mock_settings', settings);
const saveMockProducts = (products) => setStoredMockData('mock_products', products);
const saveMockCategories = (categories) => setStoredMockData('mock_categories', categories);

const getMockCurrentUser = () => {
    const user = getStoredMockData('mock_current_user', null);
    return user;
};

const setMockCurrentUser = (user) => {
    if (user) {
        localStorage.setItem('mock_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('mock_current_user');
    }
};

const createMockToken = () => `mock-token-${Math.random().toString(36).slice(2)}`;

const findUserByEmail = (email) => getMockUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());

const mockApi = {
    login: async (email, password) => {
        const user = findUserByEmail(email);
        if (!user || user.password !== password) {
            throw new Error('The provided credentials are incorrect.');
        }
        const token = createMockToken();
        setAuthToken(token);
        setMockCurrentUser(user);
        return { user, token };
    },
    register: async (name, email, password) => {
        if (findUserByEmail(email)) {
            throw new Error('A user with this email already exists.');
        }
        const users = getMockUsers();
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            is_admin: false,
        };
        const updatedUsers = [...users, newUser];
        saveMockUsers(updatedUsers);
        const token = createMockToken();
        setAuthToken(token);
        setMockCurrentUser(newUser);
        return { user: newUser, token };
    },
    logout: async () => {
        setAuthToken(null);
        setMockCurrentUser(null);
        return { message: 'Logged out' };
    },
    getUser: async () => {
        const user = getMockCurrentUser();
        if (!user) {
            throw new Error('Not authenticated');
        }
        return user;
    },
    getProducts: async (category, search, maxPrice) => {
        const products = getMockProducts().map(normalizeProduct);
        return products.filter((product) => {
            const matchesCategory = !category || category === 'All' || product.category.name === category;
            const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
            const matchesPrice = !maxPrice || product.price <= parseFloat(maxPrice);
            return matchesCategory && matchesSearch && matchesPrice;
        });
    },
    createOrder: async (items, promo_code = null, customer = null, payment_method = 'cod') => {
        if (!customer || !customer.first_name || !customer.last_name) {
            throw new Error('Customer details are required.');
        }
        const currentUser = getMockCurrentUser();
        if (!currentUser) {
            throw new Error('Please sign in to place an order.');
        }
        const products = getMockProducts();
        const orderItems = items.map((item) => {
            const product = products.find((productItem) => productItem.id === item.product_id || productItem.id === item.id);
            if (!product) throw new Error(`Product ${item.product_id} not found.`);
            return {
                product_id: product.id,
                quantity: item.quantity,
                price: product.price,
                product,
            };
        });
        const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const promo = promo_code ? getMockPromotions().find((p) => p.code.toUpperCase() === promo_code.toUpperCase()) : null;
        const discount = promo ? subtotal * (promo.discount_percent / 100) : 0;
        const shipping = orderItems.length > 0 ? 9.99 : 0;
        const tax = (subtotal - discount) * 0.08;
        const total = Math.max(0, subtotal - discount + shipping + tax);
        const orders = getMockOrders();
        const newOrder = {
            id: orders.length + 1,
            user_id: currentUser.id,
            total,
            status: 'pending',
            shipping_details: customer,
            payment_method,
            items: orderItems,
            created_at: new Date().toISOString(),
        };
        saveMockOrders([...orders, newOrder]);
        return newOrder;
    },
    getOrders: async () => {
        const currentUser = getMockCurrentUser();
        if (!currentUser) {
            throw new Error('Please sign in to view your orders.');
        }
        return getMockOrders().filter((order) => order.user_id === currentUser.id);
    },
    getAdminStats: async () => {
        const orders = getMockOrders();
        const products = getMockProducts();
        const users = getMockUsers();
        return {
            total_orders: orders.length,
            total_users: users.length,
            total_products: products.length,
            total_revenue: orders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
        };
    },
    getAdminOrders: async () => getMockOrders(),
    updateOrderStatus: async (id, status) => {
        const orders = getMockOrders();
        const updated = orders.map((order) => order.id === id ? { ...order, status } : order);
        saveMockOrders(updated);
        return updated.find((order) => order.id === id);
    },
    addAdminProduct: async (product) => {
        const products = getMockProducts();
        const newProduct = {
            ...product,
            id: products.length + 1,
            category: { name: product.category || mockCategories[0].name },
            rating: 4.5,
            reviews: 0,
            stock: product.stock || 10,
            tags: product.tags || [],
            image: product.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        };
        saveMockProducts([...products, newProduct]);
        return newProduct;
    },
    updateAdminProduct: async (id, product) => {
        const products = getMockProducts();
        const updated = products.map((item) => item.id === id ? { ...item, ...product, category: product.category ?? item.category } : item);
        saveMockProducts(updated);
        return updated.find((item) => item.id === id);
    },
    deleteAdminProduct: async (id) => {
        const products = getMockProducts();
        const filtered = products.filter((product) => product.id !== id);
        saveMockProducts(filtered);
        return { message: 'Product deleted' };
    },
    getAdminUsers: async () => getMockUsers(),
    exportAdminOrders: async () => {
        const orders = getMockOrders();
        const headers = ['Order ID', 'User ID', 'Status', 'Total', 'Created At'];
        const rows = orders.map((order) => [order.id, order.user_id, order.status, order.total.toFixed(2), order.created_at]);
        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_export_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return { message: 'CSV downloaded' };
    },
    getPromotions: async () => getMockPromotions(),
    createPromotion: async (promo) => {
        const promotions = getMockPromotions();
        const newPromo = { id: promotions.length + 1, usage_limit: null, times_used: 0, valid_until: null, ...promo };
        saveMockPromotions([...promotions, newPromo]);
        return newPromo;
    },
    deletePromotion: async (id) => {
        const promotions = getMockPromotions();
        const filtered = promotions.filter((promo) => promo.id !== id);
        saveMockPromotions(filtered);
        return { message: 'Promotion deleted' };
    },
    validatePromoCode: async (code) => {
        const promo = getMockPromotions().find((p) => p.code.toUpperCase() === (code || '').toUpperCase());
        if (!promo) {
            throw new Error('Promo code is invalid or expired.');
        }
        return promo;
    },
    getSettings: async () => getMockSettings(),
    updateSettings: async (settings) => {
        const current = getMockSettings();
        const updated = { ...current, ...settings };
        saveMockSettings(updated);
        return updated;
    },
    getCategories: async () => getMockCategories(),
    createCategory: async (name) => {
        const categories = getMockCategories();
        const newCategory = { id: categories.length + 1, name };
        saveMockCategories([...categories, newCategory]);
        return newCategory;
    },
    updateCategory: async (id, name) => {
        const categories = getMockCategories();
        const updated = categories.map((cat) => cat.id === id ? { ...cat, name } : cat);
        saveMockCategories(updated);
        return updated.find((cat) => cat.id === id);
    },
    deleteCategory: async (id) => {
        const categories = getMockCategories();
        const filtered = categories.filter((cat) => cat.id !== id);
        saveMockCategories(filtered);
        return { message: 'Category deleted' };
    }
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

const remoteApi = {
    login: (email, password) => apiCall('/login', 'POST', { email, password }),
    register: (name, email, password) => apiCall('/register', 'POST', { name, email, password }),
    logout: () => apiCall('/logout', 'POST'),
    getUser: () => apiCall('/user', 'GET'),
    getProducts: (category, search, maxPrice) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        if (maxPrice) params.append('max_price', maxPrice);
        return apiCall(`/products?${params.toString()}`).then((data) => data.map(normalizeProduct));
    },
    createOrder: (items, promo_code = null, customer = null, payment_method = 'cod') => apiCall('/orders', 'POST', { items, promo_code, customer, payment_method }),
    getOrders: () => apiCall('/orders', 'GET'),
    getAdminStats: () => apiCall('/admin/stats', 'GET'),
    getAdminOrders: () => apiCall('/admin/orders', 'GET'),
    updateOrderStatus: (id, status) => apiCall(`/admin/orders/${id}/status`, 'PUT', { status }),
    addAdminProduct: (product) => apiCall('/admin/products', 'POST', product),
    updateAdminProduct: (id, product) => apiCall(`/admin/products/${id}`, 'PUT', product),
    deleteAdminProduct: (id) => apiCall(`/admin/products/${id}`, 'DELETE'),
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
    getSettings: () => apiCall('/settings', 'GET'),
    updateSettings: (settings) => apiCall('/admin/settings', 'POST', { settings }),
    getCategories: () => apiCall('/categories', 'GET'),
    createCategory: (name) => apiCall('/admin/categories', 'POST', { name }),
    updateCategory: (id, name) => apiCall(`/admin/categories/${id}`, 'PUT', { name }),
    deleteCategory: (id) => apiCall(`/admin/categories/${id}`, 'DELETE')
};

export const api = USE_MOCK_API ? mockApi : remoteApi;
