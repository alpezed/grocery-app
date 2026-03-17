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
			orderPlaced: new Date().toISOString(),
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

export async function getOrders(): Promise<StrapiCollectionResponse<Order>> {
	const response = await orders.find({
		populate: ['items'],
		sort: ['createdAt:desc'],
	});

	return response as StrapiCollectionResponse<Order>;
}
