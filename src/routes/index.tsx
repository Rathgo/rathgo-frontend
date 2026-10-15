import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
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
import s1 from "@/assets/story-1.jpg";
import s2 from "@/assets/story-2.jpg";
import s3 from "@/assets/story-3.jpg";
import s4 from "@/assets/story-4.jpg";
import s5 from "@/assets/story-5.jpg";
import s6 from "@/assets/story-6.jpg";
import gallery01 from "@/assets/gallery-01.jpeg.asset.json";
import gallery02 from "@/assets/gallery-02.jpeg.asset.json";
import gallery03 from "@/assets/gallery-03.jpeg.asset.json";
import gallery04 from "@/assets/gallery-04.jpeg.asset.json";
import gallery05 from "@/assets/gallery-05.jpeg.asset.json";
import gallery06 from "@/assets/gallery-06.jpeg.asset.json";
import gallery07 from "@/assets/gallery-07.jpeg.asset.json";
import gallery08 from "@/assets/gallery-08.jpeg.asset.json";
import gallery09 from "@/assets/gallery-09.jpeg.asset.json";
import gallery10 from "@/assets/gallery-10.jpeg.asset.json";
import corporate1 from "@/assets/corporate1.jpeg.asset.json";
import corporate2 from "@/assets/corporate2.jpeg.asset.json";
import directorPhoto from "@/assets/director.webp.asset.json";

const galleryPool = [
  s1, s2, s3, s4, s5, s6,
  gallery01.url, gallery02.url, gallery03.url, gallery04.url, gallery05.url, gallery06.url,
  gallery07.url, gallery08.url, gallery09.url, gallery10.url, corporate1.url, corporate2.url,
];

type GalleryTileState = { current: number; previous: number | null; crossfading: boolean };

const initialGalleryTiles: GalleryTileState[] = Array.from({ length: 6 }, (_, index) => ({
  current: index,
  previous: null,
  crossfading: false,
}));

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "RATHGO — Travel Together, Never Alone" },
      { name: "description", content: "Join curated batch trips across the Himalayas. Solo or couple, meet like-minded explorers and make memories that last a lifetime." },
      { property: "og:title", content: "RATHGO — Travel Together, Never Alone" },
      { property: "og:description", content: "Join curated batch trips across the Himalayas with Rathgo, a unit of Chetan Tours Solution Pvt. Ltd." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Home() {
  const [galleryTiles, setGalleryTiles] = useState(initialGalleryTiles);

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const frames = new Set<number>();
    const interval = window.setInterval(() => {
      setGalleryTiles((tiles) => {
        const tileIndex = Math.floor(Math.random() * tiles.length);
        const visible = new Set(tiles.map((tile) => tile.current));
        const unused = galleryPool.map((_, index) => index).filter((index) => !visible.has(index));
        if (unused.length === 0) return tiles;

        const nextImage = unused[Math.floor(Math.random() * unused.length)];
        if (nextImage === undefined) return tiles;
        const currentTile = tiles[tileIndex];
        if (!currentTile) return tiles;
        const previousImage = currentTile.current;
        const nextTiles = tiles.map((tile, index) => index === tileIndex
          ? { current: nextImage, previous: previousImage, crossfading: false }
          : tile);

        const frame = window.requestAnimationFrame(() => {
          frames.delete(frame);
          setGalleryTiles((current) => current.map((tile, index) =>
            index === tileIndex && tile.current === nextImage ? { ...tile, crossfading: true } : tile));
        });
        frames.add(frame);
        const timer = setTimeout(() => {
          timers.delete(timer);
          setGalleryTiles((current) => current.map((tile, index) =>
            index === tileIndex && tile.current === nextImage ? { ...tile, previous: null, crossfading: false } : tile));
        }, 850);
        timers.add(timer);
        return nextTiles;
      });
    }, 3000);

    return () => {
      window.clearInterval(interval);
      timers.forEach(clearTimeout);
      frames.forEach(window.cancelAnimationFrame);
    };
  }, []);

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
            <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.data.map((d) => (
                <Link
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  key={d.slug}
                  className="group surface-card overflow-hidden relative flex h-full flex-col"
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
                  <div className="p-6 relative -mt-16 mx-4 mb-4 flex flex-1 flex-col rounded-2xl bg-surface/95 backdrop-blur border border-border">
                    <p className="eyebrow">{d.state}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-[3.5rem] font-display text-2xl font-black uppercase">{d.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{d.shortDescription}</p>
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

      <section className="border-y border-border bg-surface/40 py-16 md:py-20">
        <div className="container-page">
          <header className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">Know More About Us</span>
            <h2 className="mt-3 font-display text-3xl font-black uppercase sm:text-4xl">Travel with us, and the world will feel like home</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              Travel is what we power. With 20 years of experience, Chetan Tour &amp; Travels specialises in organising tour packages across India and creating customised travel experiences tailored to your needs. From group tours and holiday packages to corporate trips, school and college tours, and personalised travel arrangements, we turn your travel plans into memorable experiences. We also provide reliable local and outstation taxi rentals, tempo travellers, buses, and corporate transport services across Delhi-NCR and the rest of India, ensuring safe, secure, and pocket-friendly journeys.
            </p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
            <section className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center sm:p-8" aria-label="Director profile">
              <img src={directorPhoto.url} alt="Sunil Kumar Raghav, Director" className="aspect-[4/5] w-full max-w-xs rounded-lg border border-border object-cover object-top" />
              <h3 className="mt-5 font-display text-2xl font-bold uppercase">Sunil Kumar Raghav</h3>
              <p className="mt-1 text-sm text-muted-foreground">(Director - Chetan Trip Solution Private Limited)</p>
            </section>
            <article className="rounded-xl border border-border bg-background p-6 sm:p-8">
              <span className="eyebrow">Trust and story</span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase">From the founder’s desk</h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                <p>At Chetan Tour and Travel, we believe that every journey is an opportunity to create unforgettable memories. Founded by Mr. Sunil kumar Raghav, our travel agency is committed to offering personalized, seamless travel experiences for every traveler. With over a decade of experience, we specialize in crafting tailored itineraries for family vacations, honeymoons, corporate trips, and adventure getaways.</p>
                <p>Our focus is on customer satisfaction, transparency, and responsible travel. We ensure that each trip is not only well-planned but also delivers exceptional value and service, every step of the way.</p>
                <p>Join us for your next adventure, and let us turn your travel dreams into reality!</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Moments</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black uppercase">Photo Gallery</h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {galleryTiles.map((tile, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-2">
                {tile.previous !== null && (
                  <img src={galleryPool[tile.previous]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <img
                  src={galleryPool[tile.current]}
                  alt="Travel moments with Rathgo"
                  loading="lazy"
                  className={"absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
                    (tile.previous !== null && !tile.crossfading ? "opacity-0" : "opacity-100")}
                />
              </div>
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
