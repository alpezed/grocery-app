import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SearchState = {
	history: string[];
	discoverMore: string[];
	addToHistory: (term: string) => void;
	clearHistory: () => void;
	clearDiscoverMore: () => void;
};

const DEFAULT_DISCOVER = [
	'Fresh Grocery',
	'Bananas',
	'cheetos',
	'vegetables',
	'Fruits',
	'discounted items',
	'Fresh vegetables',
];

export const useSearchStore = create(
	persist<SearchState>(
		(set, get) => ({
			history: [],
			discoverMore: DEFAULT_DISCOVER,
			addToHistory: (term: string) => {
				const trimmed = term.trim();
				if (!trimmed) return;
				set(state => ({
					history: [
						trimmed,
						...state.history.filter(h => h !== trimmed),
					].slice(0, 10),
				}));
			},
			clearHistory: () => set({ history: [] }),
			clearDiscoverMore: () => set({ discoverMore: [] }),
		}),
		{
			name: 'search-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
