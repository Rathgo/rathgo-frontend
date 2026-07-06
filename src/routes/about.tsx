import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import heroImg from "@/assets/hero-manali.jpg";

export const Route = createFileRoute("/about")({ component: Page, head: () => ({ meta: [{ title: "About Us — RATHGO" }] }) });

function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />
      <section className="relative h-[50vh] min-h-[360px]">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background" />
        <div className="container-page relative z-10 h-full flex flex-col justify-end pb-10 pt-24">
          <span className="eyebrow">Who We Are</span>
          <h1 className="mt-2 font-display text-5xl md:text-7xl font-black uppercase text-white">About RATHGO</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="surface-card p-8">
            <h2 className="font-display text-3xl font-black uppercase">Batch trips built for real connection</h2>
            <p className="mt-4 text-muted-foreground text-sm">
              RATHGO curates small-batch Himalayan journeys designed for solo travellers and couples. Every trip is a
              balance of adventure, comfort, and community — so you always travel together, never alone.
            </p>
          </div>
          <div className="surface-card p-8">
            <h2 className="font-display text-3xl font-black uppercase">Why travellers choose us</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Small, like-minded batches of 8–14 travellers</li>
              <li>Handpicked stays with mountain views</li>
              <li>Trusted local guides and safe transport</li>
              <li>Zero hidden costs — transparent pricing</li>
            </ul>
            <Link to="/destinations" className="btn-brand mt-6">See Destinations</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
