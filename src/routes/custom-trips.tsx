import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle, MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import corporateOne from "@/assets/corporate1.jpeg";
import corporateTwo from "@/assets/corporate2.jpeg";

const customTripsEndpoint = "https://script.google.com/macros/s/AKfycbz4gU1LZHd9D9dLOvC2ea8vhFiE-t86UP8SOkAdDNLcQM8uR5svGgw3vQX9Qq4tBAg2xw/exec";

export const Route = createFileRoute("/custom-trips")({
  component: CustomTrips,
  head: () => ({
    meta: [
      { title: "Custom & Corporate Trips — Rathgo" },
      { name: "description", content: "Plan tailored corporate offsites, team journeys, and private group trips with Rathgo, a unit of Chetan Tours Solution Pvt. Ltd." },
      { property: "og:title", content: "Custom & Corporate Trips — Rathgo" },
      { property: "og:description", content: "Tell us about your group and we’ll help shape a trip around your destination, dates, rooms, and budget." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  "Fill in this form (takes less than 2 minutes).",
  "Our team will review your details and call you within 24 hours.",
  "After the call, you can confirm your seat by paying a small token amount.",
];

function CustomTrips() {
  const [sending, setSending] = useState(false);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    try {
      await fetch(customTripsEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(values),
      });
      form.reset();
      toast.success("Thank you! Your custom trip request has been received. Our team will get back to you within 24 hours.");
    } catch {
      toast.error("Your request could not be sent. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container-page pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] xl:gap-12">
          <div>
            <span className="eyebrow">Together, your way</span>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-black uppercase leading-tight sm:text-5xl">Custom & Corporate Travel, Tailored for You</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">From company retreats &amp; team offsites to private group adventures with friends and family.</p>

            <section className="mt-8" aria-labelledby="group-highlights-heading">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-brand" />
                <h2 id="group-highlights-heading" className="font-display text-xl font-bold uppercase">Corporate &amp; Group Highlights</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <figure className="overflow-hidden rounded-xl border border-border bg-surface">
                  <img src={corporateOne} alt="Group team trip together" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="px-3 py-3 text-xs font-semibold sm:px-4 sm:text-sm">Team Offsites &amp; Conferences</figcaption>
                </figure>
                <figure className="overflow-hidden rounded-xl border border-border bg-surface">
                  <img src={corporateTwo} alt="Curated group journey" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="px-3 py-3 text-xs font-semibold sm:px-4 sm:text-sm">Curated Group Expeditions</figcaption>
                </figure>
              </div>
            </section>

            <section className="mt-8" aria-labelledby="how-it-works-heading">
              <h2 id="how-it-works-heading" className="font-display text-xl font-bold uppercase">How It Works</h2>
              <ol className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-6">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-brand-foreground">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <aside className="mt-5 rounded-lg border border-brand/40 bg-brand/10 p-4">
              <p className="flex gap-2 text-sm font-semibold"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Kindly fill in your WhatsApp number correctly so that we can reach you.</p>
              <p className="mt-2 pl-6 text-sm text-muted-foreground">You do not need to message us separately. Filling this form is enough.</p>
            </aside>
          </div>

          <form onSubmit={submitRequest} className="surface-card grid gap-4 p-5 sm:p-7">
            <div className="border-b border-border pb-4">
              <span className="eyebrow">Start planning</span>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase">Tell us what you have in mind</h2>
              <p className="mt-2 text-sm text-muted-foreground">Share a few details and our team will help you shape the trip.</p>
            </div>
            <label className="grid gap-2 text-sm font-medium">Company / Individual Name
              <input name="companyIndividualName" required maxLength={150} autoComplete="organization" placeholder="Company or individual name" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">Contact Person Name
              <input name="contactPersonName" required maxLength={100} autoComplete="name" placeholder="Your name" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">Phone Number <span className="font-normal text-muted-foreground">(WhatsApp)</span>
              <input name="phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="Include your country code" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">Email Address
              <input name="email" type="email" required maxLength={255} autoComplete="email" placeholder="you@example.com" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">Number of Persons
                <input name="numberOfPersons" type="number" required min={1} max={10000} step={1} placeholder="e.g. 25" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label className="grid gap-2 text-sm font-medium">Trip Location / Destination
                <input name="tripLocation" required maxLength={150} placeholder="Where would you like to go?" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">Dates / Duration
                <input name="datesDuration" required maxLength={100} placeholder="Preferred dates or trip length" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label className="grid gap-2 text-sm font-medium">Rooms / Sharing Preference
                <select name="roomSharingPreference" defaultValue="" required className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="" disabled>Select preference</option>
                  <option value="Single sharing">Single sharing</option>
                  <option value="Double sharing">Double sharing</option>
                  <option value="Triple sharing">Triple sharing</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">Budget Per Person
              <input name="budgetPerPerson" maxLength={80} placeholder="Your approximate budget" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">Special Notes / Requirements
              <textarea name="specialNotes" maxLength={2000} rows={4} placeholder="Anything else we should know?" className="w-full resize-y rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <Button type="submit" disabled={sending} className="btn-brand w-full rounded-full border-0">
              {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {sending ? "Sending request…" : "Send trip request"}
              {!sending && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}