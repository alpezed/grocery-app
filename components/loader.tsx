import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function AppLoader({ visible }: { visible: boolean }) {
	return (
		<Modal transparent visible={visible} animationType='fade'>
			{/* Background Overlay */}
			<View className='flex-1 bg-black/40 justify-center items-center'>
				{/* Centered Loading Card */}
				<View className='w-72 p-8 bg-white rounded-3xl items-center shadow-xl'>
					<ActivityIndicator size='large' color={Colors.light.primaryDark} />

					<Text className='text-lg font-bold mt-5'>Securing Order</Text>

					<Text className='text-sm text-text text-center mt-2 leading-5'>
						Please wait while we prepare your secure checkout...
					</Text>
				</View>
			</View>
		</Modal>
	);
}
