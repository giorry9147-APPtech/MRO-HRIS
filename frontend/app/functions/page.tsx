"use client";

import { FormEvent, useEffect, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function FunctionsPage() {
	const { user, loading, forbidden } = useAuthGuard("functions.view");
	const [items, setItems] = useState<Array<{ id: number; code: string | null; title: string; description: string | null; is_active: boolean }>>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [isActive, setIsActive] = useState(true);
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);

	const canCreate = hasPermission(user, "functions.create");
	const canDelete = hasPermission(user, "functions.delete");

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadData() {
			try {
				const response = await apiFetch<{ data: Array<{ id: number; code: string | null; title: string; description: string | null; is_active: boolean }> }>("/job-functions");
				setItems(response.data ?? []);
			} catch {
				setError("Functies konden niet worden geladen.");
			}
		}

		void loadData();
	}, [forbidden, loading]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		try {
			if (editingId) {
				const updated = await apiFetch<{ data: { id: number; code: string | null; title: string; description: string | null; is_active: boolean } }>(`/job-functions/${editingId}`, {
					method: "PATCH",
					body: JSON.stringify({ code: code || null, title, description: description || null, is_active: isActive }),
				});

				setItems((prev) => prev.map((item) => item.id === editingId ? updated.data : item));
			} else {
				const created = await apiFetch<{ data: { id: number; code: string | null; title: string; description: string | null; is_active: boolean } }>("/job-functions", {
					method: "POST",
					body: JSON.stringify({ code: code || null, title, description: description || null, is_active: isActive }),
				});

				setItems((prev) => [created.data, ...prev]);
			}

			setEditingId(null);
			setTitle("");
			setCode("");
			setDescription("");
			setIsActive(true);
		} catch {
			setError("Functie kon niet worden opgeslagen.");
		}
	}

	async function handleDelete(id: number) {
		await apiFetch<{ message: string }>(`/job-functions/${id}`, { method: "DELETE" });
		setItems((prev) => prev.filter((item) => item.id !== id));
	}

	function startEdit(item: { id: number; code: string | null; title: string; description: string | null; is_active: boolean }) {
		setEditingId(item.id);
		setTitle(item.title);
		setCode(item.code ?? "");
		setDescription(item.description ?? "");
		setIsActive(item.is_active);
	}

	const filteredItems = items.filter((item) => {
		const keyword = query.trim().toLowerCase();
		if (!keyword) {
			return true;
		}

		return `${item.title} ${item.code ?? ""} ${item.description ?? ""}`.toLowerCase().includes(keyword);
	});

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om functies te bekijken.</p></main>;
	}

	return (
		<ModuleFrame
			title="Functions"
			subtitle="Standaardiseer functieprofielen en status."
			filters={<div className="filter-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek functie of code" /></div>}
		>
			{error && <p className="error">{error}</p>}

			{canCreate && (
				<form onSubmit={handleSubmit} className="grid" style={{ maxWidth: "640px" }}>
					<div className="filter-row">
						<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titel" required />
						<input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code (optioneel)" />
					</div>
					<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Beschrijving (optioneel)" rows={3} />
					<label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						<input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
						Actief
					</label>
					<div className="list-row-actions">
						<button className="btn" type="submit">{editingId ? "Opslaan" : "Toevoegen"}</button>
					</div>
				</form>
			)}

			<div className="list-grid">
				{filteredItems.map((item) => (
					<div key={item.id} className="list-row">
						<div>
							<strong>{item.title}</strong> {item.code ? `(${item.code})` : ""}
							<div className="muted">{item.is_active ? "Actief" : "Inactief"}</div>
							{item.description && <div className="muted">{item.description}</div>}
						</div>
						<div className="list-row-actions">
							{canCreate && <button className="btn secondary" type="button" onClick={() => startEdit(item)}>Edit</button>}
							{canDelete && <button className="btn secondary" type="button" onClick={() => void handleDelete(item.id)}>Delete</button>}
						</div>
					</div>
				))}
			</div>
		</ModuleFrame>
	);
}
