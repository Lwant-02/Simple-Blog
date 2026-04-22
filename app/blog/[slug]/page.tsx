import { Metadata } from "next";
import BlogDetailPage from "@/components/blog/blog-detail-page";
import prisma from "@/lib/prisma";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
  });

  if (!blog)
    return {
      title: "Blog UI - Clean & Modern",
      description:
        "A minimal and responsive blog UI built with Next.js and Tailwind CSS",
    } as Metadata;

  return {
    title: blog.title,
    description: blog.summary,
  } as Metadata;
};

export default function Page() {
  return <BlogDetailPage />;
}
