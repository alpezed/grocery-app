import { z } from 'zod';

export const ChildSchema = z.object({
	text: z.string(),
	type: z.string(),
});
export type Child = z.infer<typeof ChildSchema>;

export const DescriptionSchema = z.object({
	type: z.string(),
	children: z.array(ChildSchema),
});
export type Description = z.infer<typeof DescriptionSchema>;

export const ProductSchema = z.object({
	id: z.number(),
	documentId: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.array(DescriptionSchema),
	price: z.number(),
	image: z.object({
		url: z.string(),
		formats: z.object({
			small: z.object({
				url: z.string(),
			}),
			thumbnail: z.object({
				url: z.string(),
			}),
		}),
		height: z.number(),
		width: z.number(),
	}),
	category: z.object({
		id: z.number(),
		name: z.string(),
	}),
	unit: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	publishedAt: z.coerce.date(),
});

export type Product = z.infer<typeof ProductSchema>;
