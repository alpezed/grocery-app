import AppHeader from '@/components/app-header';
import { Text, View } from 'react-native';

export default function CheckoutScreen() {
	return (
		<View className='flex-1'>
			<AppHeader title='Checkout' />
			<View className='flex-1'>
				<Text>Checkout</Text>
			</View>
		</View>
	);
}
