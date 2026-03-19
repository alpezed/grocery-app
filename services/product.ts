import { StrapiCollectionResponse } from '@/@types/strapi';
import { strapiApi } from '@/lib/strapi-api';
import { Product } from '@/schema/product.schema';

const PAGE_SIZE = 10;

const products = strapiApi.collection('products');

export async function getProducts(
	params?: Record<string, any>
): Promise<StrapiCollectionResponse<Product>> {
	const {
		page = 1,
		pageSize = PAGE_SIZE,
		name,
		...filterParams
	} = params || {};

	const filters = name
		? {
				name: { $containsi: name },
			}
		: filterParams;

	const response = await products.find({
		sort: ['createdAt:desc'],
		pagination: {
			page,
			pageSize,
		},
		populate: {
			image: {
				fields: ['url', 'formats'],
			},
			favorites: {
				fields: ['clerkId'],
			},
		},
		filters,
	});

	return response as StrapiCollectionResponse<Product>;
}
