const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");
const AUTH_TOKEN_KEY = "mro_hris_token";
let cachedUser: AuthUser | null = null;
let meRequest: Promise<AuthUser> | null = null;

export type AuthUser = {
	id: number;
	name: string;
	email: string;
	scope_type?: "all" | "directorates" | "departments";
	allowed_directorate_ids?: number[] | null;
	allowed_department_ids?: number[] | null;
	roles?: Array<{
		id: number;
		name: string;
		permissions?: Array<{ id: number; name: string }>;
	}>;
};

type LoginResponse = {
	token: string;
	user: AuthUser;
};

type MeResponse = {
	user: AuthUser;
};

export function getAuthToken(): string | null {
	if (typeof window === "undefined") {
		return null;
	}

	return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function setCachedAuthUser(user: AuthUser | null): void {
	cachedUser = user;
}

export function clearAuthToken(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(AUTH_TOKEN_KEY);
	cachedUser = null;
	meRequest = null;
}

export async function login(email: string, password: string): Promise<AuthUser> {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		throw new Error("Inloggen mislukt. Controleer je e-mail en wachtwoord.");
	}

	const contentType = res.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		throw new Error("Backend gaf geen JSON terug. Controleer NEXT_PUBLIC_API_URL in Vercel en APP_URL/CORS in Railway.");
	}

	const payload = (await res.json()) as LoginResponse;
	setAuthToken(payload.token);
	setCachedAuthUser(payload.user);

	return payload.user;
}

export async function getMe(): Promise<AuthUser> {
	if (cachedUser) {
		return cachedUser;
	}

	if (meRequest) {
		return meRequest;
	}

	const token = getAuthToken();

	if (!token) {
		throw new Error("Niet ingelogd.");
	}

	meRequest = (async () => {
		const res = await fetch(`${API_URL}/auth/me`, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			throw new Error("Sessie verlopen. Log opnieuw in.");
		}

		const payload = (await res.json()) as MeResponse;
		cachedUser = payload.user;
		return payload.user;
	})();

	try {
		return await meRequest;
	} finally {
		meRequest = null;
	}
}

export async function logout(): Promise<void> {
	const token = getAuthToken();

	if (token) {
		await fetch(`${API_URL}/auth/logout`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	}

	clearAuthToken();
}

export function getUserPermissions(user: AuthUser | null): string[] {
	if (!user?.roles?.length) {
		return [];
	}

	const permissions = user.roles.flatMap((role) => role.permissions?.map((permission) => permission.name) ?? []);
	return [...new Set(permissions)];
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
	if (!user) {
		return false;
	}

	const permissions = getUserPermissions(user);
	return permissions.includes(permission);
}
