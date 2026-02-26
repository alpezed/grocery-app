import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Banners() {
	return (
		<View style={styles.container}>
			<View>
				<Image
					source={require('@/assets/images/banner-image-1.png')}
					style={styles.banner}
				/>
				<Text style={styles.bannerText}>20% off on your first purchase</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 10,
		position: 'relative',
	},
	banner: {
		height: 240,
	},
	bannerText: {
		position: 'absolute',
		bottom: 65,
		left: 40,
		right: 0,
		padding: 10,
		color: 'black',
		fontSize: 18,
		fontFamily: 'Montserrat-Bold',
		maxWidth: 200,
	},
});
