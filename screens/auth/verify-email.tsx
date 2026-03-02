import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
	VerifyCodeSchema,
	verifyCodeSchema,
} from '@/schema/verify-code.schema';
import StrapiService from '@/services/strapi';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	TextInputKeyPressEvent,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

const length = 6;

const strapiService = new StrapiService();

export function VerifyEmailScreen() {
	const [otp, setOtp] = useState(new Array(length).fill(''));
	const inputs = useRef<TextInput[]>([]);
	const { isLoaded, signUp, setActive } = useSignUp();

	const { email, password } = useLocalSearchParams<{
		email: string;
		password: string;
	}>();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		setError,
		reset,
		resetField,
	} = useForm<VerifyCodeSchema>({
		resolver: zodResolver(verifyCodeSchema),
		defaultValues: {
			code: '',
		},
	});

	const { field } = useController({
		control,
		name: 'code',
	});

	useEffect(() => {
		// A slight delay (50-100ms) ensures the transition
		// animation is finished and the keyboard pops up smoothly
		const timer = setTimeout(() => {
			if (inputs.current[0]) {
				inputs.current[0].focus();
			}
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	const resendVerificationCode = async () => {
		if (!isLoaded) return;
		try {
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			reset();
			resetField('code');
			Alert.alert('Verification code resent');
		} catch (err) {
			if (isClerkAPIResponseError(err)) {
				Alert.alert(
					err.errors[0].longMessage ?? 'An error occurred, please try again'
				);
			}
		}
	};

	const handleChange = (text: string, index: number) => {
		// 1. Handle Pasting (if text length is > 1)
		if (text.length > 1) {
			const pastedData = text.slice(0, length).split(''); // Take only the first 6 chars
			const newOtp = [...otp];

			pastedData.forEach((char, i) => {
				if (index + i < length) {
					newOtp[index + i] = char;
				}
			});

			setOtp(newOtp);

			// Auto-focus the last filled box or dismiss keyboard
			const lastFilledIndex = Math.min(
				index + pastedData.length - 1,
				length - 1
			);
			inputs.current[lastFilledIndex].focus();

			if (newOtp.join('').length === length) {
				setValue('code', newOtp.join(''), { shouldValidate: true });
				Keyboard.dismiss();
			}
			return;
		}

		const newOtp = [...otp];
		newOtp[index] = text;
		setOtp(newOtp);

		// Move to next child if text is entered
		if (text && index < length - 1) {
			inputs.current[index + 1].focus();
		}

		if (newOtp.join('').length === length) {
			setValue('code', newOtp.join(''), { shouldValidate: true });
			Keyboard.dismiss();
		}
	};

	const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
		// Move to previous child on backspace if current field is empty
		if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
			inputs.current[index - 1].focus();
		}
	};

	const onVerifyPress = async (data: VerifyCodeSchema) => {
		if (!isLoaded) return;

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code: data.code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === 'complete') {
				await setActive({
					session: signUpAttempt.createdSessionId,
					navigate: async ({ session }) => {
						if (session?.currentTask) {
							// Handle pending session tasks
							// See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
							console.log(session?.currentTask);
							return;
						}

						await strapiService.createUser({
							email: email ?? '',
							password: password,
							username: email ?? '',
							clerkId: session?.user?.id ?? '',
						});
					},
				});
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/guides/development/custom-flows/error-handling
			// for more info on error handling
			if (isClerkAPIResponseError(err)) {
				if (err.errors[0].code === 'verification_expired') {
					setError('code', { message: err.errors[0].longMessage });
					return;
				}
				Alert.alert(
					err.errors[0].longMessage ?? 'An error occurred, please try again'
				);
			} else {
				Alert.alert('Error', 'An error occurred, please try again');
			}
		}
	};

	return (
		<View className='flex-1 bg-background-light'>
			<AppHeader title='Verify Phone' showBack={true} />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View className='flex-1 justify-center px-4.5'>
						<View className='gap-3 items-center'>
							<Text className='text-2xl font-sans-medium'>
								Verify your number
							</Text>
							<Text className='text-sm font-sans text-text'>
								Enter your OTP code below
							</Text>
						</View>
						<View className='gap-3 mt-15'>
							<View>
								<View className='flex-row gap-2'>
									{otp.map((digit, index) => (
										<TextInput
											key={index}
											keyboardType='number-pad'
											maxLength={length}
											className={`bg-white rounded-md p-2 text-center text-2xl font-sans-medium h-15 items-stretch flex-1 ${errors.code && 'border border-red-500'}`}
											onChangeText={text => handleChange(text, index)}
											onKeyPress={e => handleKeyPress(e, index)}
											ref={ref => {
												if (ref) {
													inputs.current[index] = ref;
												}
											}}
											value={digit}
											secureTextEntry={true}
											onBlur={field.onBlur}
										/>
									))}
								</View>
								{errors.code && (
									<Text className='text-red-500 text-sm font-sans mt-1'>
										{errors.code.message}
									</Text>
								)}
							</View>
							<Button
								onPress={handleSubmit(onVerifyPress)}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Verifying...' : 'Verify'}
							</Button>
							<View className='items-center justify-center'>
								<Text className='text-sm font-sans'>
									Didn&apos;t receive the code ?
								</Text>
								<Pressable
									onPress={resendVerificationCode}
									style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
								>
									<Text className='text-sm font-sans-medium'>
										Resend a new code
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</View>
	);
}
