import { StarRating } from '@/components/ui/rating';
import { ReviewResponse } from '@/schema/review.schema';
import type { UserJSON } from '@clerk/shared/types';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Image, Text, View } from 'react-native';

function UserInfo({ user }: { user: UserJSON }) {
	const displayDate = formatDistanceToNow(new Date(user.created_at), {
		addSuffix: true,
	});

	return (
		<View className='flex-row items-center gap-2'>
			<Image
				source={{ uri: user.image_url }}
				className='w-10 h-10 rounded-full'
			/>
			<View>
				<Text className='text-base font-sans-bold'>
					{user.first_name && user.last_name
						? `${user.first_name} ${user.last_name}`
						: user.username
							? user.username
							: 'Unknown'}
				</Text>
				<Text className='text-xs text-gray-500 font-sans'>{displayDate}</Text>
			</View>
		</View>
	);
}

export default function Review({
	review,
	user,
}: {
	review: ReviewResponse;
	user?: UserJSON;
}) {
	return (
		<View className='p-4.5 bg-white rounded-lg gap-2 shadow-2xs'>
			{user && <UserInfo user={user} />}
			<View className='border-b border-gray-200 my-2' />
			<View className='gap-1'>
				<View className='flex-row items-center gap-1'>
					<Text className='font-sans-medium'>{review.rating}</Text>
					<StarRating rating={review.rating} size={20} />
				</View>
				<Text className='text-sm text-gray-500 font-sans'>{review.review}</Text>
			</View>
		</View>
	);
}
