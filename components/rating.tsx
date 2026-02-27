import { Colors } from '@/constants/theme';
import { Rating } from '@kolking/react-native-rating';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Ratings() {
	const router = useRouter();
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
			<Pressable
				style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
				onPress={() => router.push('/reviews')}
			>
				<Text className='text-text font-sans text-sm'>(89 reviews)</Text>
			</Pressable>
		</View>
	);
}
