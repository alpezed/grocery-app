import { Product } from '@/schema/product.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CartItem = Product & {
	quantity: number;
};

type CartState = {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (documentId: string) => void;
	updateItem: (documentId: string, item?: Partial<CartItem>) => void;
	clear: () => void;
};

export const useCartStore = create(
	persist<CartState>(
		set => ({
			items: [],
			addItem: (item: CartItem) =>
				set(state => ({
					items: state.items.find(i => i.documentId === item.documentId)
						? state.items.map(i =>
								i.documentId === item.documentId
									? { ...i, quantity: i.quantity + 1 }
									: i
							)
						: [...state.items, { ...item, quantity: 1 }],
				})),
			removeItem: (documentId: string) =>
				set(state => ({
					items: state.items.filter(item => item.documentId !== documentId),
				})),
			updateItem: (documentId, item) =>
				set(state => ({
					items: state.items.map(i =>
						i.documentId === documentId ? { ...i, ...item } : i
					),
				})),
			clear: () => set({ items: [] }),
		}),
		{
			name: 'cart-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
