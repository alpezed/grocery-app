import { APIResponse } from '@/@types/api';
import type { UserJSON } from '@clerk/shared/types';

// Types for Clerk's specific error format
export interface ClerkErrorDetail {
	message: string;
	long_message: string;
	code: string;
	meta?: Record<string, any>;
}

export interface ClerkErrorResponse {
	errors: ClerkErrorDetail[];
	clerk_trace_id: string;
}

class ClerkAPIError extends Error {
	public errors: ClerkErrorDetail[];
	public traceId: string;

	constructor(data: ClerkErrorResponse) {
		// Use the first error message as the main error message
		const mainMessage = data.errors[0]?.message || 'Unknown Clerk Error';
		super(mainMessage);
		this.name = 'ClerkAPIError';
		this.errors = data.errors;
		this.traceId = data.clerk_trace_id;
	}
}

const CLERK_CONFIG = {
	// NOTE: Be careful—Secret Keys should generally not be exposed via EXPO_PUBLIC
	// unless this code is running in a controlled server-side environment.
	apiKey: process.env.EXPO_PUBLIC_CLERK_SECRET_KEY,
	apiUrl: process.env.EXPO_PUBLIC_CLERK_API_URL,
};

class ClerkService {
	constructor() {
		this.validateConfig();
	}

	private validateConfig() {
		if (!CLERK_CONFIG.apiUrl || !CLERK_CONFIG.apiKey) {
			console.warn(
				'[ClerkService] Configuration missing API URL or Secret Key.'
			);
		}
	}

	/**
	 * Generic request wrapper with enhanced Clerk error handling
	 */
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${CLERK_CONFIG.apiUrl}${endpoint}`;

		try {
			const response = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${CLERK_CONFIG.apiKey}`,
					...options.headers,
				},
			});

			const result = await response.json();

			if (!response.ok) {
				// Handle structured Clerk errors
				if (result.errors) {
					const clerkError = result as ClerkErrorResponse;
					console.error(
						`[ClerkService] API Error (${clerkError.clerk_trace_id}):`,
						clerkError.errors
					);
					throw new ClerkAPIError(clerkError);
				}

				// Fallback for non-Clerk formatted errors
				throw new Error(
					result.message || `Request failed with status ${response.status}`
				);
			}

			return result as T;
		} catch (error) {
			if (error instanceof ClerkAPIError) throw error;

			console.error('[ClerkService] Connectivity or Parsing Error:', error);
			throw error;
		}
	}

	async getUsers() {
		return this.request<UserJSON[]>(`/users`);
	}

	async getUserById(clerkId: string) {
		return this.request<APIResponse<UserJSON>>(`/users/${clerkId}`);
	}
}

export const clerkService = new ClerkService();
