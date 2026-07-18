import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { TripForm } from "@/components/admin-trip-form";
import { TripSubEditors } from "@/components/admin-trip-sub-editors";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError, putSignedUpload } from "@/lib/api";
import type { Trip } from "@/lib/types";

export const Route = createFileRoute("/admin/trips/$id")({
  component: EditTrip,
  head: () => ({ meta: [{ title: "Edit Trip — Admin" }, { name: "robots", content: "noindex" }] }),
});

function EditTrip() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "trip", id],
    queryFn: () => adminFetch<Trip>(`/api/admin/trips/${id}`),
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <AdminShell title={q.data ? `Edit: ${q.data.title}` : "Edit Trip"}>
      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <>
          <TripForm
            initial={q.data}
            saving={saving}
            error={error}
            onSubmit={async (values) => {
              setSaving(true); setError(null);
              try {
                await adminFetch(`/api/admin/trips/${id}`, {
                  method: "PUT",
                  body: JSON.stringify(values),
                });
                qc.invalidateQueries({ queryKey: ["admin", "trip", id] });
                qc.invalidateQueries({ queryKey: ["admin", "trips"] });
              } catch (e) {
                setError(e instanceof ApiError ? e.message : "Save failed");
              } finally { setSaving(false); }
            }}
          />

          <TripSubEditors
            trip={q.data}
            onRefresh={() => qc.invalidateQueries({ queryKey: ["admin", "trip", id] })}
            uploadImage={async (file) => {
              const { uploadUrl, key } = await adminFetch<{ uploadUrl: string; key: string }>(
                `/api/admin/trips/${id}/images/upload-url`,
                { method: "POST", body: JSON.stringify({ contentType: file.type }) },
              );
              await putSignedUpload(uploadUrl, file, file.type);
              await adminFetch(`/api/admin/trips/${id}/images`, {
                method: "POST",
                body: JSON.stringify({ imageKey: key, sortOrder: q.data!.images.length }),
              });
            }}
            deleteImage={async (imgId) => {
              await adminFetch(`/api/admin/trips/${id}/images/${imgId}`, { method: "DELETE" });
            }}
          />
        </>
      )}
    </AdminShell>
  );
}
