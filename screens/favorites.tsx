import AppHeader from '@/components/app-header';
import ProductList from '@/components/product-list';
import { useGetFavoriteProducts } from '@/lib/queries/products';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function FavoritesScreen() {
	const { data: products, status } = useGetFavoriteProducts();
	return (
		<View className='flex-1'>
			<AppHeader title='Favorites' />
			{status === 'pending' && <ActivityIndicator />}
			{status === 'success' && <ProductList products={products} />}
		</View>
	);
}
