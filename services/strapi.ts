import { StrapiUser } from '@/schema/user';

class StrapiService {
	private apiKey: string;
	private apiUrl: string;

	constructor() {
		if (!process.env.EXPO_PUBLIC_STRAPI_API_KEY) {
			throw new Error('EXPO_PUBLIC_STRAPI_API_KEY is not set');
		}
		if (!process.env.EXPO_PUBLIC_STRAPI_URL) {
			throw new Error('EXPO_PUBLIC_STRAPI_URL is not set');
		}
		this.apiKey = process.env.EXPO_PUBLIC_STRAPI_API_KEY;
		this.apiUrl = process.env.EXPO_PUBLIC_STRAPI_URL;
	}

	async createUser(user: StrapiUser) {
		try {
			const response = await fetch(`${this.apiUrl}/api/auth/local/register`, {
				method: 'POST',
				body: JSON.stringify(user),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.apiKey}`,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to register user');
			}
			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error creating user:', error);
			throw error;
		}
	}
}

export default StrapiService;
