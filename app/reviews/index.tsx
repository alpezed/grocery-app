import AppHeader from '@/components/app-header';
import { Icon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Reviews() {
	const router = useRouter();

	return (
		<View className='flex-1'>
			<AppHeader
				title='Reviews'
				showBack={true}
				headerRight={
					<Pressable
						onPress={() => router.push('/reviews/create')}
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
					>
						<Icon name='CirclePlus' size={22} />
					</Pressable>
				}
			/>
			<Text>Reviews Content</Text>
		</View>
	);
}
