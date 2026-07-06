import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import heroImg from "@/assets/hero-manali.jpg";
import s1 from "@/assets/story-1.jpg";
import s2 from "@/assets/story-2.jpg";
import s3 from "@/assets/story-3.jpg";
import s4 from "@/assets/story-4.jpg";
import s5 from "@/assets/story-5.jpg";
import s6 from "@/assets/story-6.jpg";

export const Route = createFileRoute("/stories")({
  component: Stories,
  head: () => ({
    meta: [
      { title: "Stories from Our Travellers — RATHGO" },
      { name: "description", content: "Solo explorers, couples, and new friends — read how RATHGO changed the way they travel." },
    ],
  }),
});

type Story = {
  id: number;
  image: string;
  tag: string;
  title: string;
  body: string;
  author: string;
  type: "SOLO" | "COUPLE";
  category: "solo" | "couple" | "group";
};

const stories: Story[] = [
  { id: 1, image: s1, tag: "Manali Batch — Dec 2024", title: "Met strangers, came back with family", body: "Aarav S. joined solo and found a batch that felt like home. From shared chai stops to late-night laughs, the trip turned into a bond that lasted beyond the mountains.", author: "Aarav S.", type: "SOLO", category: "solo" },
  { id: 2, image: s2, tag: "Dharamshala — Feb 2025", title: "Our first trip together and it was perfect", body: "Priya & Rohan wanted a calm escape and got more than they expected — quiet monasteries, warm sunsets, and a trip that felt effortless from start to finish.", author: "Priya & Rohan", type: "COUPLE", category: "couple" },
  { id: 3, image: s3, tag: "Sissu — Jan 2025", title: "The mountains healed something in me", body: "Sneha M. came for the views and left with clarity. The batch made solo travel feel safe, social, and deeply personal in the best possible way.", author: "Sneha M.", type: "SOLO", category: "solo" },
  { id: 4, image: s4, tag: "Spiti Valley — Mar 2025", title: "Most challenging and rewarding 7 days of my life", body: "Karan T. pushed his limits and found a new version of himself. The route, the people, and the shared support made every tough mile worth it.", author: "Karan T.", type: "SOLO", category: "solo" },
  { id: 5, image: s5, tag: "Kasol — Nov 2024", title: "We bonded over bonfires and starry skies", body: "Meera & Dev found the perfect mix of adventure and calm. The batch vibe made every evening feel like a celebration with old friends.", author: "Meera & Dev", type: "COUPLE", category: "couple" },
  { id: 6, image: s6, tag: "Chopta — Apr 2025", title: "Strangers became trek partners for life", body: "Rahul G. joined for the trek and stayed for the people. The shared climbs, jokes, and sunrise moments made the journey unforgettable.", author: "Rahul G.", type: "SOLO", category: "group" },
];

const filters = [
  { key: "all", label: "All" },
  { key: "solo", label: "Solo Trips" },
  { key: "couple", label: "Couple Trips" },
  { key: "group", label: "Group Moments" },
] as const;

function Stories() {
  const [active, setActive] = useState<(typeof filters)[number]["key"]>("all");
  const filtered = active === "all" ? stories : stories.filter((s) => s.category === active);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      {/* Hero */}
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

      {/* Filters */}
      <section className="pt-10">
        <div className="container-page">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={
                  "rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition border " +
                  (active === f.key
                    ? "bg-brand text-brand-foreground border-brand"
                    : "border-border bg-surface text-foreground hover:bg-surface-2")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, idx) => {
            const compact = idx % 3 === 1;
            return (
              <article key={s.id} className="surface-card overflow-hidden bg-surface flex flex-col">
                <div className={"relative overflow-hidden " + (compact ? "aspect-[4/3]" : "aspect-square")}>
                  <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] uppercase tracking-widest text-brand-foreground">
                    {s.tag}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl font-black uppercase leading-tight">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground flex-1">{s.body}</p>
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/20 text-brand text-xs font-bold">
                        {s.author.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{s.author}</p>
                        <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{s.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-brand">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
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
