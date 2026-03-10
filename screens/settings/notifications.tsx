import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { notifications } from '@/data/notifications';
import { Notification, notificationSchema } from '@/schema/notification.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { ScrollView, Switch, Text, View } from 'react-native';

export default function NotificationsScreen() {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<Notification>({
		resolver: zodResolver(notificationSchema) as Resolver<Notification>,
		defaultValues: {
			email: false,
			order: false,
			general: true,
		},
	});

	const onSubmit = async (data: Notification) => {
		console.log(data);
	};

	return (
		<View className='flex-1'>
			<AppHeader title='Notifications' />
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
								<View className='flex-row items-center gap-2'>
									<Controller
										control={control}
										name={notification.name as keyof Notification}
										render={({ field: { value, onChange } }) => (
											<Switch
												trackColor={{
													false: Colors.light.backgroundDark,
													true: Colors.light.primaryDark,
												}}
												thumbColor={Colors.light.background}
												ios_backgroundColor={Colors.light.backgroundDark}
												onValueChange={onChange}
												value={value}
												style={{
													transform: [{ scaleX: 0.5 }, { scaleY: 0.55 }],
													transformOrigin: 'right',
												}}
											/>
										)}
									/>
								</View>
							</View>
						))}
					</View>
				</ScrollView>
				<View className='px-4 mb-8'>
					<Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
						Save settings
					</Button>
				</View>
			</View>
		</View>
	);
}
