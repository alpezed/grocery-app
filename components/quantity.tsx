import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useQuantity } from '@/hooks/use-quantity';
import React, { useEffect } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

export function Quantity({
	productId,
	setQuantity,
}: {
	productId: string;
	setQuantity: (quantity: number) => void;
}) {
	const { localValue, handleDecrement, handleIncrement, handleChangeText } =
		useQuantity(productId);

	useEffect(() => {
		setQuantity(localValue);
	}, [localValue]);

	return (
		<View className='flex-row justify-between items-center bg-white rounded h-12.5'>
			<Text className='text-text font-sans-medium text-sm pl-5'>Quantity</Text>
			<View className='flex-row items-center'>
				<Pressable
					onPress={handleDecrement}
					disabled={localValue === MIN_QUANTITY}
					className='justify-center items-center p-2 h-12.5 w-12.5 disabled:opacity-50'
				>
					<Icon name='Minus' size={20} color={Colors.light.primaryDark} />
				</Pressable>
				<View className='font-sans-medium text-sm  border-l border-r border-border h-12.5 justify-center items-center'>
					<TextInput
						className='text-center text-md w-12.5 h-full'
						value={localValue.toString()}
						onChangeText={handleChangeText}
					/>
				</View>
				<Pressable
					onPress={handleIncrement}
					disabled={localValue === MAX_QUANTITY}
					className='justify-center items-center p-2 h-12.5 w-12.5 disabled:opacity-50'
				>
					<Icon name='Plus' size={20} color={Colors.light.primaryDark} />
				</Pressable>
			</View>
		</View>
	);
}
