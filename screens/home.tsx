import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Banners from '@/components/banners';
import Categories from '@/components/categories';
import FeaturedProducts from '@/components/featured-products';
import Search from '@/components/search';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		queryClient.invalidateQueries({ queryKey: ['products'] });
		setRefreshing(false);
	}, [queryClient]);

	return (
		<View className='flex-1'>
			<StatusBar barStyle='dark-content' />
			<LinearGradient
				colors={[
					Colors.light.background,
					Colors.light.background,
					Colors.light.backgroundLight,
				]}
				locations={[0, 0.54, 0.78]}
				start={{ y: 0, x: 0.5 }}
				end={{ y: 1, x: 0.5 }}
				style={{ flex: 1 }}
			>
				<View
					className='px-4 h-32 items-end justify-end pb-4'
					style={{ paddingTop: StatusBar.currentHeight }}
				>
					<Search />
				</View>
				<SafeAreaProvider>
					<SafeAreaView edges={['top']}>
						<ScrollView
							className='px-4'
							refreshControl={
								<RefreshControl
									size={10}
									colors={[Colors.light.primaryDark]}
									tintColor={Colors.light.primaryDark}
									progressBackgroundColor={Colors.light.backgroundLight}
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
						>
							<View style={{ gap: 10 }}>
								<Banners />
								<Categories />
								<FeaturedProducts />
							</View>
						</ScrollView>
					</SafeAreaView>
				</SafeAreaProvider>
			</LinearGradient>
		</View>
	);
}
