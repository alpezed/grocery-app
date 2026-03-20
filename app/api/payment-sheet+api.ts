import { getOrders, updateOrder } from '@/services/order';
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

		const { orderId, clerkId } = body;

		const orders = await getOrders(clerkId);
		const order = orders.data.find(order => order.documentId === orderId);
		if (!order) {
			return new Response(JSON.stringify({ error: 'Order not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const totalAmount = order.items?.reduce(
			(sum, item) => sum + item.priceAtPurchase * item.quantity,
			0
		);

		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(totalAmount * 100),
			currency: 'usd',
			customer: customer.id,
			payment_method_types: ['card'],
			metadata: {
				orderId,
				clerkId,
			},
		});

		await updateOrder(orderId, {
			stripePaymentIntentId: paymentIntent.id,
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
		console.log(JSON.stringify(error, null, 2));
		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
