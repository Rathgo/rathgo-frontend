import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { apiFetch } from "@/lib/api";
import type { Trip } from "@/lib/types";
import heroImg from "@/assets/hero-mountains.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "RATHGO — Travel Together, Never Alone" },
      { name: "description", content: "Join curated batch trips across the Himalayas. Solo or couple, meet like-minded explorers and make memories that last a lifetime." },
    ],
  }),
});

function Home() {
  const trips = useQuery({
    queryKey: ["trips", "featured"],
    queryFn: () => apiFetch<Trip[]>("/api/trips"),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      <section className="relative min-h-[92vh] flex items-center justify-center">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        <div className="container-page relative z-10 text-center pt-32 pb-24">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] max-w-4xl mx-auto">
            One Stop Solution for Travel
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-white/80">
            Celebrate your holidays at the stunning and tranquil hill stations of India.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/destinations" className="btn-brand">Learn More</Link>
            <Link to="/destinations" className="btn-ghost-pill !text-white !border-white/40 hover:!bg-white/10">Book Now</Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Uncover Place</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black uppercase">Popular Destinations</h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base">
              Explore the most loved getaways in the Indian Himalayas. From snow-clad peaks to serene monasteries, find your perfect batch trip.
            </p>
          </div>

          {trips.isLoading && <LoadingBlock label="Loading destinations..." />}
          {trips.isError && <ErrorBlock error={trips.error} onRetry={() => trips.refetch()} />}
          {trips.data && trips.data.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground text-sm">No destinations yet. Check back soon.</p>
          )}
          {trips.data && trips.data.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.data.map((d) => (
                <Link
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  key={d.slug}
                  className="group surface-card overflow-hidden relative"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                    {d.images[0] && (
                      <img
                        src={d.images[0].imageUrl}
                        alt={d.images[0].altText ?? d.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] text-brand-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> {d.rating}
                    </span>
                  </div>
                  <div className="p-6 relative -mt-16 mx-4 rounded-2xl bg-surface/95 backdrop-blur border border-border">
                    <p className="eyebrow">{d.state}</p>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase">{d.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{d.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/destinations" className="btn-brand">Explore All Destinations</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Moments</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black uppercase">Photo Gallery</h2>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[g1, g2, g3, g4, g5, g6].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/stories" className="btn-brand">Read All Stories <ArrowRight className="h-3 w-3" /></Link>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-page">
          <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-14 grid gap-6 md:grid-cols-[1fr_auto] items-end">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase">Ready for Your Next Adventure?</h2>
              <p className="mt-3 text-sm md:text-base text-brand-foreground/85 max-w-xl">
                Join a batch. Meet strangers. Come back with stories worth telling.
              </p>
            </div>
            <Link to="/destinations" className="btn-ghost-pill !border-white/60 !text-white hover:!bg-white/10">Explore Destinations</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
