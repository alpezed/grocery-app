import { useRouter } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import AddressList from '@/components/address-list';
import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useGetAddresses } from '@/lib/queries/addresses';

export default function AddressScreen() {
	const router = useRouter();
	const { data: addresses, isLoading } = useGetAddresses();

	return (
		<View className='flex-1'>
			<AppHeader
				title='My Address'
				headerRight={
					<Pressable
						onPress={() =>
							router.push({
								pathname: '/add-address',
							})
						}
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
					>
						<Icon name='CirclePlus' size={22} />
					</Pressable>
				}
			/>
			{isLoading ? (
				<View className='flex-1 justify-center gap-4 px-4 py-8'>
					<ActivityIndicator size='large' color={Colors.light.primaryDark} />
				</View>
			) : addresses?.length && addresses.length > 0 ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className='flex-1'
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<ScrollView className='flex-1'>
							<View className='flex-1 p-5 gap-3'>
								{addresses?.map(address => (
									<AddressList
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
