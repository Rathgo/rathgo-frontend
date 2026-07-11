import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard, Map, Ticket, MessageSquareQuote, Users, ClipboardList, LogOut, Loader2,
} from "lucide-react";
import { useAdminAuth, adminLogout } from "@/lib/admin-auth";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/trips", label: "Trips", icon: Map },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/stories", label: "Stories", icon: MessageSquareQuote },
  { to: "/admin/team-members", label: "Team", icon: Users },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title?: string }) {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    if (auth.ready && !auth.token) {
      navigate({ to: "/admin/login", search: { redirect: location.pathname } as never });
    }
  }, [auth.ready, auth.token, navigate, location.pathname]);

  if (!auth.ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }
  if (!auth.token) return null;

  const logout = async () => {
    await adminLogout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-border bg-surface p-6 hidden md:flex md:flex-col">
        <Link to="/" className="font-display text-2xl font-black tracking-[0.15em]">RATHGO</Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Admin</p>

        <nav className="mt-8 space-y-1 flex-1">
          {nav.map((n) => {
            const active = n.exact
              ? location.pathname === n.to
              : location.pathname === n.to || location.pathname.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition " +
                  (active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground")
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground truncate">{auth.admin?.email}</p>
          <button onClick={logout} className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between bg-surface">
          <h1 className="font-display text-xl md:text-2xl font-black uppercase">{title ?? "Admin"}</h1>
          <button onClick={logout} className="md:hidden text-xs font-semibold text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
