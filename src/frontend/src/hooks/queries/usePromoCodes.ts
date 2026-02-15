import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { PromoCode } from '@/backend';
import { toast } from 'sonner';

export function useGetAllPromoCodes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PromoCode[]>({
    queryKey: ['promoCodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPromoCodes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useValidatePromoCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ code, orderAmount }: { code: string; orderAmount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validatePromoCode(code, orderAmount);
    },
  });
}

export function useCreatePromoCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      code: string;
      discountType: { __kind__: 'flat'; flat: number } | { __kind__: 'percentage'; percentage: number };
      minOrderValue: number;
      expiryDate: bigint | null;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPromoCode(
        data.code,
        data.discountType,
        data.minOrderValue,
        data.expiryDate,
        data.isActive
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      toast.success('Promo code created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create promo code');
    },
  });
}

export function useUpdatePromoCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      code: string;
      discountType: { __kind__: 'flat'; flat: number } | { __kind__: 'percentage'; percentage: number };
      minOrderValue: number;
      expiryDate: bigint | null;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePromoCode(
        data.id,
        data.code,
        data.discountType,
        data.minOrderValue,
        data.expiryDate,
        data.isActive
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      toast.success('Promo code updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update promo code');
    },
  });
}

export function useDeletePromoCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePromoCode(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      toast.success('Promo code deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete promo code');
    },
  });
}
