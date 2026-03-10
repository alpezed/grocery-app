import { Colors } from '@/constants/theme';
import React, { ComponentProps, ReactNode, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function Input({
	icon,
	type = 'text',
	error,
	className,
	size = 'md',
	...props
}: ComponentProps<typeof TextInput> & {
	icon?: ReactNode;
	type?: 'text' | 'password' | 'phone';
	error?: boolean;
	className?: string;
	size?: 'sm' | 'md';
}) {
	const [phoneNumber, setPhoneNumber] = useState('');

	const formatPhoneNumber = (text: string) => {
		// 1. Remove all non-digit characters
		let cleaned = ('' + text).replace(/\D/g, '');

		// 2. Apply formatting based on length
		if (cleaned.length > 6) {
			// Formats as (XXX) XXX-XXXX
			return (
				'(' +
				cleaned.substring(0, 3) +
				') ' +
				cleaned.substring(3, 6) +
				'-' +
				cleaned.substring(6, 10)
			);
		} else if (cleaned.length > 3) {
			// Formats as (XXX) XXX
			return '(' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6);
		} else if (cleaned.length >= 1) {
			// Formats as (XXX
			return '(' + cleaned.substring(0, 3);
		}
		return cleaned;
	};

	const handleChangeText = (text: string) => {
		const formatted = formatPhoneNumber(text);
		setPhoneNumber(formatted);
		props.onChangeText?.(formatted);
	};

	return (
		<View style={styles.container}>
			{icon && (
				<View
					style={styles.iconContainer}
					className={size === 'sm' ? 'left-5' : 'left-7'}
				>
					{icon}
				</View>
			)}
			<TextInput
				style={styles.input}
				placeholderTextColor={Colors.light.text}
				secureTextEntry={type === 'password'}
				autoCapitalize='none'
				autoCorrect={false}
				keyboardType={type === 'phone' ? 'phone-pad' : 'default'}
				textContentType={type === 'phone' ? 'telephoneNumber' : 'none'}
				value={type === 'phone' ? phoneNumber : props.value}
				onChangeText={type === 'phone' ? handleChangeText : props.onChangeText}
				className={[
					'bg-background',
					error ? 'border border-red-500' : '',
					size === 'sm' ? 'py-3' : 'py-5',
					size === 'sm' ? 'px-12 h-11.5' : 'px-16',
					className,
				].join(' ')}
				{...props}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		position: 'relative',
	},
	iconContainer: {
		position: 'absolute',
		zIndex: 10,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		fontFamily: 'Montserrat',
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
	},
});
