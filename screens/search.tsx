import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useSearchStore } from '@/store/use-search';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

function TagChip({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<Pressable
			onPress={onPress}
			className='px-4 py-2 rounded-md border border-border bg-background'
			style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
		>
			<Text className='font-sans text-sm text-text'>{label}</Text>
		</Pressable>
	);
}

export default function SearchScreen() {
	const router = useRouter();
	const inputRef = useRef<TextInput>(null);
	const [query, setQuery] = useState('');

	const history = useSearchStore(s => s.history);
	const discoverMore = useSearchStore(s => s.discoverMore);
	const addToHistory = useSearchStore(s => s.addToHistory);
	const clearHistory = useSearchStore(s => s.clearHistory);
	const clearDiscoverMore = useSearchStore(s => s.clearDiscoverMore);

	const handleSearch = (term: string) => {
		const trimmed = term.trim();
		if (!trimmed) return;
		addToHistory(trimmed);
		setQuery(trimmed);
	};

	const handleSubmit = () => {
		if (!query) return;
		router.push({
			pathname: '/search/results',
			params: { query: query },
		});
		handleSearch(query);
	};

	return (
		<View className='flex-1 bg-background-light'>
			<View className='flex-row items-center px-4 pt-[60px] pb-4 gap-3 bg-background'>
				<Pressable
					onPress={() => router.back()}
					hitSlop={20}
					style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
				>
					<Icon name='ArrowLeft' size={22} color='black' />
				</Pressable>

				<View className='flex-1 flex-row items-center bg-background-light rounded-lg h-[50px]'>
					<View className='absolute left-4 z-10 justify-center items-center'>
						<Icon name='Search' size={20} color={Colors.light.text} />
					</View>
					<TextInput
						ref={inputRef}
						value={query}
						onChangeText={setQuery}
						onSubmitEditing={handleSubmit}
						placeholder='Search keywords..'
						placeholderTextColor={Colors.light.text}
						className='flex-1 font-sans text-sm h-full pl-12 pr-12'
						autoFocus
						returnKeyType='search'
						autoCapitalize='none'
					/>
					<Pressable
						onPress={() => router.push('/search/filter')}
						className='absolute right-4 z-10 justify-center items-center'
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
					>
						<Icon
							name='SlidersHorizontal'
							size={20}
							color={Colors.light.text}
						/>
					</Pressable>
				</View>
			</View>

			<ScrollView
				className='flex-1'
				contentContainerClassName='px-5 pt-4 pb-10'
				keyboardShouldPersistTaps='handled'
			>
				{history.length > 0 && (
					<View className='mb-8'>
						<View className='flex-row justify-between items-center mb-4'>
							<Text className='font-medium text-lg'>Search History</Text>
							<Pressable
								onPress={clearHistory}
								hitSlop={10}
								style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
							>
								<Text className='font-sans text-sm text-link'>clear</Text>
							</Pressable>
						</View>
						<View className='flex-row flex-wrap gap-2.5'>
							{history.map(item => (
								<TagChip
									key={item}
									label={item}
									onPress={() => {
										setQuery(item);
										handleSearch(item);
									}}
								/>
							))}
						</View>
					</View>
				)}

				{discoverMore.length > 0 && (
					<View className='mb-8'>
						<View className='flex-row justify-between items-center mb-4'>
							<Text className='font-medium text-lg'>Discover more</Text>
							<Pressable
								onPress={clearDiscoverMore}
								hitSlop={10}
								style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
							>
								<Text className='font-sans text-sm text-link'>clear</Text>
							</Pressable>
						</View>
						<View className='flex-row flex-wrap gap-2.5'>
							{discoverMore.map(item => (
								<TagChip
									key={item}
									label={item}
									onPress={() => {
										setQuery(item);
										handleSearch(item);
									}}
								/>
							))}
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
}
