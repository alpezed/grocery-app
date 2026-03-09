import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const profileSchema = z
	.object({
		name: z.string().min(1, { message: 'Name is required' }),
		email: z.email().min(1, { message: 'Email is required' }),
		phone: z
			.string()
			.optional()
			.refine(value => !value || isValidPhoneNumber(value), {
				message: 'Invalid phone number format',
			}),
		currentPassword: z.string().optional(),
		password: z.string().optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type Profile = z.infer<typeof profileSchema>;
