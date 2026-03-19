import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const addressSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	email: z
		.email({ message: 'Invalid email address' })
		.min(1, { message: 'Email is required' }),
	phoneNumber: z
		.string()
		.optional()
		.refine(value => !value || isValidPhoneNumber(value), {
			message: 'Invalid phone number format',
		}),
	address: z.string().min(1, { message: 'Address is required' }),
	zipCode: z.string().min(1, { message: 'Zip code is required' }),
	city: z.string().min(1, { message: 'City is required' }),
	country: z.string().min(1, { message: 'Country is required' }),
	saveAddress: z.boolean().default(true),
	isDefault: z.boolean().default(false),
	clerkId: z.string().min(1, { message: 'Clerk ID is required' }),
});

export const addressResponseSchema = addressSchema.extend({
	id: z.string(),
	documentId: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Address = z.infer<typeof addressSchema>;
export type AddressResponse = z.infer<typeof addressResponseSchema>;
