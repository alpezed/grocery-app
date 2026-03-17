export const createPaymentIntent = async ({
	orderId,
	clerkId,
}: {
	orderId: string;
	clerkId: string;
}) => {
	const response = await fetch(`/api/payment-sheet`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			orderId,
			clerkId,
		}),
	});

	const result = (await response.json()) as {
		paymentIntent: string;
		ephemeralKey: string;
		customer: string;
	};

	if (!response.ok) {
		throw new Error('Failed to create payment intent');
	}

	return result;
};
