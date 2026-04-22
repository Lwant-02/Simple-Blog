import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Check, X, CircleUserRound, MessageSquare } from "lucide-react";
import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Admin - Comments",
  description: "Manage your blog articles and drafts.",
};

export default async function CommentsModerationPage() {
  const pendingComments = await prisma.comment.findMany({
    where: { isApproved: false },
    include: { blog: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Comment Moderation
        </h1>
        <p className="text-muted-foreground">
          Approve or reject pending comments from your readers.
        </p>
      </div>

      <Card className="shadow-sm border-muted-foreground/10 overflow-hidden p-0 m-0">
        <CardHeader className="bg-muted/50 p-3">
          <CardTitle>Inbox ({pendingComments.length})</CardTitle>
          <CardDescription>
            {pendingComments.length > 0
              ? "You have new comments awaiting your review."
              : "Your inbox is clear! No pending comments."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-muted-foreground/10">
            {pendingComments.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium text-lg">
                  No pending comments
                </p>
                <p className="text-muted-foreground/60">
                  Everything is up to date.
                </p>
              </div>
            ) : (
              pendingComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-6 group hover:bg-muted/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="shrink-0">
                      <CircleUserRound className="size-8 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-lg">
                          {comment.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "PPP p")}
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                          On: {comment.blog.title}
                        </span>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-xl border border-muted-foreground/5 italic text-foreground/80 leading-relaxed">
                        "{comment.content}"
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 shrink-0 pt-1">
                      <form
                        action={async () => {
                          "use server";
                          await prisma.comment.update({
                            where: { id: comment.id },
                            data: { isApproved: true },
                          });
                          revalidatePath("/admin/comments");
                        }}
                      >
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 h-10 px-4 rounded-full"
                        >
                          <Check className="mr-2 h-4 w-4" /> Approve
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await prisma.comment.delete({
                            where: { id: comment.id },
                          });
                          revalidatePath("/admin/comments");
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10 px-4 rounded-full"
                        >
                          <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
