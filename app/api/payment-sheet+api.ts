import Stripe from 'stripe';

export async function POST(request: Request) {
	let body = null;

	try {
		body = await request.json();
	} catch {
		// Body was empty or invalid JSON
		body = null;
	}

	try {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
			typescript: true,
		});

		const customers = await stripe.customers.list();

		const customer = customers.data[0];

		if (!customer) {
			return new Response(JSON.stringify({ error: 'Customer not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const ephemeralKey = await stripe.ephemeralKeys.create(
			{ customer: customer.id },
			{ apiVersion: '2020-08-27' }
		);

		const { amount } = body;

		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100),
			currency: 'usd',
			customer: customer.id,
			payment_method_types: ['card'],
		});

		return new Response(
			JSON.stringify({
				paymentIntent: paymentIntent.client_secret,
				ephemeralKey: ephemeralKey.secret,
				customer: customer.id,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
