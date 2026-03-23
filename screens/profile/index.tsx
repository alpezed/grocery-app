import { useClerk, useUser } from '@clerk/clerk-expo';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useState } from 'react';
import {
	Alert,
	Image,
	Linking,
	Platform,
	Pressable,
	Text,
	View,
} from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import Toast from 'react-native-toast-message';

function ProfileItem({
	icon,
	title,
	withArrow = true,
	...props
}: {
	icon: ComponentProps<typeof Icon>['name'];
	title: string;
	withArrow?: boolean;
} & ComponentProps<typeof Pressable>) {
	return (
		<Pressable
			style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
			className='flex-row items-center py-2 border-b border-border px-4 h-13'
			{...props}
		>
			<Icon name={icon} size={20} color={Colors.light.primaryDark} />
			<Text className='text-sm font-sans-medium ml-3'>{title}</Text>
			{withArrow && (
				<View className='ml-auto'>
					<Icon name='ChevronRight' size={24} color={Colors.light.text} />
				</View>
			)}
		</Pressable>
	);
}

function LogoutButton() {
	const router = useRouter();
	const { signOut } = useClerk();

	const handleSignOut = async () => {
		try {
			await signOut();
			router.replace('/(auth)');
		} catch (err) {
			// See https://clerk.com/docs/guides/development/custom-flows/error-handling
			// for more info on error handling
			Alert.alert('Error', 'Failed to logout');
		}
	};

	return (
		<ProfileItem
			icon='LogOut'
			title='Logout'
			withArrow={false}
			onPress={handleSignOut}
		/>
	);
}

function ImageProfilePicker() {
	const { user } = useUser();
	const [image, setImage] = useState<string | null>(null);
	const [cameraPermission, requestCameraPermission] =
		ImagePicker.useCameraPermissions();
	const [libraryPermission, requestLibraryPermission] =
		ImagePicker.useMediaLibraryPermissions();
	const { showActionSheetWithOptions } = useActionSheet();

	const verifyCameraPermission = async (actionSheetIndex: number) => {
		if (actionSheetIndex === 0) {
			if (
				cameraPermission?.status === ImagePicker.PermissionStatus.UNDETERMINED
			) {
				const permissionResponse = await requestCameraPermission();
				return permissionResponse.granted;
			}

			if (cameraPermission?.status === ImagePicker.PermissionStatus.DENIED) {
				Alert.alert(
					'Permission denied',
					'Please grant permission to access your camera to take a profile picture.',
					[
						{ text: 'Cancel' },
						{
							text: 'Open Settings',
							onPress: () =>
								Platform.OS === 'ios'
									? Linking.openURL('app-settings:')
									: Linking.openSettings(),
						},
					]
				);
				return false;
			}

			return true;
		}

		if (actionSheetIndex === 1) {
			const permissionResponse = await requestLibraryPermission();

			if (
				libraryPermission?.status === ImagePicker.PermissionStatus.UNDETERMINED
			) {
				return permissionResponse.granted;
			}

			if (permissionResponse.status === ImagePicker.PermissionStatus.DENIED) {
				Alert.alert(
					'Permission denied',
					'Please grant permission to access your library to choose a profile picture.',
					[
						{ text: 'Cancel' },
						{
							text: 'Open Settings',
							onPress: () =>
								Platform.OS === 'ios'
									? Linking.openURL('app-settings:')
									: Linking.openSettings(),
						},
					]
				);
				return false;
			}

			return true;
		}
	};

	const updateProfileImage = async (asset: ImagePicker.ImagePickerAsset) => {
		Toast.show({ type: 'info', text1: 'Updating profile image...' });

		try {
			const base64 = asset.base64;
			const mimeType = asset.mimeType ?? 'image/jpeg';
			const image = `data:${mimeType};base64,${base64}`;

			await user?.setProfileImage({ file: image });
			setImage(asset.uri);
			Toast.show({ type: 'success', text1: 'Profile image updated!' });
		} catch (err) {
			console.error('Error updating image:', err);
			Toast.show({ type: 'error', text1: 'Failed to update profile image' });
		}
	};

	const takePhoto = async () => {
		const hasPermission = await verifyCameraPermission(0);
		if (!hasPermission) return;

		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
			base64: true,
		});

		if (!result.canceled && result.assets[0].base64) {
			await updateProfileImage(result.assets[0]);
		}
	};

	const pickImage = async () => {
		const hasPermission = await verifyCameraPermission(1);
		if (!hasPermission) return;

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
			base64: true,
		});

		if (!result.canceled && result.assets[0].base64) {
			await updateProfileImage(result.assets[0]);
		}
	};

	const showActionSheet = () => {
		showActionSheetWithOptions(
			{
				options: ['Take Photo', 'Choose from Library', 'Cancel'],
				userInterfaceStyle: 'light',
				destructiveButtonIndex: 2,
				cancelButtonIndex: 2,
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					takePhoto();
				} else if (buttonIndex === 1) {
					pickImage();
				}
			}
		);
	};

	return (
		<View className='relative'>
			<Image
				source={{ uri: image ?? user?.imageUrl }}
				className='w-28 h-28 rounded-full mb-2'
			/>
			<Pressable
				onPress={showActionSheet}
				className='w-6 h-6 absolute right-2 bottom-2 rounded-full bg-primary-dark items-center justify-center'
			>
				<Icon name='Camera' size={14} color={Colors.light.background} />
			</Pressable>
		</View>
	);
}

export default function ProfileScreen() {
	const router = useRouter();
	const { user } = useUser();

	return (
		<View className='flex-1 bg-background-light'>
			<View className='bg-white h-36' />
			<View className='items-center justify-between -mt-15'>
				<ImageProfilePicker />
				<Text className='text-base font-sans-medium'>
					{user?.fullName ?? user?.username}
				</Text>
				<Text className='text-xs text-gray-500 font-sans'>
					{user?.emailAddresses[0].emailAddress}
				</Text>
			</View>
			<View className='mx-6 mt-7.5 bg-white rounded-lg'>
				<ProfileItem
					icon='CircleUser'
					title='About'
					onPress={() => router.push('/about')}
				/>
				<ProfileItem
					icon='Package'
					title='My Orders'
					onPress={() => router.push('/orders')}
				/>
				<ProfileItem
					icon='Heart'
					title='Favorites'
					onPress={() => router.push('/favorites')}
				/>
				<ProfileItem
					icon='MapPin'
					title='My Address'
					onPress={() => router.push('/address')}
				/>
				<ProfileItem
					icon='CreditCard'
					title='Create Cards'
					onPress={() => {}}
				/>
				<ProfileItem
					icon='CircleDollarSign'
					title='Transactions'
					onPress={() => router.push('/transactions')}
				/>
				<ProfileItem
					icon='Bell'
					title='Notifications'
					onPress={() => router.push('/notifications')}
				/>
			</View>
			<View className='mx-6 mt-7.5 bg-white rounded-lg'>
				<LogoutButton />
			</View>
		</View>
	);
}
