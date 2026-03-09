"use client";

import { createContext, use, useCallback, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextValue {
  state: {
    items: CartItem[];
    total: number;
  };
  actions: {
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
  };
  meta: {
    isLoading: boolean;
  };
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * CartProvider - Client Component
 * Manages shopping cart state using React 19 patterns
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = useCallback((productId: string) => {
    setIsLoading(true);

    setItems((prev) => {
      const existing = prev.find((item) => item.id === productId);

      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Mock product data - in real app, would fetch from API
      return [
        ...prev,
        {
          id: productId,
          name: `Product ${productId}`,
          price: Math.floor(Math.random() * 300) + 50,
          quantity: 1,
        },
      ];
    });

    setIsLoading(false);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setIsLoading(true);
    setItems((prev) => prev.filter((item) => item.id !== productId));
    setIsLoading(false);
  }, []);

  const clearCart = useCallback(() => {
    setIsLoading(true);
    setItems([]);
    setIsLoading(false);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextValue = {
    state: { items, total },
    actions: { addToCart, removeFromCart, clearCart },
    meta: { isLoading },
  };

  return <CartContext value={value}>{children}</CartContext>;
}

/**
 * useCart hook - uses React 19 use() API
 */
export function useCart() {
  const context = use(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
