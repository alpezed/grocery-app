import Banners from '@/components/banners';
import Categories from '@/components/categories';
import FeaturedProducts from '@/components/features-products';
import Search from '@/components/search';
import { Colors } from '@/constants/theme';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				<ScrollView style={styles.scrollView}>
					<Search />
					<Banners />
					<Categories />
					<FeaturedProducts />
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
		paddingHorizontal: 16,
		backgroundColor: Colors.light.background,
	},
	scrollView: {},
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
