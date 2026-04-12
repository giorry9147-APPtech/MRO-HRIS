"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, getMe, hasPermission, logout } from "@/lib/auth";

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

	return (
		<main className="grid" style={{ gap: "1rem" }}>
			<section className="card">
				<h1 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Human Resource Informatie Systeem</h1>
				<p style={{ marginTop: 0, marginBottom: "0.35rem", fontWeight: 600 }}>Ministerie van Regionale Ontwikkeling en Sport</p>
				<p className="muted" style={{ marginTop: 0 }}>Minister: Miquella Huur BSc.</p>

				{error && <p className="error">{error}</p>}

				{user && (
					<>
						<p>Welkom, <strong>{user.name}</strong> ({user.email})</p>
						<p className="muted">Rollen: {(user.roles ?? []).map((role) => role.name).join(", ") || "Geen"}</p>
					</>
				)}
			</section>

			{user && (
				<section className="card">
					<h2 style={{ marginTop: 0 }}>Navigatie</h2>
					<div className="section-links">
						{hasPermission(user, "employees.view") && <Link className="section-link" href="/employees">Medewerkers</Link>}
						{hasPermission(user, "functions.view") && <Link className="section-link" href="/functions">Functies</Link>}
						{hasPermission(user, "positions.view") && <Link className="section-link" href="/positions">Werkposities</Link>}
						{hasPermission(user, "departments.view") && <Link className="section-link" href="/departments">Afdelingen</Link>}
						{hasPermission(user, "directorates.view") && <Link className="section-link" href="/directorates">Directoraten</Link>}
						{hasPermission(user, "directorates.view") && <Link className="section-link" href="/organogram">Organogram</Link>}
						{hasPermission(user, "users.scope.update") && <Link className="section-link" href="/admin/users">Gebruikersrechten</Link>}
						{hasPermission(user, "documents.view") && <Link className="section-link" href="/documents">Documenten</Link>}
						{hasPermission(user, "assets.view") && <Link className="section-link" href="/assets">Bedrijfsmiddelen</Link>}
						{hasPermission(user, "reports.view") && <Link className="section-link" href="/reports">Rapporten</Link>}
					</div>
					<p style={{ marginTop: "1rem", marginBottom: 0 }}>
						<button className="btn secondary" type="button" onClick={handleLogout}>Uitloggen</button>
					</p>
					<p className="muted" style={{ marginBottom: 0 }}>Snelle acties: nieuwe medewerker, document uploaden, asset toewijzen, rapport bekijken.</p>
				</section>
			)}
		</main>
	);
}
