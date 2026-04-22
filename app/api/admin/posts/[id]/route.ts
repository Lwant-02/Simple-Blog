import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { title, slug, summary, content, coverImage, published, images } =
      data;

    await prisma.$transaction([
      prisma.blogImage.deleteMany({
        where: { blogId: id },
      }),
      prisma.blog.update({
        where: { id },
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
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.blog.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
