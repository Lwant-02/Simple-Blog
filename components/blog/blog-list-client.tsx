"use client";

import { BlogCard } from "@/components/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Lock } from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogCardProps } from "@/types";

export default function BlogListClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [blogs, setBlogs] = useState<BlogCardProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/blogs?page=${currentPage}&query=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        if (data.blogs) {
          setBlogs(data.blogs);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, [currentPage, query]);

  useEffect(() => {
    if (searchInput === "" && query !== "") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("query");
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [searchInput, query, pathname, router, searchParams]);

  const handleSearch = (e: React.ChangeEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmedInput = searchInput.trim();
    if (trimmedInput) {
      params.set("query", trimmedInput);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container max-w-8xl mx-auto px-4 py-12 md:py-20 grow">
      <div className="flex justify-end mb-8 md:mb-0">
        <Link href="/admin/login">
          <Button
            variant="ghost"
            className="rounded-full cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </Link>
      </div>
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
          Thoughts & <span className="text-primary">Insights</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our latest articles, tutorials, and stories.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="pl-12 pr-24 h-14 rounded-full text-base shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            className="absolute cursor-pointer right-2 rounded-full h-10 px-6 font-medium"
          >
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-16">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                slug={blog.slug}
                summary={blog.summary}
                coverImage={blog.coverImage}
                createdAt={blog.createdAt}
                viewCount={blog.viewCount}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      currentPage > 1
                        ? `/?page=${currentPage - 1}${query ? `&query=${query}` : ""}`
                        : "#"
                    }
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`/?page=${i + 1}${query ? `&query=${query}` : ""}`}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={
                      currentPage < totalPages
                        ? `/?page=${currentPage + 1}${query ? `&query=${query}` : ""}`
                        : "#"
                    }
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query.
          </p>
        </div>
      )}
    </div>
  );
}
