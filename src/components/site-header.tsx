import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import rathgoLogo from "@/assets/rathgo-mark.png.asset.json";

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
    <header className="absolute inset-x-0 top-0 z-30">
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-2 bottom-2 z-0 rounded-3xl border border-border/70 bg-background/75 shadow-xl backdrop-blur-xl sm:inset-x-4" />
      <div className="container-page relative z-10">
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
              className="h-14 w-auto shrink-0 md:h-20"
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-2xl font-black tracking-[0.15em] text-foreground md:text-4xl">
                RATHGO
              </span>
              <span className="mt-1 text-[8px] leading-tight uppercase tracking-[0.16em] text-foreground/70 md:text-[10px]">
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
        </nav>

        {/* Mobile nav */}
        {open && (
          <nav className="lg:hidden mb-3 grid gap-1 rounded-2xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur-xl">
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
