import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type StarRatingProps = {
	rating: number;
	maxStars?: number;
	size?: number;
	filledColor?: string;
	emptyColor?: string;
	readOnly?: boolean;
	onRate?: (rating: number) => void;
};

export const StarRating = ({
	rating,
	maxStars = 5,
	size = 24,
	filledColor = '#FFC107',
	emptyColor = '#FFC107',
	readOnly = true,
	onRate,
}: StarRatingProps) => {
	const renderStar = (index: number) => {
		let iconName: keyof typeof FontAwesome.glyphMap = 'star-o';

		// Logic to determine which FontAwesome star to show
		if (rating >= index) {
			iconName = 'star'; // Full star
		} else if (rating >= index - 0.5) {
			iconName = 'star-half-full'; // Built-in half star
		}

		const starIcon = (
			<FontAwesome
				name={iconName}
				size={size}
				color={rating >= index - 0.5 ? filledColor : emptyColor}
			/>
		);

		// If viewing only, just return the icon
		if (readOnly) {
			return (
				<View key={index} style={styles.starWrapper}>
					{starIcon}
				</View>
			);
		}

		return (
			<TouchableOpacity
				key={index}
				activeOpacity={0.6}
				onPress={() => onRate?.(index)}
				style={styles.starWrapper}
			>
				{starIcon}
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{Array.from({ length: maxStars }, (_, i) => renderStar(i + 1))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	starWrapper: {
		marginHorizontal: 2, // Slight spacing for better touch targets
	},
});
