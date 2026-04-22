import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BlogCardProps } from "@/types";
import Image from "next/image";

export function BlogCard({
  title,
  slug,
  summary,
  coverImage,
  createdAt,
  viewCount,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 flex flex-col cursor-pointer p-0 gap-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <time className="text-xs text-muted-foreground font-medium">
              {format(new Date(createdAt), "MMM d, yyyy")}
            </time>
            <Badge
              variant="secondary"
              className="text-[10px] font-normal px-2 py-0"
            >
              {viewCount} views
            </Badge>
          </div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>

        <CardContent className="p-5 pt-0 grow">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
