import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import AuthLayout from '@/layout/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

export default function LoginScreen() {
	const router = useRouter();
	const [rememberMe, setRememberMe] = useState(false);

	const toggleSwitch = () =>
		setRememberMe((previousState: boolean) => !previousState);

	return (
		<AuthLayout
			title='Welcome back!'
			subtitle='Sign in to your account'
			bgImage={require('@/assets/images/auth-login-img.png')}
		>
			<View style={styles.inputContainer}>
				<Input
					icon={<Icon name='Mail' size={24} color={Colors.light.text} />}
					placeholder='Email Address'
				/>
				<Input
					type='password'
					icon={<Icon name='Lock' size={24} color={Colors.light.text} />}
					placeholder='Password'
				/>
			</View>
			<View style={styles.forgotPasswordContainer}>
				<View style={styles.rememberMeContainer}>
					<Switch
						trackColor={{
							false: Colors.light.backgroundDark,
							true: Colors.light.primary,
						}} // Light gray to Primary Green
						thumbColor={
							rememberMe ? Colors.light.background : Colors.light.background
						}
						ios_backgroundColor={Colors.light.backgroundDark}
						onValueChange={toggleSwitch}
						value={rememberMe}
						// Scale it down slightly if it feels too large compared to the text
						style={{
							transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
							transformOrigin: 'left',
						}}
					/>
					<Text style={styles.rememberMeText}>Remember me</Text>
				</View>

				<Pressable
					onPress={() => console.log('Forgot Password Pressed')}
					style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
				>
					<Text style={styles.forgotPasswordText}>Forgot password</Text>
				</Pressable>
			</View>
			<Button onPress={() => router.push('/(tabs)')}>Login</Button>
			<View style={styles.linkContainer}>
				<View style={styles.linkTextContainer}>
					<Text style={styles.linkText}>Don&apos;t have an account?</Text>
					<Text
						style={styles.link}
						onPress={() => router.push('/(auth)/signup')}
					>
						Sign up
					</Text>
				</View>
			</View>
		</AuthLayout>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		gap: 5,
	},
	linkTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 2,
	},
	linkContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 30,
		// paddingBottom: 120,
	},
	linkText: {
		fontFamily: 'Montserrat',
		color: Colors.light.text,
		fontSize: 14,
	},
	link: {
		color: 'black',
		fontFamily: 'Montserrat-SemiBold',
	},
	forgotPasswordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		paddingVertical: 10,
	},
	rememberMeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBlock: 6,
	},
	rememberMeText: {
		fontFamily: 'Montserrat',
		color: Colors.light.text,
		marginLeft: -8,
	},
	forgotPasswordText: {
		fontFamily: 'Montserrat',
		color: Colors.light.link,
		fontWeight: '500',
	},
});
