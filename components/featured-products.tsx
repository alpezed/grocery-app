import SectionText from '@/components/section-text';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import {
	useMarkAsFavorite,
	useProducts,
	useRemoveFromFavorite,
} from '@/lib/queries/products';
import { Product } from '@/schema/product.schema';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

function FavoriteButton({
	favoriteId,
	productId,
	isFavorite,
	userId,
}: {
	favoriteId?: string;
	productId: number;
	isFavorite: boolean;
	userId?: string;
}) {
	const { mutateAsync: markAsFavorite, isPending: isMarkingAsFavorite } =
		useMarkAsFavorite();
	const { mutateAsync: removeFromFavorite, isPending: isRemovingFromFavorite } =
		useRemoveFromFavorite();

	const onMarkAsFavorite = async () => {
		if (!userId) return;
		if (isFavorite && favoriteId) {
			await removeFromFavorite(favoriteId);
		} else {
			await markAsFavorite({ productId, userId });
		}
	};

	const isLoading = isMarkingAsFavorite || isRemovingFromFavorite;

	return (
		<Pressable
			style={styles.favoriteButton}
			onPress={onMarkAsFavorite}
			disabled={isLoading}
			className={isLoading ? 'opacity-50' : 'disabled:opacity-50'}
		>
			<Icon
				name='Heart'
				size={16}
				color={isFavorite ? 'white' : Colors.light.text}
				fill={isFavorite ? Colors.light.heart : 'none'}
				stroke={isFavorite ? Colors.light.heart : Colors.light.text}
			/>
		</Pressable>
	);
}

export default function FeaturesProducts() {
	const router = useRouter();
	const { data, isLoading, error, status } = useProducts();
	const { user } = useUser();

	const renderProductItem = ({ item }: { item: Product }) => {
		const isFavorite = item.favorites?.some(
			favorite => favorite.clerkId === user?.id
		);

		const getFavoriteId = () => {
			return item.favorites?.find(favorite => favorite.clerkId === user?.id)
				?.documentId;
		};

		return (
			<View style={styles.categoryItemContainer}>
				{/* {item.isNew && (
					<View style={styles.newBadge}>
						<Text style={styles.newBadgeText}>New</Text>
					</View>
				)} */}
				<FavoriteButton
					favoriteId={getFavoriteId()}
					productId={item.id}
					isFavorite={isFavorite}
					userId={user?.id}
				/>
				<Pressable
					style={({ pressed }) => [
						styles.productItem,
						{ opacity: pressed ? 0.8 : 1 },
					]}
					onPress={() => router.push(`/products/${item.documentId}`)}
				>
					<Image source={item.image} style={styles.productItemImage} />
					<View className='py-2'>
						<Text style={styles.productPrice}>
							{item.price.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD',
							})}
						</Text>
						<Text style={styles.productItemText}>{item.name}</Text>
						<Text style={styles.productUnit}>{item.unit}</Text>
					</View>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						styles.addToCartContainer,
						{ opacity: pressed ? 0.8 : 1 },
					]}
				>
					<Icon name='ShoppingBag' size={14} color={Colors.light.primaryDark} />
					<Text style={styles.addToCartText}>Add to cart</Text>
				</Pressable>
			</View>
		);
	};

	if (error) {
		return <Text className='text-red-500'>Error: {error.message}</Text>;
	}

	return (
		<View style={styles.container}>
			<SectionText
				title='Featured Products'
				onPress={() => {
					console.log('All categories');
				}}
			/>
			{isLoading && (
				<View className='flex-1 items-center justify-center py-18'>
					<ActivityIndicator size='small' color={Colors.light.primaryDark} />
				</View>
			)}
			{status === 'success' && (
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
