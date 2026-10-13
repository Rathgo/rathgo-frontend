import { Phone, Mail, MapPin } from "lucide-react";
import rathgoLogo from "@/assets/rathgo-mark.png.asset.json";
import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-14 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <img src={rathgoLogo.url} alt="Rathgo" className="h-16 w-auto md:h-20" />
            <div className="leading-none min-w-0">
              <p className="font-display text-3xl font-black tracking-[0.15em] text-foreground md:text-4xl">RATHGO</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-foreground/70 md:text-[10px]">
                A unit of Chetan Tours Solution Pvt. Ltd.
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
            <li className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-brand shrink-0" /> +91 8750505497</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-brand shrink-0" /> rathgo.travel@gmail.com</li>
            <li className="flex items-start gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" /> C-17/3, Shiv Shakti Apartment, Sector 71, Noida, Uttar Pradesh 201301</li>
          </ul>
          <SocialLinks />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 text-center text-xs text-muted-foreground">
          © {year} Rathgo, a unit of Chetan Tours Solution Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
