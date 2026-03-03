import { strapiService } from '@/services/strapi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProducts = () => {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => strapiService.getProducts(),
	});
};

export const useMarkAsFavorite = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			productId,
			userId,
		}: {
			productId: number;
			userId: string;
		}) => await strapiService.markAsFavorite(productId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useRemoveFromFavorite = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (documentId: string) =>
			await strapiService.removeFromFavorite(documentId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
	});
};
