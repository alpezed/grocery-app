export const createPaymentIntent = async ({ amount }: { amount: number }) => {
	const response = await fetch(`/api/payment-sheet`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			amount,
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
