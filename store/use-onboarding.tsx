import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
	completed: boolean;
	complete: () => void;
};

export const useOnboardingStore = create(
	persist<OnboardingState>(
		set => ({
			completed: false,
			complete: () => set({ completed: true }),
		}),
		{
			name: 'onboarding-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);

export const resetOnboardingStore = async () => {
	await useOnboardingStore.persist.clearStorage();
	useOnboardingStore.setState({ completed: false });
};
