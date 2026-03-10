import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';

export default function CartScreen() {
	const router = useRouter();
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			tabBarStyle: { display: 'none' },
		});

		// Reset it when leaving the screen
		return () =>
			navigation.setOptions({
				tabBarStyle: undefined,
			});
	}, [navigation]);

	const renderEmptyState = () => {
		return (
			<View className='flex-1 justify-center gap-4 px-4 py-8'>
				<EmptyState>
					<EmptyState.Icon icon='ShoppingCart' size={120} />
					<EmptyState.Title>Your cart is empty!</EmptyState.Title>
					<View className='max-w-3/4 mx-auto'>
						<EmptyState.Description>
							You will get a response within a few minutes.
						</EmptyState.Description>
					</View>
				</EmptyState>
				<Button onPress={() => router.push('/')}>Start shopping</Button>
			</View>
		);
	};

	return (
		<View className='flex-1 bg-background-light'>
			<AppHeader title='Shopping Cart' />
			{renderEmptyState()}
		</View>
	);
}
