import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useUpdateAddress } from '@/lib/queries/addresses';
import { AddressResponse } from '@/schema/address.schema';
import { useSelectedAddressStore } from '@/store/use-address';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export function SelectAddress({
	address,
	isDefault = false,
}: {
	address: AddressResponse;
	isDefault?: boolean;
}) {
	const { mutate: updateAddress, isPending: isUpdatingAddress } =
		useUpdateAddress(address.documentId);
	const router = useRouter();
	const setDefaultAddress = useSelectedAddressStore(
		state => state.setDefaultAddress
	);

	const onPress = async () => {
		updateAddress({ isDefault: true });
		setDefaultAddress(address);
		router.back();
	};

	return (
		<View className='relative'>
			{isUpdatingAddress && (
				<ActivityIndicator
					size='small'
					color={Colors.light.primaryDark}
					className='absolute right-4 top-1/2 -translate-y-1/2'
				/>
			)}
			<TouchableOpacity
				activeOpacity={0.8}
				className={`flex-row items-center gap-3 px-4 py-6 bg-white border overflow-hidden rounded-lg ${isDefault ? 'border-primary-dark' : 'border-transparent'}`}
				onPress={onPress}
				disabled={isUpdatingAddress}
			>
				{isDefault && (
					<Text className='text-2xs font-medium absolute left-0 top-0 p-1 bg-primary-light text-primary-dark uppercase flex-1'>
						Default
					</Text>
				)}
				<View className='w-16 h-16 bg-primary-light rounded-full items-center justify-center'>
					<Icon name='MapPin' size={24} color={Colors.light.primaryDark} />
				</View>
				<View className='flex-1'>
					<Text className='text-base font-bold'>{address.name}</Text>
					<Text className='font-sans text-xs text-text'>
						{address.address}, {address.city}, {address.country}{' '}
						{address.zipCode}
					</Text>
					<Text className='text-xs font-medium mt-1'>
						{address.phoneNumber}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
