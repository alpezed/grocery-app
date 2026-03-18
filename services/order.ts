import { APIResponse } from '@/@types/api';
import { StrapiCollectionResponse } from '@/@types/strapi';
import { strapiApi } from '@/lib/strapi-api';
import {
	Order,
	type CreateOrderBody,
	type CreateOrderItemsBody,
} from '@/schema/order.schema';

const orders = strapiApi.collection('orders');

export async function createOrder(order: CreateOrderItemsBody[]) {
	const response = await orders.create({
		orderStatus: 'placed',
		timeline: {
			placed: new Date().toISOString(),
		},
		items: order,
	});
	return (response as APIResponse<Order>).data;
}

export async function updateOrder(
	id: string,
	input: Partial<CreateOrderBody>
): Promise<Order> {
	const response = await orders.update(id, input);
	return response as Order;
}

export async function getOrders(
	clerkId: string
): Promise<StrapiCollectionResponse<Order>> {
	const response = await orders.find({
		populate: ['items', 'timeline'],
		sort: ['createdAt:desc'],
		filters: {
			clerkId: clerkId,
		},
	});

	return response as StrapiCollectionResponse<Order>;
}

export async function getOrderById(id: string): Promise<APIResponse<Order>> {
	const response = await strapiApi.single('orders').find(id, {
		populate: ['items', 'timeline'],
	});
	return response as APIResponse<Order>;
}
