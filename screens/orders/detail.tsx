import AppHeader from '@/components/app-header';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useGetOrderById } from '@/hooks/use-orders';
import { Order } from '@/schema/order.schema';
import { format } from 'date-fns';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type OrderStatus =
	| 'placed'
	| 'confirmed'
	| 'shipped'
	| 'outForDelivery'
	| 'delivered';

const STEPS: { key: OrderStatus; label: string }[] = [
	{ key: 'placed', label: 'Order Placed' },
	{ key: 'confirmed', label: 'Order Confirmed' },
	{ key: 'shipped', label: 'Order Shipped' },
	{ key: 'outForDelivery', label: 'Out for Delivery' },
	{ key: 'delivered', label: 'Delivered' },
];

export default function OrderDetailScreen() {
	const { orderId } = useLocalSearchParams<{ orderId: string }>();

	const { data: response, status } = useGetOrderById(orderId);
	const order = response?.data as Order;
	const currentIndex = STEPS.findIndex(step => step.key === order?.orderStatus);

	if (!orderId) {
		return <Redirect href='/orders' />;
	}

	return (
		<View className='flex-1'>
			<AppHeader title='Track Order' />
			{status === 'pending' ? (
				<View className='flex-1 items-center justify-center'>
					<ActivityIndicator size='large' color={Colors.light.primaryDark} />
				</View>
			) : (
				<View className='gap-4 p-4'>
					<View className='flex-row bg-white items-center gap-3 px-4 py-7'>
						<View className='w-16 h-16 bg-primary-light rounded-full items-center justify-center'>
							<Icon name='Box' size={32} color={Colors.light.trackIcon} />
						</View>
						<View className='flex-1'>
							<Text className='text-base font-bold'>
								Order #{order.documentId.substring(0, 6)}
							</Text>
							<Text className='font-sans text-xs text-text'>
								Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
							</Text>
							<View className='flex-row gap-2 mt-1'>
								<Text className='text-xs'>
									Items:{' '}
									<Text className='font-medium'>{order.items.length}</Text>
								</Text>
								<Text className='text-xs'>
									Total:{' '}
									<Text className='font-medium'>
										{order.items
											.reduce(
												(acc, item) =>
													acc + item.priceAtPurchase * item.quantity,
												0
											)
											.toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
									</Text>
								</Text>
							</View>
						</View>
					</View>
					<View className='p-4 bg-white'>
						{STEPS.map((step, index) => {
							const isDone = index <= currentIndex;
							const isLast = index === STEPS.length - 1;
							const date =
								order.timeline[step.key as keyof typeof order.timeline];

							return (
								<View key={step.key} className='flex-row items-start'>
									{/* Left Side: Dots and Lines */}
									<View className='items-center mr-4'>
										<View
											className={`w-16 h-16 bg-primary-light rounded-full items-center justify-center border-2 text-track-icon ${
												isDone
													? 'bg-primary-light border-primary-light'
													: 'bg-background-dark border-background-dark'
											}`}
										>
											<Icon
												name='Box'
												size={32}
												color={
													isDone ? Colors.light.trackIcon : Colors.light.text
												}
											/>
										</View>
										{!isLast && (
											<View
												className={`w-0.5 h-8 ${isDone ? 'bg-border' : 'bg-border'}`}
											/>
										)}
									</View>

									{/* Right Side: Text */}
									<View className='pb-6'>
										<Text className={`font-medium text-black mt-3`}>
											{step.label}
										</Text>
										{date ? (
											<Text className='text-xs text-gray-500 font-normal'>
												{new Date(date).toLocaleString()}
											</Text>
										) : (
											<Text className='text-xs text-gray-500'>Pending</Text>
										)}
									</View>
								</View>
							);
						})}
					</View>
				</View>
			)}
		</View>
	);
}
