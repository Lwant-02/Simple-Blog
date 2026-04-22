import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const commentSchema = z.object({
  senderName: z.string().min(2).max(50),
  content: z.string().min(10).max(500).regex(/^[ก-๙0-9\s]+$/),
  blogId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = commentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        senderName: validatedData.senderName,
        content: validatedData.content,
        blogId: validatedData.blogId,
        isApproved: false,
      },
    });

    revalidatePath("/admin/dashboard/comments");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("Failed to post comment:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
