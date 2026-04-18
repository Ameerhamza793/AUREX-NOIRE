import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './use-products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addToCart: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
          });
        } else {
          const newItems = [...items, { ...product, quantity }];
          set({
            items: newItems,
            total: calculateTotal(newItems),
          });
        }
      },
      removeFromCart: (productId) => {
        const newItems = get().items.filter((item) => item.id !== productId);
        set({
          items: newItems,
          total: calculateTotal(newItems),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        const newItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({
          items: newItems,
          total: calculateTotal(newItems),
        });
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'aurex-cart-storage',
    }
  )
);

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
}
