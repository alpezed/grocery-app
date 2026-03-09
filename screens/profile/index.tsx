import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { ComponentProps } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';

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
			style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
			className='flex-row items-center py-2'
			{...props}
		>
			<Icon name={icon} size={20} color={Colors.light.primaryDark} />
			<Text className='text-sm font-sans-medium ml-3'>{title}</Text>
			{withArrow && (
				<View className='ml-auto'>
					<Icon name='ChevronRight' size={30} color={Colors.light.text} />
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

export default function ProfileScreen() {
	const router = useRouter();
	const { user } = useUser();

	return (
		<View className='flex-1 bg-background-light'>
			<View className='bg-white h-36' />
			<View className='items-center justify-between -mt-15'>
				<Image
					source={{ uri: user?.imageUrl }}
					className='w-28 h-28 rounded-full mb-2'
				/>
				<Text className='text-base font-sans-medium'>
					{user?.fullName ?? user?.username}
				</Text>
				<Text className='text-xs text-gray-500 font-sans'>
					{user?.emailAddresses[0].emailAddress}
				</Text>
			</View>
			<View className='px-9 mt-7.5'>
				<ProfileItem
					icon='CircleUser'
					title='About'
					onPress={() => router.push('/about')}
				/>
				<ProfileItem
					icon='Package'
					title='Orders'
					onPress={() => router.push('/orders')}
				/>
				<ProfileItem
					icon='Heart'
					title='Favorites'
					onPress={() => router.push('/favorites')}
				/>
				<ProfileItem icon='MapPin' title='My Address' onPress={() => {}} />
				<ProfileItem
					icon='CreditCard'
					title='Create Cards'
					onPress={() => {}}
				/>
				<ProfileItem
					icon='CircleDollarSign'
					title='Transactions'
					onPress={() => {}}
				/>
				<ProfileItem icon='Bell' title='Notifications' onPress={() => {}} />
				<LogoutButton />
			</View>
		</View>
	);
}
