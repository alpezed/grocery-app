import { Icon } from '@/components/ui/icon';
import { MAX_QUANTITY, MIN_QUANTITY } from '@/constants/product';
import { Colors } from '@/constants/theme';
import { useQuantity } from '@/hooks/use-quantity';
import { FavoriteProduct, Product } from '@/schema/product.schema';
import { useCartStore } from '@/store/use-cart';
import {
	Alert,
	FlatList,
	Image,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

function RightAction(
	prog: SharedValue<number>,
	drag: SharedValue<number>,
	documentId: string
) {
	const { removeItem } = useCartStore();

	const styleAnimation = useAnimatedStyle(() => {
		console.log('showRightProgress:', prog.value);
		console.log('appliedTranslation:', drag.value);

		return {
			transform: [{ translateX: drag.value + 55 }],
		};
	});

	const onRemoveItem = () => {
		Alert.alert(
			'Remove product',
			'Are you sure you want to remove this product from your cart?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Remove',
					onPress: () => {
						removeItem(documentId);
						Toast.show({
							type: 'success',
							text1: 'Removed from cart',
						});
					},
				},
			]
		);
	};

	return (
		<Animated.View style={styleAnimation}>
			<Pressable
				onPress={onRemoveItem}
				style={({ pressed }) => pressed && { opacity: 0.8 }}
				className='text-white font-sans-medium bg-accent-red items-center justify-center h-full w-[75px] transition'
			>
				<Icon name='Trash2' size={24} color='white' />
			</Pressable>
		</Animated.View>
	);
}

function Quantity({ product }: { product: Product }) {
	const { localValue, handleDecrement, handleIncrement, handleChangeText } =
		useQuantity(product.documentId);

	return (
		<View className='items-center ml-auto gap-2 px-2.5 py-2'>
			<Pressable
				onPress={handleIncrement}
				disabled={localValue === MAX_QUANTITY}
				className='justify-center items-center disabled:opacity-50'
			>
				<Icon name='Plus' size={20} color={Colors.light.primaryDark} />
			</Pressable>
			<View className='font-sans-medium text-sm justify-center items-center'>
				<TextInput
					className='text-center text-text text-md'
					value={localValue.toString()}
					onChangeText={handleChangeText}
				/>
			</View>
			<Pressable
				onPress={handleDecrement}
				disabled={localValue === MIN_QUANTITY}
				className='justify-center items-center disabled:opacity-50'
			>
				<Icon name='Minus' size={20} color={Colors.light.primaryDark} />
			</Pressable>
		</View>
	);
}

function ProductItem({ product }: { product: Product }) {
	if (!product) return null;
	return (
		<ReanimatedSwipeable
			renderRightActions={(
				prog: SharedValue<number>,
				drag: SharedValue<number>
			) => RightAction(prog, drag, product.documentId)}
		>
			<View className='bg-white w-[90%] pl-4 ml-[5%] flex-row items-center gap-4'>
				<Image
					source={{ uri: product.image.url }}
					className='w-16 h-16 rounded-lg'
				/>
				<View>
					<Text className='text-xs font-sans-medium text-primary-dark'>
						{product.price.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</Text>
					<Text className='text-base font-sans-medium'>{product.name}</Text>
					<Text className='text-sm text-gray-500 font-sans'>
						{product.unit}
					</Text>
				</View>
				<Quantity product={product} />
			</View>
		</ReanimatedSwipeable>
	);
}

export function ProductList({ products }: { products: Product[] }) {
	return (
		<View className='flex-1 mt-4'>
			<GestureHandlerRootView>
				<FlatList
					data={products}
					renderItem={({ item }: { item: Product }) => (
						<ProductItem product={item} />
					)}
					keyExtractor={item => item.documentId}
					ItemSeparatorComponent={() => <View className='h-2.5' />}
				/>
			</GestureHandlerRootView>
		</View>
	);
}

export function FavoriteProductList({
	products,
}: {
	products: FavoriteProduct[];
}) {
	return (
		<View className='flex-1 mt-4'>
			<GestureHandlerRootView>
				<FlatList
					data={products}
					renderItem={({ item }: { item: FavoriteProduct }) => (
						<ProductItem product={item.product} />
					)}
					keyExtractor={item => item.documentId}
					ItemSeparatorComponent={() => <View className='h-2.5' />}
				/>
			</GestureHandlerRootView>
		</View>
	);
}
