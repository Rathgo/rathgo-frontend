import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { apiFetch, ApiError } from "@/lib/api";
import type { Booking } from "@/lib/types";

export const Route = createFileRoute("/booking/$ref/status")({
  component: BookingStatus,
  head: ({ params }) => ({ meta: [{ title: `Booking ${params.ref} — RATHGO` }] }),
});

function BookingStatus() {
  const { ref } = Route.useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"polling" | "paid" | "failed" | "timeout">("polling");

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const maxTries = 12; // 12 * 2.5s = 30s

    const tick = async () => {
      if (cancelled) return;
      tries++;
      try {
        const b = await apiFetch<Booking>(`/api/bookings/${ref}`);
        if (cancelled) return;
        setBooking(b);
        if (b.paymentStatus === "paid") { setState("paid"); return; }
        if (b.paymentStatus === "failed") { setState("failed"); return; }
        if (tries >= maxTries) { setState("timeout"); return; }
        setTimeout(tick, 2500);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Unable to load booking");
        if (tries < maxTries) setTimeout(tick, 2500);
        else setState("timeout");
      }
    };
    tick();
    return () => { cancelled = true; };
  }, [ref]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="pt-32 pb-20">
        <div className="container-page max-w-xl">
          <div className="surface-card p-8 md:p-10 text-center">
            {state === "polling" && (
              <>
                <Loader2 className="h-10 w-10 text-brand mx-auto animate-spin" />
                <h1 className="mt-5 font-display text-3xl font-black uppercase">Confirming your payment</h1>
                <p className="mt-3 text-sm text-muted-foreground">This can take a few seconds…</p>
              </>
            )}
            {state === "paid" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h1 className="mt-5 font-display text-3xl font-black uppercase">Booking Confirmed!</h1>
                <p className="mt-3 text-sm text-muted-foreground">Your booking reference</p>
                <p className="mt-1 font-display text-2xl">{ref}</p>
                {booking && (
                  <div className="mt-6 rounded-xl bg-surface-2 border border-border p-4 text-left text-sm space-y-1">
                    <p><span className="text-muted-foreground">Trip:</span> {booking.trip.title}</p>
                    <p><span className="text-muted-foreground">Travellers:</span> {booking.groupSize}</p>
                    <p><span className="text-muted-foreground">Total paid:</span> ₹{Number(booking.totalAmount).toLocaleString("en-IN")}</p>
                  </div>
                )}
              </>
            )}
            {state === "failed" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
                <h1 className="mt-5 font-display text-3xl font-black uppercase">Payment Failed</h1>
                <p className="mt-3 text-sm text-muted-foreground">Your payment didn't go through. Please try again.</p>
                {booking && (
                  <Link
                    to="/destinations/$slug"
                    params={{ slug: booking.trip.slug }}
                    search={{ ref: booking.bookingRef, step: 4 }}
                    className="btn-brand mt-6"
                  >
                    Retry Payment
                  </Link>
                )}
              </>
            )}
            {state === "timeout" && (
              <>
                <Clock className="h-12 w-12 text-brand mx-auto" />
                <h1 className="mt-5 font-display text-3xl font-black uppercase">Still Processing</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  We're waiting for the payment confirmation. Refresh in a moment.
                </p>
                <button onClick={() => window.location.reload()} className="btn-brand mt-6">Refresh</button>
              </>
            )}
            {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
            <div className="mt-8">
              <Link to="/" className="btn-ghost-pill">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
