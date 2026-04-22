import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, slug, summary, content, coverImage, published, images } = data;

    const post = await prisma.blog.create({
      data: {
        title,
        slug,
        summary,
        content,
        coverImage,
        published,
        images: {
          create: images.map((img: { url: string }) => ({ url: img.url })),
        },
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
