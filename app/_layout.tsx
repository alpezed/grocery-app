import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

// import { useColorScheme } from '@/hooks/use-color-scheme';
import AppHeader from '@/components/app-header';
import { Colors } from '@/constants/theme';
import { useOnboardingStore } from '@/store/use-onboarding';

export const unstable_settings = {
	anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		Montserrat: require('@/assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
		'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
	});
	const completed = useOnboardingStore(state => state.completed);

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	// if (!loaded && !error) {
	// 	return null;
	// }

	return (
		<ThemeProvider value={DefaultTheme}>
			<Stack
				initialRouteName={completed ? '(auth)/index' : 'onboarding'}
				screenOptions={{
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
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen name='(auth)/index' options={{ headerShown: false }} />
				<Stack.Screen name='(auth)/login' options={{ headerShown: false }} />
				<Stack.Screen name='(auth)/signup' options={{ headerShown: false }} />
				<Stack.Screen
					name='reviews/index'
					options={{
						title: 'Reviews',
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name='reviews/create'
					options={{ headerShown: true, title: 'Create Review' }}
				/>
				<Stack.Screen
					name='products/[productId]'
					options={{ headerShown: false }}
				/>
				{!completed && (
					<Stack.Screen name='onboarding' options={{ headerShown: false }} />
				)}
			</Stack>
		</ThemeProvider>
	);
}
