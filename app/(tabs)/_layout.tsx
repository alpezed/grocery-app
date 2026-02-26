import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import Icon from '@/components/ui/icon';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: 'black',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarLabel: '',
				tabBarStyle: {
					paddingTop: 15,
					paddingBottom: 0,
					height: 75,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					tabBarIcon: ({ color }) => (
						<Icon name='House' size={28} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					tabBarIcon: ({ color }) => (
						<Icon name='CircleUser' size={28} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='favorites'
				options={{
					tabBarIcon: ({ color }) => (
						<Icon name='Heart' size={28} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='orders'
				options={{
					tabBarIcon: ({ color }) => (
						<Icon name='ShoppingBag' size={28} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
