import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import rathgoLogo from "@/assets/rathgo-mark.png.asset.json";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Home", to: "/" },
  { label: "Destinations", to: "/destinations" },
  { label: "Custom Trips", to: "/custom-trips" },
  { label: "Stories", to: "/stories" },
  { label: "Contact Us", to: "/contact" },
];

export function SiteHeader(_props: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-page relative">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:py-4">
          {/* Left: logo + company name */}
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 lg:gap-3"
            aria-label="Rathgo — a unit of Chetan Tours Solution Pvt. Ltd."
          >
            <img
              src={rathgoLogo.url}
              alt="Rathgo"
              className="h-12 w-auto shrink-0 sm:h-14 lg:h-16"
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-xl font-black tracking-[0.15em] text-foreground sm:text-2xl lg:text-3xl">
                RATHGO
              </span>
              <span className="mt-1 text-[7px] leading-tight uppercase tracking-[0.12em] text-foreground/70 sm:text-[8px] lg:text-[9px]">
                A unit of Chetan Tours Solution Pvt. Ltd.
              </span>
            </span>
          </Link>

          {/* Center: navigation links inside their own glass capsule */}
          <nav className="hidden items-center justify-center gap-3 rounded-full border border-border/70 bg-background/75 px-4 py-3 shadow-xl backdrop-blur-xl lg:flex xl:gap-5 xl:px-5">
            {nav.map((n) => {
              const active = location.pathname === n.to || (n.to !== "/" && location.pathname.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={
                    "whitespace-nowrap text-[9px] font-semibold uppercase transition xl:text-[10px] " +
                    (active ? "text-brand" : "text-foreground/85 hover:text-foreground")
                  }
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: primary action and mobile menu */}
          <div className="flex shrink-0 items-center justify-end gap-2">
            <Link to="/destinations" className="btn-brand hidden !px-4 !py-2 sm:inline-flex">
              Book Now
            </Link>
            <Button
              type="button"
              onClick={() => setOpen((v) => !v)}
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="mb-3 grid gap-1 rounded-2xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur-xl lg:hidden">
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
