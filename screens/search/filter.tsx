import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StarRating } from '@/components/ui/rating';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type FilterOption = {
	key: string;
	label: string;
	icon: 'Tag' | 'Truck' | 'Package';
};

const FILTER_OPTIONS: FilterOption[] = [
	{ key: 'discount', label: 'Discount', icon: 'Tag' },
	{ key: 'freeShipping', label: 'Free shipping', icon: 'Truck' },
	{ key: 'sameDayDelivery', label: 'Same day delivery', icon: 'Package' },
];

function CheckCircle({ checked }: { checked: boolean }) {
	return (
		<View
			className={`w-5 h-5 rounded-full justify-center items-center border-[1.5px] ${
				checked ? 'bg-primary-dark border-primary-dark' : 'border-gray-300'
			}`}
		>
			{checked && <Icon name='Check' size={14} color='white' />}
		</View>
	);
}

export default function SearchFilterScreen() {
	const router = useRouter();
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [starRating, setStarRating] = useState(4);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, boolean>
	>({
		freeShipping: true,
		sameDayDelivery: true,
	});

	const toggleFilter = (key: string) => {
		setSelectedFilters(prev => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const resetFilters = () => {
		setMinPrice('');
		setMaxPrice('');
		setStarRating(0);
		setSelectedFilters({});
	};

	const handleApply = () => {
		router.back();
	};

	return (
		<View className='flex-1 bg-background-light'>
			<AppHeader
				title='Apply Filters'
				headerRight={
					<Pressable
						onPress={resetFilters}
						hitSlop={20}
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
					>
						<Icon name='RotateCcw' size={20} />
					</Pressable>
				}
			/>

			<ScrollView className='flex-1' contentContainerClassName='p-4 gap-4'>
				<View className='bg-white rounded-xl p-5'>
					<Text className='font-medium text-base mb-4'>Price Range</Text>
					<View className='flex-row gap-3'>
						<TextInput
							value={minPrice}
							onChangeText={setMinPrice}
							placeholder='Min.'
							placeholderTextColor={Colors.light.text}
							keyboardType='numeric'
							className='flex-1 bg-background-light rounded-lg px-4 py-3.5 font-sans text-sm'
							autoFocus
						/>
						<TextInput
							value={maxPrice}
							onChangeText={setMaxPrice}
							placeholder='Max.'
							placeholderTextColor={Colors.light.text}
							keyboardType='numeric'
							className='flex-1 bg-background-light rounded-lg px-4 py-3.5 font-sans text-sm'
						/>
					</View>
				</View>

				<View className='bg-white rounded-xl p-5'>
					<Text className='font-medium text-base mb-4'>Star Rating</Text>
					<View className='flex-row items-center bg-background-light rounded-lg px-4 py-4 justify-between'>
						<StarRating
							rating={starRating}
							size={20}
							readOnly={false}
							onRate={setStarRating}
						/>
						<Text className='font-sans text-sm text-text'>
							{starRating} star{starRating !== 1 ? 's' : ''}
						</Text>
					</View>
				</View>

				<View className='bg-white rounded-xl p-5'>
					<Text className='font-medium text-base mb-4'>Others</Text>
					{FILTER_OPTIONS.map(option => (
						<Pressable
							key={option.key}
							onPress={() => toggleFilter(option.key)}
							className='flex-row items-center justify-between py-3.5'
							style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
						>
							<View className='flex-row items-center gap-3.5'>
								<Icon name={option.icon} size={18} color={Colors.light.text} />
								<Text className='font-sans text-sm text-text'>
									{option.label}
								</Text>
							</View>
							<CheckCircle checked={!!selectedFilters[option.key]} />
						</Pressable>
					))}
				</View>
			</ScrollView>

			<View className='px-4 pb-10 pt-3'>
				<Button onPress={handleApply}>Apply filter</Button>
			</View>
		</View>
	);
}
