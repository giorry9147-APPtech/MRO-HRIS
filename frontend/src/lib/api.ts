import { getAuthToken } from "@/lib/auth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const token = getAuthToken();
	const headers = new Headers(options.headers);
	headers.set("Accept", "application/json");

	if (!(options.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	const res = await fetch(`${API_URL}${endpoint}`, {
		headers,
		...options,
	});

	if (!res.ok) {
		const errorBody = await res.text();
		let errorMessage = errorBody || "API error";

		try {
			const parsed = JSON.parse(errorBody) as { message?: string; errors?: Record<string, string[]> };
			if (parsed.message) {
				errorMessage = parsed.message;
			}

			if (parsed.errors) {
				const firstFieldErrors = Object.values(parsed.errors).find((messages) => Array.isArray(messages) && messages.length > 0);
				if (firstFieldErrors && firstFieldErrors[0]) {
					errorMessage = firstFieldErrors[0];
				}
			}
		} catch {
			// Keep raw response text if it is not JSON.
		}

		throw new ApiError(res.status, errorMessage);
	}

	const contentType = res.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		throw new ApiError(res.status, "De API gaf geen JSON terug. Controleer NEXT_PUBLIC_API_URL en backend instellingen.");
	}

	return res.json() as Promise<T>;
}
