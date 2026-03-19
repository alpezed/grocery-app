import { Stack } from 'expo-router';

export default function Layout() {
	return (
		<Stack
			screenOptions={{
				headerTitleStyle: {
					fontFamily: 'Montserrat-Semibold',
					fontSize: 18,
				},
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name='select-address'
				options={{ title: 'Select Address' }}
			/>
		</Stack>
	);
}
