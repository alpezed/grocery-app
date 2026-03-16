import {
	LinkDisplay,
	PlatformPay,
	useStripe,
} from '@stripe/stripe-react-native';
import { useCallback, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import ApplePay from '@/assets/icons/apple.svg';
import CreditCard from '@/assets/icons/credit-card.svg';
import Paypal from '@/assets/icons/paypal.svg';
import { Colors } from '@/constants/theme';
import { createPaymentIntent } from '@/services/stripe';
import { useCartStore } from '@/store/use-cart';
import { useMutation } from '@tanstack/react-query';

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
			activeOpacity={0.8}
			className='bg-white flex-1 p-4 rounded-sm border gap-2 border-transparent items-center justify-center shadow-xl/5'
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
	const { items } = useCartStore();

	const cartItems = items.map(item => ({
		label: item.name,
		amount: item.price.toString(),
		paymentType: PlatformPay.PaymentType.Immediate,
	}));

	const {
		initPaymentSheet,
		presentPaymentSheet,
		confirmPaymentSheetPayment,
		confirmPlatformPayPayment,
	} = useStripe();

	const paymentIntentMutation = useMutation({
		mutationFn: createPaymentIntent,
		onSuccess: async data => {
			const { customer, ephemeralKey, paymentIntent } = data;

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
						primary: Colors.light.primaryDark,
					},
					shapes: {
						borderRadius: 10,
					},
					font: {
						family: 'Montserrat',
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
							family: 'Montserrat-SemiBold',
						},
						shapes: {
							height: 48,
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
				// handle error
				console.log('--error', error);
				Alert.alert('Error', error.message);
			}
		},
		onError: error => {
			console.log('error', error);
		},
	});

	const applePayMutation = useMutation({
		mutationFn: createPaymentIntent,
		onSuccess: async data => {
			const { paymentIntent: clientSecret } = data;

			const { error, paymentIntent } = await confirmPlatformPayPayment(
				clientSecret,
				{
					applePay: {
						cartItems: cartItems as PlatformPay.CartSummaryItem[],
						merchantCountryCode: 'US',
						currencyCode: 'USD',
						// requiredShippingAddressFields: [
						// 	PlatformPay.ContactField.PostalAddress,
						// ],
						// requiredBillingContactFields: [
						// 	PlatformPay.ContactField.PhoneNumber,
						// ],
					},
				}
			);

			if (error) {
				console.log('--error', error);
				Alert.alert('Error', error.message);
			} else {
				Alert.alert('Success', 'Your order is confirmed!');
			}
		},
		onError: error => {
			console.log('error', error);
		},
	});

	const setupPaymentSheet = useCallback(async () => {
		paymentIntentMutation.mutateAsync({ amount: 8 });
	}, [paymentIntentMutation]);

	useEffect(() => {
		setupPaymentSheet();
	}, []);

	const openPaymentSheet = useCallback(async () => {
		const { error } = await presentPaymentSheet();

		if (error) {
			Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			Alert.alert('Success', 'Your order is confirmed!');
		}
	}, [presentPaymentSheet]);

	const onPaymentMethodPress = useCallback(
		async (paymentMethodId: string) => {
			console.log({ paymentMethodId });
			if (paymentMethodId === 'apple-pay') {
				await applePayMutation.mutateAsync({ amount: 8 });
			} else if (paymentMethodId === 'credit-card') {
				openPaymentSheet();
			}
		},
		[applePayMutation, openPaymentSheet]
	);

	return (
		<View className='gap-3 flex-row'>
			{paymentMethods.map(paymentMethod => (
				<PaymentMethodCard
					paymentMethod={paymentMethod}
					key={paymentMethod.id}
					onPress={() => onPaymentMethodPress(paymentMethod.id)}
				/>
			))}
		</View>
	);
}
