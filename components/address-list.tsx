import { Icon } from '@/components/ui/icon';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useUpdateAddress } from '@/lib/queries/addresses';
import {
	Address,
	AddressResponse,
	addressSchema,
} from '@/schema/address.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import {
	Controller,
	FormProvider,
	Resolver,
	useForm,
	useWatch,
} from 'react-hook-form';
import { Pressable, Switch, Text, View } from 'react-native';

export default function AddressList({
	address,
	isDefault = false,
}: {
	address: AddressResponse;
	isDefault?: boolean;
}) {
	const { mutate: updateAddress } = useUpdateAddress(address.documentId);
	const [expanded, setExpanded] = useState(false);

	const methods = useForm<Address>({
		resolver: zodResolver(addressSchema) as Resolver<Address>,
		defaultValues: {
			name: address.name,
			phoneNumber: address.phoneNumber,
			address: address.address,
			zipCode: address.zipCode,
			city: address.city,
			country: address.country,
			saveAddress: true,
			isDefault: isDefault,
		},
	});

	const {
		control,
		formState: { errors, isDirty },
		reset,
	} = methods;

	const formData = useWatch({ control });

	useEffect(() => {
		// Skip the initial render update
		const delayDebounceFn = setTimeout(() => {
			// Only update if the form is actually dirty/changed
			if (isDirty) {
				updateAddress(formData);
			}
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [formData, updateAddress, isDirty]);

	useEffect(() => {
		reset({
			name: address.name,
			phoneNumber: address.phoneNumber,
			address: address.address,
			zipCode: address.zipCode,
			city: address.city,
			country: address.country,
			isDefault: address.isDefault ?? false,
		});
	}, [address, reset]);

	return (
		<FormProvider {...methods}>
			<View className='bg-white'>
				{/* Header */}
				<View className='flex-row items-center gap-3 px-4 py-7 border-b border-border'>
					{isDefault && (
						<Text className='text-2xs font-medium absolute left-0 top-0 p-1 bg-primary-light text-primary-dark uppercase flex-1'>
							Default
						</Text>
					)}
					<View className='w-16 h-16 bg-primary-light rounded-full items-center justify-center'>
						<Icon name='MapPin' size={24} color={Colors.light.primaryDark} />
					</View>
					<View className='flex-1'>
						<Text className='text-base font-bold'>{address.name}</Text>
						<Text className='font-sans text-xs text-text'>
							{address.address}, {address.city}, {address.country}{' '}
							{address.zipCode}
						</Text>
						<Text className='text-xs font-medium mt-1'>
							{address.phoneNumber}
						</Text>
					</View>
					<Pressable
						onPress={() => setExpanded(!expanded)}
						className='p-2 w-3 h-3 items-center justify-center border border-primary-dark rounded-full'
					>
						<Icon
							name={expanded ? 'ChevronUp' : 'ChevronDown'}
							size={15}
							color={Colors.light.primaryDark}
						/>
					</Pressable>
				</View>
				{/* Form */}
				{expanded && (
					<View className='gap-2 p-4'>
						<View>
							<Controller
								control={control}
								name='name'
								render={({ field: { value, onChange, onBlur } }) => (
									<Input
										size='sm'
										icon={
											<Icon
												name='CircleUser'
												size={18}
												color={Colors.light.text}
											/>
										}
										placeholder='Name'
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										error={!!errors.name}
										className='bg-background-light'
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
								name='phoneNumber'
								render={({ field: { value, onChange, onBlur } }) => (
									<Input
										size='sm'
										icon={
											<Icon name='Phone' size={18} color={Colors.light.text} />
										}
										placeholder='Phone number'
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										error={!!errors.phoneNumber}
										className='bg-background-light'
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
										size='sm'
										icon={
											<Icon name='MapPin' size={18} color={Colors.light.text} />
										}
										placeholder='Address'
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										error={!!errors.address}
										className='bg-background-light'
									/>
								)}
							/>
							{errors.address && (
								<Text className='text-red-500 text-sm font-sans'>
									{errors.address.message}
								</Text>
							)}
						</View>
						<View className='flex-row gap-2'>
							<View className='flex-1'>
								<Controller
									control={control}
									name='zipCode'
									render={({ field: { value, onChange, onBlur } }) => (
										<Input
											size='sm'
											icon={
												<Icon
													name='FileDigit'
													size={18}
													color={Colors.light.text}
												/>
											}
											placeholder='Zip code'
											value={value}
											onChangeText={onChange}
											onBlur={onBlur}
											error={!!errors.zipCode}
											keyboardType='numeric'
											className='bg-background-light'
										/>
									)}
								/>
								{errors.zipCode && (
									<Text className='text-red-500 text-sm font-sans'>
										{errors.zipCode.message}
									</Text>
								)}
							</View>
							<View className='flex-1'>
								<Controller
									control={control}
									name='city'
									render={({ field: { value, onChange, onBlur } }) => (
										<Input
											size='sm'
											icon={
												<Icon
													name='Building2'
													size={18}
													color={Colors.light.text}
												/>
											}
											placeholder='City'
											value={value}
											onChangeText={onChange}
											onBlur={onBlur}
											error={!!errors.city}
											className='bg-background-light'
										/>
									)}
								/>
								{errors.city && (
									<Text className='text-red-500 text-sm font-sans'>
										{errors.city.message}
									</Text>
								)}
							</View>
						</View>
						<View>
							<Controller
								control={control}
								name='country'
								render={({ field: { value, onChange, onBlur } }) => (
									<Input
										size='sm'
										icon={
											<Icon name='Globe' size={18} color={Colors.light.text} />
										}
										placeholder='Country'
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										error={!!errors.country}
										className='bg-background-light'
									/>
								)}
							/>
							{errors.country && (
								<Text className='text-red-500 text-sm font-sans'>
									{errors.country.message}
								</Text>
							)}
						</View>
						<View className='flex-row items-center mt-2'>
							<Controller
								control={control}
								name='isDefault'
								render={({ field: { value, onChange } }) => (
									<Switch
										trackColor={{
											false: Colors.light.backgroundDark,
											true: Colors.light.primaryDark,
										}}
										thumbColor={Colors.light.background}
										ios_backgroundColor={Colors.light.backgroundDark}
										onValueChange={value => {
											onChange(value);
											updateAddress({ isDefault: value });
										}}
										value={value}
										style={{
											transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
											transformOrigin: 'center',
											width: 55,
										}}
									/>
								)}
							/>
							<Text className='text-xs text-foreground'>Make default</Text>
						</View>
					</View>
				)}
			</View>
		</FormProvider>
	);
}
