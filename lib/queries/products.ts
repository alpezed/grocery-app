import { ReviewInput } from '@/schema/review.schema';
import { getProducts } from '@/services/product';
import { strapiService } from '@/services/strapi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProducts = (params?: Record<string, any>) => {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => getProducts(params),
	});
};

export const useMarkAsFavorite = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			productId,
			userId,
		}: {
			productId: string;
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

export const useCreateReview = (productId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (review: ReviewInput) =>
			await strapiService.createReview(review),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['product', productId] });
		},
	});
};

export const useGetFavoriteProducts = () => {
	return useQuery({
		queryKey: ['favorite-products'],
		queryFn: () => strapiService.getFavoriteProducts(),
	});
};
