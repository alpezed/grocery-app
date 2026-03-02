import AppHeader from '@/components/app-header';
import { Icon } from '@/components/ui/icon';
import { PRODUCT_CATEGORIES } from '@/data/categories';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function ProductCategoriesScreen() {
	const router = useRouter();

	const renderCategoryItem = ({
		item,
	}: {
		item: (typeof PRODUCT_CATEGORIES)[0];
	}) => {
		return (
			<View className='gap-3 mr-2 mb-2 bg-white rounded p-4'>
				<Pressable
					style={({ pressed }) => [
						{ backgroundColor: item.color.background },
						{ opacity: pressed ? 0.8 : 1 },
					]}
					onPress={() => {
						router.push(`/(products)/categories/${item.id}`);
					}}
					className='items-center justify-center w-13 h-13 rounded-full p-2.5 mx-auto'
				>
					<item.icon width={20} height={20} color={item.color.primary} />
				</Pressable>
				<Text className='text-center font-sans-medium text-[10px] text-text'>
					{item.label}
				</Text>
			</View>
		);
	};

	return (
		<View className='flex-1'>
			<AppHeader
				title='Categories'
				headerRight={
					<Pressable
						onPress={() => router.push('/reviews/create')}
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
					>
						<Icon name='SlidersHorizontal' size={22} />
					</Pressable>
				}
			/>
			<View className='flex-1 p-2.5'>
				<FlashList
					data={PRODUCT_CATEGORIES}
					showsHorizontalScrollIndicator={false}
					initialScrollIndex={0}
					numColumns={3}
					keyExtractor={item => item.id.toString()}
					renderItem={renderCategoryItem}
				/>
			</View>
		</View>
	);
}
