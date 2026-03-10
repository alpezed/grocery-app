import AppHeader from '@/components/app-header';
import ProductList from '@/components/product-list';
import { Colors } from '@/constants/theme';
import { useGetFavoriteProducts } from '@/lib/queries/products';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function FavoritesScreen() {
	const { data: products, status } = useGetFavoriteProducts();
	return (
		<View className='flex-1 bg-background-light'>
			<AppHeader title='Favorites' />
			{status === 'pending' && (
				<View className='flex-1 justify-center gap-4 px-4 py-8'>
					<ActivityIndicator size='large' color={Colors.light.primaryDark} />
				</View>
			)}
			{status === 'success' && <ProductList products={products} />}
		</View>
	);
}
