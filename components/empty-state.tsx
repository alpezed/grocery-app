import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import React, { ComponentProps } from 'react';
import { Text, View } from 'react-native';

export const EmptyStateTitle = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<Text className='font-sans-medium text-lg text-center'>{children}</Text>
	);
};

export const EmptyStateDescription = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<Text className='font-sans text-text text-center mb-4'>{children}</Text>
	);
};

export const EmptyStateIcon = ({
	icon,
	size,
	color = Colors.light.primaryDark,
	strokeWidth = 1.2,
}: {
	icon: ComponentProps<typeof Icon>['name'];
	size?: ComponentProps<typeof Icon>['size'];
	color?: ComponentProps<typeof Icon>['color'];
	strokeWidth?: ComponentProps<typeof Icon>['strokeWidth'];
}) => {
	return (
		<View className='items-center mb-3'>
			<Icon name={icon} size={size} color={color} strokeWidth={strokeWidth} />
		</View>
	);
};

export default function EmptyState({
	children,
}: {
	children: React.ReactNode;
}) {
	return <View className='flex-1 justify-center gap-2'>{children}</View>;
}

EmptyState.Title = EmptyStateTitle;
EmptyState.Description = EmptyStateDescription;
EmptyState.Icon = EmptyStateIcon;
