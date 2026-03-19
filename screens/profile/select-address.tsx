import { useRouter } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import EmptyState from '@/components/empty-state';
import { SelectAddress } from '@/components/select-address';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useGetAddresses } from '@/lib/queries/addresses';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SelectAddressModal() {
	const router = useRouter();
	const { data: addresses, isLoading } = useGetAddresses();
	const insets = useSafeAreaInsets();

	return (
		<View className='flex-1'>
			{isLoading ? (
				<View className='flex-1 justify-center gap-4 px-4 py-8'>
					<ActivityIndicator color={Colors.light.primaryDark} />
				</View>
			) : addresses?.length && addresses.length > 0 ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className='flex-1'
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<ScrollView
							className='flex-1'
							contentContainerStyle={{
								paddingBottom: insets.bottom + 20, // Home bar height + extra breathing room
							}}
						>
							<View className='flex-1 p-5 gap-3'>
								{addresses?.map(address => (
									<SelectAddress
										key={address.id}
										address={address}
										isDefault={address.isDefault}
									/>
								))}
							</View>
						</ScrollView>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			) : (
				<View className='flex-1 justify-center gap-4 px-4 py-8'>
					<EmptyState>
						<EmptyState.Icon icon='MapPinXInside' size={120} />
						<EmptyState.Title>No addresses found</EmptyState.Title>
						<EmptyState.Description>
							Add your first address to get started
						</EmptyState.Description>
					</EmptyState>
					<Button onPress={() => router.push('/add-address')}>
						Add new address
					</Button>
				</View>
			)}
		</View>
	);
}
