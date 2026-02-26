import { Colors } from '@/constants/theme';
import React, { ComponentProps, ReactNode } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function Input({
	icon,
	type = 'text',
	...props
}: ComponentProps<typeof TextInput> & {
	icon: ReactNode;
	type?: 'text' | 'password';
}) {
	return (
		<View style={styles.container}>
			{icon && <View style={styles.iconContainer}>{icon}</View>}
			<TextInput
				style={styles.input}
				placeholderTextColor={Colors.light.text}
				secureTextEntry={type === 'password'}
				autoCapitalize='none'
				autoCorrect={false}
				{...props}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	iconContainer: {
		position: 'absolute',
		zIndex: 10,
		top: 0,
		bottom: 0,
		left: 28,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		fontFamily: 'Montserrat',
		color: Colors.light.text,
		backgroundColor: Colors.light.background,
		borderRadius: 8,
		paddingInline: 65,
		paddingBlock: 20,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
	},
});
