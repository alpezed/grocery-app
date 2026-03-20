import { AddressResponse } from '@/schema/address.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SelectedAddressState = {
	defaultAddress?: AddressResponse;
	setDefaultAddress: (address: AddressResponse) => void;
};

export const useSelectedAddressStore = create(
	persist<SelectedAddressState>(
		set => ({
			defaultAddress: undefined,
			setDefaultAddress: (address: AddressResponse) =>
				set({ defaultAddress: address }),
		}),
		{
			name: 'selected-address-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
