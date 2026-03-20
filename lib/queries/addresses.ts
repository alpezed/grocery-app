import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Address, AddressResponse } from '@/schema/address.schema';
import * as addressService from '@/services/address';
import { strapiService } from '@/services/strapi';

export const useGetAddresses = () => {
	const { user } = useUser();
	return useQuery({
		queryKey: ['address'],
		queryFn: () => addressService.getAddresses(user?.id),
		select: data => data.data,
	});
};

export const useCreateAddress = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (address: Address) =>
			await strapiService.createAddress(address),
		onMutate: async (address: Address) => {
			// Cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ['address'] });

			// Snapshot the previous value
			const previousAddresses = queryClient.getQueryData<{
				data: AddressResponse[];
			}>(['address']);

			// Optimistically update to the new value
			queryClient.setQueryData(
				['address'],
				(old: { data: AddressResponse[] }) => {
					return {
						...old,
						data: [...old.data, { id: old.data.length + 1, ...address }],
					};
				}
			);

			// Return a context object with the snapshotted value
			return { previousAddresses };
		},
		onSuccess: (data: AddressResponse) => {
			queryClient.invalidateQueries({ queryKey: ['address'] });
		},
	});
};

export const useUpdateAddress = (addressId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: Pick<Partial<Address>, 'isDefault'>) =>
			await addressService.updateAddress(addressId, input),
		onMutate: async (input: Pick<Partial<Address>, 'isDefault'>) => {
			await queryClient.cancelQueries({ queryKey: ['address'] });
			const previousAddresses = queryClient.getQueryData<{
				data: AddressResponse[];
			}>(['address']);
			queryClient.setQueryData(
				['address'],
				(old: { data: AddressResponse[] }) => {
					if (!old?.data) return old;

					return {
						...old,
						data: old.data.map((addr: AddressResponse) => {
							// If we are setting this one to default,
							// we should optimistically unset others to avoid 2 "Defaults" in UI
							if (input.isDefault && addr.documentId !== addressId) {
								return { ...addr, isDefault: false };
							}

							// Update the target address
							if (addr.documentId === addressId) {
								return { ...addr, ...input };
							}

							return addr;
						}),
					};
				}
			);
			return { previousAddresses };
		},
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['address'] });
		},
		onError: (error, input, context) => {
			console.log('--useUpdateAddress error', error);
			queryClient.setQueryData(['address'], context?.previousAddresses);
		},
	});
};
