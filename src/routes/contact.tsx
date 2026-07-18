import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact Us — RATHGO" }] }),
});

function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />
      <div className="h-40" />
      <section className="py-10">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="surface-card p-8">
            <span className="eyebrow">Get in Touch</span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase">Let's Plan Your Trip</h1>
            <p className="mt-3 text-sm text-muted-foreground">Have a question or want a custom batch? Our team will get back within 24 hours.</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> +91 8750505497</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" /> rathgo.travel@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> C-17/3, Shiv Shakti Apartment, Sector 71, Noida, Uttar Pradesh 201301</li>
            </ul>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="surface-card p-8 space-y-3">
            <input placeholder="Full Name" className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand" />
            <input placeholder="Email" type="email" className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand" />
            <input placeholder="Phone" className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand" />
            <textarea placeholder="Message" rows={5} className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand" />
            <button className="btn-brand w-full">Send Message</button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
