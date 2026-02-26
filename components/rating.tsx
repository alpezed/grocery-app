import { Colors } from '@/constants/theme';
import { Rating } from '@kolking/react-native-rating';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

export default function Ratings() {
	const [rating, setRating] = useState(0);

	const handleChange = useCallback(
		(value: number) => setRating(Math.round((rating + value) * 5) / 10),
		[rating]
	);

	return (
		<View className='flex-row items-center gap-1'>
			<Text className='font-sans text-sm'>{rating}</Text>
			<Rating
				size={15}
				rating={rating}
				onChange={handleChange}
				fillColor={Colors.light.rating}
				variant='stars-outline'
				baseColor={Colors.light.rating}
			/>
			<Text className='text-text font-sans text-sm'>(89 reviews)</Text>
		</View>
	);
}
