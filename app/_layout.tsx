import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';

export const unstable_settings = {
	anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		Montserrat: require('@/assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
		'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack initialRouteName='onboarding'>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen name='onboarding' options={{ headerShown: false }} />
				<Stack.Screen
					name='modal'
					options={{ presentation: 'modal', title: '', headerShown: false }}
				/>
			</Stack>
			<StatusBar style='auto' />
		</ThemeProvider>
	);
}
