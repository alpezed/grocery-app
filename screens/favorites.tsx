import AppHeader from '@/components/app-header';
import ProductList from '@/components/product-list';
import React from 'react';
import { View } from 'react-native';

export default function FavoritesScreen() {
	return (
		<View className='flex-1'>
			<AppHeader title='Favorites' />
			<ProductList />
		</View>
	);
}
