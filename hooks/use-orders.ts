import { type CreateOrderBody } from '@/schema/order.schema';
import { createOrder, getOrders, updateOrder } from '@/services/order';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['create-order'],
		mutationFn: (order: CreateOrderBody[]) => createOrder(order),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: error => {
			console.error(error);
		},
	});
};

export const useUpdateOrder = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['update-order'],
		mutationFn: (order: CreateOrderBody) => updateOrder(orderId, order),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: error => {
			console.error(error);
		},
	});
};

export const useGetOrders = () => {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => getOrders(),
	});
};
