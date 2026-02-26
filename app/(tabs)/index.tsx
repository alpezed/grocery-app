import Banners from '@/components/banners';
import Categories from '@/components/categories';
import FeaturedProducts from '@/components/featured-products';
import Search from '@/components/search';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	return (
		<SafeAreaProvider>
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
				<SafeAreaView style={styles.container} edges={['top']}>
					<ScrollView style={styles.scrollView}>
						<View style={{ gap: 10 }}>
							<Search />
							<Banners />
							<Categories />
							<FeaturedProducts />
						</View>
					</ScrollView>
				</SafeAreaView>
			</LinearGradient>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
	},
	scrollView: {
		paddingHorizontal: 16,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		fontFamily: 'Montserrat',
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
});
