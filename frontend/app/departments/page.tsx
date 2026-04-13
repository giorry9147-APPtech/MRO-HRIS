"use client";

import { FormEvent, useEffect, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function DepartmentsPage() {
	const { user, loading, forbidden } = useAuthGuard("departments.view");
	const [items, setItems] = useState<Array<{ id: number; name: string; code: string | null; status: string; directorate_id?: number | null; directorate_name?: string }>>([]);
	const [directorates, setDirectorates] = useState<Array<{ id: number; name: string }>>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [directorateId, setDirectorateId] = useState("");
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);

	const canCreate = hasPermission(user, "departments.create");
	const canDelete = hasPermission(user, "departments.delete");

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadData() {
			try {
				const [departmentResponse, directorateResponse] = await Promise.all([
					apiFetch<{ data: Array<{ id: number; name: string; code: string | null; status: string; directorate_id?: number | null; directorate_name?: string }> }>("/departments?per_page=2000"),
					apiFetch<{ data: Array<{ id: number; name: string }> }>("/directorates?per_page=2000"),
				]);
				setItems(departmentResponse.data ?? []);
				setDirectorates(directorateResponse.data ?? []);
			} catch {
				setError("Afdelingen konden niet worden geladen.");
			}
		}

		void loadData();
	}, [loading, forbidden]);

	async function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		try {
			if (editingId) {
				const updated = await apiFetch<{ data: { id: number; name: string; code: string | null; status: string; directorate_id?: number | null; directorate_name?: string } }>(`/departments/${editingId}`, {
					method: "PATCH",
					body: JSON.stringify({ name, code: code || null, directorate_id: directorateId ? Number(directorateId) : null }),
				});
				setItems((prev) => prev.map((item) => item.id === editingId ? updated.data : item));
			} else {
				const created = await apiFetch<{ data: { id: number; name: string; code: string | null; status: string; directorate_id?: number | null; directorate_name?: string } }>("/departments", {
					method: "POST",
					body: JSON.stringify({
						name,
						code: code || null,
						directorate_id: directorateId ? Number(directorateId) : null,
						status: "active",
					}),
				});
				setItems((prev) => [created.data, ...prev]);
			}
			setName("");
			setCode("");
			setDirectorateId("");
			setEditingId(null);
		} catch {
			setError("Afdeling kon niet worden opgeslagen.");
		}
	}

	async function handleDelete(id: number) {
		await apiFetch<{ message: string }>(`/departments/${id}`, { method: "DELETE" });
		setItems((prev) => prev.filter((item) => item.id !== id));
	}

	const filteredItems = items.filter((item) => {
		const keyword = query.trim().toLowerCase();
		if (!keyword) {
			return true;
		}

		return `${item.name} ${item.code ?? ""} ${item.status} ${item.directorate_name ?? ""}`.toLowerCase().includes(keyword);
	});

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om afdelingen te bekijken.</p></main>;
	}

	return (
		<ModuleFrame
			title="Afdelingen"
			subtitle="Beheer afdelingen en code-structuur."
			filters={<div className="filter-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek afdeling" /></div>}
		>
			{error && <p className="error">{error}</p>}

			{canCreate && (
				<form onSubmit={handleCreate} className="filter-row">
					<select value={directorateId} onChange={(event) => setDirectorateId(event.target.value)}>
						<option value="">Selecteer directoraat</option>
						{directorates.map((directorate) => <option key={directorate.id} value={directorate.id}>{directorate.name}</option>)}
					</select>
					<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Naam" required />
					<input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code (optioneel)" />
					<button className="btn" type="submit">{editingId ? "Opslaan" : "Toevoegen"}</button>
				</form>
			)}

			<div className="list-grid">
				{filteredItems.map((item) => (
					<div key={item.id} className="list-row">
						<div>
							<strong>{item.name}</strong> ({item.code ?? "-"})
							{item.directorate_name ? <div className="muted">Directoraat: {item.directorate_name}</div> : null}
							<div className="muted">Status: {item.status}</div>
						</div>
						<div className="list-row-actions">
							{canCreate && <button className="btn secondary" type="button" onClick={() => { setEditingId(item.id); setName(item.name); setCode(item.code ?? ""); setDirectorateId(item.directorate_id ? String(item.directorate_id) : ""); }}>Bewerken</button>}
							{canDelete && <button className="btn secondary" type="button" onClick={() => void handleDelete(item.id)}>Verwijderen</button>}
						</div>
					</div>
				))}
			</div>
		</ModuleFrame>
	);
}
