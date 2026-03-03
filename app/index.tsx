import { Colors } from '@/constants/theme';
import { useOnboardingStore } from '@/store/use-onboarding';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
	const completed = useOnboardingStore(state => state.completed);
	const { isSignedIn } = useAuth();

	if (isSignedIn === undefined) {
		return (
			<View className='flex-1 items-center justify-center'>
				<ActivityIndicator color={Colors.light.primaryDark} />
			</View>
		);
	}

	if (isSignedIn) {
		return <Redirect href='/(tabs)' />;
	}

	if (completed) {
		return <Redirect href='/(auth)' />;
	}

	return <Redirect href='/onboarding' />;
}
