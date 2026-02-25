import { Colors } from '@/constants/theme';
import { useOnboardingStore } from '@/store/use-onboarding';
import { FlashList } from '@shopify/flash-list';
import type { ViewabilityConfigCallbackPairs } from '@shopify/flash-list/dist/FlashListProps';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
	ViewabilityConfig,
	ViewToken,
} from 'react-native';

const onboardingData = [
	{
		id: 1,
		title: 'Buy Grocery',
		description:
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
		imagePath: require('@/assets/images/onboard-img-3-1.png'),
	},
	{
		id: 2,
		title: 'Fast Delivery',
		description:
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
		imagePath: require('@/assets/images/onboard-img-3-2.png'),
	},
	{
		id: 3,
		title: 'Enjoy Quality Food',
		description:
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
		imagePath: require('@/assets/images/onboard-img-3-3.png'),
	},
];

const viewabilityConfig: ViewabilityConfig = {
	itemVisiblePercentThreshold: 50,
};

export default function Onboarding() {
	const flashListRef =
		useRef<React.ComponentRef<typeof FlashList<(typeof onboardingData)[0]>>>(
			null
		);
	const [currentIndex, setCurrentIndex] = useState(0);
	const router = useRouter();

	const onViewableItemsChanged = ({
		viewableItems,
	}: {
		viewableItems: ViewToken[];
	}) => {
		setCurrentIndex(+viewableItems[0]?.key - 1);
	};

	const viewabilityConfigCallbackPairs = useRef<
		ViewabilityConfigCallbackPairs<(typeof onboardingData)[0]> | undefined
	>([{ onViewableItemsChanged, viewabilityConfig }]);

	const scrollToNextItem = () => {
		// Check if there is a next item
		if (currentIndex < onboardingData.length - 1) {
			const nextIndex = currentIndex + 1;
			// Use scrollToIndex to move to the next item
			flashListRef.current?.scrollToIndex({
				index: nextIndex,
				animated: true,
			});
		} else {
			router.push('/(auth)/login');
			useOnboardingStore.getState().complete();
		}
	};

	const onSkipOnboarding = () => {
		router.push('/(auth)/login');
		useOnboardingStore.getState().complete();
	};

	const renderOnboardingItem = ({
		item,
	}: {
		item: (typeof onboardingData)[0];
	}) => {
		return (
			<View style={styles.item}>
				<View style={styles.imageContainer}>
					<Image source={item.imagePath} style={styles.image} />
				</View>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>{item.title}</Text>
					<Text style={styles.description}>{item.description}</Text>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlashList
				ref={flashListRef}
				horizontal
				pagingEnabled
				data={onboardingData}
				keyExtractor={item => item.id.toString()}
				renderItem={renderOnboardingItem}
				showsHorizontalScrollIndicator={false}
				viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
				initialScrollIndex={0}
			/>
			<View style={styles.paginationContainer}>
				<Pressable onPress={onSkipOnboarding}>
					<Text style={styles.paginationText}>Skip</Text>
				</Pressable>
				<View style={styles.paginationBullets}>
					{onboardingData.map((data, index) => (
						<View
							key={data.id}
							style={[
								styles.bullet,
								currentIndex === index ? styles.bulletActive : '',
							]}
						/>
					))}
				</View>
				<Pressable onPress={scrollToNextItem}>
					<Text style={[styles.paginationText, styles.paginationTextActive]}>
						Next
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
	},
	item: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingTop: 50,
	},
	image: {
		width: 380,
		height: 380,
	},
	titleContainer: {
		flex: 0.4,
		alignItems: 'center',
		paddingInline: 20,
		gap: 12,
	},
	title: {
		fontFamily: 'Montserrat-Bold',
		fontSize: 25,
		textAlign: 'center',
	},
	description: {
		textAlign: 'center',
		fontSize: 15,
		color: Colors.light.text,
		lineHeight: 20,
		fontFamily: 'Montserrat',
	},
	paginationContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		bottom: 80,
		width: Dimensions.get('window').width,
		paddingInline: 50,
		zIndex: 10,
	},
	paginationText: {
		fontSize: 15,
		color: Colors.light.text,
		fontFamily: 'Montserrat-SemiBold',
	},
	paginationTextActive: {
		color: Colors.light.primaryDark,
	},
	paginationTextDisabled: {
		opacity: 0.5,
	},
	paginationBullets: {
		flexDirection: 'row',
		gap: 6,
	},
	bullet: {
		width: 8,
		height: 8,
		backgroundColor: '#DCDCDC',
		borderRadius: '100%',
	},
	bulletActive: {
		backgroundColor: Colors.light.primaryDark,
	},
});
