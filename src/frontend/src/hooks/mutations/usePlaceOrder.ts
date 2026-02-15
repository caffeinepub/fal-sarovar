import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { OrderProduct } from '@/backend';
import { toast } from 'sonner';

interface PlaceOrderData {
  name: string;
  mobile: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  promoCodeId: bigint | null;
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PlaceOrderData) => {
      if (!actor) throw new Error('Actor not available');

      // Check if customer exists by mobile
      let customer = await actor.getCustomerByMobile(data.mobile);
      let customerId: bigint;

      if (customer) {
        customerId = customer.id;
      } else {
        // Create new customer
        customerId = await actor.createCustomer(data.name, data.mobile, data.address);
      }

      // Place the order
      const orderId = await actor.placeOrder(
        customerId,
        data.products,
        data.totalAmount,
        data.promoCodeId
      );

      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['newOrderCount'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
}
