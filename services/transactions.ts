import { StrapiCollectionResponse } from '@/@types/strapi';
import { strapiApi } from '@/lib/strapi-api';
import { Transaction } from '@/schema/transaction.schema';

const transactions = strapiApi.collection('transactions');

export async function getTransactions(
	clerkId: string
): Promise<StrapiCollectionResponse<Transaction>> {
	const response = await transactions.find({
		sort: ['createdAt:desc'],
		filters: {
			clerkId,
		},
	});

	return response as StrapiCollectionResponse<Transaction>;
}
