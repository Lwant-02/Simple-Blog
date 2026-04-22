import BlogListClient from "@/components/blog/blog-list-client";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <BlogListClient />
    </Suspense>
  );
}
