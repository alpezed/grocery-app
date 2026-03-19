import { StrapiCollectionResponse } from '@/@types/strapi';
import { strapiApi } from '@/lib/strapi-api';
import { Address, AddressResponse } from '@/schema/address.schema';

const addresses = strapiApi.collection('addresses');

const PAGE_SIZE = 10;

export async function getAddresses(
	clerkId?: string,
	params?: Record<string, any>
): Promise<StrapiCollectionResponse<AddressResponse>> {
	const { page = 1, pageSize = PAGE_SIZE } = params || {};

	const filters = clerkId ? { clerkId: { $eq: clerkId } } : undefined;

	const response = await addresses.find({
		sort: ['createdAt:desc'],
		pagination: {
			page,
			pageSize,
		},
		filters,
	});

	return response as StrapiCollectionResponse<AddressResponse>;
}

export async function updateAddress(
	id: string,
	input: Pick<Partial<Address>, 'isDefault'>
): Promise<Address> {
	const response = await addresses.update(id, input);
	return response as Address;
}
