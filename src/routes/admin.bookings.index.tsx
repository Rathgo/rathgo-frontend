import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { adminFetch } from "@/lib/admin-auth";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";

const search = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const Route = createFileRoute("/admin/bookings/")({
  component: BookingsAdmin,
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Bookings — Admin" }, { name: "robots", content: "noindex" }] }),
});

type BookingListRow = Booking & { primaryName?: string; primaryPhone?: string };

function BookingsAdmin() {
  const s = Route.useSearch();
  const navigate = Route.useNavigate();

  const qs = new URLSearchParams();
  if (s.status) qs.set("status", s.status);
  if (s.search) qs.set("search", s.search);
  qs.set("page", String(s.page));
  qs.set("limit", String(s.limit));

  const q = useQuery({
    queryKey: ["admin", "bookings", s],
    queryFn: () => adminFetch<BookingListRow[]>(`/api/admin/bookings?${qs.toString()}`),
  });

  return (
    <AdminShell title="Bookings">
      <div className="surface-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search ref / name / phone"
          defaultValue={s.search ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate({ search: { ...s, search: (e.target as HTMLInputElement).value, page: 1 } });
          }}
          className="flex-1 min-w-40 rounded-xl bg-surface-2 border border-border px-4 py-2.5 text-sm"
        />
        <select value={s.status ?? ""} onChange={(e) => navigate({ search: { ...s, status: e.target.value || undefined, page: 1 } })}
          className="rounded-xl bg-surface-2 border border-border px-3 py-2.5 text-sm">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option><option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option><option value="expired">Expired</option>
        </select>
      </div>

      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="p-4">Ref</th><th>Trip</th><th>Travellers</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {q.data.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-4 font-mono text-xs">{b.bookingRef}</td>
                  <td>{b.trip.title}</td>
                  <td>{b.groupSize}</td>
                  <td>₹{Number(b.totalAmount).toLocaleString("en-IN")}</td>
                  <td><StatusChip s={b.paymentStatus} /></td>
                  <td><StatusChip s={b.bookingStatus} /></td>
                  <td className="text-right pr-4">
                    <Link to="/admin/bookings/$id" params={{ id: String(b.id) }} className="text-brand text-xs">View</Link>
                  </td>
                </tr>
              ))}
              {q.data.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings.</td></tr>}
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
