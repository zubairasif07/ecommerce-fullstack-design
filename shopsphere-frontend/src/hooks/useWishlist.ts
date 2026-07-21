// src/hooks/useWishlist.ts
import { useState, useEffect } from 'react';
import type { Product } from '../types';

const WISHLIST_KEY = 'shopsphere_wishlist';

function loadSavedWishlist(): Product[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(WISHLIST_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as Product[];
  } catch (e) {
    console.error('Failed to parse wishlist:', e);
    return [];
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>(() => loadSavedWishlist());

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
}
