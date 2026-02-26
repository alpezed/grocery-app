import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SectionText({
	title,
	onPress,
}: {
	title: string;
	onPress: () => void;
}) {
	return (
		<View style={styles.sectionTextHeader}>
			<Text style={styles.sectionTextHeaderText}>{title}</Text>
			<Pressable
				style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
				onPress={onPress}
			>
				<Icon name='ChevronRight' size={22} color={Colors.light.text} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	sectionTextHeader: {
		paddingBottom: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionTextHeaderText: {
		fontSize: 18,
		fontFamily: 'Montserrat-SemiBold',
	},
});
