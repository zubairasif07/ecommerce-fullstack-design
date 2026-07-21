// src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import type { CartItem, Product } from '../types';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from '../services/api';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('shopSphereToken') || localStorage.getItem('shopSphereSellerToken') || ''
    : '';

  useEffect(() => {
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadCart = async () => {
      setLoading(true);
      try {
        const data = await fetchCart(token);
        if (mounted) {
          setCart(data.items ?? []);
        }
      } catch {
        if (mounted) {
          setCart([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, [token]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!token) {
      throw new Error('Please log in to add items to your cart.');
    }

    const cartItem = await apiAddToCart(product.id, quantity, token);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItem.id || item.product_id === cartItem.product_id);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItem.id || item.product_id === cartItem.product_id ? cartItem : item
        );
      }
      return [...prev, cartItem];
    });

    return cartItem;
  };

  const removeFromCart = async (productId: number) => {
    if (!token) {
      setCart((prev) => prev.filter((item) => item.product_id !== productId));
      return;
    }

    const item = cart.find((itm) => itm.product_id === productId);
    if (!item) return;

    await apiRemoveCartItem(item.id, token);
    setCart((prev) => prev.filter((cartItem) => cartItem.product_id !== productId));
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const item = cart.find((itm) => itm.product_id === productId);
    if (!item) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!token) {
      return;
    }

    const updatedItem = await apiUpdateCartItem(item.id, quantity, token);
    setCart((prev) => prev.map((cartItem) =>
      cartItem.id === updatedItem.id ? updatedItem : cartItem
    ));
  };

  const clearCart = async () => {
    if (token) {
      await apiClearCart(token);
    }
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = typeof item.product?.price === 'string'
        ? parseFloat(item.product.price)
        : item.product?.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
}
