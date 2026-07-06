import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { destinations } from "@/lib/destinations";
import { Star } from "lucide-react";

export const Route = createFileRoute("/packages")({
  component: Packages,
  head: () => ({ meta: [{ title: "Packages — RATHGO" }] }),
});

function Packages() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />
      <div className="h-32" />
      <section className="py-16">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Curated Packages</span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-black uppercase">All Packages</h1>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link key={d.slug} to="/destinations/$slug" params={{ slug: d.slug }} className="surface-card overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden"><img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" /></div>
                <div className="p-5">
                  <p className="eyebrow">{d.state}</p>
                  <h3 className="mt-1 font-display text-2xl font-black uppercase">{d.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-bold">₹{d.price.toLocaleString("en-IN")}</p>
                    <span className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-brand text-brand" /> {d.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
