import { useOnboardingStore } from '@/store/use-onboarding';
import { Redirect } from 'expo-router';

export default function Index() {
	const completed = useOnboardingStore(state => state.completed);

	if (completed) {
		return <Redirect href='/(tabs)' />;
	}

	return <Redirect href='/onboarding' />;
}
