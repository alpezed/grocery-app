export const notifications = [
	{
		name: 'email',
		title: 'Email Notifcations',
		description:
			'Lorem ipsum dolor sit amet, consetetur sadi pscing elitr, sed diam nonumym',
		enabled: false,
	},
	{
		name: 'order',
		title: 'Order Notifications',
		description:
			'Lorem ipsum dolor sit amet, consetetur sadi pscing elitr, sed diam nonumym',
		enabled: false,
	},
	{
		name: 'general',
		title: 'General Notifications',
		description:
			'Lorem ipsum dolor sit amet, consetetur sadi pscing elitr, sed diam nonumym',
		enabled: true,
	},
];

export type Notification = (typeof notifications)[number];
