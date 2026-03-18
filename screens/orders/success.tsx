import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function OrderSuccessScreen() {
	const router = useRouter();
	const { orderId } = useLocalSearchParams<{ orderId: string }>();

	console.log({ orderId });

	return (
		<View className='flex-1'>
			<AppHeader title='Order Success' />
			<View className='flex-1 justify-center gap-4 px-4 py-8'>
				<EmptyState>
					<EmptyState.Icon icon='ShoppingCart' size={120} />
					<EmptyState.Title>Your order was successful!</EmptyState.Title>
					<View className='max-w-3/4 mx-auto'>
						<EmptyState.Description>
							You will get a response within a few minutes.
						</EmptyState.Description>
					</View>
				</EmptyState>
				<Button
					onPress={() =>
						router.push({
							pathname: '/orders/[orderId]',
							params: {
								orderId: orderId,
							},
						})
					}
				>
					Track Your Order
				</Button>
			</View>
		</View>
	);
}
