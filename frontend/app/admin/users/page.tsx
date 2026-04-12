"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

type ScopeType = "all" | "directorates" | "departments";

type UserRow = {
	id: number;
	name: string;
	email: string;
	scope_type: ScopeType;
	allowed_directorate_ids: number[] | null;
	allowed_department_ids: number[] | null;
};

type Directorate = { id: number; name: string; code: string };
type Department = { id: number; name: string; code: string; directorate_id: number | null };

export default function AdminUserScopePage() {
	const { loading, forbidden } = useAuthGuard("users.scope.update");
	const [users, setUsers] = useState<UserRow[]>([]);
	const [directorates, setDirectorates] = useState<Directorate[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [savingUserId, setSavingUserId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadData() {
			try {
				const [usersResp, directoratesResp, departmentsResp] = await Promise.all([
					apiFetch<{ data: UserRow[] }>("/users?per_page=200"),
					apiFetch<{ data: Directorate[] }>("/directorates?per_page=200"),
					apiFetch<{ data: Department[] }>("/departments?per_page=500"),
				]);

				setUsers(usersResp.data ?? []);
				setDirectorates(directoratesResp.data ?? []);
				setDepartments(departmentsResp.data ?? []);
			} catch {
				setError("Kon gebruikersscope-gegevens niet laden.");
			}
		}

		void loadData();
	}, [loading, forbidden]);

	const directorateMap = useMemo(() => {
		return directorates.reduce<Record<number, Directorate>>((acc, directorate) => {
			acc[directorate.id] = directorate;
			return acc;
		}, {});
	}, [directorates]);

	async function saveScope(user: UserRow) {
		setSavingUserId(user.id);
		setError(null);

		try {
			await apiFetch(`/users/${user.id}/scope`, {
				method: "PATCH",
				body: JSON.stringify({
					scope_type: user.scope_type,
					allowed_directorate_ids: user.scope_type === "directorates" ? (user.allowed_directorate_ids ?? []) : [],
					allowed_department_ids: user.scope_type === "departments" ? (user.allowed_department_ids ?? []) : [],
				}),
			});
		} catch {
			setError(`Opslaan mislukt voor ${user.name}.`);
		} finally {
			setSavingUserId(null);
		}
	}

	function toggleNumberInArray(values: number[] | null, id: number): number[] {
		const list = values ?? [];
		return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
	}

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om gebruikersscopes te beheren.</p></main>;
	}

	return (
		<ModuleFrame title="Beheer - Gebruikersscopes" subtitle="Beheer zichtbaarheid per gebruiker op directoraat- en afdelingsniveau.">
			{error && <p className="error">{error}</p>}

			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							<th>Gebruiker</th>
							<th>Scopetype</th>
							<th>Toegestane Directoraten / Afdelingen</th>
							<th>Actie</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>
									<div>{user.name}</div>
									<div className="muted">{user.email}</div>
								</td>
								<td>
									<select
										value={user.scope_type}
										onChange={(event) => {
											const next = event.target.value as ScopeType;
											setUsers((prev) => prev.map((row) => row.id === user.id ? { ...row, scope_type: next } : row));
										}}
									>
										<option value="all">Alles</option>
										<option value="directorates">Directoraten</option>
										<option value="departments">Afdelingen</option>
									</select>
								</td>
								<td>
									{user.scope_type === "all" && <span className="muted">Volledige toegang</span>}

									{user.scope_type === "directorates" && (
										<div className="list-grid">
											{directorates.map((directorate) => {
												const checked = (user.allowed_directorate_ids ?? []).includes(directorate.id);
												return (
													<label key={directorate.id} style={{ display: "block" }}>
														<input
															type="checkbox"
															checked={checked}
															onChange={() => {
																setUsers((prev) => prev.map((row) => row.id === user.id
																	? { ...row, allowed_directorate_ids: toggleNumberInArray(row.allowed_directorate_ids, directorate.id) }
																	: row));
															}}
														/>
														{` ${directorate.name} (${directorate.code})`}
													</label>
												);
											})}
										</div>
									)}

									{user.scope_type === "departments" && (
										<div className="list-grid">
											{departments.map((department) => {
												const checked = (user.allowed_department_ids ?? []).includes(department.id);
												const directorate = department.directorate_id ? directorateMap[department.directorate_id] : null;
												return (
													<label key={department.id} style={{ display: "block" }}>
														<input
															type="checkbox"
															checked={checked}
															onChange={() => {
																setUsers((prev) => prev.map((row) => row.id === user.id
																	? { ...row, allowed_department_ids: toggleNumberInArray(row.allowed_department_ids, department.id) }
																	: row));
															}}
														/>
														{` ${department.name} (${directorate?.name ?? "Geen directoraat"})`}
													</label>
												);
											})}
										</div>
									)}
								</td>
								<td>
									<button
										className="btn"
										type="button"
										disabled={savingUserId === user.id}
										onClick={() => void saveScope(user)}
									>
										{savingUserId === user.id ? "Opslaan..." : "Opslaan"}
									</button>
								</td>
							</tr>
						))}
						{users.length === 0 && (
							<tr>
								<td colSpan={4} className="muted">Geen gebruikers gevonden.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</ModuleFrame>
	);
}
