import { useUser } from '@clerk/clerk-expo';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import ProductCard from '@/components/product-card';
import { Colors } from '@/constants/theme';
import { useProducts } from '@/lib/queries/products';
import { Filter } from '@/schema/filter.schema';
import { Product } from '@/schema/product.schema';
import { useCartStore } from '@/store/use-cart';

export default function SearchResultsScreen() {
	const { query, filters } = useLocalSearchParams<{
		query: string;
		filters: string;
	}>();
	const parsedFilters = filters
		? (JSON.parse(filters as string) as Filter)
		: undefined;
	const {
		data: products,
		status,
		error,
	} = useProducts({
		name: query as string,
		price: {
			$gte: parsedFilters?.price?.min,
			$lte: parsedFilters?.price?.max,
		},
		reviews: {
			rating: {
				$gte: parsedFilters?.rating,
			},
		},
		freeShipping: { $eq: parsedFilters?.freeShipping },
		// TODO: Add same day delivery and discount filters
		// sameDayDelivery: parsedFilters.sameDayDelivery,
		// discount: parsedFilters.discount,
	});
	const { user } = useUser();
	const { addItem } = useCartStore();

	const renderProductItem = ({ item }: { item: Product }) => {
		const isFavorite = item.favorites?.some(
			favorite => favorite.clerkId === user?.id
		);

		const getFavoriteId = () => {
			return item.favorites?.find(favorite => favorite.clerkId === user?.id)
				?.documentId;
		};

		return (
			<ProductCard
				product={item}
				favoriteId={getFavoriteId()}
				isFavorite={isFavorite}
				className='w-full'
				onAddToCart={() => {
					addItem({ ...item, quantity: 1 });
					Toast.show({
						type: 'success',
						text1: 'Added to cart',
					});
				}}
			/>
		);
	};

	return (
		<View className='flex-1 bg-background-light'>
			<AppHeader
				title={`${query ? (query.length >= 10 ? `Search: ${query?.substring(0, 10)}...` : `Search: ${query}`) : 'Search Results'}`}
			/>
			{products?.data.length === 0 && status !== 'pending' ? (
				<EmptyState>
					<EmptyState.Icon icon='ShoppingCart' size={120} />
					<EmptyState.Title>No products found</EmptyState.Title>
					<EmptyState.Description>
						Try searching for something else.
					</EmptyState.Description>
				</EmptyState>
			) : (
				<View className='flex-1'>
					{status === 'pending' ? (
						<View className='flex-1 items-center justify-center py-18'>
							<ActivityIndicator
								size='large'
								color={Colors.light.primaryDark}
							/>
						</View>
					) : status === 'error' ? (
						<Text className='text-red-500'>Error: {error?.message}</Text>
					) : (
						<FlashList
							data={products?.data}
							numColumns={2}
							keyExtractor={item => item.documentId}
							renderItem={({ item, index }) => (
								<View
									style={{
										flex: 1,
										// Add horizontal gap:
										// If it's the left column (index % 2 === 0), add margin to the right.
										// If it's the right column, add margin to the left.
										paddingLeft: index % 2 === 0 ? 0 : 8,
										paddingRight: index % 2 === 0 ? 8 : 0,
									}}
								>
									{renderProductItem({ item })}
								</View>
							)}
							contentContainerClassName='p-4'
						/>
					)}
				</View>
			)}
		</View>
	);
}
