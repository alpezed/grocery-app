import { APIResponse } from '@/@types/api';
import { Address, AddressResponse } from '@/schema/address.schema';
import { FavoriteProduct, Product } from '@/schema/product.schema';
import { Review, ReviewInput, ReviewResponse } from '@/schema/review.schema';
import { StrapiUser } from '@/schema/user.schema';
import qs from 'qs';

const STRAPI_CONFIG = {
	// Use EXPO_PUBLIC_ prefix so the token is available in the client (required for Expo)
	apiKey: process.env.EXPO_PUBLIC_STRAPI_API_ADMIN_TOKEN,
	apiUrl: process.env.EXPO_PUBLIC_STRAPI_URL,
};

class StrapiService {
	constructor() {
		this.validateConfig();
	}

	private validateConfig() {
		if (!STRAPI_CONFIG.apiUrl) {
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
				...(STRAPI_CONFIG.apiKey && {
					Authorization: `Bearer ${STRAPI_CONFIG.apiKey}`,
				}),
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const message =
				errorData.error?.message ??
				(typeof errorData.message === 'string' ? errorData.message : null) ??
				`Request failed: ${response.status}`;
			throw new Error(message);
		}

		// Strapi DELETE returns 204 No Content with empty body - don't parse as JSON
		const text = await response.text();
		if (!text || text.trim() === '') {
			return null as T;
		}
		return JSON.parse(text) as T;
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

	async getProductById(productId: string) {
		const query = qs.stringify({
			populate: '*',
		});
		try {
			const result = await this.request<APIResponse<Product>>(
				`/products/${productId}?${query}`
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Product Error:', error);
			throw error;
		}
	}

	async getProducts() {
		const query = qs.stringify({
			populate: '*',
		});
		try {
			const result = await this.request<APIResponse<Product[]>>(
				`/products?${query}`
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Products Error:', error);
			throw error;
		}
	}

	async markAsFavorite(productId: string, clerkId: string) {
		console.log('Marking as favorite', productId, clerkId);
		try {
			const result = await this.request<APIResponse<{ id: number }>>(
				`/favorites`,
				{
					method: 'POST',
					body: JSON.stringify({
						data: {
							clerkId,
							product: productId,
						},
					}),
				}
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Mark as Favorite Error:', error);
			throw error;
		}
	}

	async removeFromFavorite(documentId: string) {
		console.log('Removing from favorite', documentId);
		try {
			await this.request(`/favorites/${documentId}`, {
				method: 'DELETE',
			});
		} catch (error) {
			console.error('[StrapiService] Remove from Favorite Error:', error);
			throw error;
		}
	}

	async createReview(review: ReviewInput) {
		try {
			const result = await this.request<APIResponse<Review>>(`/reviews`, {
				method: 'POST',
				body: JSON.stringify({ data: review }),
			});
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Create Review Error:', error);
			throw error;
		}
	}

	async getReviewsByProductId(productId: string) {
		const query = qs.stringify({
			populate: '*',
			sort: 'createdAt:desc',
			filters: {
				product: {
					documentId: {
						$eq: productId,
					},
				},
			},
		});
		try {
			const result = await this.request<APIResponse<ReviewResponse[]>>(
				`/reviews?${query}`
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Get Reviews Error:', error);
			throw error;
		}
	}

	async getFavoriteProducts() {
		const query = qs.stringify({
			populate: {
				product: { populate: 'image' },
			},
		});
		try {
			const result = await this.request<APIResponse<FavoriteProduct[]>>(
				`/favorites?${query}`
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Favorite Products Error:', error);
			throw error;
		}
	}

	async createAddress(address: Address) {
		console.log({ address });
		try {
			const result = await this.request<APIResponse<AddressResponse>>(
				`/addresses`,
				{
					method: 'POST',
					body: JSON.stringify({ data: address }),
				}
			);
			return result.data;
		} catch (error) {
			console.error('[StrapiService] Create Address Error:', error);
			throw error;
		}
	}
}

export const strapiService = new StrapiService();
