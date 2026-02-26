import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import AuthLayout from '@/layout/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SignUpScreen() {
	const router = useRouter();

	return (
		<AuthLayout
			title='Create Account'
			subtitle='Quickly create account'
			bgImage={require('@/assets/images/auth-signup-img.png')}
		>
			<View style={styles.inputContainer}>
				<Input
					icon={<Icon name='Mail' size={24} color={Colors.light.text} />}
					placeholder='Email Address'
				/>
				<Input
					icon={<Icon name='Phone' size={24} color={Colors.light.text} />}
					placeholder='Phone number'
					type='phone'
				/>
				<Input
					type='password'
					icon={<Icon name='Lock' size={24} color={Colors.light.text} />}
					placeholder='Password'
				/>
			</View>
			<Button onPress={() => {}}>Signup</Button>
			<View style={styles.linkContainer}>
				<Text style={styles.linkText}>
					Already have an account?{' '}
					<Text
						style={styles.link}
						onPress={() => router.push('/(auth)/login')}
					>
						Login
					</Text>
				</Text>
			</View>
		</AuthLayout>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		gap: 5,
		paddingBottom: 10,
	},
	linkContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20,
		paddingBottom: 20,
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
