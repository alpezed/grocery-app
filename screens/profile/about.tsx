import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { type Profile, profileSchema } from '@/schema/profile.schema';
import { isClerkAPIResponseError, useUser } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

export default function AboutScreen() {
	const router = useRouter();
	const { user } = useUser();

	const getFullName = () => {
		if (user?.firstName && user?.lastName) {
			return `${user?.firstName} ${user?.lastName}`;
		}
		return '';
	};

	const {
		control,
		handleSubmit,
		resetField,
		formState: { errors, isSubmitting },
	} = useForm<Profile>({
		resolver: zodResolver(profileSchema) as Resolver<Profile>,
		defaultValues: {
			name: getFullName(),
			email: user?.emailAddresses[0].emailAddress ?? '',
			phone: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: Profile) => {
		if (!user) return;

		try {
			const [firstName, ...rest] = data.name.split(' ');
			const lastName = rest.join(' ');

			// Find existing email
			const email = user.emailAddresses.find(
				e => e.emailAddress === data.email
			);

			// Find existing phone
			const phone = user.phoneNumbers.find(p => p.phoneNumber === data.phone);

			// Update profile
			await user.update({
				firstName,
				lastName,
				primaryEmailAddressId: email?.id ?? user.primaryEmailAddressId,
				// primaryPhoneNumberId: phone?.id ?? user.primaryPhoneNumberId,
			});

			// Update password if provided
			if (data.password && data.currentPassword) {
				await user.updatePassword({
					currentPassword: data.currentPassword,
					newPassword: data.password,
				});
				resetField('currentPassword');
				resetField('password');
				resetField('confirmPassword');
			}

			Alert.alert('Success', 'Profile updated successfully', [
				{ text: 'OK', onPress: () => router.back() },
			]);
		} catch (error) {
			// console.log(JSON.stringify(error, null, 2));
			if (isClerkAPIResponseError(error)) {
				Alert.alert('Error', error.errors[0].longMessage, [{ text: 'OK' }]);
			} else {
				Alert.alert('Error', 'An error occurred, please try again', [
					{ text: 'OK' },
				]);
			}
		}
	};

	return (
		<View className='flex-1'>
			<AppHeader title='About me' />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className='flex-1'
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						className='flex-1 py-8'
						contentContainerClassName='justify-between items-stretch'
					>
						<View className='flex-1 gap-8 mb-6'>
							<View className='flex-1 px-4 gap-4'>
								<Text className='text-lg font-bold'>Personal Details</Text>
								<View className='gap-2'>
									<View>
										<Controller
											control={control}
											name='name'
											render={({ field: { value, onChange, onBlur } }) => (
												<Input
													icon={
														<Icon
															name='CircleUser'
															size={24}
															color={Colors.light.text}
														/>
													}
													placeholder='Enter your name'
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													error={!!errors.name}
												/>
											)}
										/>
										{errors.name && (
											<Text className='text-red-500 text-sm font-sans'>
												{errors.name.message}
											</Text>
										)}
									</View>
									<View>
										<Controller
											control={control}
											name='email'
											render={({ field: { value, onChange, onBlur } }) => (
												<Input
													icon={
														<Icon
															name='Mail'
															size={24}
															color={Colors.light.text}
														/>
													}
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
													icon={
														<Icon
															name='Phone'
															size={24}
															color={Colors.light.text}
														/>
													}
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
								</View>
							</View>
							<View className='flex-1 px-4 gap-4'>
								<Text className='text-lg font-bold'>Change Password</Text>
								<View className='gap-2'>
									<View>
										<Controller
											control={control}
											name='currentPassword'
											render={({ field: { value, onChange, onBlur } }) => (
												<Input
													type='password'
													icon={
														<Icon
															name='Lock'
															size={24}
															color={Colors.light.text}
														/>
													}
													placeholder='Current password'
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													error={!!errors.currentPassword}
												/>
											)}
										/>
										{errors.currentPassword && (
											<Text className='text-red-500 text-sm font-sans'>
												{errors.currentPassword.message}
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
													icon={
														<Icon
															name='Lock'
															size={24}
															color={Colors.light.text}
														/>
													}
													placeholder='New password'
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
													icon={
														<Icon
															name='Lock'
															size={24}
															color={Colors.light.text}
														/>
													}
													placeholder='Confirm password'
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
							</View>
						</View>
						<View className='px-4 mb-8 mt-auto'>
							<Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
								Save settings
							</Button>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</View>
	);
}
