import { useOnboardingStore } from '@/store/use-onboarding';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function Index() {
	const completed = useOnboardingStore(state => state.completed);
	const { isSignedIn } = useAuth();

	if (isSignedIn) {
		return <Redirect href='/(tabs)' />;
	}

	if (completed) {
		return <Redirect href='/(auth)' />;
	}

	return <Redirect href='/onboarding' />;
}
