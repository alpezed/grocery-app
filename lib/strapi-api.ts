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
	options?: QueryOptions & {
		method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
		data?: Record<string, any>;
	}
): Promise<T> {
	const url = new URL(`/api/${endpoint}`, BASE_URL);
	if (options) {
		url.search = qs.stringify(options, { encode: false });
	}

	const fetchOptions: RequestInit = {
		headers: {
			'Content-Type': 'application/json',
		},
		method: options?.method || 'GET',
	};

	if (options?.method === 'POST' || options?.method === 'PUT') {
		fetchOptions.body = JSON.stringify({ data: options?.data });
	}

	const response = await fetch(url.href, fetchOptions);

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
		create: <T>(data: Record<string, any>) =>
			fetchAPI<T>(pluralApiId, {
				method: 'POST',
				data,
			}),
		update: <T>(id: string, data: Record<string, any>) =>
			fetchAPI<T>(`${pluralApiId}/${id}`, {
				method: 'PUT',
				data,
			}),
	};
}

export const strapiApi = {
	single,
	collection,
};
