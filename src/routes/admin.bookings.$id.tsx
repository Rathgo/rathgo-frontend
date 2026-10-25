import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { FileText, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/bookings/$id")({
  component: BookingDetail,
  head: () => ({ meta: [{ title: "Booking — Admin" }, { name: "robots", content: "noindex" }] }),
});

function BookingDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "booking", id], queryFn: () => adminFetch<Booking>(`/api/admin/bookings/${id}`) });

  const setStatus = async (status: "confirmed" | "cancelled") => {
    if (!confirm(`Mark as ${status}?`)) return;
    try {
      await adminFetch(`/api/admin/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
      qc.invalidateQueries({ queryKey: ["admin", "booking", id] });
    } catch (e) { alert(e instanceof ApiError ? e.message : "Failed"); }
  };

  const openSigned = async (path: string) => {
    try {
      const { url } = await adminFetch<{ url: string }>(path);
      window.open(url, "_blank", "noopener");
    } catch (e) { alert(e instanceof ApiError ? e.message : "Not available"); }
  };

  return (
    <AdminShell title={q.data ? `Booking ${q.data.bookingRef}` : "Booking"}>
      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="font-display text-lg font-black uppercase">Trip</h2>
              <p className="mt-2">{q.data.trip.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Batch: {new Date(q.data.batch.startDate).toLocaleDateString()} — {new Date(q.data.batch.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Sharing: {q.data.sharingType.kind}</p>
            </div>

            <div className="surface-card p-6">
              <h2 className="font-display text-lg font-black uppercase mb-4">Travellers ({q.data.members.length})</h2>
              <div className="space-y-3">
                {q.data.members.map((m, i) => (
                  <div key={m.id ?? i} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{m.fullName}{m.isPrimary && <span className="ml-2 text-xs text-brand">PRIMARY</span>}</p>
                        <p className="text-xs text-muted-foreground">{m.email} · {m.phone} · Age {m.age} · {m.gender}</p>
                      </div>
                      <div className="flex gap-2">
                        {m.aadharFrontKey && m.id && (
                          <button onClick={() => openSigned(`/api/admin/bookings/${id}/members/${m.id}/aadhar-url?side=front`)}
                            className="btn-ghost-pill !py-1 !px-3 text-xs"><ExternalLink className="h-3 w-3" /> Front</button>
                        )}
                        {m.aadharBackKey && m.id && (
                          <button onClick={() => openSigned(`/api/admin/bookings/${id}/members/${m.id}/aadhar-url?side=back`)}
                            className="btn-ghost-pill !py-1 !px-3 text-xs"><ExternalLink className="h-3 w-3" /> Back</button>
                        )}
                      </div>
                    </div>
                    {m.address && <p className="mt-2 text-xs text-muted-foreground">{m.address}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-semibold">Medical condition:</span>{" "}
                      {m.medicalCondition?.trim() || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="font-display text-lg font-black uppercase">Payment</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Base</dt><dd>₹{Number(q.data.baseAmount).toLocaleString("en-IN")}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>-₹{Number(q.data.discountAmount).toLocaleString("en-IN")}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">GST</dt><dd>₹{Number(q.data.gstAmount).toLocaleString("en-IN")}</dd></div>
                <div className="flex justify-between font-bold border-t border-border pt-2"><dt>Total</dt><dd>₹{Number(q.data.totalAmount).toLocaleString("en-IN")}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Payment</dt><dd className="capitalize">{q.data.paymentStatus}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="capitalize">{q.data.bookingStatus}</dd></div>
              </dl>
              <button
                disabled={q.data.paymentStatus !== "paid"}
                onClick={() => openSigned(`/api/admin/bookings/${id}/invoice-url`)}
                className="btn-brand mt-5 w-full disabled:opacity-40"
              ><FileText className="h-4 w-4" /> Invoice PDF</button>
            </div>

            <div className="surface-card p-6">
              <h2 className="font-display text-lg font-black uppercase">Actions</h2>
              <div className="mt-4 grid gap-2">
                <button onClick={() => setStatus("confirmed")} className="btn-brand" disabled={q.data.bookingStatus === "confirmed"}>Mark Confirmed</button>
                <button onClick={() => setStatus("cancelled")} className="btn-ghost-pill" disabled={q.data.bookingStatus === "cancelled"}>Cancel Booking</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </AdminShell>
  );
}
