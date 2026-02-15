import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Order, OrderStatus, Customer } from '@/backend';
import { toast } from 'sonner';

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCallerOrderHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['callerOrderHistory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCallerOrderHistory();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetNewOrderCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['newOrderCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getNewOrderCount();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
}

export function useMarkOrderAsSeen() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markOrderAsSeen(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['newOrderCount'] });
    },
  });
}

export function useGetCustomer(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Customer | null>({
    queryKey: ['customer', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCustomer(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}
