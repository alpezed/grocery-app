import { z } from 'zod';

export const createOrderItemsBodySchema = z.object({
	productId: z.string(),
	// product: ProductSchema,
	quantity: z.number(),
	priceAtPurchase: z.number(),
});

export const createOrderBodySchema = z.object({
	clerkId: z.string(),
	stripePaymentIntentId: z.string(),
});

export const orderSchema = z.object({
	id: z.number(),
	documentId: z.string(),
	price: z.number(),
	quantity: z.number(),
	stripePaymentIntentId: z.string(),
	timeline: z.record(z.string(), z.string().nullable()),
	orderStatus: z.enum([
		'placed',
		'confirmed',
		'shipped',
		'outForDelivery',
		'delivered',
	]),
	items: z.array(
		createOrderItemsBodySchema.extend({
			id: z.number(),
		})
	),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	publishedAt: z.coerce.date(),
});

export type CreateOrderItemsBody = z.infer<typeof createOrderItemsBodySchema>;
export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
export type Order = z.infer<typeof orderSchema>;
