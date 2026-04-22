import prisma from "@/lib/prisma";
import { PostForm } from "@/components/admin/post-form";
import { BlogWithImages } from "@/types";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const isEdit = id !== "new";

  const post = await prisma.blog.findUnique({
    where: { id },
  });

  return {
    title: isEdit ? `Edit Post: ${post?.title}` : "Create Post",
    description: isEdit ? post?.summary : "Create a new article.",
  };
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const isEdit = id !== "new";
  const title = isEdit ? "Edit Post" : "Create Post";
  const description = isEdit
    ? "Update the content or status of your existing article."
    : "Create a new article.";
  let postData: BlogWithImages | null = null;

  if (isEdit && !postData) {
    postData = await prisma.blog.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  return (
    <div className="space-y-6 max-w-6xl w-full mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <PostForm initialData={postData} isEdit={isEdit} />
    </div>
  );
}
