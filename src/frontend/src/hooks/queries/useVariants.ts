import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { ProductVariant } from '@/backend';
import { toast } from 'sonner';

export function useGetVariantsByProduct(productId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductVariant[]>({
    queryKey: ['variants', productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getVariantsByProduct(productId);
    },
    enabled: !!actor && !actorFetching && productId !== null,
  });
}

export function useGetVariant(variantId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductVariant | null>({
    queryKey: ['variant', variantId?.toString()],
    queryFn: async () => {
      if (!actor || variantId === null) return null;
      return actor.getVariant(variantId);
    },
    enabled: !!actor && !actorFetching && variantId !== null,
  });
}

export function useCreateVariant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: bigint;
      name: string;
      price: number;
      isActive: boolean;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createVariant(
        data.productId,
        data.name,
        data.price,
        data.isActive,
        data.inStock
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['variants', variables.productId.toString()] });
      toast.success('Variant created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create variant');
    },
  });
}

export function useUpdateVariant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      productId: bigint;
      name: string;
      price: number;
      isActive: boolean;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVariant(
        data.id,
        data.productId,
        data.name,
        data.price,
        data.isActive,
        data.inStock
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['variants', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['variant', variables.id.toString()] });
      toast.success('Variant updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update variant');
    },
  });
}

export function useDeleteVariant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; productId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVariant(data.id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['variants', variables.productId.toString()] });
      toast.success('Variant deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete variant');
    },
  });
}
