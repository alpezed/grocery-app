import { z } from 'zod';

export const strapiUserSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	username: z.string().min(1),
	clerkId: z.string().min(1),
});

export type StrapiUser = z.infer<typeof strapiUserSchema>;
