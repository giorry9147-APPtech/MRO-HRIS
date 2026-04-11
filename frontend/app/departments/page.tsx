"use client";

import { FormEvent, useEffect, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function DepartmentsPage() {
	const { user, loading, forbidden } = useAuthGuard("departments.view");
	const [items, setItems] = useState<Array<{ id: number; name: string; code: string | null; status: string; directorate_name?: string }>>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
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
				const response = await apiFetch<{ data: Array<{ id: number; name: string; code: string | null; status: string; directorate_name?: string }> }>("/departments");
				setItems(response.data ?? []);
			} catch {
				setError("Departments konden niet worden geladen.");
			}
		}

		void loadData();
	}, [loading, forbidden]);

	async function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		try {
			if (editingId) {
				const updated = await apiFetch<{ data: { id: number; name: string; code: string | null; status: string; directorate_name?: string } }>(`/departments/${editingId}`, {
					method: "PATCH",
					body: JSON.stringify({ name, code: code || null }),
				});
				setItems((prev) => prev.map((item) => item.id === editingId ? updated.data : item));
			} else {
				const created = await apiFetch<{ data: { id: number; name: string; code: string | null; status: string; directorate_name?: string } }>("/departments", {
					method: "POST",
					body: JSON.stringify({ name, code: code || null, status: "active" }),
				});
				setItems((prev) => [created.data, ...prev]);
			}
			setName("");
			setCode("");
			setEditingId(null);
		} catch {
			setError("Department kon niet worden aangemaakt.");
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

		return `${item.name} ${item.code ?? ""} ${item.status}`.toLowerCase().includes(keyword);
	});

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om departments te bekijken.</p></main>;
	}

	return (
		<ModuleFrame
			title="Departments"
			subtitle="Beheer afdelingen en code-structuur."
			filters={<div className="filter-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek department" /></div>}
		>
			{error && <p className="error">{error}</p>}

			{canCreate && (
				<form onSubmit={handleCreate} className="filter-row">
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
							<div className="muted">Status: {item.status}</div>
						</div>
						<div className="list-row-actions">
							{canCreate && <button className="btn secondary" type="button" onClick={() => { setEditingId(item.id); setName(item.name); setCode(item.code ?? ""); }}>Edit</button>}
							{canDelete && <button className="btn secondary" type="button" onClick={() => void handleDelete(item.id)}>Delete</button>}
						</div>
					</div>
				))}
			</div>
		</ModuleFrame>
	);
}
