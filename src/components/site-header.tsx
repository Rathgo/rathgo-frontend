import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import rathgoLogo from "@/assets/rathgo-logo.png.asset.json";

const nav = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Destinations", to: "/destinations" },
  { label: "Stories", to: "/stories" },
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
        <div className="flex items-center justify-between gap-3 py-4 md:py-5">
          {/* Left: logo + company name */}
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="Rathgo — a unit of Chetan Tours Solution Pvt. Ltd."
          >
            <img
              src={rathgoLogo.url}
              alt="Rathgo"
              className="h-12 w-auto shrink-0 md:h-16"
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-2xl font-black tracking-[0.15em] text-foreground md:text-4xl">
                RATHGO
              </span>
              <span className="mt-1 truncate text-[8px] uppercase tracking-[0.16em] text-foreground/70 md:text-[10px]">
                A unit of Chetan Tours Solution Pvt. Ltd.
              </span>
            </span>
          </Link>

          {/* Right: actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/destinations" className="btn-brand !px-4 !py-2 hidden sm:inline-flex">
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
          <ThemeToggle className="!h-7 !w-7 opacity-60 hover:opacity-100" />
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
            <div className="flex items-center gap-3 px-3 pt-2">
              <ThemeToggle className="!h-8 !w-8" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Theme</span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
