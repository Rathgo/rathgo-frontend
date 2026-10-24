import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
      <SiteHeader />

      <section className="relative">
        <div className="relative min-h-[420px] overflow-hidden">
          <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="container-page relative z-10 flex flex-col justify-end pb-14 pt-44 md:pt-52">
            <span className="chip !bg-brand/20 !border-brand/40 !text-brand mb-4 w-fit">Real Experiences</span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white leading-[0.95]">
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
              {q.data.map((s) => (
                <StoryCard key={s.id} story={s} />
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

function StoryCard({ story }: { story: Story }) {
  const [imageIndex, setImageIndex] = useState(0);
  const catLabel: Record<StoryCategory, string> = { solo: "SOLO", couple: "COUPLE", group: "GROUP" };
  const galleryImages = story.images ?? [];
  const coverImage = story.coverImageUrl &&
    !galleryImages.some((image) => image.imageKey === story.coverImageKey || image.imageUrl === story.coverImageUrl)
    ? [{ id: -1, imageUrl: story.coverImageUrl, altText: null }]
    : [];
  const images = [...coverImage, ...galleryImages];
  const activeImage = images.length > 0 ? imageIndex % images.length : 0;

  useEffect(() => {
    setImageIndex(0);
    if (images.length < 2) return;

    const intervalId = window.setInterval(() => {
      setImageIndex((index) => (index + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [story.id, images.length]);

  return (
    <article className="surface-card h-full overflow-hidden bg-surface flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        {images.length > 0 && (
          <>
            <div
              className="flex h-full w-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeImage * 100}%)` }}
            >
              {images.map((image) => (
                <div key={image.id} className="h-full min-w-full">
                  <img
                    src={image.imageUrl}
                    alt={image.altText ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setImageIndex((activeImage - 1 + images.length) % images.length)}
                  aria-label="Previous story image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white hover:bg-black/75"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageIndex((activeImage + 1) % images.length)}
                  aria-label="Next story image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white hover:bg-black/75"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      aria-label={`Show story image ${index + 1}`}
                      aria-current={index === activeImage}
                      className={`h-1.5 w-1.5 rounded-full ${index === activeImage ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        {story.tripLabel && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] uppercase tracking-widest text-brand-foreground">
            {story.tripLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="min-h-12 line-clamp-2 font-display text-xl font-black uppercase leading-tight">{story.title}</h3>
        <p
          tabIndex={0}
          aria-label="Story content"
          className="mt-3 h-24 shrink-0 overflow-y-auto text-sm text-muted-foreground"
        >
          {story.content}
        </p>
        <div className="mt-5 border-t border-border pt-4 flex items-center justify-between">
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
