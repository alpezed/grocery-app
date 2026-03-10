import { getStrapiURL } from '@/lib/utils';
import qs from 'qs';

const BASE_URL = getStrapiURL();

interface QueryOptions {
	populate?: object | boolean;
	filters?: object;
	sort?: string[];
	pagination?: {
		page?: number;
		pageSize?: number;
	};
	fields?: string[];
}

async function fetchAPI<T>(
	endpoint: string,
	options?: QueryOptions
): Promise<T> {
	const url = new URL(`/api/${endpoint}`, BASE_URL);
	if (options) {
		url.search = qs.stringify(options, { encode: false });
	}

	const response = await fetch(url.href, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		const text = await response.text();
		console.error('API error response:', text);
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

function single(singularApiId: string) {
	return {
		find: <T>(options?: QueryOptions) => fetchAPI<T>(singularApiId, options),
	};
}

function collection(pluralApiId: string) {
	return {
		find: <T>(options?: QueryOptions) => fetchAPI<T>(pluralApiId, options),
	};
}

export const strapiApi = {
	single,
	collection,
};
