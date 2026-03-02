import { z } from 'zod';

export const signUpSchema = z
	.object({
		email: z.email().min(1, { message: 'Email is required' }),
		phone: z.preprocess(
			val => (typeof val === 'string' && val.trim() === '' ? undefined : val),
			z
				.string()
				.regex(/^\+?[0-9()\-\s]+$/, {
					message: 'Invalid phone number format',
				})
				.refine(
					val => {
						const digitsOnly = val.replace(/\D/g, '');
						return digitsOnly.length >= 8 && digitsOnly.length <= 15;
					},
					{
						message: 'Phone number must contain 8–15 digits',
					}
				)
				.min(8, { message: 'Phone number must be at least 8 digits long' })
				.max(15, { message: 'Phone number must be at most 15 digits long' })
		),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' }),
		confirmPassword: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' }),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type SignUpSchema = z.infer<typeof signUpSchema>;
