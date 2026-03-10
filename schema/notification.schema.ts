import { z } from 'zod';

export const notificationSchema = z.object({
	email: z.boolean().default(true),
	order: z.boolean().default(true),
	general: z.boolean().default(true),
});

export type Notification = z.infer<typeof notificationSchema>;
