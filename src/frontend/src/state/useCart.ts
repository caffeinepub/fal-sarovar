import { useCartStore } from './cartStore';

export function useCart() {
  return useCartStore();
}
