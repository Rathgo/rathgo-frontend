import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Check, Mountain, MapPin, ArrowRight, Upload, Pencil, User, Users,
  Plus, Minus, ChevronRight, Loader2, X,
} from "lucide-react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoadingBlock, ErrorBlock } from "@/components/query-status";
import { apiFetch, ApiError } from "@/lib/api";
import type { Trip, Batch, SharingType, TeamMember, Booking, Member, SharingKind } from "@/lib/types";
import {
  createBooking, patchMembers, uploadAadhar, applyCoupon,
  checkoutBooking, useLocalBooking, sharingLabel,
} from "@/lib/booking-flow";
import { openCashfree } from "@/lib/cashfree";
import fallbackImg from "@/assets/hero-manali.jpg";

const search = z.object({ ref: z.string().optional(), step: z.coerce.number().optional() });

export const Route = createFileRoute("/destinations/$slug")({
  validateSearch: zodValidator(search),
  component: DestinationDetail,
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — RATHGO Batch Trip` }],
  }),
});

function DestinationDetail() {
  const { slug } = Route.useParams();
  const { ref: existingRef, step: initialStep } = Route.useSearch();
  const navigate = useNavigate();

  const tripQ = useQuery({
    queryKey: ["trip", slug],
    queryFn: () => apiFetch<Trip>(`/api/trips/${slug}`),
    retry: 1,
  });

  const [step, setStep] = useState<number>(initialStep && existingRef ? Math.min(initialStep, 4) : 1);
  const [bookingRef, setBookingRef] = useState<string | null>(existingRef ?? null);
  const { booking } = useLocalBooking(bookingRef);

  const goStep = (s: number, ref?: string) => {
    setStep(s);
    navigate({
      to: "/destinations/$slug",
      params: { slug },
      search: { ref: ref ?? bookingRef ?? undefined, step: s },
      replace: true,
    });
  };

  if (tripQ.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <LoadingBlock label="Loading trip..." />
      </div>
    );
  }
  if (tripQ.isError || !tripQ.data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="container-page pt-32">
          <ErrorBlock error={tripQ.error ?? new Error("Trip not found")} onRetry={() => tripQ.refetch()} />
        </div>
      </div>
    );
  }

  const trip = tripQ.data;
  const heroSrc = trip.images[0]?.imageUrl ?? fallbackImg;
  const included = trip.inclusions.filter((i) => i.kind === "included");
  const excluded = trip.inclusions.filter((i) => i.kind === "excluded");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      <section className="relative h-[50vh] min-h-[380px]">
        <img src={heroSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        <div className="container-page relative z-10 h-full flex flex-col justify-end pb-8 pt-28">
          <div className="text-xs text-white/70 flex items-center gap-2">
            <Link to="/" className="hover:text-white">Home</Link> <ChevronRight className="h-3 w-3" />
            <Link to="/destinations" className="hover:text-white">Destination</Link> <ChevronRight className="h-3 w-3" />
            <span className="text-white">{trip.title}</span>
          </div>
          <h1 className="mt-4 font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase text-white leading-none">
            {trip.title}
          </h1>
          <p className="mt-2 eyebrow text-brand">{trip.state}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="chip !bg-black/40">{trip.days} Days / {trip.nights} Nights</span>
            <span className="chip !bg-black/40">Starting ₹{Number(trip.startingPrice).toLocaleString("en-IN")}</span>
            <span className="chip !bg-black/40 capitalize">{trip.travelType}</span>
            <span className="chip !bg-black/40">{trip.rating}★ Rating</span>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">About This Trip</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">A Curated {trip.title} Batch Journey</h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {trip.longDescription || trip.shortDescription}
              </p>
            </div>

            {trip.itineraryDays.length > 0 && (
              <div className="surface-card p-6 md:p-8">
                <p className="eyebrow">Itinerary</p>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">
                  {trip.days} Days of Mountain Moments
                </h2>
                <div className="mt-5 space-y-3">
                  {trip.itineraryDays.map((it) => (
                    <div key={it.id} className="rounded-xl bg-surface-2 border border-border p-4">
                      <p className="text-xs font-bold tracking-[0.18em] uppercase text-foreground">Day {it.dayNumber} — {it.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(included.length > 0 || excluded.length > 0) && (
              <div className="surface-card p-6 md:p-8">
                <p className="eyebrow">What's Included</p>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">Everything You Need for the Trip</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    {included.map((i) => (
                      <div key={i.id} className="flex items-center gap-3 rounded-xl bg-surface-2 border border-border px-4 py-3">
                        <Check className="h-4 w-4 text-brand shrink-0" />
                        <span className="text-sm">{i.label}</span>
                      </div>
                    ))}
                  </div>
                  {excluded.length > 0 && (
                    <div className="space-y-2">
                      {excluded.map((i) => (
                        <div key={i.id} className="flex items-center gap-3 rounded-xl bg-surface-2 border border-border px-4 py-3">
                          <X className="h-4 w-4 text-destructive shrink-0" />
                          <span className="text-sm text-muted-foreground line-through">{i.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">Trip Highlights</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">Top Experiences in {trip.title}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-2 border border-border p-4">
                  <Mountain className="h-5 w-5 text-brand" />
                  <p className="mt-2 text-xs font-bold tracking-[0.18em] uppercase">Scenic Views</p>
                  <p className="mt-1 text-sm text-muted-foreground">Unforgettable Himalayan panoramas.</p>
                </div>
                <div className="rounded-xl bg-surface-2 border border-border p-4">
                  <MapPin className="h-5 w-5 text-brand" />
                  <p className="mt-2 text-xs font-bold tracking-[0.18em] uppercase">Local Experiences</p>
                  <p className="mt-1 text-sm text-muted-foreground">Cafés, culture and community.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="surface-card p-6 md:p-7">
              <StepTracker step={step} />

              {step === 1 && (
                <StepOne
                  trip={trip}
                  onCreated={(b) => {
                    setBookingRef(b.bookingRef);
                    goStep(2, b.bookingRef);
                  }}
                />
              )}
              {step === 2 && booking && (
                <StepTwo booking={booking} onBack={() => goStep(1)} onContinue={() => goStep(3)} onEdit={() => goStep(1)} />
              )}
              {step === 3 && booking && (
                <StepThree booking={booking} onBack={() => goStep(2)} onContinue={() => goStep(4)} />
              )}
              {step === 4 && booking && (
                <StepFour booking={booking} onBack={() => goStep(3)} />
              )}
              {step > 1 && !booking && (
                <div className="mt-6">
                  <ErrorBlock error={new Error("Booking session lost. Please start again.")} onRetry={() => goStep(1)} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function StepTracker({ step }: { step: number }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={"h-1 rounded-full " + (n <= step ? "bg-brand" : "bg-border")} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 text-[10px] font-bold tracking-[0.15em] uppercase">
        {[1, 2, 3, 4].map((n) => {
          const isActive = n === step;
          const isDone = n < step;
          return (
            <div
              key={n}
              className={
                "rounded-full px-3 py-1.5 text-center border transition " +
                (isActive
                  ? "bg-brand text-brand-foreground border-brand"
                  : isDone
                    ? "bg-brand/15 text-brand border-brand/40"
                    : "bg-surface-2 text-muted-foreground border-border")
              }
            >
              {isDone && <Check className="inline h-3 w-3 mr-0.5" />}Step {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------- Step 1 --------------- */

function StepOne({ trip, onCreated }: { trip: Trip; onCreated: (b: Booking) => void }) {
  const availableBatches = trip.batches.filter((b) => b.status !== "inactive" && b.status !== "soldout");
  const [batchId, setBatchId] = useState<number | null>(availableBatches[0]?.id ?? null);
  const [sharingId, setSharingId] = useState<number | null>(trip.sharingTypes[0]?.id ?? null);
  const [travelMode, setTravelMode] = useState<"solo" | "group">(trip.travelType === "group" ? "group" : "solo");
  const [groupSize, setGroupSize] = useState(1);
  const [referredById, setReferredById] = useState<number | "">("");
  const [howHeard, setHowHeard] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const team = useQuery({
    queryKey: ["team-members"],
    queryFn: () => apiFetch<TeamMember[]>("/api/team-members"),
  });

  const chosenSharing = trip.sharingTypes.find((s) => s.id === sharingId);

  const submit = async () => {
    if (!batchId || !sharingId) { setError("Please choose a batch and room sharing."); return; }
    setSubmitting(true); setError(null);
    try {
      const b = await createBooking({
        tripId: trip.id,
        batchId,
        sharingTypeId: sharingId,
        travelMode,
        groupSize: travelMode === "solo" ? 1 : groupSize,
        referredById: referredById ? Number(referredById) : null,
        howHeard: howHeard || undefined,
      });
      onCreated(b);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-display text-2xl md:text-3xl font-black uppercase">Choose Your Batch</h3>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
        {trip.title} — {trip.days} Days / {trip.nights} Nights
      </p>

      {availableBatches.length === 0 && (
        <p className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted-foreground">
          No batches available right now. Please check back soon.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {availableBatches.map((b) => (
          <BatchRow key={b.id} batch={b} price={chosenSharing?.price ?? trip.startingPrice} active={b.id === batchId} onSelect={() => setBatchId(b.id)} />
        ))}
      </div>

      {trip.sharingTypes.length > 0 && (
        <>
          <p className="mt-5 eyebrow">Room Sharing</p>
          <div className="mt-2 grid gap-2 grid-cols-1">
            {trip.sharingTypes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSharingId(s.id)}
                className={
                  "rounded-xl border p-3 text-left flex items-center justify-between transition " +
                  (s.id === sharingId ? "border-brand bg-brand/10" : "border-border bg-surface-2 hover:border-brand/40")
                }
              >
                <span className="text-sm font-semibold">{sharingLabel(s.kind)}</span>
                <span className="text-sm">₹{Number(s.price).toLocaleString("en-IN")}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {trip.travelType !== "solo" && (
        <>
          <p className="mt-5 eyebrow">Travel Mode</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => setTravelMode("solo")} className={"rounded-xl border p-3 text-sm font-semibold transition " + (travelMode === "solo" ? "border-brand bg-brand/10" : "border-border bg-surface-2")}>Solo</button>
            <button onClick={() => setTravelMode("group")} className={"rounded-xl border p-3 text-sm font-semibold transition " + (travelMode === "group" ? "border-brand bg-brand/10" : "border-border bg-surface-2")}>Group</button>
          </div>
          {travelMode === "group" && (
            <div className="mt-3 flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Group size</span>
              <button onClick={() => setGroupSize(Math.max(2, groupSize - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 border border-border"><Minus className="h-3 w-3" /></button>
              <span className="text-base font-bold w-6 text-center">{Math.max(groupSize, 2)}</span>
              <button onClick={() => setGroupSize(Math.min(20, groupSize + 1))} className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 border border-border"><Plus className="h-3 w-3" /></button>
            </div>
          )}
        </>
      )}

      <p className="mt-5 eyebrow">Referred By (Optional)</p>
      <select
        value={referredById}
        onChange={(e) => setReferredById(e.target.value ? Number(e.target.value) : "")}
        className="mt-2 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand"
      >
        <option value="">Select team member</option>
        {(team.data ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <select
        value={howHeard}
        onChange={(e) => setHowHeard(e.target.value)}
        className="mt-3 w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand"
      >
        <option value="">How did you hear about us?</option>
        <option>Instagram</option><option>Friend</option><option>Google</option><option>Other</option>
      </select>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <button onClick={submit} disabled={submitting || !batchId || !sharingId} className="btn-brand mt-5 w-full disabled:opacity-60">
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Reserving...</> : "Continue →"}
      </button>
    </div>
  );
}

function BatchRow({ batch, price, active, onSelect }: { batch: Batch; price: string; active: boolean; onSelect: () => void }) {
  const seatsLeft = batch.totalSeats - batch.seatsBooked;
  return (
    <button
      onClick={onSelect}
      className={
        "w-full text-left rounded-xl border p-4 transition grid grid-cols-[1fr_auto] gap-2 " +
        (active ? "border-brand bg-brand/10" : "border-border bg-surface-2 hover:border-brand/40")
      }
    >
      <div>
        <p className="text-sm font-bold">{fmtDateRange(batch.startDate, batch.endDate)}</p>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className={"h-1.5 w-1.5 rounded-full " + (batch.status === "limited" ? "bg-orange-400" : "bg-emerald-400")} />
          {batch.status === "limited" ? `${seatsLeft} seats left — Limited` : `${seatsLeft} seats available`}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Per Person</p>
        <p className="font-bold">₹{Number(price).toLocaleString("en-IN")}</p>
      </div>
    </button>
  );
}

function fmtDateRange(start: string, end: string) {
  const s = new Date(start), e = new Date(end);
  const m = (d: Date) => d.toLocaleDateString("en-IN", { month: "short" });
  return `${s.getDate()} ${m(s)} – ${e.getDate()} ${m(e)} ${e.getFullYear()}`;
}

/* --------------- Booking header --------------- */

function BookingHeader({ booking, onEdit }: { booking: Booking; onEdit?: () => void }) {
  return (
    <div className="mt-6 rounded-xl bg-surface-2 border border-border px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-[0.15em] uppercase truncate">
          {fmtDateRange(booking.batch.startDate, booking.batch.endDate)}
        </p>
        <p className="text-xs text-muted-foreground">
          Ref {booking.bookingRef} · ₹{Number(booking.sharingType.price).toLocaleString("en-IN")}/person
        </p>
      </div>
      {onEdit && (
        <button onClick={onEdit} aria-label="Edit batch" className="shrink-0 text-brand">
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* --------------- Steps 2 & 3 (member details + aadhar) --------------- */

function emptyMember(isPrimary: boolean): Member {
  return { fullName: "", age: 0, gender: "male", phone: "", email: "", address: "", isPrimary };
}

function StepTwo({ booking, onBack, onContinue, onEdit }: {
  booking: Booking; onBack: () => void; onContinue: () => void; onEdit: () => void;
}) {
  const isGroup = booking.travelMode === "group" && booking.groupSize > 1;
  return isGroup
    ? <StepThreeInner booking={booking} onBack={onBack} onContinue={onContinue} onEdit={onEdit} title="Add Traveller Details" />
    : <StepTwoSolo booking={booking} onBack={onBack} onContinue={onContinue} onEdit={onEdit} />;
}

function StepThree({ booking, onBack, onContinue }: { booking: Booking; onBack: () => void; onContinue: () => void }) {
  // For solo bookings step 3 is a review; for group it's already handled in Step 2 combined form.
  // Simplify: if solo, skip straight to a passthrough card that asks for confirmation.
  if (booking.travelMode === "solo") {
    return (
      <div>
        <BookingHeader booking={booking} />
        <h3 className="mt-5 font-display text-2xl md:text-3xl font-black uppercase">Traveller Confirmed</h3>
        <p className="mt-3 text-sm text-muted-foreground">Continue to review pricing and pay.</p>
        <div className="mt-6 flex items-center justify-between">
          <button onClick={onBack} className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">Back</button>
          <button onClick={onContinue} className="btn-brand">Continue →</button>
        </div>
      </div>
    );
  }
  return <StepThreeInner booking={booking} onBack={onBack} onContinue={onContinue} title="Confirm All Members" />;
}

function StepTwoSolo({ booking, onBack, onContinue, onEdit }: { booking: Booking; onBack: () => void; onContinue: () => void; onEdit: () => void }) {
  const initial = booking.members[0] ?? emptyMember(true);
  const [m, setM] = useState<Member>({ ...initial, isPrimary: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });

  const setField = <K extends keyof Member>(k: K, v: Member[K]) => setM((prev) => ({ ...prev, [k]: v }));

  const handleUpload = async (side: "front" | "back", file: File) => {
    if (file.size > 5 * 1024 * 1024) { setError("Aadhar file must be ≤ 5MB"); return; }
    setUploading((s) => ({ ...s, [side]: true }));
    setError(null);
    try {
      const key = await uploadAadhar(booking.bookingRef, side, file);
      setField(side === "front" ? "aadharFrontKey" : "aadharBackKey", key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading((s) => ({ ...s, [side]: false }));
    }
  };

  const submit = async () => {
    setSaving(true); setError(null);
    try {
      await patchMembers(booking.bookingRef, [m]);
      onContinue();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <BookingHeader booking={booking} onEdit={onEdit} />
      <p className="mt-5 eyebrow">Booking</p>
      <h3 className="font-display text-2xl md:text-3xl font-black uppercase">Add Your Details</h3>

      <div className="mt-5 space-y-3">
        <MemberFields member={m} onChange={setField} />
        <AadharUpload
          member={m}
          uploading={uploading}
          onUpload={handleUpload}
        />
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <button onClick={submit} disabled={saving} className="btn-brand mt-5 w-full disabled:opacity-60">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Continue →"}
      </button>
      <button onClick={onBack} className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground">Back</button>
    </div>
  );
}

function StepThreeInner({ booking, onBack, onContinue, onEdit, title }: {
  booking: Booking; onBack: () => void; onContinue: () => void; onEdit?: () => void; title: string;
}) {
  const [members, setMembers] = useState<Member[]>(() => {
    const arr: Member[] = [];
    for (let i = 0; i < booking.groupSize; i++) {
      arr.push(booking.members[i] ?? emptyMember(i === 0));
    }
    return arr;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const setField = (idx: number, k: keyof Member, v: unknown) =>
    setMembers((prev) => prev.map((m, i) => i === idx ? { ...m, [k]: v } as Member : m));

  const setPrimary = (idx: number) =>
    setMembers((prev) => prev.map((m, i) => ({ ...m, isPrimary: i === idx })));

  const handleUpload = async (idx: number, side: "front" | "back", file: File) => {
    const key = `${idx}-${side}`;
    if (file.size > 5 * 1024 * 1024) { setError("Aadhar file must be ≤ 5MB"); return; }
    setUploading((s) => ({ ...s, [key]: true }));
    setError(null);
    try {
      const uploadedKey = await uploadAadhar(booking.bookingRef, side, file);
      setField(idx, side === "front" ? "aadharFrontKey" : "aadharBackKey", uploadedKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading((s) => ({ ...s, [key]: false }));
    }
  };

  const submit = async () => {
    if (!members.some((m) => m.isPrimary)) { setError("Mark one member as primary"); return; }
    setSaving(true); setError(null);
    try {
      await patchMembers(booking.bookingRef, members);
      onContinue();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save members");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <BookingHeader booking={booking} onEdit={onEdit} />
      <h3 className="mt-5 font-display text-2xl md:text-3xl font-black uppercase">{title}</h3>
      <p className="mt-1 eyebrow">{members.length} traveller{members.length > 1 ? "s" : ""}</p>

      <div className="mt-5 space-y-5">
        {members.map((m, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-surface-2/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Member {idx + 1}{m.isPrimary && " · Primary"}</p>
              {!m.isPrimary && (
                <button onClick={() => setPrimary(idx)} className="text-xs text-brand">Make primary</button>
              )}
            </div>
            <MemberFields member={m} onChange={(k, v) => setField(idx, k, v)} />
            <AadharUpload
              member={m}
              uploading={{
                front: !!uploading[`${idx}-front`],
                back: !!uploading[`${idx}-back`],
              }}
              onUpload={(side, file) => handleUpload(idx, side, file)}
            />
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">Back</button>
        <button onClick={submit} disabled={saving} className="btn-brand disabled:opacity-60">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Continue →"}
        </button>
      </div>
    </div>
  );
}

function MemberFields({ member, onChange }: {
  member: Member; onChange: <K extends keyof Member>(k: K, v: Member[K]) => void;
}) {
  return (
    <>
      <Field label="Full Name" value={member.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
      <Field label="Email Address" type="email" value={member.email} onChange={(e) => onChange("email", e.target.value)} />
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <div className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm text-center">+91</div>
        <Field label="Phone Number" value={member.phone} onChange={(e) => onChange("phone", e.target.value)} />
      </div>
      <textarea placeholder="Address" rows={2} value={member.address}
        onChange={(e) => onChange("address", e.target.value)}
        className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Age" type="number" value={member.age || ""} onChange={(e) => onChange("age", Number(e.target.value))} />
        <select value={member.gender} onChange={(e) => onChange("gender", e.target.value as Member["gender"])}
          className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand">
          <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
        </select>
      </div>
    </>
  );
}

function Field({ label, type = "text", ...rest }: { label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      placeholder={label}
      className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand"
      {...rest}
    />
  );
}

function AadharUpload({
  member, uploading, onUpload,
}: {
  member: Member;
  uploading: { front: boolean; back: boolean };
  onUpload: (side: "front" | "back", file: File) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["front", "back"] as const).map((side) => {
        const key = side === "front" ? member.aadharFrontKey : member.aadharBackKey;
        const isUp = uploading[side];
        return (
          <label key={side} className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-surface-2 p-4 text-center hover:border-brand/60 transition block">
            {isUp ? <Loader2 className="h-5 w-5 text-brand mx-auto animate-spin" /> : key ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <Upload className="h-5 w-5 text-brand mx-auto" />}
            <p className="mt-2 text-xs font-semibold capitalize">Aadhar {side}</p>
            <p className="text-[10px] text-muted-foreground">{key ? "Uploaded" : "JPG/PNG ≤5MB"}</p>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(side, f);
                e.target.value = "";
              }}
            />
          </label>
        );
      })}
    </div>
  );
}

/* --------------- Step 4 --------------- */

function StepFour({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const [current, setCurrent] = useState<Booking>(booking);
  const [coupon, setCoupon] = useState(current.coupon?.code ?? "");
  const [couponMsg, setCouponMsg] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const totals = useMemo(() => ({
    base: Number(current.baseAmount),
    discount: Number(current.discountAmount),
    gst: Number(current.gstAmount),
    total: Number(current.totalAmount),
  }), [current]);

  const apply = async () => {
    if (!coupon.trim()) return;
    setApplying(true); setCouponMsg(null);
    try {
      const next = await applyCoupon(current.bookingRef, coupon.trim());
      setCurrent(next);
      setCouponMsg({ type: "ok", msg: `Coupon applied — you save ₹${Number(next.discountAmount).toLocaleString("en-IN")}` });
    } catch (e) {
      setCouponMsg({ type: "err", msg: e instanceof ApiError ? e.message : "Coupon invalid" });
    } finally {
      setApplying(false);
    }
  };

  const pay = async () => {
    setPaying(true); setPayError(null);
    try {
      const { paymentSessionId } = await checkoutBooking(current.bookingRef);
      const returnUrl = `${window.location.origin}/booking/${current.bookingRef}/status`;
      await openCashfree(paymentSessionId, returnUrl);
    } catch (e) {
      setPayError(e instanceof ApiError ? e.message : "Payment failed to start");
      setPaying(false);
    }
  };

  return (
    <div>
      <BookingHeader booking={current} />
      <h3 className="mt-5 font-display text-2xl md:text-3xl font-black uppercase">Review & Pay</h3>

      <div className="mt-5 rounded-xl border border-border bg-surface-2 p-4">
        <p className="eyebrow">Sharing</p>
        <p className="mt-1 text-sm font-semibold">{sharingLabel(current.sharingType.kind)} · ₹{Number(current.sharingType.price).toLocaleString("en-IN")}/person</p>
        <p className="mt-1 text-xs text-muted-foreground">{current.groupSize} traveller{current.groupSize > 1 ? "s" : ""}</p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
        <p className="eyebrow">Apply Coupon Code</p>
        <div className="mt-3 flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 rounded-xl bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button onClick={apply} disabled={applying} className="btn-brand !py-2 !px-5 disabled:opacity-60">
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
        </div>
        {couponMsg && (
          <p className={"mt-3 text-sm " + (couponMsg.type === "ok" ? "text-emerald-500" : "text-destructive")}>
            {couponMsg.msg}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between"><span>Base Amount</span><span>₹{totals.base.toLocaleString("en-IN")}</span></div>
        {totals.discount > 0 && (
          <div className="flex justify-between"><span>Discount</span><span className="text-emerald-500">-₹{totals.discount.toLocaleString("en-IN")}</span></div>
        )}
        {totals.gst > 0 && (
          <div className="flex justify-between"><span>GST</span><span>₹{totals.gst.toLocaleString("en-IN")}</span></div>
        )}
        <div className="pt-3 border-t border-border flex justify-between font-bold text-base">
          <span>Total Payable</span><span className="text-brand">₹{totals.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {payError && <p className="mt-3 text-sm text-destructive">{payError}</p>}

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">Back</button>
        <button onClick={pay} disabled={paying} className="btn-brand disabled:opacity-60">
          {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening...</> : <><ArrowRight className="h-4 w-4" /> Complete Booking</>}
        </button>
      </div>
    </div>
  );
}

// keep imports referenced (silences unused warnings for optional icons/types)
void User; void Users; void SharingType satisfies unknown as never;
export type { SharingKind };
