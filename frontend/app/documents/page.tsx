"use client";

import { FormEvent, useEffect, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function DocumentsPage() {
	const { user, loading, forbidden } = useAuthGuard("documents.view");
	const [items, setItems] = useState<Array<{ id: number; title: string; document_type: string; original_name: string; uploaded_at: string | null }>>([]);
	const [title, setTitle] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);

	const canUpload = hasPermission(user, "documents.upload");

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadData() {
			try {
				const response = await apiFetch<{ data: Array<{ id: number; title: string; document_type: string; original_name: string; uploaded_at: string | null }> }>("/documents");
				setItems(response.data ?? []);
			} catch {
				setError("Documenten konden niet worden geladen.");
			}
		}

		void loadData();
	}, [loading, forbidden]);

	async function handleUpload(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (!file) {
			setError("Selecteer een bestand.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("document_type", documentType);
		formData.append("file", file);

		try {
			const created = await apiFetch<{ data: { id: number; title: string; document_type: string; original_name: string; uploaded_at: string | null } }>("/documents", {
				method: "POST",
				body: formData,
			});
			setItems((prev) => [created.data, ...prev]);
			setTitle("");
			setDocumentType("");
			setFile(null);
		} catch {
			setError("Document kon niet worden geüpload.");
		}
	}

	const filteredItems = items.filter((item) => {
		const keyword = query.trim().toLowerCase();
		if (!keyword) {
			return true;
		}

		return `${item.title} ${item.document_type} ${item.original_name}`.toLowerCase().includes(keyword);
	});

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om documenten te bekijken.</p></main>;
	}

	return (
		<ModuleFrame
			title="Documenten"
			icon="📄"
			kicker="Dossierbeheer"
			subtitle="Dossierbeheer met upload en zoekfunctie."
			filters={<div className="filter-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek document" /></div>}
		>
			{error && <p className="error">{error}</p>}

			{canUpload && (
				<form onSubmit={handleUpload} className="grid" style={{ maxWidth: "460px" }}>
					<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titel" required />
					<input value={documentType} onChange={(event) => setDocumentType(event.target.value)} placeholder="Documenttype" required />
					<input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
					<button className="btn" type="submit">Uploaden</button>
				</form>
			)}

			<div className="list-grid">
				{filteredItems.map((item) => (
					<div key={item.id} className="list-row">
						<div>
							<strong>{item.title}</strong>
							<div className="muted">{item.document_type} | {item.original_name}</div>
						</div>
					</div>
				))}
			</div>
		</ModuleFrame>
	);
}
