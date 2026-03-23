import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useCartStore } from '@/store/use-cart';

export default function TabLayout() {
	const { items } = useCartStore();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.light.primaryDark,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					paddingTop: 10,
					paddingBottom: 0,
					height: 75,
				},
			}}
			backBehavior='order'
		>
			<Tabs.Screen
				name='index'
				options={{
					tabBarLabel: 'Home',
					tabBarIcon: ({ color }) => (
						<Icon name='House' size={26} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color }) => (
						<Icon name='CircleUser' size={26} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='favorites'
				options={{
					tabBarLabel: 'Favorites',
					tabBarIcon: ({ color }) => (
						<Icon name='Heart' size={26} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='cart'
				options={{
					tabBarBadge: items.length,
					tabBarLabel: 'Cart',
					tabBarIcon: ({ color }) => (
						<Icon name='ShoppingBag' size={26} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
