import { ActivityIndicator, Image, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/featured-products';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Quantity } from '@/components/quantity';
import Ratings from '@/components/rating';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { strapiService } from '@/services/strapi';
import { useCartStore } from '@/store/use-cart';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function ProductDetail() {
	const { productId } = useLocalSearchParams<{ productId: string }>();
	const { user } = useUser();
	const { addItem } = useCartStore();
	const [quantity, setQuantity] = useState(1);

	const { data, status, error, refetch } = useQuery({
		queryKey: ['product', productId],
		queryFn: () => strapiService.getProductById(productId),
	});

	if (status === 'pending') {
		return (
			<View className='flex-1 items-center justify-center'>
				<ActivityIndicator size='large' color={Colors.light.primaryDark} />
			</View>
		);
	}

	if (status === 'error') {
		return (
			<View className='flex-1 items-center justify-center gap-2'>
				<Text className='text-red-500'>{error?.message}</Text>
				<Button onPress={() => refetch()}>Try again</Button>
			</View>
		);
	}

	const isFavorite = data.favorites?.some(
		favorite => favorite.clerkId === user?.id
	);

	const reviews = data?.reviews ?? [];

	const reviewsCount = reviews.length;

	const averageRating =
		reviewsCount === 0
			? 0
			: Number(
					(
						reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
					).toFixed(1)
				);

	return (
		<ParallaxScrollView
			headerImage={
				<Image source={{ uri: data?.image.url }} className='w-full h-full' />
			}
		>
			<View className='gap-1 relative'>
				<FavoriteButton
					size={22}
					productId={productId}
					favoriteId={
						data?.favorites?.find(f => f.clerkId === user?.id)?.documentId
					}
					isFavorite={isFavorite}
					className='w-6 h-6 top-0 right-0 bg-transparent'
				/>
				<Text className='text-primary-dark font-sans-medium'>
					{data?.price.toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					})}
				</Text>
				<Text className='font-sans-medium text-xl text-gray-900'>
					{data?.name}
				</Text>
				<Text className='text-text font-sans-medium text-sm'>{data?.unit}</Text>
				<Ratings
					initialRating={averageRating}
					reviewsCount={reviewsCount}
					productId={productId}
					clerkId={user?.id}
				/>
			</View>
			<Text className='text-text font-sans text-sm'>
				Organic Mountain works as a seller for many organic growers of organic
				lemons. Organic lemons are easy to spot in your produce aisle. They are
				just like regular lemons, but they will usually have a few more scars on
				the outside of the lemon skin. Organic lemons are considered to be the
				world&apos;s finest lemon for juicing
			</Text>
			<Quantity productId={productId} setQuantity={setQuantity} />
			<Button
				onPress={() => {
					addItem({ ...data, quantity });
					Toast.show({
						type: 'success',
						text1: 'Added to cart',
					});
				}}
				color='primary'
				icon={
					<Icon name='ShoppingBag' size={20} color={Colors.light.background} />
				}
			>
				Add to Cart
			</Button>
		</ParallaxScrollView>
	);
}
