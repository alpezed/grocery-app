import { z } from 'zod';

export const transactionSchema = z.object({
	id: z.string(),
	amount: z.number(),
	currency: z.string(),
	date: z.number(),
	brand: z.enum(['mastercard', 'visa', 'amex', 'paypal', 'generic']),
	last4: z.string(),
	status: z.enum(['succeeded', 'canceled', 'processing']),
});

export type Transaction = z.infer<typeof transactionSchema>;
