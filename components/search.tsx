import Icon from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function Search() {
	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Icon name='Search' size={20} color={Colors.light.text} />
			</View>
			<TextInput placeholder='Search products...' style={styles.input} />
			<Pressable
				onPress={() => Alert.alert('Filter settings')}
				style={({ pressed }) => [
					styles.filterSettingsContainer,
					{ opacity: pressed ? 0.5 : 1 },
				]}
			>
				<Icon name='SlidersHorizontal' size={20} color={Colors.light.text} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 19,
		width: '100%',
		backgroundColor: Colors.light.backgroundLight,
		borderRadius: 8,
	},
	input: {
		fontFamily: 'Montserrat',
		color: Colors.light.text,
		backgroundColor: Colors.light.backgroundLight,
		borderRadius: 8,
		gap: 20,
		height: 50,
		paddingInline: 55,
		paddingBlock: 10,
		width: '100%',
	},
	iconContainer: {
		position: 'absolute',
		zIndex: 10,
		top: 0,
		bottom: 0,
		left: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	filterSettingsContainer: {
		position: 'absolute',
		zIndex: 10,
		top: 0,
		bottom: 0,
		right: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
