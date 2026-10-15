import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";

const contactEndpoint = "https://script.google.com/macros/s/AKfycbwiJITLlsOlWJSju_jiBk1LRErYn0G5R8Bt0spRcKFQUO6jVPCylDZJ6MQLKMpm2yeITg/exec";
const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.1895885326303!2d77.3777681!3d28.5940887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce57fe6a515e5%3A0x112429ba6f4c2f6c!2sChetan%20Tour%20%26%20Travels%20Noida%20-%20A%20unit%20of%20Chetan%20Trip%20Solution%20Private%20Limited!5e0!3m2!1sen!2sin!4v1791959523054!5m2!1sen!2sin";

const departments = [
  { label: "Package Booking", value: "+91 8826614301", href: "tel:+918826614301" },
  { label: "Cab Booking", value: "+91 9911099993", href: "tel:+919911099993" },
  { label: "Tempo Traveller & Bus Booking", value: "+91 9911099992", href: "tel:+919911099992" },
  { label: "Feedback & Complaint", value: "+91 8750505497", href: "tel:+918750505497" },
];

const emails = [
  { label: "Travel enquiries", value: "rathgo.travel@gmail.com", href: "mailto:rathgo.travel@gmail.com" },
  { label: "Chetan Tours Solution", value: "chetantripsolution@gmail.com", href: "mailto:chetantripsolution@gmail.com" },
  { label: "Support & Feedback", value: "corporate@chetantripsolution.com", href: "mailto:corporate@chetantripsolution.com" },
];

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Rathgo — Chetan Tours Solution" },
      { name: "description", content: "Contact Rathgo, a unit of Chetan Tours Solution Pvt. Ltd., for travel planning, booking assistance, and support." },
      { property: "og:title", content: "Contact Rathgo — Chetan Tours Solution" },
      { property: "og:description", content: "Reach the Rathgo travel team for bookings, support, and personalized travel advice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Contact() {
  const [sending, setSending] = useState(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    setSending(true);
    try {
      await fetch(contactEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(values),
      });
      form.reset();
      toast.success("Thank you! Your message has been sent. Our team will contact you shortly.");
    } catch {
      toast.error("Your message could not be sent. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container-page pb-16 pt-32 md:pb-24 md:pt-40">
        <header className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Get in Touch</span>
          <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-5xl">Have a question?</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            Get in touch with Chetan Tour and Travel for personalized travel experiences. Our team of travel experts is ready to provide you with personalized services and travel advice. Whether you’re booking a vacation or seeking recommendations, we’re just a message away. Contact us today to start planning your dream getaway!
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
          <section className="surface-card p-6 sm:p-8" aria-labelledby="contact-details-heading">
            <h2 id="contact-details-heading" className="font-display text-2xl font-bold uppercase">Reach the right team</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">Call us</h3>
                <ul className="mt-3 space-y-4">
                  {departments.map((item) => (
                    <li key={item.label} className="flex gap-3 text-sm">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span className="min-w-0">
                        <span className="block text-muted-foreground">{item.label}</span>
                        <a className="font-semibold text-foreground hover:text-brand" href={item.href}>{item.value}</a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow">Email us</h3>
                <ul className="mt-3 space-y-4">
                  {emails.map((item) => (
                    <li key={item.value} className="flex gap-3 text-sm">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span className="min-w-0">
                        <span className="block text-muted-foreground">{item.label}</span>
                        <a className="break-all font-semibold text-foreground hover:text-brand" href={item.href}>{item.value}</a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-7 border-t border-border pt-6">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><MapPin className="h-5 w-5 text-brand" /> Visit Our Office</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">C-17/3, Shiv Shakti Apartment, Sector 71, Noida, Uttar Pradesh 201301</p>
              <iframe
                title="Chetan Tour & Travels office location"
                src={mapEmbedUrl}
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="mt-4 rounded-xl border border-border"
              />
              <a
                href="https://maps.app.goo.gl/FNbFhep2uph2eT3w5"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-pill mt-4"
              >
                Open in Google Maps <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <SocialLinks />
          </section>

          <form onSubmit={submitContact} className="surface-card flex flex-col gap-4 p-6 sm:p-8">
            <div>
              <span className="eyebrow">Send a message</span>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase">Let’s plan your trip</h2>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Full Name
              <input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email Address
              <input name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@example.com" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Phone Number
              <input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="Your phone number" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Message
              <textarea name="message" required maxLength={2000} rows={5} placeholder="How can we help?" className="w-full resize-y rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <Button type="submit" disabled={sending} className="btn-brand w-full rounded-full border-0">
              {sending && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}