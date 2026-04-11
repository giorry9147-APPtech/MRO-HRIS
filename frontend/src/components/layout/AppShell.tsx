"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { AuthUser, getMe, hasPermission, logout } from "@/lib/auth";

type AppShellProps = {
	children: ReactNode;
};

type NavItem = {
	href: string;
	label: string;
	permission?: string;
};

const PUBLIC_ROUTES = ["/", "/login"];

const NAV_ITEMS: NavItem[] = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/employees", label: "Medewerkers", permission: "employees.view" },
	{ href: "/functions", label: "Functies", permission: "functions.view" },
	{ href: "/positions", label: "Posities", permission: "positions.view" },
	{ href: "/departments", label: "Afdelingen", permission: "departments.view" },
	{ href: "/directorates", label: "Directoraten", permission: "directorates.view" },
	{ href: "/documents", label: "Dossiers", permission: "documents.view" },
	{ href: "/assets", label: "Assets", permission: "assets.view" },
	{ href: "/reports", label: "Rapporten", permission: "reports.view" },
];

export default function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [checkingSession, setCheckingSession] = useState(true);

	const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

	useEffect(() => {
		if (isPublicRoute) {
			setCheckingSession(false);
			return;
		}

		async function loadSession() {
			try {
				const currentUser = await getMe();
				setUser(currentUser);
			} catch {
				router.replace("/login");
			} finally {
				setCheckingSession(false);
			}
		}

		void loadSession();
	}, [isPublicRoute, router]);

	const visibleLinks = useMemo(() => {
		if (!user) {
			return [];
		}

		return NAV_ITEMS.filter((item) => !item.permission || hasPermission(user, item.permission));
	}, [user]);

	async function handleLogout() {
		await logout();
		router.replace("/login");
	}

	if (isPublicRoute) {
		return <div className="page-shell">{children}</div>;
	}

	if (checkingSession) {
		return (
			<div className="page-shell">
				<main className="card">
					<p>Session controleren...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="workspace-shell">
			<aside className="workspace-sidebar">
				<h2>MRO-HRIS</h2>
				<p className="muted">Ministerie HR Platform</p>
				<nav className="workspace-nav">
					{visibleLinks.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`workspace-link${pathname === item.href ? " active" : ""}`}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</aside>
			<div className="workspace-content">
				<header className="workspace-header card">
					<div>
						<p className="muted" style={{ margin: 0 }}>Ingelogd als</p>
						<strong>{user?.name ?? "Gebruiker"}</strong>
					</div>
					<button type="button" className="btn secondary" onClick={() => void handleLogout()}>
						Uitloggen
					</button>
				</header>
				<main className="workspace-main">{children}</main>
			</div>
		</div>
	);
}