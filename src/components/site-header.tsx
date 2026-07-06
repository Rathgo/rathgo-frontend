import { Link, useRouterState } from "@tanstack/react-router";
import { Phone, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Destination", to: "/destinations" },
  { label: "Packages", to: "/packages" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <header
      className={
        "absolute inset-x-0 top-0 z-30 " +
        (transparent ? "bg-transparent" : "bg-background/80 backdrop-blur border-b border-border")
      }
    >
      <div className="container-page">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 md:py-5">
          {/* Left: phone */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
              <Phone className="h-4 w-4" />
            </span>
            <div className="hidden sm:block min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">For Further Inquiries</p>
              <p className="text-sm font-semibold truncate">+91 98765 43210</p>
            </div>
          </div>

          {/* Center: logo */}
          <Link
            to="/"
            className="justify-self-center font-display text-2xl md:text-3xl font-black tracking-[0.15em]"
          >
            RATHGO
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60 hover:bg-surface"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <Link to="/destinations" className="btn-brand !py-2 !px-4 hidden sm:inline-flex">
              Book Now
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center justify-center gap-8 pb-4">
          {nav.map((n) => {
            const active = location.pathname === n.to || (n.to !== "/" && location.pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "text-[11px] font-semibold tracking-[0.22em] uppercase transition " +
                  (active ? "text-brand" : "text-foreground/85 hover:text-foreground")
                }
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav */}
        {open && (
          <nav className="lg:hidden pb-4 grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold tracking-[0.15em] uppercase text-foreground/90 hover:bg-surface"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
