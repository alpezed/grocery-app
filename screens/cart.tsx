import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import { ProductList } from '@/components/product-list';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useCartStore } from '@/store/use-cart';

export default function CartScreen() {
	const router = useRouter();
	const navigation = useNavigation();
	const { items, clear: clearCart } = useCartStore();

	const subtotal = items.reduce(
		(acc, item) => acc + item.price * (item.quantity ?? 1),
		0
	);
	const shipping = 0;
	const total = subtotal + shipping;

	useLayoutEffect(() => {
		navigation.setOptions({
			tabBarStyle: { display: 'none' },
		});

		// Reset it when leaving the screen
		return () =>
			navigation.setOptions({
				tabBarStyle: undefined,
			});
	}, [navigation, items]);

	const onClearCart = () => {
		Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Clear', onPress: () => clearCart() },
		]);
	};

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
			<AppHeader
				title='Shopping Cart'
				headerRight={
					items.length > 0 && (
						<Pressable onPress={onClearCart}>
							<Icon name='RotateCcw' size={22} />
						</Pressable>
					)
				}
			/>
			{items.length > 0 ? (
				<View className='flex-1'>
					<ProductList products={items} />
					<View className='px-4 pt-6 pb-12 bg-white rounded-tl-3xl rounded-tr-3xl gap-4'>
						<View className='gap-2'>
							<View className='flex-row justify-between items-center'>
								<Text className='text-text font-medium'>Subtotal</Text>
								<Text className='font-medium'>${subtotal.toFixed(2)}</Text>
							</View>
							<View className='flex-row justify-between items-center'>
								<Text className='text-text font-medium'>Shipping charges</Text>
								<Text className='font-medium'>${shipping.toFixed(2)}</Text>
							</View>
						</View>
						<View className='w-full h-px bg-border' />
						<View className='flex-row justify-between items-center'>
							<Text className='text-lg font-bold'>Total</Text>
							<Text className='text-lg font-bold'>${total.toFixed(2)}</Text>
						</View>
						<Button onPress={() => router.push('/checkout')}>Checkout</Button>
					</View>
				</View>
			) : (
				renderEmptyState()
			)}
		</View>
	);
}
