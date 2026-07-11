import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { apiFetch } from "@/lib/api";
import type { Story, StoryCategory } from "@/lib/types";
import heroImg from "@/assets/hero-manali.jpg";

export const Route = createFileRoute("/stories")({
  component: Stories,
  head: () => ({
    meta: [
      { title: "Stories from Our Travellers — RATHGO" },
      { name: "description", content: "Solo explorers, couples, and new friends — read how RATHGO changed the way they travel." },
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
      <SiteHeader transparent />

      <section className="relative">
        <div className="relative h-[52vh] min-h-[380px] overflow-hidden">
          <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          <div className="container-page relative z-10 h-full flex flex-col justify-end pb-14 pt-24">
            <span className="chip !bg-brand/20 !border-brand/40 !text-brand mb-4 w-fit">Real Experiences</span>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase text-white">
              Stories from Our Travellers
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
          {q.isLoading && <LoadingBlock label="Loading stories..." />}
          {q.isError && <ErrorBlock error={q.error} onRetry={() => q.refetch()} />}
          {q.data && q.data.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">No stories yet in this category.</p>
          )}
          {q.data && q.data.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {q.data.map((s, idx) => (
                <StoryCard key={s.id} story={s} compact={idx % 3 === 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-12">
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase">Your Story Could Be Next</h2>
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

function StoryCard({ story, compact }: { story: Story; compact: boolean }) {
  const catLabel: Record<StoryCategory, string> = { solo: "SOLO", couple: "COUPLE", group: "GROUP" };
  return (
    <article className="surface-card overflow-hidden bg-surface flex flex-col">
      <div className={"relative overflow-hidden bg-surface-2 " + (compact ? "aspect-[4/3]" : "aspect-square")}>
        {story.coverImageUrl && (
          <img src={story.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}
        {story.tripLabel && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] uppercase tracking-widest text-brand-foreground">
            {story.tripLabel}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl font-black uppercase leading-tight">{story.title}</h3>
        <p className="mt-3 text-sm text-muted-foreground flex-1">{story.content}</p>
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {story.travellerAvatarUrl ? (
              <img src={story.travellerAvatarUrl} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/20 text-brand text-xs font-bold">
                {story.travellerName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{story.travellerName}</p>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{catLabel[story.category]}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-brand">
            {[...Array(Math.round(Number(story.rating)))].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
          </div>
        </div>
      </div>
    </article>
  );
}
