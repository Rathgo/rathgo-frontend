import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { destinations } from "@/lib/destinations";
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        <div className="container-page relative z-10 text-center pt-32 pb-24">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] max-w-4xl mx-auto">
            Travel Together, Never Alone
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-white/80">
            Join curated batch trips across the Himalayas. Whether you travel solo or as a couple, meet like-minded explorers and make memories that last a lifetime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/destinations" className="btn-brand">Learn More</Link>
            <Link to="/destinations" className="btn-ghost-pill !text-white !border-white/40 hover:!bg-white/10">Book Now</Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Uncover Place</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black uppercase">Popular Destinations</h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base">
              Explore the most loved getaways in the Indian Himalayas. From snow-clad peaks to serene monasteries, find your perfect batch trip.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                key={d.slug}
                className="group surface-card overflow-hidden relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] text-brand-foreground flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </span>
                </div>
                <div className="p-6 relative -mt-16 mx-4 rounded-2xl bg-surface/95 backdrop-blur border border-border">
                  <p className="eyebrow">{d.state}</p>
                  <h3 className="mt-1 font-display text-2xl font-black uppercase">{d.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/destinations" className="btn-brand">Explore All Destinations</Link>
          </div>
        </div>
      </section>

      {/* Stories / Photo Gallery */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Photo Gallery</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black uppercase">Stories from Travellers</h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base">
              Real moments from our batch trips. Solo travellers and couples who became friends and explored the Himalayas together with RATHGO.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <img src={g1} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
            <img src={g3} alt="" loading="lazy" className="col-span-2 md:col-span-1 md:row-span-2 aspect-square md:aspect-[3/4] w-full rounded-2xl object-cover" />
            <img src={g5} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
            <img src={g2} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
            <img src={g4} alt="" loading="lazy" className="hidden md:block aspect-square w-full rounded-2xl object-cover" />
            <img src={g6} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
          </div>
          <div className="mt-8 text-center">
            <Link to="/stories" className="btn-ghost-pill">Read All Stories <ArrowRight className="h-3 w-3" /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container-page">
          <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-14 grid gap-6 md:grid-cols-[1fr_auto] items-end">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase leading-tight max-w-2xl">
                Ready for an Unforgettable Journey? Remember Us!
              </h2>
              <p className="mt-4 text-sm md:text-base text-brand-foreground/85 max-w-xl">
                Book your next batch trip with RATHGO and travel together with new friends. Solo or couple, adventure awaits in every direction.
              </p>
            </div>
            <Link to="/contact" className="btn-ghost-pill !border-white/50 !text-white hover:!bg-white/10">Contact Us</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
