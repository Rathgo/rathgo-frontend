import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { adminLogin, useAdminAuth } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Admin — Sign in" }, { name: "robots", content: "noindex" }] }),
});

function AdminLogin() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth.ready && auth.token) navigate({ to: "/admin" });
  }, [auth.ready, auth.token, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await adminLogin(email, password);
      navigate({ to: "/admin" });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-4">
      <form onSubmit={submit} className="w-full max-w-sm surface-card p-8">
        <p className="eyebrow">RATHGO Admin</p>
        <h1 className="mt-2 font-display text-3xl font-black uppercase">Sign In</h1>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand"
        />

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-brand mt-6 w-full disabled:opacity-60">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
        </button>
      </form>
    </div>
  );
}
