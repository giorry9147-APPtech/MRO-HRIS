"use client";

import { FormEvent, useEffect, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function PositionsPage() {
	const { user, loading, forbidden } = useAuthGuard("positions.view");
	const [items, setItems] = useState<Array<{ id: number; title: string; code: string | null; grade: string | null; status: string; job_function_id: number | null; job_function_title: string | null }>>([]);
	const [jobFunctions, setJobFunctions] = useState<Array<{ id: number; title: string }>>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [grade, setGrade] = useState("");
	const [jobFunctionId, setJobFunctionId] = useState("");
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);

	const canCreate = hasPermission(user, "positions.create");
	const canDelete = hasPermission(user, "positions.delete");

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadData() {
			try {
				const [positionsResponse, functionsResponse] = await Promise.all([
					apiFetch<{ data: Array<{ id: number; title: string; code: string | null; grade: string | null; status: string; job_function_id: number | null; job_function_title: string | null }> }>("/positions"),
					apiFetch<{ data: Array<{ id: number; title: string }> }>("/job-functions"),
				]);
				setItems(positionsResponse.data ?? []);
				setJobFunctions(functionsResponse.data ?? []);
			} catch {
				setError("Posities konden niet worden geladen.");
			}
		}

		void loadData();
	}, [loading, forbidden]);

	async function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		try {
			if (editingId) {
				const updated = await apiFetch<{ data: { id: number; title: string; code: string | null; grade: string | null; status: string; job_function_id: number | null; job_function_title: string | null } }>(`/positions/${editingId}`, {
					method: "PATCH",
					body: JSON.stringify({ title, code: code || null, grade: grade || null, job_function_id: jobFunctionId ? Number(jobFunctionId) : null }),
				});
				setItems((prev) => prev.map((item) => item.id === editingId ? updated.data : item));
			} else {
				const created = await apiFetch<{ data: { id: number; title: string; code: string | null; grade: string | null; status: string; job_function_id: number | null; job_function_title: string | null } }>("/positions", {
					method: "POST",
					body: JSON.stringify({ title, code: code || null, grade: grade || null, job_function_id: jobFunctionId ? Number(jobFunctionId) : null, status: "vacant" }),
				});
				setItems((prev) => [created.data, ...prev]);
			}
			setTitle("");
			setCode("");
			setGrade("");
			setJobFunctionId("");
			setEditingId(null);
		} catch {
			setError("Positie kon niet worden aangemaakt.");
		}
	}

	async function handleDelete(id: number) {
		await apiFetch<{ message: string }>(`/positions/${id}`, { method: "DELETE" });
		setItems((prev) => prev.filter((item) => item.id !== id));
	}

	const filteredItems = items.filter((item) => {
		const keyword = query.trim().toLowerCase();
		if (!keyword) {
			return true;
		}

		return `${item.title} ${item.code ?? ""} ${item.status} ${item.job_function_title ?? ""}`.toLowerCase().includes(keyword);
	});

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om posities te bekijken.</p></main>;
	}

	return (
		<ModuleFrame
			title="Positions"
			subtitle="Beheer formatieplaatsen en functiekoppelingen."
			filters={<div className="filter-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek positie" /></div>}
		>
			{error && <p className="error">{error}</p>}

			{canCreate && (
				<form onSubmit={handleCreate} className="filter-row">
					<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titel" required />
					<input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code (optioneel)" />
					<input value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="Grade (optioneel)" />
					<select value={jobFunctionId} onChange={(event) => setJobFunctionId(event.target.value)}>
						<option value="">Selecteer functie</option>
						{jobFunctions.map((jobFunction) => <option key={jobFunction.id} value={jobFunction.id}>{jobFunction.title}</option>)}
					</select>
					<button className="btn" type="submit">{editingId ? "Opslaan" : "Toevoegen"}</button>
				</form>
			)}

			<div className="list-grid">
				{filteredItems.map((item) => (
					<div key={item.id} className="list-row">
						<div>
							<strong>{item.title}</strong> ({item.code ?? "-"})
							<div className="muted">{item.status}{item.job_function_title ? ` | ${item.job_function_title}` : ""}</div>
						</div>
						<div className="list-row-actions">
							{canCreate && <button className="btn secondary" type="button" onClick={() => { setEditingId(item.id); setTitle(item.title); setCode(item.code ?? ""); setGrade(item.grade ?? ""); setJobFunctionId(item.job_function_id ? String(item.job_function_id) : ""); }}>Edit</button>}
							{canDelete && <button className="btn secondary" type="button" onClick={() => void handleDelete(item.id)}>Delete</button>}
						</div>
					</div>
				))}
			</div>
		</ModuleFrame>
	);
}
