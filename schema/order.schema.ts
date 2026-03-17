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
	timelineEvents: z.any(),
	orderStatus: z.enum([
		'placed',
		'confirmed',
		'shipped',
		'out_for_delivery',
		'delivered',
	]),
	items: z.array(createOrderItemsBodySchema),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	publishedAt: z.coerce.date(),
});

export type CreateOrderItemsBody = z.infer<typeof createOrderItemsBodySchema>;
export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
export type Order = z.infer<typeof orderSchema>;
