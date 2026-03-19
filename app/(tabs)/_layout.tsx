import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/ui/icon';
import { useCartStore } from '@/store/use-cart';

export default function TabLayout() {
	const { items } = useCartStore();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: 'black',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarLabel: '',
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
					tabBarIcon: ({ color }) => (
						<Icon name='House' size={26} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					tabBarIcon: ({ color }) => (
						<Icon name='CircleUser' size={26} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='favorites'
				options={{
					tabBarIcon: ({ color }) => (
						<Icon name='Heart' size={26} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='cart'
				options={{
					tabBarBadge: items.length,
					tabBarIcon: ({ color }) => (
						<Icon name='ShoppingBag' size={26} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
