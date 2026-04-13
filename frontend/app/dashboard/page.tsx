"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AuthUser, getMe, hasPermission, logout } from "@/lib/auth";

type DashboardLink = {
	id: string;
	href: string;
	label: string;
	icon: string;
	permission: string;
};

const DASHBOARD_LINKS: DashboardLink[] = [
	{
		id: "employees",
		href: "/employees",
		label: "Medewerkers",
		icon: "👥",
		permission: "employees.view",
	},
	{
		id: "functions",
		href: "/functions",
		label: "Functies",
		icon: "💼",
		permission: "functions.view",
	},
	{
		id: "positions",
		href: "/positions",
		label: "Werkposities",
		icon: "🎖️",
		permission: "positions.view",
	},
	{
		id: "departments",
		href: "/departments",
		label: "Afdelingen",
		icon: "🗂️",
		permission: "departments.view",
	},
	{
		id: "directorates",
		href: "/directorates",
		label: "Directoraten",
		icon: "🏛️",
		permission: "directorates.view",
	},
	{
		id: "organogram",
		href: "/organogram",
		label: "Organogram",
		icon: "📊",
		permission: "directorates.view",
	},
	{
		id: "user-scopes",
		href: "/admin/users",
		label: "Gebruikersrechten",
		icon: "🔑",
		permission: "users.scope.update",
	},
	{
		id: "documents",
		href: "/documents",
		label: "Documenten",
		icon: "📄",
		permission: "documents.view",
	},
	{
		id: "assets",
		href: "/assets",
		label: "Bedrijfsmiddelen",
		icon: "🧰",
		permission: "assets.view",
	},
	{
		id: "reports",
		href: "/reports",
		label: "Rapporten",
		icon: "📈",
		permission: "reports.view",
	},
];

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [kpis, setKpis] = useState<{
		employees: number | null;
		directorates: number | null;
		departments: number | null;
		functions: number | null;
	}>({
		employees: null,
		directorates: null,
		departments: null,
		functions: null,
	});

	useEffect(() => {
		async function loadCurrentUser() {
			try {
				const currentUser = await getMe();
				setUser(currentUser);

				const [summaryResponse, functionsResponse] = await Promise.all([
					apiFetch<{ data: { employees: number; directorates: number; departments: number } }>("/reports/summary"),
					apiFetch<{ data: Array<{ id: number }> }>("/job-functions?per_page=2000"),
				]);

				setKpis({
					employees: summaryResponse.data?.employees ?? 0,
					directorates: summaryResponse.data?.directorates ?? 0,
					departments: summaryResponse.data?.departments ?? 0,
					functions: (functionsResponse.data ?? []).length,
				});
			} catch {
				setError("Je sessie is ongeldig. Log opnieuw in.");
				router.replace("/login");
			}
		}

		void loadCurrentUser();
	}, [router]);

	async function handleLogout() {
		await logout();
		router.replace("/login");
	}

	const visibleLinks = user ? DASHBOARD_LINKS.filter((item) => hasPermission(user, item.permission)) : [];
	const visibleMap = new Map(visibleLinks.map((item) => [item.id, item]));

	const orderedTiles = [
		visibleMap.get("employees"),
		visibleMap.get("functions"),
		visibleMap.get("positions"),
		visibleMap.get("departments"),
		visibleMap.get("directorates"),
		visibleMap.get("organogram"),
		visibleMap.get("user-scopes"),
		visibleMap.get("documents"),
		visibleMap.get("assets"),
		{ id: "logout", href: "#", label: "Uitloggen", icon: "📩", permission: "" },
		visibleMap.get("reports"),
	].filter(Boolean) as DashboardLink[];

	const featuredTileId = orderedTiles.find((item) => item.id !== "logout")?.id;

	return (
		<main className="dashboard-page">
			<section className="card dashboard-hero-card">
				<div className="dashboard-hero-grid">
					<div className="dashboard-emblem-block">
						<Image
							src="/dashboard/ministerie-embleem-placeholder.svg"
							alt="Plaats hier uw ministerieel embleem"
							width={180}
							height={180}
							className="dashboard-emblem-image"
							priority
						/>
						<p className="dashboard-image-hint">Vervang dit bestand met uw eigen embleem.</p>
					</div>

					<div className="dashboard-hero-copy">
						<p className="dashboard-kicker">Ministerie van Regionale Ontwikkeling en Sport</p>
						<h1>Human Resource Informatie Systeem</h1>
						<div className="dashboard-title-rule" />
						<p className="dashboard-subtitle">Ministerie van Regionale Ontwikkeling en Sport</p>

						{error && <p className="error">{error}</p>}
						<p className="dashboard-minister">Minister: Miquella Huur BSc.</p>

						{user && (
							<div className="dashboard-welcome-bar simple">
								<div>
									<p className="dashboard-welcome-title">Welkom, {user.name} <span className="muted">({user.email})</span></p>
								</div>
							</div>
						)}

						<div className="dashboard-kpi-row">
							<div className="dashboard-kpi-card">
								<span>Medewerkers</span>
								<strong>{kpis.employees ?? "-"}</strong>
							</div>
							<div className="dashboard-kpi-card">
								<span>Directoraten</span>
								<strong>{kpis.directorates ?? "-"}</strong>
							</div>
							<div className="dashboard-kpi-card">
								<span>Afdelingen</span>
								<strong>{kpis.departments ?? "-"}</strong>
							</div>
							<div className="dashboard-kpi-card">
								<span>Functies</span>
								<strong>{kpis.functions ?? "-"}</strong>
							</div>
						</div>
					</div>
				</div>

				<div className="dashboard-banner-shell">
					<Image
						src="/dashboard/ministerie-banner-placeholder.svg"
						alt="Plaats hier uw dashboardbanner"
						fill
						className="dashboard-banner-image"
						sizes="(max-width: 860px) 100vw, 60vw"
					/>
					<div className="dashboard-banner-overlay" />
					<p className="dashboard-banner-hint">Vervang dit bestand met uw eigen headerafbeelding.</p>
				</div>

			</section>

			{user && (
				<section className="card dashboard-navigation-card">
					<div className="dashboard-section-head">
						<h2>Navigatie</h2>
					</div>

					<div className="dashboard-nav-grid">
						{orderedTiles.map((item) => (
							item.id === "logout" ? (
								<button key="logout" className="dashboard-nav-tile" type="button" onClick={handleLogout}>
									<span className="dashboard-nav-icon">{item.icon}</span>
									<span className="dashboard-nav-label">{item.label}</span>
								</button>
							) : (
								<Link key={item.href} className={`dashboard-nav-tile${item.id === featuredTileId ? " featured" : ""}`} href={item.href}>
									<span className="dashboard-nav-icon">{item.icon}</span>
									<span className="dashboard-nav-label">{item.label}</span>
									{item.id === featuredTileId ? <span className="dashboard-nav-arrow">›</span> : null}
								</Link>
							)
						))}
					</div>

					<p style={{ marginTop: "0.35rem", marginBottom: 0 }}>
						<button className="btn secondary" type="button" onClick={handleLogout}>Uitloggen</button>
					</p>

					<div className="dashboard-footer-note">
						<p>Snelle acties: nieuwe medewerker, document uploaden, asset toewijzen, rapport bekijken.</p>
					</div>
				</section>
			)}
		</main>
	);
}
