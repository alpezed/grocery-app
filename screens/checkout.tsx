import { StripeProvider } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { Colors } from '@/constants/theme';
import { useGetAddresses } from '@/lib/queries/addresses';
import { Address } from '@/schema/address.schema';
import PaymentScreen from '@/screens/payment';
import { useRouter } from 'expo-router';
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

function ActiveAddressCard({
	address,
	isLoading,
}: {
	address?: Address;
	isLoading: boolean;
}) {
	const router = useRouter();

	if (isLoading) {
		return (
			<View className='flex-1 items-center justify-center'>
				<ActivityIndicator size='small' color={Colors.light.primaryDark} />
			</View>
		);
	}

	if (!address) {
		return (
			<View className='flex-1 justify-center gap-4 px-4 py-8'>
				<EmptyState>
					<EmptyState.Icon icon='MapPin' size={120} />
					<EmptyState.Title>No address found</EmptyState.Title>
					<View className='max-w-3/4 mx-auto'>
						<EmptyState.Description>
							Add an address to continue.
						</EmptyState.Description>
					</View>
					<Button onPress={() => router.push('/address')}>Add Address</Button>
				</EmptyState>
			</View>
		);
	}

	return (
		<View className='bg-white p-4 relative rounded-sm border gap-1 border-transparent'>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => router.push('/address')}
				className='p-2 items-center justify-center flex-row gap-1 absolute top-1 right-1.5'
			>
				{/* <Icon name='Pencil' size={15} color={Colors.light.primaryDark} /> */}
				<Text className='text-xs text-primary-dark font-medium'>
					Change address
				</Text>
			</TouchableOpacity>
			<View className='flex-row justify-between mb-2'>
				<Text className='text-base font-medium capitalize'>{address.name}</Text>
			</View>
			<Text className='text-xs text-text'>
				{address.address}, {address.city}, {address.country} {address.zipCode}
			</Text>
			<Text className='text-xs text-text'>{address.phoneNumber}</Text>
		</View>
	);
}

export default function CheckoutScreen() {
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedShippingMethod, setSelectedShippingMethod] =
		useState<ShippingMethod | null>(shippingMethods[0]);
	const { data: addresses, isLoading: isLoadingAddresses } = useGetAddresses();

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

	const isAddressScreen = currentStep === 1 && !selectedAddress;

	return (
		<StripeProvider
			publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUB_KEY!}
			merchantIdentifier='merchant.com.groceryapp'
		>
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
						<View className='flex-1 gap-4'>
							<ActiveAddressCard
								address={selectedAddress}
								isLoading={isLoadingAddresses}
							/>
						</View>
					)}
					{currentStep === 2 && <PaymentScreen />}
					<View className='mt-auto mb-8 gap-3 flex-row'>
						{!isFirstStep && (
							<Button
								onPress={handlePrevious}
								color={isLastStep ? 'primary' : 'white'}
								className='flex-1'
							>
								Previous
							</Button>
						)}
						{!isLastStep && (
							<Button
								onPress={handleNext}
								className='flex-1'
								disabled={isAddressScreen}
							>
								Next
							</Button>
						)}
						{/* {isLastStep && (
							<Button onPress={onSubmit} className='flex-1'>
								Place Order
							</Button>
						)} */}
					</View>
				</View>
			</View>
		</StripeProvider>
	);
}
