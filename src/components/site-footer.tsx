import { Phone, Mail, MapPin } from "lucide-react";
import rathgoLogo from "@/assets/rathgo_logo.jpg";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-14 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <img src={rathgoLogo} alt="Rathgo" className="h-12 w-auto rounded bg-white p-1" />
            <div className="leading-none">
              <p className="font-display text-3xl font-black tracking-[0.15em] text-foreground">RATHGO</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                A unit of Chetan Tours Solution
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Curated batch trips across the Himalayas for solo travellers and couples. Meet new people, share the road,
            and create memories that last a lifetime.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold text-foreground">Contact Us</h4>
          <div className="mt-2 h-0.5 w-10 bg-brand rounded-full" />
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-brand" /> +91 8750505497</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-brand" /> rathgo.travel@gmail.com</li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-brand" /> C-17/3, Shiv Shakti Apartment, Sector 71, Noida, Uttar Pradesh 201301</li>
          </ul>
          <div className="mt-6 flex gap-2 text-[11px] uppercase tracking-[0.2em]">
            <a href="#" className="chip">Instagram</a>
            <a href="#" className="chip">Youtube</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 text-center text-xs text-muted-foreground">
          © 2026 Rathgo, a unit of Chetan Tours Solution. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
