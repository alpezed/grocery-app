import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import '../global.css';

import AppHeader from '@/components/app-header';
import { Colors } from '@/constants/theme';
import { toastConfig } from '@/lib/toast';
export const unstable_settings = {
	anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			retry: 3,
		},
	},
});

export default function RootLayout() {
	// const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		Montserrat: require('@/assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
		'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
	});
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return <ActivityIndicator />;
	}

	return (
		<ThemeProvider value={DefaultTheme}>
			<ClerkProvider tokenCache={tokenCache}>
				<QueryClientProvider client={queryClient}>
					<Stack
						screenOptions={{
							headerShown: false,
							headerShadowVisible: false,
							header: props => (
								<AppHeader
									title={props.options.title as string}
									showBack={props.options.headerBackVisible as boolean}
									headerRight={props.options.headerRight}
								/>
							),
							contentStyle: {
								backgroundColor: Colors.light.backgroundLight,
							},
						}}
					>
						<Stack.Screen name='(tabs)' />
						<Stack.Screen name='(auth)' />
						<Stack.Screen name='onboarding' />
						<Stack.Screen name='(profile)' />
						<Stack.Screen name='products' />
						<Stack.Screen name='reviews' />
					</Stack>
					<Toast config={toastConfig} position='bottom' />
				</QueryClientProvider>
			</ClerkProvider>
		</ThemeProvider>
	);
}
