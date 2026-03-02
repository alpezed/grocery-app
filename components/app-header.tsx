import { Icon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type HeaderItemProps = {
	/**
	 * Tint color for the header.
	 */
	tintColor?: string;
	/**
	 * Whether it's possible to navigate back in stack.
	 */
	canGoBack?: boolean;
};

type AppHeaderProps = {
	title: string;
	showBack?: boolean;
	headerRight?: React.ReactNode | ((props: HeaderItemProps) => React.ReactNode);
};

export default function AppHeader({
	title,
	showBack = true,
	headerRight,
}: AppHeaderProps) {
	const router = useRouter();

	return (
		<View className='bg-white justify-end h-28'>
			<View className='flex-row items-center justify-between px-4 py-4'>
				<View className='flex-1 items-start'>
					{showBack && (
						<Pressable
							onPress={() => router.back()}
							hitSlop={20}
							style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
							className='p-1'
						>
							<Icon name='ArrowLeft' size={22} color='black' />
						</Pressable>
					)}
				</View>
				<View className='flex-3 items-center'>
					<Text className='text-lg font-sans-medium'>{title}</Text>
				</View>
				<View className='flex-1 items-end p-1'>
					{headerRight && typeof headerRight === 'function'
						? headerRight({ tintColor: 'black', canGoBack: true })
						: headerRight}
				</View>
			</View>
		</View>
	);
}
