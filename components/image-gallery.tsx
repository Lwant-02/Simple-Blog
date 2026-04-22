import { BlogImage } from "@/types";
import Image from "next/image";

export function ImageGallery({ images }: { images: BlogImage[] }) {
  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 6);

  return (
    <div className="my-10">
      <h3 className="text-2xl font-bold mb-6">Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((img, idx) => (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-xl bg-muted group cursor-pointer"
          >
            <Image
              src={img.url}
              alt={`Gallery image ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
