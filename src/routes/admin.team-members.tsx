import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { Input } from "@/components/admin-trip-form";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { Plus, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/team-members")({
  component: TeamAdmin,
  head: () => ({ meta: [{ title: "Team — Admin" }, { name: "robots", content: "noindex" }] }),
});

type Draft = { id?: number; name: string; isActive: boolean; sortOrder: number };

function TeamAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "team"], queryFn: () => adminFetch<TeamMember[]>("/api/admin/team-members") });
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "team"] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body = { name: editing.name, isActive: editing.isActive, sortOrder: editing.sortOrder };
      if (editing.id) await adminFetch(`/api/admin/team-members/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      else await adminFetch("/api/admin/team-members", { method: "POST", body: JSON.stringify(body) });
      setEditing(null); refresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (m: TeamMember) => {
    if (!confirm(`Delete ${m.name}?`)) return;
    await adminFetch(`/api/admin/team-members/${m.id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <AdminShell title="Team Members">
      <div className="flex justify-between mb-6">
        <p className="text-sm text-muted-foreground">Shown in "Referred By" dropdown at booking.</p>
        <button onClick={() => setEditing({ name: "", isActive: true, sortOrder: 0 })} className="btn-brand">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="surface-card">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="p-4">Name</th><th>Active</th><th>Order</th><th></th></tr>
            </thead>
            <tbody>
              {q.data.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="p-4">{m.name}</td>
                  <td>{m.isActive ? "Yes" : "No"}</td>
                  <td>{m.sortOrder}</td>
                  <td className="text-right pr-4">
                    <button onClick={() => setEditing({ ...m })} className="text-brand text-xs mr-3">Edit</button>
                    <button onClick={() => del(m)} className="text-destructive"><Trash2 className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {q.data.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No team members.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="surface-card p-6 md:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-black uppercase">{editing.id ? "Edit" : "New"} Team Member</h3>
            <div className="mt-4 grid gap-3">
              <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
              <Input label="Sort Order" type="number" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="btn-ghost-pill">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-brand disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
