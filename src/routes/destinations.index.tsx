import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Star, Calendar, Users, Search, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { apiFetch } from "@/lib/api";
import type { Trip } from "@/lib/types";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import heroImg from "@/assets/hero-manali.jpg";

const searchSchema = z.object({
  state: z.string().optional(),
  travelType: z.enum(["solo", "group", "both"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export const Route = createFileRoute("/destinations/")({
  component: DestinationsIndex,
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Destinations — RATHGO Himalayan Batch Trips" },
      { name: "description", content: "Find your perfect batch trip. From snow-capped peaks to serene valleys — pick a destination and travel with like-minded explorers." },
    ],
  }),
});

function DestinationsIndex() {
  const search = Route.useSearch();
  const params = new URLSearchParams({ all: "true" });
  if (search.state) params.set("state", search.state);
  if (search.travelType) params.set("travelType", search.travelType);
  if (search.minPrice) params.set("minPrice", String(search.minPrice));
  if (search.maxPrice) params.set("maxPrice", String(search.maxPrice));

  const trips = useQuery({
    queryKey: ["trips", "all", search],
    queryFn: () => apiFetch<Trip[]>(`/api/trips?${params.toString()}`),
  });

  const [query, setQuery] = useState("");
  const visibleTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trips.data ?? [];
    return (trips.data ?? []).filter((t) =>
      `${t.title} ${t.state ?? ""}`.toLowerCase().includes(q),
    );
  }, [trips.data, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

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

            <div className="mt-8 mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations by name..."
                aria-label="Search destinations"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" className="shrink-0 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {trips.isLoading && <LoadingBlock label="Loading trips..." />}
            {trips.isError && <ErrorBlock error={trips.error} onRetry={() => trips.refetch()} />}
            {trips.data && visibleTrips.length === 0 && (
              <p className="mt-10 text-center text-muted-foreground text-sm">No trips match your search.</p>
            )}
            {visibleTrips.length > 0 && (
              <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleTrips.map((d) => (
                  <div key={d.slug} className="surface-card overflow-hidden bg-surface-2/60 flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                      {d.images[0] && (
                        <img src={d.images[0].imageUrl} alt={d.title} loading="lazy" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] text-brand-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> {d.rating}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="eyebrow">{d.state}</p>
                      <h3 className="mt-1 line-clamp-2 min-h-[3.5rem] font-display text-2xl font-black uppercase">{d.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{d.shortDescription}</p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {d.days} Days / {d.nights} Nights
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Starting from</p>
                          <p className="font-bold">₹{Number(d.startingPrice).toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="chip capitalize"><Users className="h-3 w-3" /> {d.travelType}</span>
                        <span className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-brand text-brand" /> {d.rating}</span>
                      </div>

                      <Link
                        to="/destinations/$slug"
                        params={{ slug: d.slug }}
                        className="btn-brand mt-auto pt-3 w-full"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
