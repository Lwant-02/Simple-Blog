"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CommentForm } from "@/components/comment-form";
import { ImageGallery } from "@/components/image-gallery";
import {
  ArrowLeft,
  Eye,
  Calendar,
  CircleUserRound,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BlogDetail } from "@/types";
import Image from "next/image";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasIncremented = useRef(false);

  useEffect(() => {
    async function incrementView() {
      if (hasIncremented.current) return;
      hasIncremented.current = true;
      try {
        await fetch(`/api/blogs/${slug}`, { method: "PATCH" });
      } catch (err) {
        console.error("Failed to increment view:", err);
      }
    }

    if (slug) {
      incrementView();
    }
  }, [slug]);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBlog(data.blog);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] grow">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] grow">
        <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-20">
      <div className="container max-w-4xl mx-auto py-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to articles
        </Link>
      </div>

      <header className="container max-w-4xl mx-auto mb-10">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <time>{format(new Date(blog.createdAt), "MMMM d, yyyy")}</time>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <Badge
            variant="secondary"
            className="font-normal rounded-full px-3 py-1 bg-secondary/50"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {blog.viewCount} views
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
          {blog.title}
        </h1>
      </header>

      <div className="w-full mb-16">
        <div className="relative aspect-video md:aspect-21/9 max-w-4xl mx-auto overflow-hidden bg-muted shadow-lg">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No cover image
            </div>
          )}
        </div>
      </div>

      <div className="container max-w-4xl mx-auto">
        <div
          className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <Separator className="my-12" />

        <ImageGallery images={blog.images} />

        <Separator className="my-12" />

        <section id="comments" className="scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8">
            Comments ({blog.comments.length})
          </h2>

          <div className="space-y-8 mb-12">
            {blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <CircleUserRound className="size-8 text-muted-foreground shrink-0" />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">
                        {comment.senderName}
                      </span>
                      <time className="text-sm text-muted-foreground">
                        {format(new Date(comment.createdAt), "MMM d, yyyy")}
                      </time>
                    </div>
                    <p className="text-foreground/90">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-6 border rounded-xl bg-muted/20 border-dashed">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>

          <CommentForm blogId={blog.id} />
        </section>
      </div>
    </article>
  );
}
