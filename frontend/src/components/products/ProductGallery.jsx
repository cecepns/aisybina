import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images = [] }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square rounded-2xl bg-cream-100 border border-gold-200 flex items-center justify-center">
        <span className="text-slate-400 text-sm">No image</span>
      </div>
    );
  }

  const current = images[active] || images[0];
  const hasMany = images.length > 1;

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-gold-200">
        <img
          src={current.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow text-slate-700 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow text-slate-700 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full bg-black/50 text-white">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {hasMany && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? "border-gold-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
