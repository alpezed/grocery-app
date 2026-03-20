import {
	LinkDisplay,
	PlatformPay,
	useStripe,
} from '@stripe/stripe-react-native';
import { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import ApplePay from '@/assets/icons/apple.svg';
import CreditCard from '@/assets/icons/credit-card.svg';
import Paypal from '@/assets/icons/paypal.svg';
import { AppLoader } from '@/components/loader';
import { Colors } from '@/constants/theme';
import { useUpdateOrder } from '@/hooks/use-orders';
import { Order } from '@/schema/order.schema';
import { createOrder } from '@/services/order';
import { createPaymentIntent } from '@/services/stripe';
import { useCartStore } from '@/store/use-cart';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

type PaymentMethod = {
	id: string;
	title: string;
	icon: React.FC<SvgProps>;
};

const paymentMethods: PaymentMethod[] = [
	{
		id: 'paypal',
		title: 'Paypal',
		icon: Paypal,
	},
	{
		id: 'credit-card',
		title: 'Credit Card',
		icon: CreditCard,
	},
	{
		id: 'apple-pay',
		title: 'Apple Pay',
		icon: ApplePay,
	},
];

function PaymentMethodCard({
	paymentMethod,
	onPress,
}: {
	paymentMethod: PaymentMethod;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			className='bg-white flex-1 p-4 rounded-lg border gap-2 border-transparent items-center justify-center shadow-xl/5'
			onPress={onPress}
		>
			<View className='flex-row items-center gap-2'>
				<paymentMethod.icon color={Colors.light.text} />
			</View>
			<Text className='text-xs text-text font-medium capitalize'>
				{paymentMethod.title}
			</Text>
		</TouchableOpacity>
	);
}

export default function PaymentScreen() {
	const { items, clear: clearCart } = useCartStore();
	const { user } = useUser();
	const router = useRouter();
	const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
	const updateOrderMutation = useUpdateOrder(currentOrderId!);
	const [isLoading, setIsLoading] = useState(false);
	const [paymentType, setPaymentType] = useState<string | null>('credit-card');
	const { initPaymentSheet, presentPaymentSheet, confirmPlatformPayPayment } =
		useStripe();

	const createOrderMutation = useMutation({
		mutationFn: async (): Promise<Order> => {
			setIsLoading(true);
			const cartItems = items?.map(item => ({
				productId: item.documentId,
				priceAtPurchase: item.price,
				quantity: item.quantity,
			}));
			if (!user?.id) {
				// TODO: Popup a modal to login
				Alert.alert(
					'Please login to continue',
					'You need to be logged in to create an order'
				);
				throw new Error('Login to continue');
			}
			return await createOrder(cartItems, user?.id);
		},
		onSuccess: data => {
			if (!user?.id) {
				Alert.alert('Error', 'User not found');
				return;
			}
			setCurrentOrderId(data.documentId);
			paymentIntentMutation.mutateAsync({
				clerkId: user?.id,
				orderId: data.documentId,
			});
		},
		onError: error => {
			Alert.alert('Error', error.message);
			setIsLoading(false);
		},
	});

	const paymentIntentMutation = useMutation({
		mutationFn: createPaymentIntent,
		onSuccess: async data => {
			const { customer, ephemeralKey, paymentIntent } = data;

			if (!currentOrderId) {
				Alert.alert('Error', 'Order not found');
				return;
			}

			const { error } = await initPaymentSheet({
				style: 'alwaysLight',
				merchantDisplayName: 'Grocery App',
				customerId: customer,
				customerEphemeralKeySecret: ephemeralKey,
				paymentIntentClientSecret: paymentIntent,
				allowsDelayedPaymentMethods: true,
				returnURL: 'groceryapp://stripe-redirect',
				paymentMethodOrder: ['apple-pay', 'paypal'],
				appearance: {
					colors: {
						background: Colors.light.backgroundLight,
						primary: Colors.light.primaryDark,
						componentBorder: Colors.light.border,
					},
					shapes: {
						borderRadius: 5,
					},
					font: {
						family: 'Montserrat-SemiBold',
					},
					primaryButton: {
						colors: {
							light: {
								background: Colors.light.primaryDark,
								text: '#ffffff',
								border: Colors.light.primaryDark,
							},
							dark: {
								background: Colors.light.primaryDark,
								text: '#ffffff',
								border: Colors.light.primaryDark,
							},
						},
						font: {
							family: 'Montserrat-Bold',
						},
						shapes: {
							height: 52,
							borderRadius: 10,
						},
					},
				},
				defaultBillingDetails: {
					name: 'John Doe',
				},
				link: {
					display: LinkDisplay.NEVER,
				},
			});

			if (error) {
				Alert.alert('Error', error.message);
			}

			openPaymentSheet();
		},
		onError: error => {
			console.log('error', error);
			Alert.alert('Error', error.message);
			setIsLoading(false);
		},
	});

	const applePayMutation = useMutation({
		mutationFn: createPaymentIntent,
		onSuccess: async data => {
			const { paymentIntent: clientSecret } = data;

			const appleCartItems = items.map(item => ({
				label: item.name,
				amount: item.price.toString(),
				paymentType: PlatformPay.PaymentType.Immediate,
			}));

			setIsLoading(false);

			await new Promise(resolve => setTimeout(resolve, 1000));

			const { error } = await confirmPlatformPayPayment(clientSecret, {
				applePay: {
					cartItems: appleCartItems as PlatformPay.CartSummaryItem[],
					merchantCountryCode: 'US',
					currencyCode: 'USD',
					// requiredShippingAddressFields: [
					// 	PlatformPay.ContactField.PostalAddress,
					// ],
					// requiredBillingContactFields: [
					// 	PlatformPay.ContactField.PhoneNumber,
					// ],
				},
			});

			if (error?.code === 'Canceled') {
				updateOrderMutation.mutate({
					clerkId: user?.id,
					orderStatus: 'cancelled',
				});
			}

			if (error && error?.code !== 'Canceled') {
				Alert.alert('Error', error.message);
			} else {
				router.replace({
					pathname: '/orders/success',
					params: {
						orderId: currentOrderId,
					},
				});
				clearCart();
			}
		},
		onError: error => {
			console.log('--applePayMutation', JSON.stringify(error, null, 2));
		},
	});

	const openPaymentSheet = useCallback(async () => {
		if (!user?.id) {
			// TODO: Popup a modal to login
			Alert.alert(
				'Please login to continue',
				'You need to be logged in to create an order'
			);
			return;
		}

		try {
			if (paymentType === 'apple-pay' && currentOrderId) {
				await applePayMutation.mutateAsync({
					clerkId: user?.id,
					orderId: currentOrderId,
				});
				return;
			}

			setIsLoading(false);

			await new Promise(resolve => setTimeout(resolve, 1000));

			const { error } = await presentPaymentSheet();

			if (error?.code === 'Canceled') {
				updateOrderMutation.mutate({
					clerkId: user?.id,
					orderStatus: 'cancelled',
				});
			}

			if (error && error?.code !== 'Canceled') {
				Alert.alert(`Error code: ${error.code}`, error.message);
			} else {
				// Alert.alert('Success', 'Your order is confirmed!');
				router.replace({
					pathname: '/orders/success',
					params: {
						orderId: currentOrderId,
					},
				});
				clearCart();
			}
		} catch (error) {
			console.log('--openPaymentSheet', JSON.stringify(error, null, 2));
		}
	}, [
		clearCart,
		presentPaymentSheet,
		user?.id,
		updateOrderMutation,
		currentOrderId,
		router,
		paymentType,
		applePayMutation,
	]);

	const onPaymentMethodPress = useCallback(
		async (paymentMethodId: string) => {
			if (!user?.id) {
				// TODO: Popup a modal to login
				Alert.alert(
					'Please login to continue',
					'You need to be logged in to create an order'
				);
				return;
			}
			setPaymentType(paymentMethodId);
			await createOrderMutation.mutateAsync();
			// if (paymentMethodId === 'apple-pay') {
			// 	if (!currentOrderId) {
			// 		Alert.alert('Error', 'Order not found');
			// 		return;
			// 	}
			// 	await applePayMutation.mutateAsync({
			// 		clerkId: user?.id,
			// 		orderId: currentOrderId,
			// 	});
			// } else if (paymentMethodId === 'credit-card') {
			// 	await createOrderMutation.mutateAsync();
			// }
		},
		[createOrderMutation, user?.id]
	);

	return (
		<>
			<AppLoader visible={isLoading} />
			<View className='gap-3 flex-row'>
				{paymentMethods.map(paymentMethod => (
					<PaymentMethodCard
						paymentMethod={paymentMethod}
						key={paymentMethod.id}
						onPress={() => onPaymentMethodPress(paymentMethod.id)}
					/>
				))}
			</View>
		</>
	);
}
