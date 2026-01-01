'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/api';
import { useToast } from '@/components/Toast';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const { showToast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('bibaluxe-wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bibaluxe-wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems((prevItems) => {
      if (prevItems.some((item) => item._id === product._id)) {
        showToast(`${product.name} is already in your wishlist`, 'info');
        return prevItems;
      }
      showToast(`${product.name} added to wishlist`, 'success');
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i._id === productId);
      if (item) {
        showToast(`${item.name} removed from wishlist`, 'info');
      }
      return prevItems.filter((item) => item._id !== productId);
    });
  };

  const clearWishlist = () => {
    setItems([]);
    showToast('Wishlist cleared', 'info');
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item._id === productId);
  };

  const getWishlistCount = () => {
    return items.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

