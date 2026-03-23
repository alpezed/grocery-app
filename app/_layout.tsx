import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import '../global.css';

import AppHeader from '@/components/app-header';
import { Colors } from '@/constants/theme';
import { toastConfig } from '@/lib/toast';

export const unstable_settings = {
	anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync().catch(() => {
	// Ignore if splash screen is already handled by the system.
});

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

	if (!loaded) {
		return null;
	}

	return (
		<View
			className='flex-1'
			onLayout={async () => {
				if (!loaded) return;
				try {
					await SplashScreen.hideAsync();
				} catch {
					// Prevent uncaught promise if native splash is not registered.
				}
			}}
		>
			<ThemeProvider value={DefaultTheme}>
				<ActionSheetProvider>
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
								<Stack.Screen
									name='(modals)'
									options={{
										presentation: 'formSheet',
										sheetAllowedDetents: [0.5, 0.8, 1],
										// sheetInitialDetentIndex: 0,
										// sheetGrabberVisible: true,
										sheetCornerRadius: 24,
										sheetGrabberVisible: true,
										// sheetLargestUndimmedDetentIndex: 1,
										contentStyle: { height: '100%' },
										headerTitleStyle: {
											fontFamily: 'Montserrat-Bold', // Use your loaded font name
											fontSize: 18,
										},
									}}
								/>
							</Stack>
							<Toast config={toastConfig} position='bottom' />
						</QueryClientProvider>
					</ClerkProvider>
				</ActionSheetProvider>
			</ThemeProvider>
		</View>
	);
}
