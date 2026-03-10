import { StrapiCollectionResponse } from '@/@types/strapi';
import { strapiApi } from '@/lib/strapi-api';
import { Product } from '@/schema/product.schema';

const PAGE_SIZE = 10;

const products = strapiApi.collection('products');

export async function getProducts(
	params: any
): Promise<StrapiCollectionResponse<Product>> {
	const { page = 1, pageSize = PAGE_SIZE, name } = params || {};

	const filters = name
		? {
				name: { $containsi: name },
			}
		: undefined;

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
		},
		filters,
	});

	return response as StrapiCollectionResponse<Product>;
}
