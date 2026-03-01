import { useOnboardingStore } from '@/store/use-onboarding';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function Index() {
	const completed = useOnboardingStore(state => state.completed);
	const { isSignedIn } = useAuth();
	const user = useUser();
	console.log('user1', user);

	if (isSignedIn) {
		return <Redirect href='/(tabs)' />;
	}

	if (completed) {
		return <Redirect href='/(auth)' />;
	}

	return <Redirect href='/onboarding' />;
}
