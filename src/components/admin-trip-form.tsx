import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Trip, TravelType } from "@/lib/types";

export type TripFormValues = {
  title: string;
  slug: string;
  city: string;
  state: string;
  days: number;
  nights: number;
  startingPrice: string;
  shortDescription: string;
  longDescription?: string;
  rating?: string;
  travelType: TravelType;
  isActive: boolean;
};

const empty: TripFormValues = {
  title: "", slug: "", city: "", state: "",
  days: 5, nights: 4, startingPrice: "0",
  shortDescription: "", longDescription: "",
  rating: "4.5", travelType: "both", isActive: true,
};

export function TripForm({
  initial, saving, error, onSubmit,
}: {
  initial: Trip | null;
  saving: boolean;
  error: string | null;
  onSubmit: (v: TripFormValues) => void;
}) {
  const [v, setV] = useState<TripFormValues>(empty);

  useEffect(() => {
    if (initial) {
      setV({
        title: initial.title, slug: initial.slug, city: initial.city, state: initial.state,
        days: initial.days, nights: initial.nights, startingPrice: String(initial.startingPrice),
        shortDescription: initial.shortDescription, longDescription: initial.longDescription ?? "",
        rating: String(initial.rating), travelType: initial.travelType, isActive: initial.isActive,
      });
    }
  }, [initial]);

  const set = <K extends keyof TripFormValues>(k: K, val: TripFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(v); }}
      className="surface-card p-6 md:p-8 space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Title" value={v.title} onChange={(x) => set("title", x)} required />
        <Input label="Slug" value={v.slug} onChange={(x) => set("slug", x)} required />
        <Input label="City" value={v.city} onChange={(x) => set("city", x)} required />
        <Input label="State" value={v.state} onChange={(x) => set("state", x)} required />
        <Input label="Days" type="number" value={String(v.days)} onChange={(x) => set("days", Number(x))} required />
        <Input label="Nights" type="number" value={String(v.nights)} onChange={(x) => set("nights", Number(x))} required />
        <Input label="Starting Price (₹)" type="number" value={v.startingPrice} onChange={(x) => set("startingPrice", x)} required />
        <Input label="Rating" type="number" value={v.rating ?? ""} onChange={(x) => set("rating", x)} />

        <div>
          <Label>Travel Type</Label>
          <select value={v.travelType} onChange={(e) => set("travelType", e.target.value as TravelType)}
            className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm">
            <option value="solo">Solo</option><option value="group">Group</option><option value="both">Both</option>
          </select>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <input type="checkbox" checked={v.isActive} onChange={(e) => set("isActive", e.target.checked)} id="active" />
          <label htmlFor="active" className="text-sm">Active</label>
        </div>
      </div>

      <div>
        <Label>Short Description</Label>
        <textarea rows={2} value={v.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required
          className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm" />
      </div>
      <div>
        <Label>Long Description</Label>
        <textarea rows={5} value={v.longDescription} onChange={(e) => set("longDescription", e.target.value)}
          className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={saving} className="btn-brand disabled:opacity-60">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Trip"}
      </button>
    </form>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</label>;
}

export function Input({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label?: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
        className={"w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand " + (label ? "mt-2" : "")}
      />
    </div>
  );
}
