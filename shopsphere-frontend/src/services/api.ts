const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const jsonHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.data ?? data;
}

export async function fetchProductById(productId: number) {
  const res = await fetch(`${API_BASE}/products/${productId}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}

export async function fetchCategoryProducts(categorySlug: string) {
  if (!categorySlug) {
    return fetchProducts();
  }

  const url = `${API_BASE}/categories/${encodeURIComponent(categorySlug)}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load category products");
  const data = await res.json();
  return data;
}

export async function searchProducts(query: string) {
  const res = await fetch(`${API_BASE}/products/search/${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}

export async function fetchCart(token: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: jsonHeaders(token),
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Failed to load cart");
  return res.json();
}

export async function addToCart(productId: number, quantity: number, token: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function updateCartItem(itemId: number, quantity: number, token: string) {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

export async function removeCartItem(itemId: number, token: string) {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: "DELETE",
    headers: jsonHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  return res.json();
}

export async function userLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Login failed');
  }
  return res.json();
}

export async function userRegister(name: string, email: string, password: string, password_confirmation: string) {
  const res = await fetch(`${API_BASE}/auth/register-customer`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}

export async function clearCart(token: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'DELETE',
    headers: jsonHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return res.json();
}

export async function createOrder(token: string, orderData: { shipping_address: string; billing_address?: string; items: Array<{ product_id: number; quantity: number; price: number }>; }) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const details = await res.json().catch(() => null);
    throw new Error(details?.message || 'Failed to create order');
  }
  return res.json();
}

export async function googleOAuthLogin(googleToken: string, userType: 'user' | 'seller' = 'user') {
  const res = await fetch(`${API_BASE}/auth/google/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ token: googleToken, type: userType }),
  });
  if (!res.ok) throw new Error('Google login failed');
  return res.json();
}

export function getAuthToken() {
  return localStorage.getItem('shopSphereToken') || localStorage.getItem('shopSphereSellerToken') || '';
}

export async function fetchSellerDashboard() {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Please log in to view seller dashboard.');
  }

  const res = await fetch(`${API_BASE}/seller/dashboard`, {
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    let errorMessage = `Failed to fetch seller dashboard (${res.status})`;
    try {
      const errorData = await res.json();
      errorMessage = errorData?.error || errorData?.message || errorMessage;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function fetchSellerStoreInfo() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/seller/store`, {
    headers: jsonHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch store info');
  return res.json();
}

export async function fetchOrderById(orderId: string) {
  const token = getAuthToken();
  if (!token) throw new Error('Please log in to track your order');

  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`, {
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Order not found');
    throw new Error('Failed to fetch order details');
  }
  return res.json();
}

export async function createProduct(formData: FormData, token?: string) {
  const authToken = token || getAuthToken();
  if (!authToken) {
    throw new Error('Please log in to add a product.');
  }

  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    let message = `Failed to create product (${res.status})`;
    try {
      const errorData = await res.json();
      message = errorData?.error || errorData?.message || message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return res.json();
}

export async function fetchSellerProducts() {
  const token = getAuthToken();
  if (!token) throw new Error('Please log in to view your products');

  const res = await fetch(`${API_BASE}/seller/products`, {
    headers: jsonHeaders(token),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch seller products');
  }

  return res.json();
}

// Axios-like API object for easier use
export const api = {
  async post(endpoint: string, data: unknown, token?: string) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return Promise.reject({ response: { status: res.status, data: errorData } });
    }
    return { data: await res.json() };
  },
};

