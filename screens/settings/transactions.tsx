import AppHeader from '@/components/app-header';
import { notifications } from '@/data/notifications';
import { ScrollView, Text, View } from 'react-native';

export default function TransactionsScreen() {
	return (
		<View className='flex-1'>
			<AppHeader title='Transactions' />
			<View className='flex-1'>
				<ScrollView className='flex-1'>
					<View className='gap-3 pt-6 flex-1 px-4 pb-6'>
						{notifications.map(notification => (
							<View
								key={notification.name}
								className='bg-white p-4 rounded-sm gap-3 flex-row items-center'
							>
								<View className='flex-1 gap-3'>
									<Text className='text-base font-medium'>
										{notification.title}
									</Text>
									<Text className='text-xs text-text'>
										{notification.description}
									</Text>
								</View>
							</View>
						))}
					</View>
				</ScrollView>
			</View>
		</View>
	);
}
