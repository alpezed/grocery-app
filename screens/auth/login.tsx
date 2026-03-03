import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import AuthLayout from '@/layout/auth';
import { SignInSchema, signInSchema } from '@/schema/signin.schema';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import type { EmailCodeFactor } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';

export default function LoginScreen() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();
	const [rememberMe, setRememberMe] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
	} = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	const onSubmit = async (data: SignInSchema) => {
		if (!isLoaded) return;

		// Start the sign-in process using the email and password provided
		try {
			const signInAttempt = await signIn.create({
				identifier: data.email,
				password: data.password,
			});

			// If sign-in process is complete, set the created session as active
			// and redirect the user
			if (signInAttempt.status === 'complete') {
				await setActive({
					session: signInAttempt.createdSessionId,
					navigate: async ({ session }) => {
						if (session?.currentTask) {
							// Handle pending session tasks
							// See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
							console.log(session?.currentTask);
							return;
						}

						router.replace('/');
					},
				});
			} else if (signInAttempt.status === 'needs_second_factor') {
				// Check if email_code is a valid second factor
				// This is required when Client Trust is enabled and the user
				// is signing in from a new device.
				// See https://clerk.com/docs/guides/secure/client-trust
				const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
					(factor): factor is EmailCodeFactor =>
						factor.strategy === 'email_code'
				);

				if (emailCodeFactor) {
					await signIn.prepareSecondFactor({
						strategy: 'email_code',
						emailAddressId: emailCodeFactor.emailAddressId,
					});
					router.push({
						pathname: '/(auth)/verify-email',
						params: {
							email: data.email,
							password: data.password,
						},
					});
				}
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/guides/development/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
			if (isClerkAPIResponseError(err)) {
				if (
					['form_password_pwned', 'form_password_incorrect'].includes(
						err.errors[0].code
					)
				) {
					setError('password', { message: err.errors[0].longMessage });
				} else if (err.errors[0].code === 'invalid_credentials') {
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

	const toggleSwitch = () =>
		setRememberMe((previousState: boolean) => !previousState);

	return (
		<AuthLayout
			title='Welcome back!'
			subtitle='Sign in to your account'
			bgImage={require('@/assets/images/auth-login-img.png')}
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
						onValueChange={() => {
							setValue('rememberMe', !rememberMe);
							toggleSwitch();
						}}
						value={rememberMe}
						// Scale it down slightly if it feels too large compared to the text
						style={{
							transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
							transformOrigin: 'left',
						}}
					/>
					<Text style={styles.rememberMeText}>Remember me</Text>
				</View>

				<Link href='/forgot-password' style={styles.forgotPasswordText}>
					Forgot password
				</Link>
			</View>
			<Button onPress={handleSubmit(onSubmit)}>Login</Button>
			<View style={styles.linkContainer}>
				<View style={styles.linkTextContainer}>
					<Text style={styles.linkText}>Don&apos;t have an account?</Text>
					<Link href='/signup' style={styles.link}>
						Sign up
					</Link>
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
