import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { Order } from '@/schema/order.schema';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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

export default function OrderItem({ order }: { order: Order }) {
	const [expanded, setExpanded] = useState(false);
	const currentIndex = STEPS.findIndex(step => step.key === order.orderStatus);
	const currentStatus = STEPS.find(s => s.key === order.orderStatus);

	return (
		<View className='bg-white mb-4'>
			<View className='flex-row items-center gap-3 px-4 py-7 border-b border-border'>
				<View className='w-16 h-16 bg-primary-light rounded-full items-center justify-center'>
					<Icon name='Box' size={32} color={Colors.light.primaryDark} />
				</View>
				<View className='flex-1'>
					<Link
						href={{
							pathname: '/orders/[orderId]',
							params: {
								orderId: order.documentId,
								order: JSON.stringify(order),
							},
						}}
					>
						<Text className='text-base font-bold'>
							Order #{order.documentId.substring(0, 6)}
						</Text>
					</Link>
					<Text className='font-sans text-xs text-text'>
						Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
					</Text>
					<View className='flex-row gap-2 mt-1'>
						<Text className='text-xs'>
							Items: <Text className='font-medium'>{order.items.length}</Text>
						</Text>
						<Text className='text-xs'>
							Total:{' '}
							<Text className='font-medium'>
								{order.items
									.reduce(
										(acc, item) => acc + item.priceAtPurchase * item.quantity,
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
				<Pressable
					onPress={() => setExpanded(!expanded)}
					className='p-2 w-3 h-3 items-center justify-center border border-primary-dark rounded-full'
				>
					<Icon
						name={expanded ? 'ChevronUp' : 'ChevronDown'}
						size={15}
						color={Colors.light.primaryDark}
					/>
				</Pressable>
			</View>
			{expanded && (
				<View className='p-4'>
					{STEPS.map((step, index) => {
						const isDone = index <= currentIndex;
						const isLast = index === STEPS.length - 1;
						const date =
							order.timeline[step.key as keyof typeof order.timeline];

						return (
							<View key={step.key} className='flex-row items-start'>
								{/* Left Side: Dots and Lines */}
								<View className='items-center mr-3'>
									<View
										className={`w-2.5 h-2.5 rounded-full border-2 ${
											isDone
												? 'bg-primary-dark border-primary-dark'
												: 'bg-white border-gray-300'
										}`}
									/>
									{!isLast && (
										<View
											className={`w-0.5 h-6 ${isDone ? 'bg-primary-dark' : 'bg-gray-200'}`}
										/>
									)}
								</View>

								{/* Right Side: Text */}
								<View className='flex-row justify-between flex-1 -mt-[3px]'>
									<Text
										className={`font-medium text-xs ${isDone ? 'text-black' : 'text-text'}`}
									>
										{step.label}
									</Text>
									{date ? (
										<Text className='text-xs text-gray-500'>
											{new Date(date).toLocaleString()}
										</Text>
									) : (
										<Text className='text-xs text-gray-500'>pending</Text>
									)}
								</View>
							</View>
						);
					})}
				</View>
			)}
			{!expanded && (
				<View className='bg-white py-2 px-4 flex-row gap-2 items-center'>
					<View className={`w-2.5 h-2.5 rounded-full bg-border`} />
					<Text className='text-xs text-text font-medium'>
						{currentStatus?.label ?? 'Pending...'}
					</Text>
				</View>
			)}
		</View>
	);
}
