import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/backend';

export interface CartItem {
  product: Product;
  variantId: bigint | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variantId?: bigint, variantName?: string, unitPrice?: number) => void;
  removeItem: (productId: bigint, variantId?: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number, variantId?: bigint) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, variantId, variantName, unitPrice) => {
        const price = unitPrice ?? 0;
        const vId = variantId ?? null;
        const vName = variantName ?? null;
        
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              (item.variantId?.toString() || 'none') === (vId?.toString() || 'none')
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                variantId: vId,
                variantName: vName,
                unitPrice: price,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (productId, variantId) => {
        const vId = variantId ?? null;
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (item.variantId?.toString() || 'none') === (vId?.toString() || 'none')
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        const vId = variantId ?? null;
        if (quantity <= 0) {
          get().removeItem(productId, vId ?? undefined);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            (item.variantId?.toString() || 'none') === (vId?.toString() || 'none')
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
