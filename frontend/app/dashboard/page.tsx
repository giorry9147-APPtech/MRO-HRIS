"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, getMe, hasPermission, logout } from "@/lib/auth";

type DashboardLink = {
	href: string;
	label: string;
	description: string;
	badge: string;
	permission: string;
	tone: string;
};

const DASHBOARD_LINKS: DashboardLink[] = [
	{
		href: "/employees",
		label: "Medewerkers",
		description: "Personeelsdossiers en actuele status",
		badge: "MW",
		permission: "employees.view",
		tone: "teal",
	},
	{
		href: "/functions",
		label: "Functies",
		description: "Functieprofielen en structuur",
		badge: "FN",
		permission: "functions.view",
		tone: "sand",
	},
	{
		href: "/positions",
		label: "Werkposities",
		description: "Formatieplaatsen en bezetting",
		badge: "WP",
		permission: "positions.view",
		tone: "slate",
	},
	{
		href: "/departments",
		label: "Afdelingen",
		description: "Afdelingsstructuur en koppelingen",
		badge: "AF",
		permission: "departments.view",
		tone: "mist",
	},
	{
		href: "/directorates",
		label: "Directoraten",
		description: "Hoofdstructuur van het ministerie",
		badge: "DR",
		permission: "directorates.view",
		tone: "gold",
	},
	{
		href: "/organogram",
		label: "Organogram",
		description: "Visueel overzicht van de organisatie",
		badge: "OG",
		permission: "directorates.view",
		tone: "ocean",
	},
	{
		href: "/admin/users",
		label: "Gebruikersrechten",
		description: "Toegang en scopes per gebruiker",
		badge: "GR",
		permission: "users.scope.update",
		tone: "rose",
	},
	{
		href: "/documents",
		label: "Documenten",
		description: "Dossiers, uploads en archief",
		badge: "DC",
		permission: "documents.view",
		tone: "paper",
	},
	{
		href: "/assets",
		label: "Bedrijfsmiddelen",
		description: "Uitgifte en beheer van assets",
		badge: "BM",
		permission: "assets.view",
		tone: "steel",
	},
	{
		href: "/reports",
		label: "Rapporten",
		description: "Managementoverzichten en analyses",
		badge: "RP",
		permission: "reports.view",
		tone: "stone",
	},
];

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadCurrentUser() {
			try {
				const currentUser = await getMe();
				setUser(currentUser);
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

	const visibleLinks = user
		? DASHBOARD_LINKS.filter((item) => hasPermission(user, item.permission))
		: [];

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
						<p className="dashboard-subtitle">Centraal platform voor personeelsbeheer, dossiers, werkstructuur en rapportage.</p>

						{error && <p className="error">{error}</p>}

						<div className="dashboard-meta-row">
							<div className="dashboard-meta-card">
								<span className="dashboard-meta-label">Minister</span>
								<strong>Miquella Huur BSc.</strong>
							</div>
							<div className="dashboard-meta-card">
								<span className="dashboard-meta-label">Omgeving</span>
								<strong>MRO-HRIS Productieportaal</strong>
							</div>
						</div>

						{user && (
							<div className="dashboard-welcome-bar">
								<div>
									<p className="dashboard-welcome-title">Welkom, {user.name}</p>
									<p className="muted">{user.email}</p>
								</div>
								<div className="dashboard-role-pill">{(user.roles ?? []).map((role) => role.name).join(", ") || "Geen rollen"}</div>
							</div>
						)}
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
						<div>
							<p className="dashboard-section-kicker">Snelle toegang</p>
							<h2>Navigatie</h2>
						</div>
						<button className="btn secondary" type="button" onClick={handleLogout}>Uitloggen</button>
					</div>

					<div className="dashboard-nav-grid">
						{visibleLinks.map((item) => (
							<Link key={item.href} className={`dashboard-nav-tile tone-${item.tone}`} href={item.href}>
								<span className="dashboard-nav-badge">{item.badge}</span>
								<span className="dashboard-nav-text">
									<strong>{item.label}</strong>
									<small>{item.description}</small>
								</span>
								<span className="dashboard-nav-arrow">›</span>
							</Link>
						))}
					</div>

					<div className="dashboard-footer-note">
						<p>Snelle acties: nieuwe medewerker registreren, document uploaden, bedrijfsmiddelen toewijzen en managementrapporten openen.</p>
					</div>
				</section>
			)}
		</main>
	);
}
