import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check, Mountain, Snowflake, MapPin, Landmark, ArrowRight,
  Upload, Pencil, User, Users, Plus, Minus, Calendar, ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { bySlug } from "@/lib/destinations";
import heroImg from "@/assets/hero-manali.jpg";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const dest = bySlug(params.slug);
    if (!dest) throw notFound();
    return { dest };
  },
  component: DestinationDetail,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.dest.name ?? "Destination"} — RATHGO Batch Trip` },
      { name: "description", content: loaderData?.dest.description ?? "" },
    ],
  }),
});

const itinerary = [
  { day: "Day 1 — Arrival in Manali", body: "Check-in, welcome meet, and a relaxed evening walk through Old Manali." },
  { day: "Day 2 — Solang Valley Adventure", body: "Snow activities, scenic viewpoints, and a shared bonfire night." },
  { day: "Day 3 — Rohtang Pass Excursion", body: "High-altitude landscapes, photo stops, and a full day of exploration." },
  { day: "Day 4 — Temple & Café Trail", body: "Hadimba Temple, local cafés, and time to connect with the group." },
  { day: "Day 5 — Departure", body: "Breakfast, goodbyes, and departure with new friends and memories." },
];

const included = ["Accommodation", "Meals", "Transport", "Trek Guide", "Bonfire Nights"];

const highlights = [
  { icon: Mountain, title: "Rohtang Pass", body: "Snowy panoramas and unforgettable mountain views." },
  { icon: Snowflake, title: "Solang Valley", body: "Adventure sports and wide-open alpine scenery." },
  { icon: MapPin, title: "Old Manali Walk", body: "Cafés, lanes, and a laid-back local vibe." },
  { icon: Landmark, title: "Hadimba Temple", body: "A serene cultural stop surrounded by cedar forests." },
];

const batches = [
  { dates: "4 Jun – 8 Jun 2025", seats: "12 seats available", status: "available", price: 8999 },
  { dates: "14 Jun – 19 Jun 2025", seats: "6 seats left — Limited", status: "limited", price: 8999 },
  { dates: "28 Jun – 2 Jul 2025", seats: "Available", status: "available", price: 8999 },
  { dates: "12 Jul – 16 Jul 2025", seats: "Available", status: "available", price: 8999 },
];

function DestinationDetail() {
  const { dest } = Route.useLoaderData();
  const [step, setStep] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState(0);
  const [travelType, setTravelType] = useState<"solo" | "group">("solo");
  const [groupSize, setGroupSize] = useState(3);
  const [room, setRoom] = useState<"double" | "triple" | "quad">("double");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const roomPrices = { double: 8999, triple: 7499, quad: 6499 };
  const base = roomPrices[room];
  const discount = couponApplied ? 500 : 0;
  const total = base - discount;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px]">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        <div className="container-page relative z-10 h-full flex flex-col justify-end pb-8 pt-28">
          <div className="text-xs text-white/70 flex items-center gap-2">
            <Link to="/" className="hover:text-white">Home</Link> <ChevronRight className="h-3 w-3" />
            <Link to="/destinations" className="hover:text-white">Destination</Link> <ChevronRight className="h-3 w-3" />
            <span className="text-white">{dest.name}</span>
          </div>
          <h1 className="mt-4 font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase text-white leading-none">
            {dest.name}
          </h1>
          <p className="mt-2 eyebrow text-brand">{dest.state}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="chip !bg-black/40">{dest.days}</span>
            <span className="chip !bg-black/40">Starting ₹{dest.price.toLocaleString("en-IN")}</span>
            <span className="chip !bg-black/40">Solo & Couple</span>
            <span className="chip !bg-black/40">{dest.rating}★ Rating</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left column */}
          <div className="space-y-6">
            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">About This Trip</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">A Curated {dest.name} Batch Journey</h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Join RATHGO's {dest.name} batch trip for a balanced mix of adventure, scenic drives, and easygoing social moments.
                Designed for solo travellers and couples, this trip brings together like-minded explorers for a memorable Himalayan
                escape with comfortable stays, local experiences, and plenty of time to unwind.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">Itinerary</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">5 Days of Mountain Moments</h2>
              <div className="mt-5 space-y-3">
                {itinerary.map((it) => (
                  <div key={it.day} className="rounded-xl bg-surface-2 border border-border p-4">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-foreground">{it.day}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">What's Included</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">Everything You Need for the Trip</h2>
              <div className="mt-5 space-y-2">
                {included.map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-surface-2 border border-border px-4 py-3">
                    <Check className="h-4 w-4 text-brand shrink-0" />
                    <span className="text-sm">{i}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">Trip Highlights</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase">Top Experiences in {dest.name}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div key={h.title} className="rounded-xl bg-surface-2 border border-border p-4">
                    <h.icon className="h-5 w-5 text-brand" />
                    <p className="mt-2 text-xs font-bold tracking-[0.18em] uppercase">{h.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{h.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: booking */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="surface-card p-6 md:p-7">
              <StepTracker step={step} />

              {step === 1 && (
                <StepOne
                  batches={batches}
                  selected={selectedBatch}
                  onSelect={setSelectedBatch}
                  onContinue={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <StepTwo
                  batch={batches[selectedBatch]}
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                  onEdit={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepThree
                  batch={batches[selectedBatch]}
                  travelType={travelType}
                  setTravelType={setTravelType}
                  groupSize={groupSize}
                  setGroupSize={setGroupSize}
                  onBack={() => setStep(2)}
                  onContinue={() => setStep(4)}
                />
              )}
              {step === 4 && (
                <StepFour
                  batch={batches[selectedBatch]}
                  room={room}
                  setRoom={setRoom}
                  coupon={coupon}
                  setCoupon={setCoupon}
                  couponApplied={couponApplied}
                  applyCoupon={() => setCouponApplied(true)}
                  base={base}
                  discount={discount}
                  total={total}
                  onBack={() => setStep(3)}
                />
              )}
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ---------- Step components ---------- */

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

type Batch = (typeof batches)[number];

function StepOne({
  batches, selected, onSelect, onContinue,
}: { batches: Batch[]; selected: number; onSelect: (n: number) => void; onContinue: () => void }) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-2xl md:text-3xl font-black uppercase">Choose Your Batch</h3>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">Manali — 5 Days / 4 Nights</p>

      <div className="mt-5 space-y-3">
        {batches.map((b, i) => {
          const active = i === selected;
          return (
            <button
              key={b.dates}
              onClick={() => onSelect(i)}
              className={
                "w-full text-left rounded-xl border p-4 transition grid grid-cols-[1fr_auto] gap-2 " +
                (active
                  ? "border-brand bg-brand/10"
                  : "border-border bg-surface-2 hover:border-brand/40")
              }
            >
              <div>
                <p className="text-sm font-bold">{b.dates}</p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className={"h-1.5 w-1.5 rounded-full " + (b.status === "limited" ? "bg-orange-400" : "bg-emerald-400")} />
                  {b.seats}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Per Person</p>
                <p className="font-bold">₹{b.price.toLocaleString("en-IN")}</p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">Prices are per person. GST applicable at checkout.</p>

      <button onClick={onContinue} className="btn-brand mt-5 w-full">Continue →</button>
      <button className="btn-ghost-pill mt-2 w-full">Enquire Now</button>
    </div>
  );
}

function BookingHeader({ batch, onEdit }: { batch: Batch; onEdit?: () => void }) {
  return (
    <div className="mt-6 rounded-xl bg-surface-2 border border-border px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-[0.15em] uppercase truncate">{batch.dates}</p>
        <p className="text-xs text-muted-foreground">₹{batch.price.toLocaleString("en-IN")}/person</p>
      </div>
      {onEdit && (
        <button onClick={onEdit} aria-label="Edit batch" className="shrink-0 text-brand">
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
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

function StepTwo({ batch, onBack, onContinue, onEdit }: { batch: Batch; onBack: () => void; onContinue: () => void; onEdit: () => void }) {
  return (
    <div>
      <BookingHeader batch={batch} onEdit={onEdit} />
      <p className="mt-5 eyebrow">Booking</p>
      <h3 className="font-display text-2xl md:text-3xl font-black uppercase">Add Your Details</h3>

      <div className="mt-5 space-y-3">
        <Field label="Full Name" />
        <Field label="Email Address" type="email" />
        <div className="relative">
          <Field label="Password" type="password" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand">Show</span>
        </div>
        <div className="grid grid-cols-[80px_1fr] gap-2">
          <div className="rounded-xl bg-surface-2 border border-border px-3 py-3 text-sm text-center">+91</div>
          <Field label="Phone Number" />
        </div>
        <textarea placeholder="Address" rows={2} className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand" />
        <Field label="Age" type="number" />
        <select className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand">
          <option>Gender</option><option>Male</option><option>Female</option><option>Other</option>
        </select>

        <div className="rounded-xl border-2 border-dashed border-border bg-surface-2 p-5 text-center">
          <Upload className="h-5 w-5 text-brand mx-auto" />
          <p className="mt-2 text-sm font-semibold">Upload Aadhar Card (front & back)</p>
          <p className="text-xs text-muted-foreground">JPG/PNG up to 5MB</p>
        </div>

        <Field label="Booking Referred By" />
        <select className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-brand">
          <option>How Did You Hear About Us</option><option>Instagram</option><option>Friend</option><option>Google</option>
        </select>
      </div>

      <button onClick={onContinue} className="btn-brand mt-5 w-full">Continue →</button>
      <button onClick={onBack} className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground">Back</button>
    </div>
  );
}

function StepThree({
  batch, travelType, setTravelType, groupSize, setGroupSize, onBack, onContinue,
}: {
  batch: Batch;
  travelType: "solo" | "group";
  setTravelType: (v: "solo" | "group") => void;
  groupSize: number;
  setGroupSize: (n: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <BookingHeader batch={batch} />

      <h3 className="mt-5 font-display text-2xl md:text-3xl font-black uppercase">Are You Travelling Solo or with Others?</h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setTravelType("solo")}
          className={
            "rounded-xl border p-4 text-left transition " +
            (travelType === "solo" ? "border-brand bg-brand/10" : "border-border bg-surface-2 hover:border-brand/40")
          }
        >
          <User className="h-4 w-4 text-brand" />
          <p className="mt-2 text-sm font-bold uppercase tracking-wide">Solo</p>
          <p className="mt-1 text-xs text-muted-foreground">Just me — I'll meet my batch on the trip</p>
        </button>
        <button
          onClick={() => setTravelType("group")}
          className={
            "rounded-xl border p-4 text-left transition " +
            (travelType === "group" ? "border-brand bg-brand/10" : "border-border bg-surface-2 hover:border-brand/40")
          }
        >
          <Users className="h-4 w-4 text-brand" />
          <p className="mt-2 text-sm font-bold uppercase tracking-wide">Group / Couple</p>
          <p className="mt-1 text-xs text-muted-foreground">I'm coming with friends, partner, or family</p>
        </button>
      </div>

      {travelType === "group" && (
        <>
          <p className="mt-5 eyebrow">How Many in Your Group?</p>
          <div className="mt-3 flex items-center gap-4">
            <button onClick={() => setGroupSize(Math.max(2, groupSize - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 border border-border"><Minus className="h-4 w-4" /></button>
            <span className="text-lg font-bold w-8 text-center">{groupSize}</span>
            <button onClick={() => setGroupSize(groupSize + 1)} className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 border border-border"><Plus className="h-4 w-4" /></button>
          </div>

          <div className="mt-5 rounded-xl border border-brand/40 bg-brand/5 p-4 space-y-3">
            <p className="eyebrow">Member 2</p>
            <Field label="Full Name" />
            <Field label="Age" />
            <select className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-sm"><option>Gender</option></select>
            <Field label="Phone" />
            <Field label="Email" />
            <textarea placeholder="Address" rows={2} className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-sm" />
            <button className="btn-ghost-pill w-full !border-brand/40 !text-brand">Aadhar Card Photo Upload</button>
          </div>
        </>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">Back</button>
        <button onClick={onContinue} className="btn-brand">Continue →</button>
      </div>
    </div>
  );
}

function StepFour({
  batch, room, setRoom, coupon, setCoupon, couponApplied, applyCoupon, base, discount, total, onBack,
}: {
  batch: Batch;
  room: "double" | "triple" | "quad";
  setRoom: (r: "double" | "triple" | "quad") => void;
  coupon: string; setCoupon: (s: string) => void;
  couponApplied: boolean; applyCoupon: () => void;
  base: number; discount: number; total: number;
  onBack: () => void;
}) {
  const rooms = [
    { key: "double" as const, title: "Double Sharing", body: "Best for couples or close travel partners", price: 8999 },
    { key: "triple" as const, title: "Triple Sharing", body: "Balanced comfort with lower per-person cost", price: 7499 },
    { key: "quad" as const, title: "Quad Sharing", body: "Most economical option for group travelers", price: 6499 },
  ];

  return (
    <div>
      <BookingHeader batch={batch} />
      <h3 className="mt-5 font-display text-2xl md:text-3xl font-black uppercase">Select Room Sharing & Final Payment</h3>
      <p className="mt-1 eyebrow">Choose Your Room</p>

      <div className="mt-4 space-y-3">
        {rooms.map((r) => {
          const active = r.key === room;
          return (
            <button
              key={r.key}
              onClick={() => setRoom(r.key)}
              className={
                "w-full text-left rounded-xl border p-4 grid grid-cols-[1fr_auto] gap-2 transition " +
                (active ? "border-brand bg-brand/10" : "border-border bg-surface-2 hover:border-brand/40")
              }
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.body}</p>
              </div>
              <p className={"font-bold self-center " + (active ? "text-brand" : "")}>₹{r.price.toLocaleString("en-IN")}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface-2 p-4">
        <p className="eyebrow">Apply Coupon Code</p>
        <div className="mt-3 flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 rounded-xl bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button onClick={applyCoupon} className="btn-brand !py-2 !px-5">Apply</button>
        </div>
        {couponApplied && (
          <p className="mt-3 flex items-center justify-between text-sm">
            <span>Coupon Applied</span><span className="text-emerald-400 font-semibold">-₹500</span>
          </p>
        )}
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between"><span>Base Amount</span><span>₹{base.toLocaleString("en-IN")}</span></div>
        {discount > 0 && <div className="flex justify-between"><span>Discount</span><span className="text-emerald-400">-₹{discount}</span></div>}
        <div className="pt-3 border-t border-border flex justify-between font-bold text-base">
          <span>Total Payable</span><span className="text-brand">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">Back</button>
        <button className="btn-brand"><ArrowRight className="h-4 w-4" /> Complete Booking</button>
      </div>
    </div>
  );
}
