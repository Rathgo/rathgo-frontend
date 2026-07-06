import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Calendar, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { destinations } from "@/lib/destinations";
import heroImg from "@/assets/hero-manali.jpg";

export const Route = createFileRoute("/destinations/")({
  component: DestinationsIndex,
  head: () => ({
    meta: [
      { title: "Destinations — RATHGO Himalayan Batch Trips" },
      { name: "description", content: "Find your perfect batch trip. From snow-capped peaks to serene valleys — pick a destination and travel with like-minded explorers." },
    ],
  }),
});

function DestinationsIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[420px] rounded-b-3xl overflow-hidden">
          <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
          <div className="container-page relative z-10 h-full flex flex-col justify-center pt-24 text-center">
            <span className="eyebrow mx-auto">Explore Destinations</span>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white">
              Find Your Perfect Batch Trip
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-white/80 text-sm md:text-base">
              From snow-capped peaks to serene valleys — pick a destination and travel with like-minded explorers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="surface-card p-6 md:p-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="eyebrow">All Destinations</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-black uppercase">Where Do You Want to Go?</h2>
              <p className="mt-4 text-muted-foreground text-sm md:text-base">
                Choose from our most loved Himalayan escapes, each curated for comfort, adventure, and unforgettable views.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d) => (
                <div key={d.slug} className="surface-card overflow-hidden bg-surface-2/60 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] text-brand-foreground flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="eyebrow">{d.state}</p>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase">{d.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {d.days}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="font-bold">₹{d.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="chip"><Users className="h-3 w-3" /> {d.type}</span>
                      <span className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-brand text-brand" /> {d.rating}</span>
                    </div>

                    <Link
                      to="/destinations/$slug"
                      params={{ slug: d.slug }}
                      className="btn-brand mt-5 w-full"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-brand text-brand-foreground p-8 md:p-12 grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-black uppercase">Can't Decide? Let Us Help You Pick!</h3>
              <p className="mt-2 text-sm text-brand-foreground/85">Talk to our trip experts and find the best batch trip for you.</p>
            </div>
            <Link to="/contact" className="btn-ghost-pill !border-white/60 !text-white hover:!bg-white/10">Contact Us</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
