import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { TripForm } from "@/components/admin-trip-form";
import { adminFetch } from "@/lib/admin-auth";
import type { Trip } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/trips/new")({
  component: NewTrip,
  head: () => ({ meta: [{ title: "New Trip — Admin" }, { name: "robots", content: "noindex" }] }),
});

function NewTrip() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <AdminShell title="New Trip">
      <TripForm
        initial={null}
        saving={saving}
        error={error}
        onSubmit={async (values) => {
          setSaving(true); setError(null);
          try {
            const payload = {
              ...values,
              days: Number(values.days),
              nights: Number(values.nights),
              startingPrice: Number(values.startingPrice),
              rating: values.rating ? Number(values.rating) : undefined,
              isActive: Boolean(values.isActive),
            };

            const trip = await adminFetch<Trip>("/api/admin/trips", {
              method: "POST",
              body: JSON.stringify(payload),
            });
            toast.success("Trip created");
            navigate({ to: "/admin/trips/$id", params: { id: String(trip.id) } });
          } catch (e) {
            setError(e instanceof ApiError ? e.message : "Save failed");
          } finally { setSaving(false); }
        }}
      />
    </AdminShell>
  );
}
