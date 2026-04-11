"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AuthUser, getMe, hasPermission, logout } from "@/lib/auth";

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [summary, setSummary] = useState<null | {
		employees: number;
		directorates: number;
		departments: number;
		positions: number;
		documents: number;
		assets: number;
	}>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadCurrentUser() {
			try {
				const currentUser = await getMe();
				setUser(currentUser);
				if (hasPermission(currentUser, "reports.view")) {
					const reportSummary = await apiFetch<{ data: { employees: number; directorates: number; departments: number; positions: number; documents: number; assets: number } }>("/reports/summary");
					setSummary(reportSummary.data);
				}
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
				<h1 style={{ marginTop: 0 }}>Dashboard</h1>

				{error && <p className="error">{error}</p>}

				{user && (
					<>
						<p>Welkom, <strong>{user.name}</strong> ({user.email})</p>
						<p className="muted">Rollen: {(user.roles ?? []).map((role) => role.name).join(", ") || "Geen"}</p>

						<div className="stat-grid">
							<div className="stat"><div className="muted">Medewerkers</div><div>{summary?.employees ?? "-"}</div></div>
							<div className="stat"><div className="muted">Posities</div><div>{summary?.positions ?? "-"}</div></div>
							<div className="stat"><div className="muted">Assets</div><div>{summary?.assets ?? "-"}</div></div>
							<div className="stat"><div className="muted">Directoraten</div><div>{summary?.directorates ?? "-"}</div></div>
							<div className="stat"><div className="muted">Afdelingen</div><div>{summary?.departments ?? "-"}</div></div>
							<div className="stat"><div className="muted">Dossiers</div><div>{summary?.documents ?? "-"}</div></div>
						</div>
					</>
				)}
			</section>

			{summary && (
				<section className="card">
					<h2 style={{ marginTop: 0 }}>KPI Visuals (MVP Placeholder)</h2>
					<div className="chart-placeholder">
						<div>
							<p className="muted" style={{ marginBottom: "0.35rem" }}>Employees vs Positions</p>
							<div className="chart-bar"><span style={{ width: `${Math.min(100, (summary.employees / Math.max(summary.positions || 1, 1)) * 100)}%` }} /></div>
						</div>
						<div>
							<p className="muted" style={{ marginBottom: "0.35rem" }}>Documents coverage vs Employees</p>
							<div className="chart-bar"><span style={{ width: `${Math.min(100, (summary.documents / Math.max(summary.employees || 1, 1)) * 100)}%` }} /></div>
						</div>
						<div>
							<p className="muted" style={{ marginBottom: "0.35rem" }}>Assets allocation vs Employees</p>
							<div className="chart-bar"><span style={{ width: `${Math.min(100, (summary.assets / Math.max(summary.employees || 1, 1)) * 100)}%` }} /></div>
						</div>
					</div>
				</section>
			)}

			{user && (
				<section className="card">
					<h2 style={{ marginTop: 0 }}>Navigation</h2>
					<div className="section-links">
						{hasPermission(user, "employees.view") && <Link className="section-link" href="/employees">Employees</Link>}
						{hasPermission(user, "functions.view") && <Link className="section-link" href="/functions">Functions</Link>}
						{hasPermission(user, "positions.view") && <Link className="section-link" href="/positions">Positions</Link>}
						{hasPermission(user, "departments.view") && <Link className="section-link" href="/departments">Departments</Link>}
						{hasPermission(user, "directorates.view") && <Link className="section-link" href="/directorates">Directorates</Link>}
						{hasPermission(user, "directorates.view") && <Link className="section-link" href="/organogram">Organogram</Link>}
						{hasPermission(user, "users.scope.update") && <Link className="section-link" href="/admin/users">User Scopes</Link>}
						{hasPermission(user, "documents.view") && <Link className="section-link" href="/documents">Documents</Link>}
						{hasPermission(user, "assets.view") && <Link className="section-link" href="/assets">Assets</Link>}
						{hasPermission(user, "reports.view") && <Link className="section-link" href="/reports">Reports</Link>}
					</div>
					<p style={{ marginTop: "1rem", marginBottom: 0 }}>
						<button className="btn secondary" type="button" onClick={handleLogout}>Uitloggen</button>
					</p>
					<p className="muted" style={{ marginBottom: 0 }}>Snelle acties: Nieuwe medewerker, document upload, asset toevoegen, rapport bekijken.</p>
				</section>
			)}
		</main>
	);
}
