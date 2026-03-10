import { Address, AddressResponse } from '@/schema/address.schema';
import { strapiService } from '@/services/strapi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAddresses = () => {
	return useQuery({
		queryKey: ['address'],
		queryFn: () => strapiService.getAddresses(),
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
			const previousAddresses = queryClient.getQueryData<AddressResponse[]>([
				'address',
			]);

			// Optimistically update to the new value
			queryClient.setQueryData(['address'], (old: AddressResponse[]) => [
				...old,
				{
					id: previousAddresses?.length ? previousAddresses.length + 1 : 1,
					...address,
				},
			]);

			// Return a context object with the snapshotted value
			return { previousAddresses };
		},
		onSuccess: (data: AddressResponse) => {
			queryClient.invalidateQueries({ queryKey: ['address'] });
		},
	});
};
