import { z } from 'zod';

export const reviewSchema = z.object({
	rating: z
		.number()
		.min(1, { message: 'Rating must be at least 1' })
		.max(5, { message: 'Rating must be at most 5' }),
	review: z.string().min(1, { message: 'Review is required' }),
});

export const reviewInputSchema = reviewSchema.extend({
	product: z.string().min(1, { message: 'Product is required' }),
	clerkId: z.string().min(1, { message: 'User is required' }),
});

export const reviewResponseSchema = z.object({
	id: z.string(),
	documentId: z.string(),
	rating: z.number(),
	review: z.string(),
	clerkId: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
