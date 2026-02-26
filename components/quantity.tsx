import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

export function Quantity() {
	const [localValue, setLocalValue] = useState<number>(MIN_QUANTITY);

	const handleDecrement = () => {
		if (localValue > MIN_QUANTITY) {
			setLocalValue(localValue - MIN_QUANTITY);
		}
	};

	const handleIncrement = () => {
		if (localValue < MAX_QUANTITY) {
			setLocalValue(localValue + 1);
		}
	};

	const handleChangeText = (text: string) => {
		const value = parseInt(text);
		if (isNaN(value)) {
			setLocalValue(1);
		} else {
			setLocalValue(Math.max(1, Math.min(MAX_QUANTITY, value)));
		}
	};

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
