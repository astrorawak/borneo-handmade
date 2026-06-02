import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  currency: 'IDR' | 'USD';
  language: 'en' | 'id';
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (c: 'IDR' | 'USD') => void;
  setLanguage: (l: 'en' | 'id') => void;
  getTotalIDR: () => number;
  getTotalUSD: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'IDR',
      language: 'en',
      addItem: (product, quantity = 1) => {
        set((s) => {
          const existing = s.items.find((i) => i.product.id === product.id);
          if (existing) {
            return { items: s.items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) };
          }
          return { items: [...s.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeItem(productId); return; }
        set((s) => ({ items: s.items.map((i) => i.product.id === productId ? { ...i, quantity } : i) }));
      },
      clearCart: () => set({ items: [] }),
      setCurrency: (c) => set({ currency: c }),
      setLanguage: (l) => set({ language: l }),
      getTotalIDR: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getTotalUSD: () => get().items.reduce((sum, i) => sum + i.product.priceUSD * i.quantity, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'borneo-handmade-cart' }
  )
);
