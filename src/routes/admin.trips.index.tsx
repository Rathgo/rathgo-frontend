import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import type { Trip } from "@/lib/types";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export const Route = createFileRoute("/admin/trips/")({
  component: TripsList,
  head: () => ({ meta: [{ title: "Admin — Trips" }, { name: "robots", content: "noindex" }] }),
});

function TripsList() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "trips"],
    queryFn: () => adminFetch<Trip[]>("/api/admin/trips"),
  });

  const del = useMutation({
    mutationFn: (id: number) => adminFetch(`/api/admin/trips/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "trips"] }),
    onError: (e) => alert(e instanceof ApiError ? e.message : "Delete failed"),
  });

  return (
    <AdminShell title="Trips">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">Manage all trip listings.</p>
        <Link to="/admin/trips/new" className="btn-brand"><Plus className="h-4 w-4" /> New Trip</Link>
      </div>

      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-4">Trip</th><th>State</th><th>Days</th><th>Price</th>
                <th>Featured</th><th>Active</th><th></th>
              </tr>
            </thead>
            <tbody>
              {q.data.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="p-4">
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.slug}</p>
                  </td>
                  <td>{t.state}</td>
                  <td>{t.days}D/{t.nights}N</td>
                  <td>₹{Number(t.startingPrice).toLocaleString("en-IN")}</td>
                  <td>{t.isFeatured && <Star className="h-4 w-4 text-brand fill-current" />}</td>
                  <td>
                    <span className={"chip !text-[10px] " + (t.isActive ? "!bg-emerald-500/20 !text-emerald-500 !border-emerald-500/40" : "!bg-muted/20")}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right pr-4">
                    <Link to="/admin/trips/$id" params={{ id: String(t.id) }} className="inline-flex p-2 hover:text-brand"><Pencil className="h-4 w-4" /></Link>
                    <button
                      onClick={() => { if (confirm(`Delete ${t.title}?`)) del.mutate(t.id); }}
                      className="inline-flex p-2 hover:text-destructive"
                    ><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {q.data.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No trips yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
