import { Link, useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { Address, AddressResponse } from '@/schema/address.schema';

function ActiveAddressCard({
	address,
	isLoading,
	withAddresses,
}: {
	address?: Address;
	isLoading: boolean;
	withAddresses: boolean;
}) {
	const router = useRouter();

	if (isLoading) {
		return (
			<View className='flex-1 items-center justify-center'>
				<ActivityIndicator size='small' color={Colors.light.primaryDark} />
			</View>
		);
	}

	// UI to tell user to select an address from the list of addresses
	if (withAddresses && !address) {
		return (
			<View className='flex-1 justify-center gap-4 px-4 py-8'>
				<EmptyState>
					<EmptyState.Icon icon='MapPinPlus' size={100} />
					<EmptyState.Title>Select an address</EmptyState.Title>
					<View className='max-w-3/4 mx-auto'>
						<EmptyState.Description>
							Select an address to continue.
						</EmptyState.Description>
					</View>
					<Button onPress={() => router.push('/(modals)/select-address')}>
						Select Address
					</Button>
				</EmptyState>
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
					<Button onPress={() => router.push('/add-address')}>
						Add Address
					</Button>
				</EmptyState>
			</View>
		);
	}

	return (
		<View className='bg-white p-4 relative rounded-lg border gap-1 border-transparent'>
			<Link
				className='p-2 items-center justify-center flex-row gap-1 absolute top-1 right-1.5'
				href='/(modals)/select-address'
				asChild
			>
				{/* <Icon name='Pencil' size={15} color={Colors.light.primaryDark} /> */}
				<Text className='text-xs text-primary-dark font-medium'>
					Change address
				</Text>
			</Link>
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

export function CheckoutAddress({
	withAddresses,
	defaultAddress,
	isLoading,
}: {
	defaultAddress?: AddressResponse;
	isLoading: boolean;
	withAddresses: boolean;
}) {
	return (
		<View className='flex-1 gap-4'>
			<ActiveAddressCard
				address={defaultAddress}
				isLoading={isLoading}
				withAddresses={withAddresses}
			/>
		</View>
	);
}
