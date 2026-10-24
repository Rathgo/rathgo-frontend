import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Story, StoryCategory } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: Story }) {
  const [imageIndex, setImageIndex] = useState(0);
  const categoryLabel: Record<StoryCategory, string> = {
    solo: "SOLO",
    couple: "COUPLE",
    group: "GROUP",
  };
  const galleryImages = testimonial.images ?? [];
  const coverImage =
    testimonial.coverImageUrl &&
    !galleryImages.some(
      (image) =>
        image.imageKey === testimonial.coverImageKey ||
        image.imageUrl === testimonial.coverImageUrl
    )
      ? [{ id: -1, imageUrl: testimonial.coverImageUrl, altText: null }]
      : [];
  const images = [...coverImage, ...galleryImages];
  const activeImage = images.length > 0 ? imageIndex % images.length : 0;

  useEffect(() => {
    setImageIndex(0);
    if (images.length < 2) return;

    const intervalId = window.setInterval(() => {
      setImageIndex((index) => (index + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [testimonial.id, images.length]);

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden bg-surface">
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        {images.length > 0 && (
          <>
            <div
              className="flex h-full w-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeImage * 100}%)` }}
            >
              {images.map((image) => (
                <div key={image.id} className="h-full min-w-full">
                  <img
                    src={image.imageUrl}
                    alt={image.altText ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setImageIndex((activeImage - 1 + images.length) % images.length)}
                  aria-label="Previous testimonial image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white hover:bg-black/75"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageIndex((activeImage + 1) % images.length)}
                  aria-label="Next testimonial image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white hover:bg-black/75"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      aria-label={`Show testimonial image ${index + 1}`}
                      aria-current={index === activeImage}
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === activeImage ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        {testimonial.tripLabel && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] uppercase tracking-widest text-brand-foreground">
            {testimonial.tripLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="min-h-12 line-clamp-2 font-display text-xl font-black uppercase leading-tight">
          {testimonial.title}
        </h3>
        <p
          tabIndex={0}
          aria-label="Testimonial content"
          className="mt-3 h-24 shrink-0 overflow-y-auto text-sm text-muted-foreground"
        >
          {testimonial.content}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-3">
            {testimonial.travellerAvatarUrl ? (
              <img
                src={testimonial.travellerAvatarUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                {testimonial.travellerName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{testimonial.travellerName}</p>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground">
                {categoryLabel[testimonial.category]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-brand">
            {[...Array(Math.round(Number(testimonial.rating)))].map((_, index) => (
              <Star key={index} className="h-3 w-3 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
