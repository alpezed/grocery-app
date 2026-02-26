import type { PropsWithChildren, ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollOffset,
} from 'react-native-reanimated';

import Icon from '@/components/ui/icon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const HEADER_HEIGHT = 350;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor?: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor = { light: '#D0D0D0', dark: '#353636' },
}: Props) {
	const router = useRouter();

	const colorScheme = useColorScheme() ?? 'light';
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollOffset(scrollRef);
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	});

	return (
		<View className='flex-1'>
			<Pressable
				className='absolute top-16 left-3 p-2.5 z-50 rounded-full bg-background-light'
				onPress={() => router.back()}
			>
				<Icon name='ArrowLeft' size={24} />
			</Pressable>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				className='bg-background-light flex-1 relative'
			>
				<Animated.View
					style={[
						styles.header,
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle,
					]}
				>
					{headerImage}
				</Animated.View>
				<View className='flex-1 gap-4 overflow-hidden p-6 rounded-tl-3xl rounded-tr-3xl -mt-4 bg-background-light'>
					{children}
				</View>
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		height: HEADER_HEIGHT,
		overflow: 'hidden',
	},
});
