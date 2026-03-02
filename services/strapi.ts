import { APIResponse } from '@/@types/api';
import { Product } from '@/schema/product.schema';
import { StrapiUser } from '@/schema/user.schema';

const STRAPI_CONFIG = {
	apiKey: process.env.EXPO_PUBLIC_STRAPI_API_KEY,
	apiUrl: process.env.EXPO_PUBLIC_STRAPI_URL,
};

class StrapiService {
	constructor() {
		this.validateConfig();
	}

	private validateConfig() {
		if (!STRAPI_CONFIG.apiKey || !STRAPI_CONFIG.apiUrl) {
			throw new Error('Strapi environment variables are missing');
		}
	}

	/**
	 * Generic request wrapper to handle headers and error parsing
	 */
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${STRAPI_CONFIG.apiUrl}/api${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${STRAPI_CONFIG.apiKey}`,
				...options.headers,
			},
		});

		if (!response.ok) {
			// Strapi often provides detailed errors in the body
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error?.message || `Request failed: ${response.status}`
			);
		}

		return response.json();
	}

	async createUser(user: StrapiUser) {
		try {
			const result = await this.request<{ data: any }>('/auth/local/register', {
				method: 'POST',
				body: JSON.stringify(user),
			});

			return result.data;
		} catch (error) {
			// Log locally, but let the UI handle the specific error message
			console.error('[StrapiService] Registration Error:', error);
			throw error;
		}
	}

	async getProducts() {
		try {
			const result = await this.request<APIResponse<Product[]>>(
				'/products?populate[0]=image'
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Products Error:', error);
			throw error;
		}
	}
}

export const strapiService = new StrapiService();
