import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { TestimonialCard } from "@/components/testimonial-card";
import { apiFetch } from "@/lib/api";
import type { Story } from "@/lib/types";
import heroImg from "@/assets/hero-manali.jpg";

export const Route = createFileRoute("/stories")({
  component: Stories,
  head: () => ({
    meta: [
      { title: "Testimonials from Our Travellers — RATHGO" },
      { name: "description", content: "Hear how solo explorers, couples, and friends experienced travel with RATHGO." },
    ],
  }),
});

const filters = [
  { key: "all", label: "All" },
  { key: "solo", label: "Solo Trips" },
  { key: "couple", label: "Couple Trips" },
  { key: "group", label: "Group Moments" },
] as const;

function Stories() {
  const [active, setActive] = useState<(typeof filters)[number]["key"]>("all");

  const q = useQuery({
    queryKey: ["stories", active],
    queryFn: () => {
      const qs = active === "all" ? "" : `?category=${active}`;
      return apiFetch<Story[]>(`/api/stories${qs}`);
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative">
        <div className="relative min-h-[420px] overflow-hidden">
          <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="container-page relative z-10 flex flex-col justify-end pb-14 pt-44 md:pt-52">
            <span className="chip !bg-brand/20 !border-brand/40 !text-brand mb-4 w-fit">Real Experiences</span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white leading-[0.95]">
              Testimonials from Our Travellers
            </h1>
            <p className="mt-4 max-w-2xl text-white/80 text-sm md:text-base">
              Solo explorers, couples, and new friends — read how RATHGO changed the way they travel.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-10">
        <div className="container-page">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={
                  "rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition " +
                  (active === f.key
                    ? "bg-brand text-brand-foreground border-brand"
                    : "bg-surface-2 border-border text-muted-foreground hover:text-foreground")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          {q.isLoading && <LoadingBlock label="Loading testimonials..." />}
          {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
          {q.data && q.data.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">No testimonials yet in this category.</p>
          )}
          {q.data && q.data.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {q.data.map((s) => (
                <TestimonialCard key={s.id} testimonial={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-12">
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase">Your Testimonial Could Be Next</h2>
            <p className="mt-3 text-sm md:text-base text-brand-foreground/85 max-w-xl">
              Join a RATHGO batch trip and create memories worth sharing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/destinations" className="btn-ghost-pill !border-white/60 !text-white hover:!bg-white/10">Explore Destinations</Link>
              <Link to="/destinations" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-black hover:bg-white/90">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
