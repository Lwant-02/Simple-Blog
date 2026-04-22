import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: resolvedParams.slug, published: true },
      include: {
        images: true,
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog details" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;

  try {
    await prisma.blog.update({
      where: { slug: resolvedParams.slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
