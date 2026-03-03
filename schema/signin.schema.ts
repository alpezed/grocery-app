import { z } from 'zod';

export const signInSchema = z.object({
	email: z
		.email({ error: 'Invalid email address' })
		.min(1, { message: 'Email is required' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' }),
	rememberMe: z.boolean().optional(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
