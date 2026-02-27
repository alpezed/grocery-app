import { Colors } from '@/constants/theme';
import { banners } from '@/data/banners';
import { FlashList } from '@shopify/flash-list';
import type { ViewabilityConfigCallbackPairs } from '@shopify/flash-list/dist/FlashListProps';
import React, { useRef, useState } from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
	ViewToken,
	ViewabilityConfig,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';

const viewabilityConfig: ViewabilityConfig = {
	itemVisiblePercentThreshold: 50,
};

function PaginationDot({
	isActive,
	onPress,
}: {
	isActive: boolean;
	onPress: () => void;
}) {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(isActive ? 20 : 6, { duration: 150 }),
			backgroundColor: withTiming(
				isActive ? Colors.light.primaryDark : Colors.light.backgroundLight,
				{
					duration: 150,
				}
			),
		};
	}, [isActive]);

	return (
		<Pressable
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			onPress={onPress}
			className='relative'
		>
			<Animated.View style={[styles.paginationDot, animatedStyle]} />
		</Pressable>
	);
}

export default function Banners() {
	const flashListRef =
		useRef<React.ComponentRef<typeof FlashList<(typeof banners)[0]>>>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const onViewableItemsChanged = ({
		viewableItems,
	}: {
		viewableItems: ViewToken[];
	}) => {
		setCurrentIndex(+viewableItems[0]?.key - 1);
	};

	const viewabilityConfigCallbackPairs = useRef<
		ViewabilityConfigCallbackPairs<(typeof banners)[0]> | undefined
	>([{ onViewableItemsChanged, viewabilityConfig }]);

	const renderBannerItem = ({ item }: { item: (typeof banners)[0] }) => {
		return (
			<View className='flex-row gap-2.5 relative'>
				<View>
					<Image
						source={item.image}
						className='h-60 w-full object-cover'
						style={styles.banner}
					/>
					<Text className='absolute bottom-16 left-10 right-0 p-2.5 text-black text-lg font-bold max-w-52 font-sans-bold'>
						{item.title}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<View className='relative'>
			<FlashList
				ref={flashListRef}
				horizontal
				pagingEnabled
				data={banners}
				keyExtractor={item => item.id.toString()}
				renderItem={renderBannerItem}
				showsHorizontalScrollIndicator={false}
				viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
				initialScrollIndex={0}
			/>
			<View className='flex-row gap-1.5 absolute bottom-6 left-6 right-0'>
				{banners.map((_, index) => (
					<PaginationDot
						key={`page-${index}`}
						isActive={currentIndex === index}
						onPress={() =>
							flashListRef.current?.scrollToIndex({
								index,
								animated: true,
							})
						}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	banner: {
		width: Dimensions.get('window').width - 32,
	},
	paginationDot: {
		height: 6,
		borderRadius: 100,
		backgroundColor: Colors.light.backgroundLight,
	},
});
