import { StarRating } from '@/components/ui/rating';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Ratings({
	initialRating,
	reviewsCount,
}: {
	initialRating: number;
	reviewsCount: number;
}) {
	const router = useRouter();

	return (
		<View className='flex-row items-center gap-1'>
			<Text className='font-sans text-sm'>{initialRating}</Text>
			<Link href='/reviews/create'>
				<StarRating rating={initialRating} maxStars={5} size={16} />
			</Link>
			<Pressable
				style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
				onPress={() => router.push('/reviews')}
			>
				<Text className='text-text font-sans text-sm'>
					({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})
				</Text>
			</Pressable>
		</View>
	);
}
