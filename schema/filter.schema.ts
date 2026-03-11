import { z } from 'zod';

export const filterSchema = z.object({
	price: z
		.object({
			min: z.number().optional(),
			max: z.number().optional(),
		})
		.optional(),
	rating: z.number().default(4),
	freeShipping: z.boolean().optional(),
	sameDayDelivery: z.boolean().optional(),
	discount: z.boolean().optional(),
});

export type Filter = z.infer<typeof filterSchema>;
