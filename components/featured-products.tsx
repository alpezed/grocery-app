import SectionText from '@/components/section-text';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { PRODUCTS } from '@/data/products';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function FeaturesProducts() {
	const router = useRouter();

	const renderProductItem = ({ item }: { item: (typeof PRODUCTS)[0] }) => {
		return (
			<View style={styles.categoryItemContainer}>
				{item.isNew && (
					<View style={styles.newBadge}>
						<Text style={styles.newBadgeText}>New</Text>
					</View>
				)}
				<Pressable style={styles.favoriteButton}>
					<Icon
						name='Heart'
						size={16}
						color={item.isFavorite ? 'white' : Colors.light.text}
						fill={item.isFavorite ? Colors.light.heart : 'none'}
						stroke={item.isFavorite ? Colors.light.heart : Colors.light.text}
					/>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						styles.productItem,
						{ opacity: pressed ? 0.8 : 1 },
					]}
					onPress={() => router.push(`/products/${item.id}`)}
				>
					<Image
						source={require('@/assets/images/products/peach.png')}
						style={styles.productItemImage}
					/>
					<Text style={styles.productPrice}>
						{item.price.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</Text>
					<Text style={styles.productItemText}>{item.name}</Text>
					<Text style={styles.productUnit}>{item.unit}</Text>
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

	return (
		<View style={styles.container}>
			<SectionText
				title='Featured Products'
				onPress={() => {
					console.log('All categories');
				}}
			/>
			<FlatList
				data={PRODUCTS}
				numColumns={2}
				keyExtractor={item => item.id.toString()}
				renderItem={renderProductItem}
				scrollEnabled={false}
				columnWrapperStyle={{ gap: 10, justifyContent: 'space-between' }}
			/>
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
		paddingVertical: 10,
		height: 130,
		width: '100%',
		resizeMode: 'contain',
	},
	productUnit: {
		fontSize: 12,
		fontFamily: 'Montserrat',
		textAlign: 'center',
		color: Colors.light.text,
		marginBottom: 10,
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
	},
	newBadge: {
		position: 'absolute',
		top: 0,
		left: 0,
		backgroundColor: Colors.light.badgeBg,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	newBadgeText: {
		fontSize: 10,
		fontFamily: 'Montserrat-SemiBold',
		color: Colors.light.badgeText,
	},
});
