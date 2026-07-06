import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import s1 from "@/assets/story-1.jpg";
import s2 from "@/assets/story-2.jpg";
import s3 from "@/assets/story-3.jpg";
import s4 from "@/assets/story-4.jpg";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({ meta: [{ title: "Gallery — RATHGO" }] }),
});

const imgs = [g1, g3, g5, s1, g2, s2, g4, s3, g6, s4];

function Gallery() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />
      <div className="h-40" />
      <section className="py-10">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Photo Gallery</span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-black uppercase">Frames from the Road</h1>
          </div>
          <div className="mt-10 columns-2 md:columns-3 gap-4 [&>*]:mb-4">
            {imgs.map((src, i) => (
              <img key={i} src={src} alt="" loading="lazy" className="w-full rounded-2xl object-cover" />
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
