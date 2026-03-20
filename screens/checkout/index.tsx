import { StripeProvider } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { useGetAddresses } from '@/lib/queries/addresses';
import PaymentScreen from '@/screens/payment';

import { useSelectedAddressStore } from '@/store/use-address';
import { CheckoutAddress } from './address';
import { ShippingMethodCard } from './shipping-method';

const steps = [
	{ id: 'shipping', title: 'Shipping' },
	{ id: 'address', title: 'Address' },
	{ id: 'payment', title: 'Payment' },
];

const TOTAL_FORM_STEPS = steps.length;

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

export default function CheckoutScreen() {
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedShippingMethod, setSelectedShippingMethod] =
		useState<ShippingMethod | null>(shippingMethods[0]);
	const { data: addresses, isLoading: isLoadingAddresses } = useGetAddresses();
	const defaultAddress = useSelectedAddressStore(state => state.defaultAddress);

	const handleNext = () => {
		setCurrentStep(currentStep + 1);
	};

	const handlePrevious = () => {
		setCurrentStep(currentStep - 1);
	};

	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === TOTAL_FORM_STEPS - 1;

	const isAddressScreen = currentStep === 1 && !defaultAddress;

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
						<CheckoutAddress
							withAddresses={!!addresses?.length && addresses.length > 0}
							defaultAddress={defaultAddress}
							isLoading={isLoadingAddresses}
						/>
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
