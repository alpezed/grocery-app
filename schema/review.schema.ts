import { z } from 'zod';

export const reviewSchema = z.object({
	rating: z
		.number()
		.min(1, { message: 'Rating must be at least 1' })
		.max(5, { message: 'Rating must be at most 5' }),
	comment: z.string().min(1, { message: 'Comment is required' }),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
