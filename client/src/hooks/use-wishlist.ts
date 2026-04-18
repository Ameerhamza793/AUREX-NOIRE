import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './use-products';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        const items = get().items;
        if (!items.find((i) => i.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },
      isWishlisted: (productId) => {
        return get().items.some((i) => i.id === productId);
      },
      toggleWishlist: (product) => {
        const already = get().items.some((i) => i.id === product.id);
        if (already) {
          set({ items: get().items.filter((i) => i.id !== product.id) });
          return false;
        } else {
          set({ items: [...get().items, product] });
          return true;
        }
      },
    }),
    { name: 'aurex-wishlist-storage' }
  )
);
