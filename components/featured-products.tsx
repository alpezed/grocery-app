import ProductCard from '@/components/product-card';
import SectionText from '@/components/section-text';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import {
	useMarkAsFavorite,
	useProducts,
	useRemoveFromFavorite,
} from '@/lib/queries/products';
import { Product } from '@/schema/product.schema';
import { useCartStore } from '@/store/use-cart';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export function FavoriteButton({
	favoriteId,
	productId,
	isFavorite,
	className,
	size = 16,
}: {
	favoriteId?: string;
	productId: string;
	isFavorite: boolean;
	className?: string;
	size?: number;
}) {
	const queryClient = useQueryClient();
	const { mutateAsync: markAsFavorite, isPending: isMarkingAsFavorite } =
		useMarkAsFavorite();
	const { mutateAsync: removeFromFavorite, isPending: isRemovingFromFavorite } =
		useRemoveFromFavorite();
	const { user } = useUser();
	const { isSignedIn } = useAuth();

	if (!isSignedIn) return null;

	const onMarkAsFavorite = async () => {
		if (!user?.id) return;
		if (isFavorite && favoriteId) {
			await removeFromFavorite(favoriteId);
		} else {
			await markAsFavorite({ productId, userId: user.id });
		}
		console.log('invalidating product', productId);
		queryClient.invalidateQueries({ queryKey: ['product', productId] });
	};

	const isLoading = isMarkingAsFavorite || isRemovingFromFavorite;

	return (
		<Pressable
			onPress={onMarkAsFavorite}
			disabled={isLoading}
			className={`absolute top-2.5 right-2.5 bg-white rounded-full p-[5px] z-1 ${className} ${isLoading ? 'opacity-50' : 'disabled:opacity-50'}`}
		>
			<Icon
				name='Heart'
				size={size}
				color={isFavorite ? 'white' : Colors.light.text}
				fill={isFavorite ? Colors.light.heart : 'none'}
				stroke={isFavorite ? Colors.light.heart : Colors.light.text}
			/>
		</Pressable>
	);
}

export default function FeaturesProducts() {
	const { data, error, status } = useProducts();
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
		<View style={styles.container}>
			<SectionText
				title='Featured Products'
				onPress={() => {
					console.log('All categories');
				}}
			/>
			{status === 'pending' ? (
				<View className='flex-1 items-center justify-center py-18'>
					<ActivityIndicator size='small' color={Colors.light.primaryDark} />
				</View>
			) : status === 'error' ? (
				<Text className='text-red-500'>Error: {error?.message}</Text>
			) : (
				<FlatList
					data={data}
					numColumns={2}
					keyExtractor={item => item.documentId}
					renderItem={renderProductItem}
					scrollEnabled={false}
					columnWrapperStyle={{ gap: 10, justifyContent: 'space-between' }}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 10,
		marginTop: 5,
	},
	categoryItemContainer: {
		width: '48%',
		backgroundColor: Colors.light.background,
		marginBottom: 15,
	},
	productItem: {
		alignItems: 'center',
		justifyContent: 'center',
		gap: 4,
	},
	productPrice: {
		fontSize: 12,
		fontFamily: 'Montserrat-SemiBold',
		textAlign: 'center',
		color: Colors.light.primaryDark,
	},
	productItemText: {
		fontSize: 15,
		fontFamily: 'Montserrat-SemiBold',
		textAlign: 'center',
	},
	productItemImage: {
		height: 140,
		width: '100%',
		resizeMode: 'cover',
	},
	productUnit: {
		fontSize: 12,
		fontFamily: 'Montserrat',
		textAlign: 'center',
		color: Colors.light.text,
	},
	addToCartContainer: {
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 10,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		borderTopColor: Colors.light.border,
		borderTopWidth: 1,
	},
	addToCartText: {
		fontSize: 12,
		fontFamily: 'Montserrat-SemiBold',
		textAlign: 'center',
	},
	favoriteButton: {
		position: 'absolute',
		top: 9,
		right: 9,
		backgroundColor: 'white',
		borderRadius: 100,
		padding: 5,
		zIndex: 1,
	},
	newBadge: {
		position: 'absolute',
		top: 0,
		left: 0,
		backgroundColor: Colors.light.badgeBg,
		paddingHorizontal: 8,
		paddingVertical: 4,
		zIndex: 1,
	},
	newBadgeText: {
		fontSize: 10,
		fontFamily: 'Montserrat-SemiBold',
		color: Colors.light.badgeText,
	},
});
