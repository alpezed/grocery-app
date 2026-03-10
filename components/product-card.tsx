import { FavoriteButton } from '@/components/featured-products';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { Product } from '@/schema/product.schema';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export default function ProductCard({
	product,
	favoriteId,
	isFavorite,
	onAddToCart,
}: {
	product: Product;
	favoriteId?: string;
	isFavorite: boolean;
	onAddToCart: () => void;
}) {
	return (
		<View className='bg-background mb-3.5 w-[48%]'>
			{/* {item.isNew && (
					<View style={styles.newBadge}>
						<Text style={styles.newBadgeText}>New</Text>
					</View>
				)} */}
			<FavoriteButton
				favoriteId={favoriteId}
				productId={product.documentId}
				isFavorite={isFavorite}
			/>
			<Pressable
				style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
				className='items-center justify-center gap-2'
				onPress={() => router.push(`/products/${product.documentId}`)}
			>
				<Image
					source={product.image}
					className='h-[140px] w-full resize-cover'
				/>
				<View className='py-2'>
					<Text className='text-primary-dark text-xs font-sans-medium text-center'>
						{product.price.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</Text>
					<Text className='text-base font-sans-medium text-center'>
						{product.name}
					</Text>
					<Text className='text-xs font-sans text-center text-text'>
						{product.unit}
					</Text>
				</View>
			</Pressable>
			<Pressable
				style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
				className='flex-row items-center justify-center gap-1.5 bg-background border-t border-border py-3 px-2.5'
				onPress={onAddToCart}
			>
				<Icon name='ShoppingBag' size={14} color={Colors.light.primaryDark} />
				<Text className='text-xs font-medium text-center'>Add to cart</Text>
			</Pressable>
		</View>
	);
}
