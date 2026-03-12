import { StrapiCollectionResponse } from '@/@types/strapi';
import { strapiApi } from '@/lib/strapi-api';
import { Transaction } from '@/schema/transaction.schema';

const transactions = strapiApi.collection('transactions');

export async function getTransactions(): Promise<
	StrapiCollectionResponse<Transaction>
> {
	const response = await transactions.find({
		sort: ['createdAt:desc'],
	});

	return response as StrapiCollectionResponse<Transaction>;
}
