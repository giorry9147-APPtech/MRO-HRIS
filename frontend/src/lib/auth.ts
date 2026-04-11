const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
const AUTH_TOKEN_KEY = "mro_hris_token";

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

export function clearAuthToken(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<AuthUser> {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		throw new Error("Inloggen mislukt. Controleer je e-mail en wachtwoord.");
	}

	const payload = (await res.json()) as LoginResponse;
	setAuthToken(payload.token);

	return payload.user;
}

export async function getMe(): Promise<AuthUser> {
	const token = getAuthToken();

	if (!token) {
		throw new Error("Niet ingelogd.");
	}

	const res = await fetch(`${API_URL}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Sessie verlopen. Log opnieuw in.");
	}

	const payload = (await res.json()) as MeResponse;
	return payload.user;
}

export async function logout(): Promise<void> {
	const token = getAuthToken();

	if (token) {
		await fetch(`${API_URL}/auth/logout`, {
			method: "POST",
			headers: {
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
