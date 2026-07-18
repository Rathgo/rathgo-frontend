import { useState } from "react";
import { Upload, Trash2, Star, Loader2, Plus } from "lucide-react";
import type { Trip, InclusionKind, SharingKind } from "@/lib/types";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import { Input, Label } from "./admin-trip-form";

export function TripSubEditors({
  trip, onRefresh, uploadImage, deleteImage,
}: {
  trip: Trip;
  onRefresh: () => void;
  uploadImage: (file: File) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
}) {
  return (
    <div className="mt-8 grid gap-6">
      <ImagesEditor trip={trip} onRefresh={onRefresh} uploadImage={uploadImage} deleteImage={deleteImage} />
      <FeaturedEditor trip={trip} onRefresh={onRefresh} />
      <ItineraryEditor trip={trip} onRefresh={onRefresh} />
      <InclusionsEditor trip={trip} onRefresh={onRefresh} />
      <SharingEditor trip={trip} onRefresh={onRefresh} />
      <BatchesEditor trip={trip} onRefresh={onRefresh} />
    </div>
  );
}

function Section({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-black uppercase">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
}

/* --- Featured --- */
function FeaturedEditor({ trip, onRefresh }: { trip: Trip; onRefresh: () => void }) {
  const [featured, setFeatured] = useState(trip.isFeatured);
  const [order, setOrder] = useState(trip.featuredOrder ?? 1);
  const [saving, setSaving] = useState(false);
  return (
    <Section title="Featured">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <Star className="h-4 w-4 text-brand" /> Show on landing page
        </label>
        <div className="flex items-center gap-2 text-sm">
          <Label>Order</Label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
            className="w-20 rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm" />
        </div>
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await adminFetch(`/api/admin/trips/${trip.id}/featured`, {
                method: "PUT",
                body: JSON.stringify({ isFeatured: featured, featuredOrder: featured ? order : null }),
              });
              onRefresh();
            } catch (e) { alert(e instanceof ApiError ? e.message : "Save failed"); }
            finally { setSaving(false); }
          }}
          className="btn-brand !py-2 disabled:opacity-60"
        >Save</button>
      </div>
    </Section>
  );
}

/* --- Images --- */
function ImagesEditor({ trip, onRefresh, uploadImage, deleteImage }: {
  trip: Trip; onRefresh: () => void;
  uploadImage: (f: File) => Promise<void>; deleteImage: (id: number) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Section title="Images">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {trip.images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-2">
            <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
            <button
              onClick={async () => {
                if (!confirm("Delete image?")) return;
                await deleteImage(img.id); onRefresh();
              }}
              className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100"
            ><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-border grid place-items-center cursor-pointer hover:border-brand">
          {busy ? <Loader2 className="h-6 w-6 animate-spin text-brand" /> : <Upload className="h-6 w-6 text-brand" />}
          <input type="file" accept="image/*" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setBusy(true);
            try { await uploadImage(f); onRefresh(); }
            catch (err) { alert(err instanceof ApiError ? err.message : "Upload failed"); }
            finally { setBusy(false); e.target.value = ""; }
          }} />
        </label>
      </div>
    </Section>
  );
}

/* --- Itinerary --- */
function ItineraryEditor({ trip, onRefresh }: { trip: Trip; onRefresh: () => void }) {
  type Day = { dayNumber: number; title: string; description: string };
  const [days, setDays] = useState<Day[]>(() => trip.itineraryDays.map((d) => ({ dayNumber: d.dayNumber, title: d.title, description: d.description })));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/trips/${trip.id}/itinerary`, { method: "PUT", body: JSON.stringify({ days }) });
      onRefresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <Section title="Itinerary" actions={
      <button onClick={() => setDays([...days, { dayNumber: days.length + 1, title: "", description: "" }])} className="btn-ghost-pill !py-1 !px-3 text-xs">
        <Plus className="h-3 w-3" /> Add Day
      </button>
    }>
      <div className="space-y-3">
        {days.map((d, i) => (
          <div key={i} className="rounded-xl border border-border p-3 grid gap-2 sm:grid-cols-[60px_1fr_auto]">
            <input type="number" value={d.dayNumber} onChange={(e) => setDays(days.map((x, ix) => ix === i ? { ...x, dayNumber: Number(e.target.value) } : x))}
              className="rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm" />
            <div className="grid gap-2">
              <Input value={d.title} onChange={(v) => setDays(days.map((x, ix) => ix === i ? { ...x, title: v } : x))} placeholder="Title" />
              <textarea rows={2} value={d.description} onChange={(e) => setDays(days.map((x, ix) => ix === i ? { ...x, description: e.target.value } : x))}
                placeholder="Description" className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm" />
            </div>
            <button onClick={() => setDays(days.filter((_, ix) => ix !== i))} className="text-destructive p-2"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="btn-brand mt-4 disabled:opacity-60">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Itinerary
      </button>
    </Section>
  );
}

/* --- Inclusions --- */
function InclusionsEditor({ trip, onRefresh }: { trip: Trip; onRefresh: () => void }) {
  type Item = { label: string; kind: InclusionKind; sortOrder: number };
  const [items, setItems] = useState<Item[]>(() => trip.inclusions.map((i) => ({ label: i.label, kind: i.kind, sortOrder: i.sortOrder })));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/trips/${trip.id}/inclusions`, { method: "PUT", body: JSON.stringify({ items }) });
      onRefresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };
  return (
    <Section title="Inclusions & Exclusions" actions={
      <button onClick={() => setItems([...items, { label: "", kind: "included", sortOrder: items.length }])} className="btn-ghost-pill !py-1 !px-3 text-xs">
        <Plus className="h-3 w-3" /> Add
      </button>
    }>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_auto] gap-2">
            <Input value={it.label} onChange={(v) => setItems(items.map((x, ix) => ix === i ? { ...x, label: v } : x))} placeholder="Item" />
            <select value={it.kind} onChange={(e) => setItems(items.map((x, ix) => ix === i ? { ...x, kind: e.target.value as InclusionKind } : x))}
              className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm">
              <option value="included">Included</option><option value="excluded">Excluded</option>
            </select>
            <button onClick={() => setItems(items.filter((_, ix) => ix !== i))} className="text-destructive p-2"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="btn-brand mt-4 disabled:opacity-60">Save</button>
    </Section>
  );
}

/* --- Sharing --- */
function SharingEditor({ trip, onRefresh }: { trip: Trip; onRefresh: () => void }) {
  type Item = { kind: SharingKind; price: string; description?: string };
  const [items, setItems] = useState<Item[]>(() =>
    trip.sharingTypes.length > 0
      ? trip.sharingTypes.map((s) => ({ kind: s.kind, price: s.price, description: s.description ?? "" }))
      : (["double", "triple", "quad"] as SharingKind[]).map((k) => ({ kind: k, price: "0", description: "" }))
  );
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const payload = items.map((item) => ({
      ...item,
      price: Number(item.price),
      description: item.description?.trim() || undefined,
    }));

    for (const item of payload) {
      if (!Number.isFinite(item.price) || item.price <= 0) {
        alert(`Price for ${item.kind} must be a number greater than 0.`);
        return;
      }
    }

    setSaving(true);
    try {
      await adminFetch(`/api/admin/trips/${trip.id}/sharing-types`, {
        method: "PUT",
        body: JSON.stringify({ items: payload }),
      });
      onRefresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };
  return (
    <Section title="Room Sharing Prices">
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[120px_120px_1fr] gap-2 items-center">
            <select value={it.kind} onChange={(e) => setItems(items.map((x, ix) => ix === i ? { ...x, kind: e.target.value as SharingKind } : x))}
              className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm">
              <option value="double">Double</option><option value="triple">Triple</option><option value="quad">Quad</option>
            </select>
            <Input value={it.price} onChange={(v) => setItems(items.map((x, ix) => ix === i ? { ...x, price: v } : x))} type="number" placeholder="Price" />
            <Input value={it.description ?? ""} onChange={(v) => setItems(items.map((x, ix) => ix === i ? { ...x, description: v } : x))} placeholder="Description" />
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="btn-brand mt-4 disabled:opacity-60">Save Sharing</button>
    </Section>
  );
}

/* --- Batches --- */
type BatchDraft = { id?: number; startDate: string; endDate: string; totalSeats: number; status: string };
function BatchesEditor({ trip, onRefresh }: { trip: Trip; onRefresh: () => void }) {
  const [items, setItems] = useState<BatchDraft[]>(() =>
    trip.batches.map((b) => ({ id: b.id, startDate: b.startDate, endDate: b.endDate, totalSeats: b.totalSeats, status: b.status }))
  );
  const [busy, setBusy] = useState(false);

  const create = async (draft: BatchDraft) => {
    setBusy(true);
    try {
      await adminFetch(`/api/admin/trips/${trip.id}/batches`, { method: "POST", body: JSON.stringify(draft) });
      onRefresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Create failed"); }
    finally { setBusy(false); }
  };
  const update = async (b: BatchDraft) => {
    if (!b.id) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/batches/${b.id}`, { method: "PUT", body: JSON.stringify(b) });
      onRefresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Update failed"); }
    finally { setBusy(false); }
  };
  const del = async (b: BatchDraft) => {
    if (!b.id) { setItems(items.filter((x) => x !== b)); return; }
    if (!confirm("Delete batch?")) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/batches/${b.id}`, { method: "DELETE" });
      onRefresh();
    } catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed"); }
    finally { setBusy(false); }
  };

  return (
    <Section title="Batches" actions={
      <button onClick={() => setItems([...items, { startDate: "", endDate: "", totalSeats: 20, status: "available" }])} className="btn-ghost-pill !py-1 !px-3 text-xs">
        <Plus className="h-3 w-3" /> Add Batch
      </button>
    }>
      <div className="space-y-2">
        {items.map((b, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_100px_120px_auto_auto] gap-2 items-center">
            <input type="date" value={b.startDate?.slice(0, 10) ?? ""} onChange={(e) => setItems(items.map((x, ix) => ix === i ? { ...x, startDate: e.target.value } : x))}
              className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm" />
            <input type="date" value={b.endDate?.slice(0, 10) ?? ""} onChange={(e) => setItems(items.map((x, ix) => ix === i ? { ...x, endDate: e.target.value } : x))}
              className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm" />
            <input type="number" value={b.totalSeats} onChange={(e) => setItems(items.map((x, ix) => ix === i ? { ...x, totalSeats: Number(e.target.value) } : x))}
              className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm" />
            <select value={b.status} onChange={(e) => setItems(items.map((x, ix) => ix === i ? { ...x, status: e.target.value } : x))}
              className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm">
              <option value="available">Available</option><option value="limited">Limited</option>
              <option value="soldout">Sold Out</option><option value="inactive">Inactive</option>
            </select>
            <button disabled={busy} onClick={() => b.id ? update(b) : create(b)} className="btn-brand !py-2 !px-3 text-xs disabled:opacity-60">
              {b.id ? "Update" : "Create"}
            </button>
            <button onClick={() => del(b)} className="text-destructive p-2"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No batches yet.</p>}
      </div>
    </Section>
  );
}
