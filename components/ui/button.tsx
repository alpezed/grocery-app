import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function Button({
	icon,
	children,
	onPress,
	color = 'primary',
	disabled = false,
	className,
}: {
	icon?: React.ReactNode;
	children: React.ReactNode;
	onPress: () => void;
	color?: 'primary' | 'white';
	disabled?: boolean;
	className?: string;
}) {
	return (
		<View style={styles.shadowContainer} className={className}>
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					styles.buttonContainer,
					{ opacity: pressed ? 0.85 : 1 }, // Subtle feedback on press
					disabled && { opacity: 0.5 },
				]}
				disabled={disabled}
			>
				<LinearGradient
					colors={
						color === 'primary'
							? [Colors.light.primary, Colors.light.primaryDark]
							: ['#FFFFFF', '#FFFFFF']
					}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={styles.gradient}
				>
					{icon && <View style={styles.buttonIcon}>{icon}</View>}
					<Text style={[styles.text, color === 'white' && { color: 'black' }]}>
						{children}
					</Text>
				</LinearGradient>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	shadowContainer: {
		shadowColor: Colors.light.primaryDark,
		shadowOffset: { width: 0, height: 9 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 9,
		borderRadius: 0,
	},
	buttonContainer: {
		overflow: 'hidden',
		borderRadius: 8,
	},
	gradient: {
		paddingVertical: 18,
		paddingHorizontal: 24,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	text: {
		color: '#FFFFFF',
		fontFamily: 'Montserrat-SemiBold',
		fontSize: 14,
	},
	buttonIcon: {
		position: 'absolute',
		left: 31,
		justifyContent: 'center',
		alignItems: 'center',
		width: 26,
		height: 26,
	},
});
