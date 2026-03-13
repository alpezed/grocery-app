import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import ApplePay from '@/assets/icons/apple.svg';
import CreditCard from '@/assets/icons/credit-card.svg';
import Paypal from '@/assets/icons/paypal.svg';
import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Stepper } from '@/components/ui/stepper';
import { Colors } from '@/constants/theme';
import { useGetAddresses } from '@/lib/queries/addresses';
import { Address } from '@/schema/address.schema';
import { SvgProps } from 'react-native-svg';

const steps = [
	{ id: 'shipping', title: 'Shipping' },
	{ id: 'address', title: 'Address' },
	{ id: 'payment', title: 'Payment' },
];

const TOTAL_FORM_STEPS = steps.length;

type PaymentMethod = {
	id: string;
	title: string;
	icon: React.FC<SvgProps>;
};

type ShippingMethod = {
	id: string;
	title: string;
	description: string;
	price: number;
};

const shippingMethods: ShippingMethod[] = [
	{
		id: 'standard',
		title: 'Standard Delivery',
		description:
			'Order will be delivered between 3 - 4 business days straights to your doorstep.',
		price: 3,
	},
	{
		id: 'next-day',
		title: 'Next Day Delivery',
		description:
			'Order will be delivered the next business day to your doorstep.',
		price: 10,
	},
];

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

function ShippingMethodCard({
	shippingMethod,
	isActive,
	onPress,
}: {
	shippingMethod: ShippingMethod;
	isActive: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			className={`bg-white p-4 rounded-sm gap-3 flex-row border border-transparent items-center ${isActive ? 'border-primary-dark' : ''}`}
			activeOpacity={0.8}
			onPress={onPress}
		>
			<View className='flex-1 flex-row items-center gap-3'>
				<View className='flex-1 gap-1'>
					<Text className='text-base font-medium capitalize'>
						{shippingMethod.title}
					</Text>
					<Text className='text-xs text-text'>
						{shippingMethod.description}
					</Text>
				</View>
			</View>
			<View className='grid-cols-1'>
				<Text className='text-base text-primary-dark font-medium'>
					${shippingMethod.price}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

function ActiveAddressCard({ address }: { address: Address }) {
	const router = useRouter();

	return (
		<View className='bg-white p-4 rounded-sm border gap-1 border-transparent'>
			<View className='flex-row justify-between mb-2'>
				<Text className='text-base font-medium capitalize'>{address.name}</Text>
				<Pressable
					onPress={() => router.push('/address')}
					className='p-2 w-3 h-3 items-center justify-center'
				>
					<Icon name='Pencil' size={15} color={Colors.light.primaryDark} />
				</Pressable>
			</View>
			<Text className='text-xs text-text'>
				{address.address}, {address.city}, {address.country} {address.zipCode}
			</Text>
			<Text className='text-xs text-text'>{address.phoneNumber}</Text>
		</View>
	);
}

function PaymentMethodCard({
	paymentMethod,
}: {
	paymentMethod: PaymentMethod;
}) {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			className='bg-white flex-1 p-4 rounded-sm border gap-2 border-transparent items-center justify-center shadow-xl/5'
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

export default function CheckoutScreen() {
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedShippingMethod, setSelectedShippingMethod] =
		useState<ShippingMethod | null>(shippingMethods[0]);
	const { data: addresses } = useGetAddresses();

	const handleNext = () => {
		setCurrentStep(currentStep + 1);
	};

	const handlePrevious = () => {
		setCurrentStep(currentStep - 1);
	};

	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === TOTAL_FORM_STEPS - 1;

	const onSubmit = () => {
		if (isLastStep) {
			console.log('Submit');
		} else {
			setCurrentStep(currentStep + 1);
		}
	};

	const selectedAddress = addresses?.[0];

	return (
		<View className='flex-1'>
			<AppHeader title='Checkout' />
			<View className='flex-1 px-6'>
				<View className='w-[95%] mx-auto mt-6'>
					<Stepper steps={steps} currentStepIndex={currentStep} />
				</View>

				{currentStep === 0 && (
					<View className='gap-4'>
						{shippingMethods.map(shippingMethod => (
							<ShippingMethodCard
								shippingMethod={shippingMethod}
								isActive={selectedShippingMethod?.id === shippingMethod.id}
								key={shippingMethod.id}
								onPress={() => setSelectedShippingMethod(shippingMethod)}
							/>
						))}
					</View>
				)}
				{currentStep === 1 && (
					<View className='gap-4'>
						{selectedAddress && <ActiveAddressCard address={selectedAddress} />}
					</View>
				)}
				{currentStep === 2 && (
					<View className='gap-3 flex-row'>
						{paymentMethods.map(paymentMethod => (
							<PaymentMethodCard
								paymentMethod={paymentMethod}
								key={paymentMethod.id}
							/>
						))}
					</View>
				)}

				<View className='mt-auto mb-8 gap-3 flex-row'>
					{!isFirstStep && (
						<Button onPress={handlePrevious} color='white' className='flex-1'>
							Previous
						</Button>
					)}
					{!isLastStep && (
						<Button onPress={handleNext} className='flex-1'>
							Next
						</Button>
					)}
					{isLastStep && (
						<Button onPress={onSubmit} className='flex-1'>
							Place Order
						</Button>
					)}
				</View>
			</View>
		</View>
	);
}
