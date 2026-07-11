import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { Input, Label } from "@/components/admin-trip-form";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import type { Coupon, DiscountKind } from "@/lib/types";
import { Plus, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({
  component: CouponsAdmin,
  head: () => ({ meta: [{ title: "Coupons — Admin" }, { name: "robots", content: "noindex" }] }),
});

type Draft = {
  id?: number;
  code: string;
  discountKind: DiscountKind;
  discountValue: string;
  maxDiscount?: string;
  minAmount?: string;
  usageLimit?: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
};

function fromCoupon(c: Coupon): Draft {
  return {
    id: c.id,
    code: c.code,
    discountKind: c.discountKind,
    discountValue: c.discountValue,
    maxDiscount: c.maxDiscount ?? "",
    minAmount: c.minAmount ?? "",
    usageLimit: c.usageLimit ?? undefined,
    validFrom: c.validFrom ?? "",
    validTo: c.validTo ?? "",
    isActive: c.isActive,
  };
}

function CouponsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "coupons"], queryFn: () => adminFetch<Coupon[]>("/api/admin/coupons") });
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body = { ...editing };
      if (editing.id) {
        await adminFetch(`/api/admin/coupons/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await adminFetch("/api/admin/coupons", { method: "POST", body: JSON.stringify(body) });
      }
      setEditing(null); refresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (c: Coupon) => {
    if (!confirm(`Delete ${c.code}?`)) return;
    try {
      await adminFetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
      refresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed — try deactivating instead"); }
  };

  return (
    <AdminShell title="Coupons">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">Manage discount codes.</p>
        <button onClick={() => setEditing({ code: "", discountKind: "flat", discountValue: "0", isActive: true })} className="btn-brand">
          <Plus className="h-4 w-4" /> New Coupon
        </button>
      </div>

      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="p-4">Code</th><th>Discount</th><th>Min</th><th>Used</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              {q.data.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-4 font-mono">{c.code}</td>
                  <td>{c.discountKind === "flat" ? `₹${c.discountValue}` : `${c.discountValue}%`}</td>
                  <td>{c.minAmount ? `₹${c.minAmount}` : "—"}</td>
                  <td>{c.usageCount ?? 0}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                  <td>{c.isActive ? "Yes" : "No"}</td>
                  <td className="text-right pr-4">
                    <button onClick={() => setEditing(fromCoupon(c))} className="text-brand text-xs mr-3">Edit</button>
                    <button onClick={() => del(c)} className="text-destructive"><Trash2 className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {q.data.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No coupons.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="surface-card p-6 md:p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-black uppercase">{editing.id ? "Edit Coupon" : "New Coupon"}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Code" value={editing.code} onChange={(v) => setEditing({ ...editing, code: v.toUpperCase() })} required />
              <div>
                <Label>Kind</Label>
                <select value={editing.discountKind} onChange={(e) => setEditing({ ...editing, discountKind: e.target.value as DiscountKind })}
                  className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm">
                  <option value="flat">Flat ₹</option><option value="percent">Percent %</option>
                </select>
              </div>
              <Input label="Value" type="number" value={editing.discountValue} onChange={(v) => setEditing({ ...editing, discountValue: v })} />
              <Input label="Max Discount" type="number" value={editing.maxDiscount ?? ""} onChange={(v) => setEditing({ ...editing, maxDiscount: v })} />
              <Input label="Min Amount" type="number" value={editing.minAmount ?? ""} onChange={(v) => setEditing({ ...editing, minAmount: v })} />
              <Input label="Usage Limit" type="number" value={editing.usageLimit ? String(editing.usageLimit) : ""} onChange={(v) => setEditing({ ...editing, usageLimit: v ? Number(v) : undefined })} />
              <Input label="Valid From" type="date" value={editing.validFrom?.slice(0, 10) ?? ""} onChange={(v) => setEditing({ ...editing, validFrom: v })} />
              <Input label="Valid To" type="date" value={editing.validTo?.slice(0, 10) ?? ""} onChange={(v) => setEditing({ ...editing, validTo: v })} />
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Active
            </label>
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
