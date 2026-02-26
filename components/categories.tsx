import Icon from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { PRODUCT_CATEGORIES } from '@/data/categories';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Categories() {
	const renderCategoryItem = ({
		item,
	}: {
		item: (typeof PRODUCT_CATEGORIES)[0];
	}) => {
		return (
			<View style={styles.categoryItemContainer}>
				<Pressable
					style={({ pressed }) => [
						styles.categoryItem,
						{ backgroundColor: item.color.background },
						{ opacity: pressed ? 0.8 : 1 },
					]}
					onPress={() => {
						console.log('item.label', item.label);
					}}
				>
					<item.icon width={20} height={20} color={item.color.primary} />
				</Pressable>
				<Text style={styles.categoryItemText}>{item.label}</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.categoriesHeader}>
				<Text style={styles.categoriesHeaderText}>Categories</Text>
				<Pressable
					style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
					onPress={() => {
						console.log('All categories');
					}}
				>
					<Icon name='ChevronRight' size={22} color={Colors.light.text} />
				</Pressable>
			</View>
			<FlashList
				data={PRODUCT_CATEGORIES}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				initialScrollIndex={0}
				keyExtractor={item => item.id.toString()}
				renderItem={renderCategoryItem}
				ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingVertical: 10,
	},
	categoryItemContainer: {
		gap: 12,
	},
	categoryItem: {
		width: 52,
		height: 52,
		backgroundColor: 'red',
		borderRadius: '100%',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryItemText: {
		fontSize: 10,
		fontFamily: 'Montserrat-SemiBold',
		color: Colors.light.text,
		textAlign: 'center',
	},
	categoriesHeader: {
		paddingBottom: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	categoriesHeaderText: {
		fontSize: 18,
		fontFamily: 'Montserrat-SemiBold',
	},
});
