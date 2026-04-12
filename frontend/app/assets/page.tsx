"use client";

import { FormEvent, useEffect, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function AssetsPage() {
  const { user, loading, forbidden } = useAuthGuard("assets.view");
  const [items, setItems] = useState<Array<{ id: number; asset_tag: string; name: string; status: string }>>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [assetTag, setAssetTag] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canCreate = hasPermission(user, "assets.assign");
  const canDelete = hasPermission(user, "assets.return");

  function getStatusLabel(status: string) {
    switch (status) {
      case "available":
        return "Beschikbaar";
      case "assigned":
        return "Toegewezen";
      case "under_maintenance":
        return "In onderhoud";
      case "retired":
        return "Uit gebruik";
      case "lost":
        return "Vermist";
      default:
        return status;
    }
  }

  useEffect(() => {
    if (loading || forbidden) {
      return;
    }

    async function loadData() {
      try {
        const response = await apiFetch<{ data: Array<{ id: number; asset_tag: string; name: string; status: string }> }>("/assets");
        setItems(response.data ?? []);
      } catch {
  		setError("Bedrijfsmiddelen konden niet worden geladen.");
      }
    }

    void loadData();
  }, [loading, forbidden]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (editingId) {
        const updated = await apiFetch<{ data: { id: number; asset_tag: string; name: string; status: string } }>(`/assets/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({ asset_tag: assetTag, name }),
        });
        setItems((prev) => prev.map((item) => item.id === editingId ? updated.data : item));
      } else {
        const created = await apiFetch<{ data: { id: number; asset_tag: string; name: string; status: string } }>("/assets", {
          method: "POST",
          body: JSON.stringify({ asset_tag: assetTag, name, status: "available" }),
        });
        setItems((prev) => [created.data, ...prev]);
      }
      setAssetTag("");
      setName("");
      setEditingId(null);
    } catch {
	  setError("Bedrijfsmiddel kon niet worden opgeslagen.");
    }
  }

  async function handleDelete(id: number) {
    await apiFetch<{ message: string }>(`/assets/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const filteredItems = items.filter((item) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return true;
    }

    return `${item.asset_tag} ${item.name} ${item.status}`.toLowerCase().includes(keyword);
  });

  if (loading) {
    return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
  }

  if (forbidden) {
	return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om bedrijfsmiddelen te bekijken.</p></main>;
  }

  return (
    <ModuleFrame
      title="Bedrijfsmiddelen"
      subtitle="Registratie en statusbeheer van bedrijfsmiddelen."
	  filters={<div className="filter-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek bedrijfsmiddel" /></div>}
    >
      {error && <p className="error">{error}</p>}

      {canCreate && (
        <form onSubmit={handleCreate} className="filter-row">
		  <input value={assetTag} onChange={(event) => setAssetTag(event.target.value)} placeholder="Assetnummer" required />
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Naam" required />
          <button className="btn" type="submit">{editingId ? "Opslaan" : "Toevoegen"}</button>
        </form>
      )}

      <div className="list-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="list-row">
            <div>
              <strong>{item.asset_tag}</strong> - {item.name}
			  <div className="muted">Status: {getStatusLabel(item.status)}</div>
            </div>
            <div className="list-row-actions">
			  {canCreate && <button className="btn secondary" type="button" onClick={() => { setEditingId(item.id); setAssetTag(item.asset_tag); setName(item.name); }}>Bewerken</button>}
			  {canDelete && <button className="btn secondary" type="button" onClick={() => void handleDelete(item.id)}>Verwijderen</button>}
            </div>
          </div>
        ))}
      </div>
    </ModuleFrame>
  );
}