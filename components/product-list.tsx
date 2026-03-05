import Icon from '@/components/ui/icon';
import { MAX_QUANTITY, MIN_QUANTITY } from '@/constants/product';
import { Colors } from '@/constants/theme';
import { useQuantity } from '@/hooks/use-quantity';
import { useProducts } from '@/lib/queries/products';
import { Product } from '@/schema/product.schema';
import { FlashList } from '@shopify/flash-list';
import {
	ActivityIndicator,
	Image,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
	const styleAnimation = useAnimatedStyle(() => {
		// console.log('showRightProgress:', prog.value);
		// console.log('appliedTranslation:', drag.value);

		return {
			transform: [{ translateX: drag.value + 75 }],
		};
	});

	return (
		<Reanimated.View style={styleAnimation}>
			<Pressable
				onPress={() => {}}
				style={({ pressed }) => pressed && { opacity: 0.8 }}
				className='text-white font-sans-medium bg-accent-red items-center justify-center h-full w-full transition'
			>
				<Icon name='Trash2' size={24} color='white' />
			</Pressable>
		</Reanimated.View>
	);
}

function Quantity() {
	const { localValue, handleDecrement, handleIncrement, handleChangeText } =
		useQuantity();

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
	return (
		<GestureHandlerRootView className='bg-pink-100'>
			<ReanimatedSwipeable
				// friction={2}
				enableTrackpadTwoFingerGesture
				// rightThreshold={15}
				renderRightActions={RightAction}
			>
				<View className='bg-white pl-4 flex-row items-center gap-4'>
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
					<Quantity />
				</View>
			</ReanimatedSwipeable>
		</GestureHandlerRootView>
	);
}

export default function ProductList() {
	const { data: products, error, status } = useProducts();

	if (status === 'pending') {
		return <ActivityIndicator />;
	}

	if (status === 'error') {
		return <Text>Error: {error?.message}</Text>;
	}

	return (
		<View className='flex-1 p-4'>
			<FlashList
				data={products}
				renderItem={({ item }: { item: Product }) => (
					<ProductItem product={item} />
				)}
				keyExtractor={item => item.documentId}
				ItemSeparatorComponent={() => <View className='h-2.5' />}
			/>
		</View>
	);
}
