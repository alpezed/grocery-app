import AppHeader from '@/components/app-header';
import Review from '@/components/review';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { clerkService } from '@/services/clerk';
import { strapiService } from '@/services/strapi';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	View,
} from 'react-native';

export default function Reviews() {
	const router = useRouter();
	const { productId, clerkId } = useLocalSearchParams<{
		productId: string;
		clerkId: string;
	}>();

	const { data: users } = useQuery({
		queryKey: ['users'],
		queryFn: () => clerkService.getUsers(),
	});

	const {
		data: reviews,
		status: reviewsStatus,
		error: reviewsError,
		refetch: reviewsRefetch,
	} = useQuery({
		queryKey: ['reviews', productId],
		queryFn: () => strapiService.getReviewsByProductId(productId),
	});

	if (reviewsStatus === 'pending') {
		return (
			<View className='flex-1 items-center justify-center'>
				<ActivityIndicator />
			</View>
		);
	}

	if (reviewsStatus === 'error') {
		return (
			<View className='flex-1 items-center justify-center gap-2'>
				<Text className='text-red-500'>{reviewsError?.message}</Text>
				<Button onPress={() => reviewsRefetch()}>Try again</Button>
			</View>
		);
	}

	return (
		<View className='flex-1'>
			<AppHeader
				title='Reviews'
				showBack={true}
				headerRight={
					<Pressable
						onPress={() =>
							router.push({
								pathname: '/reviews/create',
								params: {
									productId,
									clerkId,
								},
							})
						}
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
					>
						<Icon name='CirclePlus' size={22} />
					</Pressable>
				}
			/>
			<View className='flex-1 p-4'>
				{reviews && reviews.length > 0 ? (
					<FlatList
						data={reviews}
						renderItem={({ item }) => (
							<Review
								review={item}
								user={users?.find(user => user.id === item.clerkId)}
							/>
						)}
					/>
				) : (
					<View className='flex-1 justify-center gap-2'>
						<View className='items-center mb-3'>
							<Icon
								name='MessageSquareX'
								size={150}
								color={Colors.light.primaryDark}
								strokeWidth={1}
							/>
						</View>
						<Text className='font-sans-medium text-lg text-center'>
							No reviews found
						</Text>
						<Text className='font-sans text-text text-center mb-4'>
							Be the first to review this product
						</Text>
						<Button
							onPress={() =>
								router.push({
									pathname: '/reviews/create',
									params: {
										productId,
										clerkId,
									},
								})
							}
						>
							Write a review
						</Button>
					</View>
				)}
			</View>
		</View>
	);
}
