import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useCreateAddress } from '@/lib/queries/addresses';
import { Address, addressSchema } from '@/schema/address.schema';
import { useUser } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Switch,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function AddAddressScreen() {
	const { user } = useUser();
	const { mutate: createAddress } = useCreateAddress();
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<Address>({
		resolver: zodResolver(addressSchema) as Resolver<Address>,
		defaultValues: {
			name: '',
			email: '',
			phoneNumber: '',
			address: '',
			zipCode: '',
			city: '',
			country: '',
			saveAddress: true,
			clerkId: user?.id,
		},
	});

	const onSubmit = async (data: Address) => {
		if (!user) {
			Toast.show({
				type: 'error',
				text1: 'User not found',
			});
			return;
		}
		try {
			createAddress({ ...data, clerkId: user.id });
			Toast.show({
				type: 'success',
				text1: 'Address created successfully',
			});
			router.back();
		} catch (error) {
			console.error('Error creating address', (error as Error).message);
			Toast.show({
				type: 'error',
				text1: 'Error creating address',
			});
		}
	};

	return (
		<View className='flex-1'>
			<AppHeader title='Add Address' />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className='flex-1'
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View className='flex-1'>
						<ScrollView className='flex-1'>
							<View className='gap-2 pt-6 flex-1 px-4 pb-6'>
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
												placeholder='Name'
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
										name='phoneNumber'
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
												error={!!errors.phoneNumber}
											/>
										)}
									/>
									{errors.phoneNumber && (
										<Text className='text-red-500 text-sm font-sans'>
											{errors.phoneNumber.message}
										</Text>
									)}
								</View>
								<View>
									<Controller
										control={control}
										name='address'
										render={({ field: { value, onChange, onBlur } }) => (
											<Input
												icon={
													<Icon
														name='MapPin'
														size={24}
														color={Colors.light.text}
													/>
												}
												placeholder='Address'
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												error={!!errors.address}
											/>
										)}
									/>
									{errors.address && (
										<Text className='text-red-500 text-sm font-sans'>
											{errors.address.message}
										</Text>
									)}
								</View>
								<View>
									<Controller
										control={control}
										name='zipCode'
										render={({ field: { value, onChange, onBlur } }) => (
											<Input
												icon={
													<Icon
														name='FileDigit'
														size={24}
														color={Colors.light.text}
													/>
												}
												placeholder='Zip code'
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												error={!!errors.zipCode}
												keyboardType='numeric'
											/>
										)}
									/>
									{errors.zipCode && (
										<Text className='text-red-500 text-sm font-sans'>
											{errors.zipCode.message}
										</Text>
									)}
								</View>
								<View>
									<Controller
										control={control}
										name='city'
										render={({ field: { value, onChange, onBlur } }) => (
											<Input
												icon={
													<Icon
														name='Building2'
														size={24}
														color={Colors.light.text}
													/>
												}
												placeholder='City'
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												error={!!errors.city}
											/>
										)}
									/>
									{errors.city && (
										<Text className='text-red-500 text-sm font-sans'>
											{errors.city.message}
										</Text>
									)}
								</View>
								<View>
									<Controller
										control={control}
										name='country'
										render={({ field: { value, onChange, onBlur } }) => (
											<Input
												icon={
													<Icon
														name='Globe'
														size={24}
														color={Colors.light.text}
													/>
												}
												placeholder='Country'
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												error={!!errors.country}
											/>
										)}
									/>
									{errors.country && (
										<Text className='text-red-500 text-sm font-sans'>
											{errors.country.message}
										</Text>
									)}
								</View>
								<View className='flex-row items-center mt-4'>
									<Controller
										control={control}
										name='saveAddress'
										render={({ field: { value, onChange } }) => (
											<Switch
												trackColor={{
													false: Colors.light.backgroundDark,
													true: Colors.light.primary,
												}}
												thumbColor={Colors.light.background}
												ios_backgroundColor={Colors.light.backgroundDark}
												onValueChange={onChange}
												value={value}
												style={{
													transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
													transformOrigin: 'center',
												}}
											/>
										)}
									/>
									<Text className='font-medium text-foreground'>
										Save this address
									</Text>
								</View>
							</View>
						</ScrollView>
						<View className='px-4 mb-8'>
							<Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
								Add address
							</Button>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</View>
	);
}
