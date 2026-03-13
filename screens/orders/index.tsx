import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function OrdersScreen() {
	const router = useRouter();

	return (
		<View className='flex-1'>
			<AppHeader title='My Orders' />
			<View className='flex-1'>
				<Text>Order Screen</Text>
				<Button onPress={() => router.push('/orders/success')}>
					Place Order
				</Button>
			</View>
		</View>
	);
}
