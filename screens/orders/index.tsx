import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import OrderItem from '@/components/order-item';
import { Colors } from '@/constants/theme';
import { useGetOrders } from '@/hooks/use-orders';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, View } from 'react-native';

export default function OrdersScreen() {
	const { data: orders, isLoading } = useGetOrders();

	return (
		<View className='flex-1'>
			<AppHeader title='My Orders' />
			{isLoading ? (
				<View className='flex-1 justify-center gap-4 px-4 py-8'>
					<ActivityIndicator size='large' color={Colors.light.primaryDark} />
				</View>
			) : (
				<View className='flex-1 p-5 gap-3'>
					<FlashList
						data={orders?.data || []}
						renderItem={({ item }) => <OrderItem order={item} />}
						keyExtractor={item => item.id.toString()}
						contentContainerStyle={{ flex: 1 }}
						contentContainerClassName='gap-2'
						ListEmptyComponent={
							<EmptyState>
								<EmptyState.Icon icon='Box' size={120} />
								<EmptyState.Title>No orders found</EmptyState.Title>
								<EmptyState.Description>
									You haven&apos;t placed any orders yet.
								</EmptyState.Description>
							</EmptyState>
						}
						ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
					/>
				</View>
			)}
		</View>
	);
}
