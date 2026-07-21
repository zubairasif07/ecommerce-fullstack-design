// src/types/index.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  products?: Product[];
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  price: number | string;
  stock: number;
  image?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface CartItem {
  id: number;
  user_id?: number;
  product_id: number;
  quantity: number;
  product?: Product;
  created_at?: string;
  updated_at?: string;
}

export interface WishlistItem {
  id: number;
  product: Product;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
