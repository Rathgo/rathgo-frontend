import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-black tracking-[0.15em]">RATHGO</p>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Curated batch trips across the Himalayas for solo travellers and couples. Meet new people, share the road,
            and create memories that last a lifetime.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Contact Us</h4>
          <div className="mt-2 h-0.5 w-10 bg-brand rounded-full" />
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-brand" /> +91 98765 43210</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-brand" /> info@rathgo.com</li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-brand" /> Mall Road, Manali, Himachal Pradesh</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Subscribe our newsletter for more updates & news !!</h4>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 rounded-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-brand"
            />
            <button className="btn-brand">Subscribe</button>
          </form>
          <div className="mt-4 flex gap-2 text-[11px] uppercase tracking-[0.2em]">
            <span className="chip">Instagram</span>
            <span className="chip">Facebook</span>
            <span className="chip">Youtube</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 RATHGO. All rights reserved</p>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/" className="hover:text-foreground">Term & Condition</Link>
            <Link to="/" className="hover:text-foreground">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
