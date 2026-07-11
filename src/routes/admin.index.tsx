import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { adminFetch } from "@/lib/admin-auth";
import type { DashboardStats } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin Dashboard — RATHGO" }, { name: "robots", content: "noindex" }] }),
});

function AdminDashboard() {
  const q = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminFetch<DashboardStats>("/api/admin/dashboard/stats"),
  });

  return (
    <AdminShell title="Dashboard">
      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Total Bookings" value={q.data.totalBookings} />
            <Stat label="Confirmed" value={q.data.confirmedBookings} />
            <Stat label="Revenue" value={`₹${q.data.totalRevenue.toLocaleString("en-IN")}`} />
            <Stat label="Active Trips" value={q.data.activeTrips} />
            <Stat label="Active Coupons" value={q.data.activeCoupons} />
          </div>

          <div className="mt-8 surface-card p-6">
            <h2 className="font-display text-xl font-black uppercase">Upcoming Batches</h2>
            {q.data.upcomingBatches.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No upcoming batches.</p>
            ) : (
              <table className="mt-4 w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <tr><th className="py-2">Trip</th><th>Start</th><th>Seats</th><th>Occupancy</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {q.data.upcomingBatches.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="py-3">{b.tripTitle}</td>
                      <td>{new Date(b.startDate).toLocaleDateString("en-IN")}</td>
                      <td>{b.seatsBooked}/{b.totalSeats}</td>
                      <td>{b.occupancyPercent}%</td>
                      <td className="capitalize">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-black">{value}</p>
    </div>
  );
}
