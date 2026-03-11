import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StarRating } from '@/components/ui/rating';
import { Colors } from '@/constants/theme';
import { Filter, filterSchema } from '@/schema/filter.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Resolver, useForm, useWatch } from 'react-hook-form';
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
			className={`w-5 h-5 rounded-full justify-center items-center border ${
				checked ? 'bg-primary-dark border-primary-dark' : 'border-text'
			}`}
		>
			<Icon
				name='Check'
				size={12}
				color={checked ? 'white' : Colors.light.text}
				strokeWidth={3}
			/>
		</View>
	);
}

export default function SearchFilterScreen() {
	const router = useRouter();
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, boolean>
	>({
		freeShipping: true,
		sameDayDelivery: true,
	});

	const { control, handleSubmit, reset, setValue, watch } = useForm<Filter>({
		resolver: zodResolver(filterSchema) as Resolver<Filter>,
		defaultValues: {
			price: {
				min: undefined,
				max: undefined,
			},
			rating: 0,
			freeShipping: false,
			sameDayDelivery: false,
			discount: false,
		},
	});

	const rating = useWatch({ control, name: 'rating' });
	const price = useWatch({ control, name: 'price' });

	const onSubmit = (data: Filter) => {
		router.push({
			pathname: '/search/results',
			params: {
				filters: JSON.stringify(data),
			},
		});
	};

	const toggleFilter = (key: keyof Filter) => {
		setSelectedFilters(prev => ({
			...prev,
			[key]: !prev[key],
		}));
		setValue(key, !selectedFilters[key]);
	};

	const resetFilters = () => {
		reset();
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
							value={price?.min?.toString()}
							onChangeText={value => setValue('price.min', Number(value))}
							placeholder='Min.'
							placeholderTextColor={Colors.light.text}
							keyboardType='numeric'
							className='flex-1 bg-background-light rounded-lg px-4 py-3.5 font-sans text-sm'
							autoFocus
						/>
						<TextInput
							value={price?.max?.toString()}
							onChangeText={value => setValue('price.max', Number(value))}
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
							rating={rating}
							size={20}
							readOnly={false}
							onRate={value => setValue('rating', value)}
						/>
						<Text className='font-sans text-sm text-text'>
							{rating} star{rating !== 1 ? 's' : ''}
						</Text>
					</View>
				</View>

				<View className='bg-white rounded-xl p-5'>
					<Text className='font-medium text-base mb-4'>Others</Text>
					{FILTER_OPTIONS.map(option => (
						<Pressable
							key={option.key}
							onPress={() => toggleFilter(option.key as keyof Filter)}
							className='flex-row items-center justify-between py-3.5'
							style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
						>
							<View className='flex-row items-center gap-3.5'>
								<Icon name={option.icon} size={18} color={Colors.light.text} />
								<Text className='font-sans text-sm text-text'>
									{option.label}
								</Text>
							</View>
							<CheckCircle checked={!!watch(option.key as keyof Filter)} />
						</Pressable>
					))}
				</View>
			</ScrollView>

			<View className='px-4 pb-10 pt-3'>
				<Button onPress={handleSubmit(onSubmit)}>Apply filter</Button>
			</View>
		</View>
	);
}
