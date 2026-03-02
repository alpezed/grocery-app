import { z } from 'zod';

export const verifyCodeSchema = z
	.object({
		code: z
			.string()
			.min(1, { message: 'Code is required' })
			.max(6, { message: 'Code must be 6 digits long' }),
	})
	.refine(data => data.code.length === 6, {
		message: 'Code must be 6 digits long',
		path: ['code'],
	});

export type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;
