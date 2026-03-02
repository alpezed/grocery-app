import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import AuthLayout from '@/layout/auth';
import { SignUpSchema, signUpSchema } from '@/schema/signup.schema';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function SignUpScreen() {
	const router = useRouter();
	const { isLoaded, signUp } = useSignUp();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema) as Resolver<SignUpSchema>,
		defaultValues: {
			email: '',
			phone: undefined,
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: SignUpSchema) => {
		if (!isLoaded) return;

		// Start sign-up process using the phone number provided
		try {
			await signUp.create({
				emailAddress: data.email,
				password: data.password,
			});

			// Start the verification - a text message will be sent to the
			// number with a one-time password (OTP)
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

			// Set `verifying` to `true` to display second form
			// and capture the OTP code
			router.push({
				pathname: '/(auth)/verify-email',
				params: {
					phone: data.phone,
				},
			});
		} catch (err) {
			// See https://clerk.com/docs/guides/development/custom-flows/error-handling
			// for more info on error handling
			if (isClerkAPIResponseError(err)) {
				if (err.errors[0].code === 'form_password_pwned') {
					setError('password', { message: err.errors[0].longMessage });
				} else if (err.errors[0].code === 'form_identifier_exists') {
					setError('email', { message: err.errors[0].longMessage });
				} else {
					Alert.alert(
						err.errors[0].longMessage ?? 'An error occurred, please try again',
						'OK'
					);
				}
			} else {
				Alert.alert('Error', 'An error occurred, please try again', [
					{ text: 'OK' },
				]);
			}
		}
	};

	return (
		<AuthLayout
			title='Create Account'
			subtitle='Quickly create account'
			bgImage={require('@/assets/images/auth-signup-img.png')}
		>
			<View style={styles.inputContainer}>
				<View>
					<Controller
						control={control}
						name='email'
						render={({ field: { value, onChange, onBlur } }) => (
							<Input
								icon={<Icon name='Mail' size={24} color={Colors.light.text} />}
								placeholder='Email Address'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={!!errors.email}
							/>
						)}
					/>
					{errors.email && (
						<Text className='text-red-500 text-sm font-sans'>
							{errors.email.message}
						</Text>
					)}
				</View>
				<View>
					<Controller
						control={control}
						name='phone'
						render={({ field: { value, onChange, onBlur } }) => (
							<Input
								icon={<Icon name='Phone' size={24} color={Colors.light.text} />}
								placeholder='Phone number'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={!!errors.phone}
							/>
						)}
					/>
					{errors.phone && (
						<Text className='text-red-500 text-sm font-sans'>
							{errors.phone.message}
						</Text>
					)}
				</View>
				<View>
					<Controller
						control={control}
						name='password'
						render={({ field: { value, onChange, onBlur } }) => (
							<Input
								type='password'
								icon={<Icon name='Lock' size={24} color={Colors.light.text} />}
								placeholder='Password'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={!!errors.password}
							/>
						)}
					/>
					{errors.password && (
						<Text className='text-red-500 text-sm font-sans'>
							{errors.password.message}
						</Text>
					)}
				</View>
				<View>
					<Controller
						control={control}
						name='confirmPassword'
						render={({ field: { value, onChange, onBlur } }) => (
							<Input
								type='password'
								icon={<Icon name='Lock' size={24} color={Colors.light.text} />}
								placeholder='Confirm Password'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={!!errors.confirmPassword}
							/>
						)}
					/>
					{errors.confirmPassword && (
						<Text className='text-red-500 text-sm font-sans'>
							{errors.confirmPassword.message}
						</Text>
					)}
				</View>
			</View>
			<Button onPress={handleSubmit(onSubmit)}>Signup</Button>
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
