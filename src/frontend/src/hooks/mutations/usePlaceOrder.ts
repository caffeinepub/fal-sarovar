import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { OrderProduct, Customer } from '@/backend';
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

      let customer: Customer | null = null;
      try {
        customer = await actor.getCustomerByMobile(data.mobile);
      } catch (error: any) {
        if (!error.message?.includes('Unauthorized')) {
          throw error;
        }
      }

      let customerId: bigint;

      if (customer) {
        customerId = customer.id;
      } else {
        customerId = await actor.createCustomer(data.name, data.mobile, data.address);
      }

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
      queryClient.invalidateQueries({ queryKey: ['callerOrderHistory'] });
      queryClient.invalidateQueries({ queryKey: ['newOrderCount'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
}
