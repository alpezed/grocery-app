import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Order, type CreateOrderBody } from '@/schema/order.schema';
import { getOrderById, getOrders, updateOrder } from '@/services/order';

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
	const { user } = useUser();
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => getOrders(user?.id!),
		enabled: !!user?.id,
	});
};

export const useGetOrderById = (orderId: string) => {
	return useQuery({
		queryKey: ['order', orderId],
		queryFn: () => getOrderById(orderId),
		enabled: !!orderId,
		refetchInterval: query => {
			const order = query.state.data?.data as Order;
			if (!order) return false;
			if (order.orderStatus === 'delivered') return false;
			return 1000;
		},
		// Keep showing old data while fetching new data to prevent flickering
		placeholderData: previousData => previousData,
	});
};
