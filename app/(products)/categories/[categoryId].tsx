import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function ProductCategory() {
	const { categoryId } = useLocalSearchParams();

	return (
		<View>
			<Text>{categoryId}</Text>
		</View>
	);
}
