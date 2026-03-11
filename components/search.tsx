import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Search() {
	const router = useRouter();

	return (
		<Pressable
			onPress={() => router.push('/search')}
			className='flex-row items-center w-full h-[50px] bg-background-light rounded-lg'
			style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
		>
			<View className='absolute z-10 top-0 bottom-0 left-5 justify-center items-center'>
				<Icon name='Search' size={20} color={Colors.light.text} />
			</View>
			<Text className='font-sans text-text text-sm flex-1 pl-14'>
				Search keywords..
			</Text>
			<View className='absolute z-10 top-0 bottom-0 right-5 justify-center items-center'>
				<Icon name='SlidersHorizontal' size={20} color={Colors.light.text} />
			</View>
		</Pressable>
	);
}
