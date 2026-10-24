import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { Input, Label } from "@/components/admin-trip-form";
import { adminFetch } from "@/lib/admin-auth";
import { ApiError, putSignedUpload } from "@/lib/api";
import type { Story, StoryCategory, StoryImage } from "@/lib/types";
import { Plus, Trash2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/stories")({
  component: StoriesAdmin,
  head: () => ({ meta: [{ title: "Stories — Admin" }, { name: "robots", content: "noindex" }] }),
});

type Draft = {
  id?: number;
  title: string;
  content: string;
  category: StoryCategory;
  travellerName: string;
  travellerAvatarKey?: string;
  travellerAvatarUrl?: string | null;
  tripLabel?: string | null;
  coverImageKey?: string;
  coverImageUrl?: string | null;
  rating?: string | null;
  isActive: boolean;
  sortOrder: number;
  images?: StoryImage[];
};

function StoriesAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "stories"], queryFn: () => adminFetch<Story[]>("/api/admin/stories") });
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "avatar" | "gallery" | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "stories"] });

  const upload = async (kind: "cover" | "avatar", file: File) => {
    setUploading(kind);
    try {
      const { uploadUrl, key } = await adminFetch<{ uploadUrl: string; key: string }>(
        "/api/admin/stories/upload-url",
        { method: "POST", body: JSON.stringify({ kind, contentType: file.type }) }
      );
      await putSignedUpload(uploadUrl, file, file.type);
      if (kind === "cover") setEditing((p) => p && ({ ...p, coverImageKey: key, coverImageUrl: URL.createObjectURL(file) }));
      else setEditing((p) => p && ({ ...p, travellerAvatarKey: key, travellerAvatarUrl: URL.createObjectURL(file) }));
    } catch (e) { alert(e instanceof ApiError ? e.message : "Upload failed"); }
    finally { setUploading(null); }
  };

  const uploadGalleryImages = async (files: File[]) => {
    if (!editing?.id) {
      toast.error("Save the story before adding gallery images");
      return;
    }

    setUploading("gallery");
    try {
      let sortOrder = Math.max(-1, ...(editing.images ?? []).map((image) => image.sortOrder)) + 1;
      for (const file of Array.from(files)) {
        const { uploadUrl, key } = await adminFetch<{ uploadUrl: string; key: string }>(
          `/api/admin/stories/${editing.id}/images/upload-url`,
          { method: "POST", body: JSON.stringify({ contentType: file.type }) }
        );
        await putSignedUpload(uploadUrl, file, file.type);
        const image = await adminFetch<StoryImage>(`/api/admin/stories/${editing.id}/images`, {
          method: "POST",
          body: JSON.stringify({ imageKey: key, sortOrder }),
        });
        sortOrder++;
        setEditing((current) => current && current.id === editing.id
          ? { ...current, images: [...(current.images ?? []), image] }
          : current
        );
      }
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Gallery upload failed");
    } finally {
      setUploading(null);
    }
  };

  const removeGalleryImage = async (image: StoryImage) => {
    if (!editing?.id) return;
    try {
      await adminFetch(`/api/admin/stories/${editing.id}/images/${image.id}`, { method: "DELETE" });
      setEditing((current) => current && ({
        ...current,
        images: (current.images ?? []).filter((item) => item.id !== image.id),
      }));
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Unable to remove image");
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.id && !editing.coverImageKey) { toast.error("Cover image required"); return; }
    setSaving(true);
    try {
      const body = {
        title: editing.title,
        content: editing.content,
        category: editing.category,
        travellerName: editing.travellerName,
        travellerAvatarKey: editing.travellerAvatarKey,
        coverImageKey: editing.coverImageKey,
        // backend expects numbers for rating and sortOrder; ensure correct types
        rating: editing.rating !== undefined && editing.rating !== null && editing.rating !== "" ? Number(editing.rating) : undefined,
        sortOrder: editing.sortOrder !== undefined ? Number(editing.sortOrder) : undefined,
        isActive: !!editing.isActive,
        // tripLabel is optional string
        tripLabel: editing.tripLabel ? editing.tripLabel : undefined,
      };
      if (editing.id) await adminFetch(`/api/admin/stories/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      else await adminFetch("/api/admin/stories", { method: "POST", body: JSON.stringify(body) });
      toast.success(editing.id ? "Story updated" : "Story created");
      setEditing(null); refresh();
    } catch (e) { toast.error(e instanceof ApiError ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (s: Story) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    await adminFetch(`/api/admin/stories/${s.id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <AdminShell title="Stories">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">Traveller testimonials.</p>
        <button onClick={() => setEditing({ title: "", content: "", category: "solo", travellerName: "", isActive: true, sortOrder: 0, rating: "5.0" })} className="btn-brand">
          <Plus className="h-4 w-4" /> New Story
        </button>
      </div>

      {q.isLoading && <LoadingBlock />}
      {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
      {q.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {q.data.map((s) => (
            <div key={s.id} className="surface-card overflow-hidden">
              {s.coverImageUrl && <img src={s.coverImageUrl} alt="" className="aspect-video w-full object-cover" />}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase">{s.category} · {s.travellerName}</p>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing({ ...s, isActive: s.isActive ?? true, sortOrder: s.sortOrder ?? 0, coverImageKey: undefined, travellerAvatarKey: undefined })} className="btn-ghost-pill !py-1 !px-3 text-xs">Edit</button>
                  <button onClick={() => del(s)} className="text-destructive text-xs"><Trash2 className="h-4 w-4 inline" /></button>
                </div>
              </div>
            </div>
          ))}
          {q.data.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-8">No stories.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="surface-card p-6 md:p-8 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-black uppercase">{editing.id ? "Edit" : "New"} Story</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
              <Input label="Traveller Name" value={editing.travellerName} onChange={(v) => setEditing({ ...editing, travellerName: v })} required />
              <div>
                <Label>Category</Label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as StoryCategory })}
                  className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm">
                  <option value="solo">Solo</option><option value="couple">Couple</option><option value="group">Group</option>
                </select>
              </div>
              <Input label="Trip Label" value={editing.tripLabel ?? ""} onChange={(v) => setEditing({ ...editing, tripLabel: v })} />
              <Input label="Rating" type="number" value={editing.rating ?? ""} onChange={(v) => setEditing({ ...editing, rating: v })} />
              <Input label="Sort Order" type="number" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} />
            </div>
            <div className="mt-3">
              <Label>Content</Label>
              <textarea rows={4} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <UploadBox label="Cover Image" url={editing.coverImageUrl ?? undefined} uploading={uploading === "cover"} onFile={(f) => upload("cover", f)} />
              <UploadBox label="Avatar" url={editing.travellerAvatarUrl ?? undefined} uploading={uploading === "avatar"} onFile={(f) => upload("avatar", f)} />
            </div>

            <div className="mt-5">
              <Label>Gallery Images</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {editing.images?.map((image) => (
                  <div key={image.id} className="relative">
                    <img src={image.imageUrl} alt={image.altText ?? ""} className="h-24 w-32 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(image)}
                      aria-label="Remove gallery image"
                      className="absolute -right-2 -top-2 rounded-full bg-background p-1 text-destructive shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="grid h-24 w-32 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-border text-center text-xs hover:border-brand">
                  {uploading === "gallery" ? <Loader2 className="h-5 w-5 animate-spin text-brand" /> : <Upload className="h-5 w-5 text-brand" />}
                  <span>{editing.id ? "Add images" : "Save story first"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    hidden
                    disabled={!editing.id || uploading !== null}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) void uploadGalleryImages(Array.from(files));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
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

function UploadBox({ label, url, uploading, onFile }: { label: string; url?: string; uploading: boolean; onFile: (f: File) => void }) {
  return (
    <label className="rounded-xl border-2 border-dashed border-border p-4 grid place-items-center cursor-pointer hover:border-brand text-center min-h-32">
      {uploading ? <Loader2 className="h-6 w-6 animate-spin text-brand" /> :
        url ? <img src={url} alt="" className="max-h-24 rounded" /> :
        <Upload className="h-6 w-6 text-brand" />
      }
      <p className="mt-2 text-xs">{label}</p>
      <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
    </label>
  );
}
