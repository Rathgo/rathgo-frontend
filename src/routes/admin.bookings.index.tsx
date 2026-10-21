import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import { exportBookingsExcel, type BookingExportRow } from "@/lib/bookings-export";
import type { Booking, BookingStatus, PaymentStatus, Trip } from "@/lib/types";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const search = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  tripId: z.coerce.number().optional(),
  batchId: z.coerce.number().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const Route = createFileRoute("/admin/bookings/")({
  component: BookingsAdmin,
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Bookings — Admin" }, { name: "robots", content: "noindex" }] }),
});

type BookingListRow = BookingExportRow;

function BookingsAdmin() {
  const s = Route.useSearch();
  const navigate = Route.useNavigate();
  const [searchText, setSearchText] = useState(s.search ?? "");
  const [exporting, setExporting] = useState(false);

  const qs = new URLSearchParams();
  if (s.status) qs.set("status", s.status);
  if (s.search) qs.set("search", s.search);
  if (s.tripId) qs.set("tripId", String(s.tripId));
  if (s.batchId) qs.set("batchId", String(s.batchId));
  qs.set("page", String(s.page));
  qs.set("limit", String(s.limit));

  const q = useQuery({
    queryKey: ["admin", "bookings", s],
    queryFn: () => adminFetch<BookingListRow[]>(`/api/admin/bookings?${qs.toString()}`),
  });

  const tripsQ = useQuery({
    queryKey: ["admin", "trips"],
    queryFn: () => adminFetch<Trip[]>("/api/admin/trips"),
  });

  const selectedTrip = tripsQ.data?.find((t) => t.id === s.tripId);
  const batches = selectedTrip?.batches ?? [];

  const applyFilter = (patch: Partial<typeof s>) =>
    navigate({ search: { ...s, ...patch, page: 1 } });

  const exportExcel = async () => {
    setExporting(true);
    try {
      const all = new URLSearchParams();
      if (s.status) all.set("status", s.status);
      if (s.search) all.set("search", s.search);
      if (s.tripId) all.set("tripId", String(s.tripId));
      if (s.batchId) all.set("batchId", String(s.batchId));
      all.set("page", "1");
      all.set("limit", "1000");
      const rows = await adminFetch<BookingListRow[]>(`/api/admin/bookings?${all.toString()}`);
      if (rows.length === 0) {
        toast.error("No bookings match the current filters — nothing to export.");
        return;
      }
      await exportBookingsExcel(rows, new Date().toISOString().slice(0, 10));
      toast.success(`Exported ${rows.length} booking${rows.length > 1 ? "s" : ""} to Excel.`);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminShell title="Bookings">
      <div className="surface-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search by ref no / name / phone"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilter({ search: searchText.trim() || undefined });
          }}
          className="flex-1 min-w-40 rounded-xl bg-surface-2 border border-border px-4 py-2.5 text-sm"
        />
        <select
          value={s.tripId ?? ""}
          onChange={(e) => applyFilter({ tripId: e.target.value ? Number(e.target.value) : undefined, batchId: undefined })}
          className="rounded-xl bg-surface-2 border border-border px-3 py-2.5 text-sm max-w-48"
        >
          <option value="">All Trips</option>
          {(tripsQ.data ?? []).map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <select
          value={s.batchId ?? ""}
          onChange={(e) => applyFilter({ batchId: e.target.value ? Number(e.target.value) : undefined })}
          disabled={!s.tripId}
          className="rounded-xl bg-surface-2 border border-border px-3 py-2.5 text-sm max-w-52 disabled:opacity-50"
        >
          <option value="">{s.tripId ? "All Batches" : "All Batches (pick a trip)"}</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {new Date(b.startDate).toLocaleDateString("en-IN")} — {new Date(b.endDate).toLocaleDateString("en-IN")}
            </option>
          ))}
        </select>
        <select
          value={s.status ?? ""}
          onChange={(e) => applyFilter({ status: e.target.value || undefined })}
          className="rounded-xl bg-surface-2 border border-border px-3 py-2.5 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option><option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option><option value="expired">Expired</option>
        </select>
        <button
          onClick={exportExcel}
          disabled={exporting}
          className="btn-brand !py-2.5 disabled:opacity-60"
        >
          {exporting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</>
            : <><Download className="h-4 w-4" /> Download Excel</>}
        </button>
      </div>

      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="p-4">Primary Traveller</th><th>Trip</th><th>Travellers</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {q.data.map((b) => {
                const primary = b.members?.find((m) => m.isPrimary) ?? b.members?.[0];
                const name = b.primaryName || primary?.fullName || "—";
                const phone = b.primaryPhone || primary?.phone || "";
                return (
                  <tr key={b.id} className="border-t border-border">
                    <td className="p-4">
                      <p className="font-semibold">{name}</p>
                      {phone && <p className="text-xs text-muted-foreground">{phone}</p>}
                    </td>
                    <td>{b.trip.title}</td>
                    <td>{b.groupSize}</td>
                    <td>₹{Number(b.totalAmount).toLocaleString("en-IN")}</td>
                    <td><StatusChip s={b.paymentStatus} /></td>
                    <td><StatusChip s={b.bookingStatus} /></td>
                    <td className="text-right pr-4">
                      <Link to="/admin/bookings/$id" params={{ id: String(b.id) }} className="text-brand text-xs">View</Link>
                    </td>
                  </tr>
                );
              })}
              {q.data.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-2">
        <button disabled={s.page <= 1} onClick={() => navigate({ search: { ...s, page: s.page - 1 } })} className="btn-ghost-pill disabled:opacity-40">Prev</button>
        <span className="grid place-items-center text-sm">Page {s.page}</span>
        <button disabled={(q.data?.length ?? 0) < s.limit} onClick={() => navigate({ search: { ...s, page: s.page + 1 } })} className="btn-ghost-pill disabled:opacity-40">Next</button>
      </div>
    </AdminShell>
  );
}

function StatusChip({ s }: { s: BookingStatus | PaymentStatus }) {
  const color = s === "confirmed" || s === "paid" ? "!bg-emerald-500/20 !text-emerald-500 !border-emerald-500/40"
    : s === "cancelled" || s === "failed" ? "!bg-destructive/20 !text-destructive !border-destructive/40"
    : "!bg-muted/20";
  return <span className={"chip !text-[10px] capitalize " + color}>{s}</span>;
}
